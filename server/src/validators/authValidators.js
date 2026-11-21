import { AppError } from '../utils/apiError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HAS_LETTER_REGEX = /[a-zA-Z]/;
const HAS_DIGIT_REGEX = /[0-9]/;

/**
 * Validates registration request payload.
 * Enforces:
 * - fullName: 2-100 characters (trimmed)
 * - email: valid email address (normalized to lowercase)
 * - password: 8-72 bytes, >= 1 letter, >= 1 digit, NEVER trimmed
 */
export function validateRegister(req, res, next) {
  const { fullName, email, password } = req.body || {};
  const errors = [];

  // 1. Full Name Validation
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    errors.push({ field: 'fullName', message: 'Full name must be at least 2 characters long.' });
  } else if (fullName.trim().length > 100) {
    errors.push({ field: 'fullName', message: 'Full name cannot exceed 100 characters.' });
  }

  // 2. Email Validation
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: 'email', message: 'A valid email address is required.' });
  }

  // 3. Password Validation
  if (!password || typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required.' });
  } else {
    // Check byte length to prevent silent bcrypt 72-byte truncation
    const byteLength = Buffer.byteLength(password, 'utf8');
    if (password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters long.' });
    } else if (byteLength > 72) {
      errors.push({ field: 'password', message: 'Password cannot exceed 72 bytes.' });
    }
    if (!HAS_LETTER_REGEX.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one letter.' });
    }
    if (!HAS_DIGIT_REGEX.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one number.' });
    }
  }

  if (errors.length > 0) {
    return next(new AppError('Validation failed', 400, errors));
  }

  // Normalize email and fullName safely (never trim or mutate password)
  req.body.email = email.trim().toLowerCase();
  req.body.fullName = fullName.trim();

  // Enforce server-controlled customer role: discard any client-provided role
  delete req.body.role;

  next();
}

/**
 * Validates login request payload.
 */
export function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  const errors = [];

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: 'email', message: 'A valid email address is required.' });
  }

  if (!password || typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required.' });
  }

  if (errors.length > 0) {
    return next(new AppError('Validation failed', 400, errors));
  }

  req.body.email = email.trim().toLowerCase();
  // Do NOT trim or alter password
  next();
}
