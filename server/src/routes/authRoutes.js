import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../validators/authValidators.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';
import { validateOrigin } from '../middleware/csrfMiddleware.js';

const router = Router();

// Apply origin validation to all state-changing auth endpoints
router.use(validateOrigin);

// 1. Customer Registration (Rate-limited, validated)
router.post('/register', authLimiter, validateRegister, authController.register);

// 2. User Authentication (Rate-limited, generic error)
router.post('/login', authLimiter, validateLogin, authController.login);

// 3. Silent Token Rotation
router.post('/refresh', authController.refresh);

// 4. Session Termination & Cookie Invalidation
router.post('/logout', authController.logout);

// 5. Current Authenticated Profile
router.get('/me', authenticateJWT, authController.getMe);

export default router;
