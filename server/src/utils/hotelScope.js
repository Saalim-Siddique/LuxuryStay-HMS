'use strict';

/**
 * hotelScopeFilter – produces a Mongoose query filter that enforces hotel scope.
 *
 * Usage in a service:
 *   const filter = hotelScopeFilter(req.user, hotelId);
 *   const bookings = await Booking.find(filter);
 *
 * Design:
 *  - superAdmin receives an empty partial filter (or the explicit hotelId if supplied).
 *  - All other roles receive { hotelId: <verified id> }.
 *  - The hotelId passed here must already have been validated by requireHotelAccess
 *    middleware, so no additional trust check is needed inside the service.
 *
 * @param {object} user     - req.user ({ id, role, hotelIds })
 * @param {string} hotelId  - the hotelId from the validated request context
 * @returns {object}        - Mongoose partial filter object
 */
const { ROLES } = require('../config/constants');

const hotelScopeFilter = (user, hotelId) => {
  if (user.role === ROLES.SUPER_ADMIN) {
    // Super admin: scope to explicit hotelId if given, otherwise unrestricted
    return hotelId ? { hotelId } : {};
  }
  // All other roles: always scope to the validated hotelId
  return { hotelId };
};

/**
 * addHotelScope – adds hotelId to any Mongoose query object in-place.
 * Convenience wrapper around hotelScopeFilter.
 *
 * @param {object} query    - existing Mongoose filter object
 * @param {object} user     - req.user
 * @param {string} hotelId  - validated hotelId
 * @returns {object}        - mutated query object
 */
const addHotelScope = (query = {}, user, hotelId) => {
  return { ...query, ...hotelScopeFilter(user, hotelId) };
};

module.exports = { hotelScopeFilter, addHotelScope };

