import { wishlistService } from '../services/wishlistService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const wishlistController = {
  async getWishlist(req, res, next) {
    try {
      const data = await wishlistService.getWishlist(req.user._id);
      return ApiResponse.success(res, 200, 'Wishlist retrieved successfully', data);
    } catch (err) {
      next(err);
    }
  },

  async addItem(req, res, next) {
    try {
      const productId = req.cleanProductId;
      const data = await wishlistService.addItem(req.user._id, productId);
      return ApiResponse.success(res, 200, 'Product added to wishlist', data);
    } catch (err) {
      next(err);
    }
  },

  async removeItem(req, res, next) {
    try {
      const productId = req.cleanProductId;
      const data = await wishlistService.removeItem(req.user._id, productId);
      return ApiResponse.success(res, 200, 'Product removed from wishlist', data);
    } catch (err) {
      next(err);
    }
  },

  async toggleItem(req, res, next) {
    try {
      const productId = req.cleanProductId;
      const data = await wishlistService.toggleItem(req.user._id, productId);
      const msg = data.inWishlist ? 'Product added to wishlist' : 'Product removed from wishlist';
      return ApiResponse.success(res, 200, msg, data);
    } catch (err) {
      next(err);
    }
  },

  async clearWishlist(req, res, next) {
    try {
      const data = await wishlistService.clearWishlist(req.user._id);
      return ApiResponse.success(res, 200, 'Wishlist cleared successfully', data);
    } catch (err) {
      next(err);
    }
  },

  async syncWishlist(req, res, next) {
    try {
      const data = await wishlistService.syncWishlist(req.user._id, req.cleanProductIds);
      return ApiResponse.success(res, 200, 'Wishlist synced successfully', data);
    } catch (err) {
      next(err);
    }
  },
};
