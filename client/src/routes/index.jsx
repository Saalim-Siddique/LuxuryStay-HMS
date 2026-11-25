import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';
import { ROLES, ROLE_DEFAULT_PATH } from '../utils/constants';

// ── Auth pages (implemented in Phase 1) ──────────────────────────────────────
import LoginPage from '../pages/auth/LoginPage';

// ── Placeholder / stub pages ──────────────────────────────────────────────────
import NotFoundPage from '../pages/common/NotFoundPage';
import UnauthorizedPage from '../pages/common/UnauthorizedPage';

// ── Public ────────────────────────────────────────────────────────────────────
import HomePage from '../pages/public/HomePage';
import HotelsPage from '../pages/public/HotelsPage';
import HotelDetailPage from '../pages/public/HotelDetailPage';
import RoomDetailPage from '../pages/public/RoomDetailPage';
import BookingPage from '../pages/public/BookingPage';

// ── Development-only Design System preview ────────────────────────────────────
import DesignSystemPreviewPage from '../pages/dev/DesignSystemPreviewPage';

/**
 * Root router.
 * Portal-specific routes are defined here as nested trees
 * and will be expanded in later phases.
 */
const AppRouter = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/hotels/:hotelSlug" element={<HotelDetailPage />} />
        <Route path="/hotels/:hotelSlug/rooms/:roomSlug" element={<RoomDetailPage />} />
        <Route path="/booking" element={<BookingPage />} />

        {/* Temporary development-only Design System showcase */}
        {import.meta.env.DEV && (
          <Route path="/design-system" element={<DesignSystemPreviewPage />} />
        )}

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* ── Protected portals ───────────────────────────────────────────── */}
        <Route element={<PrivateRoute />}>

          {/* Guest portal */}
          <Route element={<RoleRoute allowedRoles={[ROLES.GUEST]} />}>
            <Route path="/guest/*" element={<div className="p-4"><h3>Guest Portal – Coming in Phase 3</h3></div>} />
          </Route>

          {/* Receptionist portal */}
          <Route element={<RoleRoute allowedRoles={[ROLES.RECEPTIONIST, ROLES.MANAGER, ROLES.HOTEL_ADMIN, ROLES.SUPER_ADMIN]} />}>
            <Route path="/reception/*" element={<div className="p-4"><h3>Reception Portal – Coming in Phase 4</h3></div>} />
          </Route>

          {/* Housekeeping portal */}
          <Route element={<RoleRoute allowedRoles={[ROLES.HOUSEKEEPING, ROLES.MANAGER, ROLES.HOTEL_ADMIN, ROLES.SUPER_ADMIN]} />}>
            <Route path="/housekeeping/*" element={<div className="p-4"><h3>Housekeeping Portal – Coming in Phase 5</h3></div>} />
          </Route>

          {/* Manager portal */}
          <Route element={<RoleRoute allowedRoles={[ROLES.MANAGER, ROLES.HOTEL_ADMIN, ROLES.SUPER_ADMIN]} />}>
            <Route path="/manager/*" element={<div className="p-4"><h3>Manager Portal – Coming in Phase 4</h3></div>} />
          </Route>

          {/* Hotel Admin portal */}
          <Route element={<RoleRoute allowedRoles={[ROLES.HOTEL_ADMIN, ROLES.SUPER_ADMIN]} />}>
            <Route path="/hotel-admin/*" element={<div className="p-4"><h3>Hotel Admin Portal – Coming in Phase 2</h3></div>} />
          </Route>

          {/* Super Admin portal */}
          <Route element={<RoleRoute allowedRoles={[ROLES.SUPER_ADMIN]} />}>
            <Route path="/super-admin/*" element={<div className="p-4"><h3>Super Admin Portal – Coming in Phase 2</h3></div>} />
          </Route>

          {/* Dashboard redirect based on role */}
          <Route
            path="/dashboard"
            element={
              user ? (
                <Navigate to={ROLE_DEFAULT_PATH[user.role] || '/'} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
