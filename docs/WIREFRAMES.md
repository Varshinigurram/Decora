# Décora – Page-by-Page Wireframes & Layout Specifications

**Document Version:** 1.1.0  
**Phase:** Phase 2 (UI/UX Design & Asset Preparation)  
**Academic Subject:** Frontend Web Development (Primary Focus)  
**Standardized Conventions:** Currency in INR (₹), Metric units (cm / m), API prefix `/api/v1`

---

## 1. Homepage (`/`) Wireframe

### Section Order & Layout Hierarchy
```text
+-----------------------------------------------------------------------------------+
| [NAVBAR] Brand: DÉCORA | Inspiration | Catalog | Customizer | Planner | (Heart) [Auth] |
+-----------------------------------------------------------------------------------+
| [HERO SECTION]                                                                    |
|  Overline: "ARCHITECTURAL INTERIORS & TACTILE CRAFTSMANSHIP"                     |
|  Title: "Spaces Designed with Intent. Furniture Built for Life."                  |
|  Subtitle: "Discover curated interiors, personalize bespoke materials, and plan   |
|            your living space with authentic craftsmanship."                       |
|  Buttons: [ EXPLORE CATALOG ]   [ LAUNCH CUSTOMIZER ]                             |
|  Hero Visual: High-res warm living room (16:9) with subtle architectural crop     |
+-----------------------------------------------------------------------------------+
| [ROOM CATEGORIES SHOWCASE]                                                        |
|  Section Header: "Curated by Living Space"                                        |
|  Grid (4 Cols on Desktop, 2 on Tablet, 1 on Mobile):                              |
|  [ Living Room ]      [ Bedroom ]          [ Dining Room ]      [ Home Office ]   |
|  (Photo + Label)      (Photo + Label)      (Photo + Label)      (Photo + Label)   |
+-----------------------------------------------------------------------------------+
| [FEATURED FURNITURE SHOWCASE]                                                     |
|  Section Header: "Iconic Pieces & Configurable Designs"                           |
|  Filter Tabs: [ All ] [ Seating ] [ Tables ] [ Storage ] [ Lighting ]             |
|  Grid (4 Cols Desktop, 2 Cols Tablet/Mobile):                                     |
|  +----------------+ +----------------+ +----------------+ +----------------+      |
|  | [Img: 4:5] (♥) | | [Img: 4:5] (♥) | | [Img: 4:5] (♥) | | [Img: 4:5] (♥) |      |
|  | Tag: In Stock  | | Tag: Custom    | | Tag: In Stock  | | Tag: Custom    |      |
|  | Lounge Chair   | | Oak Dining Tab | | Minimal Credenza| | Bouclé Daybed   |      |
|  | From ₹28,000   | | From ₹45,000   | | From ₹38,000   | | From ₹52,000   |      |
|  +----------------+ +----------------+ +----------------+ +----------------+      |
+-----------------------------------------------------------------------------------+
| [INTERACTIVE CUSTOMIZER TEASER]                                                   |
|  Split Layout (Desktop: 2 Cols | Mobile: Stacked):                                |
|  Left Column (Visual Stage):         Right Column (Interactive Preview):          |
|  - High-res product canvas           - "Experience Material Tactility"            |
|  - Coordinated swatch overlays       - Fabric swatches (Bouclé, Velvet, Linen)    |
|                                      - Finish swatches (Oak, Walnut, Charcoal)    |
|                                      - Additive Price: ₹37,500                    |
|                                      - CTA: [ OPEN FULL CONFIGURATOR ]            |
+-----------------------------------------------------------------------------------+
| [INTERIOR INSPIRATION PREVIEW]                                                    |
|  Section Header: "Aesthetic Stories"                                              |
|  Cards (3 Cols Desktop, 1 Col Mobile):                                            |
|  [ Japandi Living ]        [ Scandinavian Dining ]     [ Minimalist Bedroom ]     |
|  "Warm wood meets linen"   "Airy natural textures"     "Serene architectural calm"|
|  Action: "Shop the Look ->"                                                       |
+-----------------------------------------------------------------------------------+
| [CONSULTATION CALLOUT & TESTIMONIALS]                                             |
|  "Planning a complete room renovation?"                                           |
|  CTA: [ REQUEST COMPLIMENTARY CONSULTATION ]                                      |
+-----------------------------------------------------------------------------------+
| [FOOTER] Brand Manifesto | Navigation | Categories | Project Academic Disclosures |
+-----------------------------------------------------------------------------------+
```

- **Responsive Behavior:** Desktop (>=1024px) renders multi-column grids; mobile (<768px) stacks sections vertically, collapses categories into 2-column grid, and shifts navigation to the slide-over drawer.
- **States:** Shimmering skeleton cards during data fetching; accessible inline retry button on API failure.

---

## 2. Inspiration Gallery & Detail Lookbook (`/inspiration`, `/inspiration/:id`)

### Gallery Index (`/inspiration`):
```text
+-----------------------------------------------------------------------------------+
| [BREADCRUMB] Home / Interior Inspiration                                          |
| Title: "Curated Living Spaces" (Cormorant Garamond Serif)                         |
| Filter Chips: [ All Styles ] [ Japandi ] [ Scandinavian ] [ Minimalist ] [ Industrial ] |
| Room Tabs:    [ All Rooms ] [ Living Room ] [ Bedroom ] [ Dining ] [ Home Office ]|
+-----------------------------------------------------------------------------------+
| MASONRY / GRID LAYOUT (3 Columns Desktop, 1 Column Mobile):                       |
| +-----------------------+ +-----------------------+ +-----------------------+     |
| | [Img: 3:2]            | | [Img: 3:2]            | | [Img: 3:2]            |     |
| | Style: JAPANDI        | | Style: SCANDINAVIAN   | | Style: MINIMALIST     |     |
| | "Komorebi Living"     | | "Nordic Light Dining" | | "Stone & Timber Bed"  |     |
| | 3 Featured Pieces     | | 4 Featured Pieces     | | 2 Featured Pieces     |     |
| | [ Explore Lookbook ->]| | [ Explore Lookbook ->]| | [ Explore Lookbook ->]|     |
| +-----------------------+ +-----------------------+ +-----------------------+     |
+-----------------------------------------------------------------------------------+
```

### Detail Lookbook View (`/inspiration/:id`):
```text
+-----------------------------------------------------------------------------------+
| [BREADCRUMB] Home / Inspiration / Komorebi Living Space                           |
| Title: "Komorebi Living Space: Warm Wood Meets Linen"                             |
| Designer Notes: "Designed around principles of Japanese minimalism and Danish     |
| hygge, prioritizing natural white oak, woven bouclé, and low-profile seating."    |
+-----------------------------------------------------------------------------------+
| [FULL-WIDTH EDITORIAL HERO PHOTOGRAPHY (1200x800)]                                |
| High-resolution styled room photography with subtle ambient illumination.         |
+-----------------------------------------------------------------------------------+
| [COLOR PALETTE SWATCHES]                                                          |
| Palette: [ Warm Linen #F6F3ED ] [ Natural Oak #D8C8B5 ] [ Forest Accent #35483D ] |
+-----------------------------------------------------------------------------------+
| [SHOP THE LOOK: FEATURED FURNITURE IN THIS ROOM]                                  |
| Section Header: "Pieces Featured in this Design"                                  |
| 3-Column Grid:                                                                    |
| +--------------------+ +--------------------+ +--------------------+              |
| | [Img: 4:5]         | | [Img: 4:5]         | | [Img: 4:5]         |              |
| | Komorebi Chair     | | Kanso Coffee Table | | Sylvan Sofa        |              |
| | Base: ₹28,000      | | Base: ₹18,500      | | Base: ₹45,000      |              |
| | [ CUSTOMIZE PIECE ]| | [ VIEW DETAILS ]   | | [ CUSTOMIZE PIECE ]|              |
| +--------------------+ +--------------------+ +--------------------+              |
+-----------------------------------------------------------------------------------+
```

---

## 3. Furniture Catalog (`/catalog`) Wireframe

```text
+-----------------------------------------------------------------------------------+
| [BREADCRUMB] Home / Furniture Catalog                                             |
| Title: "The Furniture Collection"  •  "34 Handcrafted Designs"                    |
+-----------------------------------------------------------------------------------+
| LEFT SIDEBAR (Filters - 280px):       RIGHT CONTENT (Catalog Grid):               |
| +----------------------------------+  +-----------------------------------------+ |
| | SEARCH INPUT                     |  | SORT BAR: [ Popularity v ] [ 4 Cols v ] | |
| | [ Search title or material... Q] |  +-----------------------------------------+ |
| |                                  |  PRODUCT GRID (3-4 Cols Desktop | 2 Mobile): |
| | ROOM TYPE                        |  +---------------+ +---------------+       | |
| | [x] Living Room  [ ] Bedroom     |  | [Img: 4:5] (♥)| | [Img: 4:5] (♥)|       | |
| | [ ] Dining       [ ] Office      |  | Category Tag  | | Category Tag  |       | |
| |                                  |  | Product Title | | Product Title |       | |
| | CATEGORY                         |  | From ₹28,000  | | From ₹45,000  |       | |
| | [ ] Seating      [ ] Tables      |  | [ Quick View ]| | [ Quick View ]|       | |
| | [ ] Storage      [ ] Lighting    |  +---------------+ +---------------+       | |
| |                                  |  +---------------+ +---------------+       | |
| | MATERIAL                         |  | [Img: 4:5] (♥)| | [Img: 4:5] (♥)|       | |
| | [x] Solid Oak    [x] Bouclé      |  | Category Tag  | | Category Tag  |       | |
| | [ ] Walnut       [ ] Velvet      |  | Product Title | | Product Title |       | |
| |                                  |  | From ₹18,500  | | From ₹34,000  |       | |
| | PRICE RANGE (INR ₹)              |  +---------------+ +---------------+       | |
| | Slider: [ ₹10,000 ——●—— ₹90,000] |                                            | |
| | [ RESET ALL FILTERS ]            |  [ PAGINATION: Page 1 of 3 (1-12 of 34) ]  | |
| +----------------------------------+  +-----------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

- **Empty State:** When no items match, displays: *"No furniture pieces found matching your criteria. Try adjusting your material or price filters."* with `[ Reset All Filters ]`.

---

## 4. Product Details Page (`/catalog/:id`) Wireframe

```text
+-----------------------------------------------------------------------------------+
| [BREADCRUMB] Home / Catalog / Seating / Komorebi Lounge Chair                     |
+-----------------------------------------------------------------------------------+
| LEFT COLUMN (Gallery - Sticky):       RIGHT COLUMN (Specifications & Actions):    |
| +----------------------------------+  +-----------------------------------------+ |
| | MAIN STAGED IMAGE (4:5 Ratio)    |  | Category: SEATING  •  Style: JAPANDI    | |
| | [ High-Res Front Angle Shot    ] |  | Title: "Komorebi Lounge Chair"          | |
| |                                  |  | Base Price: ₹28,000                     | |
| |                                  |  | Availability: [ In Stock - Ready ]      | |
| | THUMBNAIL ROW (Featured Angles): |  +-----------------------------------------+ |
| | [Front] [Side] [Detail] [In-Room]|  | DESCRIPTION: Handcrafted low-slung      | |
| +----------------------------------+  | lounge chair featuring sculpted solid   | |
|                                       | oak joinery and high-density cushioning.| |
|                                       |                                         | |
|                                       | ACTIONS:                                | |
|                                       | [ CUSTOMIZE THIS PIECE ] (Primary)      | |
|                                       | [ (♥) Wishlist ]  [ + Add to Board ]    | |
|                                       |                                         | |
|                                       | METRIC SPECIFICATIONS:                  | |
|                                       | Width: 78 cm  • Depth: 84 cm            | |
|                                       | Height: 72 cm • Weight: 18.5 kg         | |
|                                       | Primary Material: Solid White Oak       | |
|                                       | Frame Warranty: 5-Year Structural       | |
|                                       +-----------------------------------------+ |
+-----------------------------------------------------------------------------------+
| [RELATED PRODUCTS: "Complete the Look"] Matching Side Table, Lamp, Rug            |
+-----------------------------------------------------------------------------------+
```

---

## 5. Furniture Customizer (`/customizer/:productId`) Wireframe

```text
+-----------------------------------------------------------------------------------+
| [HEADER] "Bespoke Configurator: Komorebi Lounge Chair"                            |
+-----------------------------------------------------------------------------------+
| LEFT STAGE (Visual Product Canvas):   RIGHT CONTROLS (Configuration Engine):      |
| +----------------------------------+  +-----------------------------------------+ |
| | [ RESET DEFAULTS ]               |  | 1. UPHOLSTERY FABRIC:                   | |
| |                                  |  | [ (o) Cream Bouclé (+₹3,500) ]          | |
| |   [ High-Resolution Neutral     ] |  | [ ( ) Olive Velvet (+₹4,200) ]          | |
| |   [ Product Image with          ] |  | [ ( ) Charcoal Linen (+₹2,500) ]        | |
| |   [ Prepared Variant Texture    ] |  | [ ( ) Cognac Leather (+₹8,000) ]        | |
| |                                  |  |                                         | |
| |   Indicator:                     |  | 2. WOOD & MATERIAL FINISH:              | |
| |   "Showing: Bouclé + Oak Finish" |  | [ (o) Natural White Oak (+₹2,000) ]     | |
| |                                  |  | [ ( ) Rich Walnut (+₹3,500) ]           | |
| |                                  |  | [ ( ) Ebonized Ash (+₹2,500) ]          | |
| |                                  |  |                                         | |
| |                                  |  | 3. DIMENSION SCALE:                     | |
| |                                  |  | (o) Standard (78x84cm) [Base]           | |
| |                                  |  | ( ) Grand Scale (+10% width) [+₹4,000]  | |
| |                                  |  +-----------------------------------------+ |
| |                                  |  | [DYNAMIC ADDITIVE PRICE BREAKDOWN CARD] | |
| |                                  |  | Base Furniture Price:        ₹28,000    | |
| |                                  |  | Fabric (Cream Bouclé):       +₹3,500    | |
| |                                  |  | Finish (Natural White Oak):  +₹2,000    | |
| |                                  |  | Dimension (Grand Scale):     +₹4,000    | |
| |                                  |  | ------------------------------------    | |
| |                                  |  | FINAL CONFIGURATION PRICE:   ₹37,500    | |
| |                                  |  +-----------------------------------------+ |
| |                                  |  | [ SAVE CONFIGURATION ] (Primary CTA)    | |
| |                                  |  | [ + ADD TO DESIGN BOARD ]               | |
| +----------------------------------+  +-----------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

---

## 6. Customer Wishlist (`/wishlist`) Wireframe

> **Dedicated Personal Bookmark Queue (Separated from Design Boards)**

```text
+-----------------------------------------------------------------------------------+
| [BREADCRUMB] Home / Wishlist                                                      |
| Title: "My Saved Items"  •  "3 Bookmarked Pieces"                                 |
| Subtitle: "Quick-saved catalog favorites for easy review."                         |
+-----------------------------------------------------------------------------------+
| WISHLIST ITEMS GRID (3-4 Columns Desktop, 2 Columns Mobile):                      |
| +--------------------------+ +--------------------------+ +---------------------+ |
| | [Img: 4:5]               | | [Img: 4:5]               | | [Img: 4:5]          | |
| | Stock: Ready to Ship     | | Stock: Made to Order     | | Stock: Ready to Ship| |
| | Komorebi Lounge Chair    | | Sylvan Minimalist Sofa   | | Kanso Coffee Table  | |
| | Base Price: ₹28,000      | | Base Price: ₹45,000      | | Base Price: ₹18,500 | |
| | Actions:                 | | Actions:                 | | Actions:            | |
| | [ CUSTOMIZE ]            | | [ CUSTOMIZE ]            | | [ VIEW DETAILS ]    | |
| | [ (Trash) Remove ]       | | [ (Trash) Remove ]       | | [ (Trash) Remove ]  | |
| +--------------------------+ +--------------------------+ +---------------------+ |
+-----------------------------------------------------------------------------------+
```

- **Empty State:** When wishlist is empty, displays: *"You have not saved any furniture pieces yet. Browse the catalog to bookmark your favorite handcrafted designs."* with `[ EXPLORE CATALOG ]`.

---

## 7. Personal Design Boards (`/boards` & `/boards/:id`) Wireframe

> **Thematic Project Planning & Budget Estimation (Separated from Wishlist)**

### Index View (`/boards`):
```text
+-----------------------------------------------------------------------------------+
| [HEADER] "My Design Boards"  •  [ + CREATE NEW BOARD ]                            |
| Subtitle: "Curate room projects, retain custom configurations, and track budgets."|
+-----------------------------------------------------------------------------------+
| BOARD CARDS GRID (3 Columns Desktop, 1 Column Mobile):                             |
| +------------------------------+ +------------------------------+                 |
| | [3-Image Composite Collage]  | | [3-Image Composite Collage]  |                 |
| | Title: "Living Room Japandi" | | Title: "Master Bedroom 2026" |                 |
| | Items: 4 pieces curated      | | Items: 2 pieces curated      |                 |
| | Estimated Budget: ₹1,12,000  | | Estimated Budget: ₹54,000    |                 |
| | [ View Board ] [ Delete ]    | | [ View Board ] [ Delete ]    |                 |
| +------------------------------+ +------------------------------+                 |
+-----------------------------------------------------------------------------------+
```

### Detail View (`/boards/:id`):
```text
+-----------------------------------------------------------------------------------+
| [BREADCRUMB] Boards / Living Room Japandi 2026                                    |
| Title: "Living Room Japandi 2026"  •  [ EDIT TITLE ]                              |
| Budget Summary: "Total Estimated Design Budget: ₹1,12,000 (4 Configured Items)"   |
| Actions: [ + ADD ITEMS FROM CATALOG ]   [ ATTACH TO CONSULTATION INQUIRY ]        |
+-----------------------------------------------------------------------------------+
| CONFIGURED ITEMS GRID:                                                            |
| +--------------------+ +--------------------+ +--------------------+              |
| | [Img: Bouclé/Oak]  | | [Img: Walnut]      | | [Img: Natural]     |              |
| | Komorebi Chair     | | Kanso Coffee Table | | Sylvan Sofa        |              |
| | Variant: Bouclé/Oak| | Variant: Walnut    | | Variant: Linen     |              |
| | Price: ₹37,500     | | Price: ₹18,500     | | Price: ₹56,000     |              |
| | Note: "Accent seat"| | Note: "Centerpiece"| | Note: "Main 3-seat"|              |
| | [ Edit ] [ Remove ]| | [ Edit ] [ Remove ]| | [ Edit ] [ Remove ]|              |
| +--------------------+ +--------------------+ +--------------------+              |
+-----------------------------------------------------------------------------------+
```

---

## 8. React-Managed SVG 2D Room Planner (`/room-planner`) Wireframe

```text
+-----------------------------------------------------------------------------------+
| [PLANNER TOOLBAR]                                                                 |
| Room: [ Living Room v ] | Dimensions: L: [ 4.5 ]m  W: [ 3.8 ]m | Unit: Metric (m) |
| Live Furniture Budget: "Total: ₹84,500"  •  [ SAVE ROOM PLAN ]  •  [ RESET CANVAS]|
+-----------------------------------------------------------------------------------+
| [PLANNER WORKSPACE - 2 COLUMNS]                                                   |
|                                                                                   |
| PALETTE SIDEBAR (240px):              SVG ROOM CANVAS (Floorboard Grid):          |
| +----------------------------------+  +-----------------------------------------+ |
| | SEARCH FURNITURE PALETTE         |  |  +-----------------------------------+  | |
| | [ Filter items... Q]             |  |  | (0,0)                        (4.5m)|  | |
| |                                  |  |  |                                   |  | |
| | SEATING                          |  |  |      +--------------+             |  | |
| | [ 3-Seater Sofa (220x90cm)   ]   |  |  |      | 3-Seater Sofa| [Rotate 90°]|  | |
| | [ Lounge Chair (78x84cm)     ]   |  |  |      +--------------+             |  | |
| |                                  |  |  |             +-----------+         |  | |
| | TABLES & STORAGE                 |  |  |             |Coffee Tab |         |  | |
| | [ Coffee Table (110x60cm)    ]   |  |  |             +-----------+         |  | |
| | [ Media Credenza (160x45cm)  ]   |  |  |                                   |  | |
| |                                  |  |  |      [Lounge Chair]               |  | |
| | (Drag item onto canvas)          |  |  | (3.8m)                            |  | |
| +----------------------------------+  +-----------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

---

## 9. Consultation Intake Portal (`/consultation`) Wireframe

```text
+-----------------------------------------------------------------------------------+
| [HEADER] "Interior Design Consultation"                                           |
| Subtitle: "Collaborate with our interior architects to furnish your home."        |
+-----------------------------------------------------------------------------------+
| [STEP PROGRESS BAR]  (1) Contact Info  ->  (2) Room & Style  ->  (3) Budget & Scope|
+-----------------------------------------------------------------------------------+
| [FORM CARD CONTAINER - MAX-W-2XL CENTERED]                                        |
|                                                                                   |
| STEP 1: CLIENT CONTACT (Pre-filled if logged in):                                 |
| Full Name:       [ Varsha Sharma                           ]                      |
| Email Address:   [ varsha@example.com                      ]                      |
| Phone Number:    [ +91 98765 43210                         ]                      |
|                                                                                   |
| STEP 2: PROJECT SPECIFICATIONS:                                                   |
| Room Type:       [ Living Room                          v ]                      |
| Preferred Style: (o) Japandi  ( ) Scandinavian  ( ) Minimalist  ( ) Industrial    |
| Room Dimensions: Length: [ 4.5 ] meters   Width: [ 3.8 ] meters                   |
|                                                                                   |
| STEP 3: BUDGET & SCOPE:                                                           |
| Budget Bracket:  ( ) < ₹1,00,000        (o) ₹1,00,000 – ₹3,00,000                 |
|                  ( ) ₹3,00,000 – ₹5,00,000  ( ) ₹5,00,000+                       |
| Attach Board:    [ Optional: Select "Living Room Japandi" v]                      |
| Project Notes:   [ "Seeking layout advice for north-facing light..."            ] |
|                                                                                   |
| [ SUBMIT CONSULTATION REQUEST ]                                                   |
+-----------------------------------------------------------------------------------+
| [CONFIRMATION SCREEN (On Success)] Reference: #DEC-2026-8492                      |
+-----------------------------------------------------------------------------------+
```

---

## 10. Authentication Views (`/login`, `/register`) Wireframe

### Login (`/login`) & Registration (`/register`):
```text
+-----------------------------------------------------------------------------------+
| [CENTERED AUTH CARD CONTAINER - MAX-W-MD]                                         |
| Logo: DÉCORA (Cormorant Garamond Serif)                                           |
| Title: "Welcome Back" / "Create Your Account"                                     |
| Subtitle: "Save customizations, build design boards, and plan rooms."             |
|                                                                                   |
| FORM FIELDS:                                                                      |
| Full Name:       [ Enter your full name (on register only) ]                      |
| Email Address:   [ user@example.com                        ]                      |
| Password:        [ ••••••••••••                        (👁) ]                      |
|                                                                                   |
| Inline Validation: "Password must be at least 6 characters with 1 number."        |
|                                                                                   |
| [ LOG IN / CREATE ACCOUNT ] (Primary Button)                                      |
|                                                                                   |
| Link: "Don't have an account? Register" / "Already have an account? Log In"       |
+-----------------------------------------------------------------------------------+
```

---

## 11. Admin Dashboard Views (`/admin`, `/admin/products`, `/admin/consultations`)

### Dashboard Index (`/admin`):
```text
+-----------------------------------------------------------------------------------+
| [ADMIN SIDEBAR] Logo | Dashboard | Products | Consultations | [ Back to Store ]   |
+-----------------------------------------------------------------------------------+
| [TOP METRICS ROW]                                                                 |
| [ Total Products: 34 ] [ Pending Inquiries: 8 ] [ Registered Users: 142 ]         |
+-----------------------------------------------------------------------------------+
| [RECENT ACTIVITY] Summary of incoming consultation inquiries & low stock alerts   |
+-----------------------------------------------------------------------------------+
```

### Product Catalog CRUD (`/admin/products`):
```text
+-----------------------------------------------------------------------------------+
| Header: "Product Catalog Management"  •  [ + ADD NEW FURNITURE PIECE ]            |
+-----------------------------------------------------------------------------------+
| DATA TABLE:                                                                       |
| Image | Title           | Category | Base Price (₹) | Stock Status | Actions      |
| [Img] | Komorebi Chair  | Seating  | ₹28,000        | [x] In Stock | [Edit][Trash]|
| [Img] | Sylvan Sofa     | Seating  | ₹45,000        | [x] In Stock | [Edit][Trash]|
| [Img] | Kanso Table     | Tables   | ₹18,500        | [ ] Out      | [Edit][Trash]|
+-----------------------------------------------------------------------------------+
```

### Consultation Pipeline (`/admin/consultations`):
```text
+-----------------------------------------------------------------------------------+
| Header: "Consultation Request Pipeline"  •  Filter: [ All Statuses v ]            |
+-----------------------------------------------------------------------------------+
| DATA TABLE:                                                                       |
| Ref ID   | Client Name    | Room Type   | Budget Tier    | Status Dropdown        |
| DEC-8492 | Varsha Sharma  | Living Room | ₹1L - ₹3L      | [ New v              ] |
| DEC-7821 | Rohan Mehta    | Bedroom     | ₹3L - ₹5L      | [ Contacted v        ] |
| DEC-6510 | Ananya Iyer    | Full Home   | ₹5L+           | [ In Progress v      ] |
+-----------------------------------------------------------------------------------+
```

---

## 12. 404 Not Found Page (`/404` / `*`) Wireframe

```text
+-----------------------------------------------------------------------------------+
| [NAVBAR]                                                                          |
+-----------------------------------------------------------------------------------+
| [CENTERED 404 CONTAINER - MAX-W-LG]                                               |
| Number: "404" (Large Editorial Cormorant Garamond Serif, Charcoal Muted)          |
| Heading: "This Space Does Not Exist"                                              |
| Narrative: "The architectural page you are looking for has been moved, renamed,    |
|             or is no longer part of our catalog."                                 |
| Action Buttons:                                                                   |
| [ EXPLORE FURNITURE CATALOG ]   [ RETURN TO HOMEPAGE ]                            |
+-----------------------------------------------------------------------------------+
| [FOOTER]                                                                          |
+-----------------------------------------------------------------------------------+
```
