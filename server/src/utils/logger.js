'use strict';

const { NODE_ENV } = require('../config/env');

/**
 * Simple console logger with timestamps.
 * Swap for winston/pino later if needed.
 */

const timestamp = () => new Date().toISOString();

const info = (...args) => console.log(`[${timestamp()}] INFO:`, ...args);
const warn = (...args) => console.warn(`[${timestamp()}] WARN:`, ...args);
const err = (...args) => console.error(`[${timestamp()}] ERROR:`, ...args);
const debug = (...args) => {
  if (NODE_ENV === 'development') console.debug(`[${timestamp()}] DEBUG:`, ...args);
};

module.exports = { info, warn, error: err, debug };

