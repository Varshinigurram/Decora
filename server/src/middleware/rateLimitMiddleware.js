import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

/**
 * General API Rate Limiter
 * Guards against brute-force requests and Denial of Service.
 * Configured with a generous window in development to avoid disrupting testing.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.isDevelopment ? 1500 : 300, // Limit each IP per window
  standardHeaders: true, // Return standard RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      statusCode: 429,
      message: 'Too many requests from this IP address. Please try again after 15 minutes.',
      errors: [
        {
          field: 'rateLimit',
          message: 'Request threshold exceeded.',
        },
      ],
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  },
});

/**
 * Dedicated Authentication Rate Limiter
 * Applied specifically to sensitive /auth/login and /auth/register endpoints.
 * Development: 100 attempts / 15m (allows thorough testing)
 * Production: 10 attempts / 15m (guards against brute-force credential stuffing)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.isDevelopment ? 100 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      statusCode: 429,
      message: 'Too many sign-in or registration attempts from this IP. Please try again after 15 minutes.',
      errors: [
        {
          field: 'authRateLimit',
          message: 'Authentication attempt threshold exceeded.',
        },
      ],
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  },
});
