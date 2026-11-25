import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * RoleRoute – renders child routes only if the authenticated user has
 * one of the allowed roles. Otherwise redirects to /unauthorized.
 *
 * Usage:
 *   <Route element={<RoleRoute allowedRoles={['superAdmin', 'hotelAdmin']} />}>
 *     <Route path="hotels" element={<Hotels />} />
 *   </Route>
 */
const RoleRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-gold" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;

