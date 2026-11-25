# Architecture Diagram – LuxuryStay Hospitality HMS

> **Document Version:** 1.0  
> **Date:** 2026-11-25

---

## 1. Full System Architecture

```mermaid
flowchart TD
    subgraph PUBLIC["Public Access (No Auth)"]
        PUB["Public Booking Interface\n/ Hotel Search / Room Browse"]
    end

    subgraph GUEST_P["Guest Portal  /guest/*"]
        G["Guest\nAuthenticated"]
    end

    subgraph STAFF_P["Staff Portals"]
        REC["Receptionist\n/reception/*"]
        HK["Housekeeping\n/housekeeping/*"]
        MGR["Manager\n/manager/*"]
        HA["Hotel Admin\n/hotel-admin/*"]
        SA["Super Admin\n/super-admin/*"]
    end

    subgraph CLIENT["client/  —  React SPA  Vite + Bootstrap 5"]
        AC["AuthContext\n+ useAuth hook"]
        HC["HotelContext"]
        SVC["Axios Service Layer\nauthService · bookingService · roomService\npaymentService · housekeepingService · ..."]
        RR["React Router v6\nPrivateRoute · RoleRoute"]
    end

    PUB --> CLIENT
    GUEST_P --> CLIENT
    STAFF_P --> CLIENT
    CLIENT --> RR
    RR --> AC
    AC --> HC
    HC --> SVC

    subgraph API["REST API  JSON over HTTPS"]
        EP["/api/v1/..."]
    end

    SVC -->|"Axios HTTP\nBearer JWT"| EP

    subgraph SERVER["server/  —  Node.js  +  Express.js"]
        direction TB
        MW["Global Middleware\nCORS · Helmet · Morgan\nRateLimiter · BodyParser"]
        AUTH_MW["verifyToken\nJWT validation → req.user"]
        ROLE_MW["requireRole\nrole check"]
        HOTEL_MW["requireHotelAccess\nhotelId scope check"]
        VAL["Input Validators\nexpress-validator"]
        CTRL["Controllers\nthin request/response layer"]
        SRVC["Service Layer\nbusiness logic · overlap checks\nstate machine transitions"]
        AUDIT["auditLogger middleware\nwrites auditLogs on every write"]
    end

    EP --> MW
    MW --> AUTH_MW
    AUTH_MW --> ROLE_MW
    ROLE_MW --> HOTEL_MW
    HOTEL_MW --> VAL
    VAL --> CTRL
    CTRL --> SRVC
    SRVC --> AUDIT

    subgraph MODULES["Backend Modules  server/modules/"]
        direction LR
        M_AUTH["auth"]
        M_USERS["users"]
        M_HOTELS["hotels"]
        M_GUESTS["guests"]
        M_RT["roomTypes"]
        M_ROOMS["rooms"]
        M_BOOK["bookings"]
        M_CI["checkIns"]
        M_PAY["payments"]
        M_INV["invoices"]
        M_SVC["services"]
        M_SR["serviceRequests"]
        M_HK["housekeeping"]
        M_MAINT["maintenance"]
        M_FB["feedback"]
        M_NOTIF["notifications"]
        M_SET["settings"]
        M_AUDIT["auditLogs"]
    end

    SRVC --> MODULES

    subgraph DB["MongoDB Atlas  — 17 Collections"]
        direction LR
        C_USERS[("users")]
        C_HOTELS[("hotels")]
        C_GUESTS[("guests")]
        C_RT[("roomTypes")]
        C_ROOMS[("rooms")]
        C_BOOK[("bookings")]
        C_CI[("checkIns")]
        C_PAY[("payments")]
        C_INV[("invoices")]
        C_SVC[("services")]
        C_SR[("serviceRequests")]
        C_HK[("housekeeping")]
        C_MAINT[("maintenance")]
        C_FB[("feedback")]
        C_NOTIF[("notifications")]
        C_SET[("settings")]
        C_AL[("auditLogs")]
    end

    MODULES -->|"Mongoose ODM"| DB
```

---

## 2. Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Client as React Client
    participant API as Express API
    participant DB as MongoDB

    User->>Client: Enter credentials
    Client->>API: POST /api/auth/login
    API->>DB: Find user by email
    DB-->>API: User document
    API->>API: bcrypt.compare(password, hash)
    API-->>Client: { accessToken (15m), refreshToken (7d, httpOnly cookie) }
    Client->>Client: Store accessToken in memory / AuthContext

    Note over Client,API: Every subsequent request
    Client->>API: GET /api/... Authorization: Bearer <accessToken>
    API->>API: verifyToken → attach req.user
    API->>API: requireRole → check role
    API->>API: requireHotelAccess → validate hotelId
    API-->>Client: 200 JSON response

    Note over Client,API: Token expiry
    Client->>API: POST /api/auth/refresh (cookie)
    API->>API: Verify refreshToken
    API-->>Client: New accessToken
```

---

## 3. Booking Lifecycle

```mermaid
stateDiagram-v2
    [*] --> pending : Booking created
    pending --> confirmed : Staff confirms
    pending --> cancelled : Guest/Staff cancels
    confirmed --> checkedIn : Receptionist checks in guest
    confirmed --> cancelled : Staff cancels
    confirmed --> noShow : No arrival recorded
    checkedIn --> checkedOut : Receptionist checks out guest
```

---

## 4. Room Status Lifecycle

```mermaid
stateDiagram-v2
    [*] --> available : Room created
    available --> occupied : Guest checks in
    occupied --> available : Guest checks out\n+ housekeeping clean verified
    available --> maintenance : Maintenance ticket opened
    maintenance --> available : Ticket resolved
    available --> outOfOrder : Admin marks out of order
    outOfOrder --> available : Admin reinstates
```

---

## 5. Housekeeping Task Lifecycle

```mermaid
stateDiagram-v2
    [*] --> pending : Task created\n(auto on check-out or manual)
    pending --> inProgress : Housekeeping starts task
    inProgress --> completed : All checklist items done\nstaff marks complete
    completed --> pending : Supervisor rejects
    pending --> skipped : Supervisor skips task
```

---

## 6. Multi-Hotel Scoping Model

```mermaid
flowchart LR
    SA["superAdmin\nAll hotels"]
    HA1["hotelAdmin\nHotel A + B"]
    HA2["hotelAdmin\nHotel C"]
    MGR["manager\nHotel A"]
    REC["receptionist\nHotel A"]
    HK["housekeeping\nHotel A"]

    SA -->|"unrestricted"| HA1
    SA -->|"unrestricted"| HA2

    HA1 -->|"hotelIds: A, B"| MGR
    HA1 -->|"hotelIds: A, B"| REC
    HA1 -->|"hotelIds: A, B"| HK

    subgraph Scope Check
        direction TB
        SC["requireHotelAccess\nmiddleware"]
        SC -->|"req.user.hotelIds.includes(param.hotelId)"| OK["✅ Proceed"]
        SC -->|"not found"| DENY["❌ 403 Forbidden"]
    end
```

---

## 7. Inter-Module Dependency Map

```mermaid
flowchart TD
    HOTELS["hotels"]
    USERS["users"]
    GUESTS["guests"]
    RT["roomTypes"]
    ROOMS["rooms"]
    BOOKINGS["bookings"]
    CI["checkIns"]
    PAY["payments"]
    INV["invoices"]
    SVC["services"]
    SR["serviceRequests"]
    HK["housekeeping"]
    MAINT["maintenance"]
    FB["feedback"]
    NOTIF["notifications"]
    SET["settings"]
    AL["auditLogs"]

    HOTELS --> RT
    HOTELS --> ROOMS
    HOTELS --> USERS
    HOTELS --> SET

    RT --> ROOMS
    ROOMS --> BOOKINGS
    GUESTS --> BOOKINGS

    BOOKINGS --> CI
    BOOKINGS --> PAY
    BOOKINGS --> INV
    BOOKINGS --> SR
    BOOKINGS --> FB

    SVC --> SR
    ROOMS --> HK
    ROOMS --> MAINT
    USERS --> HK
    USERS --> MAINT

    GUESTS --> NOTIF
    USERS --> NOTIF

    USERS --> AL
    HOTELS --> AL
```

