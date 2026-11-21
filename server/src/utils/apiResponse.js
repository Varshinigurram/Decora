/**
 * Standardized API Response Helper for Décora REST API.
 * Ensures consistent JSON response envelope across all endpoints.
 */
export const apiResponse = {
  /**
   * Sends a standardized success JSON response.
   * 
   * @param {Object} res - Express response object
   * @param {Object|Array|null} data - Payload data
   * @param {string} message - Human-readable success message
   * @param {number} statusCode - HTTP status code (default: 200)
   * @param {Object} meta - Optional metadata (pagination, counts, etc.)
   */
  success(res, data = null, message = 'Operation completed successfully', statusCode = 200, meta = {}) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    });
  },

  /**
   * Sends a standardized 201 Created response.
   */
  created(res, data = null, message = 'Resource created successfully', meta = {}) {
    return this.success(res, data, message, 201, meta);
  },
};
