'use strict';

const { NODE_ENV } = require('../config/env');

/**
 * Centralised API response helpers.
 * Always use these in controllers – never construct response objects manually.
 */

const success = (res, data = null, message = 'Success', statusCode = 200, meta = null) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

const created = (res, data = null, message = 'Resource created successfully') => {
  return success(res, data, message, 201);
};

const error = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const payload = { success: false, message };
  if (errors !== null) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

const validationError = (res, errors) => {
  return res.status(422).json({
    success: false,
    message: 'Validation failed.',
    errors,
  });
};

const notFound = (res, message = 'Resource not found') => {
  return error(res, message, 404);
};

const unauthorized = (res, message = 'Authentication required') => {
  return error(res, message, 401);
};

const forbidden = (res, message = 'Access denied') => {
  return error(res, message, 403);
};

const conflict = (res, message = 'Resource conflict') => {
  return error(res, message, 409);
};

const paginated = (res, data, page, limit, totalCount, message = 'Success') => {
  return success(res, data, message, 200, {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  });
};

module.exports = { success, created, error, validationError, notFound, unauthorized, forbidden, conflict, paginated };

