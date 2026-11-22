import api from './api.js';
import {
  PRODUCTS,
  getAllProducts as getAllProductsLocal,
  getProductByIdOrSlug as getProductByIdOrSlugLocal,
  getFeaturedProducts as getFeaturedProductsLocal,
  getCustomizableProducts as getCustomizableProductsLocal,
  getUniqueCategories as getUniqueCategoriesLocal,
  getUniqueRoomTypes as getUniqueRoomTypesLocal,
  getUniqueMaterials as getUniqueMaterialsLocal,
  getPriceBounds as getPriceBoundsLocal,
} from '../data/products.js';
import { calculateConfiguredPrice as calculateConfiguredPriceLocal } from '../utils/pricingEngine.js';

/**
 * Checks if an error is a genuine network connection failure / timeout,
 * rather than an HTTP response error (400, 404, 500, etc.).
 */
function isNetworkFailure(error) {
  return !error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED';
}

/**
 * Centralized Product Service Adapter for Décora.
 * Connects the React client to Express/MongoDB REST endpoints under /api/v1/products.
 */
export const productService = {
  /**
   * Retrieves paginated, sorted, and filtered products from the backend.
   * Restricts fallback to genuine network failures only.
   * 
   * @param {Object} params - Query filters { category, room, roomType, style, minPrice, maxPrice, search, q, customizable, featured, inStock, material, sort, page, limit }
   * @returns {Promise<{ products: Array, pagination: Object, filters: Object, isFallback: boolean }>}
   */
  async getProducts(params = {}) {
    const cleanParams = {};

    // 1. Sanitize and serialize query parameters according to backend validators
    if (params.page !== undefined && params.page !== null) {
      cleanParams.page = Math.max(1, Number(params.page) || 1);
    }
    if (params.limit !== undefined && params.limit !== null) {
      cleanParams.limit = Math.min(48, Math.max(1, Number(params.limit) || 12));
    }

    if (params.category && params.category !== 'all' && params.category !== 'All') {
      cleanParams.category = params.category;
    }

    const room = params.room || params.roomType;
    if (room && room !== 'all' && room !== 'All') {
      cleanParams.roomType = room.toLowerCase();
    }

    if (params.style && params.style !== 'all' && params.style !== 'All') {
      cleanParams.style = params.style;
    }

    const searchQuery = params.search || params.q;
    if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim()) {
      cleanParams.search = searchQuery.trim();
    }

    if (params.minPrice !== undefined && params.minPrice !== null && params.minPrice !== '') {
      cleanParams.minPrice = Number(params.minPrice);
    }
    if (params.maxPrice !== undefined && params.maxPrice !== null && params.maxPrice !== '') {
      cleanParams.maxPrice = Number(params.maxPrice);
    }

    if (params.customizable !== undefined && params.customizable !== null) {
      cleanParams.customizable = Boolean(params.customizable);
    }
    if (params.featured !== undefined && params.featured !== null) {
      cleanParams.featured = Boolean(params.featured);
    }
    if (params.inStock !== undefined && params.inStock !== null) {
      cleanParams.inStock = Boolean(params.inStock);
    }

    if (params.material) {
      cleanParams.material = params.material;
    }

    if (params.sort) {
      cleanParams.sort = params.sort;
    }

    try {
      const response = await api.get('/products', { params: cleanParams });
      const payload = response.data;

      return {
        products: payload.data || [],
        pagination: payload.pagination || {
          total: (payload.data || []).length,
          page: cleanParams.page || 1,
          limit: cleanParams.limit || 12,
          pages: Math.ceil(((payload.data || []).length) / (cleanParams.limit || 12)),
        },
        filters: payload.filters || null,
        isFallback: false,
      };
    } catch (error) {
      // Controlled fallback strictly for genuine network/connectivity outages
      if (isNetworkFailure(error)) {
        console.warn('[ProductService] Backend API unreachable. Serving controlled local fallback data.');
        return this.getLocalFilteredProducts(cleanParams);
      }
      // Re-throw meaningful HTTP errors (400, 404, 500) to allow UI error boundaries
      throw error;
    }
  },

  /**
   * Resolves a single product by stable productId or URL slug.
   * Checks productId first, then slug, before surfacing 404.
   * 
   * @param {string} idOrSlug - e.g. 'chair-komorebi' or 'komorebi-lounge-chair'
   * @returns {Promise<{ product: Object, isFallback: boolean }>}
   */
  async getProductByIdOrSlug(idOrSlug) {
    if (!idOrSlug) {
      const error = new Error('Product identifier is required.');
      error.statusCode = 400;
      throw error;
    }

    try {
      // 1. Attempt ID lookup first
      try {
        const res = await api.get(`/products/${encodeURIComponent(idOrSlug)}`);
        if (res.data?.success && res.data?.data) {
          return { product: res.data.data, isFallback: false };
        }
      } catch (idErr) {
        // If 404, attempt slug lookup
        if (idErr.response?.status === 404) {
          try {
            const slugRes = await api.get(`/products/slug/${encodeURIComponent(idOrSlug)}`);
            if (slugRes.data?.success && slugRes.data?.data) {
              return { product: slugRes.data.data, isFallback: false };
            }
          } catch (slugErr) {
            if (slugErr.response?.status !== 404) {
              throw slugErr;
            }
          }
        } else if (!isNetworkFailure(idErr)) {
          throw idErr;
        } else {
          // Network failure on id lookup - bubble to outer catch for controlled fallback
          throw idErr;
        }
      }

      // If both ID and slug attempts fail with 404
      const notFoundErr = new Error(`Product "${idOrSlug}" not found.`);
      notFoundErr.statusCode = 404;
      notFoundErr.isNotFound = true;
      throw notFoundErr;
    } catch (error) {
      if (isNetworkFailure(error)) {
        console.warn(`[ProductService] Network failure resolving "${idOrSlug}". Using local fallback.`);
        const localProduct = getProductByIdOrSlugLocal(idOrSlug);
        if (localProduct) {
          return { product: localProduct, isFallback: true };
        }
        const notFound = new Error(`Product "${idOrSlug}" not found in local catalog.`);
        notFound.statusCode = 404;
        notFound.isNotFound = true;
        throw notFound;
      }
      throw error;
    }
  },

  /**
   * Resolves a product by stable productId or MongoDB _id.
   */
  async getProductById(id) {
    try {
      const res = await api.get(`/products/${encodeURIComponent(id)}`);
      return { product: res.data.data, isFallback: false };
    } catch (error) {
      if (isNetworkFailure(error)) {
        console.warn(`[ProductService] Network failure for ID "${id}". Using local fallback.`);
        const local = PRODUCTS.find((p) => p.id === id);
        if (local) return { product: local, isFallback: true };
      }
      throw error;
    }
  },

  /**
   * Resolves a product by URL slug.
   */
  async getProductBySlug(slug) {
    try {
      const res = await api.get(`/products/slug/${encodeURIComponent(slug)}`);
      return { product: res.data.data, isFallback: false };
    } catch (error) {
      if (isNetworkFailure(error)) {
        console.warn(`[ProductService] Network failure for slug "${slug}". Using local fallback.`);
        const local = PRODUCTS.find((p) => p.slug === slug);
        if (local) return { product: local, isFallback: true };
      }
      throw error;
    }
  },

  /**
   * Fetches filter metadata (categories, room types, styles, price bounds).
   */
  async getFilterMetadata() {
    try {
      const res = await api.get('/products/filters/meta');
      return {
        ...res.data.data,
        isFallback: false,
      };
    } catch (error) {
      if (isNetworkFailure(error)) {
        console.warn('[ProductService] Network failure loading filter metadata. Using local defaults.');
        return {
          categories: getUniqueCategoriesLocal().filter((c) => c !== 'All'),
          roomTypes: ['living', 'bedroom', 'dining', 'office', 'architectural'],
          styles: ['Japandi', 'Minimalist', 'Scandinavian', 'Mid-Century'],
          priceRange: getPriceBoundsLocal(),
          totalProducts: PRODUCTS.length,
          isFallback: true,
        };
      }
      throw error;
    }
  },

  /**
   * Authoritatively calculates the configured price via POST /api/v1/products/:productId/price.
   * 
   * @param {string} productId - Product identifier
   * @param {Object} configuration - { fabricId, finishId, sizeId }
   * @returns {Promise<Object>} Calculated price breakdown
   */
  async calculateConfiguredPrice(productId, configuration) {
    try {
      const res = await api.post(`/products/${encodeURIComponent(productId)}/price`, {
        configuration,
      });
      return {
        ...res.data.data,
        isFallback: false,
      };
    } catch (error) {
      // On network failure only, fall back to pure local client calculation
      if (isNetworkFailure(error)) {
        console.warn('[ProductService] Network failure during price validation. Using local calculation engine.');
        const product = getProductByIdOrSlugLocal(productId);
        if (product) {
          const localCalc = calculateConfiguredPriceLocal(product, configuration);
          return {
            ...localCalc,
            isFallback: true,
          };
        }
      }
      // Re-throw 400 (PRODUCT_NOT_CUSTOMIZABLE, INVALID_CUSTOMIZATION_OPTION) and 404
      throw error;
    }
  },

  /**
   * Controlled local fallback filtering matching backend query logic.
   * Strictly invoked on genuine network outages.
   */
  getLocalFilteredProducts(params) {
    let list = [...PRODUCTS];

    if (params.category) {
      list = list.filter((p) => p.category.toLowerCase() === params.category.toLowerCase());
    }

    if (params.roomType) {
      list = list.filter((p) => p.roomType.toLowerCase() === params.roomType.toLowerCase());
    }

    if (params.style) {
      list = list.filter((p) => p.style.toLowerCase() === params.style.toLowerCase());
    }

    if (params.customizable !== undefined) {
      list = list.filter((p) => Boolean(p.customizable) === Boolean(params.customizable));
    }

    if (params.featured !== undefined) {
      list = list.filter((p) => Boolean(p.featured) === Boolean(params.featured));
    }

    if (params.inStock !== undefined) {
      list = list.filter((p) => Boolean(p.inStock) === Boolean(params.inStock));
    }

    if (params.minPrice !== undefined) {
      list = list.filter((p) => p.basePrice >= params.minPrice);
    }
    if (params.maxPrice !== undefined) {
      list = list.filter((p) => p.basePrice <= params.maxPrice);
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.primaryMaterial && p.primaryMaterial.toLowerCase().includes(q))
      );
    }

    if (params.material) {
      const mats = params.material.split(',').map((m) => m.trim().toLowerCase());
      list = list.filter((p) =>
        p.materials?.some((m) => mats.includes(m.toLowerCase()))
      );
    }

    // Sort
    const sort = params.sort || 'featured';
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-desc':
        list.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        list.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
        break;
      case 'featured':
      default:
        list.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.name.localeCompare(b.name);
        });
        break;
    }

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 12;
    const total = list.length;
    const pages = Math.ceil(total / limit) || 1;
    const paginated = list.slice((page - 1) * limit, page * limit);

    return {
      products: paginated,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
      filters: {
        categories: getUniqueCategoriesLocal().filter((c) => c !== 'All'),
        roomTypes: ['living', 'bedroom', 'dining', 'office', 'architectural'],
        styles: ['Japandi', 'Minimalist', 'Scandinavian', 'Mid-Century'],
        priceRange: getPriceBoundsLocal(),
        totalProducts: PRODUCTS.length,
      },
      isFallback: true,
    };
  },
};

export default productService;
