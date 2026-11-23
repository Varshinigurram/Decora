import { Router } from 'express';
import { boardController } from '../controllers/boardController.js';
import { boardValidators } from '../validators/boardValidators.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

// All board endpoints require user authentication
router.use(authenticateJWT);

router.get('/', boardController.getBoards);
router.post('/', boardValidators.validateCreateBoard, boardController.createBoard);
router.post('/sync', boardValidators.validateSyncBoards, boardController.syncBoards);

router.get('/:id', boardController.getBoardById);
router.patch('/:id', boardValidators.validateUpdateBoard, boardController.updateBoard);
router.put('/:id', boardValidators.validateUpdateBoard, boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);
router.post('/:id/duplicate', boardController.duplicateBoard);

// Board Items
router.post('/:id/items', boardValidators.validateAddItem, boardController.addItem);
router.patch('/:id/items/:boardItemId', boardValidators.validateUpdateItem, boardController.updateItem);
router.patch('/:id/items/:boardItemId/quantity', boardValidators.validateUpdateItem, boardController.updateItem);
router.delete('/:id/items/:boardItemId', boardController.removeItem);

// Room Layout
router.put('/:id/layout', boardValidators.validateRoomLayout, boardController.saveRoomLayout);
router.put('/:id/room-layout', boardValidators.validateRoomLayout, boardController.saveRoomLayout);

export default router;
