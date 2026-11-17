/**
 * Décora – Pure Dynamic Additive Pricing Engine
 * 
 * Mathematical Formulation:
 *   Final Price = Base Price + Fabric Adjustment + Finish Adjustment + Size Adjustment
 * 
 * Requirements:
 * - Pure calculations derived strictly from centralized product configuration data.
 * - Handles zero-cost baseline options (delta = 0).
 * - Handles negative price adjustments (e.g. studio compact scaling or economy timber).
 * - Handles products with missing or empty categories (e.g. non-upholstered tables).
 * - Enforces non-negative final prices.
 * - Does not silently substitute invalid option IDs; flags validation errors cleanly.
 * - Numerical return values; presentation formatting delegated to PriceDisplay / formatters.
 */

/**
 * Derives the initial default configuration for a customizable product.
 * Selects the first option with delta === 0, or falls back to the first available option.
 * For categories with no options (e.g. fabrics: []), returns null.
 * 
 * @param {Object} product - Product record from products.js
 * @returns {Object} Default configuration object { fabricId, finishId, sizeId }
 */
export function getDefaultConfiguration(product) {
  if (!product || !product.customizationOptions) {
    return {
      fabricId: null,
      finishId: null,
      sizeId: null,
    };
  }

  const { fabrics = [], finishes = [], sizes = [] } = product.customizationOptions;

  const selectDefaultOption = (options) => {
    if (!options || options.length === 0) return null;
    // Prefer baseline zero-delta option if present
    const zeroOption = options.find((opt) => opt.delta === 0);
    return zeroOption ? zeroOption.id : options[0].id;
  };

  return {
    fabricId: selectDefaultOption(fabrics),
    finishId: selectDefaultOption(finishes),
    sizeId: selectDefaultOption(sizes),
  };
}

/**
 * Validates a configuration against a product's supported option categories.
 * 
 * @param {Object} product - Product record
 * @param {Object} config - { fabricId, finishId, sizeId }
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateConfiguration(product, config) {
  const errors = [];

  if (!product) {
    return { isValid: false, errors: ['Product record is required.'] };
  }

  if (!product.customizable || !product.customizationOptions) {
    return {
      isValid: false,
      errors: [`Product "${product.name || product.id}" does not support bespoke customization.`],
    };
  }

  const { fabrics = [], finishes = [], sizes = [] } = product.customizationOptions;
  const { fabricId, finishId, sizeId } = config || {};

  // 1. Fabric validation
  if (fabrics.length > 0) {
    if (!fabricId) {
      errors.push(`A fabric option is required for ${product.name}.`);
    } else {
      const match = fabrics.find((f) => f.id === fabricId);
      if (!match) {
        errors.push(`Invalid fabric selection ID "${fabricId}" for ${product.name}.`);
      }
    }
  } else if (fabricId !== null && fabricId !== undefined) {
    errors.push(`Product "${product.name}" does not support fabric customization.`);
  }

  // 2. Finish validation
  if (finishes.length > 0) {
    if (!finishId) {
      errors.push(`A finish option is required for ${product.name}.`);
    } else {
      const match = finishes.find((f) => f.id === finishId);
      if (!match) {
        errors.push(`Invalid finish selection ID "${finishId}" for ${product.name}.`);
      }
    }
  } else if (finishId !== null && finishId !== undefined) {
    errors.push(`Product "${product.name}" does not support finish customization.`);
  }

  // 3. Size validation
  if (sizes.length > 0) {
    if (!sizeId) {
      errors.push(`A size option is required for ${product.name}.`);
    } else {
      const match = sizes.find((s) => s.id === sizeId);
      if (!match) {
        errors.push(`Invalid size selection ID "${sizeId}" for ${product.name}.`);
      }
    }
  } else if (sizeId !== null && sizeId !== undefined) {
    errors.push(`Product "${product.name}" does not support size customization.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Computes the itemized additive price for a product and selected configuration.
 * 
 * Formula:
 *   Final Price = Base Price + Fabric Adjustment + Finish Adjustment + Size Adjustment
 * 
 * @param {Object} product - Product record
 * @param {Object} config - { fabricId, finishId, sizeId }
 * @returns {Object} Itemized calculation result
 */
export function calculateConfiguredPrice(product, config) {
  if (!product) {
    return {
      basePrice: 0,
      fabricAdjustment: 0,
      finishAdjustment: 0,
      sizeAdjustment: 0,
      finalPrice: 0,
      isValid: false,
      errors: ['No product provided to pricing engine.'],
      selectedOptions: { fabric: null, finish: null, size: null },
    };
  }

  const basePrice = typeof product.basePrice === 'number' ? product.basePrice : 0;

  // Non-customizable products return base price
  if (!product.customizable || !product.customizationOptions) {
    return {
      basePrice,
      fabricAdjustment: 0,
      finishAdjustment: 0,
      sizeAdjustment: 0,
      finalPrice: Math.max(0, basePrice),
      isValid: true,
      errors: [],
      selectedOptions: { fabric: null, finish: null, size: null },
    };
  }

  const validation = validateConfiguration(product, config);
  const { fabrics = [], finishes = [], sizes = [] } = product.customizationOptions;
  const { fabricId, finishId, sizeId } = config || {};

  // Resolve matching option objects strictly; do not invent or substitute
  const selectedFabric = fabrics.find((f) => f.id === fabricId) || null;
  const selectedFinish = finishes.find((f) => f.id === finishId) || null;
  const selectedSize = sizes.find((s) => s.id === sizeId) || null;

  // Extract numerical deltas (safe with zero and negative deltas)
  const fabricAdjustment = selectedFabric ? Number(selectedFabric.delta) || 0 : 0;
  const finishAdjustment = selectedFinish ? Number(selectedFinish.delta) || 0 : 0;
  const sizeAdjustment = selectedSize ? Number(selectedSize.delta) || 0 : 0;

  // Compute additive total with non-negative guard
  const calculatedTotal = basePrice + fabricAdjustment + finishAdjustment + sizeAdjustment;
  const finalPrice = Math.max(0, calculatedTotal);

  return {
    basePrice,
    fabricAdjustment,
    finishAdjustment,
    sizeAdjustment,
    finalPrice,
    isValid: validation.isValid,
    errors: validation.errors,
    selectedOptions: {
      fabric: selectedFabric,
      finish: selectedFinish,
      size: selectedSize,
    },
    // True if all applied adjustments are zero (baseline standard)
    isStandardBaseline:
      fabricAdjustment === 0 && finishAdjustment === 0 && sizeAdjustment === 0,
  };
}
