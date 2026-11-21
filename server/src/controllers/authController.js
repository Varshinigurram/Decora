import { authService } from '../services/authService.js';
import { apiResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/apiError.js';
import {
  COOKIE_NAMES,
  getAccessCookieOptions,
  getRefreshCookieOptions,
  clearAllAuthCookies,
} from '../utils/cookieConfig.js';

export const authController = {
  /**
   * Registers a new customer account.
   */
  async register(req, res, next) {
    try {
      const { fullName, email, password } = req.body;
      const { user, tokens } = await authService.registerUser({ fullName, email, password });

      // Set HTTP-only secure session cookies
      res.cookie(COOKIE_NAMES.ACCESS, tokens.accessToken, getAccessCookieOptions());
      res.cookie(COOKIE_NAMES.REFRESH, tokens.refreshToken, getRefreshCookieOptions());

      return apiResponse.created(
        res,
        { user: user.toJSON() },
        'Account created successfully.'
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * Authenticates user and issues new session tokens.
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, tokens } = await authService.loginUser({ email, password });

      res.cookie(COOKIE_NAMES.ACCESS, tokens.accessToken, getAccessCookieOptions());
      res.cookie(COOKIE_NAMES.REFRESH, tokens.refreshToken, getRefreshCookieOptions());

      return apiResponse.success(
        res,
        { user: user.toJSON() },
        'Signed in successfully.'
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * Silently rotates access and refresh tokens.
   */
  async refresh(req, res, next) {
    try {
      const incomingRefreshToken = req.cookies?.[COOKIE_NAMES.REFRESH];
      if (!incomingRefreshToken) {
        clearAllAuthCookies(res);
        throw AppError.unauthorized('No refresh token provided.');
      }

      const { user, tokens } = await authService.rotateRefreshToken(incomingRefreshToken);

      res.cookie(COOKIE_NAMES.ACCESS, tokens.accessToken, getAccessCookieOptions());
      res.cookie(COOKIE_NAMES.REFRESH, tokens.refreshToken, getRefreshCookieOptions());

      return apiResponse.success(
        res,
        { user: user.toJSON() },
        'Session refreshed successfully.'
      );
    } catch (error) {
      // Clear cookies on refresh failure so client doesn't get trapped in retry loops
      clearAllAuthCookies(res);
      next(error);
    }
  },

  /**
   * Idempotent logout: revokes active session hash and clears cookies.
   */
  async logout(req, res, next) {
    try {
      // Attempt to extract userId from existing tokens if present
      let userId = req.user?.id;
      if (!userId) {
        const refreshCookie = req.cookies?.[COOKIE_NAMES.REFRESH];
        if (refreshCookie) {
          try {
            const decoded = authService.verifyRefreshToken(refreshCookie);
            userId = decoded.id;
          } catch {
            // Ignore token decode errors on logout
          }
        }
      }

      if (userId) {
        await authService.logoutUser(userId);
      }

      clearAllAuthCookies(res);
      return apiResponse.success(res, null, 'Signed out successfully.');
    } catch (error) {
      clearAllAuthCookies(res);
      next(error);
    }
  },

  /**
   * Returns current authenticated user profile.
   */
  async getMe(req, res, next) {
    try {
      return apiResponse.success(
        res,
        { user: req.user },
        'Current user profile retrieved.'
      );
    } catch (error) {
      next(error);
    }
  },
};
