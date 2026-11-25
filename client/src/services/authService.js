import api from './api';

/**
 * authService – all auth-related API calls.
 *
 * The server sets/clears the httpOnly refresh-token cookie on login/logout.
 * This service never receives or stores the refresh token value.
 */
const authService = {
  loginStaff: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data.data; // { user, accessToken }
    // Server also sets httpOnly refreshToken cookie
  },

  loginGuest: async (email, password) => {
    const { data } = await api.post('/auth/login/guest', { email, password });
    return data.data;
  },

  registerGuest: async (payload) => {
    const { data } = await api.post('/auth/register/guest', payload);
    return data.data;
  },

  /**
   * refreshToken – called on page load to silently restore the session.
   * The httpOnly cookie is sent automatically by the browser.
   * Returns { accessToken } to be stored in memory only.
   */
  refreshToken: async () => {
    const { data } = await api.post('/auth/refresh');
    return data.data; // { accessToken }
  },

  /**
   * logout – asks the server to invalidate the refresh-token cookie.
   * Server clears the cookie and adds the token to its blacklist.
   */
  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },

  forgotPassword: async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  resetPassword: async (token, password) => {
    const { data } = await api.post('/auth/reset-password', { token, password });
    return data;
  },
};

export default authService;
