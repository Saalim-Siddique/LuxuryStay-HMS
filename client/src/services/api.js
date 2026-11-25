import axios from 'axios';

/**
 * Axios instance for LuxuryStay HMS.
 *
 * Token strategy (corrected):
 *  - accessToken  → held in-memory ONLY (module-level variable).
 *                   Never written to localStorage or cookies.
 *  - refreshToken → stored in an httpOnly, Secure cookie managed by the server.
 *                   The browser sends it automatically; JS never touches it.
 *
 * On 401, the interceptor posts to /auth/refresh (cookie is sent automatically),
 * receives a new accessToken, stores it in memory, retries the original request,
 * and queues any parallel requests that arrived while refreshing.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// ── In-memory access-token store ──────────────────────────────────────────────
let _accessToken = null;

export const setAccessToken  = (token) => { _accessToken = token; };
export const getAccessToken  = ()      => _accessToken;
export const clearAccessToken = ()     => { _accessToken = null; };

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,   // ensures the httpOnly refresh-token cookie is sent
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Request interceptor: attach in-memory access token ───────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: auto-refresh on 401 ────────────────────────────────
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else       prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only intercept 401s that are not from the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      // Queue concurrent requests while refresh is in-flight
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Cookie is sent automatically — no token in the request body
        const { data } = await api.post('/auth/refresh');
        const newToken = data.data.accessToken;

        // Store only in memory
        setAccessToken(newToken);
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear in-memory token and non-sensitive profile data, then redirect
        clearAccessToken();
        localStorage.removeItem('hms_user');   // non-sensitive profile only
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
