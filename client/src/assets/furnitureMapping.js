/**
 * Décora – Central Asset & Metadata Registry
 * 
 * Sourcing Strategy:
 * - Local architectural vector illustrations as verified base assets.
 * - Sourcing prompts and exact metadata provided for user asset generation / procurement.
 * - Guaranteed zero broken links and instant fallback resolution.
 */

import { getFeaturedProducts } from '../data/products';

export const HERO_ASSET = {
  id: 'hero-architectural-living',
  title: 'Spaces Designed with Intent. Furniture Built for Life.',
  image: '/assets/branding/hero-architectural.svg',
  fallback: '/assets/placeholders/placeholder-product.svg',
  alt: 'Architectural living room with diffused daylight, low-profile sofa, and sculpted walnut coffee table',
  prompt: 'Serene modern architectural living room, natural warm daylight, floor-to-ceiling glass windows, low-profile oak lounge chair, sculptural cream linen sectional sofa, neutral micro-cement floor, warm minimalist Japandi aesthetic, architectural digest style, 8k resolution.',
};

export const ROOM_CATEGORIES = [
  {
    id: 'living-room',
    name: 'Living Room',
    subtitle: 'Low-slung seating & sculpted tables',
    pieceCount: '14 Designs',
    image: '/assets/categories/cat-living.svg',
    path: '/catalog?room=living',
    prompt: 'Architectural living space featuring low-profile linen sofa and natural white oak joinery on ivory background.',
  },
  {
    id: 'bedroom',
    name: 'Bedroom Sanctuary',
    subtitle: 'Raw linen bedding & platform frames',
    pieceCount: '8 Designs',
    image: '/assets/categories/cat-bedroom.svg',
    path: '/catalog?room=bedroom',
    prompt: 'Minimalist bedroom sanctuary with upholstered linen low platform bed and floating nightstands.',
  },
  {
    id: 'dining-room',
    name: 'Dining Room',
    subtitle: 'Solid oak trestles & curved seating',
    pieceCount: '7 Designs',
    image: '/assets/categories/cat-dining.svg',
    path: '/catalog?room=dining',
    prompt: 'Airy dining space with solid white oak dining table and sculptural minimalist dining chairs.',
  },
  {
    id: 'home-office',
    name: 'Home Office / Atelier',
    subtitle: 'Executive desks & studio seating',
    pieceCount: '5 Designs',
    image: '/assets/categories/cat-office.svg',
    path: '/catalog?room=office',
    prompt: 'Contemporary home atelier with solid walnut desk, recessed bronze pulls, and studio task chair.',
  },
];

export const FEATURED_PRODUCTS = getFeaturedProducts();

export const INSPIRATION_STORIES = [
  {
    id: 'komorebi-living',
    title: 'Komorebi Living Space',
    subtitle: 'Warm wood meets linen textures',
    style: 'Japandi',
    room: 'Living Room',
    featuredPiecesCount: 3,
    image: '/assets/categories/cat-living.svg',
    designerNote: 'Designed around principles of Japanese minimalism and Danish hygge, prioritizing natural white oak, woven bouclé, and low-profile seating.',
    palette: ['#F6F3ED', '#D8C8B5', '#A58B70', '#35483D'],
  },
  {
    id: 'nordic-light-dining',
    title: 'Nordic Light Dining Room',
    subtitle: 'Airy natural light & curved oak',
    style: 'Scandinavian',
    room: 'Dining Room',
    featuredPiecesCount: 4,
    image: '/assets/categories/cat-dining.svg',
    designerNote: 'Maximizing northern light exposure with pale European oak, curved wishbone seating, and sheer unbleached curtains.',
    palette: ['#FFFFFF', '#EDE7DC', '#D8C8B5', '#292824'],
  },
  {
    id: 'stone-timber-bedroom',
    title: 'Stone & Timber Bedroom Sanctuary',
    subtitle: 'Tactile calmness & raw linen',
    style: 'Minimalist',
    room: 'Bedroom',
    featuredPiecesCount: 2,
    image: '/assets/categories/cat-bedroom.svg',
    designerNote: 'A restful sanctuary stripped of visual noise, balancing textured lime plaster with a low upholstered linen platform bed.',
    palette: ['#F4F1EA', '#E2D9CC', '#6B543D', '#35483D'],
  },
];

export const CUSTOMIZER_PREVIEW = {
  piece: {
    id: 'chair-komorebi',
    title: 'Komorebi Lounge Chair',
    basePrice: 28000,
  },
  fabrics: [
    { id: 'fab-boucle', name: 'Cream Bouclé', delta: 3500, colorHex: '#F6F3ED', texture: 'woven' },
    { id: 'fab-velvet', name: 'Olive Velvet', delta: 4200, colorHex: '#425A4C', texture: 'velvet' },
    { id: 'fab-linen', name: 'Charcoal Linen', delta: 2500, colorHex: '#59564F', texture: 'slub' },
    { id: 'fab-leather', name: 'Cognac Leather', delta: 8000, colorHex: '#8C5A32', texture: 'leather' },
  ],
  finishes: [
    { id: 'fin-oak', name: 'Natural White Oak', delta: 2000, colorHex: '#D8C8B5' },
    { id: 'fin-walnut', name: 'Rich Walnut', delta: 3500, colorHex: '#6B543D' },
    { id: 'fin-ash', name: 'Ebonized Black Ash', delta: 2500, colorHex: '#292824' },
  ],
};
