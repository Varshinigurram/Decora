import { Router } from 'express';
import { consultationController } from '../controllers/consultationController.js';
import { consultationValidators } from '../validators/consultationValidators.js';
import { authenticateJWT, optionalAuthenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

// Public consultation submission (with optional user attachment if logged in)
router.post('/', optionalAuthenticateJWT, consultationValidators.validateSubmit, consultationController.submitConsultation);

// Authenticated user inquiries
router.get('/my-consultations', authenticateJWT, consultationController.getMyConsultations);

export default router;
