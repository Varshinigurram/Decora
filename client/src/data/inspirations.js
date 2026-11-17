/**
 * Décora – Central Interior Inspiration & Lookbook Registry
 * Single Source of Truth for all interior lookbooks across:
 * - Homepage Inspiration Preview
 * - Interior Inspiration Gallery (/inspiration)
 * - Lookbook Detail Page (/inspiration/:id)
 * - "Shop the Look" Product Association Engine
 * 
 * Standards:
 * - Products referenced strictly by their stable IDs in products.js
 * - Palette defined with name & HEX values aligned with the Décora Design System
 * - Metric spatial guidance (m, m²)
 */

import { getProductByIdOrSlug } from './products';

export const INSPIRATIONS = [
  {
    id: 'komorebi-living',
    slug: 'komorebi-living-space',
    title: 'Komorebi Living Space',
    subtitle: 'Warm wood meets linen textures',
    style: 'Japandi',
    roomType: 'living',
    roomLabel: 'Living Room',
    shortDescription:
      'Rooted in Japanese wabi-sabi and Danish hygge, balancing solid natural white oak joinery, tactile bouclé, and low-profile seating.',
    editorialDescription:
      'The Komorebi Living Space explores the subtle interplay between sunlight filtering through natural greenery and warm architectural timber. Low-profile seating preserves unimpeded horizontal sightlines across the room, while tactile bouclé and raw slub linen introduce acoustic calmness and physical warmth.',
    designPhilosophy:
      'The space embraces the Japanese philosophy of komorebi—the poetic sensation of sunlight filtering through leaves. Every furniture silhouette is kept grounded and low to the floor, encouraging a deliberate slower rhythm of daily living.',
    designerNotes:
      'We anchored the central seating zone with the low-slung Komorebi Lounge Chair and linear Sylvan Sofa. The organic pebble contours of the Kanso Coffee Table soften rectangular architectural room boundaries. Lighting is kept warm, indirect, and grounded via natural travertine stone.',
    heroImage: '/assets/categories/cat-living.svg',
    fallback: '/assets/placeholders/placeholder-product.svg',
    palette: [
      { name: 'Warm Linen', hex: '#F6F3ED' },
      { name: 'Natural Oak', hex: '#D8C8B5' },
      { name: 'Muted Taupe', hex: '#A58B70' },
      { name: 'Forest Green', hex: '#35483D' },
      { name: 'Ebonized Ash', hex: '#292824' },
    ],
    materials: [
      'Solid White Oak (Grade A Hardwood)',
      'Textured Wool Bouclé',
      'Belgian Flax Linen',
      'Natural Italian Travertine Stone',
      'American Black Walnut',
    ],
    roomDetails: {
      recommendedDimensions: '4.8 × 5.5 m (26.4 m²)',
      ceilingHeight: '2.8 m minimum recommended',
      lightingCondition: 'Diffused South or East daylight with ambient 2700K floor illumination',
      flooringPairing: 'Natural micro-cement, wide-plank pale oak, or neutral woven jute',
    },
    referencedProductIds: [
      'chair-komorebi',
      'table-kanso',
      'sofa-sylvan',
      'lamp-kanso-stone',
    ],
    featured: true,
    prompt:
      'Serene modern architectural Japandi living room, natural warm daylight, floor-to-ceiling glass windows, low-profile oak lounge chair, sculptural cream linen sectional sofa, neutral micro-cement floor, warm minimalist Japandi aesthetic, architectural digest style, 8k resolution.',
  },
  {
    id: 'nordic-light-dining',
    slug: 'nordic-light-dining-room',
    title: 'Nordic Light Dining Room',
    subtitle: 'Airy natural light & curved oak',
    style: 'Scandinavian',
    roomType: 'dining',
    roomLabel: 'Dining Room',
    shortDescription:
      'Maximizing natural daylight exposure with pale European oak, curved wishbone seating, and architectural dome illumination.',
    editorialDescription:
      'An airy celebration of Scandinavian clarity, where generous natural illumination bounces across solid white oak surfaces. The tactile weave of paper cord seating and woven rattan banquettes contrasts gracefully against clean architectural walls.',
    designPhilosophy:
      'Simplicity, functional utility, and democratic beauty. By paring back ornamentation, the natural grain of white oak and the sculptural arc of steam-bent wood become the primary visual interest.',
    designerNotes:
      'The Asahi Trestle Dining Table serves as the spatial anchor, paired with curved Nordic dining chairs and the Kyoto cane bench for flexible communal hosting. Overhead, the Oslo Dome Pendant casts a warm, glare-free pool of light onto the tabletop.',
    heroImage: '/assets/categories/cat-dining.svg',
    fallback: '/assets/placeholders/placeholder-product.svg',
    palette: [
      { name: 'Chalk White', hex: '#FFFFFF' },
      { name: 'Bleached Beech', hex: '#EDE7DC' },
      { name: 'Pale Oak', hex: '#D8C8B5' },
      { name: 'Nordic Sand', hex: '#C2B19D' },
      { name: 'Deep Charcoal', hex: '#292824' },
    ],
    materials: [
      'Solid European White Oak',
      'Natural Paper Cord Weave',
      'Natural Rattan Cane',
      'Spun Aluminum (Matte Sand)',
      'Unbleached Sheer Linen',
    ],
    roomDetails: {
      recommendedDimensions: '4.2 × 4.8 m (20.2 m²)',
      ceilingHeight: '2.7 m minimum recommended',
      lightingCondition: 'Maximum natural Northern or Western light with dimmable direct pendant',
      flooringPairing: 'Light Nordic pine, bleached oak herringbone, or pale terrazzo',
    },
    referencedProductIds: [
      'table-asahi',
      'chair-nordic-dining',
      'pendant-scandi-dome',
      'bench-kyoto',
    ],
    featured: true,
    prompt:
      'Scandinavian bright dining room, natural light oak trestle table, curved minimalist chairs with cord seats, white architectural dome pendant light, sheer linen drapes, airy natural ambiance.',
  },
  {
    id: 'stone-timber-bedroom',
    slug: 'stone-and-timber-bedroom',
    title: 'Stone & Timber Bedroom Sanctuary',
    subtitle: 'Tactile calmness & raw linen',
    style: 'Minimalist',
    roomType: 'bedroom',
    roomLabel: 'Bedroom Sanctuary',
    shortDescription:
      'A restful sanctuary stripped of visual noise, balancing textured lime plaster with a low upholstered linen platform bed.',
    editorialDescription:
      'Conceived as a restorative refuge from sensory overload, this bedroom uses textural depth rather than color to create visual interest. Low platform architecture and floating nightstands keep floor surfaces clear, creating a sense of weightlessness.',
    designPhilosophy:
      'Visual quietude. By limiting the material palette to natural unbleached linen, warm white oak, and smooth mineral stone, the bedroom becomes an intentional space for decompression and uninterrupted rest.',
    designerNotes:
      'The Aura Platform Bed is intentionally specified with a low 25 cm plinth to promote a grounded connection. Floating nightstands preserve continuous floor lines, while the full-height Oslo Arch Mirror reflects natural light into corners.',
    heroImage: '/assets/categories/cat-bedroom.svg',
    fallback: '/assets/placeholders/placeholder-product.svg',
    palette: [
      { name: 'Raw Limestone', hex: '#F4F1EA' },
      { name: 'Sand Plaster', hex: '#E2D9CC' },
      { name: 'Warm Taupe', hex: '#A58B70' },
      { name: 'Earthy Umber', hex: '#6B543D' },
      { name: 'Deep Forest', hex: '#35483D' },
    ],
    materials: [
      'Raw European Flax Linen',
      'Solid European White Oak',
      'Natural Travertine Stone',
      'High-Clarity Architectural Mirror Glass',
      'Acoustic Felt Lining',
    ],
    roomDetails: {
      recommendedDimensions: '4.0 × 5.0 m (20.0 m²)',
      ceilingHeight: '2.6 m minimum recommended',
      lightingCondition: 'Diffused morning light with warm low-level 2400K reading illumination',
      flooringPairing: 'Warm micro-topping, wide oak planks, or 100% natural wool loop carpeting',
    },
    referencedProductIds: [
      'bed-linen-sanctuary',
      'nightstand-aura',
      'wardrobe-koto',
      'mirror-arch-oslo',
    ],
    featured: true,
    prompt:
      'Minimalist sanctuary bedroom, low platform bed in raw unbleached linen, white oak floating bedside tables, subtle warm lime-plaster walls, soft diffused natural shadows.',
  },
  {
    id: 'florence-salon-lounge',
    slug: 'florence-curved-velvet-salon',
    title: 'Florence Curved Velvet Salon',
    subtitle: 'Rich walnut & moss velvet intimacy',
    style: 'Mid-Century Modern',
    roomType: 'living',
    roomLabel: 'Living Room',
    shortDescription:
      'An intimate architectural salon paying homage to Italian modernist design with sculpted walnut joinery and tailored moss green velvet.',
    editorialDescription:
      'Warm and tactile, the Florence Salon combines the structured geometry of mid-century architecture with enveloping, ergonomic seating. The contrast between rich smoked walnut and moss velvet creates a sophisticated, timeless living environment.',
    designPhilosophy:
      'Mid-century humanism. Combining the functional precision of 1950s Milanese architecture with the tactile indulgence of dense cotton velvets and patinated solid brass hardware.',
    designerNotes:
      'We anchored this space around two curved Florence barrel armchairs facing a low-slung Kanso table. The slatted Nara credenza provides generous concealed storage while maintaining acoustic transparency for sound systems.',
    heroImage: '/assets/categories/cat-living.svg',
    fallback: '/assets/placeholders/placeholder-product.svg',
    palette: [
      { name: 'Ivory Cream', hex: '#F6F3ED' },
      { name: 'Moss Green', hex: '#4A5D4E' },
      { name: 'Smoked Walnut', hex: '#5C4838' },
      { name: 'Aged Brass', hex: '#B89B62' },
      { name: 'Charcoal', hex: '#292824' },
    ],
    materials: [
      'Solid American Smoked Walnut',
      'Matte Cotton Velvet',
      'Turned Solid Brass Leg Ferrules',
      'Natural Slatted Timber',
      'Travertine Stone',
    ],
    roomDetails: {
      recommendedDimensions: '4.5 × 5.2 m (23.4 m²)',
      ceilingHeight: '2.9 m minimum recommended',
      lightingCondition: 'Warm perimeter accent lighting paired with focused reading floor lamps',
      flooringPairing: 'Smoked oak chevron parquet, warm terrazzo, or low-pile botanical wool rug',
    },
    referencedProductIds: [
      'lounge-florence',
      'table-kanso',
      'credenza-nara',
      'lamp-kanso-stone',
    ],
    featured: false,
    prompt:
      'Mid-century modern salon living room, curved barrel armchair in moss green velvet on walnut legs, low walnut coffee table, brass floor lamp, elegant architectural interior.',
  },
  {
    id: 'kyoto-tea-room-dining',
    slug: 'kyoto-minimalist-tea-and-dining',
    title: 'Kyoto Minimalist Tea & Dining Space',
    subtitle: 'Rhythmic cane weave & low benches',
    style: 'Japandi',
    roomType: 'dining',
    roomLabel: 'Dining Room',
    shortDescription:
      'A quiet fusion of Japanese tea-house sensibilities and modern banquette dining, emphasizing natural rattan cane and unadorned white oak.',
    editorialDescription:
      'Designed for slow communal meals and contemplative tea ceremonies, this space incorporates horizontal lines, sliding screens, and natural woven textures to evoke the peaceful rhythm of classical Kyoto architecture.',
    designPhilosophy:
      'Ma (間)—the Japanese spatial concept of meaningful negative space. Objects and furniture are arranged not to crowd the room, but to frame stillness.',
    designerNotes:
      'The Kyoto bench and Komorebi armchair provide dual seating modalities: informal low seating and ergonomic support. The travertine stone lamp anchors the sideboard with organic minerality.',
    heroImage: '/assets/categories/cat-dining.svg',
    fallback: '/assets/placeholders/placeholder-product.svg',
    palette: [
      { name: 'Rice Paper', hex: '#FAF8F5' },
      { name: 'Natural Cane', hex: '#DFCBB5' },
      { name: 'Pale White Oak', hex: '#D8C8B5' },
      { name: 'Bamboo Green', hex: '#546A55' },
      { name: 'Sumi Ink', hex: '#22211F' },
    ],
    materials: [
      'Solid European White Oak',
      'Hand-Woven Natural Hexagonal Cane',
      'Unbleached Flax Linen',
      'Natural Travertine Stone',
    ],
    roomDetails: {
      recommendedDimensions: '3.8 × 4.6 m (17.5 m²)',
      ceilingHeight: '2.6 m minimum recommended',
      lightingCondition: 'Soft diffused side lighting through translucent shoji screens or sheer linen',
      flooringPairing: 'Natural tatami mats, wide-plank unvarnished white oak, or pale lime-wash cement',
    },
    referencedProductIds: [
      'bench-kyoto',
      'chair-komorebi',
      'lamp-kanso-stone',
      'table-asahi',
    ],
    featured: false,
    prompt:
      'Japandi tea room and dining interior, low oak dining table, woven cane minimalist bench, beige linen accents, soft diffused daylight, quiet meditative atmosphere.',
  },
  {
    id: 'oslo-atelier-study',
    slug: 'oslo-architectural-atelier-study',
    name: 'Oslo Architectural Atelier Study',
    title: 'Oslo Architectural Atelier Study',
    subtitle: 'Focus, tactile timber & organized calm',
    style: 'Scandinavian',
    roomType: 'office',
    roomLabel: 'Home Office / Atelier',
    shortDescription:
      'An intentional creative workstation pairing solid walnut surfaces, rhythmic oak open shelving, and woven cord ergonomics.',
    editorialDescription:
      'Engineered for deep creative work, this atelier eliminates cognitive clutter through concealed cable management, open geometric display shelving, and ergonomic Scandinavian seating.',
    designPhilosophy:
      'Quiet productivity. We believe workspace environments should inspire through natural material tactility rather than utilitarian plastics or cold synthetic surfaces.',
    designerNotes:
      'The Atelier Executive Desk anchors the room with waterfall walnut edges and integrated brass cable routing. The Linear Bookshelf frames reference books and ceramic studies without closing off the wall.',
    heroImage: '/assets/categories/cat-office.svg',
    fallback: '/assets/placeholders/placeholder-product.svg',
    palette: [
      { name: 'Studio White', hex: '#FDFCFA' },
      { name: 'Natural Oak', hex: '#D8C8B5' },
      { name: 'Rich Walnut', hex: '#6B543D' },
      { name: 'Brushed Brass', hex: '#C2A36B' },
      { name: 'Matte Charcoal', hex: '#292824' },
    ],
    materials: [
      'Solid American Black Walnut',
      'Solid European White Oak',
      'Powder-Coated Carbon Steel',
      'Brushed Solid Brass',
      'Natural Paper Cord',
    ],
    roomDetails: {
      recommendedDimensions: '3.6 × 4.2 m (15.1 m²)',
      ceilingHeight: '2.7 m minimum recommended',
      lightingCondition: 'High natural daylight complemented by adjustable warm 3000K task lighting',
      flooringPairing: 'Natural white oak planks, neutral woven wool runner, or light concrete',
    },
    referencedProductIds: [
      'desk-atelier',
      'bookshelf-linear',
      'chair-nordic-dining',
      'mirror-arch-oslo',
    ],
    featured: false,
    prompt:
      'Scandinavian architectural home atelier study, solid walnut executive desk, open geometric oak bookshelf, arched floor mirror, warm morning light, architectural digest aesthetic.',
  },
  {
    id: 'monochrome-linear-living',
    slug: 'monochrome-linear-living-space',
    title: 'Monochrome Linear Living Space',
    subtitle: 'Geometric rigor meets organic softness',
    style: 'Minimalist',
    roomType: 'living',
    roomLabel: 'Living Room',
    shortDescription:
      'A disciplined minimalist composition emphasizing linear sightlines, low-profile seating, and slatted oak cabinetry.',
    editorialDescription:
      'Stripped of superfluous decoration, this living room relies on the interplay of horizontal lines, subtle surface grain, and refined acoustic materials. Continuous slatted tambour doors allow audiovisual equipment to remain invisible.',
    designPhilosophy:
      'Radical restraint. Elevating everyday living through proportional balance, tactile materiality, and light-reflecting surfaces.',
    designerNotes:
      'The Sylvan 3-Seater Sofa and Nara Credenza create balanced horizontal planes. The Komorebi Chair adds a sculptural organic contrast in the foreground, illuminated by warm stone ambient lighting.',
    heroImage: '/assets/categories/cat-living.svg',
    fallback: '/assets/placeholders/placeholder-product.svg',
    palette: [
      { name: 'Chalk Ivory', hex: '#F6F3ED' },
      { name: 'Natural Oak', hex: '#D8C8B5' },
      { name: 'Oatmeal Linen', hex: '#C7B9A5' },
      { name: 'Forest Accent', hex: '#35483D' },
      { name: 'Iron Black', hex: '#252422' },
    ],
    materials: [
      'Solid White Oak',
      'Belgian Flax Linen',
      'Slatted Natural Timber',
      'Natural Travertine Stone',
      'Bronze Hardware',
    ],
    roomDetails: {
      recommendedDimensions: '5.0 × 6.0 m (30.0 m²)',
      ceilingHeight: '3.0 m minimum recommended',
      lightingCondition: 'Generous indirect natural lighting with recessed ceiling wash and architectural table lamps',
      flooringPairing: 'Continuous light micro-cement, honed limestone tiles, or pale wide oak',
    },
    referencedProductIds: [
      'sofa-sylvan',
      'credenza-nara',
      'lamp-kanso-stone',
      'chair-komorebi',
    ],
    featured: false,
    prompt:
      'Minimalist monochrome living room with tailored linear sofa, low slatted oak media credenza, large travertine stone table lamp, clean architectural lines.',
  },
];

/**
 * Accessor Helpers & Data Predicates
 */

export function getAllInspirations() {
  return INSPIRATIONS;
}

export function getFeaturedInspirations() {
  return INSPIRATIONS.filter((item) => item.featured);
}

export function getInspirationByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  const normalized = String(idOrSlug).toLowerCase().trim();
  return (
    INSPIRATIONS.find(
      (item) =>
        item.id.toLowerCase() === normalized ||
        item.slug.toLowerCase() === normalized
    ) || null
  );
}

export function getInspirationsByStyle(style) {
  if (!style || style === 'All') return INSPIRATIONS;
  return INSPIRATIONS.filter((item) => item.style.toLowerCase() === style.toLowerCase());
}

export function getUniqueInspirationStyles() {
  return ['All', 'Japandi', 'Scandinavian', 'Minimalist', 'Mid-Century Modern'];
}

export function getResolvedProductsForLookbook(lookbook) {
  if (!lookbook || !Array.isArray(lookbook.referencedProductIds)) return [];
  return lookbook.referencedProductIds
    .map((productId) => getProductByIdOrSlug(productId))
    .filter(Boolean);
}

export function getRelatedInspirations(currentLookbook, limit = 3) {
  if (!currentLookbook) return [];
  return INSPIRATIONS.filter(
    (item) =>
      item.id !== currentLookbook.id &&
      (item.style === currentLookbook.style || item.roomType === currentLookbook.roomType)
  ).slice(0, limit);
}
