'use strict';

const { ROLES } = require('../config/constants');
const { forbidden } = require('../utils/apiResponse');

/**
 * requireHotelAccess – middleware that verifies the requesting user is authorised
 * to access the hotelId referenced in the current request.
 *
 * HOW IT WORKS
 * ─────────────
 * 1. superAdmin is exempt — unrestricted access to all hotels.
 * 2. For all other roles, the hotelId is resolved (in priority order) from:
 *      a. req.params.hotelId   — route param e.g. GET /hotels/:hotelId/rooms
 *      b. req.body.hotelId     — creation payloads
 *      c. req.query.hotelId    — list/filter queries
 * 3. The resolved hotelId is checked against req.user.hotelIds (embedded in
 *    the JWT by the auth service at login time).
 * 4. On success, req.verifiedHotelId is set so downstream controllers and
 *    services can use it without re-resolving.
 *
 * IMPORTANT — DB-LAYER ENFORCEMENT
 * ───────────────────────────────────
 * This middleware validates *access* but does NOT guarantee query scope.
 * Every service function that reads/writes hotel-scoped collections MUST
 * additionally use the hotelScopeFilter() helper from utils/hotelScope.js
 * to include hotelId in the MongoDB filter. This provides defence-in-depth:
 * even if the middleware were bypassed, the DB query would still return only
 * the correct hotel's documents.
 *
 * Usage:
 *   router.get('/:hotelId/rooms', verifyToken, requireHotelAccess, roomsController.list);
 */
const requireHotelAccess = (req, res, next) => {
  if (!req.user) {
    return forbidden(res, 'Access denied. No user context.');
  }

  // Super admin bypasses scope check
  if (req.user.role === ROLES.SUPER_ADMIN) {
    req.verifiedHotelId = req.params.hotelId || req.body?.hotelId || req.query.hotelId || null;
    return next();
  }

  const hotelId =
    req.params.hotelId ||
    req.body?.hotelId  ||
    req.query.hotelId;

  if (!hotelId) {
    return forbidden(res, 'Hotel context is required for this operation.');
  }

  const hasAccess = req.user.hotelIds.some(
    (id) => id.toString() === hotelId.toString()
  );

  if (!hasAccess) {
    return forbidden(res, 'Access denied. You are not authorised for this hotel.');
  }

  // Expose the verified hotelId for downstream use
  req.verifiedHotelId = hotelId;
  return next();
};

module.exports = { requireHotelAccess };
