'use strict';

/**
 * AppError – custom error class that carries an HTTP status code.
 *
 * Throw this from service-layer functions; the global errorHandler middleware
 * reads err.statusCode and err.message to build the JSON response.
 *
 * Usage:
 *   throw new AppError('Room not available for the requested dates.', 409);
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;  // flag distinguishes known errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

