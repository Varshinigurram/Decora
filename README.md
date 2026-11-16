# Décora – Interior Design & Furniture Customization Platform

> **Academic Subject:** Frontend Web Development  
> **Tech Stack:** React.js, Tailwind CSS, Lucide React, Framer Motion | Node.js, Express.js | MongoDB, Mongoose  
> **Development Environment:** Google Antigravity (Windows)  
> **Version:** 1.0.0

---

## 🌟 Executive Overview
**Décora** is a full-stack modern interior design and furniture customization platform. Unlike traditional static furniture catalogs, Décora connects visual inspiration directly with interactive furniture configuration, dynamic price calculation, personal design boards, and a responsive 2D room planning canvas.

---

## 🏗️ Architecture & Modules

### 1. Customer-Facing Discovery
- **Hero & Landing Experience (`FR-01`):** Brand storytelling, featured room collections, trending furniture, interactive customizer teaser, customer testimonials, and consultation booking.
- **Interior Design Inspiration (`FR-02`):** Curated design portfolios categorized by style (Minimalist, Scandinavian, Japandi, Industrial, Mid-Century Modern, Bohemian) and room type (Living Room, Bedroom, Home Office, Dining).
- **Furniture Catalog (`FR-03`):** Product filtering (room, category, style, price bracket, material), real-time search, multi-criteria sorting, and stock status indicators.
- **Product Details (`FR-04`):** High-res galleries, dimensions, materials, care guides, related items, and deep links to customizer and design boards.

### 2. Interactive & Personalization Engine
- **Furniture Customizer (`FR-05`):** Interactive visual customizer allowing users to tweak finishes (walnut, oak, matte black, brushed brass), fabrics (bouclé, velvet, performance linen, leather), dimensions, and configurations with dynamic real-time price estimation.
- **Wishlist Management (`FR-06`):** Instant saving and syncing of favorite items with MongoDB persistence for authenticated users.
- **Design Boards (`FR-07`):** Moodboards pairing furniture, swatches, and inspiration photos with aggregated budget estimates.
- **Interactive 2D Room Planner (`FR-08`):** Drag-and-drop 2D room canvas with custom room dimensions, furniture placement, rotation controls, collision/overlap visual indicators, and room budget computation.

### 3. Consultation & User Services
- **Design Consultation Request (`FR-10`):** Multi-step consultation intake form collecting room type, budget tier, aesthetic preferences, room dimensions, and contact info.
- **User Authentication & Profiles (`FR-09`):** JWT-based secure auth, role-based access control (`guest`, `customer`, `admin`), and profile preferences.

### 4. Administrative Control Panel (`FR-11`)
- **Metrics & Overview:** Catalog counts, active consultation requests, popular categories, and registered users.
- **Product & Category Management:** Full CRUD operations for furniture items, materials, variants, and base pricing.
- **Inspiration Portfolio Management:** Upload and tag curated room aesthetics.
- **Consultation Pipeline:** Track incoming consultation requests from "New" to "Contacted", "In Progress", and "Completed".

---

## 📂 Proposed Repository Structure

```text
Decora/
├── client/                     # Frontend Application (React + Vite + Tailwind CSS)
│   ├── public/                 # Static assets, icons, furniture models/textures
│   ├── src/
│   │   ├── assets/             # Images, styles, svgs
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Button, Input, Modal, Dropdown, Badge, Loader
│   │   │   ├── layout/         # Navbar, Footer, Sidebar, AdminLayout
│   │   │   ├── home/           # Hero, RoomCategories, FeaturedShowcase, Testimonials
│   │   │   ├── catalog/        # ProductCard, FilterSidebar, SearchBar, SortDropdown
│   │   │   ├── customizer/     # CustomizerViewer, MaterialSelector, PriceCalculator
│   │   │   ├── planner/        # RoomCanvas, FurniturePalette, DimensionControls
│   │   │   ├── boards/         # BoardCard, BoardCanvas, ItemPickerModal
│   │   │   └── admin/          # AdminHeader, AdminStats, DataTable, ProductFormModal
│   │   ├── context/            # AuthContext, WishlistContext, Cart/BoardContext
│   │   ├── hooks/              # useAuth, useProducts, useDebounce, useRoomCanvas
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
│   │   ├── services/           # Axios API instances & API endpoints
│   │   ├── utils/              # Formatters, price calculation helpers, constants
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend API (Node.js + Express.js + Mongoose)
│   ├── src/
│   │   ├── config/             # DB connection, environment settings
│   │   ├── controllers/        # Request handlers (auth, products, designs, boards, planner)
│   │   ├── middleware/         # Auth verification, admin check, error handler
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
│   │   ├── routes/             # RESTful API route definitions
│   │   ├── seeds/              # Rich realistic sample furniture, styles, and demo users
│   │   └── server.js           # Express app initialization
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🗄️ Database Schemas (Mongoose)

1. **User:** `name`, `email`, `passwordHash`, `role` (`customer` | `admin`), `avatar`, `createdAt`
2. **Product:** `name`, `category`, `roomType`, `style`, `basePrice`, `dimensions` (`width`, `depth`, `height`), `thumbnail`, `images`, `availableMaterials`, `availableColors`, `availableFinishes`, `inStock`, `featured`
3. **Category:** `name`, `slug`, `description`, `image`, `icon`
4. **RoomDesign (Inspiration):** `title`, `roomType`, `style`, `description`, `coverImage`, `galleryImages`, `taggedProducts`, `designerNotes`
5. **Customization:** `userId`, `productId`, `chosenMaterial`, `chosenColor`, `chosenFinish`, `dimensions`, `calculatedPrice`, `previewImage`
6. **DesignBoard:** `userId`, `title`, `description`, `items` (`productId`, `customizationId`, `note`), `totalEstimatedCost`
7. **RoomPlan:** `userId`, `roomName`, `roomType`, `dimensions` (`length`, `width`, `unit`), `items` (`productId`, `x`, `y`, `rotation`, `color`), `totalCost`
8. **Consultation:** `name`, `email`, `phone`, `roomType`, `stylePreference`, `budgetRange`, `notes`, `status` (`new`, `contacted`, `in-progress`, `completed`), `createdAt`
9. **Wishlist:** `userId`, `products` (Array of Product ObjectIds)

---

## 📅 14-Day Development Schedule

| Phase | Duration | Milestones |
|---|---|---|
| **Phase 1: Foundation & Setup** | Days 1–3 | Repository setup, Express server, MongoDB models, Auth & Seed data |
| **Phase 2: Core Catalog & Inspiration** | Days 4–6 | Frontend scaffolding, Tailwind UI system, Catalog, Filters, Inspiration gallery |
| **Phase 3: Customizer & 2D Room Planner** | Days 7–9 | Interactive Furniture Customizer, dynamic pricing, 2D HTML5 canvas Room Planner |
| **Phase 4: Boards, Wishlist & Consultations** | Days 10–11 | Design board creator, Wishlist sync, Consultation booking form |
| **Phase 5: Admin Dashboard & Polish** | Days 12–14 | Admin controls, statistics, responsive design audit, validation, testing & documentation |
