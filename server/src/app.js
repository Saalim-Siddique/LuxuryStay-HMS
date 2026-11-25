'use strict';

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const cookieParser = require('cookie-parser');

const {
  CLIENT_ORIGIN,
  NODE_ENV,
  COOKIE_SECRET,
  IS_PRODUCTION,
} = require('./config/env');

const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler   = require('./middleware/errorHandler');
const notFound       = require('./middleware/notFound');
const apiRoutes      = require('./routes/index');

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
//
// Design decisions:
//  • credentials: true  – required so the browser sends the httpOnly refresh-token
//                         cookie on cross-origin requests.
//  • origin           – must be an explicit string/array (never "*") when
//                         credentials: true is set.
//  • In production, CLIENT_ORIGIN should be set to the real frontend URL.
//    Multiple origins can be supported by setting CLIENT_ORIGIN to a
//    comma-separated list: "https://app.luxurystay.com,https://admin.luxurystay.com"
//
const allowedOrigins = CLIENT_ORIGIN
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman in dev)
      if (!origin && !IS_PRODUCTION) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin "${origin}" is not allowed.`));
    },
    credentials: true,  // ← REQUIRED for cookies
    methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count'],
  })
);

// Pre-flight requests
app.options('*', cors());

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// cookieParser with COOKIE_SECRET signs cookies for extra integrity
app.use(cookieParser(COOKIE_SECRET));

// ── HTTP request logging ──────────────────────────────────────────────────────
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ── Global rate limiter ───────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/v1', apiRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use(notFound);

// ── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

module.exports = app;
