import { AppError } from '../utils/apiError.js';

/**
 * Role-Based Access Control Middleware.
 * Enforces that the live database role attached to req.user matches one of the allowed roles.
 * 
 * @param  {...string} allowedRoles - e.g. 'admin', 'customer'
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(AppError.forbidden(`Access forbidden: requires ${allowedRoles.join(' or ')} privileges.`));
    }

    next();
  };
}

/**
 * Dedicated admin authorization guard.
 */
export const requireAdmin = requireRole('admin');
