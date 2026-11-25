# Role & Permission Matrix – LuxuryStay Hospitality HMS

> **Document Version:** 1.0  
> **Date:** 2026-11-25

---

## 1. Role Definitions

| Role | Code | Scope | Description |
|------|------|-------|-------------|
| Super Admin | `superAdmin` | Platform-wide | Full platform control. Manages all hotels, all users, all data. |
| Hotel Admin | `hotelAdmin` | Assigned hotels | Full control within assigned hotels. Cannot cross hotel boundaries. |
| Manager | `manager` | Assigned hotels | Operational management: reports, staff oversight, approvals. |
| Receptionist | `receptionist` | Assigned hotels | Front-desk operations: bookings, check-in, check-out, payments. |
| Housekeeping | `housekeeping` | Assigned hotels | View and update assigned housekeeping tasks only. |
| Guest | `guest` | Own data only | View own bookings, request services, submit feedback. |

---

## 2. Permission Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Full access (create, read, update, delete) |
| 👁 | Read-only |
| ✏️ | Create + Update (no delete) |
| 🔒 | No access |
| ⚡ | Own records only |
| 🏨 | Scoped to assigned hotel(s) only |

---

## 3. Module-Level Permission Matrix

### 3.1 Hotel Management

| Action | superAdmin | hotelAdmin | manager | receptionist | housekeeping | guest |
|--------|-----------|-----------|---------|-------------|-------------|-------|
| Create hotel | ✅ | 🔒 | 🔒 | 🔒 | 🔒 | 🔒 |
| View all hotels | ✅ | 🔒 | 🔒 | 🔒 | 🔒 | 🔒 |
| View assigned hotel | ✅ | 👁🏨 | 👁🏨 | 👁🏨 | 👁🏨 | 🔒 |
| Edit hotel details | ✅ | ✏️🏨 | 🔒 | 🔒 | 🔒 | 🔒 |
| Delete hotel | ✅ | 🔒 | 🔒 | 🔒 | 🔒 | 🔒 |
| Manage hotel settings | ✅ | ✅🏨 | 🔒 | 🔒 | 🔒 | 🔒 |

---

### 3.2 User Management

| Action | superAdmin | hotelAdmin | manager | receptionist | housekeeping | guest |
|--------|-----------|-----------|---------|-------------|-------------|-------|
| Create superAdmin | ✅ | 🔒 | 🔒 | 🔒 | 🔒 | 🔒 |
| Create hotelAdmin | ✅ | 🔒 | 🔒 | 🔒 | 🔒 | 🔒 |
| Create manager | ✅ | ✅🏨 | 🔒 | 🔒 | 🔒 | 🔒 |
| Create receptionist | ✅ | ✅🏨 | ✏️🏨 | 🔒 | 🔒 | 🔒 |
| Create housekeeping | ✅ | ✅🏨 | ✏️🏨 | 🔒 | 🔒 | 🔒 |
| View all users | ✅ | 👁🏨 | 👁🏨 | 🔒 | 🔒 | 🔒 |
| Edit any user | ✅ | ✏️🏨 | 🔒 | 🔒 | 🔒 | 🔒 |
| Edit own profile | ✅ | ✅ | ✅ | ✅ | ✅ | N/A |
| Deactivate user | ✅ | ✅🏨 | 🔒 | 🔒 | 🔒 | 🔒 |
| Delete user | ✅ | 🔒 | 🔒 | 🔒 | 🔒 | 🔒 |

> **Rule:** No role can assign a role equal to or higher than their own.

---

### 3.3 Guest Management

| Action | superAdmin | hotelAdmin | manager | receptionist | housekeeping | guest |
|--------|-----------|-----------|---------|-------------|-------------|-------|
| Create guest profile | ✅ | ✅🏨 | ✅🏨 | ✅🏨 | 🔒 | ⚡ (self-register) |
| View all guests | ✅ | 👁🏨 | 👁🏨 | 👁🏨 | 🔒 | 🔒 |
| View own profile | ✅ | ✅ | ✅ | ✅ | 🔒 | ⚡ |
| Edit guest profile | ✅ | ✏️🏨 | ✏️🏨 | ✏️🏨 | 🔒 | ⚡ |
| View guest PII (ID docs) | ✅ | 👁🏨 | 👁🏨 | 👁🏨 | 🔒 | ⚡ |
| Delete guest | ✅ | 🔒 | 🔒 | 🔒 | 🔒 | 🔒 |

---

### 3.4 Room Types

| Action | superAdmin | hotelAdmin | manager | receptionist | housekeeping | guest |
|--------|-----------|-----------|---------|-------------|-------------|-------|
| Create room type | ✅ | ✅🏨 | ✏️🏨 | 🔒 | 🔒 | 🔒 |
| View room types | ✅ | 👁🏨 | 👁🏨 | 👁🏨 | 🔒 | 👁 (public) |
| Edit room type | ✅ | ✅🏨 | ✏️🏨 | 🔒 | 🔒 | 🔒 |
| Delete room type | ✅ | ✅🏨 | 🔒 | 🔒 | 🔒 | 🔒 |

---

### 3.5 Room Management

| Action | superAdmin | hotelAdmin | manager | receptionist | housekeeping | guest |
|--------|-----------|-----------|---------|-------------|-------------|-------|
| Create room | ✅ | ✅🏨 | ✏️🏨 | 🔒 | 🔒 | 🔒 |
| View all rooms | ✅ | 👁🏨 | 👁🏨 | 👁🏨 | 👁🏨 | 🔒 |
| Edit room details | ✅ | ✅🏨 | ✏️🏨 | 🔒 | 🔒 | 🔒 |
| Update room status | ✅ | ✅🏨 | ✅🏨 | ✅🏨 | 🔒 | 🔒 |
| Update housekeeping status | ✅ | ✅🏨 | ✅🏨 | 🔒 | ✅🏨 | 🔒 |
| Delete room | ✅ | ✅🏨 | 🔒 | 🔒 | 🔒 | 🔒 |

---

### 3.6 Bookings

| Action | superAdmin | hotelAdmin | manager | receptionist | housekeeping | guest |
|--------|-----------|-----------|---------|-------------|-------------|-------|
| Create booking | ✅ | ✅🏨 | ✅🏨 | ✅🏨 | 🔒 | ⚡ (own) |
| View all bookings | ✅ | 👁🏨 | 👁🏨 | 👁🏨 | 🔒 | 🔒 |
| View own bookings | ✅ | ✅ | ✅ | ✅ | 🔒 | ⚡ |
| Confirm booking | ✅ | ✅🏨 | ✅🏨 | ✅🏨 | 🔒 | 🔒 |
| Edit booking | ✅ | ✅🏨 | ✅🏨 | ✏️🏨 | 🔒 | ⚡ (limited) |
| Cancel booking | ✅ | ✅🏨 | ✅🏨 | ✅🏨 | 🔒 | ⚡ (before cutoff) |
| Delete booking | ✅ | 🔒 | 🔒 | 🔒 | 🔒 | 🔒 |
| View booking financials | ✅ | 👁🏨 | 👁🏨 | 👁🏨 | 🔒 | ⚡ |

---

### 3.7 Check-In / Check-Out

| Action | superAdmin | hotelAdmin | manager | receptionist | housekeeping | guest |
|--------|-----------|-----------|---------|-------------|-------------|-------|
| Perform check-in | ✅ | ✅🏨 | ✅🏨 | ✅🏨 | 🔒 | 🔒 |
| Perform check-out | ✅ | ✅🏨 | ✅🏨 | ✅🏨 | 🔒 | 🔒 |
| View check-in records | ✅ | 👁🏨 | 👁🏨 | 👁🏨 | 🔒 | ⚡ |
| Edit check-in record | ✅ | ✅🏨 | 🔒 | 🔒 | 🔒 | 🔒 |

---

### 3.8 Payments

| Action | superAdmin | hotelAdmin | manager | receptionist | housekeeping | guest |
|--------|-----------|-----------|---------|-------------|-------------|-------|
| Record payment | ✅ | ✅🏨 | ✅🏨 | ✅🏨 | 🔒 | 🔒 |
| View payment details | ✅ | 👁🏨 | 👁🏨 | 👁🏨 | 🔒 | ⚡ |
| Process refund | ✅ | ✅🏨 | ✅🏨 | 🔒 | 🔒 | 🔒 |
| View financial reports | ✅ | 👁🏨 | 👁🏨 | 🔒 | 🔒 | 🔒 |
| Delete payment | ✅ | 🔒 | 🔒 | 🔒 | 🔒 | 🔒 |

---

### 3.9 Invoices

| Action | superAdmin | hotelAdmin | manager | receptionist | housekeeping | guest |
|--------|-----------|-----------|---------|-------------|-------------|-------|
| Generate invoice | ✅ | ✅🏨 | ✅🏨 | ✅🏨 | 🔒 | 🔒 |
| View invoice | ✅ | 👁🏨 | 👁🏨 | 👁🏨 | 🔒 | ⚡ |
| Void invoice | ✅ | ✅🏨 | ✅🏨 | 🔒 | 🔒 | 🔒 |
| Edit invoice | ✅ | ✅🏨 | 🔒 | 🔒 | 🔒 | 🔒 |

---

### 3.10 Services Catalogue

| Action | superAdmin | hotelAdmin | manager | receptionist | housekeeping | guest |
|--------|-----------|-----------|---------|-------------|-------------|-------|
| Create service | ✅ | ✅🏨 | ✏️🏨 | 🔒 | 🔒 | 🔒 |
| View services | ✅ | 👁🏨 | 👁🏨 | 👁🏨 | 🔒 | 👁 |
| Edit service | ✅ | ✅🏨 | ✏️🏨 | 🔒 | 🔒 | 🔒 |
| Delete service | ✅ | ✅🏨 | 🔒 | 🔒 | 🔒 | 🔒 |

---

### 3.11 Service Requests

| Action | superAdmin | hotelAdmin | manager | receptionist | housekeeping | guest |
|--------|-----------|-----------|---------|-------------|-------------|-------|
| Submit service request | ✅ | ✅🏨 | ✅🏨 | ✅🏨 | 🔒 | ⚡ |
| View all requests | ✅ | 👁🏨 | 👁🏨 | 👁🏨 | 🔒 | ⚡ |
| Assign / update request | ✅ | ✅🏨 | ✅🏨 | ✅🏨 | 🔒 | 🔒 |
| Complete request | ✅ | ✅🏨 | ✅🏨 | ✅🏨 | 🔒 | 🔒 |

---

### 3.12 Housekeeping

| Action | superAdmin | hotelAdmin | manager | receptionist | housekeeping | guest |
|--------|-----------|-----------|---------|-------------|-------------|-------|
| Create / assign task | ✅ | ✅🏨 | ✅🏨 | 🔒 | 🔒 | 🔒 |
| View all tasks | ✅ | 👁🏨 | 👁🏨 | 👁🏨 | 🔒 | 🔒 |
| View assigned tasks | ✅ | ✅ | ✅ | 🔒 | ⚡🏨 | 🔒 |
| Update task status | ✅ | ✅🏨 | ✅🏨 | 🔒 | ⚡🏨 | 🔒 |
| Verify / approve task | ✅ | ✅🏨 | ✅🏨 | 🔒 | 🔒 | 🔒 |
| Delete task | ✅ | ✅🏨 | 🔒 | 🔒 | 🔒 | 🔒 |

---

### 3.13 Maintenance

| Action | superAdmin | hotelAdmin | manager | receptionist | housekeeping | guest |
|--------|-----------|-----------|---------|-------------|-------------|-------|
| Report issue | ✅ | ✅🏨 | ✅🏨 | ✅🏨 | ✅🏨 | 🔒 |
| View all tickets | ✅ | 👁🏨 | 👁🏨 | 👁🏨 | 🔒 | 🔒 |
| Assign ticket | ✅ | ✅🏨 | ✅🏨 | 🔒 | 🔒 | 🔒 |
| Resolve ticket | ✅ | ✅🏨 | ✅🏨 | 🔒 | 🔒 | 🔒 |
| Close ticket | ✅ | ✅🏨 | ✅🏨 | 🔒 | 🔒 | 🔒 |

---

### 3.14 Feedback

| Action | superAdmin | hotelAdmin | manager | receptionist | housekeeping | guest |
|--------|-----------|-----------|---------|-------------|-------------|-------|
| Submit feedback | 🔒 | 🔒 | 🔒 | 🔒 | 🔒 | ⚡ |
| View all feedback | ✅ | 👁🏨 | 👁🏨 | 🔒 | 🔒 | ⚡ |
| Reply to feedback | ✅ | ✅🏨 | ✅🏨 | 🔒 | 🔒 | 🔒 |
| Delete feedback | ✅ | 🔒 | 🔒 | 🔒 | 🔒 | 🔒 |
| Verify feedback | ✅ | ✅🏨 | 🔒 | 🔒 | 🔒 | 🔒 |

---

### 3.15 Notifications

| Action | superAdmin | hotelAdmin | manager | receptionist | housekeeping | guest |
|--------|-----------|-----------|---------|-------------|-------------|-------|
| View own notifications | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Send system notification | ✅ | ✅🏨 | 🔒 | 🔒 | 🔒 | 🔒 |
| Send guest notification | ✅ | ✅🏨 | ✅🏨 | ✅🏨 | 🔒 | 🔒 |

---

### 3.16 Audit Logs

| Action | superAdmin | hotelAdmin | manager | receptionist | housekeeping | guest |
|--------|-----------|-----------|---------|-------------|-------------|-------|
| View all audit logs | ✅ | 🔒 | 🔒 | 🔒 | 🔒 | 🔒 |
| View hotel audit logs | ✅ | 👁🏨 | 🔒 | 🔒 | 🔒 | 🔒 |
| Delete audit logs | 🔒 | 🔒 | 🔒 | 🔒 | 🔒 | 🔒 |

> **Rule:** Audit logs are immutable. No role can delete them. TTL handles expiry automatically.

---

## 4. API Endpoint Access Matrix (Summary)

| HTTP Method | Pattern | Allowed Roles |
|-------------|---------|--------------|
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/register-guest` | Public |
| POST | `/api/auth/refresh` | Authenticated |
| GET | `/api/hotels/public/:slug` | Public |
| GET | `/api/rooms/available` | Public |
| POST | `/api/hotels` | superAdmin |
| DELETE | `/api/hotels/:id` | superAdmin |
| POST | `/api/users` | superAdmin, hotelAdmin |
| GET | `/api/users` | superAdmin, hotelAdmin, manager |
| POST | `/api/bookings` | superAdmin, hotelAdmin, manager, receptionist, guest |
| PUT | `/api/bookings/:id/confirm` | superAdmin, hotelAdmin, manager, receptionist |
| POST | `/api/check-ins` | superAdmin, hotelAdmin, manager, receptionist |
| POST | `/api/payments` | superAdmin, hotelAdmin, manager, receptionist |
| GET | `/api/audit-logs` | superAdmin |
| GET | `/api/audit-logs/hotel/:hotelId` | superAdmin, hotelAdmin |

---

## 5. Business Rules for Permissions

1. **Role elevation is blocked** – A `hotelAdmin` cannot create another `hotelAdmin` or `superAdmin`.
2. **Hotel scope is mandatory** – Any staff endpoint that accepts a `hotelId` parameter must be validated against the authenticated user's `hotelIds` array server-side.
3. **Guest data isolation** – Guests can only read/write their own documents. Any `guestId` mismatch returns 403.
4. **Receptionist financial limits** – Receptionists cannot process refunds or void invoices without manager approval.
5. **Housekeeping isolation** – Housekeeping users can only see their own assigned tasks; they cannot view guest PII, bookings or financial data.
6. **Booking cancellation window** – Guests can self-cancel only if the booking's check-in date is beyond the hotel's configured cancellation window (from `settings.bookingPolicy.cancellationWindowHours`).

