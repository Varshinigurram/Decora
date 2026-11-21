# Décora — Day 12, Stage 3: Authentication & User Management Implementation Report

**Status:** Completed & Verified  
**Date:** November 21, 2026  
**Scope:** Phase 4 — Backend Development (Day 12, Stage 3: Authentication & User Management)  
**Stack:** Node.js (ES Modules), Express 4.x, MongoDB / Mongoose 8.x, React 18, Vite, Axios  

---

## 1. Executive Summary

Stage 3 implements production-conscious authentication and user management for the Décora Interior Design & Furniture Customization platform.

The system replaces prior dummy mockups with a dual-token JWT authentication architecture utilizing secure HTTP-only cookies, atomic MongoDB single-session rotation, constant-time cryptographic hash verification, real-time database role authorization, origin-level CSRF defense, a decoupled singleton Axios refresh queue, and protected frontend route guards.

All existing Days 1–11 features (2D Room Planner, Customizer pricing engine, design board persistence, wishlist, and responsive layouts) remain preserved and unregressed.

---

## 2. Actual Files Created & Modified

### Backend Files Created (`server/`)
- `src/models/User.js` — Mongoose schema, normalized unique email index, `select: false` password, `refreshTokenHash`, `tokenVersion`, pre-save bcrypt hashing hook, and `comparePassword()` method.
- `src/utils/cookieConfig.js` — Standardized cookie creation and matching deletion helpers (`path: '/'` for access; `path: '/api/v1/auth'` for refresh).
- `src/utils/cryptoUtils.js` — SHA-256 token hashing (`hashToken`) and constant-time digest comparison (`safeCompareHashes`) via `crypto.timingSafeEqual`.
- `src/validators/authValidators.js` — Native zero-dependency payload validation enforcing minimum 8 characters, maximum 72 bytes, $\ge 1$ letter, $\ge 1$ digit, valid email syntax, and discarding client-supplied roles.
- `src/middleware/authMiddleware.js` — `authenticateJWT` verifying token signature, checking live MongoDB user existence, active status (`isActive`), and `tokenVersion`.
- `src/middleware/roleMiddleware.js` — `requireRole` and `requireAdmin` guards checking authoritative live database roles.
- `src/middleware/csrfMiddleware.js` — `validateOrigin` inspecting `Origin` and `Referer` headers on state-changing requests (`POST`, `PUT`, `PATCH`, `DELETE`).
- `src/services/authService.js` — Core business logic for JWT issuance with unique `jti`, constant-time credential checking, atomic refresh token rotation, and replay detection.
- `src/controllers/authController.js` — Standardized response handlers for `register`, `login`, `refresh`, `logout`, and `getMe`.
- `src/routes/authRoutes.js` — Express router mounting rate-limited, validated auth endpoints under `/api/v1/auth`.
- `scripts/seedAdmin.js` — Idempotent CLI administrator provisioning script.
- `tests/auth.test.js` — Comprehensive 27-test automated integration test suite.

### Backend Files Modified (`server/`)
- `src/middleware/rateLimitMiddleware.js` — Added dedicated `authLimiter` (15m window; 100 dev / 10 prod).
- `src/routes/index.js` — Mounted `authRoutes` at `/auth` and verification endpoint `/admin/test`.

### Frontend Files Created (`client/`)
- `src/components/ProtectedRoute.jsx` — Route protection wrapper with loading state, redirection with preserved `from` location, and `adminOnly` role gating.

### Frontend Files Modified (`client/`)
- `src/services/api.js` — Added singleton refresh queue interceptor serializing concurrent 401s without recursion or loops.
- `src/context/AuthContext.jsx` — Real backend authentication context with `login`, `register`, `logout`, session check on mount (`checkAuth`), and session-expiration event listeners.
- `src/pages/LoginPage.jsx` — Controlled inputs, validation, loading state, error alert banners, safe internal redirection.
- `src/pages/RegisterPage.jsx` — Controlled inputs, 8-character validation, loading state, error banners.
- `src/routes/AppRoutes.jsx` — Guarded `/admin` route with `<ProtectedRoute adminOnly={true}>`.
- `src/components/layout/Navbar.jsx` — Integrated live authentication state, user name/account indicator, "Admin" badge link, and Sign Out action.

---

## 3. Implemented Authentication Architecture

### 3.1. Dual-Token Strategy
| Token | Lifetime | Payload Claims | Storage Mechanism | Path |
| :--- | :--- | :--- | :--- | :--- |
| **Access Token** | 15 Minutes | `{ id, role, tokenVersion, type: 'access' }` | HTTP-only Cookie (`accessToken`) | `/` |
| **Refresh Token** | 7 Days | `{ id, tokenVersion, type: 'refresh', jti: uuid }` | HTTP-only Cookie (`refreshToken`) | `/api/v1/auth` |

### 3.2. Password Policy
- **Minimum Length:** 8 characters.
- **Maximum Length:** 72 bytes (strictly enforced at validation to prevent bcrypt silent truncation).
- **Complexity:** At least one letter (`/[a-zA-Z]/`) and at least one digit (`/[0-9]/`).
- **Input Integrity:** Passwords are **never trimmed** or silently modified.
- **Hashing:** Asynchronous bcrypt with work factor 10 (`env.BCRYPT_SALT_ROUNDS`).

### 3.3. Refresh Token Rotation & Single-Session Policy
- **Storage:** Only the SHA-256 digest is stored in `User.refreshTokenHash` (`select: false`).
- **Atomic Rotation:**
  ```javascript
  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id, refreshTokenHash: incomingHash, tokenVersion: decoded.tokenVersion, isActive: true },
    { $set: { refreshTokenHash: newRefreshHash } },
    { new: true }
  );
  ```
- **Single-Session Limitation:** Each user account maintains one active refresh session. Logging in from a second device replaces `refreshTokenHash`, superseding the prior session.
- **Replay Protection:** If an already-rotated token from the current `tokenVersion` is re-presented, the server detects token reuse, increments `user.tokenVersion`, clears `refreshTokenHash`, and revokes the active session.
- **Concurrency Safety:** Because every refresh token carries a cryptographically unique `jti: crypto.randomUUID()`, new refresh hashes never collide with incoming hashes even when generated within the same second. Concurrent refresh attempts result in exactly one successful rotation and immediate 401 rejection for the other.

### 3.4. CSRF Defense-in-Depth
- `SameSite: 'lax'` on all cookies.
- `validateOrigin` middleware validates that `Origin` (or parsed `Referer`) matches `env.CLIENT_URL` for state-changing HTTP methods.
- Requires `Content-Type: application/json`, which cannot be dispatched cross-origin by standard HTML forms without triggering CORS preflights.

### 3.5. Resilient Logout
- Accepts requests even when the access token has expired, as long as a valid refresh cookie exists.
- Invalidate `refreshTokenHash` on the database record.
- Clears both cookies using matching paths (`path: '/'` and `path: '/api/v1/auth'`) and options.
- Returns consistent HTTP 200 response regardless of cookie presence, ensuring client state can always be reset cleanly.

---

## 4. Administrator Provisioning

- **Zero Hardcoded Credentials:** Public registration is locked to `role: 'customer'`.
- **CLI Utility:** `node server/scripts/seedAdmin.js <email> <password> [fullName]`.
- **Environment Integration:** Reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`.
- **Idempotence:** If an administrator account already exists with that email, the script logs the existing account and exits with code 0 without modifying credentials.

---

## 5. Guest Design-Board Migration Boundary

- `AuthContext` provides a migration hook placeholder (`migrateGuestBoards()`).
- **Boundary Guarantee:** No network requests are made to `/boards/migrate` during Stage 3 because the backend board persistence endpoint will be implemented in Stage 5.
- Guest design boards remain safely persisted in `localStorage` (`decora_design_boards`) without data loss.

---

## 6. Verification & Test Execution Results

### 6.1. Backend Automated Integration Test Suite (`server/tests/auth.test.js`)
All 27 automated integration tests were executed against the live Express server and local MongoDB database (`decora_dev` on port 5088):

| # | Test Case Description | Method / Path | Expected Outcome | Actual Result | Status |
|---|---|---|---|---|---|
| 1 | Valid Registration | `POST /auth/register` | HTTP 201, cookies set, role forced to customer | HTTP 201, role `customer`, cookies set | **PASSED** |
| 2 | Invalid email syntax | `POST /auth/register` | HTTP 400 with field error | HTTP 400 (`field: 'email'`) | **PASSED** |
| 3 | Password $< 8$ characters | `POST /auth/register` | HTTP 400 with field error | HTTP 400 (`field: 'password'`) | **PASSED** |
| 4 | Password without letters | `POST /auth/register` | HTTP 400 with field error | HTTP 400 (`field: 'password'`) | **PASSED** |
| 5 | Password without digits | `POST /auth/register` | HTTP 400 with field error | HTTP 400 (`field: 'password'`) | **PASSED** |
| 6 | Duplicate email collision | `POST /auth/register` | HTTP 409 Conflict | HTTP 409 Conflict | **PASSED** |
| 7 | Stored password is hash, not plaintext | DB inspection | Bcrypt hash starting with `$2a$` / `$2b$` | Confirmed `$2a$10$...` hash | **PASSED** |
| 8 | Password & token hash excluded from responses | Response inspection | Properties undefined | `password: undefined`, `refreshTokenHash: undefined` | **PASSED** |
| 9 | Valid login | `POST /auth/login` | HTTP 200, cookies set | HTTP 200, cookies set | **PASSED** |
| 10 | Unknown email login | `POST /auth/login` | Generic HTTP 401 | HTTP 401 (`"Invalid email address or password."`) | **PASSED** |
| 11 | Incorrect password login | `POST /auth/login` | Generic HTTP 401 | HTTP 401 (`"Invalid email address or password."`) | **PASSED** |
| 12 | Access cookie security attributes | Cookie header check | `HttpOnly`, `SameSite=Lax`, `Path=/` | Confirmed `HttpOnly; Path=/; SameSite=Lax` | **PASSED** |
| 13 | Refresh cookie security attributes | Cookie header check | `HttpOnly`, `SameSite=Lax`, `Path=/api/v1/auth` | Confirmed `HttpOnly; Path=/api/v1/auth; SameSite=Lax` | **PASSED** |
| 14 | Authenticated profile retrieval | `GET /auth/me` | HTTP 200 with user data | HTTP 200, user data returned | **PASSED** |
| 15 | Unauthenticated profile retrieval | `GET /auth/me` | HTTP 401 Unauthorized | HTTP 401 Unauthorized | **PASSED** |
| 16 | Expired access token rejection | `GET /auth/me` | HTTP 401 Unauthorized | HTTP 401 Unauthorized | **PASSED** |
| 17 | Silent session refresh | `POST /auth/refresh` | HTTP 200, rotated cookies | HTTP 200, new token pair issued | **PASSED** |
| 18 | Refresh-token database hash rotation | DB inspection | Hash differs from old token | Database hash updated to new digest | **PASSED** |
| 19 | Superseded token replay rejection | `POST /auth/refresh` | HTTP 401 Unauthorized | HTTP 401 Unauthorized | **PASSED** |
| 20 | Logout with valid cookies | `POST /auth/logout` | HTTP 200, cookies cleared | HTTP 200, both cookies cleared | **PASSED** |
| 21 | Logout with expired access token | `POST /auth/logout` | HTTP 200, cookies cleared | HTTP 200, cookies cleared | **PASSED** |
| 22 | Cookie deletion matching paths | Cookie header check | `Path=/` and `Path=/api/v1/auth` | Exact matching paths cleared | **PASSED** |
| 23 | Customer denied admin route | `GET /admin/test` | HTTP 403 Forbidden | HTTP 403 Forbidden | **PASSED** |
| 24 | Admin permitted admin route | `GET /admin/test` | HTTP 200 OK | HTTP 200 OK | **PASSED** |
| 25 | Untrusted Origin rejection | `POST /auth/refresh` | HTTP 403 Forbidden | HTTP 403 Forbidden (`"untrusted origin"`) | **PASSED** |
| 26 | Concurrent refresh requests | Parallel `/auth/refresh` | Exactly one 200, second 401 | `[200, 401]` confirmed | **PASSED** |
| 27 | Health & Readiness endpoints | `GET /health`, `/ready` | HTTP 200 HEALTHY / READY | HTTP 200 HEALTHY / READY | **PASSED** |

### 6.2. Failures Discovered & Resolutions
1. **Sub-second Token Collision in Concurrency Test:**
   - *Problem:* JWT standard timestamps (`iat`) operate with 1-second resolution. When two refresh requests fired within 2ms, `jwt.sign()` produced identical tokens, causing the new hash to equal the old hash and allowing both to match `findOneAndUpdate`.
   - *Resolution:* Added `jti: crypto.randomUUID()` to the refresh token payload. Every refresh token is now globally unique, ensuring the new hash is always different and concurrent requests cleanly result in `[200, 401]`.
2. **Router Middleware Order for Verification Route:**
   - *Problem:* Placing the test admin endpoint on `app` after `notFoundHandler` resulted in 404s.
   - *Resolution:* Mounted the test verification route directly on the versioned API router (`server/src/routes/index.js`) before `notFoundHandler`.
3. **Cookie Variable Tracking in Sequential Tests:**
   - *Problem:* Test 13 performed a login that rotated the customer's refresh token without updating the test runner's reference variable.
   - *Resolution:* Explicitly captured the rotated token in Test 13 and passed the historical pre-rotation token to Test 19.

---

## 7. Known Limitations & Production Caveats

1. **Single-Session Limitation:** The current User model stores one `refreshTokenHash`. Users can only maintain an active session on one browser or device at a time. Logging in elsewhere supersedes earlier sessions.
2. **Short-Lived Access Window:** Access tokens are stateless 15-minute JWTs. While admin routes check MongoDB in real time and reject demoted admins immediately, standard customer endpoints rely on the 15-minute token signature unless `tokenVersion` is checked.
3. **Production Deployment Prerequisites:**
   - In production, `NODE_ENV=production` must be set to enforce HTTPS `secure: true` cookies.
   - `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` must be set to high-entropy 256-bit random strings.
   - `CLIENT_URL` must point to the production domain.
