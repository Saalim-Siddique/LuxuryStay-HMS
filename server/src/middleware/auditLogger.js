'use strict';

const logger = require('../utils/logger');

/**
 * auditLogger – middleware factory that writes an audit log entry
 * for every mutating request (POST, PUT, PATCH, DELETE).
 *
 * This is a lightweight stub. The actual AuditLog Mongoose model
 * and service will be wired in Phase 1.
 *
 * Usage:  router.post('/', verifyToken, auditLogger('booking.created', 'bookings'), controller)
 */
const auditLogger = (action, targetCollection) => {
  return async (req, res, next) => {
    // Store original json to intercept the response
    const originalJson = res.json.bind(res);

    res.json = async (body) => {
      // Only log on successful mutations
      if (body && body.success && req.user) {
        try {
          // AuditLog model import deferred to avoid circular deps during scaffold phase.
          // Replace the dynamic require with a proper service call in Phase 1.
          const AuditLog = (() => {
            try { return require('../modules/auditLogs/auditLogs.model'); } catch { return null; }
          })();

          if (AuditLog) {
            await AuditLog.create({
              hotelId: req.params.hotelId || req.body?.hotelId || null,
              actorId: req.user.id,
              actorRole: req.user.role,
              actorEmail: req.user.email,
              action,
              targetCollection,
              targetId: body.data?._id || null,
              changes: { body: req.body },
              ipAddress: req.ip,
              userAgent: req.get('user-agent'),
            });
          }
        } catch (err) {
          logger.error('Audit log write failed:', err.message);
          // Never block the response due to audit log failure
        }
      }

      return originalJson(body);
    };

    return next();
  };
};

module.exports = { auditLogger };

