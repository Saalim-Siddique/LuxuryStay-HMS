# Database Design – LuxuryStay Hospitality HMS

> **Document Version:** 1.0  
> **Date:** 2026-11-25  
> **Database:** MongoDB Atlas  
> **ODM:** Mongoose

---

## 1. Collection Overview

| # | Collection | Primary Purpose |
|---|-----------|----------------|
| 1 | `users` | All staff and admin accounts |
| 2 | `hotels` | Hotel property records |
| 3 | `guests` | Guest profiles |
| 4 | `roomTypes` | Room category definitions per hotel |
| 5 | `rooms` | Individual room inventory |
| 6 | `bookings` | Reservation records |
| 7 | `checkIns` | Active stay records |
| 8 | `payments` | Payment transactions |
| 9 | `invoices` | Itemised billing documents |
| 10 | `services` | Bookable hotel services catalogue |
| 11 | `serviceRequests` | Guest service requests during stay |
| 12 | `housekeeping` | Housekeeping task assignments |
| 13 | `maintenance` | Room / facility maintenance tickets |
| 14 | `feedback` | Guest reviews and ratings |
| 15 | `notifications` | In-app notification messages |
| 16 | `settings` | Per-hotel configuration |
| 17 | `auditLogs` | Immutable audit trail |

---

## 2. Collection Schemas

### 2.1 `users`

Stores all staff accounts (superAdmin, hotelAdmin, manager, receptionist, housekeeping).  
Guests have a separate `guests` collection.

```
users {
  _id           : ObjectId  (PK)
  fullName      : String    required, trim, maxLength 100
  email         : String    required, unique, lowercase, trim
  passwordHash  : String    required, select: false
  role          : String    required, enum [superAdmin, hotelAdmin, manager, receptionist, housekeeping]
  hotelIds      : [ObjectId] ref: hotels   // hotels this user has access to
  phone         : String
  avatar        : String    // URL
  isActive      : Boolean   default true
  lastLogin     : Date
  createdBy     : ObjectId  ref: users
  createdAt     : Date      auto
  updatedAt     : Date      auto
}
```

**Indexes:**
- `email` – unique index
- `role` – single-field index
- `hotelIds` – multi-key index

---

### 2.2 `hotels`

```
hotels {
  _id           : ObjectId  (PK)
  name          : String    required, trim
  slug          : String    unique, lowercase    // URL-friendly identifier
  description   : String
  address       : {
    street      : String
    city        : String    required
    state       : String
    country     : String    required
    postalCode  : String
  }
  phone         : String    required
  email         : String    required
  website       : String
  starRating    : Number    min 1, max 5
  coverImage    : String    // URL
  images        : [String]  // gallery URLs
  amenities     : [String]
  checkInTime   : String    default "14:00"
  checkOutTime  : String    default "11:00"
  currency      : String    default "USD"
  taxRate       : Number    default 0           // percentage
  isActive      : Boolean   default true
  createdBy     : ObjectId  ref: users
  createdAt     : Date      auto
  updatedAt     : Date      auto
}
```

**Indexes:**
- `slug` – unique index
- `isActive` – single-field index
- `address.city`, `address.country` – compound index (for search)

---

### 2.3 `guests`

```
guests {
  _id           : ObjectId  (PK)
  firstName     : String    required, trim
  lastName      : String    required, trim
  email         : String    required, unique, lowercase
  passwordHash  : String    select: false         // for guest portal login
  phone         : String
  dateOfBirth   : Date
  gender        : String    enum [male, female, other, preferNotToSay]
  nationality   : String
  idType        : String    enum [passport, nationalId, driversLicense, other]
  idNumber      : String
  idExpiry      : Date
  address       : {
    street      : String
    city        : String
    country     : String
    postalCode  : String
  }
  loyaltyPoints : Number    default 0
  preferences   : {
    roomType    : String
    floorLevel  : String
    smokingRoom : Boolean
    specialRequests : String
  }
  isActive      : Boolean   default true
  createdAt     : Date      auto
  updatedAt     : Date      auto
}
```

**Indexes:**
- `email` – unique index
- `phone` – single-field index
- `idNumber` – single-field index (for check-in document verification)

---

### 2.4 `roomTypes`

```
roomTypes {
  _id           : ObjectId  (PK)
  hotelId       : ObjectId  ref: hotels  required
  name          : String    required      // e.g. "Deluxe King Suite"
  description   : String
  maxOccupancy  : Number    required, min 1
  basePrice     : Number    required, min 0
  images        : [String]
  amenities     : [String]
  size          : Number                 // sq metres
  bedConfiguration : String             // e.g. "1 King Bed"
  isActive      : Boolean   default true
  createdAt     : Date      auto
  updatedAt     : Date      auto
}
```

**Indexes:**
- `hotelId` – single-field index
- `{ hotelId, isActive }` – compound index

---

### 2.5 `rooms`

```
rooms {
  _id              : ObjectId  (PK)
  hotelId          : ObjectId  ref: hotels      required
  roomTypeId       : ObjectId  ref: roomTypes   required
  roomNumber       : String    required, trim
  floor            : Number
  status           : String    enum [available, occupied, reserved, maintenance, outOfOrder]
                               default: available
  housekeepingStatus : String  enum [clean, dirty, inspecting, outOfService]
                               default: clean
  notes            : String
  isActive         : Boolean   default true
  createdAt        : Date      auto
  updatedAt        : Date      auto
}
```

**Indexes:**
- `{ hotelId, roomNumber }` – unique compound index
- `{ hotelId, status }` – compound index
- `{ hotelId, housekeepingStatus }` – compound index
- `roomTypeId` – single-field index

---

### 2.6 `bookings`

**Central reservation document.**

```
bookings {
  _id              : ObjectId  (PK)
  bookingNumber    : String    required, unique     // human-readable e.g. BK-20261125-0001
  hotelId          : ObjectId  ref: hotels      required
  guestId          : ObjectId  ref: guests      required
  roomId           : ObjectId  ref: rooms       required
  roomTypeId       : ObjectId  ref: roomTypes
  checkInDate      : Date      required
  checkOutDate     : Date      required
  adults           : Number    required, min 1
  children         : Number    default 0
  status           : String    enum [pending, confirmed, checkedIn, checkedOut, cancelled, noShow]
                               default: pending
  source           : String    enum [walk-in, online, phone, ota]  default: online
  ratePerNight     : Number    required
  totalNights      : Number    required
  subtotal         : Number    required
  taxAmount        : Number    required
  discountAmount   : Number    default 0
  totalAmount      : Number    required
  depositAmount    : Number    default 0
  balanceDue       : Number
  specialRequests  : String
  cancellationReason : String
  cancelledAt      : Date
  cancelledBy      : ObjectId  ref: users
  createdBy        : ObjectId  ref: users        // staff who created booking
  confirmedBy      : ObjectId  ref: users
  createdAt        : Date      auto
  updatedAt        : Date      auto
}
```

**Indexes:**
- `bookingNumber` – unique index
- `{ hotelId, status }` – compound index
- `{ hotelId, roomId, checkInDate, checkOutDate }` – compound index (overlap check)
- `guestId` – single-field index
- `{ checkInDate, checkOutDate }` – compound index (date range queries)

**Validation Rules:**
- `checkOutDate` must be strictly after `checkInDate`
- `totalNights` = computed from date difference
- Overlap check: no other confirmed/checkedIn booking may share the same `roomId` and date range (enforced in service layer)

---

### 2.7 `checkIns`

```
checkIns {
  _id              : ObjectId  (PK)
  hotelId          : ObjectId  ref: hotels      required
  bookingId        : ObjectId  ref: bookings    required, unique
  guestId          : ObjectId  ref: guests      required
  roomId           : ObjectId  ref: rooms       required
  checkInTime      : Date      required         // actual arrival datetime
  checkOutTime     : Date                       // actual departure datetime (null until checked out)
  keyCardNumber    : String
  idVerified       : Boolean   default false
  idType           : String
  idNumber         : String
  companions       : [{
    name           : String
    idType         : String
    idNumber       : String
  }]
  notes            : String
  checkedInBy      : ObjectId  ref: users
  checkedOutBy     : ObjectId  ref: users
  createdAt        : Date      auto
  updatedAt        : Date      auto
}
```

**Indexes:**
- `bookingId` – unique index (one checkIn per booking)
- `{ hotelId, roomId }` – compound index
- `guestId` – single-field index

---

### 2.8 `payments`

```
payments {
  _id              : ObjectId  (PK)
  hotelId          : ObjectId  ref: hotels      required
  bookingId        : ObjectId  ref: bookings    required
  guestId          : ObjectId  ref: guests      required
  amount           : Number    required, min 0
  currency         : String    default "USD"
  method           : String    enum [cash, card, bankTransfer, online, voucher]
  status           : String    enum [pending, completed, failed, refunded]  default: pending
  transactionId    : String                     // gateway reference
  referenceNumber  : String    unique
  notes            : String
  paidAt           : Date
  processedBy      : ObjectId  ref: users
  refundedAmount   : Number    default 0
  refundReason     : String
  createdAt        : Date      auto
  updatedAt        : Date      auto
}
```

**Indexes:**
- `bookingId` – single-field index
- `{ hotelId, status }` – compound index
- `referenceNumber` – unique index
- `guestId` – single-field index

---

### 2.9 `invoices`

```
invoices {
  _id              : ObjectId  (PK)
  invoiceNumber    : String    unique
  hotelId          : ObjectId  ref: hotels      required
  bookingId        : ObjectId  ref: bookings    required
  guestId          : ObjectId  ref: guests      required
  lineItems        : [{
    description    : String    required
    quantity       : Number    required
    unitPrice      : Number    required
    total          : Number    required
    category       : String    enum [room, service, food, tax, discount, other]
  }]
  subtotal         : Number    required
  taxAmount        : Number    required
  discountAmount   : Number    default 0
  totalAmount      : Number    required
  amountPaid       : Number    default 0
  balanceDue       : Number
  status           : String    enum [draft, issued, paid, void]  default: draft
  issuedAt         : Date
  dueDate          : Date
  notes            : String
  generatedBy      : ObjectId  ref: users
  createdAt        : Date      auto
  updatedAt        : Date      auto
}
```

**Indexes:**
- `invoiceNumber` – unique index
- `bookingId` – single-field index
- `{ hotelId, status }` – compound index

---

### 2.10 `services`

Hotel services catalogue (spa, laundry, dining, etc.).

```
services {
  _id           : ObjectId  (PK)
  hotelId       : ObjectId  ref: hotels  required
  name          : String    required, trim
  description   : String
  category      : String    enum [dining, spa, laundry, transport, activity, other]
  price         : Number    required, min 0
  unit          : String    // "per session", "per kg", "per hour"
  image         : String
  isActive      : Boolean   default true
  createdAt     : Date      auto
  updatedAt     : Date      auto
}
```

**Indexes:**
- `{ hotelId, category }` – compound index
- `{ hotelId, isActive }` – compound index

---

### 2.11 `serviceRequests`

```
serviceRequests {
  _id           : ObjectId  (PK)
  hotelId       : ObjectId  ref: hotels      required
  guestId       : ObjectId  ref: guests      required
  bookingId     : ObjectId  ref: bookings    required
  roomId        : ObjectId  ref: rooms       required
  serviceId     : ObjectId  ref: services    required
  quantity      : Number    default 1
  totalPrice    : Number
  status        : String    enum [pending, inProgress, completed, cancelled]  default: pending
  requestedAt   : Date      default: now
  completedAt   : Date
  notes         : String
  handledBy     : ObjectId  ref: users
  createdAt     : Date      auto
  updatedAt     : Date      auto
}
```

**Indexes:**
- `{ hotelId, status }` – compound index
- `guestId` – single-field index
- `bookingId` – single-field index

---

### 2.12 `housekeeping`

```
housekeeping {
  _id              : ObjectId  (PK)
  hotelId          : ObjectId  ref: hotels  required
  roomId           : ObjectId  ref: rooms   required
  assignedTo       : ObjectId  ref: users   required  // housekeeping role
  taskType         : String    enum [cleaning, turndown, inspection, deepClean, other]
  priority         : String    enum [low, medium, high, urgent]  default: medium
  status           : String    enum [pending, inProgress, completed, skipped]  default: pending
  scheduledDate    : Date      required
  startedAt        : Date
  completedAt      : Date
  checklistItems   : [{
    item           : String
    isDone         : Boolean   default false
  }]
  notes            : String
  supervisorNotes  : String
  verifiedBy       : ObjectId  ref: users
  createdAt        : Date      auto
  updatedAt        : Date      auto
}
```

**Indexes:**
- `{ hotelId, scheduledDate }` – compound index
- `{ hotelId, status }` – compound index
- `assignedTo` – single-field index
- `roomId` – single-field index

---

### 2.13 `maintenance`

```
maintenance {
  _id           : ObjectId  (PK)
  hotelId       : ObjectId  ref: hotels  required
  roomId        : ObjectId  ref: rooms            // null if facility-level issue
  location      : String    required              // e.g. "Room 304" or "Lobby Elevator"
  issue         : String    required
  priority      : String    enum [low, medium, high, critical]  default: medium
  status        : String    enum [open, inProgress, resolved, closed]  default: open
  reportedBy    : ObjectId  ref: users
  assignedTo    : ObjectId  ref: users
  resolvedAt    : Date
  resolutionNotes : String
  images        : [String]  // before/after photos
  createdAt     : Date      auto
  updatedAt     : Date      auto
}
```

**Indexes:**
- `{ hotelId, status }` – compound index
- `{ hotelId, priority }` – compound index
- `roomId` – single-field index

---

### 2.14 `feedback`

```
feedback {
  _id           : ObjectId  (PK)
  hotelId       : ObjectId  ref: hotels    required
  guestId       : ObjectId  ref: guests    required
  bookingId     : ObjectId  ref: bookings  required
  overallRating : Number    required, min 1, max 5
  ratings       : {
    cleanliness : Number    min 1, max 5
    service     : Number    min 1, max 5
    comfort     : Number    min 1, max 5
    location    : Number    min 1, max 5
    valueForMoney : Number  min 1, max 5
  }
  title         : String
  comment       : String
  isPublic      : Boolean   default true
  isVerified    : Boolean   default false
  managementReply : String
  repliedBy     : ObjectId  ref: users
  repliedAt     : Date
  createdAt     : Date      auto
  updatedAt     : Date      auto
}
```

**Indexes:**
- `{ hotelId, isPublic }` – compound index
- `guestId` – single-field index
- `bookingId` – unique index (one review per booking)

---

### 2.15 `notifications`

```
notifications {
  _id           : ObjectId  (PK)
  recipientId   : ObjectId  required              // ref: users OR guests
  recipientType : String    enum [user, guest]    required
  hotelId       : ObjectId  ref: hotels           // null for system-wide
  type          : String    enum [booking, payment, housekeeping, maintenance, service, system]
  title         : String    required
  message       : String    required
  link          : String                          // deep link in app
  isRead        : Boolean   default false
  readAt        : Date
  createdAt     : Date      auto
}
```

**Indexes:**
- `{ recipientId, isRead }` – compound index
- `{ recipientId, createdAt }` – compound index (pagination)
- TTL index on `createdAt` (expire after 90 days)

---

### 2.16 `settings`

```
settings {
  _id           : ObjectId  (PK)
  hotelId       : ObjectId  ref: hotels  required, unique
  bookingPolicy : {
    minAdvanceBookingHours  : Number  default 2
    maxAdvanceBookingDays   : Number  default 365
    cancellationWindowHours : Number  default 24
    cancellationFeePercent  : Number  default 0
  }
  invoicePrefix : String    default "INV"
  bookingPrefix : String    default "BK"
  defaultCurrency : String  default "USD"
  taxRate       : Number    default 0
  loyaltyPointsPerDollar : Number  default 1
  emailNotifications : Boolean  default true
  smsNotifications   : Boolean  default false
  updatedBy     : ObjectId  ref: users
  createdAt     : Date      auto
  updatedAt     : Date      auto
}
```

**Indexes:**
- `hotelId` – unique index

---

### 2.17 `auditLogs`

**Immutable.** No updates or deletes permitted on this collection.

```
auditLogs {
  _id           : ObjectId  (PK)
  hotelId       : ObjectId  ref: hotels      // null for super admin actions
  actorId       : ObjectId  required         // ref: users or guests
  actorRole     : String    required
  actorEmail    : String    required         // snapshot at time of action
  action        : String    required         // e.g. "booking.created"
  targetCollection : String required         // e.g. "bookings"
  targetId      : ObjectId                   // document affected
  changes       : Object                     // { before: {}, after: {} }
  ipAddress     : String
  userAgent     : String
  createdAt     : Date      auto
}
```

**Indexes:**
- `{ hotelId, createdAt }` – compound index
- `actorId` – single-field index
- `action` – single-field index
- TTL index on `createdAt` (expire after 2 years)

---

## 3. Entity Relationship Summary

```
hotels ──< roomTypes
hotels ──< rooms
hotels ──< users (via hotelIds[])
hotels ──< bookings
hotels ──< services
hotels ──< settings (1-to-1)

roomTypes ──< rooms

guests ──< bookings
guests ──< checkIns
guests ──< payments
guests ──< serviceRequests
guests ──< feedback

bookings ──1──< checkIns  (one checkIn per booking)
bookings ──< payments
bookings ──1──< invoices  (one invoice per booking)
bookings ──< serviceRequests

rooms ──< housekeeping
rooms ──< maintenance

services ──< serviceRequests

users ──< housekeeping (assignedTo)
users ──< maintenance  (assignedTo)
```

---

## 4. Global Design Decisions

| Decision | Rationale |
|----------|-----------|
| Separate `guests` from `users` | Guests have fundamentally different data (loyalty, preferences, ID docs) and security requirements from staff |
| `bookingNumber` as human-readable ID | Front-desk staff need a short reference for phone/walk-in |
| Snapshot `actorEmail` in auditLogs | Staff accounts may be deleted; audit trail must remain intact |
| No embedding for large arrays | Payments, line items in invoices grow unboundedly; kept as references |
| `hotelId` on every scoped document | Enables single-index multi-tenancy filtering without joins |
| TTL on notifications (90 days) | Prevent unbounded collection growth |
| TTL on auditLogs (2 years) | Regulatory retention period |

