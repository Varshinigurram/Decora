import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Wishlist from '../src/models/Wishlist.js';
import Product from '../src/models/Product.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

const TEST_PORT = 5094;
const BASE_URL = `http://localhost:${TEST_PORT}/api/v1`;

let serverInstance;
let userA = null;
let userACookies = '';
let userB = null;
let userBCookies = '';

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

  return {
    status: response.status,
    headers: response.headers,
    data: json,
  };
}

async function registerAndLogin(email, password, fullName) {
  const regRes = await makeRequest('/auth/register', {
    method: 'POST',
    body: { email, password, fullName },
  });

  const rawCookies = regRes.headers.getSetCookie ? regRes.headers.getSetCookie() : [];
  const cookieHeader = rawCookies.map((c) => c.split(';')[0]).join('; ');

  return {
    user: regRes.data?.data?.user,
    cookieHeader,
  };
}

describe('Décora Day 13 — Wishlist API & Sync Test Suite', () => {
  before(async () => {
    await connectDB();
    await new Promise((resolve) => {
      serverInstance = app.listen(TEST_PORT, () => resolve());
    });

    const stamp = Date.now();
    const uA = await registerAndLogin(`wishlist_userA_${stamp}@decora.test`, 'SecurePass123!', 'User A');
    userA = uA.user;
    userACookies = uA.cookieHeader;

    const uB = await registerAndLogin(`wishlist_userB_${stamp}@decora.test`, 'SecurePass123!', 'User B');
    userB = uB.user;
    userBCookies = uB.cookieHeader;
  });

  after(async () => {
    if (userA) {
      await User.deleteOne({ email: userA.email });
      await Wishlist.deleteOne({ userId: userA.id });
    }
    if (userB) {
      await User.deleteOne({ email: userB.email });
      await Wishlist.deleteOne({ userId: userB.id });
    }
    await new Promise((resolve) => serverInstance.close(resolve));
    await disconnectDB();
  });

  test('1. Unauthenticated request to GET /wishlist is rejected with 401', async () => {
    const res = await makeRequest('/wishlist');
    assert.equal(res.status, 401);
    assert.equal(res.data.success, false);
  });

  test('2. Authenticated user initially receives empty wishlist', async () => {
    const res = await makeRequest('/wishlist', {
      headers: { Cookie: userACookies },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.equal(res.data.data.total, 0);
    assert.deepEqual(res.data.data.productIds, []);
  });

  test('3. Add valid product to wishlist succeeds', async () => {
    const res = await makeRequest('/wishlist/items', {
      method: 'POST',
      headers: { Cookie: userACookies },
      body: { productId: 'chair-komorebi' },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.equal(res.data.data.inWishlist, true);
    assert.equal(res.data.data.wishlistCount, 1);
  });

  test('4. Add duplicate product prevents duplicates (idempotent)', async () => {
    const res = await makeRequest('/wishlist/items', {
      method: 'POST',
      headers: { Cookie: userACookies },
      body: { productId: 'chair-komorebi' },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.wishlistCount, 1);
  });

  test('5. Add nonexistent product is rejected with 404 PRODUCT_NOT_FOUND', async () => {
    const res = await makeRequest('/wishlist/items', {
      method: 'POST',
      headers: { Cookie: userACookies },
      body: { productId: 'nonexistent-couch-999' },
    });
    assert.equal(res.status, 404);
    assert.equal(res.data.success, false);
    assert.equal(res.data.code, 'PRODUCT_NOT_FOUND');
  });

  test('6. Toggle product removes item when currently present', async () => {
    const res = await makeRequest('/wishlist/toggle', {
      method: 'POST',
      headers: { Cookie: userACookies },
      body: { productId: 'chair-komorebi' },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.inWishlist, false);
    assert.equal(res.data.data.wishlistCount, 0);
  });

  test('7. Toggle product adds item when not present', async () => {
    const res = await makeRequest('/wishlist/toggle', {
      method: 'POST',
      headers: { Cookie: userACookies },
      body: { productId: 'sofa-sylvan' },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.inWishlist, true);
    assert.equal(res.data.data.wishlistCount, 1);
  });

  test('8. Remove product by DELETE /wishlist/items/:productId', async () => {
    const res = await makeRequest('/wishlist/items/sofa-sylvan', {
      method: 'DELETE',
      headers: { Cookie: userACookies },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.inWishlist, false);
    assert.equal(res.data.data.wishlistCount, 0);
  });

  test('9. Cross-user isolation: User B cannot see User A wishlist data', async () => {
    // Add item to User A
    await makeRequest('/wishlist/items', {
      method: 'POST',
      headers: { Cookie: userACookies },
      body: { productId: 'table-kanso' },
    });

    // Read User B wishlist
    const resB = await makeRequest('/wishlist', {
      headers: { Cookie: userBCookies },
    });
    assert.equal(resB.status, 200);
    assert.equal(resB.data.data.total, 0);
    assert.deepEqual(resB.data.data.productIds, []);
  });

  test('10. Bulk sync (guest migration) adds valid products and ignores invalid ones', async () => {
    const res = await makeRequest('/wishlist/sync', {
      method: 'POST',
      headers: { Cookie: userBCookies },
      body: {
        productIds: ['chair-komorebi', 'sofa-sylvan', 'bogus-product-id'],
      },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.equal(res.data.data.total, 2);
    assert.ok(res.data.data.productIds.includes('chair-komorebi'));
    assert.ok(res.data.data.productIds.includes('sofa-sylvan'));
    assert.ok(!res.data.data.productIds.includes('bogus-product-id'));
  });

  test('11. Clear wishlist empties all entries', async () => {
    const res = await makeRequest('/wishlist', {
      method: 'DELETE',
      headers: { Cookie: userBCookies },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.wishlistCount, 0);
    assert.deepEqual(res.data.data.productIds, []);
  });
});
