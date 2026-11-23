import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import User from '../src/models/User.js';
import DesignBoard from '../src/models/DesignBoard.js';
import Product from '../src/models/Product.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

const TEST_PORT = 5096;
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

describe('Décora Day 13 — Design Board & Room Layout API Test Suite (27 Scenarios)', () => {
  let createdBoardId = null;
  let customItemId = null;

  before(async () => {
    await connectDB();
    await new Promise((resolve) => {
      serverInstance = app.listen(TEST_PORT, () => resolve());
    });

    const stamp = Date.now();
    const uA = await registerAndLogin(`boards_userA_${stamp}@decora.test`, 'SecurePass123!', 'Board User A');
    userA = uA.user;
    userACookies = uA.cookieHeader;

    const uB = await registerAndLogin(`boards_userB_${stamp}@decora.test`, 'SecurePass123!', 'Board User B');
    userB = uB.user;
    userBCookies = uB.cookieHeader;
  });

  after(async () => {
    if (userA) {
      await User.deleteOne({ email: userA.email });
      await DesignBoard.deleteMany({ userId: userA.id });
    }
    if (userB) {
      await User.deleteOne({ email: userB.email });
      await DesignBoard.deleteMany({ userId: userB.id });
    }
    await new Promise((resolve) => serverInstance.close(resolve));
    await disconnectDB();
  });

  test('1. Unauthenticated request to GET /boards is rejected with 401', async () => {
    const res = await makeRequest('/boards');
    assert.equal(res.status, 401);
  });

  test('2. Authenticated user initially has 0 boards', async () => {
    const res = await makeRequest('/boards', {
      headers: { Cookie: userACookies },
    });
    assert.equal(res.status, 200);
    assert.deepEqual(res.data.data.boards, []);
  });

  test('3. Create design board succeeds with valid metadata', async () => {
    const res = await makeRequest('/boards', {
      method: 'POST',
      headers: { Cookie: userACookies },
      body: {
        title: 'Japandi Penthouse Living',
        description: 'Warm oak and cream bouclé sanctuary',
        roomType: 'Living Room',
        style: 'Japandi',
      },
    });
    assert.equal(res.status, 201);
    assert.equal(res.data.success, true);
    assert.equal(res.data.data.title, 'Japandi Penthouse Living');
    assert.equal(res.data.data.roomType, 'Living Room');
    assert.equal(res.data.data.totalEstimatedBudget, 0);
    createdBoardId = res.data.data.id;
    assert.ok(createdBoardId);
  });

  test('4. Create board rejects invalid title (< 2 chars)', async () => {
    const res = await makeRequest('/boards', {
      method: 'POST',
      headers: { Cookie: userACookies },
      body: { title: 'X' },
    });
    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
  });

  test('5. Retrieve single board by ID returns complete document', async () => {
    const res = await makeRequest(`/boards/${createdBoardId}`, {
      headers: { Cookie: userACookies },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.id, createdBoardId);
    assert.equal(res.data.data.title, 'Japandi Penthouse Living');
  });

  test('6. Retrieve non-existent board returns 404', async () => {
    const res = await makeRequest('/boards/673b0c2a4f8d2b001c9a9999', {
      headers: { Cookie: userACookies },
    });
    assert.equal(res.status, 404);
  });

  test('7. Update board metadata succeeds', async () => {
    const res = await makeRequest(`/boards/${createdBoardId}`, {
      method: 'PATCH',
      headers: { Cookie: userACookies },
      body: { title: 'Renamed Editorial Sanctuary', description: 'Updated serene retreat' },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.title, 'Renamed Editorial Sanctuary');
    assert.equal(res.data.data.description, 'Updated serene retreat');
  });

  test('8. Add non-customizable product snapshot (table-kanso) enforces base price ₹18,500', async () => {
    const res = await makeRequest(`/boards/${createdBoardId}/items`, {
      method: 'POST',
      headers: { Cookie: userACookies },
      body: {
        productId: 'table-kanso',
        quantity: 1,
        // Attempting to send client fabricated price
        unitPrice: 99999,
      },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.items.length, 1);
    const item = res.data.data.items[0];
    assert.equal(item.productId, 'table-kanso');
    assert.equal(item.unitPrice, 18500); // Server-enforced base price!
    assert.equal(item.isCustomized, false);
    assert.equal(res.data.data.totalEstimatedBudget, 18500);
  });

  test('9. Add non-customizable product with custom options is rejected (400)', async () => {
    const res = await makeRequest(`/boards/${createdBoardId}/items`, {
      method: 'POST',
      headers: { Cookie: userACookies },
      body: {
        productId: 'table-kanso',
        configuration: { fabricId: 'fab-boucle' },
      },
    });
    assert.equal(res.status, 400);
    assert.equal(res.data.code, 'PRODUCT_NOT_CUSTOMIZABLE');
  });

  test('10. Add customizable product (chair-komorebi) calculates authoritative price (₹33,700)', async () => {
    // Komorebi base 28,000 + fab-boucle (3,500) + fin-walnut (2,200) + size-std (0) = 33,700
    const res = await makeRequest(`/boards/${createdBoardId}/items`, {
      method: 'POST',
      headers: { Cookie: userACookies },
      body: {
        productId: 'chair-komorebi',
        quantity: 2,
        configuration: {
          fabricId: 'fab-boucle',
          finishId: 'fin-walnut',
          sizeId: 'size-std',
        },
        // Client fake price
        unitPrice: 100,
      },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.items.length, 2);
    const item = res.data.data.items.find((it) => it.productId === 'chair-komorebi');
    assert.ok(item);
    customItemId = item.boardItemId;
    assert.equal(item.unitPrice, 33700); // Server-verified price!
    assert.equal(item.quantity, 2);
    assert.equal(item.isCustomized, true);
    assert.equal(item.selectedOptions.fabric.id, 'fab-boucle');
    assert.equal(item.selectedOptions.finish.id, 'fin-walnut');
    // Total budget = 18,500 + (33,700 * 2) = 18,500 + 67,400 = 85,900
    assert.equal(res.data.data.totalEstimatedBudget, 85900);
  });

  test('11. Add customized item with invalid option ID is rejected with 400', async () => {
    const res = await makeRequest(`/boards/${createdBoardId}/items`, {
      method: 'POST',
      headers: { Cookie: userACookies },
      body: {
        productId: 'chair-komorebi',
        configuration: {
          fabricId: 'invalid-fabric-999',
          finishId: 'fin-walnut',
          sizeId: 'size-std',
        },
      },
    });
    assert.equal(res.status, 400);
    assert.equal(res.data.code, 'INVALID_CUSTOMIZATION_OPTION');
  });

  test('12. Add same product with different configuration creates independent item snapshot', async () => {
    // Komorebi with standard options: 28,000
    const res = await makeRequest(`/boards/${createdBoardId}/items`, {
      method: 'POST',
      headers: { Cookie: userACookies },
      body: {
        productId: 'chair-komorebi',
        quantity: 1,
        configuration: {
          fabricId: 'fab-linen',
          finishId: 'fin-beech',
          sizeId: 'size-std',
        },
      },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.items.length, 3);
    const komorebiItems = res.data.data.items.filter((it) => it.productId === 'chair-komorebi');
    assert.equal(komorebiItems.length, 2);
    assert.notEqual(komorebiItems[0].boardItemId, komorebiItems[1].boardItemId);
    assert.notEqual(komorebiItems[0].unitPrice, komorebiItems[1].unitPrice);
  });

  test('13. Update item quantity recalculates board budget', async () => {
    // Change custom item qty from 2 to 1
    const res = await makeRequest(`/boards/${createdBoardId}/items/${customItemId}`, {
      method: 'PATCH',
      headers: { Cookie: userACookies },
      body: { quantity: 1 },
    });
    assert.equal(res.status, 200);
    const item = res.data.data.items.find((it) => it.boardItemId === customItemId);
    assert.equal(item.quantity, 1);
    // Budget: 18,500 + 33,700 + 28,000 = 80,200
    assert.equal(res.data.data.totalEstimatedBudget, 80200);
  });

  test('14. Reject invalid quantity (0, negative, fractional) with 400', async () => {
    const resZero = await makeRequest(`/boards/${createdBoardId}/items/${customItemId}`, {
      method: 'PATCH',
      headers: { Cookie: userACookies },
      body: { quantity: 0 },
    });
    assert.equal(resZero.status, 400);

    const resNeg = await makeRequest(`/boards/${createdBoardId}/items/${customItemId}`, {
      method: 'PATCH',
      headers: { Cookie: userACookies },
      body: { quantity: -5 },
    });
    assert.equal(resNeg.status, 400);
  });

  test('15. Update item configuration recalculates price authoritatively', async () => {
    // Change to fab-leather (+8000) and fin-ash (+2500) and size-grand (+4000) = 28,000 + 14,500 = 42,500
    const res = await makeRequest(`/boards/${createdBoardId}/items/${customItemId}`, {
      method: 'PATCH',
      headers: { Cookie: userACookies },
      body: {
        configuration: {
          fabricId: 'fab-leather',
          finishId: 'fin-ash',
          sizeId: 'size-grand',
        },
      },
    });
    assert.equal(res.status, 200);
    const item = res.data.data.items.find((it) => it.boardItemId === customItemId);
    assert.equal(item.unitPrice, 42500);
  });

  test('16. Remove item from board succeeds and updates budget', async () => {
    const res = await makeRequest(`/boards/${createdBoardId}/items/${customItemId}`, {
      method: 'DELETE',
      headers: { Cookie: userACookies },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.items.length, 2);
    const found = res.data.data.items.find((it) => it.boardItemId === customItemId);
    assert.equal(found, undefined);
  });

  test('17. Save 2D room layout (PUT /boards/:id/layout) persists layout', async () => {
    const layoutPayload = {
      roomLength: 6.0,
      roomWidth: 4.5,
      units: 'm',
      furnitureInstances: [
        {
          instanceId: 'inst-test-sofa',
          productId: 'sofa-sylvan',
          name: 'Sylvan 3-Seater Minimalist Sofa',
          category: 'Seating',
          price: 45000,
          x: 120,
          y: 80,
          rotation: 90,
          w: 220,
          d: 90,
          glyphType: 'sofa',
          configuration: { fabricId: 'fab-linen-raw', finishId: 'fin-oak', sizeId: 'size-3seater' },
        },
      ],
    };

    const res = await makeRequest(`/boards/${createdBoardId}/layout`, {
      method: 'PUT',
      headers: { Cookie: userACookies },
      body: layoutPayload,
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.hasRoomLayout, true);
    assert.equal(res.data.data.roomLayout.roomLength, 6.0);
    assert.equal(res.data.data.roomLayout.roomWidth, 4.5);
    assert.equal(res.data.data.roomLayout.furnitureInstances.length, 1);
    assert.equal(res.data.data.roomLayout.furnitureInstances[0].instanceId, 'inst-test-sofa');
  });

  test('18. Save room layout rejects invalid room dimensions (< 1.0m)', async () => {
    const res = await makeRequest(`/boards/${createdBoardId}/layout`, {
      method: 'PUT',
      headers: { Cookie: userACookies },
      body: { roomLength: 0.5, roomWidth: 4.0 },
    });
    assert.equal(res.status, 400);
  });

  test('19. Duplicate board creates deep copy with fresh boardItemIds and copies layout', async () => {
    const res = await makeRequest(`/boards/${createdBoardId}/duplicate`, {
      method: 'POST',
      headers: { Cookie: userACookies },
    });
    assert.equal(res.status, 201);
    const copy = res.data.data;
    assert.notEqual(copy.id, createdBoardId);
    assert.ok(copy.title.includes('(Copy)'));
    assert.equal(copy.items.length, 2);
    assert.ok(copy.hasRoomLayout);
    assert.equal(copy.roomLayout.furnitureInstances.length, 1);
    assert.notEqual(copy.roomLayout.furnitureInstances[0].instanceId, 'inst-test-sofa');
  });

  test('20. Cross-user isolation: User B is forbidden from reading/mutating User A board', async () => {
    // User B tries to read User A board
    const readRes = await makeRequest(`/boards/${createdBoardId}`, {
      headers: { Cookie: userBCookies },
    });
    assert.equal(readRes.status, 403);

    // User B tries to update User A board metadata
    const updateRes = await makeRequest(`/boards/${createdBoardId}`, {
      method: 'PATCH',
      headers: { Cookie: userBCookies },
      body: { title: 'Malicious Hijack Attempt' },
    });
    assert.equal(updateRes.status, 403);

    // User B tries to add item to User A board
    const addRes = await makeRequest(`/boards/${createdBoardId}/items`, {
      method: 'POST',
      headers: { Cookie: userBCookies },
      body: { productId: 'table-kanso' },
    });
    assert.equal(addRes.status, 403);

    // User B tries to update an item on User A board
    const updateItemRes = await makeRequest(`/boards/${createdBoardId}/items/${customItemId}`, {
      method: 'PATCH',
      headers: { Cookie: userBCookies },
      body: { quantity: 99 },
    });
    assert.equal(updateItemRes.status, 403);

    // User B tries to delete an item on User A board
    const delItemRes = await makeRequest(`/boards/${createdBoardId}/items/${customItemId}`, {
      method: 'DELETE',
      headers: { Cookie: userBCookies },
    });
    assert.equal(delItemRes.status, 403);

    // User B tries to overwrite room layout on User A board
    const layoutRes = await makeRequest(`/boards/${createdBoardId}/layout`, {
      method: 'PUT',
      headers: { Cookie: userBCookies },
      body: { roomLength: 4.0, roomWidth: 3.5, furnitureInstances: [] },
    });
    assert.equal(layoutRes.status, 403);

    // User B tries to duplicate User A board
    const dupRes = await makeRequest(`/boards/${createdBoardId}/duplicate`, {
      method: 'POST',
      headers: { Cookie: userBCookies },
    });
    assert.equal(dupRes.status, 403);

    // User B tries to delete User A board
    const delRes = await makeRequest(`/boards/${createdBoardId}`, {
      method: 'DELETE',
      headers: { Cookie: userBCookies },
    });
    assert.equal(delRes.status, 403);
  });

  test('21. Client-submitted userId in POST/PATCH is ignored and cannot reassign ownership', async () => {
    // Attempt privilege escalation by passing another user's ID
    const res = await makeRequest('/boards', {
      method: 'POST',
      headers: { Cookie: userBCookies },
      body: {
        title: 'User B Controlled Board',
        userId: userA.id, // Malicious override attempt
      },
    });
    assert.equal(res.status, 201);
    assert.equal(res.data.data.userId, userB.id); // Must remain userB
    const bId = res.data.data.id;

    // Attempt PATCH with foreign userId
    const patchRes = await makeRequest(`/boards/${bId}`, {
      method: 'PATCH',
      headers: { Cookie: userBCookies },
      body: {
        title: 'User B Board Updated',
        userId: userA.id, // Malicious override attempt
      },
    });
    assert.equal(patchRes.status, 200);
    assert.equal(patchRes.data.data.userId, userB.id);

    // Clean up
    await makeRequest(`/boards/${bId}`, {
      method: 'DELETE',
      headers: { Cookie: userBCookies },
    });
  });

  test('22. Multiple distinct configurations of same product coexist on board with locked snapshots', async () => {
    // Add Configuration 1: Komorebi in Boucle + Oak + size-std (28,000 + 3,500 + 2,000 = 33,500)
    const res1 = await makeRequest(`/boards/${createdBoardId}/items`, {
      method: 'POST',
      headers: { Cookie: userACookies },
      body: {
        productId: 'chair-komorebi',
        quantity: 1,
        configuration: { fabricId: 'fab-boucle', finishId: 'fin-oak', sizeId: 'size-std' },
      },
    });
    assert.equal(res1.status, 200);

    // Add Configuration 2: Komorebi in Leather + Walnut + size-grand (28,000 + 8,000 + 2,200 + 4,000 = 42,200)
    const res2 = await makeRequest(`/boards/${createdBoardId}/items`, {
      method: 'POST',
      headers: { Cookie: userACookies },
      body: {
        productId: 'chair-komorebi',
        quantity: 1,
        configuration: { fabricId: 'fab-leather', finishId: 'fin-walnut', sizeId: 'size-grand' },
      },
    });
    assert.equal(res2.status, 200);

    const items = res2.data.data.items.filter((it) => it.productId === 'chair-komorebi');
    assert.ok(items.length >= 2);

    const item1 = items.find((it) => it.configuration.fabricId === 'fab-boucle');
    const item2 = items.find((it) => it.configuration.fabricId === 'fab-leather');
    assert.ok(item1 && item2);
    assert.notEqual(item1.boardItemId, item2.boardItemId);
    assert.equal(item1.unitPrice, 33500);
    assert.equal(item2.unitPrice, 42200);

    // Update quantity on item1 only: unitPrice and config remain unchanged
    const qtyRes = await makeRequest(`/boards/${createdBoardId}/items/${item1.boardItemId}/quantity`, {
      method: 'PATCH',
      headers: { Cookie: userACookies },
      body: { quantity: 3 },
    });
    assert.equal(qtyRes.status, 200);
    const updatedItem1 = qtyRes.data.data.items.find((it) => it.boardItemId === item1.boardItemId);
    assert.equal(updatedItem1.quantity, 3);
    assert.equal(updatedItem1.unitPrice, 33500);
    assert.equal(updatedItem1.configuration.fabricId, 'fab-boucle');
  });

  test('23. Catalog price drift immunity: modifying catalog price does not alter existing board snapshots', async () => {
    // Fetch current board and find chair-komorebi item
    const boardRes = await makeRequest(`/boards/${createdBoardId}`, {
      headers: { Cookie: userACookies },
    });
    const snapshotItem = boardRes.data.data.items.find((it) => it.productId === 'chair-komorebi');
    assert.ok(snapshotItem);
    const originalSnapshotPrice = snapshotItem.unitPrice;

    // Simulate catalog price modification directly in MongoDB
    await Product.updateOne({ productId: 'chair-komorebi' }, { $set: { basePrice: 99999 } });

    // Re-fetch board via API
    const reloadedBoardRes = await makeRequest(`/boards/${createdBoardId}`, {
      headers: { Cookie: userACookies },
    });
    const reloadedItem = reloadedBoardRes.data.data.items.find((it) => it.boardItemId === snapshotItem.boardItemId);

    // Snapshot price MUST remain strictly locked to original snapshot
    assert.equal(reloadedItem.unitPrice, originalSnapshotPrice);

    // Restore catalog price
    await Product.updateOne({ productId: 'chair-komorebi' }, { $set: { basePrice: 28000 } });
  });

  test('24. Room Planner complete lifecycle: save layout with 2 placed instances, reload, verify exact restoration', async () => {
    const layoutPayload = {
      roomLength: 6.2,
      roomWidth: 4.8,
      units: 'm',
      furnitureInstances: [
        {
          instanceId: 'inst-sofa-001',
          boardItemId: customItemId,
          productId: 'sofa-sylvan',
          name: 'Sylvan Minimalist Sofa',
          x: 120.5,
          y: 85.0,
          rotation: 90,
          w: 220,
          d: 90,
          glyphType: 'sofa',
          price: 51500,
          configuration: { fabricId: 'fab-boucle-warm', finishId: 'fin-oak', sizeId: 'size-3seater' },
          activeFabric: { id: 'fab-boucle-warm', name: 'Oatmeal Bouclé', colorHex: '#F0ECE1' },
          activeFinish: { id: 'fin-oak', name: 'Natural White Oak', colorHex: '#D8C8B5' },
        },
        {
          instanceId: 'inst-table-002',
          productId: 'table-kanso',
          name: 'Kanso Coffee Table',
          x: 200.0,
          y: 150.0,
          rotation: 0,
          w: 110,
          d: 60,
          glyphType: 'coffee-table',
          price: 18500,
        },
      ],
    };

    // Save layout
    const saveRes = await makeRequest(`/boards/${createdBoardId}/layout`, {
      method: 'PUT',
      headers: { Cookie: userACookies },
      body: layoutPayload,
    });
    assert.equal(saveRes.status, 200);

    // Re-fetch board to verify exact persistence and roundtrip restoration
    const reloadRes = await makeRequest(`/boards/${createdBoardId}`, {
      headers: { Cookie: userACookies },
    });
    assert.equal(reloadRes.status, 200);
    const layout = reloadRes.data.data.roomLayout;
    assert.ok(layout);
    assert.equal(layout.roomLength, 6.2);
    assert.equal(layout.roomWidth, 4.8);
    assert.equal(layout.units, 'm');
    assert.equal(layout.furnitureInstances.length, 2);

    const sofaInst = layout.furnitureInstances.find((i) => i.instanceId === 'inst-sofa-001');
    assert.ok(sofaInst);
    assert.equal(sofaInst.productId, 'sofa-sylvan');
    assert.equal(sofaInst.x, 120.5);
    assert.equal(sofaInst.y, 85.0);
    assert.equal(sofaInst.rotation, 90);
    assert.equal(sofaInst.w, 220);
    assert.equal(sofaInst.d, 90);
    assert.equal(sofaInst.glyphType, 'sofa');
    assert.equal(sofaInst.configuration?.fabricId, 'fab-boucle-warm');
    assert.equal(sofaInst.activeFabric?.id, 'fab-boucle-warm');

    const tableInst = layout.furnitureInstances.find((i) => i.instanceId === 'inst-table-002');
    assert.ok(tableInst);
    assert.equal(tableInst.productId, 'table-kanso');
    assert.equal(tableInst.x, 200.0);
    assert.equal(tableInst.rotation, 0);
  });

  test('25. Room Planner rejects invalid non-finite coordinates, negative dimensions, or oversized rooms', async () => {
    // Oversized room (> 20m)
    const overRes = await makeRequest(`/boards/${createdBoardId}/layout`, {
      method: 'PUT',
      headers: { Cookie: userACookies },
      body: { roomLength: 25.0, roomWidth: 5.0 },
    });
    assert.equal(overRes.status, 400);

    // NaN / non-finite coordinates
    const nanRes = await makeRequest(`/boards/${createdBoardId}/layout`, {
      method: 'PUT',
      headers: { Cookie: userACookies },
      body: {
        roomLength: 5.0,
        roomWidth: 4.0,
        furnitureInstances: [
          {
            instanceId: 'inst-bad',
            productId: 'table-kanso',
            x: 'not-a-number',
            y: 50,
            w: 100,
            d: 50,
            rotation: 0,
            glyphType: 'coffee-table',
          },
        ],
      },
    });
    assert.equal(nanRes.status, 400);
  });

  test('26. Bulk sync guest boards imports guest boards under user account with authoritative pricing', async () => {
    const guestBoards = [
      {
        title: 'Migrated Guest Living Suite',
        roomType: 'Living Room',
        style: 'Warm Editorial',
        items: [
          {
            productId: 'chair-komorebi',
            quantity: 1,
            configuration: { fabricId: 'fab-boucle', finishId: 'fin-oak', sizeId: 'size-std' },
          },
        ],
      },
    ];

    const res = await makeRequest('/boards/sync', {
      method: 'POST',
      headers: { Cookie: userBCookies },
      body: { boards: guestBoards },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.boards.length, 1);
    const b = res.data.data.boards[0];
    assert.equal(b.title, 'Migrated Guest Living Suite');
    assert.equal(b.items.length, 1);
    // Komorebi: base 28,000 + boucle (3,500) + oak (2,000) = 33,500
    assert.equal(b.items[0].unitPrice, 33500);
  });

  test('27. Delete board succeeds for owner', async () => {
    const res = await makeRequest(`/boards/${createdBoardId}`, {
      method: 'DELETE',
      headers: { Cookie: userACookies },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.data.deleted, true);

    // Verify it is gone
    const verifyRes = await makeRequest(`/boards/${createdBoardId}`, {
      headers: { Cookie: userACookies },
    });
    assert.equal(verifyRes.status, 404);
  });
});
