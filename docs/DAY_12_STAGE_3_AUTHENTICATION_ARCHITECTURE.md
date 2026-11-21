# Décora — Day 12, Stage 3: Authentication & User Management Architecture

**Document Version:** 2.0.0 (Final Architecture & Security Review)  
**Date:** November 21, 2026  
**Status:** Approved Architecture Plan — Awaiting Implementation Gate  
**Phase:** Phase 4 — Backend Development (Day 12, Stage 3)  
**Runtime & Framework:** Node.js (ES Modules), Express 4.x, MongoDB, Mongoose 8.x  

---

## 1. Executive Summary & Architectural Scope

This specification establishes the authoritative security and authentication architecture for Décora. It defines the implementation of customer registration, credential verification, dual-token JWT management with secure HTTP-only cookies, atomic refresh-token rotation, server-side role-based authorization, and client-side session coordination.

### Strict Scope Boundaries
- **In Scope (Stage 3):** User model, password hashing, registration, login, logout, silent session refresh, `/api/v1/auth/me` current user profile, JWT authentication middleware, live database admin verification, authentication rate limiting, CLI admin provisioning, and frontend `AuthContext` / `ProtectedRoute` integration.
- **Explicitly Deferred (Later Stages):**
  - Product catalog APIs and server pricing validation (Stage 4).
  - Design board persistence and `/api/v1/boards/migrate` guest migration endpoint (Stage 5).
  - Wishlist synchronization APIs (Stage 6).
  - Interior design consultation pipeline (Stage 7).
  - Multi-device session-family tracking and token history ledgers (Enterprise Release).
  - OAuth2 / Social Login (Google / Apple) and TOTP 2-Factor Authentication (Enterprise Release).

---

## 2. Security Model & Architecture Corrections

### 2.1. Dual-Token Architecture & Expiry
| Token | Type | Expiry | Secret | Payload | Transport |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Access Token** | Stateless JWT | 15 Minutes | `JWT_ACCESS_SECRET` | `{ id, role, tokenVersion }` | HTTP-only Cookie (`accessToken`), `path: '/'` |
| **Refresh Token** | Single-Use JWT | 7 Days | `JWT_REFRESH_SECRET` | `{ id, tokenVersion }` | HTTP-only Cookie (`refreshToken`), `path: '/api/v1/auth'` |

---

### 2.2. Single-Session-Per-Account Policy & Replay Handling

#### Single-Session Policy
For Stage 3, Décora implements a **single active session per account**:
- The `User` Mongoose schema stores a single `refreshTokenHash` (`select: false`).
- Logging in from a new browser or device replaces `refreshTokenHash` on the user record.
- The previous session on the older device will naturally fail upon its next refresh attempt because its presented token hash will no longer match the database.

#### Safe Replay & Invalidation Mechanics
We explicitly avoid the flawed pattern of invalidating active user sessions merely because an incoming token hash does not match:
1. **Expired Refresh Token:**
   - Caught by `jwt.verify()` (`TokenExpiredError`).
   - **Action:** Return HTTP 401 (`"Session expired. Please sign in again."`).
   - **Security Note:** Normal lifecycle event; does not mutate `tokenVersion` or disrupt active sessions on other devices.
2. **Malformed or Invalid Signature:**
   - Caught by `jwt.verify()` (`JsonWebTokenError`).
   - **Action:** Return HTTP 401 (`"Invalid session token. Please sign in again."`).
3. **Mismatched / Superseded Refresh Token:**
   - The token has a valid signature and is within its 7-day TTL, but its SHA-256 hash does not match `user.refreshTokenHash`.
   - **Action:** Reject with HTTP 401 (`"Invalid or superseded session. Please sign in again."`).
   - **Crucial Security Decision:** The server **does not** automatically increment `tokenVersion` or invalidate the user's active session. Under a single-session model, this mismatch commonly occurs when a user logs in on Device B and Device A subsequently attempts a refresh. Incrementing `tokenVersion` would maliciously terminate Device B's valid active session.
4. **Honest Limitation Acknowledgment:**
   - Full adversary replay detection requires storing a historical ledger of rotated token IDs (token family chains). Because Stage 3 implements a lean, single-session architecture without a historical token ledger, true adversary replay cannot be distinguished from a superseded device refresh. Mismatched tokens are rejected safely without collateral session revocation.

---

### 2.3. Atomic Refresh-Token Rotation

To guarantee that concurrent requests cannot double-spend or race during token refresh:
- Verification hashes the incoming refresh token using SHA-256 (`crypto.createHash('sha256').update(token).digest('hex')`).
- A new refresh token and access token are signed.
- A new SHA-256 hash is computed for the replacement refresh token.
- The rotation executes as an **atomic conditional update** in MongoDB:
  ```javascript
  const updatedUser = await User.findOneAndUpdate(
    {
      _id: decoded.id,
      refreshTokenHash: incomingTokenHash,
      tokenVersion: decoded.tokenVersion,
      isActive: true,
    },
    {
      $set: { refreshTokenHash: newRefreshTokenHash },
    },
    { new: true }
  );
  ```
- **Concurrency Outcome:**
  - If two requests present the exact same refresh token concurrently, MongoDB's atomic document lock ensures exactly one request matches and mutates the record.
  - The second concurrent request finds no matching document (`updatedUser === null`) because `refreshTokenHash` has already changed. It immediately receives HTTP 401 (`"Invalid or expired session. Please sign in again."`) with no data mutation or side-effects.

---

### 2.4. Constant-Time Hash Comparison with `crypto.timingSafeEqual()`

Whenever cryptographic hashes are compared outside of direct MongoDB query indexing (such as in-memory safety checks), standard string equality (`===`) is prohibited to prevent side-channel timing attacks:
- Both hashes are parsed into byte buffers.
- Exact byte-length equality (32 bytes / 64 hex characters for SHA-256) is verified before comparison to avoid runtime `RangeError` exceptions.
- Comparison uses `crypto.timingSafeEqual(bufA, bufB)`.

---

### 2.5. Access-Token Revocation & Live Database Authorization

#### `authenticateJWT` Middleware
1. Reads `accessToken` from `req.cookies.accessToken` (or `Authorization: Bearer <token>` fallback).
2. Verifies cryptographic signature using `env.JWT_ACCESS_SECRET`.
3. Loads the live user record from MongoDB: `User.findById(decoded.id).select('role isActive tokenVersion email fullName')`.
4. Validates real-time account status:
   - If user no longer exists: HTTP 401 (`"User account no longer exists"`).
   - If `!user.isActive`: HTTP 401 (`"Account has been suspended or deactivated"`).
   - If `decoded.tokenVersion !== user.tokenVersion`: HTTP 401 (`"Session has been revoked. Please sign in again"`).
5. Attaches the **current database-backed user** to `req.user`:
   ```javascript
   req.user = {
     id: user._id.toString(),
     email: user.email,
     fullName: user.fullName,
     role: user.role, // Live role from database, never stale JWT claim
     isActive: user.isActive,
   };
   ```

#### `requireAdmin` Middleware
- Executes after `authenticateJWT`.
- Inspects `req.user.role === 'admin'`.
- Because `req.user` is loaded live from the database, administrative privilege revocations take effect immediately without waiting for the 15-minute access token lifespan to expire.
- If unauthorized: returns HTTP 403 (`"Access forbidden: administrative privileges required"`).

---

### 2.6. Exact Cookie Lifecycle & Matching Options

Browsers strictly enforce that `res.clearCookie()` parameters match the creation parameters (notably `path`, `httpOnly`, `sameSite`, and `secure`). If paths mismatch, the browser silently ignores the clear command and retains the cookie.

```javascript
// Centralized Cookie Options Utility (src/utils/cookieConfig.js)
import { env } from '../config/env.js';

export const COOKIE_NAMES = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
};

export const getAccessCookieOptions = () => ({
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'lax',
  maxAge: 15 * 60 * 1000, // 15 minutes
  path: '/',
});

export const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/v1/auth', // Restricted path: only sent to auth endpoints
});

export const clearAccessCookie = (res) => {
  res.clearCookie(COOKIE_NAMES.ACCESS, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: '/',
  });
};

export const clearRefreshCookie = (res) => {
  res.clearCookie(COOKIE_NAMES.REFRESH, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: '/api/v1/auth',
  });
};
```

---

### 2.7. CSRF & Origin Protection Strategy

We explicitly recognize that **CORS alone does not prevent CSRF**:
1. **Cookie Defense (`SameSite=Lax`):** Modern browsers will not attach `SameSite=Lax` cookies to cross-origin `POST`, `PUT`, or `DELETE` requests initiated from third-party sites.
2. **Origin Validation Middleware (`validateOrigin`):**
   - Applies to all state-changing HTTP methods (`POST`, `PUT`, `PATCH`, `DELETE`).
   - Inspects `req.headers.origin`. If present, it must strictly match `env.CLIENT_URL`.
   - If `Origin` is absent, inspects `req.headers.referer` as a deliberate fallback, parsing the URL and verifying that its origin matches `env.CLIENT_URL`.
   - **Automated Tests & CLI Non-Browser Operations:** If both `Origin` and `Referer` are absent (e.g. Node tests, curl, postman), the request is permitted only if `req.cookies.accessToken` is absent (relying on Bearer tokens or public calls) or in explicit test mode where `Origin` is passed by test helpers.
3. **Structured Payload Requirement:** State-changing endpoints require `Content-Type: application/json`. Simple HTML forms cannot produce JSON bodies with credentials without triggering a CORS preflight, which our server strictly controls.

---

### 2.8. Resilient Logout Behavior

The `POST /api/v1/auth/logout` endpoint is engineered for total resilience:
- It succeeds even if the access token has expired, provided the refresh cookie is present.
- It attempts to decode the refresh token or access token to identify the user and set `User.findByIdAndUpdate(userId, { $set: { refreshTokenHash: null } })`.
- Regardless of whether the token is valid, expired, or missing, the server **always clears both cookies** using matching paths (`path: '/'` and `path: '/api/v1/auth'`).
- Always returns HTTP 200 (`"Signed out successfully"`), ensuring the client UI can reset its state cleanly without getting trapped in error loops.

---

### 2.9. Password Specification & User Model Rules

- **Password Requirements:** Minimum 8 characters, maximum 72 bytes, containing at least one letter and one number.
  - *bcrypt Limitation:* bcrypt silently truncates input strings at 72 bytes. Enforcing `max: 72` prevents passwords beyond 72 bytes from giving a false sense of security.
  - *No Silent Modification:* Passwords must **never be trimmed** or transformed; leading or trailing spaces can be deliberate parts of passphrases.
- **Email Normalization:** Cleaned with `.trim().toLowerCase()`. Unique sparse index.
- **Schema Protection:** `password: { type: String, required: true, select: false }`.
- **Pre-Save Hook:** Only hashes with `bcrypt.hash()` if `this.isModified('password')`.
- **Update Rule:** Updates to passwords must always use document retrieval and `.save()`. Never use `findOneAndUpdate` for password changes.
- **Duplicate Email Handling:** Handled gracefully with explicit pre-checks and global MongoDB code `11000` normalization into HTTP 409 Conflict (`"An account with this email address already exists"`).
- **Server-Controlled Roles:** Registration strictly forces `role: 'customer'`. Any `role` key in incoming request bodies is ignored.

---

## 3. Frontend Integration Architecture

### 3.1. Decoupled Axios Singleton Refresh Queue (`client/src/services/api.js`)

To prevent multiple simultaneous 401 errors from triggering a storm of refresh requests:
- Excludes `/auth/login`, `/auth/register`, `/auth/refresh`, and `/auth/logout` from refresh interceptors.
- Retries failed requests **at most once** (`originalRequest._retry = true`).
- Uses a **singleton promise** so all concurrent requests wait on the same in-flight refresh.

```javascript
let isRefreshing = false;
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Bypass auth endpoints to avoid loops
    if (
      !originalRequest ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/logout')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = api.post('/auth/refresh')
          .then(() => true)
          .catch((refreshError) => {
            // Refresh failed: session is truly dead
            window.dispatchEvent(new CustomEvent('decora:session-expired'));
            return Promise.reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      try {
        await refreshPromise;
        // Replay original request with refreshed session cookie
        return api(originalRequest);
      } catch (replayError) {
        return Promise.reject(replayError);
      }
    }

    return Promise.reject(error);
  }
);
```

### 3.2. `AuthContext.jsx` Modernization
- **Session Check on Mount:** Dispatches `GET /api/v1/auth/me`. If successful, sets `user`, `isAuthenticated = true`, and `isAdmin = user.role === 'admin'`. If 401, sets `user = null`.
- **Event Decoupling:** Listens to `decora:session-expired` event from `api.js` to clear state and update UI without tight coupling.
- **Exposed API:** `login({ email, password })`, `register({ fullName, email, password })`, `logout()`, `user`, `isLoading`, `isAuthenticated`, `isAdmin`.

### 3.3. Guest Board Migration Boundary
- `AuthContext` provides an empty hook placeholder: `migrateGuestBoards()`.
- **Mandatory Boundary:** `migrateGuestBoards()` **must not** make network requests to `/boards/migrate` during Stage 3 because the backend board persistence endpoint will only be implemented in Stage 5.
- Guest design boards remain safely in `localStorage` (`decora_design_boards`) until Stage 5.

---

## 4. Administrator Provisioning Architecture

To uphold the strict rule of **zero hardcoded credentials**:
1. Registration is restricted to `customer` accounts.
2. An administrative provisioning script (`server/scripts/seedAdmin.js`) is executed via Node CLI:
   ```bash
   node scripts/seedAdmin.js
   ```
3. **Environment Inputs:** Reads `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` from `.env`.
4. **Safety & Idempotence:**
   - Checks if an account with `ADMIN_EMAIL` already exists.
   - If it exists, logs: `[Seed] Administrator account already exists. No action taken.` and exits cleanly with code 0. It **never overwrites** existing credentials unexpectedly.
   - If absent, creates the account with `role: 'admin'`, hashing the password with bcrypt.
   - Never logs the password or credentials.

---

## 5. Testing Strategy & Dependency Analysis

### 5.1. Verified Dependency Audit
The existing `server/package.json` contains:
- `bcryptjs` (^2.4.3), `cookie-parser` (^1.4.7), `cors` (^2.8.6), `dotenv` (^16.6.1), `express` (^4.22.3), `express-rate-limit` (^7.5.1), `helmet` (^8.3.0), `jsonwebtoken` (^9.0.3), `mongoose` (^8.24.10), `nodemon` (^3.1.14).

**Missing Testing Dependencies:**
- Neither `supertest`, `jest`, `vitest`, nor `express-validator` are installed.

### 5.2. Strategy for Stage 3 Implementation
1. **Input Validation:** Implement pure, lightweight validation rules in `src/validators/authValidators.js` using standard regular expressions and boundary assertions. No external validation libraries are needed.
2. **Testing Infrastructure:**
   - Use Node.js's native test runner (`node:test`) and assertion library (`node:assert`), which require **zero external dependencies**.
   - When automated HTTP integration tests are created in Phase 3 of implementation, install `supertest` as a dedicated devDependency (`npm install -D supertest`).
   - We do not claim testing libraries are already present.

### 5.3. Test Case Matrix
| Category | Test Case | Target / Method | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **Validation** | Password $< 8$ chars | `POST /auth/register` | HTTP 400 with field-level validation error |
| **Validation** | Password $> 72$ bytes | `POST /auth/register` | HTTP 400 (bcrypt limit protection) |
| **Validation** | Password without digit | `POST /auth/register` | HTTP 400 |
| **Registration** | Valid customer registration | `POST /auth/register` | HTTP 201, cookies set, `role: 'customer'`, password omitted |
| **Registration** | Duplicate email | `POST /auth/register` | HTTP 409 Conflict |
| **Role Guard** | Attempt to register as `admin` | `POST /auth/register { role: 'admin' }` | HTTP 201, but `role` in database is forced to `'customer'` |
| **Login** | Valid credentials | `POST /auth/login` | HTTP 200, sets `accessToken` and `refreshToken` cookies |
| **Login** | Invalid password | `POST /auth/login` | HTTP 401 with generic `"Invalid email address or password"` |
| **Login** | Nonexistent email | `POST /auth/login` | HTTP 401 with identical generic message |
| **Auth Guard** | Access `/auth/me` without cookie | `GET /auth/me` | HTTP 401 Unauthorized |
| **Auth Guard** | Access `/auth/me` with valid cookie | `GET /auth/me` | HTTP 200, returns sanitized user object |
| **Role Guard** | Non-admin accessing admin route | `GET /admin/test` | HTTP 403 Forbidden |
| **Refresh** | Valid silent refresh | `POST /auth/refresh` | HTTP 200, rotates both cookies, updates DB hash atomically |
| **Concurrency** | 2 concurrent refreshes with same token | Parallel `POST /auth/refresh` | 1st returns HTTP 200; 2nd returns HTTP 401 safely |
| **Superseded** | Re-using previous rotated token | `POST /auth/refresh` | HTTP 401; active session remains intact |
| **Logout** | Logout with cookies | `POST /auth/logout` | HTTP 200, clears both cookies with matching paths |
| **Logout** | Logout with expired/missing token | `POST /auth/logout` | HTTP 200, clears cookies, does not throw error |
| **Admin Seed** | Run seed script twice | `node scripts/seedAdmin.js` | 1st creates admin; 2nd logs already exists without modification |

---

## 6. Implementation Sequence & Planned Files

### Files Planned for Creation:
1. `server/src/models/User.js` — Mongoose schema, hooks, methods.
2. `server/src/utils/cookieConfig.js` — Cookie creation and clearing helpers.
3. `server/src/utils/cryptoUtils.js` — SHA-256 and `crypto.timingSafeEqual` helpers.
4. `server/src/validators/authValidators.js` — Zero-dependency payload validation.
5. `server/src/middleware/authMiddleware.js` — `authenticateJWT` with live user check.
6. `server/src/middleware/roleMiddleware.js` — `requireRole` & `requireAdmin`.
7. `server/src/middleware/csrfMiddleware.js` — Origin and Referer validation for state-changing requests.
8. `server/src/services/authService.js` — JWT signing, password comparison, atomic rotation.
9. `server/src/controllers/authController.js` — Request/response orchestration.
10. `server/src/routes/authRoutes.js` — `/api/v1/auth` endpoints.
11. `server/scripts/seedAdmin.js` — CLI administrator seed utility.
12. `client/src/components/ProtectedRoute.jsx` — Frontend route protector.

### Files Planned for Modification:
1. `server/src/middleware/rateLimitMiddleware.js` — Export dedicated `authLimiter`.
2. `server/src/routes/index.js` — Mount `/auth` routes.
3. `client/src/services/api.js` — Add singleton refresh queue.
4. `client/src/context/AuthContext.jsx` — Connect real session state.
5. `client/src/pages/LoginPage.jsx` — Form state, submit handler, errors.
6. `client/src/pages/RegisterPage.jsx` — Form state, 8-character validation, errors.
7. `client/src/routes/AppRoutes.jsx` — Guard `/admin` route.
