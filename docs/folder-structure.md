# Folder Structure – LuxuryStay Hospitality HMS

> **Document Version:** 1.0  
> **Date:** 2026-11-25

---

## 1. Root Workspace

```
LuxuryStay-HMS/
├── client/                   ← React + Vite frontend SPA
├── server/                   ← Node.js + Express backend API
├── docs/                     ← Architecture & planning documents
│   ├── system-architecture.md
│   ├── database-design.md
│   ├── role-permission-matrix.md
│   ├── folder-structure.md
│   ├── development-roadmap.md
│   ├── business-rules.md
│   └── architecture-diagram.md
└── README.md
```

---

## 2. Client Application (`client/`)

```
client/
├── public/
│   ├── favicon.ico
│   └── images/               ← Static public assets
├── src/
│   ├── main.jsx              ← Vite entry point
│   ├── App.jsx               ← Root component, router setup
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── fonts/
│   │
│   ├── styles/
│   │   ├── variables.css     ← CSS custom properties (colour palette, fonts)
│   │   ├── global.css        ← Global base styles
│   │   └── utilities.css     ← Custom utility classes
│   │
│   ├── context/
│   │   ├── AuthContext.jsx   ← Auth state (user, token, role)
│   │   └── HotelContext.jsx  ← Active hotel scope state
│   │
│   ├── hooks/
│   │   ├── useAuth.js        ← Auth helpers (login, logout, currentUser)
│   │   ├── useHotel.js       ← Active hotel helpers
│   │   ├── useBooking.js     ← Booking form state helpers
│   │   ├── usePagination.js  ← Paginated list state
│   │   └── useNotifications.js
│   │
│   ├── services/             ← Axios API call modules
│   │   ├── api.js            ← Axios instance + interceptors (token attach / refresh)
│   │   ├── authService.js
│   │   ├── hotelService.js
│   │   ├── userService.js
│   │   ├── guestService.js
│   │   ├── roomService.js
│   │   ├── roomTypeService.js
│   │   ├── bookingService.js
│   │   ├── checkInService.js
│   │   ├── paymentService.js
│   │   ├── invoiceService.js
│   │   ├── serviceService.js
│   │   ├── serviceRequestService.js
│   │   ├── housekeepingService.js
│   │   ├── maintenanceService.js
│   │   ├── feedbackService.js
│   │   ├── notificationService.js
│   │   └── settingsService.js
│   │
│   ├── utils/
│   │   ├── formatters.js     ← Date, currency, status formatters
│   │   ├── validators.js     ← Client-side form validation helpers
│   │   ├── constants.js      ← Shared enums, role names, status lists
│   │   └── helpers.js        ← General utility functions
│   │
│   ├── components/           ← Reusable UI components
│   │   ├── common/
│   │   │   ├── Spinner.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── forms/
│   │   │   ├── FormField.jsx
│   │   │   ├── SelectField.jsx
│   │   │   ├── DatePicker.jsx
│   │   │   └── FileUpload.jsx
│   │   ├── tables/
│   │   │   ├── DataTable.jsx
│   │   │   └── TableActions.jsx
│   │   ├── charts/
│   │   │   ├── OccupancyChart.jsx
│   │   │   ├── RevenueChart.jsx
│   │   │   └── BookingTrendChart.jsx
│   │   ├── cards/
│   │   │   ├── StatCard.jsx
│   │   │   ├── RoomCard.jsx
│   │   │   └── BookingCard.jsx
│   │   └── notifications/
│   │       └── NotificationDropdown.jsx
│   │
│   ├── layouts/              ← Portal shell layouts
│   │   ├── PublicLayout.jsx  ← Header + footer for public pages
│   │   ├── AuthLayout.jsx    ← Minimal login/register layout
│   │   ├── SuperAdminLayout.jsx
│   │   ├── HotelAdminLayout.jsx
│   │   ├── ManagerLayout.jsx
│   │   ├── ReceptionistLayout.jsx
│   │   ├── HousekeepingLayout.jsx
│   │   └── GuestLayout.jsx
│   │
│   ├── routes/
│   │   ├── index.jsx         ← Root route tree
│   │   ├── PrivateRoute.jsx  ← Redirect to login if unauthenticated
│   │   └── RoleRoute.jsx     ← Redirect if role unauthorised
│   │
│   └── pages/                ← Route-mapped page components
│       │
│       ├── public/           ← Public booking interface
│       │   ├── HomePage.jsx
│       │   ├── HotelListPage.jsx
│       │   ├── HotelDetailPage.jsx
│       │   ├── RoomSearchPage.jsx
│       │   ├── BookingPage.jsx
│       │   └── BookingConfirmationPage.jsx
│       │
│       ├── auth/
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   └── ForgotPasswordPage.jsx
│       │
│       ├── guest/
│       │   ├── GuestDashboard.jsx
│       │   ├── MyBookings.jsx
│       │   ├── BookingDetail.jsx
│       │   ├── MyInvoices.jsx
│       │   ├── ServiceRequest.jsx
│       │   ├── MyFeedback.jsx
│       │   └── GuestProfile.jsx
│       │
│       ├── receptionist/
│       │   ├── ReceptionDashboard.jsx
│       │   ├── Bookings.jsx
│       │   ├── NewBooking.jsx
│       │   ├── BookingDetail.jsx
│       │   ├── CheckIn.jsx
│       │   ├── CheckOut.jsx
│       │   ├── GuestLookup.jsx
│       │   ├── Payments.jsx
│       │   └── RoomGrid.jsx
│       │
│       ├── housekeeping/
│       │   ├── HousekeepingDashboard.jsx
│       │   ├── MyTasks.jsx
│       │   └── TaskDetail.jsx
│       │
│       ├── manager/
│       │   ├── ManagerDashboard.jsx
│       │   ├── Reports.jsx
│       │   ├── OccupancyReport.jsx
│       │   ├── RevenueReport.jsx
│       │   ├── Bookings.jsx
│       │   ├── HousekeepingOverview.jsx
│       │   ├── MaintenanceOverview.jsx
│       │   ├── StaffList.jsx
│       │   └── Feedback.jsx
│       │
│       ├── hotel-admin/
│       │   ├── HotelAdminDashboard.jsx
│       │   ├── HotelProfile.jsx
│       │   ├── RoomTypes.jsx
│       │   ├── Rooms.jsx
│       │   ├── StaffManagement.jsx
│       │   ├── ServicesManagement.jsx
│       │   ├── Settings.jsx
│       │   └── AuditLogs.jsx
│       │
│       └── super-admin/
│           ├── SuperDashboard.jsx
│           ├── Hotels.jsx
│           ├── NewHotel.jsx
│           ├── HotelDetail.jsx
│           ├── AllUsers.jsx
│           ├── SystemSettings.jsx
│           └── AuditLogs.jsx
│
├── index.html
├── vite.config.js
├── .env
├── .env.example
└── package.json
```

---

## 3. Server Application (`server/`)

```
server/
├── src/
│   ├── app.js                ← Express app setup (middleware, routes)
│   ├── server.js             ← HTTP server entry point (port binding)
│   │
│   ├── config/
│   │   ├── db.js             ← MongoDB Atlas connection
│   │   ├── env.js            ← Environment variable loader & validator
│   │   └── constants.js      ← Server-side enums & shared constants
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js      ← verifyToken – JWT validation
│   │   ├── role.middleware.js      ← requireRole(roles[]) – role guard
│   │   ├── hotelScope.middleware.js ← requireHotelAccess – hotel scoping
│   │   ├── errorHandler.js         ← Global error handler
│   │   ├── notFound.js             ← 404 handler
│   │   ├── rateLimiter.js          ← express-rate-limit configs
│   │   └── auditLogger.js          ← Automatic audit log writer (middleware)
│   │
│   ├── routes/
│   │   └── index.js          ← Aggregates all module routes
│   │
│   └── modules/              ← One folder per business domain
│       │
│       ├── auth/
│       │   ├── auth.routes.js
│       │   ├── auth.controller.js
│       │   └── auth.service.js
│       │
│       ├── users/
│       │   ├── users.routes.js
│       │   ├── users.controller.js
│       │   ├── users.service.js
│       │   ├── users.model.js
│       │   └── users.validator.js
│       │
│       ├── hotels/
│       │   ├── hotels.routes.js
│       │   ├── hotels.controller.js
│       │   ├── hotels.service.js
│       │   ├── hotels.model.js
│       │   └── hotels.validator.js
│       │
│       ├── guests/
│       │   ├── guests.routes.js
│       │   ├── guests.controller.js
│       │   ├── guests.service.js
│       │   ├── guests.model.js
│       │   └── guests.validator.js
│       │
│       ├── roomTypes/
│       │   ├── roomTypes.routes.js
│       │   ├── roomTypes.controller.js
│       │   ├── roomTypes.service.js
│       │   ├── roomTypes.model.js
│       │   └── roomTypes.validator.js
│       │
│       ├── rooms/
│       │   ├── rooms.routes.js
│       │   ├── rooms.controller.js
│       │   ├── rooms.service.js
│       │   ├── rooms.model.js
│       │   └── rooms.validator.js
│       │
│       ├── bookings/
│       │   ├── bookings.routes.js
│       │   ├── bookings.controller.js
│       │   ├── bookings.service.js    ← Contains overlap-check logic
│       │   ├── bookings.model.js
│       │   └── bookings.validator.js
│       │
│       ├── checkIns/
│       │   ├── checkIns.routes.js
│       │   ├── checkIns.controller.js
│       │   ├── checkIns.service.js
│       │   ├── checkIns.model.js
│       │   └── checkIns.validator.js
│       │
│       ├── payments/
│       │   ├── payments.routes.js
│       │   ├── payments.controller.js
│       │   ├── payments.service.js
│       │   ├── payments.model.js
│       │   └── payments.validator.js
│       │
│       ├── invoices/
│       │   ├── invoices.routes.js
│       │   ├── invoices.controller.js
│       │   ├── invoices.service.js
│       │   ├── invoices.model.js
│       │   └── invoices.validator.js
│       │
│       ├── services/
│       │   ├── services.routes.js
│       │   ├── services.controller.js
│       │   ├── services.service.js
│       │   ├── services.model.js
│       │   └── services.validator.js
│       │
│       ├── serviceRequests/
│       │   ├── serviceRequests.routes.js
│       │   ├── serviceRequests.controller.js
│       │   ├── serviceRequests.service.js
│       │   ├── serviceRequests.model.js
│       │   └── serviceRequests.validator.js
│       │
│       ├── housekeeping/
│       │   ├── housekeeping.routes.js
│       │   ├── housekeeping.controller.js
│       │   ├── housekeeping.service.js
│       │   ├── housekeeping.model.js
│       │   └── housekeeping.validator.js
│       │
│       ├── maintenance/
│       │   ├── maintenance.routes.js
│       │   ├── maintenance.controller.js
│       │   ├── maintenance.service.js
│       │   ├── maintenance.model.js
│       │   └── maintenance.validator.js
│       │
│       ├── feedback/
│       │   ├── feedback.routes.js
│       │   ├── feedback.controller.js
│       │   ├── feedback.service.js
│       │   ├── feedback.model.js
│       │   └── feedback.validator.js
│       │
│       ├── notifications/
│       │   ├── notifications.routes.js
│       │   ├── notifications.controller.js
│       │   ├── notifications.service.js
│       │   └── notifications.model.js
│       │
│       ├── settings/
│       │   ├── settings.routes.js
│       │   ├── settings.controller.js
│       │   ├── settings.service.js
│       │   ├── settings.model.js
│       │   └── settings.validator.js
│       │
│       └── auditLogs/
│           ├── auditLogs.routes.js
│           ├── auditLogs.controller.js
│           ├── auditLogs.service.js
│           └── auditLogs.model.js
│
├── .env
├── .env.example
└── package.json
```

---

## 4. Naming Conventions

| Category | Convention | Example |
|----------|-----------|---------|
| Files | `camelCase.purpose.js` | `bookings.service.js` |
| React components | `PascalCase.jsx` | `BookingCard.jsx` |
| Pages | `PascalCase + "Page"` | `CheckInPage.jsx` |
| Hooks | `use` prefix, camelCase | `useAuth.js` |
| Services (client) | `camelCase + "Service"` | `bookingService.js` |
| CSS classes | `kebab-case` | `.booking-card` |
| Environment variables | `SCREAMING_SNAKE_CASE` | `MONGODB_URI` |
| MongoDB collections | `camelCase` (plural) | `bookings`, `auditLogs` |

---

## 5. Environment Variables

### client/.env.example
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=LuxuryStay HMS
```

### server/.env.example
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/luxurystay
JWT_ACCESS_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
CLIENT_ORIGIN=http://localhost:5173
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=no-reply@luxurystay.com
EMAIL_PASS=<email-password>
```

