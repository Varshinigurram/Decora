import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import http from 'http';
import app from '../src/app.js';
import User from '../src/models/User.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { env } from '../src/config/env.js';
import { authenticateJWT } from '../src/middleware/authMiddleware.js';
import { requireAdmin } from '../src/middleware/roleMiddleware.js';

const TEST_PORT = 5088;
const BASE_URL = `http://localhost:${TEST_PORT}/api/v1`;
const CLIENT_ORIGIN = env.CLIENT_URL || 'http://localhost:5173';

let serverInstance;
const testEmails = new Set();

// Helper to track and cleanup created test users
function registerTestEmail(email) {
  testEmails.add(email.toLowerCase());
}

// Helper for HTTP requests
async function makeRequest(path, { method = 'GET', headers = {}, body = null } = {}) {
  const url = `${BASE_URL}${path}`;
  const fetchHeaders = { ...headers };
  if (body && !fetchHeaders['Content-Type']) {
    fetchHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    method,
    headers: fetchHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }

  // Parse Set-Cookie headers
  const rawCookies = response.headers.getSetCookie ? response.headers.getSetCookie() : [];
  const parsedCookies = {};
  for (const c of rawCookies) {
    const parts = c.split(';').map((p) => p.trim());
    const [keyVal, ...attrs] = parts;
    const [name, val] = keyVal.split('=');
    parsedCookies[name] = {
      value: val,
      raw: c,
      httpOnly: attrs.some((a) => a.toLowerCase() === 'httponly'),
      path: (attrs.find((a) => a.toLowerCase().startsWith('path=')) || '').split('=')[1] || '/',
      sameSite: (attrs.find((a) => a.toLowerCase().startsWith('samesite=')) || '').split('=')[1] || '',
    };
  }

  return {
    status: response.status,
    headers: response.headers,
    data: json,
    cookies: parsedCookies,
    rawCookies,
  };
}

describe('Décora Stage 3 — Authentication & User Management Test Suite', () => {
  before(async () => {
    await connectDB();
    await new Promise((resolve) => {
      serverInstance = app.listen(TEST_PORT, () => resolve());
    });
  });

  after(async () => {
    // Clean up isolated test accounts only
    for (const email of testEmails) {
      await User.deleteOne({ email });
    }
    await new Promise((resolve) => serverInstance.close(resolve));
    await disconnectDB();
  });

  const testCustomerEmail = `test_customer_${Date.now()}@decora-test.com`;
  registerTestEmail(testCustomerEmail);
  const testCustomerPassword = 'SecurePassword123';
  let customerAccessCookie = '';
  let customerRefreshCookie = '';
  let customerRefreshToken = '';
  let customerId = '';

  // 1. Valid Registration
  test('1. Valid Registration returns 201, sets cookies and forces role customer', async () => {
    const res = await makeRequest('/auth/register', {
      method: 'POST',
      headers: { Origin: CLIENT_ORIGIN },
      body: {
        fullName: 'Test Customer',
        email: testCustomerEmail,
        password: testCustomerPassword,
        role: 'admin', // Attempt to escalate role - should be ignored
      },
    });

    assert.equal(res.status, 201);
    assert.equal(res.data.success, true);
    assert.equal(res.data.data.user.role, 'customer');
    assert.equal(res.data.data.user.email, testCustomerEmail);
    assert.equal(res.data.data.user.password, undefined);
    assert.ok(res.cookies.accessToken, 'Access token cookie must be set');
    assert.ok(res.cookies.refreshToken, 'Refresh token cookie must be set');

    customerAccessCookie = res.cookies.accessToken.value;
    customerRefreshCookie = res.cookies.refreshToken.value;
    customerRefreshToken = res.cookies.refreshToken.value;
    customerId = res.data.data.user.id;
  });

  // 2. Registration with invalid email
  test('2. Registration with invalid email returns 400', async () => {
    const res = await makeRequest('/auth/register', {
      method: 'POST',
      headers: { Origin: CLIENT_ORIGIN },
      body: {
        fullName: 'Invalid Email User',
        email: 'not-a-valid-email',
        password: 'ValidPass123',
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
    assert.ok(res.data.errors.some((e) => e.field === 'email'));
  });

  // 3. Password shorter than 8 characters
  test('3. Registration with password < 8 characters returns 400', async () => {
    const res = await makeRequest('/auth/register', {
      method: 'POST',
      headers: { Origin: CLIENT_ORIGIN },
      body: {
        fullName: 'Short Pass User',
        email: 'shortpass@decora-test.com',
        password: 'Pass1',
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
    assert.ok(res.data.errors.some((e) => e.field === 'password'));
  });

  // 4. Password without a letter
  test('4. Registration with password without letters returns 400', async () => {
    const res = await makeRequest('/auth/register', {
      method: 'POST',
      headers: { Origin: CLIENT_ORIGIN },
      body: {
        fullName: 'No Letter User',
        email: 'noletter@decora-test.com',
        password: '1234567890',
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
    assert.ok(res.data.errors.some((e) => e.field === 'password'));
  });

  // 5. Password without a digit
  test('5. Registration with password without digits returns 400', async () => {
    const res = await makeRequest('/auth/register', {
      method: 'POST',
      headers: { Origin: CLIENT_ORIGIN },
      body: {
        fullName: 'No Digit User',
        email: 'nodigit@decora-test.com',
        password: 'PasswordOnly',
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
    assert.ok(res.data.errors.some((e) => e.field === 'password'));
  });

  // 6. Duplicate email registration
  test('6. Duplicate email registration returns 409 Conflict', async () => {
    const res = await makeRequest('/auth/register', {
      method: 'POST',
      headers: { Origin: CLIENT_ORIGIN },
      body: {
        fullName: 'Duplicate User',
        email: testCustomerEmail,
        password: 'NewPassword123',
      },
    });

    assert.equal(res.status, 409);
    assert.equal(res.data.success, false);
  });

  // 7. Password hash is stored, not plaintext
  test('7. Password hash is stored in MongoDB, not plaintext', async () => {
    const userDoc = await User.findOne({ email: testCustomerEmail }).select('+password');
    assert.ok(userDoc);
    assert.notEqual(userDoc.password, testCustomerPassword);
    assert.ok(userDoc.password.startsWith('$2'), 'Password must be a bcrypt hash');
  });

  // 8. Password and refresh token hash absent from user responses
  test('8. Password and refreshTokenHash are absent from user responses', async () => {
    const res = await makeRequest('/auth/register', {
      method: 'POST',
      headers: { Origin: CLIENT_ORIGIN },
      body: {
        fullName: 'Sanitize Test User',
        email: `sanitize_${Date.now()}@decora-test.com`,
        password: 'Password123',
      },
    });
    registerTestEmail(res.data.data?.user?.email || '');

    assert.equal(res.status, 201);
    const u = res.data.data.user;
    assert.equal(u.password, undefined);
    assert.equal(u.refreshTokenHash, undefined);
    assert.equal(u.__v, undefined);
    assert.ok(u.id, 'Must contain sanitized id string');
  });

  // 9. Valid login
  test('9. Valid login returns 200 and sets cookies', async () => {
    const res = await makeRequest('/auth/login', {
      method: 'POST',
      headers: { Origin: CLIENT_ORIGIN },
      body: {
        email: testCustomerEmail,
        password: testCustomerPassword,
      },
    });

    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.ok(res.cookies.accessToken);
    assert.ok(res.cookies.refreshToken);
    customerAccessCookie = res.cookies.accessToken.value;
    customerRefreshCookie = res.cookies.refreshToken.value;
    customerRefreshToken = res.cookies.refreshToken.value;
  });

  // 10. Unknown email returns generic 401
  test('10. Unknown email returns generic 401', async () => {
    const res = await makeRequest('/auth/login', {
      method: 'POST',
      headers: { Origin: CLIENT_ORIGIN },
      body: {
        email: 'unknown_user_xyz_123@decora-test.com',
        password: 'Password123',
      },
    });

    assert.equal(res.status, 401);
    assert.equal(res.data.message, 'Invalid email address or password.');
  });

  // 11. Incorrect password returns generic 401
  test('11. Incorrect password returns generic 401 with identical message', async () => {
    const res = await makeRequest('/auth/login', {
      method: 'POST',
      headers: { Origin: CLIENT_ORIGIN },
      body: {
        email: testCustomerEmail,
        password: 'WrongPassword123',
      },
    });

    assert.equal(res.status, 401);
    assert.equal(res.data.message, 'Invalid email address or password.');
  });

  // 12. Access cookie attributes
  test('12. Access cookie attributes: HttpOnly, SameSite=Lax, Path=/', async () => {
    const res = await makeRequest('/auth/login', {
      method: 'POST',
      headers: { Origin: CLIENT_ORIGIN },
      body: { email: testCustomerEmail, password: testCustomerPassword },
    });

    const accessCookie = res.cookies.accessToken;
    assert.ok(accessCookie.httpOnly, 'Access cookie must be HttpOnly');
    assert.equal(accessCookie.path, '/');
    assert.equal(accessCookie.sameSite.toLowerCase(), 'lax');
  });

  // 13. Refresh cookie attributes and path
  test('13. Refresh cookie attributes: HttpOnly, SameSite=Lax, Path=/api/v1/auth', async () => {
    const res = await makeRequest('/auth/login', {
      method: 'POST',
      headers: { Origin: CLIENT_ORIGIN },
      body: { email: testCustomerEmail, password: testCustomerPassword },
    });

    const refreshCookie = res.cookies.refreshToken;
    assert.ok(refreshCookie.httpOnly, 'Refresh cookie must be HttpOnly');
    assert.equal(refreshCookie.path, '/api/v1/auth');
    assert.equal(refreshCookie.sameSite.toLowerCase(), 'lax');
    customerAccessCookie = res.cookies.accessToken.value;
    customerRefreshToken = res.cookies.refreshToken.value;
  });

  // 14. Successful /me
  test('14. Successful /me with access cookie returns user', async () => {
    const res = await makeRequest('/auth/me', {
      method: 'GET',
      headers: {
        Cookie: `accessToken=${customerAccessCookie}`,
      },
    });

    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.equal(res.data.data.user.email, testCustomerEmail);
    assert.equal(res.data.data.user.role, 'customer');
  });

  // 15. /me without authentication returns 401
  test('15. /me without authentication returns 401', async () => {
    const res = await makeRequest('/auth/me', { method: 'GET' });
    assert.equal(res.status, 401);
    assert.equal(res.data.success, false);
  });

  // 16. Expired access token returns 401
  test('16. Expired access token returns 401', async () => {
    const expiredToken = jwt.sign(
      { id: customerId, role: 'customer', tokenVersion: 0, type: 'access' },
      env.JWT_ACCESS_SECRET,
      { expiresIn: '-1s' }
    );

    const res = await makeRequest('/auth/me', {
      method: 'GET',
      headers: { Cookie: `accessToken=${expiredToken}` },
    });

    assert.equal(res.status, 401);
  });

  // 17. Successful refresh
  let rotatedRefreshToken = '';
  let preRefreshCustomerToken = '';
  test('17. Successful refresh rotates tokens and returns 200', async () => {
    preRefreshCustomerToken = customerRefreshToken;
    const res = await makeRequest('/auth/refresh', {
      method: 'POST',
      headers: {
        Origin: CLIENT_ORIGIN,
        Cookie: `refreshToken=${customerRefreshToken}`,
      },
    });

    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.ok(res.cookies.accessToken);
    assert.ok(res.cookies.refreshToken);
    rotatedRefreshToken = res.cookies.refreshToken.value;
    customerRefreshToken = res.cookies.refreshToken.value;
    customerAccessCookie = res.cookies.accessToken.value;
  });

  // 18. Refresh-token rotation updates hash in DB
  test('18. Refresh-token rotation updates hash in MongoDB', async () => {
    const userDoc = await User.findById(customerId).select('+refreshTokenHash');
    assert.ok(userDoc.refreshTokenHash);
    const crypto = await import('crypto');
    const oldHash = crypto.createHash('sha256').update(preRefreshCustomerToken).digest('hex');
    assert.notEqual(userDoc.refreshTokenHash, oldHash);
  });

  // 19. Reuse of an invalidated / rotated refresh token
  test('19. Reuse of an already rotated refresh token is rejected', async () => {
    // Attempt to use the preRefreshCustomerToken which was already rotated
    const res = await makeRequest('/auth/refresh', {
      method: 'POST',
      headers: {
        Origin: CLIENT_ORIGIN,
        Cookie: `refreshToken=${preRefreshCustomerToken}`,
      },
    });

    assert.equal(res.status, 401);
  });

  // 20. Logout with valid cookies
  test('20. Logout with cookies returns 200 and clears cookies', async () => {
    const res = await makeRequest('/auth/logout', {
      method: 'POST',
      headers: {
        Origin: CLIENT_ORIGIN,
        Cookie: `accessToken=${customerAccessCookie}; refreshToken=${rotatedRefreshToken}`,
      },
    });

    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
  });

  // 21. Logout when access token is expired
  test('21. Logout succeeds even when access token is expired', async () => {
    const expiredToken = jwt.sign(
      { id: customerId, role: 'customer', tokenVersion: 0, type: 'access' },
      env.JWT_ACCESS_SECRET,
      { expiresIn: '-5s' }
    );

    const res = await makeRequest('/auth/logout', {
      method: 'POST',
      headers: {
        Origin: CLIENT_ORIGIN,
        Cookie: `accessToken=${expiredToken}`,
      },
    });

    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
  });

  // 22. Cookie clearing verification
  test('22. Cookie clearing uses matching paths (/ and /api/v1/auth)', async () => {
    const res = await makeRequest('/auth/logout', {
      method: 'POST',
      headers: { Origin: CLIENT_ORIGIN },
    });

    const accessCookie = res.cookies.accessToken;
    const refreshCookie = res.cookies.refreshToken;

    assert.ok(accessCookie, 'Must clear accessToken');
    assert.ok(refreshCookie, 'Must clear refreshToken');
    assert.equal(accessCookie.path, '/');
    assert.equal(refreshCookie.path, '/api/v1/auth');
  });

  // 23. Customer denied admin access
  test('23. Customer is denied admin access (403 Forbidden)', async () => {
    // Log in customer to obtain fresh access token
    const loginRes = await makeRequest('/auth/login', {
      method: 'POST',
      headers: { Origin: CLIENT_ORIGIN },
      body: { email: testCustomerEmail, password: testCustomerPassword },
    });

    const token = loginRes.cookies.accessToken.value;

    const res = await makeRequest('/admin/test', {
      method: 'GET',
      headers: { Cookie: `accessToken=${token}` },
    });

    assert.equal(res.status, 403);
    assert.equal(res.data.success, false);
  });

  // 24. Admin permitted admin access
  test('24. Admin is permitted admin access (200 OK)', async () => {
    const adminEmail = `admin_${Date.now()}@decora-test.com`;
    registerTestEmail(adminEmail);
    const adminPassword = 'AdminSecretPass123';

    // Create admin directly in database
    const adminUser = new User({
      fullName: 'Super Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    await adminUser.save();

    // Log in admin
    const loginRes = await makeRequest('/auth/login', {
      method: 'POST',
      headers: { Origin: CLIENT_ORIGIN },
      body: { email: adminEmail, password: adminPassword },
    });

    const token = loginRes.cookies.accessToken.value;

    const res = await makeRequest('/admin/test', {
      method: 'GET',
      headers: { Cookie: `accessToken=${token}` },
    });

    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.equal(res.data.user.role, 'admin');
  });

  // 25. Invalid Origin rejected on protected state-changing requests
  test('25. Untrusted Origin is rejected with 403 on state-changing requests', async () => {
    const res = await makeRequest('/auth/refresh', {
      method: 'POST',
      headers: {
        Origin: 'http://malicious-hacker.com',
        Cookie: `refreshToken=some-token`,
      },
    });

    assert.equal(res.status, 403);
    assert.equal(res.data.success, false);
  });

  // 26. Concurrent refresh behavior
  test('26. Concurrent refresh: exactly one succeeds, second is rejected', async () => {
    // Register a fresh user
    const email = `concurrent_${Date.now()}@decora-test.com`;
    registerTestEmail(email);
    const reg = await makeRequest('/auth/register', {
      method: 'POST',
      headers: { Origin: CLIENT_ORIGIN },
      body: { fullName: 'Concurrent Tester', email, password: 'Password123' },
    });

    const refToken = reg.cookies.refreshToken.value;

    // Fire 2 concurrent refresh requests simultaneously with the same refresh token
    const [req1, req2] = await Promise.all([
      makeRequest('/auth/refresh', {
        method: 'POST',
        headers: { Origin: CLIENT_ORIGIN, Cookie: `refreshToken=${refToken}` },
      }),
      makeRequest('/auth/refresh', {
        method: 'POST',
        headers: { Origin: CLIENT_ORIGIN, Cookie: `refreshToken=${refToken}` },
      }),
    ]);

    const statuses = [req1.status, req2.status].sort();
    assert.deepEqual(statuses, [200, 401], 'Exactly one request must succeed (200) and one must be rejected (401)');
  });

  // 27. Health and Readiness probes remain functional
  test('27. Health and Readiness endpoints return HEALTHY and READY', async () => {
    const health = await makeRequest('/health');
    assert.equal(health.status, 200);
    assert.equal(health.data.data.status, 'HEALTHY');

    const ready = await makeRequest('/ready');
    assert.equal(ready.status, 200);
    assert.equal(ready.data.data.status, 'READY');
    assert.equal(ready.data.data.database.connected, true);
  });
});
