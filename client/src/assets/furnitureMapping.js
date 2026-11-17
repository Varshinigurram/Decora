/**
 * Décora – Central Asset & Metadata Registry
 * 
 * Sourcing Strategy:
 * - Local architectural vector illustrations as verified base assets.
 * - Sourcing prompts and exact metadata provided for user asset generation / procurement.
 * - Guaranteed zero broken links and instant fallback resolution.
 */

import { getFeaturedProducts } from '../data/products';
import { getFeaturedInspirations } from '../data/inspirations';

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
    pieceCount: '6 Designs',
    image: '/assets/categories/cat-living.svg',
    path: '/catalog?room=living',
    prompt: 'Architectural living space featuring low-profile linen sofa and natural white oak joinery on ivory background.',
  },
  {
    id: 'bedroom',
    name: 'Bedroom Sanctuary',
    subtitle: 'Raw linen bedding & platform frames',
    pieceCount: '4 Designs',
    image: '/assets/categories/cat-bedroom.svg',
    path: '/catalog?room=bedroom',
    prompt: 'Minimalist bedroom sanctuary with upholstered linen low platform bed and floating nightstands.',
  },
  {
    id: 'dining-room',
    name: 'Dining Room',
    subtitle: 'Solid oak trestles & curved seating',
    pieceCount: '4 Designs',
    image: '/assets/categories/cat-dining.svg',
    path: '/catalog?room=dining',
    prompt: 'Airy dining space with solid white oak dining table and sculptural minimalist dining chairs.',
  },
  {
    id: 'home-office',
    name: 'Home Office / Atelier',
    subtitle: 'Executive desks & studio seating',
    pieceCount: '2 Designs',
    image: '/assets/categories/cat-office.svg',
    path: '/catalog?room=office',
    prompt: 'Contemporary home atelier with solid walnut desk, recessed bronze pulls, and studio task chair.',
  },
];

export const FEATURED_PRODUCTS = getFeaturedProducts();

export const INSPIRATION_STORIES = getFeaturedInspirations().map((item) => ({
  id: item.id,
  title: item.title,
  subtitle: item.subtitle,
  style: item.style,
  room: item.roomLabel,
  featuredPiecesCount: item.referencedProductIds.length,
  image: item.heroImage,
  designerNote: item.shortDescription,
  palette: item.palette.map((p) => p.hex),
}));

export const CUSTOMIZER_PREVIEW = {
  piece: {
    id: 'chair-komorebi',
    title: 'Komorebi Lounge Chair',
    basePrice: 28000,
  },
  fabrics: [
    { id: 'fab-boucle', name: 'Cream Bouclé', delta: 3500, colorHex: '#F6F3ED', texture: 'woven' },
    { id: 'fab-linen', name: 'Natural Belgian Linen', delta: 0, colorHex: '#EAE5DB', texture: 'slub' },
    { id: 'fab-velvet', name: 'Olive Velvet', delta: 4200, colorHex: '#425A4C', texture: 'velvet' },
    { id: 'fab-leather', name: 'Cognac Leather', delta: 8000, colorHex: '#8C5A32', texture: 'leather' },
  ],
  finishes: [
    { id: 'fin-oak', name: 'Natural White Oak', delta: 2000, colorHex: '#D8C8B5' },
    { id: 'fin-beech', name: 'Natural Beech (Standard)', delta: 0, colorHex: '#EFE7DA' },
    { id: 'fin-walnut', name: 'Smoked Walnut', delta: 2200, colorHex: '#6B543D' },
    { id: 'fin-ash', name: 'Ebonized Black Ash', delta: 2500, colorHex: '#292824' },
  ],
};
