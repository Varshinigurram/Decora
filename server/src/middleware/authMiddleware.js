import { authService } from '../services/authService.js';
import User from '../models/User.js';
import { AppError } from '../utils/apiError.js';
import { COOKIE_NAMES } from '../utils/cookieConfig.js';

/**
 * Authentication Middleware: authenticateJWT
 * Verifies access token from HTTP-only cookie (or Bearer header fallback),
 * validates live database user existence, active status, and tokenVersion.
 */
export async function authenticateJWT(req, res, next) {
  try {
    let token = req.cookies?.[COOKIE_NAMES.ACCESS];

    // Bearer token fallback (for API tools / compatibility)
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(AppError.unauthorized('Authentication required. No session token provided.'));
    }

    // 1. Cryptographic token verification
    const decoded = authService.verifyAccessToken(token);

    // 2. Authoritative live database check
    const user = await User.findById(decoded.id).select('email fullName role isActive tokenVersion');

    if (!user) {
      return next(AppError.unauthorized('User account no longer exists.'));
    }

    if (!user.isActive) {
      return next(AppError.unauthorized('Account has been suspended or deactivated.'));
    }

    // 3. Token Version Check: Immediate access token revocation
    if (decoded.tokenVersion !== user.tokenVersion) {
      return next(AppError.unauthorized('Session has been revoked. Please sign in again.'));
    }

    // 4. Attach live database-backed user
    req.user = {
      _id: user._id,
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role, // Authoritative live role from MongoDB
      isActive: user.isActive,
      tokenVersion: user.tokenVersion,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(AppError.unauthorized('Authentication token has expired. Please refresh your session.'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(AppError.unauthorized('Invalid authentication token signature.'));
    }
    next(error);
  }
}

/**
 * Optional Authentication Middleware: optionalAuthenticateJWT
 * Attaches req.user if a valid token is present, but allows guests (req.user = null) through.
 */
export async function optionalAuthenticateJWT(req, res, next) {
  try {
    let token = req.cookies?.[COOKIE_NAMES.ACCESS];
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      req.user = null;
      return next();
    }
    const decoded = authService.verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('email fullName role isActive tokenVersion');
    if (user && user.isActive && decoded.tokenVersion === user.tokenVersion) {
      req.user = {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        tokenVersion: user.tokenVersion,
        _id: user._id,
      };
    } else {
      req.user = null;
    }
    next();
  } catch {
    req.user = null;
    next();
  }
}
