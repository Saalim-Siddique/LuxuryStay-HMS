'use strict';

/**
 * cookieOptions – returns the correct Set-Cookie options based on environment.
 *
 * Used by the auth module when issuing the httpOnly refresh-token cookie.
 *
 * Local dev  : Secure=false, SameSite=Lax  (HTTP localhost)
 * Production : Secure=true,  SameSite=Strict (HTTPS required)
 */
const {
  COOKIE_SECURE,
  COOKIE_SAME_SITE,
  COOKIE_DOMAIN,
  JWT_REFRESH_EXPIRES_IN,
} = require('../config/env');

/**
 * Parse a JWT expiry string like "7d", "24h", "30m" into milliseconds.
 */
const parseDurationMs = (str) => {
  const unit  = str.slice(-1);
  const value = parseInt(str.slice(0, -1), 10);
  const map   = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return value * (map[unit] || 86_400_000);
};

const refreshTokenCookieOptions = () => ({
  httpOnly:  true,
  secure:    COOKIE_SECURE,
  sameSite:  COOKIE_SAME_SITE,
  maxAge:    parseDurationMs(JWT_REFRESH_EXPIRES_IN),  // milliseconds
  path:      '/api/v1/auth',   // restrict cookie to auth endpoints only
  ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
});

/**
 * clearRefreshTokenCookieOptions – options used when clearing the cookie on logout.
 * Must match the original cookie's path/domain/secure settings.
 */
const clearRefreshTokenCookieOptions = () => ({
  httpOnly:  true,
  secure:    COOKIE_SECURE,
  sameSite:  COOKIE_SAME_SITE,
  path:      '/api/v1/auth',
  maxAge:    0,
  expires:   new Date(0),
  ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
});

module.exports = { refreshTokenCookieOptions, clearRefreshTokenCookieOptions };

