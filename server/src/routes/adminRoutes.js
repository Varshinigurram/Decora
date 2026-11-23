import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { consultationValidators } from '../validators/consultationValidators.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = Router();

// All admin routes strictly enforce authentication + admin role authorization
router.use(authenticateJWT, requireAdmin);

router.get('/dashboard', adminController.getDashboardStats);
router.get('/consultations', adminController.getConsultations);
router.patch('/consultations/:id/status', consultationValidators.validateStatusUpdate, adminController.updateConsultationStatus);

router.get('/products', adminController.getProducts);
router.patch('/products/:id', adminController.updateProduct);
router.put('/products/:id', adminController.updateProduct);

export default router;
