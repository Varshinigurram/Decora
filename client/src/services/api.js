import axios from 'axios';

/**
 * Global Axios Client Configuration
 * Aligned with Phase 4 Day 12 architecture:
 * - API Prefix: /api/v1
 * - Cross-Origin Credentials: true (for HTTP-only cookies)
 */
const api = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL || (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL) || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Guard: ignore requests without config or that have already been retried
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Do NOT automatically refresh for auth endpoints to prevent recursion and loops
    const url = originalRequest.url || '';
    if (
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/logout')
    ) {
      return Promise.reject(error);
    }

    // Intercept 401 Unauthorized for expired access tokens
    if (error.response?.status === 401) {
      originalRequest._retry = true;

      // Singleton refresh promise: all concurrent 401s queue behind one refresh call
      if (!refreshPromise) {
        refreshPromise = api
          .post('/auth/refresh')
          .then(() => true)
          .catch((refreshError) => {
            // Signal application that session is genuinely expired
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('decora:session-expired'));
            }
            return Promise.reject(refreshError);
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        await refreshPromise;
        // Replay original request with refreshed session cookies
        return api(originalRequest);
      } catch (replayError) {
        return Promise.reject(replayError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
