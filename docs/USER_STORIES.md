# Décora – User Stories & Acceptance Criteria

**Document Version:** 1.0.0  
**Phase:** Phase 0 (Planning & Requirements Engineering)  
**Methodology:** Agile / User-Centric Requirements Decomposition  
**Prioritization:** MoSCoW (Must Have, Should Have, Could Have, Won't Have)

---

## 1. Overview
This document translates the functional requirements of Décora into concrete, testable user stories with explicit acceptance criteria. Every story follows the industry standard syntax:
$$\text{As a } [role], \text{ I want to } [action], \text{ so that } [benefit].$$

---

## 2. Guest User Stories

### US-G01: Homepage Brand Discovery
- **User Story:** As a **Guest**, I want to view an inviting landing page with brand highlights, room categories, and featured collections, so that I can immediately understand Décora's offerings and interior styles.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Hero section displays an engaging headline, description, and primary CTA ("Explore Catalog").
  - Category showcase displays at least 4 room types (Living Room, Bedroom, Dining, Home Office) with high-res thumbnails.
  - Featured furniture section displays trending products with prices and customization badges.
  - Testimonial and consultation booking teasers are visible.
  - The page is fully responsive without horizontal overflow on mobile viewports (>=375px).

### US-G02: Interior Inspiration Exploration
- **User Story:** As a **Guest**, I want to browse curated interior design rooms and filter by style and room type, so that I can discover visual inspiration for my home renovation.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Filter chips or tabs allow filtering by style (Minimalist, Scandinavian, Japandi, Industrial) and room type.
  - Clicking an inspiration card opens the detailed view showing the designer's concept and color palette.
  - The inspiration view lists "Shop the Look" furniture products associated with the design.
  - Unauthenticated users clicking "Save to Board" are prompted to log in or register.

### US-G03: Furniture Catalog Filtering & Search
- **User Story:** As a **Guest**, I want to search and filter furniture by category, room, material, and price range, so that I can quickly find items fitting my taste and budget.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Search bar filters product cards in real time as user types.
  - Price range slider dynamically updates minimum and maximum budget bounds.
  - Material filter multi-select works in combination with category filter.
  - Sort dropdown correctly re-orders products by "Price: Low to High", "Price: High to Low", and "Popularity".
  - Empty search state displays an informative message and a "Reset Filters" action.

### US-G04: Product Detail Examination
- **User Story:** As a **Guest**, I want to view detailed product specifications, materials, and dimensional dimensions, so that I can assess whether a piece fits my room physically and aesthetically.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Main gallery allows toggling between at least 2 distinct product angles/images.
  - Clear specification table displays Width, Depth, Height, Weight, and Materials.
  - Prominent "Customize This Piece" button navigates to the customizer with this product pre-selected.
  - Stock status (e.g., "In Stock" or "Made to Order") is clearly labeled.

### US-G05: Interactive Customization Preview
- **User Story:** As a **Guest**, I want to test different upholstery fabrics, wood finishes, and hardware options, so that I can see how customizations affect the visual look and estimated price.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Interactive fabric swatches and wood finishes update the visual preview dynamically.
  - Dynamic price display recalculates immediately upon choosing premium materials or modified sizes.
  - "Reset" button restores base configuration and default price.
  - Attempting to "Save Configuration" triggers an authentication modal or redirects to login.

### US-G06: Account Registration & Login
- **User Story:** As a **Guest**, I want to create a secure personal account with my email and password, so that I can save my customizations, wishlist items, and room layouts.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Registration form validates email format and password strength (minimum 6 characters).
  - Validation errors appear inline for duplicate emails or empty fields.
  - Successful registration automatically logs in the user and redirects to the intended page.
  - Passwords are encrypted before storage in MongoDB.

---

## 3. Registered Customer User Stories

### US-C01: Wishlist Persistence & Management
- **User Story:** As a **Customer**, I want to save favorite furniture items to a personal wishlist, so that I can review and compare them later across multiple devices.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Heart icon on product cards toggles saved state instantly.
  - Dedicated Wishlist page lists all saved products with thumbnail, title, price, and stock status.
  - Clicking "Remove" removes the product from the user's wishlist in MongoDB.
  - Products in the wishlist include direct links to "Customize" or "View Details".

### US-C02: Saving Custom Configurations
- **User Story:** As a **Customer**, I want to save my personalized furniture configurations to my account, so that I don't lose my material choices and price estimations.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Logged-in user can click "Save Configuration" on the Customizer.
  - Saved configuration persists in the `Customizations` collection with selected material, finish, dimensions, and calculated price.
  - Confirmation alert confirms successful save and provides a link to view in Design Boards or Room Planner.

### US-C03: Personal Design Boards Creation
- **User Story:** As a **Customer**, I want to organize furniture and inspiration items into named design boards, so that I can plan specific rooms and see the total combined budget.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Customer can create multiple named boards (e.g., "Living Room Makeover").
  - Items can be added to a chosen board directly from the catalog or customizer.
  - Board details view shows all grouped items and calculates the total estimated cost.
  - Items can be removed from a board, and boards can be deleted.

### US-C04: 2D Room Planner Layout
- **User Story:** As a **Customer**, I want to place furniture onto a 2D top-down room floor plan with defined dimensions, so that I can verify spatial fit and avoid overcrowded layouts.
- **Priority:** **Must Have (MVP: Top-Down Canvas with Drag, Drop, Rotate & Collision Indicator)**
- **Acceptance Criteria:**
  - User can set room dimensions (e.g., 4m × 5m).
  - Furniture items can be dragged from a catalog palette onto the room canvas.
  - Placed furniture can be repositioned, rotated in 45° or 90° increments, and deleted.
  - Overlap / collision indicator highlights in amber or red when two pieces intersect.
  - Canvas displays live aggregated cost of all placed items.
  - "Save Room Plan" persists the layout coordinates and room settings to MongoDB.

### US-C05: Design Consultation Request Submission
- **User Story:** As a **Customer**, I want to submit a formal interior design consultation request with my room dimensions, style preferences, and budget, so that an interior designer can review my project.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Form captures Contact Info, Room Type, Preferred Style, Budget Tier, and Notes.
  - Successful submission displays a unique confirmation reference.
  - Request is stored in the database with status `New`.

---

## 4. Administrator User Stories

### US-A01: Administrative Authentication & Dashboard Metrics
- **User Story:** As an **Administrator**, I want to log into a protected management portal to review key platform metrics, so that I can monitor platform activity and catalog volume.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Admin login requires credentials with `role: "admin"`. Non-admin accounts attempting access receive an HTTP 403 Forbidden or redirection.
  - Dashboard summarizes total products, categories, registered users, and pending consultations.

### US-A02: Product Catalog Management (CRUD)
- **User Story:** As an **Administrator**, I want to add, update, and remove furniture items, so that the online catalog remains current and accurate.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Product creation form allows entering Title, Description, Category, Style, Base Price, Dimensions, and Image URLs.
  - Edit modal updates existing product fields and reflects changes immediately in the customer catalog.
  - Delete action includes confirmation prompt to prevent accidental removals.
  - In-stock toggle updates product availability flag.

### US-A03: Consultation Pipeline Review
- **User Story:** As an **Administrator**, I want to view submitted consultation requests and update their processing status, so that customer inquiries are handled systematically.
- **Priority:** **Must Have**
- **Acceptance Criteria:**
  - Filterable table lists all consultation requests with submitter name, room type, budget, date, and current status.
  - Admin can update status (`New`, `Contacted`, `In Progress`, `Completed`).
  - Status updates persist in MongoDB immediately.

---

## 5. Summary Priority Classification (MoSCoW)

```text
MUST HAVE (Core MVP - 14-Day Academic Scope):
├── FR-01: Responsive Home, Navigation, and Footer
├── FR-02: Curated Inspiration Gallery with Style Filtering
├── FR-03: Furniture Catalog with Search, Category Filter, and Price Sort
├── FR-04: Product Detail Pages with Specifications and Dimensions
├── FR-05: Interactive Furniture Customizer with Dynamic Price Calculation
├── FR-06: Customer Wishlist with MongoDB Persistence
├── FR-07: Design Boards with Cost Aggregation
├── FR-08: 2D Room Planner (Top-Down Canvas, Drag/Rotate, Collision Warning, Save Layout)
├── FR-09: JWT Authentication with Customer and Admin Role Guards
├── FR-10: Multi-Step Design Consultation Intake Form
└── FR-11: Admin Dashboard with Product CRUD and Consultation Status Pipeline

SHOULD HAVE (Enhanced Polish):
├── Toast Notifications for user actions (Save, Wishlist, Delete)
├── Filter combination reset buttons and empty-state placeholders
└── Seed data generator script with rich demo records

COULD HAVE (Post-MVP Stretch Goals):
├── Export Room Plan layout as downloadable PNG image
└── Image file upload integration (Cloudinary / Multer)

WON'T HAVE (Strictly Out of Scope for 14-Day Delivery):
├── Full 3D room rendering (WebGL / Three.js)
├── Augmented Reality (AR) mobile camera placement
├── AI-generated automatic interior room layouts
└── Live payment gateway processing (Stripe / PayPal)
```
