import { AppError } from '../utils/apiError.js';
import { env } from '../config/env.js';

/**
 * 404 Not Found Middleware
 * Catches all requests to endpoints not defined on the Express router.
 */
export function notFoundHandler(req, res, next) {
  const error = AppError.notFound(`Endpoint '${req.method} ${req.originalUrl}' not found on this server.`);
  next(error);
}

/**
 * Global Error Handler Middleware
 * Normalizes operational, Mongoose, validation, and unexpected errors
 * into the standardized Décora API error envelope.
 */
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];
  let isOperational = err.isOperational ?? false;

  // 1. Mongoose Invalid ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid resource identifier format for '${err.path}': ${err.value}`;
    errors = [{ field: err.path, message: 'Invalid identifier format.' }];
    isOperational = true;
  }

  // 2. Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    isOperational = true;
  }

  // 3. Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : 'value';
    message = `Duplicate value '${value}' for field '${field}'. A record with this value already exists.`;
    errors = [{ field, message: 'Value must be unique.' }];
    isOperational = true;
  }

  // 4. JWT Authentication Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token signature.';
    isOperational = true;
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired. Please sign in again.';
    isOperational = true;
  }

  // Log unhandled non-operational errors
  if (!isOperational) {
    console.error('[Unhandled Server Error]', err);
  }

  // Construct Standard Error Envelope
  const errorCode = err.code || (statusCode === 404 ? 'NOT_FOUND' : statusCode === 400 ? 'VALIDATION_ERROR' : undefined);
  const responsePayload = {
    success: false,
    statusCode,
    message: !isOperational && env.isProduction ? 'An unexpected architectural error occurred on the server.' : message,
    code: errorCode,
    error: errorCode ? { code: errorCode, message } : undefined,
    errors,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  // Development Diagnostic Stack (never exposed in production)
  if (env.isDevelopment && err.stack) {
    responsePayload.meta.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
}
