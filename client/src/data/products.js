/**
 * Décora – Central Product Catalog & Specifications Registry
 * Single Source of Truth for all furniture pieces across:
 * - Homepage Featured Collection
 * - Furniture Catalog (/catalog)
 * - Product Detail Page (/catalog/:id)
 * - Customizer (/customizer/:productId)
 * - Wishlist & Design Boards
 * - 2D Metric Spatial Room Planner
 * 
 * Demonstrative Standards:
 * - Prices in INR (₹)
 * - Dimensions in Metric Centimeters (cm: Width × Depth × Height)
 * - Weights in kg
 * - Specifications reflect planned architectural and design benchmarks for academic demonstration.
 */

export const PRODUCTS = [
  {
    id: 'chair-komorebi',
    slug: 'komorebi-lounge-chair',
    name: 'Komorebi Lounge Chair',
    title: 'Komorebi Lounge Chair',
    category: 'Seating',
    roomType: 'living',
    style: 'Japandi',
    basePrice: 28000,
    inStock: true,
    stockCount: 8,
    dimensions: {
      width: 78,
      depth: 84,
      height: 72,
      formatted: '78 × 84 × 72 cm',
    },
    weightKg: 18.5,
    materials: ['Solid Natural Beech Base', 'Natural Belgian Linen', 'High-Resilience Foam'],
    primaryMaterial: 'Solid Beech & Natural Linen (Oak / Walnut Upgrade Available)',
    description:
      'Handcrafted low-slung accent armchair featuring sculpted timber joinery, mortise-and-tenon construction, and breathable natural linen. Baseline specification features a natural beech frame; customizable with solid White Oak, Smoked Walnut, or tactile Bouclé.',
    editorialNote:
      'Designed around Japanese wabi-sabi principles, balancing tactile lightness with profound structural grounding.',
    image: '/assets/categories/cat-living.svg',
    gallery: [
      '/assets/categories/cat-living.svg',
    ],
    fallback: '/assets/placeholders/placeholder-product.svg',
    tag: 'Best Seller',
    featured: true,
    customizable: true,
    customizationOptions: {
      fabrics: [
        { id: 'fab-linen', name: 'Natural Belgian Linen (Standard)', delta: 0, colorHex: '#EAE5DB', texture: 'linen' },
        { id: 'fab-boucle', name: 'Cream Bouclé', delta: 3500, colorHex: '#F6F3ED', texture: 'woven' },
        { id: 'fab-velvet', name: 'Olive Velvet', delta: 4200, colorHex: '#425A4C', texture: 'velvet' },
        { id: 'fab-leather', name: 'Cognac Leather', delta: 8000, colorHex: '#8C5A32', texture: 'leather' },
      ],
      finishes: [
        { id: 'fin-beech', name: 'Natural Beech (Standard)', delta: 0, colorHex: '#EFE7DA' },
        { id: 'fin-oak', name: 'Natural White Oak', delta: 2000, colorHex: '#D8C8B5' },
        { id: 'fin-walnut', name: 'Rich Walnut', delta: 3500, colorHex: '#6B543D' },
        { id: 'fin-ash', name: 'Ebonized Black Ash', delta: 2500, colorHex: '#292824' },
      ],
      sizes: [
        { id: 'size-std', name: 'Standard (78 × 84 cm)', delta: 0, scaleFactor: 1.0 },
        { id: 'size-grand', name: 'Grand Scale (+10% width)', delta: 4000, scaleFactor: 1.1 },
      ],
    },
    specifications: {
      frameMaterial: 'Solid Beech Baseline Construction (Solid White Oak Upgradeable)',
      joinery: 'Mortise & Tenon with Concealed Architectural Fasteners',
      cushionFill: 'Multi-Density High-Resilience Polyurethane Foam with Feather-Blend Wrap',
      origin: 'Prototyped in Jaipur Studio, India (Illustrative Specification)',
      warranty: '5-Year Structural Frame Warranty (Planned Benchmark Specification)',
      assemblyRequired: false,
      careInstructions: 'Dust with soft dry microfiber cloth. Spot clean upholstery with water-free solvent.',
    },
    relatedProductIds: ['table-kanso', 'sofa-sylvan', 'lamp-kanso-stone'],
    prompt:
      'Front eye-level view of modern low-slung accent chair with sculpted solid oak frame and cream bouclé cushion, clean neutral ivory background.',
  },
  {
    id: 'sofa-sylvan',
    slug: 'sylvan-minimalist-sofa',
    name: 'Sylvan 3-Seater Minimalist Sofa',
    title: 'Sylvan 3-Seater Minimalist Sofa',
    category: 'Seating',
    roomType: 'living',
    style: 'Minimalist',
    basePrice: 45000,
    inStock: true,
    stockCount: 4,
    dimensions: {
      width: 220,
      depth: 90,
      height: 76,
      formatted: '220 × 90 × 76 cm',
    },
    weightKg: 54.0,
    materials: ['Solid White Oak', 'Belgian Linen', 'Pocket Springs'],
    primaryMaterial: 'Solid White Oak & Belgian Linen',
    description:
      'Architectural 3-seater linear sofa characterized by a recessed solid oak plinth, deep feather-blend seats, and breathable Belgian flax linen upholstery.',
    editorialNote:
      'Low, grounded geometry engineered to maintain open architectural sightlines across large living rooms.',
    image: '/assets/categories/cat-living.svg',
    gallery: [
      '/assets/categories/cat-living.svg',
    ],
    fallback: '/assets/placeholders/placeholder-product.svg',
    tag: 'Customizable',
    featured: true,
    customizable: true,
    customizationOptions: {
      fabrics: [
        { id: 'fab-linen-raw', name: 'Unbleached Flax Linen', delta: 0, colorHex: '#EAE5DB', texture: 'linen' },
        { id: 'fab-linen-charcoal', name: 'Slate Linen', delta: 3000, colorHex: '#4A4C50', texture: 'linen' },
        { id: 'fab-boucle-warm', name: 'Oatmeal Bouclé', delta: 6500, colorHex: '#F0ECE1', texture: 'woven' },
      ],
      finishes: [
        { id: 'fin-oak', name: 'Natural White Oak', delta: 0, colorHex: '#D8C8B5' },
        { id: 'fin-walnut', name: 'Smoked Walnut', delta: 4000, colorHex: '#5C4838' },
      ],
      sizes: [
        { id: 'size-3seater', name: '3-Seater (220 cm)', delta: 0, scaleFactor: 1.0 },
        { id: 'size-4seater', name: '4-Seater Extended (260 cm)', delta: 8500, scaleFactor: 1.18 },
      ],
    },
    specifications: {
      frameMaterial: 'Kiln-Dried Hardwood Core with Solid White Oak Plinth Base',
      joinery: 'Corner-Blocked Double-Dowelled Frame Construction',
      cushionFill: 'High-Resilience Cold Foam Core encased in channelled duck feather blend',
      origin: 'Prototyped in Bengaluru Studio, India (Illustrative Specification)',
      warranty: '10-Year Structural Frame Warranty (Planned Benchmark Specification)',
      assemblyRequired: false,
      careInstructions: 'Removable slipcovers. Dry clean only. Fluff cushions weekly for optimal loft.',
    },
    relatedProductIds: ['chair-komorebi', 'table-kanso', 'credenza-nara'],
    prompt:
      'Front 3/4 view of a tailored 3-seater linear sofa in natural oatmeal linen with solid oak plinth base.',
  },
  {
    id: 'table-kanso',
    slug: 'kanso-sculptural-coffee-table',
    name: 'Kanso Sculptural Coffee Table',
    title: 'Kanso Sculptural Coffee Table',
    category: 'Tables',
    roomType: 'living',
    style: 'Japandi',
    basePrice: 18500,
    inStock: true,
    stockCount: 12,
    dimensions: {
      width: 110,
      depth: 60,
      height: 42,
      formatted: '110 × 60 × 42 cm',
    },
    weightKg: 22.0,
    materials: ['Solid American Walnut', 'Matte Wax Finish'],
    primaryMaterial: 'Solid American Walnut',
    description:
      'Organic pebble-contoured solid walnut coffee table supported by three rounded pillar legs. Soft chamfered edges create a tactile sculptural centerpiece.',
    editorialNote:
      'Asymmetrical biophilic silhouette inspired by smoothed river stones in Kyoto zen gardens.',
    image: '/assets/categories/cat-living.svg',
    gallery: [
      '/assets/categories/cat-living.svg',
    ],
    fallback: '/assets/placeholders/placeholder-product.svg',
    tag: 'Solid Wood',
    featured: true,
    customizable: false,
    specifications: {
      frameMaterial: 'Solid American Black Walnut (Kiln-Dried Grade A)',
      joinery: 'Deep Blind Dowel Leg Joinery',
      cushionFill: 'N/A',
      origin: 'Prototyped in Mysuru Studio, India (Illustrative Specification)',
      warranty: '5-Year Structural Frame Warranty (Planned Benchmark Specification)',
      assemblyRequired: true,
      careInstructions: 'Protect with coasters. Clean with damp cloth and apply organic beeswax annually.',
    },
    relatedProductIds: ['chair-komorebi', 'sofa-sylvan', 'lamp-kanso-stone'],
    prompt:
      'Organic pebble-shaped solid American walnut coffee table with three rounded cylindrical legs.',
  },
  {
    id: 'table-asahi',
    slug: 'asahi-solid-oak-dining-table',
    name: 'Asahi Solid Oak Dining Table',
    title: 'Asahi Solid Oak Dining Table',
    category: 'Tables',
    roomType: 'dining',
    style: 'Scandinavian',
    basePrice: 52000,
    inStock: false,
    stockCount: 0,
    dimensions: {
      width: 180,
      depth: 90,
      height: 75,
      formatted: '180 × 90 × 75 cm',
    },
    weightKg: 48.0,
    materials: ['Solid White Oak', 'Polyurethane Protective Coat'],
    primaryMaterial: 'Solid White Oak',
    description:
      'Minimalist trestle dining table with rounded rectangular top and gently splayed cylindrical legs. Comfortably accommodates 6 to 8 diners.',
    editorialNote:
      'Balanced proportions emphasizing continuous wood grain across the entire dining surface.',
    image: '/assets/categories/cat-dining.svg',
    gallery: [
      '/assets/categories/cat-dining.svg',
    ],
    fallback: '/assets/placeholders/placeholder-product.svg',
    tag: 'Made to Order',
    featured: true,
    customizable: true,
    customizationOptions: {
      fabrics: [],
      finishes: [
        { id: 'fin-oak-light', name: 'Natural Whitewash Oak', delta: 0, colorHex: '#EAE4D9' },
        { id: 'fin-oak-smoked', name: 'Smoked Honey Oak', delta: 3000, colorHex: '#C5A882' },
        { id: 'fin-oak-ebony', name: 'Ebonized Oak', delta: 3500, colorHex: '#2A2927' },
      ],
      sizes: [
        { id: 'size-6p', name: '6-Seater (180 × 90 cm)', delta: 0, scaleFactor: 1.0 },
        { id: 'size-8p', name: '8-Seater (220 × 95 cm)', delta: 9000, scaleFactor: 1.22 },
      ],
    },
    specifications: {
      frameMaterial: 'Solid European White Oak Plank Construction',
      joinery: 'Concealed Steel Reinforcement & Mortise Tenons',
      cushionFill: 'N/A',
      origin: 'Prototyped in Jaipur Studio, India (Illustrative Specification)',
      warranty: '10-Year Structural Frame Warranty (Planned Benchmark Specification)',
      assemblyRequired: true,
      careInstructions: 'Wipe clean with soft damp cloth. Never use harsh abrasive chemicals.',
    },
    relatedProductIds: ['chair-nordic-dining', 'bench-kyoto', 'pendant-scandi-dome'],
    prompt:
      'Solid white oak dining table with rounded rectangular top and tapered cylindrical legs.',
  },
  {
    id: 'bed-linen-sanctuary',
    slug: 'aura-upholstered-platform-bed',
    name: 'Aura Upholstered Platform Bed',
    title: 'Aura Upholstered Platform Bed',
    category: 'Beds',
    roomType: 'bedroom',
    style: 'Minimalist',
    basePrice: 38000,
    inStock: true,
    stockCount: 5,
    dimensions: {
      width: 160,
      depth: 205,
      height: 95,
      formatted: '160 × 205 × 95 cm',
    },
    weightKg: 62.0,
    materials: ['Solid White Oak', 'Raw European Linen', 'Slat Base'],
    primaryMaterial: 'Raw European Linen & Oak Plinth',
    description:
      'Low-slung architectural platform bed featuring a padded headboard upholstered in natural raw linen resting upon a recessed solid oak plinth.',
    editorialNote:
      'Designed to evoke restful serenity with acoustic dampening fabric and integrated slatted support.',
    image: '/assets/categories/cat-bedroom.svg',
    gallery: [
      '/assets/categories/cat-bedroom.svg',
    ],
    fallback: '/assets/placeholders/placeholder-product.svg',
    tag: 'Popular',
    featured: true,
    customizable: true,
    customizationOptions: {
      fabrics: [
        { id: 'fab-linen-sand', name: 'Warm Sand Linen', delta: 0, colorHex: '#DDD3C4', texture: 'linen' },
        { id: 'fab-linen-taupe', name: 'Muted Taupe Linen', delta: 2500, colorHex: '#A58B70', texture: 'linen' },
        { id: 'fab-boucle-ivory', name: 'Ivory Bouclé', delta: 5000, colorHex: '#F6F3ED', texture: 'woven' },
      ],
      finishes: [
        { id: 'fin-oak', name: 'Natural White Oak Plinth', delta: 0, colorHex: '#D8C8B5' },
        { id: 'fin-walnut', name: 'Smoked Walnut Plinth', delta: 3000, colorHex: '#6B543D' },
      ],
      sizes: [
        { id: 'size-queen', name: 'Queen (160 × 205 cm)', delta: 0, scaleFactor: 1.0 },
        { id: 'size-king', name: 'King (180 × 205 cm)', delta: 6000, scaleFactor: 1.12 },
      ],
    },
    specifications: {
      frameMaterial: 'Solid White Oak & Birch Plywood Slats',
      joinery: 'Interlocking Heavy-Gauge Steel Bed Rail Brackets',
      cushionFill: 'High-Density Foam Headboard Core',
      origin: 'Prototyped in Bengaluru Studio, India (Illustrative Specification)',
      warranty: '5-Year Structural Frame Warranty (Planned Benchmark Specification)',
      assemblyRequired: true,
      careInstructions: 'Vacuum fabric lightly. Clean wood plinth with dry cloth.',
    },
    relatedProductIds: ['nightstand-aura', 'lamp-kanso-stone', 'wardrobe-koto'],
    prompt:
      'Low platform bed upholstered in raw unbleached linen with solid wood plinth foundation.',
  },
  {
    id: 'credenza-nara',
    slug: 'nara-slatted-media-credenza',
    name: 'Nara Slatted Media Credenza',
    title: 'Nara Slatted Media Credenza',
    category: 'Storage',
    roomType: 'living',
    style: 'Japandi',
    basePrice: 34000,
    inStock: true,
    stockCount: 6,
    dimensions: {
      width: 160,
      depth: 45,
      height: 52,
      formatted: '160 × 45 × 52 cm',
    },
    weightKg: 38.0,
    materials: ['Solid White Oak', 'Slatted Wood', 'Bronze Hardware'],
    primaryMaterial: 'Solid White Oak',
    description:
      'Architectural low credenza featuring continuous vertical slatted tambour doors that slide smoothly around curved corners. Cable-ready with acoustic passthrough.',
    editorialNote:
      'Tambour craftsmanship allows infrared remote signals while concealing modern home electronics.',
    image: '/assets/categories/cat-office.svg',
    gallery: [
      '/assets/categories/cat-office.svg',
    ],
    fallback: '/assets/placeholders/placeholder-product.svg',
    tag: 'Crafted Joinery',
    featured: true,
    customizable: false,
    specifications: {
      frameMaterial: 'Solid European White Oak & Oak Veneer Panels',
      joinery: 'Dovetail Drawers & Precision Ball-Bearing Tambour Tracks',
      cushionFill: 'N/A',
      origin: 'Prototyped in Jaipur Studio, India (Illustrative Specification)',
      warranty: '5-Year Structural Frame Warranty (Planned Benchmark Specification)',
      assemblyRequired: false,
      careInstructions: 'Clean with damp cloth. Keep tambour tracks free of dust.',
    },
    relatedProductIds: ['sofa-sylvan', 'chair-komorebi', 'table-kanso'],
    prompt:
      'Low horizontal credenza featuring four slatted tambour sliding doors in natural oak.',
  },
  {
    id: 'chair-nordic-dining',
    slug: 'nordic-curved-dining-chair',
    name: 'Nordic Curved Dining Chair',
    title: 'Nordic Curved Dining Chair',
    category: 'Seating',
    roomType: 'dining',
    style: 'Scandinavian',
    basePrice: 16500,
    inStock: true,
    stockCount: 16,
    dimensions: {
      width: 54,
      depth: 52,
      height: 76,
      formatted: '54 × 52 × 76 cm',
    },
    weightKg: 6.8,
    materials: ['Solid White Oak', 'Hand-Woven Paper Cord'],
    primaryMaterial: 'Solid White Oak & Woven Cord',
    description:
      'Sculptural curved steam-bent oak backrest paired with a hand-woven natural paper cord seat. Lightweight, ergonomic, and timelessly Scandinavian.',
    editorialNote:
      'Each seat requires 120 metres of continuous 3-ply natural paper cord hand-woven over 4 hours.',
    image: '/assets/categories/cat-dining.svg',
    gallery: [
      '/assets/categories/cat-dining.svg',
    ],
    fallback: '/assets/placeholders/placeholder-product.svg',
    tag: 'Hand-Woven',
    featured: false,
    customizable: true,
    customizationOptions: {
      fabrics: [],
      finishes: [
        { id: 'fin-oak-natural', name: 'Natural Soap Oak', delta: 0, colorHex: '#E2D9CC' },
        { id: 'fin-oak-black', name: 'Black Stained Oak', delta: 1500, colorHex: '#252525' },
      ],
      sizes: [
        { id: 'size-std', name: 'Standard Dining Height (45 cm seat)', delta: 0, scaleFactor: 1.0 },
      ],
    },
    specifications: {
      frameMaterial: 'Steam-Bent Solid European White Oak',
      joinery: 'Traditional Mortise & Tenon Joinery',
      cushionFill: 'N/A (Paper Cord Suspension)',
      origin: 'Prototyped in Bengaluru Studio, India (Illustrative Specification)',
      warranty: '5-Year Structural Frame Warranty (Planned Benchmark Specification)',
      assemblyRequired: false,
      careInstructions: 'Vacuum paper cord with soft brush. Clean wood with soft dry cloth.',
    },
    relatedProductIds: ['table-asahi', 'bench-kyoto', 'pendant-scandi-dome'],
    prompt:
      'Minimalist solid oak dining chair with curved steam-bent backrest and woven cord seat.',
  },
  {
    id: 'desk-atelier',
    slug: 'atelier-executive-desk',
    name: 'Atelier Solid Walnut Executive Desk',
    title: 'Atelier Solid Walnut Executive Desk',
    category: 'Tables',
    roomType: 'office',
    style: 'Minimalist',
    basePrice: 42000,
    inStock: true,
    stockCount: 4,
    dimensions: {
      width: 150,
      depth: 70,
      height: 75,
      formatted: '150 × 70 × 75 cm',
    },
    weightKg: 42.0,
    materials: ['Solid American Walnut', 'Brushed Brass', 'Leather Inlay'],
    primaryMaterial: 'Solid American Walnut',
    description:
      'Refined studio workstation crafted with solid walnut waterfall edges, two discreet soft-close drawers, and integrated brass cable grommets.',
    editorialNote:
      'Proportioned for intentional creative work, offering tactile warmth and distraction-free organization.',
    image: '/assets/categories/cat-office.svg',
    gallery: [
      '/assets/categories/cat-office.svg',
    ],
    fallback: '/assets/placeholders/placeholder-product.svg',
    tag: 'Studio Edition',
    featured: false,
    customizable: true,
    customizationOptions: {
      fabrics: [],
      finishes: [
        { id: 'fin-walnut', name: 'American Walnut & Brass', delta: 0, colorHex: '#6B543D' },
        { id: 'fin-oak', name: 'White Oak & Bronze', delta: -2000, colorHex: '#D8C8B5' },
      ],
      sizes: [
        { id: 'size-compact', name: 'Studio Compact (130 × 65 cm)', delta: -3500, scaleFactor: 0.88 },
        { id: 'size-exec', name: 'Executive Standard (150 × 70 cm)', delta: 0, scaleFactor: 1.0 },
      ],
    },
    specifications: {
      frameMaterial: 'Solid American Black Walnut & Brushed Solid Brass Hardware',
      joinery: 'Dovetailed Solid Wood Drawers with Precision Soft-Close Runners',
      cushionFill: 'N/A',
      origin: 'Prototyped in Mysuru Studio, India (Illustrative Specification)',
      warranty: '5-Year Structural Frame Warranty (Planned Benchmark Specification)',
      assemblyRequired: true,
      careInstructions: 'Protect with desk pad. Wipe clean with dry soft microfiber cloth.',
    },
    relatedProductIds: ['bookshelf-linear', 'chair-komorebi', 'lamp-kanso-stone'],
    prompt:
      'Front eye-level view of solid walnut executive desk with brushed brass pulls and recessed cable channel.',
  },
  {
    id: 'nightstand-aura',
    slug: 'aura-floating-nightstand',
    name: 'Aura Floating Solid Oak Nightstand',
    title: 'Aura Floating Solid Oak Nightstand',
    category: 'Storage',
    roomType: 'bedroom',
    style: 'Japandi',
    basePrice: 12000,
    inStock: true,
    stockCount: 14,
    dimensions: {
      width: 45,
      depth: 38,
      height: 25,
      formatted: '45 × 38 × 25 cm',
    },
    weightKg: 8.5,
    materials: ['Solid White Oak', 'Felt Drawer Lining'],
    primaryMaterial: 'Solid White Oak',
    description:
      'Wall-mountable architectural bedside drawer creating an airy floating silhouette. Concealed under-mount slide with integrated acoustic felt lining.',
    editorialNote:
      'Frees bedroom floor space to amplify the serene open feel of minimalist platform beds.',
    image: '/assets/categories/cat-bedroom.svg',
    gallery: [
      '/assets/categories/cat-bedroom.svg',
    ],
    fallback: '/assets/placeholders/placeholder-product.svg',
    tag: 'Crafted Joinery',
    featured: false,
    customizable: false,
    specifications: {
      frameMaterial: 'Solid European White Oak (Kiln-Dried Hardwood)',
      joinery: 'Mitred Corner Joints with Internal Splines',
      cushionFill: 'N/A',
      origin: 'Prototyped in Jaipur Studio, India (Illustrative Specification)',
      warranty: '5-Year Structural Frame Warranty (Planned Benchmark Specification)',
      assemblyRequired: true,
      careInstructions: 'Ensure mounting to solid wall studs or heavy masonry anchors.',
    },
    relatedProductIds: ['bed-linen-sanctuary', 'lamp-kanso-stone', 'mirror-arch-oslo'],
    prompt:
      'Minimalist wall-mounted floating oak nightstand with seamless single drawer.',
  },
  {
    id: 'wardrobe-koto',
    slug: 'koto-architectural-wardrobe',
    name: 'Koto Architectural Slatted Wardrobe',
    title: 'Koto Architectural Slatted Wardrobe',
    category: 'Storage',
    roomType: 'bedroom',
    style: 'Minimalist',
    basePrice: 68000,
    inStock: false,
    stockCount: 0,
    dimensions: {
      width: 120,
      depth: 60,
      height: 200,
      formatted: '120 × 60 × 200 cm',
    },
    weightKg: 86.0,
    materials: ['Solid White Oak', 'Natural Linen Door Panels', 'Bronze Rods'],
    primaryMaterial: 'Solid White Oak & Linen Panels',
    description:
      'Floor-to-ceiling proportions framed in solid oak with breathable semi-sheer Belgian linen door inserts. Includes modular hanging rails and solid oak shelving.',
    editorialNote:
      'Replaces sterile closet doors with warm tactile textile screening that softens bedroom acoustics.',
    image: '/assets/categories/cat-bedroom.svg',
    gallery: [
      '/assets/categories/cat-bedroom.svg',
    ],
    fallback: '/assets/placeholders/placeholder-product.svg',
    tag: 'Made to Order',
    featured: false,
    customizable: true,
    customizationOptions: {
      fabrics: [
        { id: 'fab-linen-light', name: 'Raw Natural Linen Panels', delta: 0, colorHex: '#EAE5DB', texture: 'linen' },
        { id: 'fab-linen-taupe', name: 'Warm Taupe Linen Panels', delta: 2500, colorHex: '#A58B70', texture: 'linen' },
      ],
      finishes: [
        { id: 'fin-oak', name: 'Natural White Oak', delta: 0, colorHex: '#D8C8B5' },
        { id: 'fin-walnut', name: 'Rich Smoked Walnut', delta: 6000, colorHex: '#5C4838' },
      ],
      sizes: [
        { id: 'size-2door', name: '2-Door (120 cm width)', delta: 0, scaleFactor: 1.0 },
        { id: 'size-3door', name: '3-Door Expanded (180 cm width)', delta: 18000, scaleFactor: 1.5 },
      ],
    },
    specifications: {
      frameMaterial: 'Solid White Oak & Architectural Veneer Core',
      joinery: 'Concealed Engineered Hinges with Soft-Close Mechanics',
      cushionFill: 'N/A',
      origin: 'Prototyped in Bengaluru Studio, India (Illustrative Specification)',
      warranty: '10-Year Structural Frame Warranty (Planned Benchmark Specification)',
      assemblyRequired: true,
      careInstructions: 'Anti-tip wall anchoring hardware included and mandatory. Vacuum linen panels.',
    },
    relatedProductIds: ['bed-linen-sanctuary', 'nightstand-aura', 'mirror-arch-oslo'],
    prompt:
      'Tall architectural wardrobe in white oak with natural linen-insert cabinet doors.',
  },
  {
    id: 'bench-kyoto',
    slug: 'kyoto-solid-oak-bench',
    name: 'Kyoto Solid Oak & Cane Bench',
    title: 'Kyoto Solid Oak & Cane Bench',
    category: 'Seating',
    roomType: 'dining',
    style: 'Japandi',
    basePrice: 21000,
    inStock: true,
    stockCount: 7,
    dimensions: {
      width: 140,
      depth: 40,
      height: 45,
      formatted: '140 × 40 × 45 cm',
    },
    weightKg: 14.0,
    materials: ['Solid White Oak', 'Hand-Woven Natural Rattan Cane'],
    primaryMaterial: 'Solid White Oak & Natural Rattan',
    description:
      'Versatile low bench featuring an airy woven hexagonal rattan cane seat set into a sculpted solid oak frame with curved cylindrical legs.',
    editorialNote:
      'Ideal for dining table banquette seating, entryways, or placed at the foot of platform beds.',
    image: '/assets/categories/cat-dining.svg',
    gallery: [
      '/assets/categories/cat-dining.svg',
    ],
    fallback: '/assets/placeholders/placeholder-product.svg',
    tag: 'Crafted Joinery',
    featured: false,
    customizable: false,
    specifications: {
      frameMaterial: 'Solid European White Oak & Natural Hexagonal Cane Weave',
      joinery: 'Double Through-Tenons with Exposed Oak Wedges',
      cushionFill: 'N/A',
      origin: 'Prototyped in Jaipur Studio, India (Illustrative Specification)',
      warranty: '5-Year Structural Frame Warranty (Planned Benchmark Specification)',
      assemblyRequired: false,
      careInstructions: 'Dust cane weave gently. Keep away from direct excessive radiator heat.',
    },
    relatedProductIds: ['table-asahi', 'chair-nordic-dining', 'pendant-scandi-dome'],
    prompt:
      'Solid oak minimalist bench with natural rattan cane woven seat and rounded legs.',
  },
  {
    id: 'bookshelf-linear',
    slug: 'linear-architectural-bookshelf',
    name: 'Linear Open Column Bookshelf',
    title: 'Linear Open Column Bookshelf',
    category: 'Storage',
    roomType: 'office',
    style: 'Scandinavian',
    basePrice: 36500,
    inStock: true,
    stockCount: 5,
    dimensions: {
      width: 100,
      depth: 35,
      height: 190,
      formatted: '100 × 35 × 190 cm',
    },
    weightKg: 34.0,
    materials: ['Solid White Oak', 'Matte Sand-Coated Steel'],
    primaryMaterial: 'Solid White Oak & Powder-Coated Steel',
    description:
      'Open architectural shelving unit pairing rhythmic vertical oak dividers with sand-coated steel structural uprights. Ideal for books, ceramics, and architectural artifacts.',
    editorialNote:
      'Staggered shelf compartments create dynamic geometric display volumes without visual bulk.',
    image: '/assets/categories/cat-office.svg',
    gallery: [
      '/assets/categories/cat-office.svg',
    ],
    fallback: '/assets/placeholders/placeholder-product.svg',
    tag: 'Architectural',
    featured: false,
    customizable: false,
    specifications: {
      frameMaterial: 'Solid European White Oak & Powder-Coated Carbon Steel',
      joinery: 'Precision Threaded Steel Rods with Concealed Hex Tensioners',
      cushionFill: 'N/A',
      origin: 'Prototyped in Bengaluru Studio, India (Illustrative Specification)',
      warranty: '5-Year Structural Frame Warranty (Planned Benchmark Specification)',
      assemblyRequired: true,
      careInstructions: 'Must be anchored to wall using included safety kit. Dust wood with microfiber.',
    },
    relatedProductIds: ['desk-atelier', 'chair-komorebi', 'lamp-kanso-stone'],
    prompt:
      'Tall open geometric bookshelf in white oak and minimalist muted steel uprights.',
  },
  {
    id: 'lamp-kanso-stone',
    slug: 'kanso-travertine-table-lamp',
    name: 'Kanso Travertine Stone Table Lamp',
    title: 'Kanso Travertine Stone Table Lamp',
    category: 'Lighting',
    roomType: 'living',
    style: 'Japandi',
    basePrice: 9500,
    inStock: true,
    stockCount: 20,
    dimensions: {
      width: 32,
      depth: 32,
      height: 48,
      formatted: '32 × 32 × 48 cm',
    },
    weightKg: 7.2,
    materials: ['Solid Natural Travertine', 'Belgian Linen Shade', 'Solid Brass'],
    primaryMaterial: 'Solid Natural Travertine Stone',
    description:
      'Cylindrical base carved from solid unpolished Italian travertine stone, paired with a tapered linen drum shade and solid brass turn switch.',
    editorialNote:
      'Natural porous travertine crevices guarantee that every lamp is completely unique in texture and tone.',
    image: '/assets/categories/cat-living.svg',
    gallery: [
      '/assets/categories/cat-living.svg',
    ],
    fallback: '/assets/placeholders/placeholder-product.svg',
    tag: 'Natural Stone',
    featured: false,
    customizable: false,
    specifications: {
      frameMaterial: 'Solid Natural Travertine Stone & Linen Shade',
      joinery: 'Solid Brass Turned Fittings & Woven Twisted Silk Cord',
      cushionFill: 'N/A',
      origin: 'Prototyped in Rajasthan Stoneworks, India (Illustrative Specification)',
      warranty: '2-Year Electrical Component Warranty (Planned Benchmark Specification)',
      assemblyRequired: false,
      careInstructions: 'E27 warm LED bulb (included). Wipe stone with dry cloth.',
    },
    relatedProductIds: ['nightstand-aura', 'table-kanso', 'chair-komorebi'],
    prompt:
      'Sculptural table lamp with solid beige travertine cylinder base and linen drum shade.',
  },
  {
    id: 'pendant-scandi-dome',
    slug: 'oslo-spun-aluminum-pendant',
    name: 'Oslo Architectural Dome Pendant',
    title: 'Oslo Architectural Dome Pendant',
    category: 'Lighting',
    roomType: 'dining',
    style: 'Scandinavian',
    basePrice: 14000,
    inStock: true,
    stockCount: 11,
    dimensions: {
      width: 45,
      depth: 45,
      height: 28,
      formatted: '45 × 45 × 28 cm',
    },
    weightKg: 3.5,
    materials: ['Spun Aluminum', 'Solid White Oak Finial', 'Fabric Cable'],
    primaryMaterial: 'Spun Aluminum & Oak Finial',
    description:
      'Generous hemispherical pendant lamp in matte sand-lacquered aluminum crowned with a turned solid oak finial. Casts warm, glare-free downward illumination.',
    editorialNote:
      'Designed specifically to anchor dining tables with comfortable ambient dining illumination.',
    image: '/assets/categories/cat-dining.svg',
    gallery: [
      '/assets/categories/cat-dining.svg',
    ],
    fallback: '/assets/placeholders/placeholder-product.svg',
    tag: 'Popular',
    featured: false,
    customizable: false,
    specifications: {
      frameMaterial: 'Heavy-Gauge Spun Aluminum & Turned White Oak',
      joinery: 'Solid Brass Strain Relief & 2-Metre Braided Fabric Cable',
      cushionFill: 'N/A',
      origin: 'Prototyped in Bengaluru Studio, India (Illustrative Specification)',
      warranty: '2-Year Electrical Component Warranty (Planned Benchmark Specification)',
      assemblyRequired: true,
      careInstructions: 'Professional installation recommended. Compatible with dimmable E27 LED bulbs.',
    },
    relatedProductIds: ['table-asahi', 'chair-nordic-dining', 'bench-kyoto'],
    prompt:
      'Large matte cream dome pendant lamp with natural oak top finial hanging over dining table.',
  },
  {
    id: 'lounge-florence',
    slug: 'florence-velvet-accent-chair',
    name: 'Florence Curved Velvet Accent Chair',
    title: 'Florence Curved Velvet Accent Chair',
    category: 'Seating',
    roomType: 'living',
    style: 'Mid-Century',
    basePrice: 32000,
    inStock: true,
    stockCount: 6,
    dimensions: {
      width: 82,
      depth: 80,
      height: 74,
      formatted: '82 × 80 × 74 cm',
    },
    weightKg: 19.0,
    materials: ['Solid Smoked Walnut', 'Matte Cotton Velvet', 'Brass Ferrules'],
    primaryMaterial: 'Solid Smoked Walnut & Cotton Velvet',
    description:
      'Enveloping barrel armchair featuring continuous curved back cushioning upholstered in moss green velvet, resting upon tapered walnut legs with brass feet.',
    editorialNote:
      'A warm nod to Italian mid-century modernism, offering tactile indulgence and posture support.',
    image: '/assets/categories/cat-living.svg',
    gallery: [
      '/assets/categories/cat-living.svg',
    ],
    fallback: '/assets/placeholders/placeholder-product.svg',
    tag: 'Crafted Joinery',
    featured: false,
    customizable: true,
    customizationOptions: {
      fabrics: [
        { id: 'fab-velvet-moss', name: 'Moss Green Velvet', delta: 0, colorHex: '#4A5D4E', texture: 'velvet' },
        { id: 'fab-velvet-ochre', name: 'Ochre Gold Velvet', delta: 0, colorHex: '#9E7D3B', texture: 'velvet' },
        { id: 'fab-boucle-cream', name: 'Ivory Bouclé', delta: 1500, colorHex: '#F6F3ED', texture: 'woven' },
      ],
      finishes: [
        { id: 'fin-walnut', name: 'Smoked Walnut with Brass', delta: 0, colorHex: '#5C4838' },
        { id: 'fin-oak', name: 'Natural Oak with Bronze', delta: -1000, colorHex: '#D8C8B5' },
      ],
      sizes: [
        { id: 'size-std', name: 'Standard Barrel (82 × 80 cm)', delta: 0, scaleFactor: 1.0 },
      ],
    },
    specifications: {
      frameMaterial: 'Solid Smoked Walnut & Cold-Cured Foam Core',
      joinery: 'Doweled Hardwood Frame & Solid Brass Leg Ferrules',
      cushionFill: 'High-Resilience Foam wrapped in Dacron batting',
      origin: 'Prototyped in Mysuru Studio, India (Illustrative Specification)',
      warranty: '5-Year Structural Frame Warranty (Planned Benchmark Specification)',
      assemblyRequired: false,
      careInstructions: 'Brush velvet gently in direction of nap with soft horsehair brush.',
    },
    relatedProductIds: ['table-kanso', 'sofa-sylvan', 'lamp-kanso-stone'],
    prompt:
      'Curved barrel armchair upholstered in moss green matte cotton velvet on tapered walnut legs.',
  },
  {
    id: 'mirror-arch-oslo',
    slug: 'oslo-arch-floor-mirror',
    name: 'Oslo Solid Oak Architectural Arch Mirror',
    title: 'Oslo Solid Oak Architectural Arch Mirror',
    category: 'Storage',
    roomType: 'bedroom',
    style: 'Scandinavian',
    basePrice: 11500,
    inStock: true,
    stockCount: 9,
    dimensions: {
      width: 65,
      depth: 4,
      height: 175,
      formatted: '65 × 4 × 175 cm',
    },
    weightKg: 16.5,
    materials: ['Solid White Oak', 'Shatter-Proof High-Clarity Glass'],
    primaryMaterial: 'Solid White Oak Frame',
    description:
      'Full-length gently arched standing mirror framed in seamless steam-bent solid white oak. Designed to lean gracefully against walls or mount securely.',
    editorialNote:
      'Reflects natural light deeply into bedroom corners while adding vertical architectural height.',
    image: '/assets/categories/cat-bedroom.svg',
    gallery: [
      '/assets/categories/cat-bedroom.svg',
    ],
    fallback: '/assets/placeholders/placeholder-product.svg',
    tag: 'Solid Wood',
    featured: false,
    customizable: false,
    specifications: {
      frameMaterial: 'Solid European White Oak Frame & Birch Plywood Backing',
      joinery: 'Steam-Bent Oak Arch with Concealed Splined Miter Joints',
      cushionFill: 'N/A',
      origin: 'Prototyped in Jaipur Studio, India (Illustrative Specification)',
      warranty: '5-Year Structural Frame Warranty (Planned Benchmark Specification)',
      assemblyRequired: false,
      careInstructions: 'Clean mirror glass with ammonia-free glass cleaner sprayed on cloth. Never spray glass directly.',
    },
    relatedProductIds: ['bed-linen-sanctuary', 'nightstand-aura', 'wardrobe-koto'],
    prompt:
      'Full-length architectural floor mirror with arched solid white oak frame leaning against neutral plaster wall.',
  },
];

/**
 * Helper Accessors & Filter Predicates
 */

export function getAllProducts() {
  return PRODUCTS;
}

export function getFeaturedProducts() {
  return PRODUCTS.filter((p) => p.featured);
}

export function getProductByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  const normalized = String(idOrSlug).toLowerCase().trim();
  return (
    PRODUCTS.find(
      (p) =>
        p.id.toLowerCase() === normalized ||
        p.slug.toLowerCase() === normalized
    ) || null
  );
}

export function getRelatedProducts(product, limit = 3) {
  if (!product) return [];
  if (product.relatedProductIds && product.relatedProductIds.length > 0) {
    const related = product.relatedProductIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter(Boolean);
    if (related.length >= limit) return related.slice(0, limit);
  }
  // Fallback to same roomType or category
  return PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.roomType === product.roomType || p.category === product.category)
  ).slice(0, limit);
}

export function getUniqueCategories() {
  return ['All', ...new Set(PRODUCTS.map((p) => p.category))];
}

export function getUniqueRoomTypes() {
  return [
    { id: 'all', label: 'All Rooms' },
    { id: 'living', label: 'Living Room' },
    { id: 'bedroom', label: 'Bedroom' },
    { id: 'dining', label: 'Dining Room' },
    { id: 'office', label: 'Home Office' },
  ];
}

export function getUniqueMaterials() {
  const materialsSet = new Set();
  PRODUCTS.forEach((p) => {
    if (Array.isArray(p.materials)) {
      p.materials.forEach((m) => materialsSet.add(m));
    }
  });
  return Array.from(materialsSet);
}

export function getPriceBounds() {
  const prices = PRODUCTS.map((p) => p.basePrice);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}
