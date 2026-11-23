import { AppError } from '../utils/apiError.js';

export const wishlistValidators = {
  validateProductId(req, res, next) {
    const productId = req.body?.productId || req.params?.productId;
    if (!productId || typeof productId !== 'string' || productId.trim().length === 0) {
      return next(AppError.badRequest('A valid string productId is required.', [], 'INVALID_PRODUCT_ID'));
    }
    req.cleanProductId = productId.trim();
    next();
  },

  validateSyncPayload(req, res, next) {
    const { productIds } = req.body;
    if (!Array.isArray(productIds)) {
      return next(AppError.badRequest('productIds must be an array of product ID strings.', [], 'VALIDATION_ERROR'));
    }
    const cleanIds = productIds
      .filter((id) => typeof id === 'string' && id.trim().length > 0)
      .map((id) => id.trim());

    req.cleanProductIds = cleanIds;
    next();
  },
};
