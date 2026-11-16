# Décora – Asset Requirements, Priorities & Sourcing Specification

**Document Version:** 1.1.0  
**Phase:** Phase 2 (UI/UX Design & Asset Preparation)  
**Academic Subject:** Frontend Web Development (Primary Focus)  
**Standardized Conventions:** Currency in INR (₹), Metric units (cm / m), API prefix `/api/v1`

---

## 1. Practical Asset Prioritization Strategy

Rather than imposing an impractical burden of four distinct studio angles for every single catalog piece, Décora establishes a **five-tier asset hierarchy**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ASSET TIER PRIORITY MATRIX                      │
├───────┬────────────────────────────┬───────────────────────────────────┤
│ Tier  │ Asset Category             │ Scope & Requirement Strategy      │
├───────┼────────────────────────────┼───────────────────────────────────┤
│ **1** │ **Primary Catalog Images** │ **Mandatory for EVERY product**   │
│       │                            │ Single clean staged front/3/4 shot│
│       │                            │ on ivory background (4:5 ratio).  │
├───────┼────────────────────────────┼───────────────────────────────────┤
│ **2** │ **Featured Product Angles**│ **Selective (Featured pieces)**   │
│       │                            │ 3–4 angles (side, detail, in-room)│
│       │                            │ for key showcase items (Komorebi).│
├───────┼────────────────────────────┼───────────────────────────────────┤
│ **3** │ **Prepared Variant Images**│ **Customizer Target Pieces**      │
│       │                            │ Pre-photographed/rendered shots of│
│       │                            │ distinct upholstery variants.     │
├───────┼────────────────────────────┼───────────────────────────────────┤
│ **4** │ **Material & Wood Swatches**│ **Shared Macro Swatches**         │
│       │                            │ 120x120 macro close-ups of linens,│
│       │                            │ bouclés, leathers, and oak grains.│
├───────┼────────────────────────────┼───────────────────────────────────┤
│ **5** │ **Local Fallback SVGs**    │ **Universal Safety Fallbacks**    │
│       │                            │ Lightweight vector placeholders & │
│       │                            │ top-down room planner blocks.     │
└───────┴────────────────────────────┴───────────────────────────────────┘
```

---

## 2. Directory Architecture for Assets

```text
client/public/assets/
├── branding/
│   ├── decora-logo.svg              # Primary brand wordmark (editorial serif)
│   ├── decora-favicon.svg           # Minimal architectural monogram favicon
│   └── hero-banner.webp             # High-resolution hero image (1920x1080)
├── categories/
│   ├── cat-living-room.webp         # Living room showcase thumbnail (800x600)
│   ├── cat-bedroom.webp             # Bedroom showcase thumbnail (800x600)
│   ├── cat-dining.webp              # Dining room showcase thumbnail (800x600)
│   └── cat-home-office.webp         # Home office showcase thumbnail (800x600)
├── inspirations/
│   ├── insp-japandi-living.webp     # "Komorebi Living" curated room (1200x800)
│   ├── insp-scandi-dining.webp      # "Nordic Light Dining" curated room (1200x800)
│   ├── insp-minimalist-bed.webp     # "Stone & Timber Bedroom" room (1200x800)
│   └── insp-industrial-office.webp  # "Atelier Loft Study" room (1200x800)
├── products/
│   ├── prod-komorebi-chair.webp     # Primary: Komorebi Lounge Chair (800x1000)
│   ├── prod-komorebi-chair-side.webp# Featured Angle: Side view (800x1000)
│   ├── prod-komorebi-chair-detail.webp# Featured Angle: Joint detail (800x1000)
│   ├── prod-sylvan-sofa.webp        # Primary: Sylvan 3-Seater Sofa (800x1000)
│   ├── prod-kanso-coffee-table.webp # Primary: Kanso Walnut Coffee Table (800x1000)
│   ├── prod-asahi-dining-table.webp # Primary: Asahi Oak Dining Table (800x1000)
│   ├── prod-linen-bedframe.webp     # Primary: Upholstered Platform Bed (800x1000)
│   └── prod-nara-credenza.webp      # Primary: Nara Slatted Credenza (800x1000)
├── variants/
│   ├── prod-komorebi-boucle-cream.webp  # Variant: Cream Bouclé upholstery
│   ├── prod-komorebi-velvet-olive.webp  # Variant: Olive Velvet upholstery
│   ├── prod-komorebi-linen-charcoal.webp# Variant: Charcoal Linen upholstery
│   └── prod-komorebi-leather-cognac.webp# Variant: Cognac Leather upholstery
├── swatches/
│   ├── swatch-boucle-cream.webp     # Tactile cream bouclé macro (120x120)
│   ├── swatch-velvet-olive.webp     # Tactile olive velvet macro (120x120)
│   ├── swatch-linen-charcoal.webp   # Tactile charcoal linen macro (120x120)
│   ├── swatch-leather-cognac.webp   # Tactile cognac leather macro (120x120)
│   ├── swatch-oak-natural.webp      # Solid white oak grain macro (120x120)
│   ├── swatch-walnut-rich.webp      # Rich American walnut grain macro (120x120)
│   ├── swatch-ash-ebonized.webp     # Ebonized black ash grain macro (120x120)
│   └── swatch-metal-brass.webp      # Brushed brass metal macro (120x120)
├── vectors/
│   ├── topdown-sofa-3seat.svg       # SVG 2D top-down block for Room Planner
│   ├── topdown-armchair.svg         # SVG 2D top-down block
│   ├── topdown-coffee-table.svg     # SVG 2D top-down block
│   ├── topdown-dining-table.svg     # SVG 2D top-down block
│   ├── topdown-bed-queen.svg        # SVG 2D top-down block
│   └── topdown-credenza.svg         # SVG 2D top-down block
└── placeholders/
    ├── placeholder-product.svg      # Clean fallback placeholder when image fails
    └── placeholder-room.svg         # Architectural fallback floorplan placeholder
```

---

## 3. Image Sizing & Technical Specifications

| Asset Category | Aspect Ratio | Display Size (Desktop) | Display Size (Mobile) | Recommended File Dimensions | Max Target File Size |
|---|---|---|---|---|---|
| **Hero Banners** | `16:9` | $1280 \times 720\text{ px}$ | $375 \times 400\text{ px}$ (crop) | $1920 \times 1080\text{ px}$ | $350\text{ KB}$ |
| **Category Cards** | `4:3` | $300 \times 225\text{ px}$ | $170 \times 130\text{ px}$ | $800 \times 600\text{ px}$ | $120\text{ KB}$ |
| **Inspiration Portfolios**| `3:2` | $400 \times 266\text{ px}$ | $340 \times 226\text{ px}$ | $1200 \times 800\text{ px}$ | $200\text{ KB}$ |
| **Catalog Product Cards**| `4:5` | $280 \times 350\text{ px}$ | $165 \times 206\text{ px}$ | $800 \times 1000\text{ px}$ | $150\text{ KB}$ |
| **Customizer Canvas** | `1:1` / `4:5`| $600 \times 600\text{ px}$ | $340 \times 340\text{ px}$ | $1000 \times 1000\text{ px}$ | $200\text{ KB}$ |
| **Material Swatches** | `1:1` | $36 \times 36\text{ px}$ | $36 \times 36\text{ px}$ | $120 \times 120\text{ px}$ | $25\text{ KB}$ |
| **Planner Top-Down SVGs**| Vector | Responsive viewBox | Responsive viewBox | Scalable inline SVG | $10\text{ KB}$ |

---

## 4. Curated Image Prompts & Sourcing Requirements

Before downloading or generating assets, the user can review these exact specifications and prompts:

### 4.1. Hero & Architectural Inspiration Rooms
- **Asset 1: Hero Banner (`hero-banner.webp`)**
  - *Prompt / Query:* *"Serene modern architectural living room, natural warm daylight, floor-to-ceiling glass windows, low-profile oak lounge chair, sculptural cream linen sectional sofa, neutral micro-cement floor, warm minimalist Japandi aesthetic, architectural digest style, 8k resolution, uncompressed photography."*
- **Asset 2: Japandi Living Room (`insp-japandi-living.webp`)**
  - *Prompt / Query:* *"Japandi living room interior, low-slung solid white oak furniture, cream textured bouclé armchair, slatted wood partition, Akari paper lantern, beige woven rug, calm peaceful atmosphere."*
- **Asset 3: Scandinavian Dining Room (`insp-scandi-dining.webp`)**
  - *Prompt / Query:* *"Scandinavian bright dining room, natural light oak trestle table, six curved minimalist chairs, white architectural pendant light, sheer linen drapes, airy natural ambiance."*
- **Asset 4: Minimalist Bedroom (`insp-minimalist-bed.webp`)**
  - *Prompt / Query:* *"Minimalist sanctuary bedroom, low platform bed in raw unbleached linen, walnut floating bedside tables, subtle warm plaster walls, soft diffused natural shadows."*

### 4.2. Tier 1 & Tier 2 Furniture Products
- **Komorebi Lounge Chair (Tier 2 Featured Piece with Multiple Views):**
  - *Primary (`prod-komorebi-chair.webp`):* Front eye-level shot of modern low-slung accent chair with sculpted solid oak frame and cream bouclé seat cushion, clean neutral ivory background.
  - *Side Angle (`prod-komorebi-chair-side.webp`):* 45-degree isometric side view showing joinery and rake angle.
  - *Detail Angle (`prod-komorebi-chair-detail.webp`):* Macro close-up of mortise-and-tenon wood joint and tactile bouclé weave.
- **Sylvan 3-Seater Minimalist Sofa (Tier 1):**
  - *Primary (`prod-sylvan-sofa.webp`):* Front 3/4 view of a tailored 3-seater linear sofa in natural oatmeal linen with solid oak plinth base on off-white background.
- **Kanso Walnut Sculptural Coffee Table (Tier 1):**
  - *Primary (`prod-kanso-coffee-table.webp`):* Organic pebble-shaped solid American walnut coffee table with three rounded cylindrical legs, top 3/4 perspective.
- **Asahi Extendable Dining Table (Tier 1):**
  - *Primary (`prod-asahi-dining-table.webp`):* Solid white oak dining table with rounded rectangular top and tapered cylindrical legs.
- **Nara Low-Slung Media Credenza (Tier 1):**
  - *Primary (`prod-nara-credenza.webp`):* Low horizontal credenza with tambour slatted sliding oak doors and bronze finger pulls.

### 4.3. Tier 3 Customizer Variant Images
- `prod-komorebi-boucle-cream.webp`: Komorebi chair upholstered in Cream Bouclé fabric.
- `prod-komorebi-velvet-olive.webp`: Komorebi chair upholstered in Olive Velvet fabric.
- `prod-komorebi-linen-charcoal.webp`: Komorebi chair upholstered in Charcoal Linen fabric.
- `prod-komorebi-leather-cognac.webp`: Komorebi chair upholstered in Cognac Top-Grain Leather.

### 4.4. Tier 4 Material Swatches
- `swatch-boucle-cream.webp`: High-resolution macro close-up of woven cream wool bouclé loops.
- `swatch-velvet-olive.webp`: Macro texture of matte olive green upholstery velvet.
- `swatch-linen-charcoal.webp`: Coarse slub weave macro of pure European charcoal-gray linen.
- `swatch-leather-cognac.webp`: Warm cognac-brown top-grain leather showing natural grain.
- `swatch-oak-natural.webp`: Planed raw white oak grain showing subtle rays.
- `swatch-walnut-rich.webp`: Dark chocolate American walnut wood grain with golden undertones.
- `swatch-ash-ebonized.webp`: Deep charcoal-black stained ash wood showing open pore grain.
- `swatch-metal-brass.webp`: Unlacquered brushed brass metal surface with subtle horizontal grain.

---

## 5. Licensing, Attribution & Central Asset Mapping

### Licensing Compliance
- All photography must comply with royalty-free commercial licenses.
- Permitted platforms: **Unsplash** ([Unsplash License](https://unsplash.com/license)) and **Pexels** ([Pexels License](https://www.pexels.com/license/)).
- Sourced images will document author attribution in a dedicated comments section within the central asset mapping registry for good academic practice.

### Central Asset Registry (`client/src/assets/furnitureMapping.js`)
All UI components will resolve image URLs through a central dictionary, ensuring zero broken links and instant fallback handling:

```javascript
// Central Asset Registry Pattern (Implemented in Phase 3)
export const FURNITURE_ASSETS = {
  products: {
    'chair-komorebi': {
      primary: '/assets/products/prod-komorebi-chair.webp',
      angles: [
        '/assets/products/prod-komorebi-chair.webp',
        '/assets/products/prod-komorebi-chair-side.webp',
        '/assets/products/prod-komorebi-chair-detail.webp'
      ],
      variants: {
        'fabric-boucle-cream': '/assets/variants/prod-komorebi-boucle-cream.webp',
        'fabric-velvet-olive': '/assets/variants/prod-komorebi-velvet-olive.webp',
        'fabric-linen-charcoal': '/assets/variants/prod-komorebi-linen-charcoal.webp',
        'fabric-leather-cognac': '/assets/variants/prod-komorebi-leather-cognac.webp'
      },
      fallback: '/assets/placeholders/placeholder-product.svg'
    },
    'sofa-sylvan': {
      primary: '/assets/products/prod-sylvan-sofa.webp',
      fallback: '/assets/placeholders/placeholder-product.svg'
    }
  },
  swatches: {
    'fabric-boucle-cream': '/assets/swatches/swatch-boucle-cream.webp',
    'finish-oak-natural': '/assets/swatches/swatch-oak-natural.webp'
  }
};
```
