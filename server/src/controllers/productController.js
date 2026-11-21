import { productService } from '../services/productService.js';
import { pricingService } from '../services/pricingService.js';
import { apiResponse } from '../utils/apiResponse.js';

export const productController = {
  /**
   * GET /api/v1/products
   * List, filter, sort and paginate products.
   */
  async getProducts(req, res, next) {
    try {
      const query = req.validatedQuery || {};
      const { products, pagination } = await productService.getProducts(query);
      const filters = await productService.getFilterMetadata();

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Products retrieved successfully.',
        data: products,
        pagination,
        filters,
        meta: {
          timestamp: new Date().toISOString(),
          pagination,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/products/:id
   * Resolve single product by stable productId or MongoDB ObjectId.
   */
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      return apiResponse.success(
        res,
        product,
        'Product retrieved successfully.'
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/products/slug/:slug
   * Resolve single product by exact URL slug.
   */
  async getProductBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const product = await productService.getProductBySlug(slug);

      return apiResponse.success(
        res,
        product,
        'Product retrieved successfully.'
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/v1/products/:productId/price
   * Authoritatively calculate configured price.
   */
  async calculatePrice(req, res, next) {
    try {
      const { productId } = req.params;
      const { configuration } = req.body;

      // 1. Fetch authoritative product from MongoDB
      const product = await productService.getProductById(productId);

      // 2. Perform server-side validation and additive price calculation
      const priceBreakdown = pricingService.calculateConfiguredPrice(product, configuration);

      return apiResponse.success(
        res,
        priceBreakdown,
        'Configured price calculated successfully.'
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/products/filters/meta
   * Returns distinct filter options.
   */
  async getFilterMeta(req, res, next) {
    try {
      const filters = await productService.getFilterMetadata();
      return apiResponse.success(res, filters, 'Filter metadata retrieved successfully.');
    } catch (error) {
      next(error);
    }
  },
};
