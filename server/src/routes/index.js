'use strict';

/**
 * Root API router – aggregates all module route files.
 * Add each module here as it is implemented.
 */
const { Router } = require('express');

const router = Router();

// ── Health check (public) ────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LuxuryStay HMS API is running.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── Auth ─────────────────────────────────────────────────────────────────────
// router.use('/auth', require('../modules/auth/auth.routes'));

// ── Users ────────────────────────────────────────────────────────────────────
// router.use('/users', require('../modules/users/users.routes'));

// ── Hotels ───────────────────────────────────────────────────────────────────
// router.use('/hotels', require('../modules/hotels/hotels.routes'));

// ── Guests ───────────────────────────────────────────────────────────────────
// router.use('/guests', require('../modules/guests/guests.routes'));

// ── Room Types ───────────────────────────────────────────────────────────────
// router.use('/room-types', require('../modules/roomTypes/roomTypes.routes'));

// ── Rooms ────────────────────────────────────────────────────────────────────
// router.use('/rooms', require('../modules/rooms/rooms.routes'));

// ── Bookings ─────────────────────────────────────────────────────────────────
// router.use('/bookings', require('../modules/bookings/bookings.routes'));

// ── Check-Ins ────────────────────────────────────────────────────────────────
// router.use('/check-ins', require('../modules/checkIns/checkIns.routes'));

// ── Payments ─────────────────────────────────────────────────────────────────
// router.use('/payments', require('../modules/payments/payments.routes'));

// ── Invoices ─────────────────────────────────────────────────────────────────
// router.use('/invoices', require('../modules/invoices/invoices.routes'));

// ── Services ─────────────────────────────────────────────────────────────────
// router.use('/services', require('../modules/services/services.routes'));

// ── Service Requests ─────────────────────────────────────────────────────────
// router.use('/service-requests', require('../modules/serviceRequests/serviceRequests.routes'));

// ── Housekeeping ──────────────────────────────────────────────────────────────
// router.use('/housekeeping', require('../modules/housekeeping/housekeeping.routes'));

// ── Maintenance ───────────────────────────────────────────────────────────────
// router.use('/maintenance', require('../modules/maintenance/maintenance.routes'));

// ── Feedback ─────────────────────────────────────────────────────────────────
// router.use('/feedback', require('../modules/feedback/feedback.routes'));

// ── Notifications ─────────────────────────────────────────────────────────────
// router.use('/notifications', require('../modules/notifications/notifications.routes'));

// ── Settings ─────────────────────────────────────────────────────────────────
// router.use('/settings', require('../modules/settings/settings.routes'));

// ── Audit Logs ───────────────────────────────────────────────────────────────
// router.use('/audit-logs', require('../modules/auditLogs/auditLogs.routes'));

module.exports = router;

