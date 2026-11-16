/**
 * Sample Furniture Data Structure Prototype
 * Aligned with Phase 2 data shape and metric dimensions
 */
export const SAMPLE_PRODUCTS = [
  {
    id: 'chair-komorebi',
    title: 'Komorebi Lounge Chair',
    category: 'Seating',
    style: 'Japandi',
    basePrice: 28000,
    dimensions: { width: 78, depth: 84, height: 72 }, // in cm
    weightKg: 18.5,
    inStock: true,
    customizable: true,
    description: 'Handcrafted low-slung accent armchair featuring sculpted solid white oak joinery and high-density cushioning.',
    materials: ['Solid White Oak', 'Wool Bouclé', 'High-Density Foam'],
  },
  {
    id: 'sofa-sylvan',
    title: 'Sylvan 3-Seater Sofa',
    category: 'Seating',
    style: 'Minimalist',
    basePrice: 45000,
    dimensions: { width: 220, depth: 90, height: 76 },
    weightKg: 52.0,
    inStock: true,
    customizable: true,
    description: 'Architectural 3-seater linear sofa with deep seating, tailored linen upholstery, and solid oak plinth base.',
    materials: ['Solid White Oak', 'Belgian Linen'],
  },
  {
    id: 'table-kanso',
    title: 'Kanso Walnut Coffee Table',
    category: 'Tables',
    style: 'Japandi',
    basePrice: 18500,
    dimensions: { width: 110, depth: 60, height: 42 },
    weightKg: 22.0,
    inStock: true,
    customizable: false,
    description: 'Organic pebble-shaped solid American walnut coffee table with three rounded cylindrical pillar legs.',
    materials: ['Solid American Walnut'],
  }
];
