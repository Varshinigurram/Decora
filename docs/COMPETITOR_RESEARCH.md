# Décora – Phase 1: Competitor Research & Gap Analysis (Day 2 - Technical Refinement)

**Document Version:** 1.2.0  
**Phase:** Phase 1 (Research & Gap Analysis)  
**Academic Subject:** Frontend Web Development (Primary Focus)  
**Standardized Conventions:** Currency in INR (₹), Metric units (cm / m), API prefix `/api/v1`  
**Benchmarked Competitors:** IKEA India, Pepperfry, Urban Ladder, West Elm  
**Evaluation Period:** November 2026

---

## 1. Executive Summary & Research Methodology

This study benchmarks four major platforms across global modular retail, Indian online furniture marketplaces, and high-end design houses. The research methodology strictly distinguishes between:
- **Verified Facts:** Directly observable capabilities, publicly documented features, and official offerings.
- **Subjective Usability Observations:** Interaction ergonomics, visual cognitive load, and observed journey friction points.

A primary finding is that competitors offer sophisticated tools in isolation—such as 3D room planning, custom upholstery, or professional interior design services. However, these tools exist in **siloed workflows** separated from everyday catalog discovery.

### Décora's Core Value Proposition
Décora’s differentiation is defined by an **unbroken, self-service consumer journey**:
$$\text{Interior Inspiration} \longrightarrow \text{Product Discovery} \longrightarrow \text{Furniture Customization} \longrightarrow \text{Transparent Pricing (₹)} \longrightarrow \text{Personal Design Boards} \longrightarrow \text{2D Room Planning}$$

Rather than claiming that every individual feature has never existed in isolation, Décora provides a connected, responsive web experience where users can move from design concept to customized furniture and spatial planning without jumping into complex CAD tools, booking offline appointments, or enduring sales calls.

---

## 2. Evidence Register

The following register documents the exact pages, official features, access dates, and factual classifications evaluated for each competitor.

| Competitor | Evaluated Page / Feature | Direct Source URL | Access Date | Documented Observation Reference | Classification |
|---|---|---|---|---|---|
| **IKEA India** | Main Storefront & Navigation | [ikea.com/in/en/](https://www.ikea.com/in/en/) | Nov 2026 | Hierarchical mega-menu categorized by room and functional product category; real-time search suggestions with product thumbnails. | **Verified Fact** |
| **IKEA India** | Rooms Inspiration Hub | [ikea.com/in/en/rooms/](https://www.ikea.com/in/rooms/) | Nov 2026 | Curated room photography featuring interactive hotspot pins that open overlay cards displaying product name, price in INR, and quick-add actions. | **Verified Fact** |
| **IKEA India** | IKEA Kreativ Web Tool | [ikea.com/in/en/planners/](https://www.ikea.com/in/en/planners/) | Nov 2026 | Browser-based WebGL tool allowing users to scan/upload rooms, place to-scale 3D furniture, save designs ("Save", "Save As"), and generate shareable Remix links tied to an IKEA account. | **Verified Fact** |
| **IKEA India** | Product Detail Page (PDP) | Sample: POÄNG Armchair PDP | Nov 2026 | Full dimension tables ($cm$), net package weights ($kg$), and downloadable assembly instruction PDFs. Customization is limited to modular configurations and fixed cushions. | **Verified Fact** |
| **IKEA India** | Catalog Density & Visual Tone | Storewide UI | Nov 2026 | Utilitarian visual presentation; high product volume can induce cognitive fatigue during aesthetic curation. | **Subjective Usability Observation** |
| **Pepperfry** | Marketplace Catalog & Filters | [pepperfry.com](https://www.pepperfry.com/) | Nov 2026 | Granular filter sidebar with metric/imperial dimension sliders, wood species (Sheesham, Teak, Mango), brands, and discount filters. | **Verified Fact** |
| **Pepperfry** | Modular Wardrobes & Customization | [pepperfry.com/furniture/wardrobes.html](https://www.pepperfry.com/furniture/wardrobes.html) | Nov 2026 | Made-to-order options available for select modular storage and partner sofa lines; standard catalog pieces are purchased as fixed SKUs. | **Verified Fact** |
| **Pepperfry** | Studio Pepperfry | [pepperfry.com/studios.html](https://www.pepperfry.com/studios.html) | Nov 2026 | Physical experience centers in major Indian cities offering free in-person 3D design consultancy and material sample inspections. | **Verified Fact** |
| **Pepperfry** | Marketplace UI & Merchandising | Storewide UI | Nov 2026 | High visual clutter: promotional banners, countdown timers, and discount pop-ups compete with furniture presentation. Multi-vendor photography quality varies. | **Subjective Usability Observation** |
| **Urban Ladder** | Main Catalog & PDPs | [urbanladder.com](https://www.urbanladder.com/) | Nov 2026 | Contemporary solid wood furniture tailored to Indian apartments; PDPs provide dimension diagrams, weight capacities, and care instructions. Freestanding items feature fixed finish variants (typically 2–3 presets). | **Verified Fact** |
| **Urban Ladder** | Home Interiors Consultation | [urbanladder.com/interiors](https://www.urbanladder.com/interiors) | Nov 2026 | Full-service interior design offering one-on-one designer consultations, custom modular kitchens/wardrobes, and personalized 3D spatial floor plans. | **Verified Fact** |
| **Urban Ladder** | Catalog & Inspiration Lookbooks | Storewide UI | Nov 2026 | Serene aesthetic with balanced whitespace. Lookbooks are static; items shown in staged rooms must be manually searched in the catalog. No consumer self-service room planner on the website. | **Subjective Usability Observation** |
| **West Elm** | Custom Upholstery Program | [westelm.com](https://www.westelm.com/) | Nov 2026 | Interactive fabric swatch selector across multiple durability grades (velvet, linen, bouclé, leather); free physical swatches shipped to customers. | **Verified Fact** |
| **West Elm** | 3D Room Planner Tool | [westelm.com/pages/design-crew/room-planner/](https://www.westelm.com/pages/design-crew/room-planner/) | Nov 2026 | Web-based CAD tool supporting to-scale 2D/3D floor plan layout, placement of Williams-Sonoma brand catalog items, and account project saving. | **Verified Fact** |
| **West Elm** | Design Crew Services | [westelm.com/pages/design-crew/](https://www.westelm.com/pages/design-crew/) | Nov 2026 | Free virtual and in-person interior styling appointments; stylists generate custom moodboards and floor plans for clients. | **Verified Fact** |
| **West Elm** | Pricing Clarity & 3D Usability | Customizer & Room Planner UI | Nov 2026 | Editorial typography and photography are aspirational. In the customizer, price changes significantly across fabric grades without displaying an itemized formula breakdown. The 3D planner requires multi-step orbital mouse navigation that is difficult to manipulate on touchscreens. | **Subjective Usability Observation** |

---

## 3. Refined Competitor Comparison Matrix

### Classification Taxonomy:
- ❌ **Does Not Exist:** Capability is absent from the platform.
- ⚠️ **Limited / Constrained:** Capability exists, but has narrow presets, fixed colorways, or restrictive boundaries.
- 🔄 **Different Workflow:** Capability exists, but through a separate heavy standalone portal, native mobile app, or professional consultation appointment rather than an integrated self-service web flow.
- 🎯 **Décora Target Approach:** Integrated, lightweight, self-service web flow tailored for consumer ease of use.

| Capability / Evaluation Dimension | IKEA India | Pepperfry | Urban Ladder | West Elm | Décora Target Approach |
|---|---|---|---|---|---|
| **Editorial & Architectural Visual Design** | ⚠️ Clean, utilitarian corporate blue/yellow grid. | ❌ High clutter; discount banners & countdowns. | ⚠️ Polished catalog; balanced whitespace. | ✅ Premium editorial; warm neutral tones. | 🎯 **Warm neutrals (linen, cream, walnut, matte black).** |
| **Catalog Filtering & Faceted Search** | ✅ Room & product taxonomy; real-time search. | ✅ Granular dimensions, wood types, brand, EMI. | ✅ Category filters, wood finish, space-saving tags. | ✅ Filter by material, fabric grade, size, room. | 🎯 **Instant search, material chips, metric INR range slider.** |
| **Product Detail Transparency** | ✅ Exploded views, package dims, assembly PDFs. | ⚠️ Multi-vendor specs; varying photo quality. | ✅ 360° views, dimension diagrams, care notes. | ✅ Lifestyle shots, fabric swatches, care notes. | 🎯 **Multi-angle gallery, metric specs ($cm$, $kg$), direct customizer.** |
| **Online Furniture Customization** | 🔄 Modular system configurators (PAX, BESTÅ). | 🔄 Made-to-order via select partner brands / studio. | ⚠️ Fixed presets (2–3 wood shades or fabric hues). | ✅ Rich upholstery swatches across fabric grades. | 🎯 **Interactive swatches, authentic variant assets, additive formula.** |
| **Pricing Calculation Transparency** | ⚠️ Flat pricing; add-on components itemized. | ⚠️ Sale discounts, coupon codes, EMI variations. | ⚠️ Fixed catalog prices; quotes for modular work. | 🔄 Fabric grades change price without formula breakdown. | 🎯 **Additive formula:** $\text{Base} + \Delta\text{Fabric} + \Delta\text{Finish} + \Delta\text{Size}$. |
| **Inspiration & "Shop the Look"** | ✅ Rooms hub with clickable product hotspot pins. | ⚠️ Static curated living room galleries. | 🔄 Lookbooks linked to full-service interior consulting. | ✅ "Room Ideas" lookbooks with tagged catalog items. | 🎯 **Curated styles (Japandi, Scandinavian) with 1-click catalog links.** |
| **Wishlist & Personal Design Saving** | 🔄 Account shopping lists & Kreativ saved designs. | ⚠️ Flat "Shortlist" bookmark queue. | ⚠️ Simple wishlist queue. | 🔄 "Favorites" queue & Design Crew project files. | 🎯 **Thematic Design Boards with live estimated budget in ₹.** |
| **Room Planning Tool** | 🔄 *IKEA Kreativ* (3D WebGL / LiDAR app); Home Planners. | 🔄 In-store 3D consultant CAD layouts (Studio). | 🔄 Professional 3D consultation (Home Interiors). | 🔄 3D Web Room Planner (Autodesk/Cylindo engine). | 🎯 **Lightweight React-managed SVG 2D Canvas with live ₹ tally.** |
| **Design Consultation Workflow** | 🔄 In-store / virtual appointment booking. | 🔄 Free consultation booking at Studio Pepperfry. | 🔄 Lead capture for full-home interior design service. | 🔄 "Design Crew" free virtual/in-store appointments. | 🎯 **Dual intake: Instant guest request + Account-linked customer flow.** |

---

## 4. Standardized Customization Pricing Model

To avoid conflicting mathematical definitions, Décora uses a single, consistent **additive pricing model** for the initial implementation:

$$\mathbf{\text{Final Price}} = \text{Base Price} + \Delta\text{Fabric Adjustment} + \Delta\text{Finish Adjustment} + \Delta\text{Size Adjustment}$$

### Reference Implementation Example:
For a premium lounge chair with a baseline cost of **₹28,000**:
$$\begin{aligned}
\text{Base Price} &= \text{₹28,000} \quad \text{(Standard frame in natural beech)} \\
\Delta\text{Fabric Adjustment} &= +\text{₹3,500} \quad \text{(Upgraded Cream Bouclé upholstery)} \\
\Delta\text{Finish Adjustment} &= +\text{₹2,000} \quad \text{(Solid Natural White Oak finish)} \\
\Delta\text{Size Adjustment} &= +\text{₹4,000} \quad \text{(Grand Scale dimensions)} \\
\hline
\mathbf{\text{Final Price (₹)}} &= \mathbf{₹37,500}
\end{aligned}$$

### Backend Price Integrity Rule:
- The frontend recalculates and presents this breakdown dynamically as the user toggles options.
- When saving a configuration or persisting an item to a Design Board, the payload transmits the chosen variant IDs along with the calculated price.
- **Backend Validation:** The Express server (`/api/v1/customizations`) must re-compute and validate the final price against the product's official pricing rules stored in MongoDB. If a client payload submits a tampered or invalid price, the server rejects the request with HTTP 400 Bad Request, ensuring pricing integrity.

---

## 5. Customization Asset Requirements & Strategy

To avoid misleading visual representations, Décora distinguishes clearly between four asset categories:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CUSTOMIZATION ASSET CLASSIFICATION                              │
├───────────────────────────────┬────────────────────────────────────────────────────────┤
│ Asset Category                │ Definition & Purpose                                   │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ 1. Genuine Material Swatches  │ High-resolution macro photography of physical material  │
│                               │ textures (e.g., woven bouclé, slub linen, top-grain    │
│                               │ leather, oak grain). Used in the swatch selection tray.│
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ 2. Base Furniture Images      │ Clean, professionally staged neutral product photos    │
│                               │ on transparent or minimal backgrounds.                 │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ 3. Prepared Variant Images    │ Dedicated pre-rendered or photographed assets          │
│                               │ representing distinct structural or upholstery variants│
│                               │ (e.g., Sofa in Charcoal vs. Sofa in Cream).            │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ 4. CSS / SVG Overlays         │ Programmatic tint, blend-mode, or highlight layers     │
│                               │ applied selectively to hardware or wood stain areas.   │
└───────────────────────────────┴────────────────────────────────────────────────────────┘
```

### Overlays Suitability Guideline:
- **Where Overlays Are Suitable:** CSS/SVG overlays (`mix-blend-mode: multiply`, SVG color filters) are appropriate for flat or semi-reflective surfaces where the geometry remains identical—such as shifting metal hardware from brushed brass to matte black, or tinting wood stain warmth.
- **Where Overlays Are Unsuitable:** CSS overlays **cannot** automatically produce photorealistic material textures (such as the deep tactile loops of bouclé or the grain variations of weathered leather). For major upholstery changes, the platform relies on **genuine prepared variant images** paired with tactile swatch close-ups, ensuring visual authenticity without deceptive rendering.

---

## 6. Design Board Configuration Persistence & Budget Semantics

### Configuration Retention Architecture
A saved furniture item on a design board does not merely store a raw `productId`; it retains an explicit configuration snapshot:
- `productId`: Reference to the base catalog piece.
- `chosenFabric`: Specific fabric variant ID (e.g., `fabric-boucle-cream`).
- `chosenFinish`: Specific finish variant ID (e.g., `finish-oak-natural`).
- `chosenSize`: Specific dimension scale (e.g., `size-grand`).
- `configuredPrice`: Exact calculated price in INR at the time of board addition (e.g., `₹37,500`).
- `variantImage`: Corresponding configured image asset path.

### Multi-Configuration Support:
Because items store discrete configuration snapshots, the **same base product can coexist in different configurations across different design boards** (or even within the same board). For example:
- On "Living Room Board": *Komorebi Armchair* configured in Cream Bouclé + Oak at **₹37,500**.
- On "Study Reading Corner Board": *Komorebi Armchair* configured in Charcoal Linen + Walnut at **₹33,500**.

### Design Budget Semantics:
- Board totals represent **estimated design budgets** intended for project planning and cost comparison.
- They are clearly labeled as *"Total Estimated Design Budget"* rather than a retail cart subtotal, because real checkout and payment processing are strictly out of scope for Release 1.0.

---

## 7. Refined 2D Room Planner Scope (Should Have)

To maintain feasibility within the 14-day academic timeline, the initial room planner implementation is strictly timeboxed:

### In-Scope (Initial Implementation):
- User-defined room dimensions in meters (e.g., $4.5m \times 3.8m$).
- Proportional React-managed SVG grid floorboard that scales responsively.
- Furniture catalog palette sidebar containing top-down 2D vector architectural blocks (sofas, tables, chairs, beds, desks).
- Drag-and-drop placement of furniture onto the SVG room canvas.
- Item repositioning, 45° and 90° rotation controls, and item removal.
- Real-time aggregated room furniture budget counter in INR (₹).
- Save room layout coordinates to MongoDB (`/api/v1/room-plans`) and reload saved layouts.

### Explicitly Optional (Could Have):
- Advanced bounding-box collision detection.
- Wall snapping and angle snapping guides.
- Irregular or non-rectangular polygon room geometries.

---

## 8. Refined Visual Direction

### Primary Design Language: Warm Editorial Architectural Aesthetic
- **Color Palette:** Warm neutrals inspired by natural architectural materials—linen whites (`#FAF9F6`), warm stone (`#F5F2EB`), soft oatmeal (`#E7E2D8`), rich walnut (`#4A3728`), and deep charcoal accents (`#1C1917`).
- **Typography:** Refined editorial typography combining high-contrast serif headers (editorial elegance) with clean, legible geometric sans-serif body copy.
- **Composition:** Generous whitespace, structured grid layouts, tactile photography, and a calm, distraction-free atmosphere free of aggressive promotional merchandising.

### Styling Clarification:
- Translucent frosted navigation, subtle drop shadows, and backdrop blur (`backdrop-blur-md`) are **optional styling enhancements** to elevate visual polish; they do not constitute the core brand identity. The brand identity is grounded in **warm architectural minimalism and tactile material honesty**.

---

## 9. Final Recommended Frontend Scope for 14-Day Delivery

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      FINAL FRONTEND IMPLEMENTATION SCOPE                               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Must Have (Days 5–12)                                                                  │
│ ├── Homepage & Navigation (FR-01): Brand identity, responsive drawer, hero & showcase   │
│ ├── Interior Inspiration (FR-02): Curated room galleries with "Shop the Look" deep links│
│ ├── Furniture Catalog & Details (FR-03, FR-04): Search, faceted filters, metric specs  │
│ ├── Furniture Customizer (FR-05): Additive pricing formula, authentic swatches & reset │
│ ├── Customer Wishlist (FR-06): One-click toggle with MongoDB persistence               │
│ ├── Thematic Design Boards (FR-07): Multi-board creation with live estimated budgets   │
│ ├── Authentication & Profile (FR-09): HTTP-only cookies, registration, login & logout  │
│ └── Consultation Intake (FR-10): Dual guest & account-linked questionnaire             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Should Have (Days 10 & 13)                                                             │
│ ├── 2D SVG Room Planner (FR-08): Proportional grid, drag/drop, rotate & live ₹ budget  │
│ ├── Admin Product CRUD (FR-11): Management table with create, edit, delete & toggles   │
│ └── Consultation Pipeline (FR-11): Status management (New → Contacted → Completed)     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Could Have (Day 14 Stretch Only)                                                       │
│ ├── Room Planner Collision Warning: Bounding-box overlap border indicator              │
│ └── Admin Analytics Charts: Style popularity and inquiry volume charts                 │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
