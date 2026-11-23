import Wishlist from '../models/Wishlist.js';
import Product, { serializeProduct } from '../models/Product.js';
import { AppError } from '../utils/apiError.js';

export const wishlistService = {
  /**
   * Retrieves the current user's wishlist and full product objects.
   */
  async getWishlist(userId) {
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return {
        productIds: [],
        products: [],
        total: 0,
      };
    }

    // Fetch matching products from canonical Product catalog
    const products = await Product.find({ productId: { $in: wishlist.productIds } });
    const serializedProducts = products.map(serializeProduct);

    return {
      productIds: wishlist.productIds,
      products: serializedProducts,
      total: wishlist.productIds.length,
    };
  },

  /**
   * Adds a product to the user's wishlist after validating existence.
   */
  async addItem(userId, productId) {
    const productExists = await Product.exists({ productId });
    if (!productExists) {
      throw AppError.notFound(`Product with ID '${productId}' not found in catalog.`, 'PRODUCT_NOT_FOUND');
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $addToSet: { productIds: productId } },
      { new: true, upsert: true }
    );

    return {
      productId,
      inWishlist: true,
      wishlistCount: wishlist.productIds.length,
      productIds: wishlist.productIds,
    };
  },

  /**
   * Removes a product from the user's wishlist.
   */
  async removeItem(userId, productId) {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { productIds: productId } },
      { new: true }
    );

    const count = wishlist ? wishlist.productIds.length : 0;
    return {
      productId,
      inWishlist: false,
      wishlistCount: count,
      productIds: wishlist ? wishlist.productIds : [],
    };
  },

  /**
   * Toggles product in/out of the user's wishlist.
   */
  async toggleItem(userId, productId) {
    const productExists = await Product.exists({ productId });
    if (!productExists) {
      throw AppError.notFound(`Product with ID '${productId}' not found in catalog.`, 'PRODUCT_NOT_FOUND');
    }

    const current = await Wishlist.findOne({ userId });
    const isPresent = current && current.productIds.includes(productId);

    if (isPresent) {
      return this.removeItem(userId, productId);
    } else {
      return this.addItem(userId, productId);
    }
  },

  /**
   * Clears all items from the user's wishlist.
   */
  async clearWishlist(userId) {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $set: { productIds: [] } },
      { new: true, upsert: true }
    );

    return {
      productIds: [],
      wishlistCount: 0,
    };
  },

  /**
   * Bulk syncs guest wishlist into user account upon authentication.
   * Filters out nonexistent products and avoids duplicate additions.
   */
  async syncWishlist(userId, candidateProductIds = []) {
    if (!Array.isArray(candidateProductIds) || candidateProductIds.length === 0) {
      return this.getWishlist(userId);
    }

    // Filter to valid productIds that exist in catalog
    const validProducts = await Product.find({ productId: { $in: candidateProductIds } }).select('productId');
    const validProductIds = validProducts.map((p) => p.productId);

    if (validProductIds.length > 0) {
      await Wishlist.findOneAndUpdate(
        { userId },
        { $addToSet: { productIds: { $each: validProductIds } } },
        { new: true, upsert: true }
      );
    }

    return this.getWishlist(userId);
  },
};
