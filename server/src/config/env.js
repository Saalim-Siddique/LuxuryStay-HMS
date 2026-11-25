'use strict';

require('dotenv').config();

const required = [
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
  PORT:                    parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV:                process.env.NODE_ENV || 'development',
  MONGODB_URI:             process.env.MONGODB_URI,

  // JWT
  JWT_ACCESS_SECRET:       process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET:      process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN:   process.env.JWT_ACCESS_EXPIRES_IN  || '15m',
  JWT_REFRESH_EXPIRES_IN:  process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // Password hashing
  BCRYPT_SALT_ROUNDS:      parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,

  // CORS
  CLIENT_ORIGIN:           process.env.CLIENT_ORIGIN || 'http://localhost:5173',

  // Cookie settings for the httpOnly refresh-token cookie
  // In production: Secure=true, SameSite=Strict (or None if cross-origin)
  REFRESH_TOKEN_COOKIE_NAME: process.env.REFRESH_TOKEN_COOKIE_NAME || 'hms_rt',
  COOKIE_SECRET:           process.env.COOKIE_SECRET || 'change_this_cookie_secret',
  COOKIE_SECURE:           process.env.COOKIE_SECURE === 'true' || IS_PRODUCTION,
  COOKIE_SAME_SITE:        process.env.COOKIE_SAME_SITE || (IS_PRODUCTION ? 'Strict' : 'Lax'),
  COOKIE_DOMAIN:           process.env.COOKIE_DOMAIN || undefined,

  // Email
  EMAIL_HOST:              process.env.EMAIL_HOST,
  EMAIL_PORT:              parseInt(process.env.EMAIL_PORT, 10) || 587,
  EMAIL_USER:              process.env.EMAIL_USER,
  EMAIL_PASS:              process.env.EMAIL_PASS,

  // Computed flags
  IS_PRODUCTION,
  IS_DEVELOPMENT:          process.env.NODE_ENV === 'development',
};
