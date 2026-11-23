import { boardService } from '../services/boardService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const boardController = {
  async getBoards(req, res, next) {
    try {
      const boards = await boardService.getBoards(req.user._id);
      return ApiResponse.success(res, 200, 'Design boards retrieved successfully', { boards });
    } catch (err) {
      next(err);
    }
  },

  async getBoardById(req, res, next) {
    try {
      const board = await boardService.getBoardById(req.user._id, req.params.id);
      return ApiResponse.success(res, 200, 'Design board retrieved successfully', board);
    } catch (err) {
      next(err);
    }
  },

  async createBoard(req, res, next) {
    try {
      const board = await boardService.createBoard(req.user._id, req.cleanBoardData);
      return ApiResponse.success(res, 201, 'Design board created successfully', board);
    } catch (err) {
      next(err);
    }
  },

  async updateBoard(req, res, next) {
    try {
      const board = await boardService.updateBoard(req.user._id, req.params.id, req.cleanBoardUpdates);
      return ApiResponse.success(res, 200, 'Design board updated successfully', board);
    } catch (err) {
      next(err);
    }
  },

  async deleteBoard(req, res, next) {
    try {
      const result = await boardService.deleteBoard(req.user._id, req.params.id);
      return ApiResponse.success(res, 200, 'Design board deleted successfully', result);
    } catch (err) {
      next(err);
    }
  },

  async duplicateBoard(req, res, next) {
    try {
      const board = await boardService.duplicateBoard(req.user._id, req.params.id);
      return ApiResponse.success(res, 201, 'Design board duplicated successfully', board);
    } catch (err) {
      next(err);
    }
  },

  async addItem(req, res, next) {
    try {
      const board = await boardService.addItem(req.user._id, req.params.id, req.cleanItemData);
      return ApiResponse.success(res, 200, 'Item snapshot added to board', board);
    } catch (err) {
      next(err);
    }
  },

  async updateItem(req, res, next) {
    try {
      const board = await boardService.updateItem(
        req.user._id,
        req.params.id,
        req.params.boardItemId,
        req.cleanItemUpdates
      );
      return ApiResponse.success(res, 200, 'Board item updated successfully', board);
    } catch (err) {
      next(err);
    }
  },

  async removeItem(req, res, next) {
    try {
      const board = await boardService.removeItem(req.user._id, req.params.id, req.params.boardItemId);
      return ApiResponse.success(res, 200, 'Board item removed successfully', board);
    } catch (err) {
      next(err);
    }
  },

  async saveRoomLayout(req, res, next) {
    try {
      const board = await boardService.saveRoomLayout(req.user._id, req.params.id, req.cleanRoomLayout);
      return ApiResponse.success(res, 200, 'Room layout saved to board successfully', board);
    } catch (err) {
      next(err);
    }
  },

  async syncBoards(req, res, next) {
    try {
      const boards = await boardService.syncBoards(req.user._id, req.cleanGuestBoards);
      return ApiResponse.success(res, 200, 'Guest boards synced successfully', { boards });
    } catch (err) {
      next(err);
    }
  },
};
