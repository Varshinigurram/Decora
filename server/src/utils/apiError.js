/**
 * Custom Operational API Error for Décora REST API.
 * Extends the native JavaScript Error with HTTP status codes and operational classification.
 */
export class AppError extends Error {
  /**
   * @param {string} message - User-facing error message
   * @param {number} statusCode - HTTP status code
   * @param {Array} errors - Optional field-level error details
   * @param {*} details - Optional development diagnostics
   */
  constructor(message, statusCode = 500, errors = [], details = null, code = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors;
    this.details = details;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', errors = [], code = 'BAD_REQUEST') {
    return new AppError(message, 400, errors, null, code);
  }

  static unauthorized(message = 'Authentication required', code = 'UNAUTHORIZED') {
    return new AppError(message, 401, [], null, code);
  }

  static forbidden(message = 'Access forbidden', code = 'FORBIDDEN') {
    return new AppError(message, 403, [], null, code);
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
    return new AppError(message, 404, [], null, code);
  }

  static conflict(message = 'Resource conflict', code = 'CONFLICT') {
    return new AppError(message, 409, [], null, code);
  }

  static internal(message = 'Internal server error', details = null, code = 'INTERNAL_ERROR') {
    const err = new AppError(message, 500, [], details, code);
    err.isOperational = false;
    return err;
  }
}
