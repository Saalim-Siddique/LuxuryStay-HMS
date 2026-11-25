import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';
import { setAccessToken, clearAccessToken } from '../services/api';

/**
 * AuthContext – manages authentication state.
 *
 * Token strategy:
 *  - accessToken  : held in-memory inside api.js (setAccessToken / getAccessToken).
 *                   It is NEVER written to localStorage or sessionStorage.
 *  - refreshToken : httpOnly Secure cookie managed entirely by the server.
 *                   JS cannot read it; it is sent automatically by the browser.
 *  - user profile : non-sensitive shape { id, fullName, email, role, hotelIds }
 *                   persisted to localStorage so the UI can be restored after a
 *                   hard refresh. The page will re-validate via /auth/refresh on
 *                   mount before showing protected content.
 *
 * Session restore on page reload:
 *  1. Load user profile from localStorage (UI skeleton).
 *  2. Call /auth/refresh — if the httpOnly cookie is still valid the server
 *     returns a fresh accessToken which is stored in memory.
 *  3. If refresh fails (cookie expired / revoked), user profile is cleared
 *     and the user sees the login page.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);  // non-sensitive profile only
  const [loading, setLoading] = useState(true);  // true while restoring session

  // ── Session restore on mount ──────────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      const storedUser = localStorage.getItem('hms_user');

      if (!storedUser) {
        setLoading(false);
        return;
      }

      try {
        setUser(JSON.parse(storedUser));

        // Attempt silent token refresh using the httpOnly refresh-token cookie
        const { accessToken } = await authService.refreshToken();
        setAccessToken(accessToken);
      } catch {
        // Cookie expired or revoked — clear everything
        setUser(null);
        clearAccessToken();
        localStorage.removeItem('hms_user');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ── login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password, isGuest = false) => {
    const data = isGuest
      ? await authService.loginGuest(email, password)
      : await authService.loginStaff(email, password);

    // Store access token in memory only
    setAccessToken(data.accessToken);

    // Persist non-sensitive profile to localStorage for UI restore
    setUser(data.user);
    localStorage.setItem('hms_user', JSON.stringify(data.user));

    return data.user;
  }, []);

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      // Server invalidates the refresh-token cookie (rotation + blacklist)
      await authService.logout();
    } catch {
      // Always clear client state even if server call fails
    } finally {
      setUser(null);
      clearAccessToken();
      localStorage.removeItem('hms_user');
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    role: user?.role || null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};

export default AuthContext;
