'use strict';

/**
 * 404 Not Found handler.
 * Mounted after all routes in app.js.
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = notFound;

