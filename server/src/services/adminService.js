import Product, { serializeProduct } from '../models/Product.js';
import Consultation from '../models/Consultation.js';
import DesignBoard from '../models/DesignBoard.js';
import User from '../models/User.js';
import { consultationService } from './consultationService.js';
import { AppError } from '../utils/apiError.js';
import mongoose from 'mongoose';

export const adminService = {
  /**
   * Retrieves high-level administrative platform metrics.
   */
  async getDashboardStats() {
    const [totalProducts, pendingConsultations, registeredUsers, activeDesignBoards] = await Promise.all([
      Product.countDocuments(),
      Consultation.countDocuments({ status: 'New' }),
      User.countDocuments({ role: 'customer' }),
      DesignBoard.countDocuments(),
    ]);

    return {
      totalProducts,
      pendingConsultations,
      registeredUsers,
      activeDesignBoards,
    };
  },

  /**
   * Retrieves consultations for administration with optional status filter.
   */
  async getConsultations(query) {
    return consultationService.getAllConsultations(query);
  },

  /**
   * Updates consultation status in pipeline.
   */
  async updateConsultationStatus(id, updateData) {
    return consultationService.updateStatus(id, updateData);
  },

  /**
   * Updates product operational fields (inStock, stockCount, featured).
   */
  async updateProduct(productIdOrId, updates) {
    const isObjectId = mongoose.Types.ObjectId.isValid(productIdOrId);
    const filter = isObjectId ? { _id: productIdOrId } : { productId: productIdOrId };

    const product = await Product.findOne(filter);
    if (!product) {
      throw AppError.notFound(`Product '${productIdOrId}' not found.`, 'PRODUCT_NOT_FOUND');
    }

    if (updates.inStock !== undefined) product.inStock = Boolean(updates.inStock);
    if (updates.stockCount !== undefined) product.stockCount = Number(updates.stockCount) || 0;
    if (updates.featured !== undefined) product.featured = Boolean(updates.featured);

    await product.save();
    return serializeProduct(product);
  },
};
