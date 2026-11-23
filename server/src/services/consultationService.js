import Consultation, { serializeConsultation } from '../models/Consultation.js';
import { AppError } from '../utils/apiError.js';
import mongoose from 'mongoose';

export const consultationService = {
  /**
   * Submits a consultation request (supports both guest and authenticated user).
   */
  async submitConsultation(userId, data) {
    const year = new Date().getFullYear();
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const referenceCode = `DEC-${year}-${randomHex}`;

    const consultation = await Consultation.create({
      userId: userId || null,
      referenceCode,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || '',
      roomType: data.roomType,
      preferredStyle: data.preferredStyle,
      budgetRange: data.budgetRange,
      message: data.message || '',
      status: 'New',
    });

    return serializeConsultation(consultation);
  },

  /**
   * Retrieves inquiries belonging to an authenticated customer.
   */
  async getMyConsultations(userId) {
    const consultations = await Consultation.find({ userId }).sort({ createdAt: -1 });
    return consultations.map(serializeConsultation);
  },

  /**
   * Admin: lists all consultations with optional status filter.
   */
  async getAllConsultations(query = {}) {
    const filter = {};
    if (query.status) {
      filter.status = query.status;
    }

    const consultations = await Consultation.find(filter).sort({ createdAt: -1 });
    return consultations.map(serializeConsultation);
  },

  /**
   * Admin: updates the pipeline stage of an inquiry.
   */
  async updateStatus(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw AppError.notFound(`Consultation '${id}' not found.`, 'NOT_FOUND');
    }

    const consultation = await Consultation.findById(id);
    if (!consultation) {
      throw AppError.notFound(`Consultation '${id}' not found.`, 'NOT_FOUND');
    }

    consultation.status = updateData.status;
    if (updateData.adminNotes !== undefined) {
      consultation.adminNotes = updateData.adminNotes;
    }

    await consultation.save();
    return serializeConsultation(consultation);
  },
};
