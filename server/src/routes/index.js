import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = Router();

// Mount Health & Readiness Probes: /api/v1/health, /api/v1/ready
router.use('/', healthRoutes);

// Mount Authentication & User Management Routes: /api/v1/auth/*
router.use('/auth', authRoutes);

// Mount Furniture Catalog & Pricing Routes: /api/v1/products/*
router.use('/products', productRoutes);

// Test/Verification endpoint for admin role authorization
router.get('/admin/test', authenticateJWT, requireAdmin, (req, res) => {
  res.status(200).json({ success: true, message: 'Admin access granted.', user: req.user });
});

// Future feature route aggregations will be mounted here:
// router.use('/wishlist', wishlistRoutes);
// router.use('/boards', boardRoutes);
// router.use('/consultations', consultationRoutes);
// router.use('/admin', adminRoutes);

export default router;
