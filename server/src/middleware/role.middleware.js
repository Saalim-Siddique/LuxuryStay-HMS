'use strict';

const { ROLES } = require('../config/constants');
const { forbidden } = require('../utils/apiResponse');

/**
 * requireRole – checks that req.user.role is in the allowedRoles array.
 *
 * Usage:  router.get('/...', verifyToken, requireRole([ROLES.SUPER_ADMIN, ROLES.HOTEL_ADMIN]), controller)
 */
const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return forbidden(res, 'Access denied. No user context.');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return forbidden(res, 'Access denied. Insufficient permissions.');
    }

    return next();
  };
};

/**
 * requireSuperAdmin – shorthand guard for superAdmin-only routes.
 */
const requireSuperAdmin = requireRole([ROLES.SUPER_ADMIN]);

module.exports = { requireRole, requireSuperAdmin };

