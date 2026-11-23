import { AppError } from '../utils/apiError.js';

const ALLOWED_ROOM_TYPES = [
  'Living Room',
  'Bedroom',
  'Dining Room',
  'Home Office',
  'Architectural Studio',
  'Sanctuary',
];

const ALLOWED_STYLES = [
  'Japandi',
  'Warm Editorial',
  'Nordic Minimalist',
  'Modern Architectural',
  'Organic Modern',
];

export const boardValidators = {
  validateCreateBoard(req, res, next) {
    const { title, description, roomType, style, coverImage } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 2) {
      return next(AppError.badRequest('Board title must be at least 2 characters long.', [], 'VALIDATION_ERROR'));
    }
    if (title.trim().length > 100) {
      return next(AppError.badRequest('Board title cannot exceed 100 characters.', [], 'VALIDATION_ERROR'));
    }

    if (roomType && !ALLOWED_ROOM_TYPES.includes(roomType)) {
      return next(
        AppError.badRequest(
          `Invalid roomType. Must be one of: ${ALLOWED_ROOM_TYPES.join(', ')}`,
          [],
          'VALIDATION_ERROR'
        )
      );
    }

    if (style && !ALLOWED_STYLES.includes(style)) {
      return next(
        AppError.badRequest(
          `Invalid style. Must be one of: ${ALLOWED_STYLES.join(', ')}`,
          [],
          'VALIDATION_ERROR'
        )
      );
    }

    req.cleanBoardData = {
      title: title.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      roomType: roomType || 'Living Room',
      style: style || 'Warm Editorial',
      coverImage: typeof coverImage === 'string' && coverImage.trim() ? coverImage.trim() : undefined,
    };

    next();
  },

  validateUpdateBoard(req, res, next) {
    const { title, description, roomType, style, coverImage } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length < 2 || title.trim().length > 100) {
        return next(AppError.badRequest('Title must be between 2 and 100 characters.', [], 'VALIDATION_ERROR'));
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim().length > 500) {
        return next(AppError.badRequest('Description cannot exceed 500 characters.', [], 'VALIDATION_ERROR'));
      }
      updates.description = description.trim();
    }

    if (roomType !== undefined) {
      if (!ALLOWED_ROOM_TYPES.includes(roomType)) {
        return next(AppError.badRequest(`Invalid roomType. Allowed: ${ALLOWED_ROOM_TYPES.join(', ')}`, [], 'VALIDATION_ERROR'));
      }
      updates.roomType = roomType;
    }

    if (style !== undefined) {
      if (!ALLOWED_STYLES.includes(style)) {
        return next(AppError.badRequest(`Invalid style. Allowed: ${ALLOWED_STYLES.join(', ')}`, [], 'VALIDATION_ERROR'));
      }
      updates.style = style;
    }

    if (coverImage !== undefined && typeof coverImage === 'string') {
      updates.coverImage = coverImage.trim();
    }

    req.cleanBoardUpdates = updates;
    next();
  },

  validateAddItem(req, res, next) {
    const { productId, quantity = 1, configuration } = req.body;

    if (!productId || typeof productId !== 'string' || productId.trim().length === 0) {
      return next(AppError.badRequest('A valid string productId is required.', [], 'VALIDATION_ERROR'));
    }

    const parsedQty = Number(quantity);
    if (!Number.isInteger(parsedQty) || parsedQty <= 0) {
      return next(AppError.badRequest('Quantity must be a positive integer greater than zero.', [], 'VALIDATION_ERROR'));
    }

    req.cleanItemData = {
      productId: productId.trim(),
      quantity: parsedQty,
      configuration: configuration && typeof configuration === 'object' ? configuration : {},
    };

    next();
  },

  validateUpdateItem(req, res, next) {
    const { quantity, configuration } = req.body;
    const updates = {};

    if (quantity !== undefined) {
      const parsedQty = Number(quantity);
      if (!Number.isInteger(parsedQty) || parsedQty <= 0) {
        return next(AppError.badRequest('Quantity must be a positive integer greater than zero.', [], 'VALIDATION_ERROR'));
      }
      updates.quantity = parsedQty;
    }

    if (configuration !== undefined) {
      if (typeof configuration !== 'object' || configuration === null) {
        return next(AppError.badRequest('Configuration must be an object.', [], 'VALIDATION_ERROR'));
      }
      updates.configuration = configuration;
    }

    if (Object.keys(updates).length === 0) {
      return next(AppError.badRequest('No item updates provided.', [], 'VALIDATION_ERROR'));
    }

    req.cleanItemUpdates = updates;
    next();
  },

  validateRoomLayout(req, res, next) {
    const { roomLength, roomWidth, units = 'm', furnitureInstances = [] } = req.body;

    const rLength = Number(roomLength);
    const rWidth = Number(roomWidth);

    if (isNaN(rLength) || rLength < 1.0 || rLength > 20.0) {
      return next(AppError.badRequest('Room length must be a valid number between 1.0 and 20.0 meters.', [], 'VALIDATION_ERROR'));
    }
    if (isNaN(rWidth) || rWidth < 1.0 || rWidth > 20.0) {
      return next(AppError.badRequest('Room width must be a valid number between 1.0 and 20.0 meters.', [], 'VALIDATION_ERROR'));
    }

    if (!Array.isArray(furnitureInstances)) {
      return next(AppError.badRequest('furnitureInstances must be an array.', [], 'VALIDATION_ERROR'));
    }

    // Validate each instance
    for (const inst of furnitureInstances) {
      if (!inst.instanceId || typeof inst.instanceId !== 'string') {
        return next(AppError.badRequest('Each furniture instance must have a valid instanceId string.', [], 'VALIDATION_ERROR'));
      }
      if (!inst.productId || typeof inst.productId !== 'string') {
        return next(AppError.badRequest('Each furniture instance must reference a valid productId.', [], 'VALIDATION_ERROR'));
      }
      if (typeof inst.x !== 'number' || typeof inst.y !== 'number' || isNaN(inst.x) || isNaN(inst.y)) {
        return next(AppError.badRequest('Coordinates (x, y) must be finite numbers.', [], 'VALIDATION_ERROR'));
      }
      if (typeof inst.w !== 'number' || typeof inst.d !== 'number' || inst.w <= 0 || inst.d <= 0) {
        return next(AppError.badRequest('Dimensions (w, d) must be positive numbers.', [], 'VALIDATION_ERROR'));
      }
      if (typeof inst.rotation !== 'number' || isNaN(inst.rotation)) {
        return next(AppError.badRequest('Rotation must be a valid number.', [], 'VALIDATION_ERROR'));
      }
      if (!inst.glyphType || typeof inst.glyphType !== 'string') {
        return next(AppError.badRequest('glyphType is required for each instance.', [], 'VALIDATION_ERROR'));
      }
    }

    req.cleanRoomLayout = {
      roomLength: rLength,
      roomWidth: rWidth,
      units: units === 'm' ? 'm' : 'm',
      savedAt: new Date(),
      furnitureInstances,
    };

    next();
  },

  validateSyncBoards(req, res, next) {
    const { boards } = req.body;
    if (!Array.isArray(boards)) {
      return next(AppError.badRequest('boards must be an array for synchronization.', [], 'VALIDATION_ERROR'));
    }
    req.cleanGuestBoards = boards;
    next();
  },
};
