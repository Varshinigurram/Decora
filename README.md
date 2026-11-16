# Décora – Interior Design & Furniture Customization Platform

> **Academic Subject:** Frontend Web Development (Primary Focus)  
> **Tech Stack:** React.js, Vite, Tailwind CSS, Lucide React, Framer Motion | Node.js, Express.js | MongoDB, Mongoose  
> **Standardized Conventions:** Currency in INR (₹), Metric units (cm / m), API prefix `/api/v1`  
> **Version:** 1.1.0

---

## 🌟 Executive Overview
**Décora** is a full-stack modern interior design and furniture customization platform. Built with an academic focus on **Frontend Web Development**, Décora connects visual inspiration directly with interactive furniture configuration, dynamic price calculation in Indian Rupees (₹), personal design boards, and a responsive React-managed SVG 2D room planner.

---

## 🏗️ Architecture & Modules

### 1. Customer-Facing Discovery (Must Have)
- **Hero & Landing Experience (`FR-01`):** Brand storytelling, featured room collections, trending furniture with INR (₹) pricing, interactive customizer teaser, customer testimonials, and consultation booking.
- **Interior Design Inspiration (`FR-02`):** Curated design portfolios categorized by style (Minimalist, Scandinavian, Japandi, Industrial, Mid-Century Modern, Bohemian) and room type (Living Room, Bedroom, Home Office, Dining) with "Shop the Look" deep links.
- **Furniture Catalog (`FR-03`):** Product filtering (room, category, style, price bracket in ₹, material), real-time search, multi-criteria sorting, and availability indicators.
- **Product Details (`FR-04`):** Multi-image gallery, metric dimensions ($W \times D \times H\text{ cm}$), materials, care guides, related items, and direct links to the customizer.

### 2. Interactive & Personalization Engine
- **Furniture Customizer (`FR-05 - Must Have`):** Interactive visual customizer supporting valid option combinations, authentic high-res material/wood swatches with coordinated SVG/CSS overlays (no unrelated photos), dynamic real-time price estimation formula in INR (₹), reset behavior, and configuration retention.
- **Wishlist Management (`FR-06 - Must Have`):** Instant saving and syncing of favorite items with MongoDB persistence for authenticated users.
- **Design Boards (`FR-07 - Must Have`):** Moodboards pairing furniture and inspiration photos with aggregated budget estimates in INR (₹).
- **Interactive 2D Room Planner (`FR-08 - Should Have`):** React-managed SVG canvas with custom metric room dimensions, palette drag-and-drop, 45°/90° rotation controls, live room budget counter, and optional collision warnings (`Could Have`).

### 3. Consultation & User Services (Must Have)
- **Design Consultation Request (`FR-10 - Must Have`):** Multi-step consultation questionnaire accessible to both **Guests** (captures full contact info) and **Registered Customers** (auto pre-filled and linked to user account), collecting metric room dimensions, INR budget tiers, and design style notes.
- **User Authentication & Profiles (`FR-09 - Must Have`):** Explicit registration, login, and logout flows via secure HTTP-only cookies containing JWT tokens, bcrypt password hashing, input validation, role-based access control (`guest`, `customer`, `admin`), and resource ownership verification.

### 4. Administrative Control Panel (`FR-11 - Should Have`)
- **Metrics & Overview:** Catalog counts, active consultation requests, and registered users.
- **Product Management:** Full CRUD operations for furniture items, materials, variants, and base pricing in INR.
- **Consultation Pipeline:** Dedicated pipeline for administrators to review all incoming consultation submissions (guest and customer) and update status (`New` $\rightarrow$ `Contacted` $\rightarrow$ `In Progress` $\rightarrow$ `Completed`).

---

## 📂 Proposed Repository Structure

```text
Decora/
├── client/                     # Frontend Application (React + Vite + Tailwind CSS)
│   ├── public/                 # Static assets, icons, bundled local SVG placeholders
│   ├── src/
│   │   ├── assets/             # Images, svgs, central furnitureMapping.js registry
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Button, Input, Modal, Dropdown, Badge, Toast
│   │   │   ├── layout/         # Navbar, Footer, MobileDrawer, AdminLayout
│   │   │   ├── home/           # Hero, RoomCategories, FeaturedShowcase, Testimonials
│   │   │   ├── catalog/        # ProductCard, FilterSidebar, SearchBar, SortDropdown
│   │   │   ├── customizer/     # CustomizerViewer, MaterialSelector, PriceCalculator
│   │   │   ├── planner/        # SvgRoomCanvas, FurniturePalette, DimensionControls
│   │   │   ├── boards/         # BoardCard, BoardCanvas, ItemPickerModal
│   │   │   └── admin/          # AdminHeader, AdminStats, DataTable, ProductFormModal
│   │   ├── context/            # AuthContext, WishlistContext, BoardContext
│   │   ├── hooks/              # useAuth, useProducts, useDebounce, useSvgCanvas
│   │   ├── pages/              # Route views
│   │   │   ├── HomePage.jsx
│   │   │   ├── CatalogPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CustomizerPage.jsx
│   │   │   ├── InspirationPage.jsx
│   │   │   ├── InspirationDetailPage.jsx
│   │   │   ├── RoomPlannerPage.jsx
│   │   │   ├── DesignBoardsPage.jsx
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── ConsultationPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       └── AdminConsultations.jsx
│   │   ├── services/           # Axios API client (withCredentials: true)
│   │   ├── utils/              # Price formatters (INR), dimension helpers, constants
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend API (Node.js + Express.js + Mongoose)
│   ├── src/
│   │   ├── config/             # MongoDB Atlas / local connection, env settings
│   │   ├── controllers/        # Request handlers (auth, products, designs, boards, planner)
│   │   ├── middleware/         # Auth verification (HTTP-only cookie), admin role check
│   │   ├── models/             # Mongoose schemas:
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Category.js
│   │   │   ├── RoomDesign.js
│   │   │   ├── Customization.js
│   │   │   ├── DesignBoard.js
│   │   │   ├── RoomPlan.js
│   │   │   ├── Consultation.js
│   │   │   └── Wishlist.js
│   │   ├── routes/             # RESTful API route definitions (/api/v1/*)
│   │   ├── seeds/              # Realistic Indian interior seed data & demo accounts
│   │   └── server.js           # Express app initialization (CORS with credentials)
│   ├── .env.example
│   └── package.json
│
├── docs/                       # Project Documentation
│   ├── PROJECT_REQUIREMENTS.md # Formal requirements specification (FR-01 to FR-11, NFRs)
│   ├── USER_STORIES.md         # User stories & MoSCoW prioritization
│   ├── DEVELOPMENT_PLAN.md     # 14-day frontend-first milestone schedule
│   └── RISK_REGISTER.md        # Risk analysis & architecture protocols
│
└── README.md
```

---

## 🗄️ Standardized REST API Endpoints (`/api/v1`)

- `/api/v1/auth` – User registration, login, logout, current session (`me`) via HTTP-only cookies
- `/api/v1/products` – Catalog browsing, category & material filtering, search, sorting
- `/api/v1/categories` – Room categories and taxonomy
- `/api/v1/designs` – Interior inspiration portfolios and "Shop the Look" metadata
- `/api/v1/customizations` – Saved custom furniture configurations
- `/api/v1/wishlist` – Authenticated user wishlist items
- `/api/v1/boards` – User design boards and aggregated budget calculations
- `/api/v1/room-plans` – 2D room layouts, dimensions, and item coordinates
- `/api/v1/consultations` – Consultation intake form submission
- `/api/v1/admin` – Protected administrative operations (product CRUD, consultation status)

---

## 📅 14-Day Development Schedule (Frontend-First)

| Phase | Days | Focus & Milestones | Primary Deliverable |
|---|---|---|---|
| **Phase 0** | Day 1 | Planning, Requirements, User Stories, Risk Register | Approved Documentation in `/docs` |
| **Phase 1** | Day 2 | Competitor Research & Gap Analysis | UX benchmarking & journey map |
| **Phase 2** | Days 3–4 | UI/UX Design System & Asset Preparation | Design tokens & central image mapping |
| **Phase 3** | Day 5 | React Foundation & Tailwind Scaffolding | Vite + React structure & base UI components |
| **Phase 3** | Days 6–7 | Core Pages: Homepage, Catalog & Details | Responsive Home, Catalog, Filters & Specs |
| **Phase 4** | Days 8–10 | Interactive Features: Inspiration, Customizer & Room Planner | Visual Customizer & React-managed SVG Planner |
| **Phase 5** | Days 11–12 | Backend Integration: Express, Atlas & HTTP-Only Auth | `/api/v1` REST services & state synchronization |
| **Phase 6** | Days 13–14 | Admin Portal, Testing & Final Academic Submission | Admin controls, cross-device polish & demo |
