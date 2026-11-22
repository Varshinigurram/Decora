# Décora — Day 12, Stage 4, Step 2.1: Product Seed Safety Correction & Verification Report

**Date:** November 21, 2026  
**Status:** Completed & Fully Verified  
**Milestone:** Phase 4 — Backend Development (Day 12, Stage 4, Step 2.1)  
**Author:** Senior Backend & Full-Stack Architect  

---

## 1. Exact Issue Identified

During the Day 12 Stage 4 Step 2 audit, an operational vulnerability was identified in `server/scripts/seedProducts.js`. In force mode (`--force`), the script performed an upsert using:

```javascript
// Previous Vulnerable Implementation
await Product.findOneAndUpdate(
  { productId: doc.productId },
  { $set: doc },
  { upsert: true, new: true, runValidators: true }
);
```

Because `doc` contained transformed default values for all schema fields, executing `--force` to refresh catalog specifications (e.g., updating dimensions, new fabric swatches, or refined description copy) inadvertently performed a blanket overwrite of operational inventory and merchandising fields managed by store administrators, specifically:
- `inStock` (reverted from `false` to `true`).
- `stockCount` (reverted from actual inventory count e.g. `0` or `3` to default `10`).
- `featured` (reverted from custom promotion flag e.g. `true` to default `false`).

Furthermore, the script lacked an explicit production guard, meaning developer execution with production environment variables could unintentionally overwrite live store inventory without an authorization flag.

---

## 2. Field Classification Architecture

To resolve this issue while preserving schema integrity and API contracts, all fields defined in [Product.js](file:///c:/Documents/3rd%20Year/Term%20II/Frontend%20Web%20Development/Project/Decora/server/src/models/Product.js) and [products.js](file:///c:/Documents/3rd%20Year/Term%20II/Frontend%20Web%20Development/Project/Decora/client/src/data/products.js) were systematically categorized in `classifyProductFields(prod)`:

### 2.1. Catalog-Managed Fields (`$set: catalogMetadata`)
These fields are authoritatively owned by the design team and catalog dataset. In `--force` mode, they are updated from `client/src/data/products.js`:
- `productId`: Stable unique identifier (e.g. `'chair-komorebi'`).
- `slug`: URL slug (e.g. `'komorebi-lounge-chair'`).
- `name`: Product display name.
- `title`: Editorial subtitle / title.
- `category`: Functional room category (`Seating`, `Tables`, `Beds`, `Storage`, `Lighting`, `Decor`).
- `roomType`: Primary architectural space (`living`, `dining`, `bedroom`, `office`, `architectural`).
- `style`: Aesthetic genre (`Japandi`, `Minimalist`, `Scandinavian`, `Mid-Century`, etc.).
- `basePrice`: Base price in INR.
- `dimensions`: Subdocument (`width`, `depth`, `height`, `formatted`).
- `weightKg`: Physical weight in kilograms.
- `materials`: Array of material tags.
- `primaryMaterial`: Primary construction material string.
- `description`: Primary catalog narrative description.
- `editorialNote`: Curator / architectural design notes.
- `image`: Primary SVG / PNG asset path.
- `gallery`: Array of supplemental gallery image asset paths.
- `fallback`: Default fallback placeholder asset path.
- `tag`: Catalog editorial badge (e.g. `'Bespoke Craft'`, `'Handcrafted'`).
- `customizable`: Boolean toggle indicating if product supports modular options.
- `customizationOptions`: Embedded option trees (`fabrics`, `finishes`, `sizes`) including delta adjustments.
- `specifications`: Subdocument (`frameMaterial`, `joinery`, `cushionFill`, `origin`, `warranty`, `assemblyRequired`, `careInstructions`).
- `relatedProductIds`: String array of linked catalog product IDs.
- `prompt`: Generative room planner contextual narrative.

### 2.2. Operational / Administrator-Managed Fields (`$setOnInsert: operationalDefaults`)
These fields represent live e-commerce and inventory state managed dynamically by administrators through future management panels or order fulfillment:
- `inStock`: Live availability toggle (`Boolean`).
- `stockCount`: Warehouse inventory unit count (`Number`, non-negative).
- `featured`: Homepage merchandising showcase toggle (`Boolean`).

### 2.3. Initial Defaults on Document Creation
When a product record is first inserted (via normal mode creation or initial force upsert), initial operational defaults are established:
- `inStock`: `prod.inStock !== false` (default: `true`)
- `stockCount`: `typeof prod.stockCount === 'number' ? prod.stockCount : 10` (default: `10`)
- `featured`: `Boolean(prod.featured)` (default: `false` or seed flag)

**Key Structural Guarantee:** There is strictly zero key overlap between `$set` and `$setOnInsert`, preventing MongoDB path conflict errors (`MongoServerError: Updating the path '...' would create a conflict at '...'`).

---

## 3. Final Seeding Mechanics & Behavior

### 3.1. Normal Mode (`node server/scripts/seedProducts.js`)
- Checks for record existence by unique `productId`.
- If record exists: Safely skips (`skipped++`) without modifying any fields.
- If record is missing: Creates full record (`{ ...catalogMetadata, ...operationalDefaults }`) with initial defaults (`inserted++`).
- **Idempotence:** Running repeatedly against an existing catalog produces zero duplicates and zero mutations.
- **Reporting:** Outputs `Total processed`, `Inserted (new products)`, `Skipped (already existed)`, `Failed`, and `Total products now in database`.

### 3.2. Force Mode (`node server/scripts/seedProducts.js --force`)
- Executes atomic Mongoose `findOneAndUpdate`:
  ```javascript
  await Product.findOneAndUpdate(
    { productId: catalogMetadata.productId },
    {
      $set: catalogMetadata,
      $setOnInsert: operationalDefaults,
    },
    { upsert: true, new: true, runValidators: true }
  );
  ```
- **Existing Records:** Updates catalog specifications, prices, dimensions, options, descriptions, and media via `$set`. Ignores `$setOnInsert`, preserving administrator modifications to `inStock`, `stockCount`, and `featured`.
- **New Records:** Upsert inserts the document and applies both `$set` (catalog metadata) and `$setOnInsert` (operational defaults).
- **Reporting:** Outputs `Total processed`, `Upserted/Updated (catalog metadata)`, `Failed`, and `Total products now in database`.

---

## 4. Production Safety Safeguards

Inspection of [seedProducts.js](file:///c:/Documents/3rd%20Year/Term%20II/Frontend%20Web%20Development/Project/Decora/server/scripts/seedProducts.js) verifies two layers of defense against accidental production corruption:

1. **Explicit CLI Authorization Guard:**
   ```javascript
   if (nodeEnv === 'production' && !allowProd) {
     console.error('\n[Safety Error] Seeding execution is blocked in production environment.');
     console.error(`  - Current NODE_ENV: ${nodeEnv}`);
     console.error("  - To authorize production seeding, pass the explicit '--allow-prod' flag:");
     console.error('      node scripts/seedProducts.js --allow-prod [--force]\n');
     process.exit(1);
   }
   ```
2. **Environment & Target Database Visibility (No Credentials):**
   ```javascript
   console.log(`[Environment] Target Environment: ${nodeEnv}`);
   console.log(`[Environment] Target Database: ${conn.connection.name}`);
   console.log(`[Environment] Host: ${conn.connection.host}`);
   ```
   Credentials and raw connection strings are never emitted.

---

## 5. Actual Verification Results

### 5.1. Phase 4 Disposable Test Suite
All 11 verification points were executed against the local development database:

| Step # | Verification Scenario | Expected | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Normal seed on empty test collection | Insert 2 new records | 2 inserted | **PASS** |
| 2 | Repeated normal seed | 0 inserted, 2 skipped | 0 inserted, 2 skipped | **PASS** |
| 3 | Admin modification on disposable record | Update `inStock=false`, `stockCount=0`, `featured=true` | Document updated | **PASS** |
| 4 | Force mode update structure executed | `$set: catalogMetadata`, `$setOnInsert: operationalDefaults` | Query executed | **PASS** |
| 5 | Catalog-managed fields update check | `name` and `basePrice` reflect catalog updates | Updated (`28500`) | **PASS** |
| 6 | Operational fields preservation check | `inStock=false`, `stockCount=0`, `featured=true` | Unchanged (`false, 0, true`) | **PASS** |
| 7 | New record operational defaults via upsert | `inStock=true`, `stockCount=10`, `featured=false` | Defaults applied | **PASS** |
| 8 | Real catalog product verification | 16 products in `decora_dev` match `products.js` | 16 products match | **PASS** |
| 9 | Customizable products check | 8 customizable products retain option IDs & deltas | 8 customizable intact | **PASS** |
| 10 | Non-customizable products check | 8 non-customizable products remain fixed | 8 non-customizable intact | **PASS** |
| 11 | Disposable test cleanup | Temporary collections cleanly removed | 0 test collections in DB | **PASS** |

### 5.2. Phase 5 Full Regression Verification

| Test Suite / Probe | Command | Result |
| :--- | :--- | :--- |
| Seed Script Syntax | `node --check server/scripts/seedProducts.js` | **PASS (0 syntax errors)** |
| Production Block Check | `$env:NODE_ENV="production"; node server/scripts/seedProducts.js` | **PASS (Blocked with code 1)** |
| Real Force Seeding | `node server/scripts/seedProducts.js --force` | **PASS (16 updated, 0 failed)** |
| Real Normal Seeding | `node server/scripts/seedProducts.js` | **PASS (0 inserted, 16 skipped)** |
| Product Integration Suite | `node --test server/tests/products.test.js` | **PASS (31/31 passed in 3.13s)** |
| Auth Regression Suite | `node --test server/tests/auth.test.js` | **PASS (27/27 passed in 5.03s)** |
| Server Dependency Tree | `npm --prefix server ls --depth=0` | **PASS (clean tree)** |
| Backend Syntax Validation | `node --check server/**/*.js` | **PASS (all files valid ES modules)** |
| Live API Health Probe | `GET /api/v1/health` | **PASS (HEALTHY)** |
| Live API Readiness Probe | `GET /api/v1/ready` | **PASS (READY, decora_dev)** |
| Live API Products Endpoint | `GET /api/v1/products?limit=2` | **PASS (total: 16)** |
| Live Pricing Endpoint | `POST /api/v1/products/chair-komorebi/price` | **PASS (finalPrice: 37500)** |
| Client Production Build | `npm --prefix client run build` | **PASS (1709 modules built in 7.96s)** |
| Git Whitespace Check | `git diff --check` | **PASS (0 whitespace issues)** |
| Git Secrets & Ignore Check | `.gitignore` inspection | **PASS (.env, keys, build ignored)** |

---

## 6. Remaining Limitations & Architectural Notes

1. **Single-Way Seed Flow:** Seeding flows strictly from the code repository (`client/src/data/products.js`) to MongoDB. It is not a two-way synchronization engine; changes made to catalog descriptions directly in MongoDB will be overwritten if `--force` is executed. This is the intended behavior for code-first catalog versioning.
2. **Product Deletions:** If a product is completely removed from `client/src/data/products.js`, running `seedProducts.js` will not delete the existing document from MongoDB. This protects existing customer design boards and order histories from dangling foreign key errors. Deprecating products should be performed by setting `inStock: false` via administrative tooling.
3. **Admin Panel Governance:** In Day 13, the `/admin` dashboard will expose direct mutation endpoints for `inStock`, `stockCount`, and `featured` fields. The seed safety logic established in Step 2.1 guarantees that future automated catalog updates will never wipe out inventory data set by store managers.
