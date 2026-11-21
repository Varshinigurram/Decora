import { AppError } from '../utils/apiError.js';

export const pricingService = {
  /**
   * Authoritatively calculates the configured price for a customizable product.
   * Enforces server-side validation against options stored in MongoDB.
   * 
   * Formula:
   *   finalPrice = basePrice + fabricDelta + finishDelta + sizeDelta
   * 
   * @param {Object} product - Product document loaded from MongoDB
   * @param {Object} config - { fabricId, finishId, sizeId }
   * @returns {Object} Price calculation breakdown
   */
  calculateConfiguredPrice(product, config = {}) {
    if (!product) {
      throw AppError.notFound('Product record not found.', 'PRODUCT_NOT_FOUND');
    }

    if (!product.customizable) {
      throw AppError.badRequest(
        `Product "${product.name || product.productId}" does not support bespoke customization.`,
        [],
        'PRODUCT_NOT_CUSTOMIZABLE'
      );
    }

    const { fabrics = [], finishes = [], sizes = [] } = product.customizationOptions || {};
    const { fabricId, finishId, sizeId } = config;

    let selectedFabric = null;
    let selectedFinish = null;
    let selectedSize = null;

    // 1. Fabric Validation & Delta Extraction
    if (fabrics.length > 0) {
      if (!fabricId) {
        throw AppError.badRequest(`A fabric option is required for ${product.name}.`, [], 'INVALID_CUSTOMIZATION_OPTION');
      }
      selectedFabric = fabrics.find((f) => f.id === fabricId);
      if (!selectedFabric) {
        throw AppError.badRequest(`Invalid fabric selection ID "${fabricId}" for ${product.name}.`, [], 'INVALID_CUSTOMIZATION_OPTION');
      }
    } else if (fabricId) {
      throw AppError.badRequest(`Product "${product.name}" does not support fabric customization.`, [], 'INVALID_CUSTOMIZATION_OPTION');
    }

    // 2. Finish Validation & Delta Extraction
    if (finishes.length > 0) {
      if (!finishId) {
        throw AppError.badRequest(`A finish option is required for ${product.name}.`, [], 'INVALID_CUSTOMIZATION_OPTION');
      }
      selectedFinish = finishes.find((f) => f.id === finishId);
      if (!selectedFinish) {
        throw AppError.badRequest(`Invalid finish selection ID "${finishId}" for ${product.name}.`, [], 'INVALID_CUSTOMIZATION_OPTION');
      }
    } else if (finishId) {
      throw AppError.badRequest(`Product "${product.name}" does not support finish customization.`, [], 'INVALID_CUSTOMIZATION_OPTION');
    }

    // 3. Size Validation & Delta Extraction
    if (sizes.length > 0) {
      if (!sizeId) {
        throw AppError.badRequest(`A size option is required for ${product.name}.`, [], 'INVALID_CUSTOMIZATION_OPTION');
      }
      selectedSize = sizes.find((s) => s.id === sizeId);
      if (!selectedSize) {
        throw AppError.badRequest(`Invalid size selection ID "${sizeId}" for ${product.name}.`, [], 'INVALID_CUSTOMIZATION_OPTION');
      }
    } else if (sizeId) {
      throw AppError.badRequest(`Product "${product.name}" does not support size customization.`, [], 'INVALID_CUSTOMIZATION_OPTION');
    }

    // 4. Calculate Authoritative Additive Prices
    const basePrice = Number(product.basePrice) || 0;
    const fabricAdjustment = selectedFabric ? Number(selectedFabric.delta) || 0 : 0;
    const finishAdjustment = selectedFinish ? Number(selectedFinish.delta) || 0 : 0;
    const sizeAdjustment = selectedSize ? Number(selectedSize.delta) || 0 : 0;

    const rawFinalPrice = basePrice + fabricAdjustment + finishAdjustment + sizeAdjustment;
    // Enforce non-negative price bound
    const finalPrice = Math.max(0, rawFinalPrice);

    return {
      productId: product.productId,
      basePrice,
      fabricAdjustment,
      finishAdjustment,
      sizeAdjustment,
      finalPrice,
      isValid: true,
      selectedOptions: {
        fabric: selectedFabric
          ? { id: selectedFabric.id, name: selectedFabric.name, delta: selectedFabric.delta }
          : null,
        finish: selectedFinish
          ? { id: selectedFinish.id, name: selectedFinish.name, delta: selectedFinish.delta }
          : null,
        size: selectedSize
          ? { id: selectedSize.id, name: selectedSize.name, delta: selectedSize.delta }
          : null,
      },
    };
  },
};
