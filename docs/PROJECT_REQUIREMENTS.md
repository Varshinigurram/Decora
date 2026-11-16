# Décora – Project Requirements Specification

**Document Version:** 1.2.0  
**Phase:** Phase 0 (Planning & Requirements Engineering)  
**Academic Subject:** Frontend Web Development (Primary Focus)  
**Target Platform:** Full-Stack Web Application (React + Vite, Express + Node.js, MongoDB + Mongoose)  
**Standardized Conventions:** Currency in INR (₹), Metric dimensions (cm / m), API prefix `/api/v1`

---

## 1. System Vision & Purpose

Décora is an interactive interior design and furniture customization platform connecting visual inspiration, catalog exploration, personalized customization, and room spatial planning.

Because this project is evaluated under **Frontend Web Development**, the platform emphasizes interactive frontend experiences: rich visual catalog exploration, dynamic customization with mathematical price calculations in Indian Rupees (₹), persistent moodboards, responsive consultation intake for both guests and customers, and a React-managed SVG 2D room planner.

---

## 2. Global Project Conventions

| Convention | Standard Adopted | Specification Details |
|---|---|---|
| **Currency** | **Indian Rupee (INR - ₹)** | Displayed across all catalog listings, customizer recalculations, design boards, and room budgets (formatted e.g. `₹24,999`). |
| **Measurement Units** | **Metric System** | Furniture dimensions in centimeters (cm: $W \times D \times H$); Room dimensions in meters ($m$ e.g., $4.5m \times 3.8m$). |
| **API Versioning** | **`/api/v1/*`** | Strict REST prefix for all backend endpoints. |
| **Frontend Stack** | **React + Vite** | Functional components, hooks, Tailwind CSS, Lucide React, Framer Motion. |
| **Backend Stack** | **Node.js + Express.js** | Modular MVC pattern, CORS with credentials, HTTP-only cookie parsing. |
| **Database** | **MongoDB + Mongoose** | Primary: MongoDB Atlas cloud cluster; Alternative: Local MongoDB (`mongodb://127.0.0.1:27017/decora`). |
| **Room Planner Engine** | **React-Managed SVG** | Declarative `<svg>` canvas with native DOM event handling and responsive vector scaling. |
| **Authentication** | **Secure HTTP-Only Cookies** | JWT issued inside `Set-Cookie` with `httpOnly: true`, `sameSite: 'lax'`, and ownership verification middleware. |

---

## 3. User Roles & Access Control

| Role | Access Level | Description | Key Capabilities & Permissions |
|---|---|---|---|
| **Guest** | Public | Unauthenticated prospective customer browsing the platform. | View homepage, explore inspirations, filter catalog, view product details, test customization preview, **submit consultation requests (by entering contact details)**, register account, log in. |
| **Registered Customer** | Authenticated | Logged-in homeowner or interior enthusiast. | All Guest features plus: persist custom configurations, save & manage Wishlist, create multi-item Design Boards, build and save 2D Room Plans, **submit consultation requests linked to account (with pre-filled contact details)**, manage personal profile, log out. |
| **Administrator** | Role-Protected (`role: 'admin'`) | Platform catalog manager. | All Customer features plus: access `/admin` dashboard, manage product records (CRUD), **review all incoming consultation submissions and update their status (`New`, `Contacted`, `In Progress`, `Completed`)**, view platform summary metrics. |

---

## 4. Functional Requirements (FR)

### FR-01: Homepage & Navigation (Must Have)
- **FR-01.1:** Brand identity header with responsive navigation bar (Home, Inspiration, Catalog, Customizer, Room Planner, Design Boards, Consultation, Auth/Profile).
- **FR-01.2:** Hero section with evocative interior design typography, secondary subtitle, and quick call-to-actions ("Explore Collections", "Customize Furniture").
- **FR-01.3:** Room Category Showcase (Living Room, Bedroom, Dining Room, Home Office) with curated imagery.
- **FR-01.4:** Featured Furniture showcase displaying trending pieces with live INR pricing (₹) and customization tags.
- **FR-01.5:** Curated Interior Design Inspiration preview linking directly to design concepts.
- **FR-01.6:** Interactive Customizer teaser highlighting real-time finish and fabric adjustments.
- **FR-01.7:** Customer testimonials and consultation booking callout banner.
- **FR-01.8:** Responsive footer with sitemap links, design philosophy, and academic project notices.

### FR-02: Interior Inspiration Module (Must Have)
- **FR-02.1:** Curated portfolio gallery categorized by Room Type (Living Room, Bedroom, Dining, Office) and Interior Style (Minimalist, Scandinavian, Japandi, Industrial, Mid-Century Modern, Bohemian).
- **FR-02.2:** Detail view displaying high-resolution room photography, design concept narrative, and color palette swatches.
- **FR-02.3:** "Shop the Look" section directly linking to matching furniture products in the catalog with one-click navigation.
- **FR-02.4:** Quick-save inspiration item to active user Design Board (for authenticated users).

### FR-03: Furniture Catalog & Discovery (Must Have)
- **FR-03.1:** Responsive grid displaying furniture cards with product title, category, starting price in INR (₹), and customization tags.
- **FR-03.2:** Category filtering (Seating, Tables, Storage, Lighting, Beds, Decor).
- **FR-03.3:** Multi-facet filters: Room type, Style, Material, and Price range slider (in ₹).
- **FR-03.4:** Real-time search querying product title, description, and keywords.
- **FR-03.5:** Multi-criteria sorting: Price (Low to High, High to Low), Popularity / Featured, and Name (A–Z).
- **FR-03.6:** Availability indicators ("In Stock", "Made to Order", "Low Stock").
- **FR-03.7:** Direct link to full product detail and instant wishlist toggle button.

### FR-04: Product Details Module (Must Have)
- **FR-04.1:** Multi-image gallery with thumbnail selection and zoom/focus capability.
- **FR-04.2:** Metadata: Name, SKU, category, style, base price in INR (₹), and availability status.
- **FR-04.3:** Physical dimension breakdown in centimeters ($W \times D \times H\text{ cm}$) and product weight ($kg$).
- **FR-04.4:** Material specification, sustainability notes, and maintenance instructions.
- **FR-04.5:** Direct "Customize This Piece" action navigating into the Customizer with current product loaded.
- **FR-04.6:** "Add to Wishlist" and "Add to Design Board" action buttons.
- **FR-04.7:** Recommended / related products carousel based on matching room style and category.

### FR-05: Furniture Customization Module (Must Have)
- **FR-05.1:** Variant configuration interface supporting valid options:
  - Upholstery / Fabric (e.g., Cream Bouclé, Olive Velvet, Charcoal Linen, Cognac Leather).
  - Wood & Material Finish (e.g., Natural White Oak, Rich Walnut, Ebonized Ash, Matte Black Metal).
  - Hardware Accents (e.g., Brushed Brass, Matte Black, Polished Chrome).
  - Dimension Scale (e.g., Standard, Compact, Extended).
- **FR-05.2 (Valid Option Combinations):** Enforces compatible option pairs; incompatible variants are disabled with explanatory tooltips.
- **FR-05.3 (Authentic Variant Assets):** Displays genuine high-resolution material/fabric swatches and synchronized visual overlays. Unrelated furniture photos are never used as variants.
- **FR-05.4 (Dynamic Price Updates):** Instant mathematical recalculation in INR (₹) using the additive model:
  $$\text{Final Price (₹)} = \text{Base Price} + \Delta\text{Fabric} + \Delta\text{Finish} + \Delta\text{Size}$$
- **FR-05.5 (Reset Behavior):** "Reset to Defaults" option restores base configuration, initial dimensions, and starting price.
- **FR-05.6 (Configuration Retention):** Active configuration is preserved across view navigation in state, and persists to `/api/v1/customizations` for authenticated users.

### FR-06: Wishlist Module (Must Have)
- **FR-06.1:** One-click add/remove toggle for catalog and detail views.
- **FR-06.2:** Wishlist view displaying saved products with live stock, INR pricing, and direct "Customize" actions.
- **FR-06.3:** Immediate local state update synchronized with MongoDB `/api/v1/wishlist` for authenticated users.

### FR-07: Design Boards Module (Must Have)
- **FR-07.1:** Create, rename, and delete multiple custom design boards (e.g., "Living Room Japandi 2026").
- **FR-07.2:** Add furniture items (base or customized variants) and inspiration items to a board.
- **FR-07.3:** Custom notes per item (e.g., "Accent armchair choice").
- **FR-07.4:** Dynamic cost aggregation calculating total estimated board expenditure in INR (₹).
- **FR-07.5:** Full persistence in MongoDB linked to user account.

### FR-08: 2D Room Planner Module (Should Have)
- **FR-08.1:** Room canvas setup: Define room dimensions in meters ($L \times W\text{ m}$) and select room type.
- **FR-08.2:** Declarative React-managed SVG canvas with top-down architectural grid.
- **FR-08.3:** Furniture catalog sidebar palette with top-down vector representations (Sofas, Armchairs, Tables, Beds, Desks).
- **FR-08.4:** Drag-and-drop placement of furniture items onto the SVG room canvas.
- **FR-08.5:** Item manipulation: Move, rotate in 45°/90° steps, and remove items.
- **FR-08.6:** Live room budget counter summing the combined cost of placed furniture in INR (₹).
- **FR-08.7:** Save room layout coordinates to MongoDB `/api/v1/room-plans` and reload saved layouts.
- **FR-08.8 (Could Have - Non-Mandatory):** Bounding-box collision detection highlighting overlapping items with visual warning borders.

### FR-09: Authentication & Authorization (Must Have)
- **FR-09.1 (Account Registration):** User registration with name, email, and password validation (min 6 chars, alphanumeric). Hashes passwords with bcrypt (salt rounds >= 10).
- **FR-09.2 (Customer & Admin Login):** Issues JWT inside secure, HTTP-only, SameSite cookies (`jwt` cookie, not in `localStorage`). Descriptive, secure error messages.
- **FR-09.3 (User Logout):** Invalidation/clearing of the HTTP-only cookie (`/api/v1/auth/logout`) and immediate client state reset.
- **FR-09.4 (Route Protection):** Protected client route wrappers (`<ProtectedRoute>`, `<AdminRoute>`) redirecting unauthenticated users to `/login`.
- **FR-09.5 (Role-Based Access):** Express middleware verifying `req.user.role === 'admin'` on all `/api/v1/admin/*` endpoints.
- **FR-09.6 (Ownership Verification):** Checks ensuring customers can access/modify only their own wishlists, boards, and customizations.

### FR-10: Interior Consultation Module (Must Have)
- **FR-10.1 (Guest Access):** Unauthenticated guest users can submit consultation requests by providing Full Name, Email, Phone Number, Room Type, Style, INR Budget Tier, Metric Dimensions, and Notes.
- **FR-10.2 (Customer Association):** Authenticated customers have their contact details pre-filled and their consultation request linked to their account (`userId`).
- **FR-10.3 (Input Validation & Storage):** Validates required contact and dimension data; persists to MongoDB `/api/v1/consultations` with initial status `New`.
- **FR-10.4 (Confirmation Feedback):** Returns a confirmation screen displaying a unique reference code.

### FR-11: Administration Module (Should Have)
- **FR-11.1:** Protected Administrative Dashboard accessible only to users with role `admin`.
- **FR-11.2:** Basic application statistics (total catalog products, registered users, pending consultations).
- **FR-11.3 (Product CRUD):** Full CRUD operations for furniture items (add, edit, delete, toggle in-stock flag).
- **FR-11.4 (Consultation Pipeline):** Review all incoming consultation requests (from both guests and customers) and update pipeline status (`New` $\rightarrow$ `Contacted` $\rightarrow$ `In Progress` $\rightarrow$ `Completed`).
- **FR-11.5 (Could Have):** Advanced sales/engagement analytics and category popularity graphs.

---

## 5. Non-Functional Requirements (NFR)

| ID | Category | Requirement Specification |
|---|---|---|
| **NFR-01** | **Performance** | Initial load time < 2.5s; lazy loading of catalog images; smooth 60fps interaction on SVG drag and drop operations. |
| **NFR-02** | **Responsiveness** | Fluid responsive layouts supporting mobile (>=375px), tablet (>=768px), and desktop (>=1280px); zero horizontal scroll overflow. |
| **NFR-03** | **Usability** | Cohesive warm interior aesthetic (linens, warm creams, rich walnuts); clear feedback toast alerts for user interactions. |
| **NFR-04** | **Security** | Passwords hashed with bcrypt; JWT stored strictly in HTTP-only cookies; CORS configured with explicit origin (`http://localhost:5173`) and `credentials: true`; validation on all API payloads. |
| **NFR-05** | **Maintainability** | Clean React modular architecture; central asset mapping registry (`furnitureMapping.js`); clear separation between presentation and state. |
| **NFR-06** | **Accessibility** | Semantic HTML5 elements (`<header>`, `<main>`, `<nav>`, `<section>`); ARIA labels on interactive SVG elements and buttons; WCAG AA text contrast. |

---

## 6. Traceability Matrix

| Module | Requirements Addressed | User Stories Addressed | User Roles | Primary Components / Endpoints | Priority |
|---|---|---|---|---|---|
| **Authentication & Profile** | FR-09.1–09.6 | US-AUTH-01, US-AUTH-02, US-AUTH-03 | All Roles | `LoginPage.jsx`, `RegisterPage.jsx`, `AuthContext.jsx`, `/api/v1/auth` | **Must Have** |
| **Home & Navigation** | FR-01, NFR-02, NFR-06 | US-G01 | All Roles | `Navbar`, `Footer`, `Hero`, `FeaturedShowcase`, `HomePage.jsx` | **Must Have** |
| **Inspiration Portfolio** | FR-02, NFR-01, NFR-02 | US-G02 | All Roles | `InspirationPage.jsx`, `InspirationDetailPage.jsx`, `/api/v1/designs` | **Must Have** |
| **Catalog & Discovery** | FR-03, FR-04, NFR-01 | US-G03, US-G04 | All Roles | `CatalogPage.jsx`, `ProductDetailPage.jsx`, `FilterSidebar.jsx`, `/api/v1/products` | **Must Have** |
| **Furniture Customizer** | FR-05.1–05.6 | US-CUST-01 | All Roles | `CustomizerPage.jsx`, `MaterialSelector.jsx`, `/api/v1/customizations` | **Must Have** |
| **Wishlist & Boards** | FR-06, FR-07 | US-WISH-01, US-BOARD-01 | Customer, Admin | `WishlistPage.jsx`, `DesignBoardsPage.jsx`, `/api/v1/wishlist`, `/api/v1/boards` | **Must Have** |
| **Consultation Intake** | FR-10.1–10.4 | US-CONS-01, US-CONS-02 | Guest, Customer | `ConsultationPage.jsx`, `/api/v1/consultations` | **Must Have** |
| **2D Room Planner (SVG)** | FR-08.1–08.7 | US-PLAN-01 | Customer, Admin | `RoomPlannerPage.jsx`, `SvgRoomCanvas.jsx`, `/api/v1/room-plans` | **Should Have** |
| **Admin Product Management** | FR-11.1–11.3 | US-ADM-01, US-ADM-02 | Admin | `AdminDashboard.jsx`, `AdminProducts.jsx`, `/api/v1/admin/products` | **Should Have** |
| **Consultation Status Mgmt** | FR-11.4 | US-ADM-03 | Admin | `AdminConsultations.jsx`, `/api/v1/admin/consultations` | **Should Have** |
| **Collision Detection** | FR-08.8 | US-PLAN-02 | Customer, Admin | `SvgRoomCanvas.jsx` collision overlay helper | **Could Have** |
| **Advanced Analytics** | FR-11.5 | US-ADM-04 | Admin | `AdminAnalytics.jsx` | **Could Have** |
