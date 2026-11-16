# Décora – Project Requirements Specification

**Document Version:** 1.0.0  
**Phase:** Phase 0 (Planning & Requirements Engineering)  
**Academic Subject:** Frontend Web Development  
**Target Platform:** Full-Stack Web Application (React.js, Node.js/Express.js, MongoDB)

---

## 1. System Vision & Purpose

Décora is an interactive interior design and furniture customization platform that bridges the gap between static design discovery, furniture catalog exploration, dynamic customization, and room spatial planning. Unlike traditional e-commerce catalogs that merely display static product listings, Décora empowers customers to visualize combinations, customize materials and finishes, calculate dynamic estimated costs, and arrange furniture in a 2D room planner before committing to design decisions or booking professional consultations.

---

## 2. User Roles & Access Control

| Role | Access Level | Description | Key Capabilities |
|---|---|---|---|
| **Guest** | Public | Unauthenticated prospective customer browsing the platform. | View homepage, browse inspirations, filter catalog, preview product details, test customization preview, submit consultation inquiries, register/login. |
| **Registered Customer** | Authenticated | Logged-in homeowner, student, or design enthusiast. | All Guest features plus: persist custom configurations, save & manage Wishlist, create multi-item Design Boards, build and save 2D Room Plans, manage personal profile. |
| **Administrator** | Role-Protected (`admin`) | Platform operator and catalog manager. | All Customer features plus: access administrative dashboard, manage products (CRUD), manage categories and inspiration collections, review and update status of consultation inquiries, monitor system statistics. |

---

## 3. Functional Requirements (FR)

### FR-01: Homepage & Navigation
- **FR-01.1:** Brand identity header with responsive navigation bar (Home, Inspiration, Catalog, Room Planner, Design Boards, Consultation, Auth/Profile).
- **FR-01.2:** Prominent Hero Section with evocative headline, secondary subtitle, and quick call-to-actions ("Explore Collections", "Plan Your Room").
- **FR-01.3:** Room Category Showcase (Living Room, Bedroom, Dining Room, Home Office) with visual cards.
- **FR-01.4:** Featured Furniture Carousel/Grid displaying trending items with live pricing and badges ("Popular", "Customizable").
- **FR-01.5:** Curated Interior Design Inspiration preview section linking directly to design stories.
- **FR-01.6:** Interactive Customizer Teaser highlighting real-time finish and fabric changes.
- **FR-01.7:** Customer testimonials and consultation booking callout banner.
- **FR-01.8:** Comprehensive footer with company manifesto, sitemap links, social channels, and copyright notice.

### FR-02: Interior Inspiration Module
- **FR-02.1:** Portfolio gallery of curated room designs with rich visual imagery.
- **FR-02.2:** Filter by Room Type (Living Room, Bedroom, Dining, Office) and Interior Style (Minimalist, Scandinavian, Japandi, Industrial, Mid-Century Modern, Bohemian).
- **FR-02.3:** Design detail view with high-resolution imagery, design concept description, color palette swatches, and designer notes.
- **FR-02.4:** Linked furniture products displayed directly under the room design ("Shop the Look") with one-click navigation to product pages.
- **FR-02.5:** Quick-save inspiration item to active user Design Board (for authenticated users).

### FR-03: Furniture Catalog & Discovery
- **FR-03.1:** Responsive grid displaying furniture cards with image, product title, category, starting price, and customization badges.
- **FR-03.2:** Category filtering (Seating, Tables, Storage, Lighting, Beds, Decor).
- **FR-03.3:** Multi-facet filters: Room type, Style, Material (Solid Oak, Walnut, Bouclé, Velvet, Matte Metal, Linen), and Price range slider.
- **FR-03.4:** Real-time text search querying product title, description, and tags.
- **FR-03.5:** Multi-criteria sorting: Price (Low to High, High to Low), Popularity / Featured, and Name (A–Z).
- **FR-03.6:** Stock status indicators ("In Stock", "Made to Order", "Low Stock").
- **FR-03.7:** Direct link to full product detail and instant wishlist toggle button.

### FR-04: Product Details Module
- **FR-04.1:** Multi-image gallery with thumbnail selection and zoom/focus capability.
- **FR-04.2:** Product metadata: Name, SKU, category, style, base price, and availability status.
- **FR-04.3:** Physical dimension breakdown (Width × Depth × Height in cm/inches) and weight.
- **FR-04.4:** Material, craftsmanship, and maintenance/care guidelines.
- **FR-04.5:** Interactive quick-entry button to launch the Furniture Customizer with current product.
- **FR-04.6:** "Add to Wishlist" and "Add to Design Board" action buttons.
- **FR-04.7:** Recommended / related products carousel based on matching room style and category.

### FR-05: Furniture Customization Module
- **FR-05.1:** Variant selection interface supporting configurable attributes:
  - Fabric / Upholstery (e.g., Cream Bouclé, Olive Velvet, Charcoal Linen, Cognac Leather).
  - Material / Wood Finish (e.g., Natural White Oak, Rich Walnut, Ebonized Ash, Matte Metal).
  - Hardware / Accent Finish (e.g., Brushed Brass, Matte Black, Polished Chrome).
  - Size variants (e.g., Standard, Compact, Extended).
- **FR-05.2:** Dynamic visual feedback updating the preview rendering or swatch highlights as options change.
- **FR-05.3:** Dynamic real-time price estimation formula updating based on premium material surcharges and size multipliers.
- **FR-05.4:** "Reset to Defaults" option returning configuration to base state.
- **FR-05.5:** "Save Configuration" allowing authenticated users to persist customized configurations to their account or export to Room Planner.

### FR-06: Wishlist Module
- **FR-06.1:** One-click add/remove toggle for catalog and detail views.
- **FR-06.2:** Wishlist view presenting all saved items with live stock, pricing, and direct "Customize" or "Add to Board" actions.
- **FR-06.3:** Immediate local state update with background MongoDB synchronization for authenticated sessions.
- **FR-06.4:** Clean empty-state prompt encouraging users to discover catalog items.

### FR-07: Design Boards Module
- **FR-07.1:** Create, rename, and delete multiple custom design boards (e.g., "Living Room Refresh 2026", "Master Bedroom Japandi").
- **FR-07.2:** Add furniture items (base or customized variants) and inspiration items to a board.
- **FR-07.3:** Custom notes per item (e.g., "Main sofa choice", "Alternative side table").
- **FR-07.4:** Dynamic cost aggregation calculating total estimated board expenditure.
- **FR-07.5:** Full persistence in MongoDB linked to user account.

### FR-08: 2D Room Planner Module
- **FR-08.1:** Room canvas setup: Define room dimensions (Width × Length in meters or feet) and room shape/type.
- **FR-08.2:** Interactive 2D top-down grid canvas rendered via HTML5 Canvas or SVG.
- **FR-08.3:** Furniture catalog palette sidebar with top-down furniture representations (Sofas, Armchairs, Coffee Tables, Rugs, Dining Sets, Desks, Beds).
- **FR-08.4:** Drag-and-drop placement of furniture items onto the room canvas.
- **FR-08.5:** Item manipulation: Select, move/drag, rotate (0°, 45°, 90°, 180°), duplicate, and delete.
- **FR-08.6:** Collision / Overlap detection with visual boundary warning indicators when items intersect.
- **FR-08.7:** Real-time room budget calculator tallying the combined cost of placed furniture.
- **FR-08.8:** Save room layout to user profile and reload saved layouts.

### FR-09: Authentication & Authorization Module
- **FR-09.1:** User registration with name, email, and secure password validation (minimum length, complexity).
- **FR-09.2:** User login issuing secure JSON Web Tokens (JWT) stored in safe client storage / cookies.
- **FR-09.3:** Password hashing using bcrypt on the server before storage.
- **FR-09.4:** Protected client routes redirecting unauthenticated users to login with return-to-page state.
- **FR-09.5:** Role-based middleware restricting access to administrative routes (`/admin/*`) strictly to users with role `admin`.
- **FR-09.6:** Session persistence: User remains logged in across browser refreshes until explicit logout or token expiry.

### FR-10: Interior Consultation Module
- **FR-10.1:** Multi-step consultation intake form collecting:
  - Client Full Name, Email, Phone Number, and Preferred Contact Method.
  - Room Type (Living Room, Bedroom, Full Home, Commercial Office).
  - Preferred Aesthetic Style (Minimalist, Scandinavian, Japandi, Industrial, etc.).
  - Budget Tier (< \$5,000, \$5,000–\$15,000, \$15,000–\$30,000, \$30,000+).
  - Room dimensions and project description / requirements notes.
- **FR-10.2:** Client-side validation preventing submission of incomplete or malformed contact data.
- **FR-10.3:** Consultation record persistence to MongoDB with initial status `New`.
- **FR-10.4:** Friendly confirmation page displaying submission summary and reference code.

### FR-11: Administration Module
- **FR-11.1:** Protected Administrative Dashboard accessible only to authenticated `admin` accounts.
- **FR-11.2:** Metrics overview: Total products, registered customers, active consultation requests, and category breakdown.
- **FR-11.3:** Product Catalog Management: Full CRUD operations (Add new product, edit existing product details, toggle in-stock status, delete product).
- **FR-11.4:** Category & Inspiration Management: Add and edit inspiration collections.
- **FR-11.5:** Consultation Management Pipeline: View incoming consultation submissions with status badge (`New`, `Contacted`, `In Progress`, `Completed`) and status update controls.

---

## 4. Non-Functional Requirements (NFR)

| ID | Category | Requirement Specification |
|---|---|---|
| **NFR-01** | **Performance** | Initial page load time < 2.5s on desktop broadband; lazy loading of catalog imagery; API response time < 200ms for database queries; smooth 60fps interaction on 2D canvas manipulations. |
| **NFR-02** | **Responsiveness** | Fluid responsive layouts supporting mobile (>=375px), tablet (>=768px), and desktop (>=1280px); zero horizontal scroll leakage; responsive navigation drawer for mobile screens. |
| **NFR-03** | **Usability** | Consistent warm aesthetic typography and color palette; immediate toast/notification feedback upon adding items to Wishlist or Boards; understandable error handling. |
| **NFR-04** | **Security** | Passwords hashed with bcrypt (salt rounds >= 10); JWT tokens signed with secure secret; all private endpoints verify user ownership (`userId` verification); validation on all incoming request bodies. |
| **NFR-05** | **Maintainability** | Clean React modular architecture with clear separation of components, hooks, services, and contexts; Node/Express structured with controller-service-route layers; ESLint/Prettier compliant syntax. |
| **NFR-06** | **Accessibility** | Semantic HTML5 structure (`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`); ARIA labels on icon-only buttons; WCAG AA compliant text contrast ratios on all backgrounds. |

---

## 5. Traceability Matrix

| Module | Requirements Addressed | User Roles | Primary Components / Endpoints |
|---|---|---|---|
| **Home & Navigation** | FR-01, NFR-02, NFR-06 | All Roles | `Navbar`, `Footer`, `Hero`, `FeaturedShowcase`, `HomePage.jsx` |
| **Inspiration Portfolio** | FR-02, NFR-01, NFR-02 | All Roles | `InspirationPage.jsx`, `InspirationDetailPage.jsx`, `/api/designs` |
| **Catalog & Discovery** | FR-03, FR-04, NFR-01, NFR-02 | All Roles | `CatalogPage.jsx`, `ProductDetailPage.jsx`, `FilterSidebar.jsx`, `/api/products` |
| **Furniture Customizer** | FR-05, NFR-01, NFR-03 | All Roles | `CustomizerPage.jsx`, `MaterialSelector.jsx`, `/api/customizations` |
| **Wishlist & Boards** | FR-06, FR-07, NFR-04 | Customer, Admin | `WishlistPage.jsx`, `DesignBoardsPage.jsx`, `/api/wishlist`, `/api/boards` |
| **2D Room Planner** | FR-08, NFR-01, NFR-03 | Customer, Admin | `RoomPlannerPage.jsx`, `RoomCanvas.jsx`, `/api/room-plans` |
| **Auth & Security** | FR-09, NFR-04 | All Roles | `LoginPage.jsx`, `RegisterPage.jsx`, `AuthContext.jsx`, `/api/auth` |
| **Consultation Intake** | FR-10, NFR-03 | All Roles | `ConsultationPage.jsx`, `/api/consultations` |
| **Admin Operations** | FR-11, NFR-04 | Admin | `AdminDashboard.jsx`, `AdminProducts.jsx`, `AdminConsultations.jsx`, `/api/admin` |
