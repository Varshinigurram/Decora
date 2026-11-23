import { consultationService } from '../services/consultationService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const consultationController = {
  async submitConsultation(req, res, next) {
    try {
      const userId = req.user?._id || null;
      const data = await consultationService.submitConsultation(userId, req.cleanConsultationData);
      return ApiResponse.success(res, 201, 'Consultation request submitted successfully', data);
    } catch (err) {
      next(err);
    }
  },

  async getMyConsultations(req, res, next) {
    try {
      const data = await consultationService.getMyConsultations(req.user._id);
      return ApiResponse.success(res, 200, 'Your consultations retrieved successfully', { consultations: data });
    } catch (err) {
      next(err);
    }
  },
};
