import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import app from '../src/app.js';
import Product from '../src/models/Product.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

const TEST_PORT = 5092;
const BASE_URL = `http://localhost:${TEST_PORT}/api/v1`;

let serverInstance;

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

describe('Décora Stage 4 Step 2 — Product Catalog & Pricing Test Suite (31 Scenarios)', () => {
  let sampleProduct = null;
  let sampleCustomizableProduct = null;
  let sampleNonCustomizableProduct = null;

  before(async () => {
    await connectDB();
    await new Promise((resolve) => {
      serverInstance = app.listen(TEST_PORT, () => resolve());
    });

    // Ensure database contains authoritative products
    sampleCustomizableProduct = await Product.findOne({ customizable: true });
    sampleNonCustomizableProduct = await Product.findOne({ customizable: false });
    sampleProduct = sampleCustomizableProduct;
  });

  after(async () => {
    await new Promise((resolve) => serverInstance.close(resolve));
    await disconnectDB();
  });

  // 1. Standard Response Envelope
  test('1. GET /api/v1/products returns 200 with standard response envelope', async () => {
    const res = await makeRequest('/products');
    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.ok(Array.isArray(res.data.data), 'data should be an array of products');
    assert.ok(res.data.pagination, 'response should include pagination metadata');
    assert.equal(typeof res.data.pagination.page, 'number');
    assert.equal(typeof res.data.pagination.limit, 'number');
    assert.equal(typeof res.data.pagination.total, 'number');
    assert.equal(typeof res.data.pagination.pages, 'number');
  });

  // 2. Default Pagination
  test('2. Default pagination returns page 1, default limit 12, total 16, pages 2', async () => {
    const res = await makeRequest('/products');
    assert.equal(res.status, 200);
    assert.equal(res.data.pagination.page, 1);
    assert.equal(res.data.pagination.limit, 12);
    assert.equal(res.data.pagination.total, 16);
    assert.equal(res.data.pagination.pages, 2);
    assert.equal(res.data.data.length, 12);
  });

  // 3. Custom Pagination Parameters
  test('3. Pagination params ?page=2&limit=5 returns 5 items, page=2, pages=4, total=16', async () => {
    const res = await makeRequest('/products?page=2&limit=5');
    assert.equal(res.status, 200);
    assert.equal(res.data.pagination.page, 2);
    assert.equal(res.data.pagination.limit, 5);
    assert.equal(res.data.pagination.total, 16);
    assert.equal(res.data.pagination.pages, 4);
    assert.equal(res.data.data.length, 5);
  });

  // 4. Category Filter
  test('4. Filter ?category=Seating returns only Seating products', async () => {
    const res = await makeRequest('/products?category=Seating');
    assert.equal(res.status, 200);
    assert.ok(res.data.data.length > 0);
    for (const prod of res.data.data) {
      assert.equal(prod.category, 'Seating');
    }
  });

  // 5. Room Type Filter
  test('5. Filter ?roomType=living returns only living room products', async () => {
    const res = await makeRequest('/products?roomType=living');
    assert.equal(res.status, 200);
    assert.ok(res.data.data.length > 0);
    for (const prod of res.data.data) {
      assert.equal(prod.roomType, 'living');
    }
  });

  // 6. Style Filter
  test('6. Filter ?style=Japandi returns only Japandi products', async () => {
    const res = await makeRequest('/products?style=Japandi');
    assert.equal(res.status, 200);
    assert.ok(res.data.data.length > 0);
    for (const prod of res.data.data) {
      assert.equal(prod.style, 'Japandi');
    }
  });

  // 7. Customizable Filter: true
  test('7. Filter ?customizable=true returns only customizable products (exactly 8)', async () => {
    const res = await makeRequest('/products?customizable=true&limit=24');
    assert.equal(res.status, 200);
    assert.equal(res.data.pagination.total, 8);
    assert.equal(res.data.data.length, 8);
    for (const prod of res.data.data) {
      assert.equal(prod.customizable, true);
    }
  });

  // 8. Customizable Filter: false
  test('8. Filter ?customizable=false returns only non-customizable products (exactly 8)', async () => {
    const res = await makeRequest('/products?customizable=false&limit=24');
    assert.equal(res.status, 200);
    assert.equal(res.data.pagination.total, 8);
    assert.equal(res.data.data.length, 8);
    for (const prod of res.data.data) {
      assert.equal(prod.customizable, false);
    }
  });

  // 9. Featured Filter
  test('9. Filter ?featured=true returns only featured products', async () => {
    const res = await makeRequest('/products?featured=true');
    assert.equal(res.status, 200);
    assert.ok(res.data.data.length > 0);
    for (const prod of res.data.data) {
      assert.equal(prod.featured, true);
    }
  });

  // 10. InStock Filter
  test('10. Filter ?inStock=true returns only in-stock products', async () => {
    const res = await makeRequest('/products?inStock=true');
    assert.equal(res.status, 200);
    assert.ok(res.data.data.length > 0);
    for (const prod of res.data.data) {
      assert.equal(prod.inStock, true);
    }
  });

  // 11. Combined Filters
  test('11. Combined filters ?category=Seating&customizable=true returns products matching both', async () => {
    const res = await makeRequest('/products?category=Seating&customizable=true');
    assert.equal(res.status, 200);
    assert.ok(res.data.data.length > 0);
    for (const prod of res.data.data) {
      assert.equal(prod.category, 'Seating');
      assert.equal(prod.customizable, true);
    }
  });

  // 12. Min Price Filter
  test('12. Price filter ?minPrice=20000 returns only products with basePrice >= 20000', async () => {
    const res = await makeRequest('/products?minPrice=20000&limit=24');
    assert.equal(res.status, 200);
    assert.ok(res.data.data.length > 0);
    for (const prod of res.data.data) {
      assert.ok(prod.basePrice >= 20000, `Expected basePrice >= 20000, got ${prod.basePrice}`);
    }
  });

  // 13. Max Price Filter
  test('13. Price filter ?maxPrice=40000 returns only products with basePrice <= 40000', async () => {
    const res = await makeRequest('/products?maxPrice=40000&limit=24');
    assert.equal(res.status, 200);
    assert.ok(res.data.data.length > 0);
    for (const prod of res.data.data) {
      assert.ok(prod.basePrice <= 40000, `Expected basePrice <= 40000, got ${prod.basePrice}`);
    }
  });

  // 14. Price Range Filter
  test('14. Price range ?minPrice=20000&maxPrice=50000 returns products within range', async () => {
    const res = await makeRequest('/products?minPrice=20000&maxPrice=50000&limit=24');
    assert.equal(res.status, 200);
    assert.ok(res.data.data.length > 0);
    for (const prod of res.data.data) {
      assert.ok(prod.basePrice >= 20000 && prod.basePrice <= 50000);
    }
  });

  // 15. Search Query
  test('15. Search ?search=sofa returns matching products', async () => {
    const res = await makeRequest('/products?search=sofa');
    assert.equal(res.status, 200);
    assert.ok(res.data.data.length > 0);
    const hasSofa = res.data.data.some(
      (p) => p.name.toLowerCase().includes('sofa') || p.description.toLowerCase().includes('sofa')
    );
    assert.ok(hasSofa, 'Search results should contain products matching sofa');
  });

  // 16. Sort by Price Ascending
  test('16. Sort ?sort=price-asc returns products ordered by basePrice ascending', async () => {
    const res = await makeRequest('/products?sort=price-asc&limit=16');
    assert.equal(res.status, 200);
    const prices = res.data.data.map((p) => p.basePrice);
    for (let i = 1; i < prices.length; i++) {
      assert.ok(prices[i] >= prices[i - 1], `Price ${prices[i]} should be >= ${prices[i - 1]}`);
    }
  });

  // 17. Sort by Price Descending
  test('17. Sort ?sort=price-desc returns products ordered by basePrice descending', async () => {
    const res = await makeRequest('/products?sort=price-desc&limit=16');
    assert.equal(res.status, 200);
    const prices = res.data.data.map((p) => p.basePrice);
    for (let i = 1; i < prices.length; i++) {
      assert.ok(prices[i] <= prices[i - 1], `Price ${prices[i]} should be <= ${prices[i - 1]}`);
    }
  });

  // 18. Sort by Name Ascending
  test('18. Sort ?sort=name-asc returns products ordered by name ascending', async () => {
    const res = await makeRequest('/products?sort=name-asc&limit=16');
    assert.equal(res.status, 200);
    const names = res.data.data.map((p) => p.name);
    for (let i = 1; i < names.length; i++) {
      assert.ok(names[i].localeCompare(names[i - 1]) >= 0, `Name "${names[i]}" should be >= "${names[i - 1]}"`);
    }
  });

  // 19. Sort by Name Descending
  test('19. Sort ?sort=name-desc returns products ordered by name descending', async () => {
    const res = await makeRequest('/products?sort=name-desc&limit=16');
    assert.equal(res.status, 200);
    const names = res.data.data.map((p) => p.name);
    for (let i = 1; i < names.length; i++) {
      assert.ok(names[i].localeCompare(names[i - 1]) <= 0, `Name "${names[i]}" should be <= "${names[i - 1]}"`);
    }
  });

  // 20. Sort by Newest
  test('20. Sort ?sort=newest returns products ordered by createdAt descending', async () => {
    const res = await makeRequest('/products?sort=newest&limit=16');
    assert.equal(res.status, 200);
    const dates = res.data.data.map((p) => new Date(p.createdAt).getTime());
    for (let i = 1; i < dates.length; i++) {
      assert.ok(dates[i] <= dates[i - 1], `Date ${dates[i]} should be <= ${dates[i - 1]}`);
    }
  });

  // 21. Filter Metadata
  test('21. Filter metadata GET /api/v1/products/filters/meta returns distinct options', async () => {
    const res = await makeRequest('/products/filters/meta');
    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.ok(Array.isArray(res.data.data.categories), 'categories must be an array');
    assert.ok(Array.isArray(res.data.data.roomTypes), 'roomTypes must be an array');
    assert.ok(Array.isArray(res.data.data.styles), 'styles must be an array');
    assert.ok(res.data.data.priceRange, 'priceRange must be present');
    assert.equal(typeof res.data.data.priceRange.min, 'number');
    assert.equal(typeof res.data.data.priceRange.max, 'number');
    assert.equal(res.data.data.totalProducts, 16);
  });

  // 22. Get Product by Valid productId
  test('22. GET /api/v1/products/:id with valid productId returns 200 with serialized product', async () => {
    const res = await makeRequest('/products/chair-komorebi');
    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.equal(res.data.data.id, 'chair-komorebi');
    assert.equal(res.data.data.productId, 'chair-komorebi');
    assert.equal(res.data.data.name, 'Komorebi Lounge Chair');
    assert.equal(res.data.data.customizable, true);
    assert.ok(res.data.data.dimensions);
  });

  // 23. Get Product by Valid MongoDB ObjectId
  test('23. GET /api/v1/products/:id with valid MongoDB _id returns 200 with serialized product', async () => {
    const mongoId = sampleProduct._id.toString();
    const res = await makeRequest(`/products/${mongoId}`);
    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.equal(res.data.data._id, mongoId);
    assert.equal(res.data.data.productId, sampleProduct.productId);
  });

  // 24. Get Product with Nonexistent ID
  test('24. GET /api/v1/products/:id with nonexistent ID returns 404', async () => {
    const res = await makeRequest('/products/non-existent-product-id');
    assert.equal(res.status, 404);
    assert.equal(res.data.success, false);
    const code = res.data.code || res.data.error?.code;
    assert.equal(code, 'PRODUCT_NOT_FOUND');
  });

  // 25. Get Product by Valid Slug
  test('25. GET /api/v1/products/slug/:slug with valid slug returns 200', async () => {
    const res = await makeRequest('/products/slug/komorebi-lounge-chair');
    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.equal(res.data.data.slug, 'komorebi-lounge-chair');
    assert.equal(res.data.data.productId, 'chair-komorebi');
  });

  // 26. Get Product by Nonexistent Slug
  test('26. GET /api/v1/products/slug/:slug with nonexistent slug returns 404', async () => {
    const res = await makeRequest('/products/slug/non-existent-slug-xyz');
    assert.equal(res.status, 404);
    assert.equal(res.data.success, false);
    const code = res.data.code || res.data.error?.code;
    assert.equal(code, 'PRODUCT_NOT_FOUND');
  });

  // 27. Calculate Price: Valid Options on Customizable Product
  test('27. POST /api/v1/products/:productId/price with valid options calculates accurate price', async () => {
    // chair-komorebi: basePrice 28000
    // fab-boucle (+3500), fin-oak (+2000), size-grand (+4000)
    // Expected: 28000 + 3500 + 2000 + 4000 = 37500
    const res = await makeRequest('/products/chair-komorebi/price', {
      method: 'POST',
      body: {
        configuration: {
          fabricId: 'fab-boucle',
          finishId: 'fin-oak',
          sizeId: 'size-grand',
        },
      },
    });

    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.equal(res.data.data.productId, 'chair-komorebi');
    assert.equal(res.data.data.basePrice, 28000);
    assert.equal(res.data.data.fabricAdjustment, 3500);
    assert.equal(res.data.data.finishAdjustment, 2000);
    assert.equal(res.data.data.sizeAdjustment, 4000);
    assert.equal(res.data.data.finalPrice, 37500);
    assert.equal(res.data.data.isValid, true);
  });

  // 28. Calculate Price: Non-Customizable Product returns 400
  test('28. POST /api/v1/products/:productId/price on non-customizable product returns 400', async () => {
    const res = await makeRequest('/products/table-kanso/price', {
      method: 'POST',
      body: {
        configuration: {
          fabricId: 'fab-boucle',
        },
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
    const code = res.data.code || res.data.error?.code;
    assert.equal(code, 'PRODUCT_NOT_CUSTOMIZABLE');
  });

  // 29. Calculate Price: Invalid Option ID returns 400
  test('29. POST /api/v1/products/:productId/price with invalid option ID returns 400', async () => {
    const res = await makeRequest('/products/chair-komorebi/price', {
      method: 'POST',
      body: {
        configuration: {
          fabricId: 'bogus-fabric-id',
          finishId: 'fin-oak',
          sizeId: 'size-grand',
        },
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.data.success, false);
    const code = res.data.code || res.data.error?.code;
    assert.equal(code, 'INVALID_CUSTOMIZATION_OPTION');
  });

  // 30. Calculate Price: Nonexistent Product returns 404
  test('30. POST /api/v1/products/:productId/price on nonexistent product returns 404', async () => {
    const res = await makeRequest('/products/non-existent-product-id/price', {
      method: 'POST',
      body: {
        configuration: {
          fabricId: 'fab-boucle',
        },
      },
    });

    assert.equal(res.status, 404);
    assert.equal(res.data.success, false);
    const code = res.data.code || res.data.error?.code;
    assert.equal(code, 'PRODUCT_NOT_FOUND');
  });

  // 31. Invalid Query Parameters validation errors
  test('31. Invalid query parameters return 400 validation error', async () => {
    // 31a. minPrice > maxPrice
    const resPriceBounds = await makeRequest('/products?minPrice=50000&maxPrice=20000');
    assert.equal(resPriceBounds.status, 400);
    assert.equal(resPriceBounds.data.success, false);
    assert.ok(
      resPriceBounds.data.errors.some(
        (e) => e.field === 'priceRange' || e.message.includes('Minimum price cannot exceed maximum price')
      )
    );

    // 31b. Invalid category
    const resCategory = await makeRequest('/products?category=InvalidCategoryX');
    assert.equal(resCategory.status, 400);
    assert.equal(resCategory.data.success, false);
    assert.ok(resCategory.data.errors.some((e) => e.field === 'category'));

    // 31c. Invalid roomType
    const resRoom = await makeRequest('/products?roomType=garage');
    assert.equal(resRoom.status, 400);
    assert.equal(resRoom.data.success, false);
    assert.ok(resRoom.data.errors.some((e) => e.field === 'roomType'));

    // 31d. Limit > 48
    const resLimitHigh = await makeRequest('/products?limit=99');
    assert.equal(resLimitHigh.status, 400);
    assert.equal(resLimitHigh.data.success, false);
    assert.ok(resLimitHigh.data.errors.some((e) => e.field === 'limit'));

    // 31e. Negative limit
    const resLimitNegative = await makeRequest('/products?limit=-5');
    assert.equal(resLimitNegative.status, 400);
    assert.equal(resLimitNegative.data.success, false);
    assert.ok(resLimitNegative.data.errors.some((e) => e.field === 'limit'));
  });
});
