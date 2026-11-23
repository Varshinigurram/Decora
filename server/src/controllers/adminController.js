import { adminService } from '../services/adminService.js';
import { productService } from '../services/productService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const adminController = {
  async getDashboardStats(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      return ApiResponse.success(res, 200, 'Admin dashboard statistics retrieved successfully', stats);
    } catch (err) {
      next(err);
    }
  },

  async getConsultations(req, res, next) {
    try {
      const consultations = await adminService.getConsultations(req.query);
      return ApiResponse.success(res, 200, 'Consultations retrieved successfully', { consultations });
    } catch (err) {
      next(err);
    }
  },

  async updateConsultationStatus(req, res, next) {
    try {
      const updated = await adminService.updateConsultationStatus(req.params.id, req.cleanStatusUpdate);
      return ApiResponse.success(res, 200, 'Consultation status updated successfully', updated);
    } catch (err) {
      next(err);
    }
  },

  async getProducts(req, res, next) {
    try {
      const result = await productService.getProducts({ ...req.query, limit: req.query.limit || 48 });
      return ApiResponse.success(res, 200, 'Products retrieved for administration', result);
    } catch (err) {
      next(err);
    }
  },

  async updateProduct(req, res, next) {
    try {
      const updated = await adminService.updateProduct(req.params.id, req.body);
      return ApiResponse.success(res, 200, 'Product updated successfully', updated);
    } catch (err) {
      next(err);
    }
  },
};
