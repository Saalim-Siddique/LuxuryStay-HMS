'use strict';

const { NODE_ENV } = require('../config/env');
const logger = require('../utils/logger');

/**
 * Global error-handling middleware.
 * Must be the LAST middleware registered in app.js.
 *
 * Handles:
 *  - AppError (operational, known statusCode)
 *  - Mongoose ValidationError, duplicate key (11000), CastError
 *  - JWT errors
 *  - Generic / unexpected errors
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log the full error in development; message-only in production
  if (NODE_ENV === 'development') {
    logger.error(err);
  } else {
    logger.error(err.message);
  }

  // ── Operational errors (thrown via AppError) ──────────────────────────────
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // ── Mongoose validation error ─────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field:   e.path,
      message: e.message,
    }));
    return res.status(422).json({ success: false, message: 'Validation failed.', errors });
  }

  // ── Mongoose duplicate key ────────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `A record with that ${field} already exists.`,
    });
  }

  // ── Mongoose cast error (invalid ObjectId) ────────────────────────────────
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid value for field: ${err.path}`,
    });
  }

  // ── JWT errors ────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token has expired.' });
  }

  // ── CORS error ────────────────────────────────────────────────────────────
  if (err.message && err.message.startsWith('CORS:')) {
    return res.status(403).json({ success: false, message: err.message });
  }

  // ── Generic / unhandled (do not leak internals in production) ─────────────
  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode < 500 || NODE_ENV !== 'production'
    ? err.message || 'An error occurred.'
    : 'Internal server error.';

  return res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
