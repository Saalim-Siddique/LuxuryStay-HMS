# System Architecture – LuxuryStay Hospitality HMS

> **Document Version:** 1.0  
> **Date:** 2026-11-25  
> **Architecture Style:** Modular Monolith  
> **Stack:** MERN (MongoDB · Express.js · React.js · Node.js)

---

## 1. High-Level Overview

LuxuryStay HMS is a **multi-hotel hospitality management platform** built as a **Modular Monolith**. The system is split into two independently runnable applications that communicate over HTTP/REST:

```
┌────────────────────────────────────────────────────────────────┐
│                        CLIENT  (React + Vite)                  │
│   7 Portal Interfaces  ·  Axios HTTP Client  ·  React Router   │
└───────────────────────────────┬────────────────────────────────┘
                                │  REST API  (JSON / HTTPS)
                                ▼
┌────────────────────────────────────────────────────────────────┐
│                     SERVER  (Node.js + Express)                │
│   Auth Middleware  ·  Role Guard  ·  Hotel Scope Guard         │
│   Modular Route/Controller/Service/Model layers                │
└───────────────────────────────┬────────────────────────────────┘
                                │  Mongoose ODM
                                ▼
┌────────────────────────────────────────────────────────────────┐
│                     MongoDB Atlas (Cloud)                      │
│   17 Collections  ·  Indexes  ·  Relationships via refs        │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. Application Boundaries

| Application | Technology | Purpose |
|-------------|-----------|---------|
| `client/` | React 18 + Vite + Bootstrap 5 | All user-facing portals (SPA) |
| `server/` | Node.js 20 + Express.js | REST API, business logic, DB access |

Both applications are developed, versioned and deployed as separate units but share a single MongoDB Atlas cluster.

---

## 3. Client Architecture

### 3.1 Portal Interfaces

The SPA hosts **7 distinct portal interfaces** routed under separate path prefixes:

| Portal | Path Prefix | Primary Users |
|--------|-------------|---------------|
| Public Booking Interface | `/` | Anonymous visitors |
| Guest Portal | `/guest/*` | Checked-in / registered guests |
| Receptionist Portal | `/reception/*` | Front-desk staff |
| Housekeeping Portal | `/housekeeping/*` | Housekeeping staff |
| Manager Portal | `/manager/*` | Property managers |
| Hotel Admin Portal | `/hotel-admin/*` | Hotel administrators |
| Super Admin Portal | `/super-admin/*` | Platform super administrator |

### 3.2 Client Layer Diagram

```
client/src/
├── layouts/          ← Portal-specific shell components (nav, sidebar, footer)
├── pages/            ← Route-mapped page components (one per screen)
├── components/       ← Reusable UI components
├── hooks/            ← Custom React hooks (useAuth, useBooking, etc.)
├── services/         ← Axios service modules (one per API domain)
├── context/          ← React Context providers (AuthContext, HotelContext)
├── utils/            ← Shared helpers, formatters, validators
└── assets/           ← Fonts, images, global CSS
```

### 3.3 State Management

| Concern | Mechanism |
|---------|-----------|
| Auth state (user, token, role) | `AuthContext` (React Context + localStorage) |
| Active hotel scope | `HotelContext` (React Context) |
| Server state / caching | Axios service layer with local state |
| UI state | Local `useState` per component |

No external state library (Redux / Zustand) is used to keep the architecture simple and maintainable.

### 3.4 Routing Strategy

- **React Router v6** handles all navigation.
- `PrivateRoute` wrappers enforce authentication at the route level.
- `RoleRoute` wrappers enforce role-based access per portal prefix.
- Unauthorized access attempts redirect to the appropriate login page.

---

## 4. Server Architecture

### 4.1 Modular Domain Structure

Each business domain is a self-contained module under `server/modules/`:

```
server/modules/
├── auth/
├── users/
├── hotels/
├── guests/
├── rooms/
├── roomTypes/
├── bookings/
├── checkIns/
├── payments/
├── invoices/
├── services/
├── serviceRequests/
├── housekeeping/
├── maintenance/
├── feedback/
├── notifications/
├── settings/
└── auditLogs/
```

Each module contains:
```
<module>/
├── <module>.routes.js        ← Express Router
├── <module>.controller.js    ← Request/response handling
├── <module>.service.js       ← Business logic
├── <module>.model.js         ← Mongoose schema & model
└── <module>.validator.js     ← Input validation rules (express-validator)
```

### 4.2 Request Lifecycle

```
Incoming HTTP Request
        │
        ▼
  Express App (server/app.js)
        │
        ▼
  Global Middleware
  ├── CORS
  ├── Helmet (security headers)
  ├── morgan (logging)
  ├── express.json() (body parser)
  └── Rate Limiter
        │
        ▼
  Route Matching  (server/routes/index.js)
        │
        ▼
  Auth Middleware  (verifyToken)
  ├── Validates JWT signature & expiry
  └── Attaches req.user (id, role, hotelId[])
        │
        ▼
  Role Guard Middleware  (requireRole)
  └── Checks req.user.role against allowed roles
        │
        ▼
  Hotel Scope Guard  (requireHotelAccess)
  └── Verifies hotelId in route is in req.user.hotelIds
        │
        ▼
  Input Validator  (express-validator chains)
        │
        ▼
  Controller  (parse params, call service)
        │
        ▼
  Service Layer  (pure business logic, DB calls)
        │
        ▼
  Mongoose Model  (MongoDB Atlas)
        │
        ▼
  JSON Response  (standardised envelope)
```

### 4.3 Standardised API Response Envelope

```json
{
  "success": true,
  "message": "Operation completed.",
  "data": { ... },
  "meta": {
    "page": 1,
    "totalPages": 5,
    "totalCount": 48
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "email", "message": "Must be a valid email address." }
  ]
}
```

---

## 5. Authentication & Authorization Flow

```
1. User submits credentials → POST /api/auth/login
2. Server verifies email + bcrypt password hash
3. Server issues:
   - accessToken  (JWT, 15 min, stored in memory / httpOnly cookie)
   - refreshToken (JWT, 7 days, stored httpOnly cookie)
4. Client attaches accessToken to every API request (Authorization: Bearer)
5. Server middleware verifies token on every protected route
6. On expiry, client calls POST /api/auth/refresh → new accessToken
7. Logout invalidates refreshToken server-side (token blacklist or rotation)
```

**Role hierarchy (descending privilege):**
`superAdmin` → `hotelAdmin` → `manager` → `receptionist` → `housekeeping` → `guest`

---

## 6. Multi-Hotel Scoping

Every hotel-scoped resource carries a `hotelId` field.

Backend enforcement rules:
1. `superAdmin` – unrestricted access to all hotels.
2. `hotelAdmin` / `manager` / `receptionist` / `housekeeping` – access only to hotels listed in `user.hotelIds`.
3. Any `hotelId` supplied by the client is **re-validated** against `req.user.hotelIds` in the `requireHotelAccess` middleware before the controller executes.
4. Guests are scoped by `guestId`; they never receive `hotelId` write permissions.

---

## 7. Inter-Module Dependencies

```
bookings ──depends on──► rooms, guests, hotels, roomTypes
checkIns ──depends on──► bookings, rooms, guests
payments ──depends on──► bookings, guests
invoices ──depends on──► payments, bookings, guests
serviceRequests ──depends on──► services, guests, rooms
housekeeping ──depends on──► rooms, users (housekeeping role)
maintenance ──depends on──► rooms, hotels, users
feedback ──depends on──► guests, hotels
notifications ──depends on──► users (all roles)
auditLogs ──depends on──► users, hotels (all write operations)
```

---

## 8. Security Considerations

| Concern | Implementation |
|---------|---------------|
| Password storage | bcrypt with salt rounds ≥ 12 |
| Token transport | httpOnly cookies + short-lived JWT |
| Role spoofing | Backend re-validates role & hotelId on every request |
| Mass assignment | Mongoose `select: false` on sensitive fields; explicit field whitelisting in controllers |
| Injection attacks | Mongoose parameterised queries; express-validator sanitisation |
| Rate limiting | express-rate-limit on auth endpoints (login, register, refresh) |
| CORS | Whitelist of allowed origins; credentials: true |
| Security headers | helmet.js defaults |
| Audit trail | Every CUD operation writes to `auditLogs` |
| Data exposure | Guest PII fields returned only to authorised roles |

---

## 9. External Dependencies Summary

| Package | Purpose |
|---------|---------|
| `react`, `react-dom` | UI rendering |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP client |
| `bootstrap` | Responsive grid + components |
| `recharts` | Dashboard charts |
| `express` | HTTP framework |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT generation & verification |
| `bcryptjs` | Password hashing |
| `express-validator` | Input validation |
| `helmet` | HTTP security headers |
| `cors` | Cross-origin resource sharing |
| `express-rate-limit` | Rate limiting |
| `morgan` | Request logging |
| `dotenv` | Environment variable management |
| `multer` | File upload handling |
| `nodemailer` | Email notifications |

