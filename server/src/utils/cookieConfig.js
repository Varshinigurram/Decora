import { env } from '../config/env.js';

export const COOKIE_NAMES = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
};

export const getAccessCookieOptions = () => ({
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'lax',
  maxAge: 15 * 60 * 1000, // 15 minutes in ms
  path: '/',
});

export const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: '/api/v1/auth', // Restricted path: only sent to auth routes
});

export const clearAccessCookie = (res) => {
  res.clearCookie(COOKIE_NAMES.ACCESS, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: '/',
  });
};

export const clearRefreshCookie = (res) => {
  res.clearCookie(COOKIE_NAMES.REFRESH, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: '/api/v1/auth',
  });
};

export const clearAllAuthCookies = (res) => {
  clearAccessCookie(res);
  clearRefreshCookie(res);
};
