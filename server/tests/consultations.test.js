import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Consultation from '../src/models/Consultation.js';
import Product from '../src/models/Product.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

const TEST_PORT = 5098;
const BASE_URL = `http://localhost:${TEST_PORT}/api/v1`;

let serverInstance;
let customerUser = null;
let customerCookies = '';
let adminUser = null;
let adminCookies = '';

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

async function registerAndLogin(email, password, fullName, role = 'customer') {
  const regRes = await makeRequest('/auth/register', {
    method: 'POST',
    body: { email, password, fullName },
  });

  let user = regRes.data?.data?.user;
  if (role === 'admin' && user) {
    // Elevate role directly in test DB
    await User.updateOne({ _id: user.id }, { $set: { role: 'admin' } });
    user.role = 'admin';
  }

  // Re-login to get updated role in token
  const loginRes = await makeRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  const rawCookies = loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : [];
  const cookieHeader = rawCookies.map((c) => c.split(';')[0]).join('; ');

  return {
    user: loginRes.data?.data?.user,
    cookieHeader,
  };
}

describe('Décora Day 13 — Consultations & Admin Management Test Suite (14 Scenarios)', () => {
  let createdConsultationId = null;

  before(async () => {
    await connectDB();
    await new Promise((resolve) => {
      serverInstance = app.listen(TEST_PORT, () => resolve());
    });

    const stamp = Date.now();
    const cust = await registerAndLogin(`consult_cust_${stamp}@decora.test`, 'SecurePass123!', 'Consult Customer');
    customerUser = cust.user;
    customerCookies = cust.cookieHeader;

    const adm = await registerAndLogin(`consult_admin_${stamp}@decora.test`, 'AdminPass123!', 'Platform Admin', 'admin');
    adminUser = adm.user;
    adminCookies = adm.cookieHeader;
  });

  after(async () => {
    if (customerUser) {
      await User.deleteOne({ email: customerUser.email });
      await Consultation.deleteMany({ userId: customerUser.id });
    }
    if (adminUser) {
      await User.deleteOne({ email: adminUser.email });
    }
    if (createdConsultationId) {
      await Consultation.deleteOne({ _id: createdConsultationId });
    }
    await new Promise((resolve) => serverInstance.close(resolve));
    await disconnectDB();
  });

  test('1. Guest consultation submission succeeds with generated referenceCode', async () => {
    const res = await makeRequest('/consultations', {
      method: 'POST',
      body: {
        fullName: 'Aarav Mehta',
        email: 'aarav.mehta@example.com',
        phone: '+91 98765 43210',
        roomType: 'Living Room',
        preferredStyle: 'Japandi',
        budgetRange: '₹1,50,000 - ₹3,00,000',
        message: 'Looking for a serene Japandi living room layout with low seating.',
      },
    });
    assert.equal(res.status, 201);
    assert.equal(res.data.success, true);
    assert.ok(res.data.data.referenceCode.startsWith('DEC-'));
    assert.equal(res.data.data.status, 'New');
    assert.equal(res.data.data.userId, null);
    createdConsultationId = res.data.data.id;
  });

  test('2. Rejection of invalid email on consultation submission (400)', async () => {
    const res = await makeRequest('/consultations', {
      method: 'POST',
      body: {
        fullName: 'Jane Doe',
        email: 'not-an-email',
      },
    });
    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
  });

  test('3. Authenticated customer submission attaches userId', async () => {
    const res = await makeRequest('/consultations', {
      method: 'POST',
      headers: { Cookie: customerCookies },
      body: {
        fullName: 'Consult Customer',
        email: customerUser.email,
        roomType: 'Bedroom',
        preferredStyle: 'Warm Editorial',
      },
    });
    assert.equal(res.status, 201);
    assert.equal(res.data.data.userId, customerUser.id);
  });

  test('4. Customer retrieves own consultations via /consultations/my-consultations', async () => {
    const res = await makeRequest('/consultations/my-consultations', {
      headers: { Cookie: customerCookies },
    });
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.data.data.consultations));
    assert.equal(res.data.data.consultations.length, 1);
    assert.equal(res.data.data.consultations[0].userId, customerUser.id);
  });

  test('5. Customer is forbidden from accessing Admin Dashboard (403)', async () => {
    const res = await makeRequest('/admin/dashboard', {
      headers: { Cookie: customerCookies },
    });
    assert.equal(res.status, 403);
  });

  test('6. Admin accesses /admin/dashboard and receives platform metrics', async () => {
    const res = await makeRequest('/admin/dashboard', {
      headers: { Cookie: adminCookies },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.ok(typeof res.data.data.totalProducts === 'number');
    assert.ok(typeof res.data.data.pendingConsultations === 'number');
    assert.ok(typeof res.data.data.registeredUsers === 'number');
    assert.ok(typeof res.data.data.activeDesignBoards === 'number');
  });

  test('7. Admin lists consultations with status filter', async () => {
    const res = await makeRequest('/admin/consultations?status=New', {
      headers: { Cookie: adminCookies },
    });
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.data.data.consultations));
    assert.ok(res.data.data.consultations.length >= 1);
    assert.ok(res.data.data.consultations.every((c) => c.status === 'New'));
  });

  test('8. Admin updates consultation status pipeline (New -> Contacted)', async () => {
    const res = await makeRequest(`/admin/consultations/${createdConsultationId}/status`, {
      method: 'PATCH',
      headers: { Cookie: adminCookies },
      body: {
        status: 'Contacted',
        adminNotes: 'Spoke with client on phone; scheduled design call for Thursday.',
      },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.status, 'Contacted');
    assert.equal(res.data.data.adminNotes, 'Spoke with client on phone; scheduled design call for Thursday.');
  });

  test('9. Admin updates consultation status pipeline to Completed', async () => {
    const res = await makeRequest(`/admin/consultations/${createdConsultationId}/status`, {
      method: 'PATCH',
      headers: { Cookie: adminCookies },
      body: { status: 'Completed' },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.status, 'Completed');
  });

  test('10. Admin can update product stock/featured status', async () => {
    const res = await makeRequest('/admin/products/table-asahi', {
      method: 'PATCH',
      headers: { Cookie: adminCookies },
      body: { inStock: true, stockCount: 15 },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.inStock, true);
    assert.equal(res.data.data.stockCount, 15);

    // Restore original inStock: false for table-asahi
    await makeRequest('/admin/products/table-asahi', {
      method: 'PATCH',
      headers: { Cookie: adminCookies },
      body: { inStock: false, stockCount: 0 },
    });
  });

  test('11. Customer is forbidden from querying admin consultation list (403)', async () => {
    const res = await makeRequest('/admin/consultations', {
      headers: { Cookie: customerCookies },
    });
    assert.equal(res.status, 403);
    assert.equal(res.data.success, false);
  });

  test('12. Customer is forbidden from updating consultation status (403)', async () => {
    const res = await makeRequest(`/admin/consultations/${createdConsultationId}/status`, {
      method: 'PATCH',
      headers: { Cookie: customerCookies },
      body: { status: 'Completed' },
    });
    assert.equal(res.status, 403);
    assert.equal(res.data.success, false);
  });

  test('13. Customer is forbidden from overriding product catalog stock/price (403)', async () => {
    const res = await makeRequest('/admin/products/table-asahi', {
      method: 'PATCH',
      headers: { Cookie: customerCookies },
      body: { inStock: true, stockCount: 99 },
    });
    assert.equal(res.status, 403);
    assert.equal(res.data.success, false);
  });

  test('14. Unauthenticated caller is rejected from admin endpoints (401)', async () => {
    const res = await makeRequest('/admin/dashboard');
    assert.equal(res.status, 401);
    assert.equal(res.data.success, false);
  });
});
