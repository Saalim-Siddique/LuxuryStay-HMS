# Business Rules – LuxuryStay Hospitality HMS

> **Document Version:** 1.0  
> **Date:** 2026-11-25  
> **Enforcement:** All rules listed here MUST be enforced in the backend service layer, never in the frontend alone.

---

## 1. Booking Rules

### BR-01 – No Overlapping Reservations
A room cannot be booked if another booking exists for the same `roomId` with status in `[pending, confirmed, checkedIn]` and whose date range overlaps the requested dates.

**Overlap condition:**
```
existingCheckIn < requestedCheckOut  AND  existingCheckOut > requestedCheckIn
```

This check is performed atomically in `bookings.service.js` before writing the new booking document.

---

### BR-02 – Check-out Must Follow Check-in
`checkOutDate` must be strictly greater than `checkInDate`. Minimum stay is 1 night.  
Validation is enforced at the validator level (express-validator) and confirmed in the service layer.

---

### BR-03 – Booking Status Lifecycle
State transitions must follow the allowed path:

```
pending → confirmed → checkedIn → checkedOut
pending → cancelled
confirmed → cancelled
confirmed → noShow
```

No other transitions are permitted. The service layer must reject invalid state changes with a 400 error.

---

### BR-04 – Booking Financial Calculation
All financial fields are computed on the server; never trusted from the client.

```
totalNights   = dayDiff(checkOutDate, checkInDate)
subtotal      = ratePerNight × totalNights
taxAmount     = subtotal × (hotel.taxRate / 100)
totalAmount   = subtotal + taxAmount - discountAmount
balanceDue    = totalAmount - depositAmount
```

---

### BR-05 – Guest Self-Cancellation Window
A guest may cancel their own booking only if:
- Current datetime is earlier than `checkInDate − settings.bookingPolicy.cancellationWindowHours`
- Booking status is `pending` or `confirmed`

After the window closes, only staff with manager or higher role may cancel.

---

### BR-06 – Booking Number Format
Booking numbers are auto-generated on the server:
```
{bookingPrefix}-{YYYYMMDD}-{4-digit-sequence}
Example: BK-20261125-0001
```
The prefix comes from `settings.bookingPrefix` for the hotel (default: `BK`).

---

## 2. Room Status Rules

### BR-07 – Room Status vs Booking Status
Room status (`rooms.status`) and booking status (`bookings.status`) are **independent fields** updated separately.

| Event | Room Status Change |
|-------|-------------------|
| Booking confirmed | No change (room remains `available`) |
| Guest checks in | `available` → `occupied` |
| Guest checks out | `occupied` → (determined by housekeeping) |
| Maintenance ticket opened | `available` → `maintenance` |
| Maintenance resolved | `maintenance` → `available` |

---

### BR-08 – Housekeeping Status After Check-out
When a guest checks out, the system automatically:
1. Sets `rooms.housekeepingStatus` = `dirty`
2. Creates a `housekeeping` task with `taskType: cleaning`, `priority: high`

Housekeeping staff update the task status and mark the room `clean` after completion.  
A manager or supervisor can then verify and set `housekeepingStatus` = `clean`, making the room available again.

---

### BR-09 – Room Cannot Be Booked in Maintenance
If `rooms.status` is `maintenance` or `outOfOrder`, the booking service must reject any new reservation for that room.

---

## 3. Check-In Rules

### BR-10 – Check-In Prerequisites
Check-in is only permitted when:
- Booking `status` = `confirmed`
- Today's date is on or after `booking.checkInDate`
- Today's date is not more than 1 day after `booking.checkInDate` (or manager override applies)
- Guest identity has been verified (`idVerified: true` must be set during check-in)

---

### BR-11 – One Active Check-In Per Booking
The `checkIns` collection enforces a unique index on `bookingId`. Attempting a second check-in for the same booking returns a conflict error.

---

### BR-12 – Check-Out Finalisation
On check-out, the system must:
1. Set `checkIns.checkOutTime` to current datetime
2. Set `bookings.status` = `checkedOut`
3. Set `rooms.status` = `available`
4. Set `rooms.housekeepingStatus` = `dirty`
5. Create a housekeeping task (see BR-08)
6. Finalise the invoice (status `draft` → `issued`)
7. Record any outstanding balance

---

## 4. Payment Rules

### BR-13 – Payment Association
Every payment must reference a valid `bookingId` and `guestId`.  
The service layer verifies that the guest on the payment matches the guest on the booking.

---

### BR-14 – Refund Authority
Only `manager`, `hotelAdmin`, or `superAdmin` may initiate a refund.  
Receptionists cannot process refunds.

---

### BR-15 – Invoice Is Single Source of Truth
Invoice `totalAmount` is the authoritative billable amount.  
Payments are recorded against the invoice; `balanceDue` = `totalAmount − amountPaid`.

---

### BR-16 – No Deletion of Financial Records
Payments and invoices cannot be deleted, only voided with a reason. Voiding is restricted to `hotelAdmin` and above.

---

## 5. User & Access Rules

### BR-17 – Role Elevation Prevention
A user cannot create or promote another user to a role equal to or higher than their own.

| Acting Role | Maximum Creatable Role |
|-------------|----------------------|
| `superAdmin` | `hotelAdmin` |
| `hotelAdmin` | `manager` |
| `manager` | `receptionist`, `housekeeping` |
| `receptionist` | — (cannot create users) |
| `housekeeping` | — (cannot create users) |

---

### BR-18 – Hotel Scope Enforcement
All hotel-scoped operations (bookings, rooms, staff, tasks) require the requesting user's `hotelIds` array to contain the target `hotelId`. The `requireHotelAccess` middleware enforces this on every scoped route.  
`superAdmin` is exempt from hotel scope checks.

---

### BR-19 – Staff Deactivation, Not Deletion
Staff accounts are deactivated (`isActive: false`) rather than deleted, to preserve audit trail integrity. A deactivated user cannot log in and receives a 401 on any authenticated request.

---

## 6. Housekeeping Rules

### BR-20 – Task Visibility
Housekeeping staff can only see tasks where `assignedTo` matches their own `userId`. They cannot view tasks assigned to other staff.

---

### BR-21 – Task Completion Verification
A housekeeping task can only be marked `completed` by the assigned staff member.  
A supervisor (`manager` or `hotelAdmin`) must then `verifiedBy` the task before the room status is updated to `clean`.

---

### BR-22 – Checklist Enforcement
If a housekeeping task includes `checklistItems`, all items must be marked `isDone: true` before the task status can be set to `completed`.

---

## 7. Guest Data Rules

### BR-23 – Guest PII Access Control
The following guest fields are restricted to `receptionist` and above:
- `idType`, `idNumber`, `idExpiry`
- `dateOfBirth`

Guests may read and update their own PII fields only.  
Housekeeping staff have no access to guest PII.

---

### BR-24 – One Feedback Per Booking
A guest can submit feedback only once per booking.  
The `feedback` collection enforces a unique index on `bookingId`.

---

### BR-25 – Feedback Eligibility
A guest may submit feedback only after `bookings.status` = `checkedOut`.  
The service layer validates this before creating the feedback document.

---

## 8. Data Integrity Rules

### BR-26 – Audit Log on Every Write
Every `POST`, `PUT`, `PATCH`, `DELETE` operation on a production collection must write an `auditLogs` entry via the `auditLogger` middleware.  
Audit logs are immutable: no update or delete operations are permitted on the `auditLogs` collection.

---

### BR-27 – hotelId Always Backend-Verified
The `hotelId` received in any API request (body, params, query) is never trusted directly.  
It is always re-validated against `req.user.hotelIds` before the service layer executes.

---

### BR-28 – Soft Deletes Where Applicable
Resources with active references (rooms with bookings, staff with assigned tasks) must not be hard-deleted.  
Use `isActive: false` flags instead. Hard deletes are limited to `superAdmin` for administrative cleanup only.

---

### BR-29 – Settings Default Fallback
If a hotel does not have a `settings` document, all operations must fall back to the default values defined in `server/config/constants.js`. The settings service handles this transparently.

---

## 9. Notification Rules

### BR-30 – Automatic Notification Triggers

| Event | Recipients |
|-------|-----------|
| Booking created | Guest |
| Booking confirmed | Guest |
| Booking cancelled | Guest + Manager |
| Check-in completed | Guest |
| Check-out completed | Guest |
| Payment received | Guest |
| Invoice issued | Guest |
| Housekeeping task assigned | Assigned housekeeping user |
| Maintenance ticket opened | Manager |
| Service request received | Receptionist / Manager |

---

### BR-30 – Notification Retention
Notifications older than 90 days are automatically removed by a MongoDB TTL index on `notifications.createdAt`.

