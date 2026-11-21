# Décora — Day 12, Stage 4: Step 1 Inspection & Architecture Analysis Report

**Status:** Completed & Ready for Review  
**Date:** November 21, 2026  
**Scope:** Stage 4 (Product API & Catalog Backend Integration) — Phase 1 Repository Inspection  
**Author:** Senior Full-Stack Engineer & Backend Architect  

---

## 1. Executive Summary & Verification Checklist

In accordance with the Stage 4 instructions, a comprehensive inspection of the existing Décora repository was conducted across frontend product data, component consumers, backend infrastructure, and architectural specifications.

**Preflight Rule Adherence:**
- Zero implementation source code files were created or modified.
- Zero dependencies were installed.
- Zero database seeding was performed.
- Zero existing frontend or backend features were deleted or refactored.
- Only the two designated documentation files were produced.

---

## 2. Verified Repository Findings

### 2.1. Product Dataset Inventory
- **Authoritative Dataset:** `client/src/data/products.js`
  - **Total Products:** **16 designs**
  - **Customizable Products:** **8 designs** (`chair-komorebi`, `sofa-sylvan`, `table-asahi`, `bed-linen-sanctuary`, `chair-nordic-dining`, `desk-atelier`, `wardrobe-koto`, `lounge-florence`).
  - **Non-Customizable Products:** **8 designs** (`table-kanso`, `credenza-nara`, `nightstand-aura`, `bench-kyoto`, `bookshelf-linear`, `lamp-kanso-stone`, `pendant-scandi-dome`, `mirror-arch-oslo`).
  - **Price Range:** ₹9,500 (`lamp-kanso-stone`) to ₹68,000 (`wardrobe-koto`).
  - **In-Stock Count:** 14 products in stock, 2 out of stock (`bench-kyoto`, `credenza-nara` have low/out-of-stock variations).
  - **Featured Count:** 6 products marked `featured: true`.
- **Legacy Dataset:** `client/src/data/sampleProducts.js`
  - Contains an outdated 3-product fixture (`chair-komorebi`, `sofa-sylvan`, `table-kanso`).
  - Verified with global search: **Zero components or files import `sampleProducts.js`**. It is an unreferenced artifact.

### 2.2. Product Identifiers & Category Enums
- **Identifier Conventions:**
  - `id`: Lowercase hyphenated string (e.g. `chair-komorebi`, `sofa-sylvan`, `table-kanso`).
  - `slug`: Human-readable SEO slug (e.g. `komorebi-lounge-chair`, `sylvan-minimalist-sofa`).
- **Observed Categories:** `['Seating', 'Tables', 'Beds', 'Storage', 'Lighting']` (with 'Decor' supported).
- **Observed Room Types:** `['living', 'dining', 'bedroom', 'office']` (with 'architectural' supported).
- **Observed Styles:** `['Japandi', 'Minimalist', 'Scandinavian', 'Mid-Century']`.
  - *Critical Schema Insight:* `docs/DATABASE_SCHEMA.md` originally specified `['Japandi', 'Warm Editorial', 'Nordic Minimalist', 'Modern Architectural', 'Organic Modern', 'Mid-Century Modern']`. The proposed Mongoose schema in `docs/DAY_12_STAGE_4_PRODUCT_API_ARCHITECTURE.md` incorporates both the actual dataset styles and editorial variants to ensure seed data is validated without schema constraint errors.

### 2.3. Frontend Product Dependency Surface
Nine active frontend files directly import from `client/src/data/products.js`:
1. `client/src/pages/CatalogPage.jsx` — Uses `getAllProducts()`, `getUniqueCategories()`, `getUniqueRoomTypes()`, `getUniqueMaterials()`, `getPriceBounds()`. Currently executes filtering and sorting client-side using `useMemo`.
2. `client/src/pages/ProductDetailPage.jsx` — Uses `getProductByIdOrSlug(id)` and `getRelatedProducts(product, 3)`.
3. `client/src/pages/CustomizerPage.jsx` — Uses `getCustomizableProducts()`.
4. `client/src/pages/ProductCustomizerPage.jsx` — Uses `getProductByIdOrSlug()`.
5. `client/src/pages/RoomPlannerPage.jsx` — Uses `PRODUCTS` to populate the 2D CAD spatial planner.
6. `client/src/components/roomPlanner/FurniturePalette.jsx` — Renders furniture vector drag-and-drop items.
7. `client/src/components/roomPlanner/SelectedFurnitureInspector.jsx` — Inspects active furniture instance dimensions and configurations.
8. `client/src/context/DesignBoardContext.jsx` — Resolves product records when generating board item snapshots.
9. `client/src/assets/furnitureMapping.js` — Exports `FEATURED_PRODUCTS = getFeaturedProducts()`, consumed by `FeaturedCollection.jsx` on the homepage.
10. `client/src/data/inspirations.js` — Resolves `relatedProductIds` into live lookbook items via `getResolvedProductsForLookbook()`.

---

## 3. Customization & Pricing Compatibility

The existing dynamic pricing engine (`client/src/utils/pricingEngine.js`) enforces the following additive formulation:
$$\text{Final Price} = \text{Base Price} + \Delta_{\text{Fabric}} + \Delta_{\text{Finish}} + \Delta_{\text{Size}}$$

- **Option Identifiers:** All customizable products define options with deterministic IDs:
  - Fabrics: `fab-linen` ($\Delta = 0$), `fab-boucle` ($+₹3,500$), `fab-velvet` ($+₹4,200$), `fab-leather` ($+₹8,000$).
  - Finishes: `fin-beech` ($\Delta = 0$), `fin-oak` ($+₹2,000$), `fin-walnut` ($+₹2,200$), `fin-ash` ($+₹2,500$).
  - Sizes: `size-std` ($\Delta = 0$, scale: 1.0), `size-grand` ($+₹4,000$, scale: 1.1).
- **Backend Pricing Service Requirement:** The backend will implement an authoritative pricing calculation service (`server/src/services/pricingService.js`) matching this exact logic to re-verify client configurations and calculate prices server-side.

---

## 4. Backend Readiness Assessment

- **HTTP Framework & Routing:** Express 4.x running under ES modules with `/api/v1` router mount.
- **Database & ODM:** MongoDB Atlas / local MongoDB (`decora_dev`) with Mongoose 8.x.
- **Response & Error Envelopes:** Standardized via `apiResponse.success()`, `apiResponse.created()`, and `AppError` class.
- **Security & Authorization:** `authenticateJWT` and `requireAdmin` operational from Stage 3.
- **Existing Product Artifacts:** No product models, routes, or controllers exist yet in `server/`. Clean foundation ready for implementation.

---

## 5. Proposed Endpoints & Contracts

1. `GET /api/v1/products`: Filterable, searchable, sorted, paginated product collection.
2. `GET /api/v1/products/:id`: Single product lookup by `productId` or MongoDB `_id`.
3. `GET /api/v1/products/slug/:slug`: Single product lookup by URL slug.
4. `POST /api/v1/products/:productId/price`: Authoritative server-side price calculation and configuration validation.

---

## 6. Seeding & Migration Strategy

- **Seeding Script:** `server/scripts/seedProducts.js` executed via `node server/scripts/seedProducts.js`.
- **Idempotence:** Uses `Product.findOneAndUpdate({ productId: p.id }, { $set: productDoc }, { upsert: true })`.
- **Safety Rule:** Never executed automatically on startup or in production.
- **Asset Preservation:** Preserves existing relative SVG image asset paths without substitution.
- **Non-Disruptive Frontend Transition:** `client/src/data/products.js` will remain in the repository as an offline fallback registry during Stage 4. Components will transition via a dedicated `client/src/services/productService.js` adapter.

---

## 7. Unresolved Architectural Questions

- **None.** All schema fields, option matrices, pricing deltas, and endpoint contracts are fully reconciled with the existing codebase.

---

## 8. Readiness Assessment

The architecture inspection is complete. The system is fully ready for implementation upon approval of `docs/DAY_12_STAGE_4_PRODUCT_API_ARCHITECTURE.md`.
