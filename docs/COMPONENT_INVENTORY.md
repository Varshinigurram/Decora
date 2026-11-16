# Décora – Component Inventory & Interface Specification

**Document Version:** 1.1.0  
**Phase:** Phase 2 (UI/UX Design & Asset Preparation)  
**Academic Subject:** Frontend Web Development (Primary Focus)  
**Standardized Conventions:** Currency in INR (₹), Metric units (cm / m), API prefix `/api/v1`

---

## 1. Component Architecture & Directory Map

Décora is constructed using modular, reusable React functional components divided into three distinct architectural tiers:
1. **Tier 1: Primitives & Utilities (`components/common/`):** Atomic building blocks (Buttons, Inputs, Modals, Breadcrumbs, Badges, PriceDisplay, Loaders).
2. **Tier 2: Global Shell & Layout (`components/layout/`):** Persistent frames (Navbar, Footer, MobileDrawer, AdminLayout, ProtectedRoute, AdminRoute).
3. **Tier 3: Domain-Specific Modules (`components/[domain]/`):** Feature components containing contextual interactions (Catalog filters, Customizer stage, SVG Room Planner canvas, Consultation wizard).

```text
client/src/components/
├── common/
│   ├── Button.jsx               # Primary, secondary, ghost, icon
│   ├── Input.jsx                # Text, email, password with validation
│   ├── Select.jsx               # Architectural custom dropdown
│   ├── RangeSlider.jsx          # Dual-thumb price range slider
│   ├── Modal.jsx                # Accessible backdrop dialog modal
│   ├── ConfirmationDialog.jsx   # Deletion / destructive action confirmation
│   ├── Badge.jsx                # Stock status, category pills
│   ├── Toast.jsx                # Non-blocking feedback notifications
│   ├── SkeletonCard.jsx         # Loading state placeholder
│   ├── EmptyState.jsx           # Constructive zero-result fallback
│   ├── ErrorState.jsx           # Network / server error recovery banner
│   ├── Breadcrumbs.jsx          # Hierarchical navigation breadcrumb bar
│   ├── PriceDisplay.jsx         # Formatted INR (₹) price with base/delta styling
│   └── Pagination.jsx           # Numeric page switcher and results count
├── layout/
│   ├── Navbar.jsx               # Sticky desktop navigation bar
│   ├── MobileDrawer.jsx         # Full-height slide-over drawer
│   ├── Footer.jsx               # 4-column architectural footer
│   ├── AdminLayout.jsx          # Protected administrative shell
│   ├── ProtectedRoute.jsx       # Client auth guard wrapper
│   └── AdminRoute.jsx           # Role: 'admin' guard wrapper
├── catalog/
│   ├── ProductCard.jsx          # 4:5 portrait furniture card
│   ├── ProductQuickView.jsx     # Fast modal preview with specs & actions
│   ├── FilterSidebar.jsx        # Faceted filters (room, material, price)
│   ├── SearchBar.jsx            # Debounced real-time text input
│   └── SortDropdown.jsx         # Multi-criteria sorting select
├── product/
│   ├── ProductGallery.jsx       # Multi-angle image viewer with zoom
│   └── SpecTable.jsx            # Metric dimensions & weight table
├── customizer/
│   ├── CustomizerViewer.jsx     # Visual product stage with overlays
│   ├── ProductVariantSelector.jsx# Combined fabric, finish & size selector
│   ├── MaterialSwatch.jsx       # Circular texture thumbnail selector
│   └── PriceBreakdownCard.jsx   # Additive price breakdown formula card
├── planner/
│   ├── SvgRoomCanvas.jsx        # Declarative SVG 2D floorboard
│   ├── FurniturePalette.jsx     # Draggable top-down vector catalog
│   └── DimensionControls.jsx    # Metric length/width input panel
├── boards/
│   ├── BoardCard.jsx            # Composite moodboard summary card
│   ├── BoardItemCard.jsx        # Individual configured item in board
│   └── BoardBudgetSummary.jsx   # Aggregate budget counter and consultation CTA
└── consultation/
    ├── StepProgressBar.jsx      # Multi-step intake indicator
    └── ConsultationForm.jsx     # Dual guest/customer questionnaire
```

---

## 2. Reusable Primitives & Common Utilities (`components/common/`)

### 2.1. `PriceDisplay.jsx`
- **Role:** Centralized price formatter enforcing Indian numbering format (`₹28,000`, `₹1,12,000`).
- **Required Props:**
  - `amount`: `number` (numeric price in INR, e.g., `28000`)
- **Optional Props:**
  - `prefix`: `string` (e.g., `"From "` or `""`; default: `""`)
  - `isDelta`: `boolean` (displays as `+₹3,500` in green/taupe; default: `false`)
  - `size`: `'sm'` | `'md'` | `'lg'` | `'xl'` (default: `'md'`)
  - `className`: `string`

### 2.2. `Breadcrumbs.jsx`
- **Role:** Secondary hierarchical navigation across catalog, PDPs, lookbooks, and boards.
- **Required Props:**
  - `items`: `Array<{ label: string, path?: string }>` (e.g., `[{ label: 'Home', path: '/' }, { label: 'Catalog', path: '/catalog' }, { label: 'Seating' }]`)
- **Optional Props:**
  - `separator`: `ReactNode` (default: `'/'` in sand text)

### 2.3. `ConfirmationDialog.jsx`
- **Role:** Prevents accidental deletions of boards, board items, or catalog products.
- **Required Props:**
  - `isOpen`: `boolean`
  - `title`: `string` (e.g., `"Delete Living Room Board?"`)
  - `message`: `string`
  - `onConfirm`: `function()`
  - `onCancel`: `function()`
- **Optional Props:**
  - `confirmLabel`: `string` (default: `"Delete"`)
  - `cancelLabel`: `string` (default: `"Cancel"`)
  - `isLoading`: `boolean` (default: `false`)

### 2.4. `ErrorState.jsx`
- **Role:** User-friendly fallback when catalog data, customizer assets, or boards fail to load.
- **Required Props:**
  - `title`: `string` (e.g., `"Unable to load collection"`)
  - `message`: `string`
  - `onRetry`: `function()`
- **Optional Props:**
  - `showHomeLink`: `boolean` (default: `true`)

### 2.5. `Pagination.jsx`
- **Role:** Handles catalog page navigation.
- **Required Props:**
  - `currentPage`: `number`
  - `totalPages`: `number`
  - `onPageChange`: `function(page: number)`
- **Optional Props:**
  - `totalItems`: `number`
  - `itemsPerPage`: `number`

---

## 3. Route Guard & Shell Components (`components/layout/`)

### 3.1. `ProtectedRoute.jsx`
- **Role:** Client route wrapper guarding authenticated customer views (`/boards`, `/wishlist`).
- **Required Props:**
  - `children`: `ReactNode`
- **Behavior:** Reads user state from `AuthContext`. If unauthenticated, saves current target URL to redirect query params (`/login?redirect=${encodeURIComponent(location.pathname)}`) and navigates to `/login`.

### 3.2. `AdminRoute.jsx`
- **Role:** Client route wrapper guarding administrative views (`/admin/*`).
- **Required Props:**
  - `children`: `ReactNode`
- **Behavior:** Checks `user.role === 'admin'`. If unauthenticated, redirects to `/login`. If authenticated as a standard customer, renders a clean 403 Forbidden screen or redirects to `/`.

---

## 4. Domain-Specific Component Specifications

### 4.1. `ProductQuickView.jsx` (`components/catalog/`)
- **Role:** Modal dialog surfacing immediate product specifications without leaving the catalog.
- **Required Props:**
  - `product`: `ProductObject` (title, images, basePrice, dimensions, description, inStock)
  - `isOpen`: `boolean`
  - `onClose`: `function()`
- **Optional Props:**
  - `onCustomize`: `function(productId)`
  - `onWishlistToggle`: `function(productId)`

### 4.2. `ProductVariantSelector.jsx` (`components/customizer/`)
- **Role:** Orchestrates material swatches, wood finishes, and scale options in the Customizer.
- **Required Props:**
  - `availableFabrics`: `Array<FabricOption>`
  - `availableFinishes`: `Array<FinishOption>`
  - `availableSizes`: `Array<SizeOption>`
  - `selectedFabricId`: `string`
  - `selectedFinishId`: `string`
  - `selectedSizeId`: `string`
  - `onSelectFabric`: `function(fabricId)`
  - `onSelectFinish`: `function(finishId)`
  - `onSelectSize`: `function(sizeId)`
- **Behavior:** Visually disables incompatible combinations and provides explanatory tooltips.

### 4.3. `BoardBudgetSummary.jsx` (`components/boards/`)
- **Role:** Displays aggregated cost calculations and action triggers on personal design boards.
- **Required Props:**
  - `items`: `Array<BoardItem>`
  - `boardTitle`: `string`
- **Optional Props:**
  - `onAttachToConsultation`: `function()`
- **Calculation:** Computes:
  $$\text{Total Estimated Budget} = \sum_{i=1}^{n} \text{item}_i\text{.configuredPrice}$$
- **Key Elements:** High-contrast formatted total via `PriceDisplay`, item count badge, and "Attach to Consultation" CTA.

---

## 5. Complete Props & Interface Matrix

| Component | Required Props | Optional Props / Callbacks | State Management |
|---|---|---|---|
| `PriceDisplay` | `amount` | `prefix`, `isDelta`, `size`, `className` | Stateless presentation |
| `Breadcrumbs` | `items` | `separator`, `className` | Stateless presentation |
| `ConfirmationDialog` | `isOpen`, `title`, `message`, `onConfirm`, `onCancel` | `confirmLabel`, `cancelLabel`, `isLoading` | Controlled by parent modal state |
| `ErrorState` | `title`, `message`, `onRetry` | `showHomeLink` | Stateless presentation |
| `Pagination` | `currentPage`, `totalPages`, `onPageChange` | `totalItems`, `itemsPerPage` | Controlled by parent query state |
| `ProtectedRoute` | `children` | `fallbackPath` | Connects to `AuthContext` |
| `AdminRoute` | `children` | `fallbackPath` | Connects to `AuthContext` (`role: 'admin'`) |
| `ProductCard` | `product` | `isWishlisted`, `onToggleWishlist`, `onQuickView` | Local hover state |
| `ProductQuickView` | `product`, `isOpen`, `onClose` | `onCustomize`, `onWishlistToggle` | Controlled modal |
| `MaterialSwatch` | `swatch`, `isSelected`, `onSelect` | `isDisabled`, `tooltipText` | Local hover/tooltip state |
| `PriceBreakdownCard`| `basePrice`, `fabricAdj`, `finishAdj`, `sizeAdj` | `totalPrice`, `onSave`, `isSaving` | Pure computation presentation |
| `BoardBudgetSummary`| `items`, `boardTitle` | `onAttachToConsultation` | Derived budget calculation |
| `SvgRoomCanvas` | `roomLength`, `roomWidth`, `placedItems` | `onItemMove`, `onItemRotate`, `onItemDelete` | Mouse/touch drag coordinate state |
