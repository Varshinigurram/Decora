import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import boardRoutes from './boardRoutes.js';
import consultationRoutes from './consultationRoutes.js';
import adminRoutes from './adminRoutes.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = Router();

// Mount Health & Readiness Probes: /api/v1/health, /api/v1/ready
router.use('/', healthRoutes);

// Mount Authentication & User Management Routes: /api/v1/auth/*
router.use('/auth', authRoutes);

// Mount Furniture Catalog & Pricing Routes: /api/v1/products/*
router.use('/products', productRoutes);

// Mount Wishlist Routes: /api/v1/wishlist/*
router.use('/wishlist', wishlistRoutes);

// Mount Design Boards & Room Layout Routes: /api/v1/boards/* (and alias /api/v1/design-boards/*)
router.use('/boards', boardRoutes);
router.use('/design-boards', boardRoutes);

// Mount Consultations Routes: /api/v1/consultations/*
router.use('/consultations', consultationRoutes);

// Test/Verification endpoint for admin role authorization
router.get('/admin/test', authenticateJWT, requireAdmin, (req, res) => {
  res.status(200).json({ success: true, message: 'Admin access granted.', user: req.user });
});

// Mount Protected Admin Portal Routes: /api/v1/admin/*
router.use('/admin', adminRoutes);

export default router;
