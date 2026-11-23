import DesignBoard, { serializeBoard, serializeBoardList } from '../models/DesignBoard.js';
import Product from '../models/Product.js';
import { pricingService } from './pricingService.js';
import { AppError } from '../utils/apiError.js';
import mongoose from 'mongoose';

export const boardService = {
  /**
   * Retrieves all design boards belonging to the authenticated user.
   */
  async getBoards(userId) {
    const boards = await DesignBoard.find({ userId }).sort({ createdAt: -1 });
    return serializeBoardList(boards);
  },

  /**
   * Retrieves a single board by ID with strict ownership validation.
   */
  async getBoardById(userId, boardId) {
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      throw AppError.notFound(`Design board '${boardId}' not found.`, 'BOARD_NOT_FOUND');
    }

    const board = await DesignBoard.findById(boardId);
    if (!board) {
      throw AppError.notFound(`Design board '${boardId}' not found.`, 'BOARD_NOT_FOUND');
    }

    if (board.userId.toString() !== userId.toString()) {
      throw AppError.forbidden('You do not have permission to view or edit this design board.');
    }

    return serializeBoard(board);
  },

  /**
   * Creates a new empty design board for the user.
   */
  async createBoard(userId, boardData) {
    const board = await DesignBoard.create({
      userId,
      title: boardData.title,
      description: boardData.description || '',
      roomType: boardData.roomType || 'Living Room',
      style: boardData.style || 'Warm Editorial',
      coverImage: boardData.coverImage || '/assets/categories/cat-living.svg',
      items: [],
      roomLayout: null,
    });

    return serializeBoard(board);
  },

  /**
   * Updates board metadata (title, description, roomType, style, coverImage).
   */
  async updateBoard(userId, boardId, updates) {
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      throw AppError.notFound(`Design board '${boardId}' not found.`, 'BOARD_NOT_FOUND');
    }

    const board = await DesignBoard.findById(boardId);
    if (!board) {
      throw AppError.notFound(`Design board '${boardId}' not found.`, 'BOARD_NOT_FOUND');
    }

    if (board.userId.toString() !== userId.toString()) {
      throw AppError.forbidden('You do not have permission to update this design board.');
    }

    Object.assign(board, updates);
    await board.save();

    return serializeBoard(board);
  },

  /**
   * Deletes a design board owned by the user.
   */
  async deleteBoard(userId, boardId) {
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      throw AppError.notFound(`Design board '${boardId}' not found.`, 'BOARD_NOT_FOUND');
    }

    const board = await DesignBoard.findById(boardId);
    if (!board) {
      throw AppError.notFound(`Design board '${boardId}' not found.`, 'BOARD_NOT_FOUND');
    }

    if (board.userId.toString() !== userId.toString()) {
      throw AppError.forbidden('You do not have permission to delete this design board.');
    }

    await DesignBoard.deleteOne({ _id: boardId });
    return { id: boardId, deleted: true };
  },

  /**
   * Deep duplicates a design board, creating fresh item IDs and layout instances.
   */
  async duplicateBoard(userId, boardId) {
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      throw AppError.notFound(`Design board '${boardId}' not found.`, 'BOARD_NOT_FOUND');
    }

    const original = await DesignBoard.findById(boardId);
    if (!original) {
      throw AppError.notFound(`Design board '${boardId}' not found.`, 'BOARD_NOT_FOUND');
    }

    if (original.userId.toString() !== userId.toString()) {
      throw AppError.forbidden('You do not have permission to duplicate this design board.');
    }

    // Deep clone items with new unique boardItemId
    const clonedItems = (original.items || []).map((it) => {
      const itObj = it.toObject ? it.toObject() : { ...it };
      return {
        ...itObj,
        boardItemId: `bitem-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        addedAt: new Date(),
      };
    });

    // Deep clone room layout if present
    let clonedLayout = null;
    if (original.roomLayout) {
      const layoutObj = original.roomLayout.toObject ? original.roomLayout.toObject() : { ...original.roomLayout };
      const instances = (layoutObj.furnitureInstances || []).map((inst) => ({
        ...inst,
        instanceId: `inst-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      }));
      clonedLayout = {
        ...layoutObj,
        savedAt: new Date(),
        furnitureInstances: instances,
      };
    }

    const newBoard = await DesignBoard.create({
      userId,
      title: `${original.title} (Copy)`,
      description: original.description,
      roomType: original.roomType,
      style: original.style,
      coverImage: original.coverImage,
      items: clonedItems,
      roomLayout: clonedLayout,
    });

    return serializeBoard(newBoard);
  },

  /**
   * Adds an immutable product snapshot to a board.
   * CRITICAL: Authoritative pricing calculation is enforced on the server.
   */
  async addItem(userId, boardId, itemData) {
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      throw AppError.notFound(`Design board '${boardId}' not found.`, 'BOARD_NOT_FOUND');
    }

    const board = await DesignBoard.findById(boardId);
    if (!board) {
      throw AppError.notFound(`Design board '${boardId}' not found.`, 'BOARD_NOT_FOUND');
    }

    if (board.userId.toString() !== userId.toString()) {
      throw AppError.forbidden('You do not have permission to add items to this design board.');
    }

    const { productId, quantity = 1, configuration = {} } = itemData;

    // 1. Fetch canonical product from MongoDB
    const product = await Product.findOne({ productId });
    if (!product) {
      throw AppError.notFound(`Product with ID '${productId}' not found in catalog.`, 'PRODUCT_NOT_FOUND');
    }

    let unitPrice = product.basePrice;
    let isCustomized = false;
    let selectedOptions = { fabric: null, finish: null, size: null };

    // 2. Authoritative pricing calculation
    if (product.customizable) {
      const calcResult = pricingService.calculateConfiguredPrice(product, configuration);
      unitPrice = calcResult.finalPrice;
      selectedOptions = calcResult.selectedOptions;
      isCustomized = true;
    } else {
      // Reject customization attempts on non-customizable pieces
      if (configuration.fabricId || configuration.finishId || configuration.sizeId) {
        throw AppError.badRequest(
          `Product "${product.name}" is a fixed design and does not support customization options.`,
          [],
          'PRODUCT_NOT_CUSTOMIZABLE'
        );
      }
    }

    // 3. Assemble immutable snapshot
    const snapshotItem = {
      boardItemId: `bitem-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      productId: product.productId,
      productSlug: product.slug,
      name: product.name,
      category: product.category,
      image: product.image,
      quantity,
      unitPrice,
      isCustomized,
      configuration: {
        fabricId: configuration.fabricId || null,
        finishId: configuration.finishId || null,
        sizeId: configuration.sizeId || null,
      },
      selectedOptions,
      dimensions: {
        width: product.dimensions?.width,
        depth: product.dimensions?.depth,
        height: product.dimensions?.height,
        formatted: product.dimensions?.formatted,
      },
      addedAt: new Date(),
    };

    board.items.push(snapshotItem);
    await board.save();

    return serializeBoard(board);
  },

  /**
   * Updates an item's quantity or configuration on the board.
   * Re-evaluates authoritative price if configuration changes.
   */
  async updateItem(userId, boardId, boardItemId, itemUpdates) {
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      throw AppError.notFound(`Design board '${boardId}' not found.`, 'BOARD_NOT_FOUND');
    }

    const board = await DesignBoard.findById(boardId);
    if (!board) {
      throw AppError.notFound(`Design board '${boardId}' not found.`, 'BOARD_NOT_FOUND');
    }

    if (board.userId.toString() !== userId.toString()) {
      throw AppError.forbidden('You do not have permission to modify items on this design board.');
    }

    const item = board.items.find((it) => it.boardItemId === boardItemId);
    if (!item) {
      throw AppError.notFound(`Item '${boardItemId}' not found on this board.`, 'ITEM_NOT_FOUND');
    }

    if (itemUpdates.quantity !== undefined) {
      item.quantity = itemUpdates.quantity;
    }

    if (itemUpdates.configuration !== undefined) {
      const product = await Product.findOne({ productId: item.productId });
      if (!product) {
        throw AppError.notFound(`Product with ID '${item.productId}' not found in catalog.`, 'PRODUCT_NOT_FOUND');
      }

      if (product.customizable) {
        const calcResult = pricingService.calculateConfiguredPrice(product, itemUpdates.configuration);
        item.unitPrice = calcResult.finalPrice;
        item.configuration = {
          fabricId: itemUpdates.configuration.fabricId || null,
          finishId: itemUpdates.configuration.finishId || null,
          sizeId: itemUpdates.configuration.sizeId || null,
        };
        item.selectedOptions = calcResult.selectedOptions;
        item.isCustomized = true;
      } else {
        if (itemUpdates.configuration.fabricId || itemUpdates.configuration.finishId || itemUpdates.configuration.sizeId) {
          throw AppError.badRequest(`Product "${product.name}" does not support customization options.`, [], 'PRODUCT_NOT_CUSTOMIZABLE');
        }
      }
    }

    await board.save();
    return serializeBoard(board);
  },

  /**
   * Removes an item from the board.
   */
  async removeItem(userId, boardId, boardItemId) {
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      throw AppError.notFound(`Design board '${boardId}' not found.`, 'BOARD_NOT_FOUND');
    }

    const board = await DesignBoard.findById(boardId);
    if (!board) {
      throw AppError.notFound(`Design board '${boardId}' not found.`, 'BOARD_NOT_FOUND');
    }

    if (board.userId.toString() !== userId.toString()) {
      throw AppError.forbidden('You do not have permission to remove items from this design board.');
    }

    const initialLength = board.items.length;
    board.items = board.items.filter((it) => it.boardItemId !== boardItemId);

    if (board.items.length === initialLength) {
      throw AppError.notFound(`Item '${boardItemId}' not found on this board.`, 'ITEM_NOT_FOUND');
    }

    await board.save();
    return serializeBoard(board);
  },

  /**
   * Saves or updates the 2D CAD room layout attached to this design board.
   */
  async saveRoomLayout(userId, boardId, roomLayout) {
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      throw AppError.notFound(`Design board '${boardId}' not found.`, 'BOARD_NOT_FOUND');
    }

    const board = await DesignBoard.findById(boardId);
    if (!board) {
      throw AppError.notFound(`Design board '${boardId}' not found.`, 'BOARD_NOT_FOUND');
    }

    if (board.userId.toString() !== userId.toString()) {
      throw AppError.forbidden('You do not have permission to save room layouts to this design board.');
    }

    board.roomLayout = roomLayout;
    await board.save();

    return serializeBoard(board);
  },

  /**
   * Bulk syncs guest design boards into user account upon authentication.
   * Idempotent and validates all product snapshots and authoritative prices.
   */
  async syncBoards(userId, guestBoards = []) {
    if (!Array.isArray(guestBoards) || guestBoards.length === 0) {
      return this.getBoards(userId);
    }

    for (const gBoard of guestBoards) {
      if (!gBoard.title || typeof gBoard.title !== 'string') continue;

      // Check if an identical board title was already migrated for this user
      const existing = await DesignBoard.findOne({ userId, title: gBoard.title.trim() });
      if (existing) {
        continue; // Idempotent: skip re-importing identical board
      }

      const validItems = [];
      if (Array.isArray(gBoard.items)) {
        for (const it of gBoard.items) {
          if (!it.productId) continue;
          const product = await Product.findOne({ productId: it.productId });
          if (!product) continue;

          let unitPrice = product.basePrice;
          let isCustomized = false;
          let selectedOptions = { fabric: null, finish: null, size: null };

          if (product.customizable && it.configuration) {
            try {
              const calcResult = pricingService.calculateConfiguredPrice(product, it.configuration);
              unitPrice = calcResult.finalPrice;
              selectedOptions = calcResult.selectedOptions;
              isCustomized = true;
            } catch {
              // Fallback to base price if guest config had invalid option
              unitPrice = product.basePrice;
            }
          }

          validItems.push({
            boardItemId: it.boardItemId || `bitem-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
            productId: product.productId,
            productSlug: product.slug,
            name: product.name,
            category: product.category,
            image: product.image,
            quantity: Number.isInteger(Number(it.quantity)) && Number(it.quantity) > 0 ? Number(it.quantity) : 1,
            unitPrice,
            isCustomized,
            configuration: it.configuration || { fabricId: null, finishId: null, sizeId: null },
            selectedOptions,
            dimensions: {
              width: product.dimensions?.width,
              depth: product.dimensions?.depth,
              height: product.dimensions?.height,
              formatted: product.dimensions?.formatted,
            },
            addedAt: it.addedAt ? new Date(it.addedAt) : new Date(),
          });
        }
      }

      await DesignBoard.create({
        userId,
        title: gBoard.title.trim(),
        description: gBoard.description || '',
        roomType: gBoard.roomType || 'Living Room',
        style: gBoard.style || 'Warm Editorial',
        coverImage: gBoard.coverImage || '/assets/categories/cat-living.svg',
        items: validItems,
        roomLayout: gBoard.roomLayout || null,
      });
    }

    return this.getBoards(userId);
  },
};
