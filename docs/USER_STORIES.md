# Décora – User Stories & Acceptance Criteria

**Document Version:** 1.1.0  
**Phase:** Phase 0 (Planning & Requirements Engineering)  
**Academic Subject:** Frontend Web Development (Primary Focus)  
**Methodology:** Agile / User-Centric Requirements Decomposition  
**Standardized Conventions:** Currency in INR (₹), Metric units (cm / m), API prefix `/api/v1`

---

## 1. Overview
This document specifies the user stories and acceptance criteria for Décora, structured across Guest, Registered Customer, and Administrator personas using the MoSCoW prioritization scheme.

---

## 2. Guest User Stories

### US-G01: Homepage Brand Discovery
- **User Story:** As a **Guest**, I want to view an inviting landing page with brand storytelling, room categories, and featured collections, so that I can immediately understand Décora's offerings and design aesthetic.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Hero section displays engaging typography, brand subtitle, and primary CTA ("Explore Catalog").
  - Room category showcase features 4 room types (Living Room, Bedroom, Dining, Home Office) with curated imagery.
  - Featured furniture section displays trending pieces with prices formatted in INR (₹) and customization tags.
  - Testimonial and consultation booking teasers are displayed.
  - Page is fully responsive on mobile viewports (>=375px) without horizontal scrolling.

### US-G02: Interior Inspiration Exploration
- **User Story:** As a **Guest**, I want to browse curated interior design collections and filter by room type and style, so that I can discover visual ideas for my living spaces.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Filter chips allow filtering by Style (Minimalist, Scandinavian, Japandi, Industrial) and Room Type.
  - Clicking a design opens a detail view with concept description and color swatches.
  - Detailed view provides a "Shop the Look" section listing related catalog furniture items with direct navigation.
  - Unauthenticated users attempting to save an inspiration item are prompted to log in.

### US-G03: Furniture Catalog Filtering & Search
- **User Story:** As a **Guest**, I want to search and filter furniture by category, room, material, and price range in INR (₹), so that I can quickly find pieces matching my needs and budget.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Search input filters product cards in real time against title, description, and tags.
  - Price range slider dynamically updates minimum and maximum bounds in INR (₹).
  - Material and room filters operate together as combined facets.
  - Sort dropdown correctly re-orders products by "Price: Low to High", "Price: High to Low", and "Popularity".
  - Empty search state provides an informative message and a "Reset All Filters" button.

### US-G04: Product Detail Examination
- **User Story:** As a **Guest**, I want to inspect detailed product specifications, materials, and metric dimensions, so that I can verify whether an item physically fits my room.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Image gallery allows toggling between multiple viewing angles of the piece.
  - Specifications table displays dimensions in centimeters ($W \times D \times H\text{ cm}$) and weight in kilograms ($kg$).
  - Pricing is clearly displayed in INR (₹) alongside stock status ("In Stock" / "Made to Order").
  - Prominent "Customize This Piece" button navigates into the Customizer with this product pre-loaded.

### US-G05: Interactive Customization & Dynamic Pricing
- **User Story:** As a **Guest**, I want to select different upholstery fabrics, wood finishes, and hardware options, so that I can see the customized look and dynamic price in INR (₹).
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Selecting fabric and finish swatches updates visual overlays and highlights on the product without displaying unrelated furniture images.
  - Price indicator recalculates immediately using the formula:
    $$\text{Final Price (₹)} = \text{Base Price} + \Delta\text{Fabric} + \Delta\text{Finish} + (\text{Size Factor} \times \text{Base Price})$$
  - "Reset" button restores base configuration and default price.
  - Unauthenticated users clicking "Save Configuration" are prompted to log in.

### US-G06: Account Registration & Authentication
- **User Story:** As a **Guest**, I want to register a personal account, so that I can save my customizations, wishlist items, and design boards.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Registration form validates email format and password strength (minimum 6 characters).
  - Validation errors appear inline for duplicate emails or empty fields.
  - Successful registration establishes an authenticated session via a secure HTTP-only cookie (`Set-Cookie: jwt=...; HttpOnly; SameSite=Lax`).
  - Passwords are encrypted on the server with bcrypt prior to storage.

---

## 3. Registered Customer User Stories

### US-C01: Wishlist Persistence & Management
- **User Story:** As a **Customer**, I want to save favorite furniture pieces to a personal wishlist, so that I can easily revisit them.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Clicking the heart icon on any product card toggles its wishlist status instantly.
  - Dedicated Wishlist view displays all saved items with thumbnail, title, INR price (₹), and availability.
  - Changes are persisted in MongoDB via `/api/v1/wishlist` for authenticated sessions.
  - Products can be removed individually or navigated directly to the Customizer.

### US-C02: Saving Custom Configurations
- **User Story:** As a **Customer**, I want to save my personalized furniture configurations, so that I can preserve my material choices and price estimations.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Logged-in user can click "Save Configuration" inside the Customizer.
  - The customized configuration persists to MongoDB via `/api/v1/customizations` with chosen swatches, dimensions, and calculated INR price.
  - A toast notification confirms successful save.

### US-C03: Personal Design Boards Creation
- **User Story:** As a **Customer**, I want to organize furniture and inspiration items into named design boards, so that I can plan room themes and monitor combined budgets.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Customer can create multiple named boards (e.g., "Master Bedroom Japandi").
  - Items can be added to an active board directly from catalog cards or customizer views.
  - Board detail page aggregates the total estimated cost of all included items in INR (₹).
  - Boards and individual board items can be edited or removed with data synced to `/api/v1/boards`.

### US-C04: 2D Room Planner (React-Managed SVG)
- **User Story:** As a **Customer**, I want to arrange furniture within a 2D top-down room floor plan using metric dimensions, so that I can evaluate room flow and furniture spacing.
- **Priority:** **Should Have**
- **Acceptance Criteria:**
  - User can configure room dimensions in meters (e.g., $4.0m \times 5.0m$).
  - Palette sidebar allows selecting furniture items and placing them onto the SVG room canvas.
  - Placed furniture items can be repositioned via drag-and-drop, rotated in 45°/90° increments, and deleted.
  - Live budget indicator updates in real time to show the total cost of placed furniture in INR (₹).
  - Saved room layouts persist to `/api/v1/room-plans` and can be reloaded.

### US-C05: Room Planner Collision Warning
- **User Story:** As a **Customer**, I want visual warnings when furniture pieces overlap in the 2D room planner, so that I do not overcrowd my floor layout.
- **Priority:** **Could Have**
- **Acceptance Criteria:**
  - Simple 2D bounding-box intersection helper evaluates placed item bounds.
  - Intersecting items display an amber or red boundary highlight.

### US-C06: Design Consultation Request Submission
- **User Story:** As a **Customer**, I want to submit a detailed design consultation request with room dimensions, style preferences, and budget tier, so that an interior designer can review my project.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Multi-step questionnaire captures contact details, room type, style preference, budget bracket in INR (₹), and project notes.
  - Form validates required fields and submits payload to `/api/v1/consultations`.
  - Submission displays a unique confirmation reference number upon completion.

---

## 4. Administrator User Stories

### US-A01: Protected Admin Dashboard & Metrics
- **User Story:** As an **Administrator**, I want to log into a restricted administrative portal, so that I can view overall platform statistics and manage catalog records.
- **Priority:** **Should Have**
- **Acceptance Criteria:**
  - Admin login requires credentials where `user.role === 'admin'`. Non-admin accounts receive HTTP 403 Forbidden.
  - Dashboard summarizes total products, categories, registered users, and consultation inquiries.

### US-A02: Product Catalog CRUD Management
- **User Story:** As an **Administrator**, I want to create, update, and delete furniture products, so that the online catalog remains current.
- **Priority:** **Should Have**
- **Acceptance Criteria:**
  - Form allows inputting Name, Category, Style, Base Price (₹), Metric Dimensions, and Image asset paths.
  - Editing updates existing product documents via `/api/v1/admin/products/:id`.
  - Delete action includes confirmation modal to prevent accidental data loss.
  - In-stock availability toggle updates live catalog visibility.

### US-A03: Consultation Pipeline Management
- **User Story:** As an **Administrator**, I want to review incoming consultation requests and update their status, so that customer inquiries are tracked systematically.
- **Priority:** **Should Have**
- **Acceptance Criteria:**
  - Table displays all submissions with submitter name, room type, budget tier (₹), and current status.
  - Status can be updated through pipeline stages: `New` $\rightarrow$ `Contacted` $\rightarrow$ `In Progress` $\rightarrow$ `Completed`.
  - Updates persist in MongoDB via `/api/v1/admin/consultations/:id`.

### US-A04: Advanced Analytics Dashboard
- **User Story:** As an **Administrator**, I want to view visual charts of category popularity and consultation volume trends, so that I can understand customer demand.
- **Priority:** **Could Have**
- **Acceptance Criteria:**
  - Graphical breakdown of popular styles, most customized furniture pieces, and inquiry volume over time.

---

## 5. MoSCoW Prioritization Summary

```text
================================================================================
MUST HAVE (Core Academic MVP):
================================================================================
├── US-G01: Homepage & Navigation (Responsive layout, hero, categories, footer)
├── US-G02: Interior Inspiration (Gallery, style filters, "Shop the Look")
├── US-G03: Furniture Catalog (Search, faceted filters, INR price sorting)
├── US-G04: Product Details (Metric dimensions, multi-image gallery, specs)
├── US-G05: Furniture Customizer (Swatches, real-time INR price formula, resets)
├── US-G06: Authentication (Secure HTTP-only cookies, bcrypt, validation)
├── US-C01: Customer Wishlist (Instant toggle, MongoDB persistence)
├── US-C02: Saved Customizations (Preserve configured variants in account)
├── US-C03: Personal Design Boards (Multi-board creation, total cost aggregation)
└── US-C06: Design Consultation Intake (Multi-step form, INR budget tiers)

================================================================================
SHOULD HAVE (Enhanced Polish & Management):
================================================================================
├── US-C04: 2D Room Planner (React-managed SVG canvas, drag/drop, rotate, budget)
├── US-A01: Admin Portal & Metrics (Protected route, summary statistics)
├── US-A02: Product Catalog CRUD (Add, edit, delete, toggle availability)
└── US-A03: Consultation Pipeline Management (Review submissions, update status)

================================================================================
COULD HAVE (Stretch Goals if Time Permits):
================================================================================
├── US-C05: Room Planner Collision Warning (Bounding box intersection highlight)
├── US-A04: Advanced Analytics Dashboard (Visual demand and category charts)
└── Export Room Plan / Design Board as downloadable PDF or PNG

================================================================================
WON'T HAVE (Strictly Out of Scope for 14-Day Delivery):
================================================================================
├── Full 3D WebGL / Three.js Room Simulation
├── Mobile Augmented Reality (AR) Camera Projection
├── AI-Powered Automated Room Layout Proposals
└── Live Financial Payment Gateway Transactions (Stripe / Razorpay)
```
