import { useAuth } from '../context/AuthContext';

/**
 * useAuth hook re-exported from AuthContext for convenience.
 * Provides: { user, accessToken, loading, isAuthenticated, role, login, logout, updateToken }
 */
export { useAuth } from '../context/AuthContext';
export default useAuth;

