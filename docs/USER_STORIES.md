# Décora – User Stories & Acceptance Criteria

**Document Version:** 1.2.0  
**Phase:** Phase 0 (Planning & Requirements Engineering)  
**Academic Subject:** Frontend Web Development (Primary Focus)  
**Methodology:** Agile / User-Centric Requirements Decomposition  
**Standardized Conventions:** Currency in INR (₹), Metric units (cm / m), API prefix `/api/v1`

---

## 1. Overview
This document specifies the complete user stories and acceptance criteria for Décora. Every user story carries an explicit **MoSCoW priority rating** aligned with the 14-day development plan:
- **Must Have:** Core academic MVP (Days 1–12).
- **Should Have:** Important enhancements & management features (Days 10 & 13).
- **Could Have:** Optional stretch capabilities (Day 14).
- **Won't Have:** Strictly out-of-scope for Release 1.0.

---

## 2. Authentication & Session User Stories

### US-AUTH-01: User Registration
- **User Story:** As a **Guest**, I want to register a new account with my name, email, and password, so that I can personalize and persist my design boards, wishlist, and customized furniture.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Client-side validation verifies:
    - Name is not empty.
    - Email follows standard format (`user@example.com`).
    - Password is at least 6 characters long and contains at least one numeric character.
  - Server hashes password using bcrypt with minimum salt rounds of 10 before storage.
  - Returns clear, friendly error messages on failure (e.g., "An account with this email already exists").
  - On successful registration, immediately creates an authenticated session via a secure HTTP-only cookie (`Set-Cookie: jwt=...; HttpOnly; SameSite=Lax`) and redirects user to their previous page or dashboard.

### US-AUTH-02: Customer & Admin Login
- **User Story:** As a **Registered Customer or Administrator**, I want to securely log into my account using my email and password, so that I can access my saved designs, wishlist, or administrative tools.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Login form accepts email and password with client validation against empty inputs.
  - Invalid credentials return a generic, secure error message ("Invalid email or password") to prevent account enumeration.
  - Upon successful verification, server signs a JWT containing `userId` and `role` (`customer` or `admin`), issuing it inside a secure HTTP-only cookie.
  - Client state updates via `AuthContext` to reflect authentication status without storing tokens in `localStorage`.
  - Admin users are navigated to `/admin` or granted access to administrative controls.

### US-AUTH-03: User Logout
- **User Story:** As an **Authenticated User**, I want to log out of my account from any page, so that my personal session is securely terminated on shared devices.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Clicking "Log Out" sends a request to `/api/v1/auth/logout`.
  - Server clears the HTTP-only `jwt` cookie with an immediate expiration date (`expires: new Date(0)`).
  - Client state (`AuthContext`) immediately resets user state to `null`.
  - User is gracefully redirected to the homepage or login page with an informative toast message ("You have been successfully logged out").
  - Access to protected routes (`/boards`, `/wishlist`, `/admin`) is immediately revoked.

---

## 3. Discovery & Exploration User Stories

### US-G01: Homepage Brand Discovery
- **User Story:** As a **Guest**, I want to explore an engaging landing page with room categories, featured collections, and interactive teasers, so that I understand Décora's design aesthetic.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Responsive header with brand logo, navigation links, and mobile drawer.
  - Hero banner with headline, subtitle, and primary CTA ("Explore Catalog").
  - Room category showcase featuring 4 room types (Living Room, Bedroom, Dining, Home Office).
  - Featured furniture section showing trending pieces with prices formatted in INR (₹) and customization badges.
  - Responsive layout on mobile (>=375px), tablet, and desktop without horizontal scroll overflow.

### US-G02: Interior Inspiration Exploration
- **User Story:** As a **Guest or Customer**, I want to browse curated interior design collections and filter by room type and style, so that I can gather visual ideas for my living spaces.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Filter chips support filtering by Style (Minimalist, Scandinavian, Japandi, Industrial) and Room Type.
  - Clicking an inspiration card opens a detail view with concept notes and color palette swatches.
  - Includes a "Shop the Look" section listing related catalog furniture with direct links.
  - Authenticated users can save the inspiration piece to an active Design Board.

### US-G03: Furniture Catalog Filtering & Search
- **User Story:** As a **Guest or Customer**, I want to search and filter furniture by category, room, material, and price range in INR (₹), so that I can locate matching pieces.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Real-time search filters product cards by title, description, and keywords.
  - Multi-select filters for Room Type, Category, and Material work simultaneously.
  - Dynamic price range slider filters items within selected INR (₹) limits.
  - Sort dropdown correctly sorts by "Price: Low to High", "Price: High to Low", and "Popularity".
  - Empty state displays a friendly prompt with a "Reset All Filters" button.

### US-G04: Product Detail Examination
- **User Story:** As a **Guest or Customer**, I want to inspect product specifications, metric dimensions, and multi-angle imagery, so that I can verify physical fit and aesthetic match.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Multi-image gallery allows toggling between viewing angles.
  - Specifications table displays dimensions in centimeters ($W \times D \times H\text{ cm}$) and weight in kilograms ($kg$).
  - Pricing is formatted in INR (₹) with clear stock availability labels ("In Stock" / "Made to Order").
  - "Customize This Piece" button navigates into the Customizer with this product pre-loaded.

---

## 4. Interactive Customization & Personalization User Stories

### US-CUST-01: Furniture Customization & Real-Time Dynamic Pricing
- **User Story:** As a **Guest or Customer**, I want to select different fabrics, wood finishes, hardware, and dimensions for a furniture piece, so that I can see the customized look and real-time updated price in INR (₹).
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - **Valid Option Combinations:** Only compatible options are selectable (e.g., specific premium fabrics pair with designated solid wood finishes; incompatible combinations are visibly disabled with clear helper text).
  - **Authentic Variant Assets:** Customizer uses genuine high-resolution material texture swatches and coordinated SVG/CSS visual overlays on the product. Mismatched or unrelated furniture photos are **never** displayed as variant previews.
  - **Dynamic Price Updates:** Price indicator updates instantaneously upon option changes using the formula:
    $$\text{Final Price (₹)} = \text{Base Price} + \Delta\text{Fabric} + \Delta\text{Finish} + (\text{Size Factor} \times \text{Base Price})$$
  - **Reset Behavior:** "Reset to Defaults" button immediately restores original base materials, base dimensions, and base price.
  - **Configuration Retention:** Selected configuration persists in React component state across active navigation and, for authenticated users, persists to `/api/v1/customizations`.
  - Unauthenticated guests clicking "Save Configuration" are prompted to log in or register.

### US-WISH-01: Customer Wishlist Management
- **User Story:** As a **Customer**, I want to toggle items in my personal wishlist, so that I can track and compare my favorite furniture pieces across sessions.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Heart icon on product cards and detail pages provides instant toggle feedback.
  - Dedicated Wishlist view lists all saved items with thumbnail, title, INR price, and stock status.
  - Persisted in MongoDB via `/api/v1/wishlist` for authenticated customers.
  - Unauthenticated users attempting to add to wishlist are directed to log in.

### US-BOARD-01: Personal Design Boards Creation & Cost Aggregation
- **User Story:** As a **Customer**, I want to organize furniture and inspiration items into custom named design boards, so that I can plan complete rooms and review total estimated costs.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Customers can create, rename, and delete multiple named boards (e.g., "Living Room Japandi 2026").
  - Items can be added directly from catalog cards, customizer configurations, or inspiration views.
  - Board detail view calculates and displays the aggregated budget total of all items in INR (₹).
  - All boards and board items synchronize with MongoDB via `/api/v1/boards`.

---

## 5. Consultation & Advisory User Stories

### US-CONS-01: Guest Consultation Request Submission
- **User Story:** As a **Guest**, I want to submit a design consultation request by providing my contact details, room requirements, and budget, so that an interior designer can review my space without requiring prior registration.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Intake form collects Full Name, Email, Phone Number, Room Type, Preferred Style, INR Budget Tier, Metric Room Dimensions ($L \times W\text{ m}$), and Project Notes.
  - Client-side validation ensures all contact fields and requirements are valid.
  - Form submits payload to `/api/v1/consultations` with `status: 'New'`.
  - On submission, guest receives an on-screen confirmation with a unique reference tracking ID.

### US-CONS-02: Registered Customer Consultation Submission
- **User Story:** As a **Customer**, I want to submit a design consultation request with my saved account information pre-filled, so that my consultation is directly linked to my profile.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Logged-in customer has their Name, Email, and Phone automatically pre-filled.
  - Submission payload associates the customer's `userId`.
  - Customer can attach an active Design Board reference to the consultation request.
  - Submission is saved to MongoDB with `status: 'New'` and confirmation is displayed.

---

## 6. Spatial Planning User Stories

### US-PLAN-01: 2D Room Planner (React-Managed SVG)
- **User Story:** As a **Customer**, I want to position and rotate top-down furniture pieces within a 2D metric floor plan, so that I can visualize spatial layout and estimate total room furniture cost.
- **Priority:** **Should Have**
- **Acceptance Criteria:**
  - User can configure room length and width in meters (e.g., $4.5m \times 3.8m$).
  - Palette sidebar lists top-down SVG representations of furniture items (sofas, tables, beds, desks).
  - Furniture can be dragged and dropped onto the SVG room canvas.
  - Placed furniture can be repositioned, rotated in 45°/90° increments, and deleted.
  - Dynamic budget summary updates in real time to show total cost of placed items in INR (₹).
  - Room layout can be saved to `/api/v1/room-plans` and reloaded.

### US-PLAN-02: Room Planner Collision Warning
- **User Story:** As a **Customer**, I want visual warnings when furniture pieces overlap on the room planner canvas, so that I do not overcrowd my room layout.
- **Priority:** **Could Have** (Optional stretch - not a mandatory completion blocker)
- **Acceptance Criteria:**
  - Simple 2D bounding-box intersection check detects overlapping SVG elements.
  - Overlapping items display an amber/red outline warning.

---

## 7. Administrative User Stories

### US-ADM-01: Protected Admin Dashboard & Metrics
- **User Story:** As an **Administrator**, I want to log into a restricted administrative portal, so that I can monitor catalog metrics and system activity.
- **Priority:** **Should Have**
- **Acceptance Criteria:**
  - Access restricted strictly to users with `role: 'admin'`. Non-admin accounts receive HTTP 403 Forbidden.
  - Dashboard displays metric cards: total products, total registered users, and active consultations.

### US-ADM-02: Product Catalog CRUD Management
- **User Story:** As an **Administrator**, I want to add, edit, and delete furniture products, so that the customer catalog remains up to date.
- **Priority:** **Should Have**
- **Acceptance Criteria:**
  - Product creation and edit forms allow managing Title, Category, Style, Base Price in INR (₹), Metric Dimensions, and Image asset references.
  - Updates persist to `/api/v1/admin/products/:id` with instant reflect in catalog views.
  - Deletion includes a confirmation prompt to prevent accidental data loss.
  - In-stock availability toggle updates live catalog visibility.

### US-ADM-03: Consultation Pipeline Management
- **User Story:** As an **Administrator**, I want to review incoming consultation requests from both guests and customers and update their status, so that inquiries are handled systematically.
- **Priority:** **Should Have**
- **Acceptance Criteria:**
  - Filterable table lists all submissions showing client name, user type (Guest vs Customer), room type, budget tier, and current status.
  - Admin can update request status through stages: `New` $\rightarrow$ `Contacted` $\rightarrow$ `In Progress` $\rightarrow$ `Completed`.
  - Updates persist immediately in MongoDB via `/api/v1/admin/consultations/:id`.

### US-ADM-04: Advanced Analytics Dashboard
- **User Story:** As an **Administrator**, I want to view graphical charts of style demand, popular customized products, and inquiry volume, so that I can analyze customer preferences.
- **Priority:** **Could Have** (Optional stretch goal)
- **Acceptance Criteria:**
  - Interactive visual charts for category breakdown, popular interior styles, and consultation volume over time.

---

## 8. Final MoSCoW Prioritization Summary

```text
================================================================================
MUST HAVE (Core Academic MVP - 14-Day Priority):
================================================================================
├── US-AUTH-01: User Registration (Validation, bcrypt hashing, HTTP-only cookie)
├── US-AUTH-02: Customer & Admin Login (JWT issuance in HTTP-only cookie)
├── US-AUTH-03: User Logout (Cookie invalidation, AuthContext reset)
├── US-G01: Homepage & Navigation (Responsive layout, hero, categories, footer)
├── US-G02: Interior Inspiration (Gallery, style filters, "Shop the Look")
├── US-G03: Furniture Catalog (Search, faceted filters, INR price sorting)
├── US-G04: Product Details (Metric dimensions, multi-image gallery, specs)
├── US-CUST-01: Furniture Customizer (Valid combos, retention, authentic swatches, INR math, resets)
├── US-WISH-01: Customer Wishlist (Instant toggle, MongoDB persistence)
├── US-BOARD-01: Personal Design Boards (Multi-board creation, total cost aggregation)
├── US-CONS-01: Guest Consultation Intake (Contact details, metric dimensions, INR tiers)
└── US-CONS-02: Customer Consultation Intake (Account pre-fill, board linking)

================================================================================
SHOULD HAVE (Enhanced Management & Planning):
================================================================================
├── US-PLAN-01: 2D Room Planner (React-managed SVG canvas, drag/drop, rotate, budget)
├── US-ADM-01: Admin Portal & Metrics (Protected route, summary statistics)
├── US-ADM-02: Product Catalog CRUD (Add, edit, delete, toggle availability)
└── US-ADM-03: Consultation Pipeline Management (Review submissions, update status)

================================================================================
COULD HAVE (Optional Stretch Features):
================================================================================
├── US-PLAN-02: Room Planner Collision Warning (Bounding box intersection highlight)
└── US-ADM-04: Advanced Analytics Dashboard (Visual demand and category charts)

================================================================================
WON'T HAVE (Strictly Out of Scope for Release 1.0):
================================================================================
├── Full 3D WebGL / Three.js Room Simulation
├── Mobile Augmented Reality (AR) Camera Projection
├── AI-Powered Automated Room Layout Proposals
└── Live Financial Payment Gateway Transactions (Stripe / Razorpay)
```
