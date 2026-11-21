import mongoose from 'mongoose';
import Product, { serializeProduct, serializeProductList } from '../models/Product.js';
import { AppError } from '../utils/apiError.js';

export const productService = {
  /**
   * Retrieves paginated, sorted, and filtered products directly from MongoDB.
   * 
   * @param {Object} query - Validated query parameters
   * @returns {Promise<{ products: Array, pagination: Object, filterMetadata?: Object }>}
   */
  async getProducts(query = {}) {
    const {
      page = 1,
      limit = 12,
      category,
      roomType,
      style,
      minPrice,
      maxPrice,
      customizable,
      featured,
      inStock,
      materials,
      sort = 'featured',
      search,
    } = query;

    // 1. Construct MongoDB Query Filter
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (roomType) {
      filter.roomType = roomType;
    }

    if (style) {
      filter.style = style;
    }

    if (typeof customizable === 'boolean') {
      filter.customizable = customizable;
    }

    if (typeof featured === 'boolean') {
      filter.featured = featured;
    }

    if (typeof inStock === 'boolean') {
      filter.inStock = inStock;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.basePrice = {};
      if (minPrice !== undefined) filter.basePrice.$gte = minPrice;
      if (maxPrice !== undefined) filter.basePrice.$lte = maxPrice;
    }

    if (materials && materials.length > 0) {
      filter.materials = { $in: materials };
    }

    if (search) {
      // Regex search across name, description, and primaryMaterial
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { primaryMaterial: { $regex: search, $options: 'i' } },
      ];
    }

    // 2. Determine Sorting Strategy
    let sortObj = { featured: -1, createdAt: -1 };
    switch (sort) {
      case 'price-asc':
        sortObj = { basePrice: 1 };
        break;
      case 'price-desc':
        sortObj = { basePrice: -1 };
        break;
      case 'name-asc':
        sortObj = { name: 1 };
        break;
      case 'name-desc':
        sortObj = { name: -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'featured':
      default:
        sortObj = { featured: -1, createdAt: -1 };
        break;
    }

    // 3. Database-Side Pagination
    const skip = (page - 1) * limit;

    const [rawProducts, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      products: serializeProductList(rawProducts),
      pagination: {
        total,
        page,
        pages: totalPages,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  },

  /**
   * Retrieves a single product by stable productId or MongoDB ObjectId.
   * 
   * @param {string} id - productId (e.g. 'chair-komorebi') or MongoDB ObjectId
   * @returns {Promise<Object>}
   */
  async getProductById(id) {
    if (!id || typeof id !== 'string') {
      throw AppError.badRequest('Invalid product identifier format.');
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ productId: id }, { _id: id }] } : { productId: id };

    const product = await Product.findOne(filter);
    if (!product) {
      throw AppError.notFound(`Product with identifier '${id}' not found.`, 'PRODUCT_NOT_FOUND');
    }

    return serializeProduct(product);
  },

  /**
   * Retrieves a single product by exact URL slug.
   * 
   * @param {string} slug - e.g. 'komorebi-lounge-chair'
   * @returns {Promise<Object>}
   */
  async getProductBySlug(slug) {
    if (!slug || typeof slug !== 'string') {
      throw AppError.badRequest('Valid product slug is required.');
    }

    const product = await Product.findOne({ slug: slug.trim().toLowerCase() });
    if (!product) {
      throw AppError.notFound(`Product with slug '${slug}' not found.`, 'PRODUCT_NOT_FOUND');
    }

    return serializeProduct(product);
  },

  /**
   * Returns distinct filter options and price bounds for catalog controls.
   */
  async getFilterMetadata() {
    const [categories, roomTypes, styles, priceAgg, totalProducts] = await Promise.all([
      Product.distinct('category'),
      Product.distinct('roomType'),
      Product.distinct('style'),
      Product.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: '$basePrice' },
            maxPrice: { $max: '$basePrice' },
          },
        },
      ]),
      Product.countDocuments(),
    ]);

    const bounds = priceAgg[0] || { minPrice: 0, maxPrice: 100000 };
    const priceRange = {
      min: bounds.minPrice || 0,
      max: bounds.maxPrice || 100000,
    };

    return {
      categories: categories.sort(),
      roomTypes: roomTypes.sort(),
      styles: styles.sort(),
      priceRange,
      priceBounds: priceRange,
      totalProducts,
    };
  },
};
