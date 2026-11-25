'use strict';

// ── Roles ────────────────────────────────────────────────────────────────────
const ROLES = Object.freeze({
  SUPER_ADMIN: 'superAdmin',
  HOTEL_ADMIN: 'hotelAdmin',
  MANAGER: 'manager',
  RECEPTIONIST: 'receptionist',
  HOUSEKEEPING: 'housekeeping',
  GUEST: 'guest',
});

// Role hierarchy: higher index = higher privilege
const ROLE_HIERARCHY = [
  ROLES.GUEST,
  ROLES.HOUSEKEEPING,
  ROLES.RECEPTIONIST,
  ROLES.MANAGER,
  ROLES.HOTEL_ADMIN,
  ROLES.SUPER_ADMIN,
];

// ── Booking statuses ─────────────────────────────────────────────────────────
const BOOKING_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checkedIn',
  CHECKED_OUT: 'checkedOut',
  CANCELLED: 'cancelled',
  NO_SHOW: 'noShow',
});

// ── Room statuses ─────────────────────────────────────────────────────────────
const ROOM_STATUS = Object.freeze({
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  MAINTENANCE: 'maintenance',
  OUT_OF_ORDER: 'outOfOrder',
});

// ── Housekeeping statuses ────────────────────────────────────────────────────
const HOUSEKEEPING_STATUS = Object.freeze({
  CLEAN: 'clean',
  DIRTY: 'dirty',
  INSPECTING: 'inspecting',
  OUT_OF_SERVICE: 'outOfService',
});

// ── Payment methods ──────────────────────────────────────────────────────────
const PAYMENT_METHOD = Object.freeze({
  CASH: 'cash',
  CARD: 'card',
  BANK_TRANSFER: 'bankTransfer',
  ONLINE: 'online',
  VOUCHER: 'voucher',
});

// ── Payment statuses ─────────────────────────────────────────────────────────
const PAYMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
});

// ── Pagination defaults ──────────────────────────────────────────────────────
const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
});

// ── Default settings ─────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = Object.freeze({
  MIN_ADVANCE_BOOKING_HOURS: 2,
  MAX_ADVANCE_BOOKING_DAYS: 365,
  CANCELLATION_WINDOW_HOURS: 24,
  CANCELLATION_FEE_PERCENT: 0,
  INVOICE_PREFIX: 'INV',
  BOOKING_PREFIX: 'BK',
  DEFAULT_CURRENCY: 'USD',
  TAX_RATE: 0,
  LOYALTY_POINTS_PER_DOLLAR: 1,
});

module.exports = {
  ROLES,
  ROLE_HIERARCHY,
  BOOKING_STATUS,
  ROOM_STATUS,
  HOUSEKEEPING_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  PAGINATION,
  DEFAULT_SETTINGS,
};

