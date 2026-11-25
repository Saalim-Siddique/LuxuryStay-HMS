// ── Roles ────────────────────────────────────────────────────────────────────
export const ROLES = {
  SUPER_ADMIN:   'superAdmin',
  HOTEL_ADMIN:   'hotelAdmin',
  MANAGER:       'manager',
  RECEPTIONIST:  'receptionist',
  HOUSEKEEPING:  'housekeeping',
  GUEST:         'guest',
};

// ── Booking statuses ─────────────────────────────────────────────────────────
export const BOOKING_STATUS = {
  PENDING:     'pending',
  CONFIRMED:   'confirmed',
  CHECKED_IN:  'checkedIn',
  CHECKED_OUT: 'checkedOut',
  CANCELLED:   'cancelled',
  NO_SHOW:     'noShow',
};

// ── Room statuses ─────────────────────────────────────────────────────────────
export const ROOM_STATUS = {
  AVAILABLE:    'available',
  OCCUPIED:     'occupied',
  RESERVED:     'reserved',
  MAINTENANCE:  'maintenance',
  OUT_OF_ORDER: 'outOfOrder',
};

// ── Housekeeping statuses ─────────────────────────────────────────────────────
export const HOUSEKEEPING_STATUS = {
  CLEAN:          'clean',
  DIRTY:          'dirty',
  INSPECTING:     'inspecting',
  OUT_OF_SERVICE: 'outOfService',
};

// ── Portal route prefixes ─────────────────────────────────────────────────────
export const PORTAL_PATHS = {
  PUBLIC:       '/',
  AUTH:         '/login',
  GUEST:        '/guest',
  RECEPTIONIST: '/reception',
  HOUSEKEEPING: '/housekeeping',
  MANAGER:      '/manager',
  HOTEL_ADMIN:  '/hotel-admin',
  SUPER_ADMIN:  '/super-admin',
};

// Role → default portal mapping (used after login)
export const ROLE_DEFAULT_PATH = {
  [ROLES.SUPER_ADMIN]:  PORTAL_PATHS.SUPER_ADMIN,
  [ROLES.HOTEL_ADMIN]:  PORTAL_PATHS.HOTEL_ADMIN,
  [ROLES.MANAGER]:      PORTAL_PATHS.MANAGER,
  [ROLES.RECEPTIONIST]: PORTAL_PATHS.RECEPTIONIST,
  [ROLES.HOUSEKEEPING]: PORTAL_PATHS.HOUSEKEEPING,
  [ROLES.GUEST]:        PORTAL_PATHS.GUEST,
};

// ── Pagination ────────────────────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
};

