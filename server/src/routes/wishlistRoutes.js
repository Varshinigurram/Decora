import { Router } from 'express';
import { wishlistController } from '../controllers/wishlistController.js';
import { wishlistValidators } from '../validators/wishlistValidators.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

// All wishlist endpoints require authentication
router.use(authenticateJWT);

router.get('/', wishlistController.getWishlist);
router.post('/toggle', wishlistValidators.validateProductId, wishlistController.toggleItem);
router.post('/items', wishlistValidators.validateProductId, wishlistController.addItem);
router.delete('/items/:productId', wishlistValidators.validateProductId, wishlistController.removeItem);
router.delete('/', wishlistController.clearWishlist);
router.post('/sync', wishlistValidators.validateSyncPayload, wishlistController.syncWishlist);

export default router;
