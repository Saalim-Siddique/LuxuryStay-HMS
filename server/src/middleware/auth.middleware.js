'use strict';

const jwt = require('jsonwebtoken');
const { JWT_ACCESS_SECRET } = require('../config/env');
const { unauthorized } = require('../utils/apiResponse');

/**
 * verifyToken – validates the JWT access token from the Authorization header.
 * Attaches req.user = { id, role, hotelIds, email } on success.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res, 'No authentication token provided.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
      hotelIds: decoded.hotelIds || [],
      email: decoded.email,
    };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return unauthorized(res, 'Access token has expired. Please refresh your session.');
    }
    return unauthorized(res, 'Invalid access token.');
  }
};

module.exports = { verifyToken };

