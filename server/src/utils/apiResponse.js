/**
 * Standardized API Response Helper for Décora REST API.
 * Ensures consistent JSON response envelope across all endpoints.
 */
export const apiResponse = {
  /**
   * Sends a standardized success JSON response.
   * Supports both signatures:
   *   (res, data, message, statusCode, meta)
   *   (res, statusCode, message, data, meta)
   */
  success(res, arg2 = null, arg3 = 'Operation completed successfully', arg4 = 200, meta = {}) {
    let data = arg2;
    let message = arg3;
    let statusCode = arg4;
    let metadata = meta;

    // Polymorphic signature check: if arg2 is a number, it's (res, statusCode, message, data, meta)
    if (typeof arg2 === 'number') {
      statusCode = arg2;
      message = typeof arg3 === 'string' ? arg3 : 'Operation completed successfully';
      data = arg4 !== 200 ? arg4 : null;
      metadata = typeof meta === 'object' ? meta : {};
    }

    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...metadata,
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

export const ApiResponse = apiResponse;
export default apiResponse;
