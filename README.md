# LuxuryStay Hospitality – Hotel Management System (HMS)

> A multi-hotel hospitality management platform built with the MERN stack, featuring a luxury editorial public booking storefront and six role-based operational portals.

---

## Project Overview

**LuxuryStay HMS** is designed to manage multi-property luxury hotels from public discovery and reservations through front-desk check-in/out, billing, housekeeping, maintenance, guest services, and executive analytics.

### Current Project State

- **Architecture & Specifications:** Complete system architecture, database schema design (17 collections), 30 business rules, role-permission matrix, and 6-phase delivery roadmap documented in [`docs/`](./docs/).
- **Frontend (`client/`):** React 19 + Vite 8 application configured with Bootstrap 5, custom luxury design tokens, `AuthContext` (in-memory access token + `httpOnly` refresh cookie strategy), `HotelContext`, Axios auto-refresh interceptors, protected route wrappers, reusable UI component library, and an interactive **Public Showcase & Reservation Flow** (`/`, `/hotels`, `/hotels/:hotelSlug`, `/hotels/:hotelSlug/rooms/:roomSlug`, `/booking`, plus dev-only `/design-system`).
- **Backend (`server/`):** Express 5 + Mongoose 9 API server scaffolded with startup environment validation, MongoDB Atlas connection handling, Helmet, multi-origin CORS with credentials, Morgan logging, rate limiters, JWT/role/hotel-scope middleware, audit logger, global error handler, standardized response utilities, a live `/api/v1/health` endpoint, and 18 domain module skeletons ready for phased implementation.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React **19** + Vite **8** |
| **UI & Styling** | Bootstrap **5**, Custom CSS Design System (`variables.css`, `global.css`, `components.css`, `public.css`), React Icons |
| **Routing & State** | React Router **v7**, React Context (`AuthContext`, `HotelContext`) |
| **HTTP & Notifications** | Axios **1.x** (with token refresh queue), React Hot Toast |
| **Charts (Planned Portals)** | Recharts **3.x** |
| **Backend Runtime** | Node.js **≥ 18** + Express **5.x** |
| **Database & ODM** | MongoDB Atlas + Mongoose **9.x** |
| **Security & Auth** | JWT (short-lived in-memory access token + `httpOnly` refresh cookie), `bcryptjs`, `helmet`, `cors`, `cookie-parser`, `express-rate-limit` |
| **Validation & Tooling** | `express-validator`, `morgan`, `dotenv`, `nodemon`, `oxlint` |

---

## Main Features & Planned Modules

### Implemented Foundation & Public Experience

- **Public Luxury Storefront (`/`)**: Editorial hero search, featured properties, hospitality ethos, seasonal offers, curated experiences, and property gallery modal.
- **Collection Directory (`/hotels`)**: Searchable, filterable (location, property type, amenities, guest capacity, dates), sortable, and paginated hotel listing with URL query synchronization.
- **Property & Suite Detail Views (`/hotels/:hotelSlug`, `/hotels/:hotelSlug/rooms/:roomSlug`)**: Image galleries, hotel highlights, amenities catalog, live date-range availability & tariff calculation.
- **Reservation Interface (`/booking`)**: Multi-step booking flow with promo offer support, pricing breakdown, validation, and reservation folio preview (currently backed by structured public showcase data in `client/src/data/public/`).
- **Authentication & API Security Scaffold**:
  - In-memory JWT access token (`15m`) + `httpOnly` `SameSite` refresh cookie (`7d`) architecture.
  - Backend middleware for JWT verification, role authorization, multi-hotel data scoping (`requireHotelAccess` / `hotelScopeFilter`), rate limiting, and audit logging.
  - Health endpoint live at `GET /api/v1/health`.

### Application Portals (7 Portals)

| Portal | Route Prefix | Role | Status |
|--------|--------------|------|--------|
| Public Booking Interface | `/` | Anonymous | Public storefront & booking flow implemented (mock data) |
| Guest Portal | `/guest/*` | `guest` | Route guard ready — UI & API planned (Phase 3) |
| Receptionist Portal | `/reception/*` | `receptionist` | Route guard ready — UI & API planned (Phase 4) |
| Housekeeping Portal | `/housekeeping/*` | `housekeeping` | Route guard ready — UI & API planned (Phase 5) |
| Manager Portal | `/manager/*` | `manager` | Route guard ready — UI & API planned (Phase 4–6) |
| Hotel Admin Portal | `/hotel-admin/*` | `hotelAdmin` | Route guard ready — UI & API planned (Phase 2) |
| Super Admin Portal | `/super-admin/*` | `superAdmin` | Route guard ready — UI & API planned (Phase 2 & 6) |

### Planned Backend Modules (`server/src/modules/`)

The API server has 18 modular domains scaffolded under `server/src/modules/` following the 6-phase roadmap:

- **Phase 1 (Auth & Foundation):** `auth`, `users`, `guests`, `auditLogs`
- **Phase 2 (Properties & Inventory):** `hotels`, `roomTypes`, `rooms`, `settings`
- **Phase 3 (Booking & Feedback):** `bookings`, `invoices`, `feedback`
- **Phase 4 (Front-Desk & Billing):** `checkIns`, `payments`
- **Phase 5 (Operations & Guest Services):** `housekeeping`, `maintenance`, `services`, `serviceRequests`
- **Phase 6 (Notifications & Analytics):** `notifications` + analytics aggregation endpoints

### Architecture Documentation

All design specifications are stored in [`docs/`](./docs/):

| Document | Description |
|----------|-------------|
| [system-architecture.md](./docs/system-architecture.md) | High-level architecture, request lifecycle, and security model |
| [database-design.md](./docs/database-design.md) | All 17 MongoDB collections with schemas, indexes, and relationships |
| [role-permission-matrix.md](./docs/role-permission-matrix.md) | Per-module permission matrix across all 6 roles |
| [folder-structure.md](./docs/folder-structure.md) | Target folder layout and file/code naming conventions |
| [development-roadmap.md](./docs/development-roadmap.md) | 6-phase delivery plan with backend and frontend checklists |
| [business-rules.md](./docs/business-rules.md) | 30 backend-enforced business rules |
| [architecture-diagram.md](./docs/architecture-diagram.md) | System, authentication, lifecycle, and dependency diagrams |

---

## Folder Structure

```text
LuxuryStay-HMS/
├── .env.example                     # Reference template (configure server/.env & client/.env)
├── .gitignore                       # Root Git exclusions (node_modules, .env*, dist/, secrets, logs)
├── README.md                        # Project documentation & setup guide
├── docs/                            # Architecture & planning specifications
│   ├── architecture-diagram.md
│   ├── business-rules.md
│   ├── database-design.md
│   ├── development-roadmap.md
│   ├── folder-structure.md
│   ├── role-permission-matrix.md
│   └── system-architecture.md
│
├── client/                          # React 19 + Vite 8 Frontend SPA
│   ├── .env.example                 # Frontend environment placeholder template
│   ├── .gitignore
│   ├── .oxlintrc.json               # Oxlint configuration
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js               # Vite config & /api proxy to localhost:5000
│   ├── public/
│   │   └── images/public/           # Static editorial & hotel showcase photography
│   └── src/
│       ├── main.jsx                 # App entry point (Bootstrap + global CSS imports)
│       ├── App.jsx                  # AuthProvider > HotelProvider > AppRouter > Toaster
│       ├── components/
│       │   ├── cards/               # StatCard
│       │   ├── common/              # Badge, Breadcrumb, Button, Card, ConfirmDialog, Dropdown, EmptyState, ErrorState, LoadingSpinner, Modal, PageHeader, Pagination, Spinner
│       │   ├── forms/               # FieldShell, Input, SearchInput, Select, Textarea
│       │   ├── public/              # PublicLayout, PublicNavbar, PublicFooter, HeroSection, HotelCard, RoomCard, HotelGallery, HotelSearchForm, BookingSummary, DateRangeSelector, PriceDisplay, AmenityList, SectionHeading
│       │   └── tables/              # DataTable, Table
│       ├── context/                 # AuthContext, HotelContext
│       ├── data/public/             # Public collection, room types, amenities, offers, experiences
│       ├── hooks/                   # useAuth, useHotel, usePagination
│       ├── pages/
│       │   ├── auth/                # LoginPage (stub)
│       │   ├── common/              # NotFoundPage, UnauthorizedPage
│       │   ├── dev/                 # DesignSystemPreviewPage (dev-only)
│       │   └── public/              # HomePage, HotelsPage, HotelDetailPage, RoomDetailPage, BookingPage
│       ├── routes/                  # AppRouter, PrivateRoute, RoleRoute
│       ├── services/                # api.js + domain API service modules
│       ├── styles/                  # variables.css, global.css, components.css, public.css
│       └── utils/                   # constants.js, formatters.js
│
└── server/                          # Node.js + Express 5 Backend API
    ├── .env.example                 # Backend environment placeholder template
    ├── .gitignore
    ├── nodemon.json                 # Nodemon dev watch config
    ├── package.json
    ├── package-lock.json
    └── src/
        ├── app.js                   # Express app (Helmet, CORS, Morgan, rate limiter, routes, errors)
        ├── server.js                # HTTP server entry point & graceful shutdown
        ├── config/                  # env.js (startup validation), db.js (Mongoose), constants.js
        ├── middleware/              # auth, role, hotelScope, rateLimiter, auditLogger, errorHandler, notFound
        ├── routes/                  # index.js (/api/v1 router & /health endpoint)
        ├── modules/                 # 18 domain modules (controller, model, routes, service, validator stubs)
        └── utils/                   # apiResponse, AppError, cookieOptions, hotelScope, logger, pagination
```

---

## Installation Instructions

### Prerequisites

- **Node.js** `>= 18.0.0` (LTS recommended) and **npm**
- **MongoDB Atlas** cluster (or a local MongoDB instance)
- **Git**

### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd LuxuryStay-HMS
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## Environment Variable Setup

Never commit `.env` files or real credentials to Git. Both `server/` and `client/` provide `.env.example` templates with safe placeholders.

### Backend (`server/.env`)

```bash
cd server
cp .env.example .env
```

> On Windows PowerShell: `Copy-Item .env.example .env`

Generate cryptographically strong random secrets for JWT and cookie signing:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Update `server/.env` with your values:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | HTTP server port |
| `NODE_ENV` | No | `development` | Runtime environment (`development` or `production`) |
| `MONGODB_URI` | **Yes** | — | MongoDB Atlas or local connection string |
| `JWT_ACCESS_SECRET` | **Yes** | — | Secret key used to sign short-lived access tokens |
| `JWT_REFRESH_SECRET` | **Yes** | — | Separate secret key used to sign refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | Access token lifetime |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh token lifetime |
| `BCRYPT_SALT_ROUNDS` | No | `12` | Salt rounds for password hashing |
| `CLIENT_ORIGIN` | No | `http://localhost:5173` | Allowed frontend origin(s), comma-separated |
| `REFRESH_TOKEN_COOKIE_NAME` | No | `hms_rt` | Name of the `httpOnly` refresh cookie |
| `COOKIE_SECRET` | Recommended | `change_this_cookie_secret` | Secret for signing cookies via `cookie-parser` |
| `COOKIE_SECURE` | No | `false` (`true` in prod) | Require HTTPS for cookies |
| `COOKIE_SAME_SITE` | No | `Lax` (`Strict` in prod) | Cookie `SameSite` policy (`Lax`, `Strict`, or `None`) |
| `COOKIE_DOMAIN` | No | — | Optional apex domain in production (e.g. `.luxurystay.com`) |
| `EMAIL_HOST` | No | — | SMTP host for transactional emails (Phase 6) |
| `EMAIL_PORT` | No | `587` | SMTP port |
| `EMAIL_USER` | No | — | SMTP username |
| `EMAIL_PASS` | No | — | SMTP password |

> **MongoDB Atlas Note:** Ensure your development IP address is allowlisted in Atlas Network Access and your database user has `readWrite` permissions on the `luxurystay` database.

### Frontend (`client/.env`)

```bash
cd client
cp .env.example .env
```

> On Windows PowerShell: `Copy-Item .env.example .env`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | `http://localhost:5000/api/v1` | Base URL for Axios API requests |
| `VITE_APP_NAME` | No | `LuxuryStay HMS` | Application display title |

---

## How to Run Frontend and Backend

Open two terminals from the repository root:

### Terminal 1 — Start the Backend API

```bash
cd server
npm run dev
```

- Uses `nodemon` (`server/nodemon.json`) to watch `server/src/`.
- For production execution without `nodemon`: `npm start`.
- Verify the API is running by visiting: `http://localhost:5000/api/v1/health`

> Note: `server/src/config/env.js` validates `MONGODB_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` on startup and exits if any are missing.

### Terminal 2 — Start the Frontend Client

```bash
cd client
npm run dev
```

- Launches Vite dev server at `http://localhost:5173`.
- Proxies `/api` requests to `http://localhost:5000` (configured in `client/vite.config.js`).
- Other client scripts:
  - `npm run build` — Builds production bundle into `client/dist/` (ignored by Git).
  - `npm run preview` — Previews the production build locally.
  - `npm run lint` — Runs `oxlint` across `client/`.

---

## Git Collaboration Instructions

### Branching Strategy

- **`main`**: Protected baseline branch. Keep it clean, runnable, and review-gated.
- **Feature / Fix Branches**: Create a new branch from an up-to-date `main` for every task:
  - `feat/<module-or-feature>` (e.g. `feat/phase1-auth-endpoints`)
  - `fix/<bug-description>` (e.g. `fix/booking-date-overlap`)
  - `docs/<topic>` (e.g. `docs/api-contracts`)
  - `chore/<task>` (e.g. `chore/update-gitignore`)

### Daily Git Workflow

```bash
# 1. Sync main before starting new work
git checkout main
git pull origin main

# 2. Create a descriptive feature branch
git checkout -b feat/auth-module

# 3. Stage and commit focused changes
git status
git add <files>
git commit -m "feat(auth): implement staff and guest login endpoints"

# 4. Keep your branch up to date with main before opening a PR
git fetch origin
git rebase origin/main   # or: git merge origin/main

# 5. Push your feature branch and open a Pull Request
git push -u origin feat/auth-module
```

### Repository Hygiene Rules

- **Never commit** `.env`, `.env.*` (except `.env.example`), `node_modules/`, `client/dist/`, `logs/`, `uploads/`, certificates, private keys, or real credentials.
- Before staging files, run `git status` and review `git diff` to make sure no temporary files or secrets are included.
- Do not rewrite shared history on `main` (`git push --force` is disallowed on shared branches).

---

## Team Contribution Guidelines

1. **Read the Architecture Docs First:** Review [`docs/development-roadmap.md`](./docs/development-roadmap.md), [`docs/business-rules.md`](./docs/business-rules.md), [`docs/role-permission-matrix.md`](./docs/role-permission-matrix.md), and [`docs/folder-structure.md`](./docs/folder-structure.md) before modifying or implementing modules.
2. **Follow Naming & Layout Conventions:**
   - Server files: `camelCase.purpose.js` (e.g., `bookings.controller.js`, `bookings.service.js`).
   - React components & pages: `PascalCase.jsx` (`HotelCard.jsx`, `BookingPage.jsx`).
   - Hooks & services: `useAuth.js`, `bookingService.js`.
3. **Backend Architecture Rules:**
   - Keep route handlers and controllers thin; place all business logic and state transitions in `*.service.js`.
   - Enforce authentication (`verifyToken`), RBAC (`requireRole`), and multi-hotel tenant isolation (`requireHotelAccess` / `hotelScopeFilter`) on protected endpoints.
   - Validate all payloads with `express-validator` and return uniform errors/responses via `AppError` and `utils/apiResponse.js`.
4. **Frontend Architecture Rules:**
   - Use the shared CSS tokens in `client/src/styles/variables.css` and reusable primitives in `client/src/components/`.
   - Keep JWT access tokens strictly in memory (`client/src/services/api.js`); never store tokens in `localStorage` or `sessionStorage`.
   - Run `npm run lint` inside `client/` and verify builds locally before pushing.
5. **Pull Request Checklist:**
   - [ ] Changes stay scoped to a single feature/fix and follow the roadmap phase.
   - [ ] No secrets, credentials, `.env` files, or `dist/` artifacts are staged.
   - [ ] Any newly introduced environment variables are added to the relevant `.env.example` with placeholders.
   - [ ] Frontend linting (`cd client && npm run lint`) passes and manual verification steps are noted in the PR description.
