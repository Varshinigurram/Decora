# Décora – Interaction Specifications & Behavioral Standards

**Document Version:** 1.1.0  
**Phase:** Phase 2 (UI/UX Design & Asset Preparation)  
**Academic Subject:** Frontend Web Development (Primary Focus)  
**Standardized Conventions:** Currency in INR (₹), Metric units (cm / m), API prefix `/api/v1`

---

## 1. Global Navigation & Search Interactions

### Desktop Navigation (`Navbar.jsx`)
- **Scroll Detection:** Monitored via passive scroll listener. When `window.scrollY > 50`, applies a subtle bottom border (`border-b border-sand/40`) and soft shadow (`shadow-sm`).
- **Active Route Indication:** The active link is styled with an architectural underline (`border-b-2 border-forest pb-1`) and medium weight font (`font-medium text-charcoal`).
- **Wishlist Numerical Badge:** Displays active count (e.g., `(3)`) that pulses (`scale-125` transition 200ms) upon item additions.

### Search Shortcut Handling & Exclusions
- **Shortcut Trigger:** Pressing the forward slash key (`/`) focuses the global search input.
- **Input Exclusion Guard:** The event listener explicitly checks target element tags:
  ```javascript
  const handleKeyDown = (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName) && !e.target.isContentEditable) {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
  };
  ```
- **Debounced Search:** Input changes are debounced by **300ms** before filtering catalog state or updating URL search parameters.

---

## 2. Optimistic Wishlist Toggling & Intent Preservation

### Optimistic State & Rollback Mechanism
- **Optimistic Update:** Clicking the heart icon on any product card toggles the local state instantaneously (heart fills with `#9B2C2C` crimson).
- **Asynchronous API Sync:** Dispatches `POST /api/v1/wishlist/:productId` or `DELETE /api/v1/wishlist/:productId`.
- **Failure Rollback Protocol:**
  ```javascript
  const toggleWishlist = async (productId) => {
    const previousState = isWishlisted;
    setIsWishlisted(!previousState); // Optimistic UI update
    try {
      await api.toggleWishlist(productId);
      showToast(previousState ? "Removed from Wishlist" : "Saved to Wishlist", "success");
    } catch (error) {
      setIsWishlisted(previousState); // Rollback immediately
      showToast("Unable to update wishlist. Please try again.", "error");
    }
  };
  ```

### Preserving Guest Wishlist Action Through Login
- When an unauthenticated guest clicks the wishlist heart icon:
  1. The application captures the action and product ID:
     `const returnUrl = `/catalog?action=wishlist&productId=${productId}`;`
  2. The guest is redirected to `/login?redirect=${encodeURIComponent(returnUrl)}`.
  3. Upon successful registration or login, the auth handler inspects the redirect query params, automatically invokes the wishlist addition API, and displays: *"Welcome! Item was automatically added to your Wishlist."*

---

## 3. Customizer Selection Retention & Incompatible Combinations

### Option Compatibility Matrix
Certain materials cannot physically or aesthetically pair together. The customizer enforces strict compatibility validation:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   COMPATIBILITY VALIDATION MATRIX                      │
├─────────────────────┬───────────────────────────┬──────────────────────┤
│ Selected Fabric     │ Permitted Wood Finishes   │ Incompatible Finishes│
├─────────────────────┼───────────────────────────┼──────────────────────┤
│ **Cream Bouclé**    │ Natural Oak, Rich Walnut  │ Ebonized Ash         │
│ **Olive Velvet**    │ Rich Walnut, Ebonized Ash │ Brushed Brass Metal  │
│ **Charcoal Linen**  │ Natural Oak, Ebonized Ash │ None (Universal)     │
│ **Cognac Leather**  │ Rich Walnut, Matte Black  │ Natural White Oak    │
└─────────────────────┴───────────────────────────┴──────────────────────┘
```

- **Visual Feedback for Incompatible Options:**
  - Incompatible options are not removed from view (which causes layout jumps); instead, they are displayed with `opacity-30 cursor-not-allowed line-through`.
  - Hovering or clicking an incompatible option triggers an inline tooltip: *"Cognac Leather is not available with Natural White Oak. Select Walnut or Matte Black to proceed."*

### Additive Price Recalculation Engine
- Every selection triggers instant recalculation using the standardized additive model:
  $$\mathbf{\text{Final Price}} = \text{Base Price} + \Delta\text{Fabric Adjustment} + \Delta\text{Finish Adjustment} + \Delta\text{Size Adjustment}$$
- The price display animates price changes smoothly via a 200ms count-up transition.
- **Client Retention:** Active customizer state is maintained in `useCustomizer` context so navigating away to review inspiration lookbooks and returning preserves active selections.

---

## 4. React-Managed SVG 2D Room Planner Coordinate Transformations

### SVG Coordinate Conversion Math (Screen-to-SVG Matrix)
Because browser pointer events report client pixel coordinates (`e.clientX`, `e.clientY`) that do not match the scalable SVG coordinate system, Décora converts pointer coordinates using the standard **SVG Screen Current Transformation Matrix (ScreenCTM)**:

```javascript
// Converts Mouse or Touch Screen Pixels to Scaled SVG Room Coordinates (Meters)
const getSvgCoordinates = (event, svgElement) => {
  const pt = svgElement.createSVGPoint();
  // Support both mouse events and mobile touch events
  if (event.touches && event.touches.length > 0) {
    pt.x = event.touches[0].clientX;
    pt.y = event.touches[0].clientY;
  } else {
    pt.x = event.clientX;
    pt.y = event.clientY;
  }
  
  // Transform screen coordinates through inverted CTM matrix
  const screenCTM = svgElement.getScreenCTM();
  if (!screenCTM) return { x: 0, y: 0 };
  const svgP = pt.matrixTransform(screenCTM.inverse());
  
  // Convert from internal SVG units (100px = 1 meter) to room bounds
  return {
    x: Math.max(0, Math.min(roomLengthMeters, svgP.x / 100)),
    y: Math.max(0, Math.min(roomWidthMeters, svgP.y / 100))
  };
};
```

### Drag & Rotation Behavior
- **Mouse Drag (Desktop):** `onMouseDown` sets active dragged item ID; `onMouseMove` updates SVG coordinates; `onMouseUp` releases item and snaps to 0.1m increments.
- **Touch Drag (Mobile):** `onTouchStart` sets passive: false to prevent document scrolling while manipulating furniture on canvas; `onTouchMove` updates coordinates via `e.touches[0]`.
- **Rotation Handle:** A circular rotation handle sits atop the selected item's bounding box. Each click rotates the piece clockwise in **45° and 90° increments** (`rotate(angle, centerX, centerY)`).
- **Budget Counter:** A persistent header widget aggregates total room furniture cost in INR (₹) after every placement or deletion.

---

## 5. Form Validation & User Feedback

- **Validation Timing:** Inputs validate `onBlur` (when the user leaves the field) to avoid premature error flashing.
- **Error Styling:** Fields display a 1px deep red border (`border-accent-error`) with red helper text and an alert icon below the field.
- **Submission Feedback:** Form submit buttons show an inline loading spinner and become disabled (`pointer-events-none opacity-80`) while requests are in flight.
- **Toast Notifications:** 3-second non-blocking alert toasts positioned at the bottom-right on desktop and top-center on mobile.
