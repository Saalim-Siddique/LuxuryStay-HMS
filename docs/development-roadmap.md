# Development Roadmap – LuxuryStay Hospitality HMS

> **Document Version:** 1.0  
> **Date:** 2026-11-25  
> **Methodology:** Phased delivery – each phase produces a working, testable vertical slice.

---

## Overview

The project is delivered across **6 phases**. Each phase builds on the previous and results in a fully integrated, testable increment.

```
Phase 1 → Foundation & Auth
Phase 2 → Hotel & Room Management
Phase 3 → Booking Engine & Guest Portal
Phase 4 → Front-Desk Operations
Phase 5 → Housekeeping, Maintenance & Services
Phase 6 → Reporting, Notifications & Polish
```

---

## Phase 1 – Foundation & Authentication

**Goal:** Working project scaffolding with secure multi-role authentication.

### Backend Tasks
- [ ] Initialise `server/` with Express, dotenv, Mongoose connection
- [ ] Configure CORS, Helmet, Morgan, rate limiter
- [ ] Create global error handler and 404 middleware
- [ ] Design standardised API response envelope
- [ ] Implement `users.model.js` (all staff roles)
- [ ] Implement `guests.model.js`
- [ ] Implement `auth` module:
  - `POST /api/auth/login` (staff)
  - `POST /api/auth/login/guest`
  - `POST /api/auth/register/guest`
  - `POST /api/auth/refresh`
  - `POST /api/auth/logout`
- [ ] Implement JWT (access + refresh) token strategy
- [ ] Implement bcrypt password hashing
- [ ] Implement `verifyToken` middleware
- [ ] Implement `requireRole` middleware
- [ ] Implement `auditLogs.model.js` and `auditLogger` middleware
- [ ] Seed script: create initial `superAdmin` user

### Frontend Tasks
- [ ] Initialise `client/` with Vite + React
- [ ] Install Bootstrap 5, Axios, React Router
- [ ] Configure CSS variables (colour palette, typography)
- [ ] Build `AuthContext` and `useAuth` hook
- [ ] Build `PrivateRoute` and `RoleRoute` components
- [ ] Build `AuthLayout` and login page (staff + guest variants)
- [ ] Build Axios instance with request interceptors (token attach) and response interceptors (auto-refresh)
- [ ] Build `NotFoundPage` and `UnauthorizedPage`

### Deliverable
> Staff and guest login/logout with role-aware redirect to the correct portal.

---

## Phase 2 – Hotel & Room Management

**Goal:** Super Admin can manage hotels; Hotel Admin can manage room types and rooms.

### Backend Tasks
- [ ] Implement `hotels.model.js` and full CRUD routes (superAdmin)
- [ ] Implement `hotels` slug generation on create
- [ ] Implement `hotelScope.middleware.js` (`requireHotelAccess`)
- [ ] Implement `roomTypes.model.js` and CRUD routes (hotelAdmin, manager)
- [ ] Implement `rooms.model.js` and CRUD routes
- [ ] Implement room status management endpoints
- [ ] Implement `settings.model.js` and per-hotel settings endpoints
- [ ] Implement `users` module (staff CRUD with role hierarchy enforcement)

### Frontend Tasks
- [ ] Build `SuperAdminLayout` with sidebar navigation
- [ ] Build Super Admin: Hotels list, New Hotel form, Hotel detail
- [ ] Build `HotelAdminLayout`
- [ ] Build Hotel Admin: Room Types management (list, create, edit)
- [ ] Build Hotel Admin: Rooms management (list, create, edit, status update)
- [ ] Build Hotel Admin: Staff management (list, invite, deactivate)
- [ ] Build Hotel Admin: Settings page
- [ ] Build reusable `DataTable`, `StatCard`, `Modal`, `ConfirmDialog` components

### Deliverable
> Super Admin can create hotels and assign admins. Hotel Admin can manage rooms and staff.

---

## Phase 3 – Booking Engine & Guest Portal

**Goal:** Public booking flow and complete guest self-service portal.

### Backend Tasks
- [ ] Implement public hotel/room search endpoints (no auth)
- [ ] Implement room availability check with overlap-prevention query
- [ ] Implement `bookings.model.js` and booking creation (all roles + guest)
- [ ] Implement booking status lifecycle endpoints (confirm, cancel)
- [ ] Implement booking number auto-generation
- [ ] Implement `invoices.model.js` and auto-draft invoice on booking confirm
- [ ] Implement guest booking cancellation (with policy window validation from settings)
- [ ] Implement `feedback.model.js` and guest feedback submission

### Frontend Tasks
- [ ] Build `PublicLayout` (luxury header, footer)
- [ ] Build `HomePage` with hotel feature section
- [ ] Build `HotelListPage` with search / filter
- [ ] Build `HotelDetailPage` with room grid and amenities
- [ ] Build `RoomSearchPage` with availability calendar
- [ ] Build `BookingPage` multi-step form (room selection → guest details → review → confirm)
- [ ] Build `BookingConfirmationPage`
- [ ] Build `GuestLayout` with sidebar
- [ ] Build Guest: Dashboard, My Bookings, Booking Detail, My Invoices
- [ ] Build Guest: Profile page (view & edit)
- [ ] Build Guest: Feedback submission form

### Deliverable
> Public users can search, browse and book rooms. Guests can manage their own reservations.

---

## Phase 4 – Front-Desk Operations

**Goal:** Receptionists can perform complete check-in / check-out workflows with payment recording.

### Backend Tasks
- [ ] Implement `checkIns.model.js` and check-in endpoint
- [ ] Check-in validates: booking status is `confirmed`, dates are correct, ID verified
- [ ] Implement check-out endpoint (updates booking, checkIn, room status)
- [ ] Implement `payments.model.js` and payment recording endpoints
- [ ] Implement refund endpoint (manager+ only)
- [ ] Implement invoice finalisation on check-out
- [ ] Implement guest lookup endpoint (search by name, email, phone, ID)
- [ ] Implement room grid status endpoint (real-time room occupancy view)

### Frontend Tasks
- [ ] Build `ReceptionistLayout`
- [ ] Build Reception: Dashboard with room grid overview
- [ ] Build Reception: Bookings list with status filters
- [ ] Build Reception: New Booking form (walk-in)
- [ ] Build Reception: Check-In flow (ID capture, companions, key card)
- [ ] Build Reception: Check-Out flow (service summary, invoice preview, payment)
- [ ] Build Reception: Guest Lookup / search
- [ ] Build Reception: Payments list
- [ ] Build `ManagerLayout`
- [ ] Build Manager: Dashboard with KPI stats (Recharts)
- [ ] Build Manager: Bookings overview
- [ ] Build Manager: Payments and financial summary

### Deliverable
> Front-desk staff can check in/out guests and record payments end-to-end.

---

## Phase 5 – Housekeeping, Maintenance & Services

**Goal:** Complete operational management for housekeeping, maintenance and in-stay guest services.

### Backend Tasks
- [ ] Implement `housekeeping.model.js` and task CRUD routes
- [ ] Auto-create housekeeping tasks on check-out (room → dirty)
- [ ] Implement housekeeping task status update (housekeeping role, own tasks only)
- [ ] Implement supervisor task verification endpoint
- [ ] Implement `maintenance.model.js` and ticket CRUD routes
- [ ] Implement `services.model.js` and hotel services catalogue CRUD
- [ ] Implement `serviceRequests.model.js` and guest request lifecycle endpoints
- [ ] Link service request completion to invoice line item addition

### Frontend Tasks
- [ ] Build `HousekeepingLayout`
- [ ] Build Housekeeping: Dashboard with task queue
- [ ] Build Housekeeping: My Tasks list with filter by status/date
- [ ] Build Housekeeping: Task Detail with checklist
- [ ] Build Manager: Housekeeping Overview (all tasks, assignments)
- [ ] Build Manager: Maintenance tickets (create, assign, resolve)
- [ ] Build Hotel Admin: Services catalogue management
- [ ] Build Guest: Service Request form and My Requests list

### Deliverable
> Housekeeping workflow is operational. Guests can request services. Maintenance is tracked.

---

## Phase 6 – Reporting, Notifications & UI Polish

**Goal:** Analytics dashboards, notification system, and premium UI refinement across all portals.

### Backend Tasks
- [ ] Implement `notifications.model.js` and notification service
- [ ] Add notification triggers: booking confirmed, check-in, check-out, task assigned, payment received
- [ ] Implement analytics aggregate endpoints:
  - Occupancy rate (by hotel, date range)
  - Revenue summary (by hotel, date range)
  - Booking source distribution
  - Housekeeping completion rate
- [ ] Implement audit log query endpoints (superAdmin, hotelAdmin)
- [ ] Implement nodemailer email notification service (booking confirmation, invoice)

### Frontend Tasks
- [ ] Build `NotificationDropdown` with real-time polling (or SSE)
- [ ] Build Super Admin: Platform analytics dashboard (Recharts)
- [ ] Build Hotel Admin: Hotel analytics (occupancy, revenue charts)
- [ ] Build Manager: Detailed reports (occupancy, revenue, booking trends)
- [ ] Build Audit Log viewer (Super Admin + Hotel Admin)
- [ ] Final UI polish:
  - Consistent colour palette enforcement across all portals
  - Loading skeletons for all data-heavy tables
  - Empty state illustrations
  - Toast notifications for all user actions
  - Responsive breakpoints verified on mobile and tablet
  - Accessibility audit (aria labels, keyboard navigation, contrast ratios)
- [ ] `README.md` with setup and run instructions

### Deliverable
> Production-ready application with analytics, notifications and premium UI across all 7 portals.

---

## Milestone Summary

| Phase | Focus | Key Deliverable |
|-------|-------|----------------|
| 1 | Foundation + Auth | Multi-role login, JWT, project scaffold |
| 2 | Hotels + Rooms | Hotel/room CRUD, staff management |
| 3 | Bookings + Guest Portal | Public booking flow, guest self-service |
| 4 | Front-Desk | Check-in/out, payments, invoices |
| 5 | Operations | Housekeeping, maintenance, services |
| 6 | Analytics + Polish | Dashboards, notifications, premium UI |

---

## Development Principles

- **Phase gates:** Do not start the next phase until the current phase passes manual testing.
- **No fake data in models:** All models must connect to real MongoDB Atlas from day one.
- **No duplicate logic:** Business rules live in the service layer only; controllers are thin.
- **Review before overwrite:** Always read an existing file before modifying it.
- **Consistent naming:** Follow the naming conventions in `folder-structure.md`.
- **Backend-first per feature:** Implement and test the API endpoint before building the UI for it.

