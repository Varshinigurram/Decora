import { env } from '../config/env.js';
import { AppError } from '../utils/apiError.js';
import { COOKIE_NAMES } from '../utils/cookieConfig.js';

const STATE_CHANGING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Origin and Referer validation middleware for state-changing requests.
 * Provides defense-in-depth CSRF protection alongside SameSite=Lax cookies.
 */
export function validateOrigin(req, res, next) {
  // Safe HTTP read methods are exempt
  if (!STATE_CHANGING_METHODS.has(req.method)) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // 1. Direct Origin Header Validation
  if (origin) {
    if (origin === env.CLIENT_URL) {
      return next();
    }
    return next(new AppError('Cross-origin request blocked: untrusted origin.', 403));
  }

  // 2. Referer Fallback Validation
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      if (refererOrigin === env.CLIENT_URL) {
        return next();
      }
      return next(new AppError('Cross-origin request blocked: untrusted referer.', 403));
    } catch {
      return next(new AppError('Cross-origin request blocked: malformed referer.', 403));
    }
  }

  // 3. Neither Origin nor Referer provided:
  // Legitimate automated tests or non-browser API clients (curl, Postman) do not send Origin by default.
  // However, if the request carries browser authentication cookies, reject it in production.
  const hasAuthCookies = req.cookies && (req.cookies[COOKIE_NAMES.ACCESS] || req.cookies[COOKIE_NAMES.REFRESH]);
  if (hasAuthCookies && env.isProduction) {
    return next(new AppError('State-changing request with credentials requires a valid Origin header.', 403));
  }

  next();
}
