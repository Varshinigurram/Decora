import axios from 'axios';

/**
 * Global Axios Client Configuration
 * Aligned with Phase 0/1/2 architecture:
 * - API Prefix: /api/v1
 * - Cross-Origin Credentials: true (for HTTP-only cookies)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
