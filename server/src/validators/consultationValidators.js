import { AppError } from '../utils/apiError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_STATUSES = ['New', 'Contacted', 'Completed'];

export const consultationValidators = {
  validateSubmit(req, res, next) {
    const { fullName, email, phone, roomType, preferredStyle, budgetRange, message } = req.body;

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return next(AppError.badRequest('Full name must be at least 2 characters long.', [], 'VALIDATION_ERROR'));
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return next(AppError.badRequest('A valid contact email address is required.', [], 'VALIDATION_ERROR'));
    }

    req.cleanConsultationData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: typeof phone === 'string' ? phone.trim() : '',
      roomType: typeof roomType === 'string' ? roomType.trim() : 'Living Room',
      preferredStyle: typeof preferredStyle === 'string' ? preferredStyle.trim() : 'Warm Editorial',
      budgetRange: typeof budgetRange === 'string' ? budgetRange.trim() : '₹50,000 - ₹1,50,000',
      message: typeof message === 'string' ? message.trim() : '',
    };

    next();
  },

  validateStatusUpdate(req, res, next) {
    const { status, adminNotes } = req.body;

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return next(
        AppError.badRequest(
          `Invalid consultation status. Allowed statuses: ${ALLOWED_STATUSES.join(', ')}`,
          [],
          'VALIDATION_ERROR'
        )
      );
    }

    req.cleanStatusUpdate = {
      status,
      adminNotes: typeof adminNotes === 'string' ? adminNotes.trim() : undefined,
    };

    next();
  },
};
