import { AppError } from '../utils/apiError.js';

const ALLOWED_CATEGORIES = new Set([
  'Seating', 'Tables', 'Beds', 'Storage', 'Lighting', 'Decor', 'all', 'All'
]);

const ALLOWED_ROOM_TYPES = new Set([
  'living', 'dining', 'bedroom', 'office', 'architectural', 'all', 'All'
]);

const ALLOWED_STYLES = new Set([
  'Japandi', 'Minimalist', 'Scandinavian', 'Mid-Century',
  'Warm Editorial', 'Nordic Minimalist', 'Modern Architectural', 'Organic Modern',
  'all', 'All'
]);

const ALLOWED_SORTS = new Set([
  'featured', 'price-asc', 'price-desc', 'name-asc', 'name-desc', 'newest'
]);

/**
 * Escapes user search strings to prevent regex injection.
 */
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Validates and sanitizes catalog query parameters for GET /api/v1/products.
 */
export function validateProductQuery(req, res, next) {
  const errors = [];
  const q = req.query || {};
  const sanitized = {};

  // 1. Pagination: page
  if (q.page !== undefined && q.page !== '') {
    const pageNum = Number(q.page);
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer greater than or equal to 1.' });
    } else {
      sanitized.page = pageNum;
    }
  } else {
    sanitized.page = 1;
  }

  // 2. Pagination: limit (Safe maximum: 48)
  if (q.limit !== undefined && q.limit !== '') {
    const limitNum = Number(q.limit);
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 48) {
      errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 48.' });
    } else {
      sanitized.limit = limitNum;
    }
  } else {
    sanitized.limit = 12;
  }

  // 3. Category Filter
  const category = q.category;
  if (category && typeof category === 'string' && category.trim()) {
    const catTrimmed = category.trim();
    if (!ALLOWED_CATEGORIES.has(catTrimmed)) {
      errors.push({ field: 'category', message: `Invalid category: '${catTrimmed}'.` });
    } else if (catTrimmed.toLowerCase() !== 'all') {
      sanitized.category = catTrimmed;
    }
  }

  // 4. Room Type Filter (supports 'room' or 'roomType')
  const room = q.room || q.roomType;
  if (room && typeof room === 'string' && room.trim()) {
    const roomTrimmed = room.trim();
    if (!ALLOWED_ROOM_TYPES.has(roomTrimmed)) {
      errors.push({ field: 'roomType', message: `Invalid room type: '${roomTrimmed}'.` });
    } else if (roomTrimmed.toLowerCase() !== 'all') {
      sanitized.roomType = roomTrimmed.toLowerCase();
    }
  }

  // 5. Style Filter
  const style = q.style;
  if (style && typeof style === 'string' && style.trim()) {
    const styleTrimmed = style.trim();
    if (!ALLOWED_STYLES.has(styleTrimmed)) {
      errors.push({ field: 'style', message: `Invalid style: '${styleTrimmed}'.` });
    } else if (styleTrimmed.toLowerCase() !== 'all') {
      sanitized.style = styleTrimmed;
    }
  }

  // 6. Price Range Filters
  let minP = null;
  let maxP = null;

  if (q.minPrice !== undefined && q.minPrice !== '') {
    const val = Number(q.minPrice);
    if (!Number.isFinite(val) || val < 0) {
      errors.push({ field: 'minPrice', message: 'Minimum price must be a valid non-negative number.' });
    } else {
      minP = val;
      sanitized.minPrice = val;
    }
  }

  if (q.maxPrice !== undefined && q.maxPrice !== '') {
    const val = Number(q.maxPrice);
    if (!Number.isFinite(val) || val < 0) {
      errors.push({ field: 'maxPrice', message: 'Maximum price must be a valid non-negative number.' });
    } else {
      maxP = val;
      sanitized.maxPrice = val;
    }
  }

  if (minP !== null && maxP !== null && minP > maxP) {
    errors.push({ field: 'priceRange', message: 'Minimum price cannot exceed maximum price.' });
  }

  // 7. Boolean Filters: customizable, featured, inStock
  const parseBool = (field, val) => {
    if (val === undefined || val === '') return;
    if (val === 'true' || val === true || val === '1') {
      sanitized[field] = true;
    } else if (val === 'false' || val === false || val === '0') {
      sanitized[field] = false;
    } else {
      errors.push({ field, message: `${field} must be a boolean ('true' or 'false').` });
    }
  };

  parseBool('customizable', q.customizable);
  parseBool('featured', q.featured);
  parseBool('inStock', q.inStock);

  // 8. Sorting
  if (q.sort !== undefined && q.sort !== '') {
    const sortVal = String(q.sort).trim();
    if (!ALLOWED_SORTS.has(sortVal)) {
      errors.push({ field: 'sort', message: `Invalid sort option: '${sortVal}'. Allowed: ${[...ALLOWED_SORTS].join(', ')}.` });
    } else {
      sanitized.sort = sortVal;
    }
  } else {
    sanitized.sort = 'featured';
  }

  // 9. Search query: q / search
  const searchQuery = q.q || q.search;
  if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim()) {
    const cleanSearch = searchQuery.trim();
    if (cleanSearch.length > 100) {
      errors.push({ field: 'search', message: 'Search query cannot exceed 100 characters.' });
    } else {
      sanitized.search = escapeRegex(cleanSearch);
      sanitized.rawSearch = cleanSearch;
    }
  }

  // 10. Material Filter
  if (q.material && typeof q.material === 'string' && q.material.trim()) {
    sanitized.materials = q.material
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);
  }

  if (errors.length > 0) {
    return next(new AppError('Invalid query parameters.', 400, errors, null, 'VALIDATION_ERROR'));
  }

  // Attach strictly validated and sanitized parameters
  req.validatedQuery = sanitized;
  next();
}

/**
 * Validates request payload for POST /api/v1/products/:productId/price.
 */
export function validatePriceCalculation(req, res, next) {
  const { configuration } = req.body || {};
  const errors = [];

  if (!configuration || typeof configuration !== 'object' || Array.isArray(configuration)) {
    errors.push({
      field: 'configuration',
      message: 'A configuration object { fabricId, finishId, sizeId } is required.',
    });
  } else {
    const { fabricId, finishId, sizeId } = configuration;
    if (fabricId !== undefined && fabricId !== null && typeof fabricId !== 'string') {
      errors.push({ field: 'fabricId', message: 'fabricId must be a string or null.' });
    }
    if (finishId !== undefined && finishId !== null && typeof finishId !== 'string') {
      errors.push({ field: 'finishId', message: 'finishId must be a string or null.' });
    }
    if (sizeId !== undefined && sizeId !== null && typeof sizeId !== 'string') {
      errors.push({ field: 'sizeId', message: 'sizeId must be a string or null.' });
    }
  }

  if (errors.length > 0) {
    return next(new AppError('Invalid price calculation payload.', 400, errors, null, 'VALIDATION_ERROR'));
  }

  next();
}
