import React from 'react';

/**
 * Architectural 2D Top-Down Furniture Vector Glyphs
 * 
 * Standardized CAD/drafting representations scaled to exact physical cm dimensions:
 * w = width (cm), d = depth (cm)
 */

export function renderFurnitureGlyph(type, w, d, isSelected, hasCollision) {
  const strokeColor = hasCollision ? '#B91C1C' : isSelected ? '#35483D' : '#5C5549';
  const fillColor = hasCollision ? '#FEF2F2' : isSelected ? '#FAF7F2' : '#F6F3ED';
  const accentColor = hasCollision ? '#EF4444' : isSelected ? '#35483D' : '#A58B70';
  const cushionColor = hasCollision ? '#FEE2E2' : isSelected ? '#F0EBE1' : '#ECE7DE';

  switch (type) {
    case 'sofa': {
      const armWidth = Math.min(18, w * 0.1);
      const backDepth = Math.min(20, d * 0.25);
      const cushionCount = w > 180 ? 3 : 2;
      const seatWidth = w - armWidth * 2;
      const cushionW = seatWidth / cushionCount;
      const seatDepth = d - backDepth;

      return (
        <g>
          {/* Main Frame */}
          <rect
            x={0}
            y={0}
            width={w}
            height={d}
            rx={6}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
          {/* Backrest */}
          <rect
            x={armWidth}
            y={2}
            width={seatWidth}
            height={backDepth - 2}
            rx={3}
            fill={cushionColor}
            stroke={strokeColor}
            strokeWidth={1.2}
          />
          {/* Left Armrest */}
          <rect
            x={2}
            y={2}
            width={armWidth - 2}
            height={d - 4}
            rx={3}
            fill={cushionColor}
            stroke={strokeColor}
            strokeWidth={1.2}
          />
          {/* Right Armrest */}
          <rect
            x={w - armWidth}
            y={2}
            width={armWidth - 2}
            height={d - 4}
            rx={3}
            fill={cushionColor}
            stroke={strokeColor}
            strokeWidth={1.2}
          />
          {/* Cushions */}
          {Array.from({ length: cushionCount }).map((_, i) => (
            <rect
              key={i}
              x={armWidth + i * cushionW + 1.5}
              y={backDepth + 2}
              width={cushionW - 3}
              height={seatDepth - 4}
              rx={4}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={1}
            />
          ))}
        </g>
      );
    }

    case 'lounge':
    case 'accent-chair': {
      const backThickness = Math.min(16, d * 0.22);
      return (
        <g>
          {/* Curved Back Shell */}
          <path
            d={`M 4,${d - 4} C 4,10 ${w - 4},10 ${w - 4},${d - 4} L ${w - 8},${d - 4} C ${w - 8},18 8,18 8,${d - 4} Z`}
            fill={cushionColor}
            stroke={strokeColor}
            strokeWidth={1.5}
          />
          {/* Seat Cushion */}
          <ellipse
            cx={w / 2}
            cy={d * 0.58}
            rx={w * 0.38}
            ry={d * 0.34}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
          {/* Subtle Tufting Accent */}
          <circle cx={w / 2} cy={d * 0.58} r={2} fill={accentColor} />
        </g>
      );
    }

    case 'dining-chair': {
      return (
        <g>
          <rect
            x={2}
            y={d * 0.2}
            width={w - 4}
            height={d * 0.75}
            rx={w * 0.15}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={1.8}
          />
          {/* Curved Backrest Bar */}
          <path
            d={`M 2,${d * 0.35} C 2,2 ${w - 2},2 ${w - 2},${d * 0.35}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </g>
      );
    }

    case 'table':
    case 'dining-table': {
      return (
        <g>
          {/* Table Surface */}
          <rect
            x={1}
            y={1}
            width={w - 2}
            height={d - 2}
            rx={5}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
          {/* Beveled Edge Inset */}
          <rect
            x={6}
            y={6}
            width={w - 12}
            height={d - 12}
            rx={3}
            fill="none"
            stroke={accentColor}
            strokeWidth={0.8}
            strokeDasharray="4 2"
          />
          {/* Center Table Runner or Architectural Accent */}
          <line
            x1={w * 0.25}
            y1={d / 2}
            x2={w * 0.75}
            y2={d / 2}
            stroke={accentColor}
            strokeWidth={1.2}
          />
        </g>
      );
    }

    case 'coffee-table': {
      return (
        <g>
          {/* Sculpted or Rounded Slab */}
          <rect
            x={2}
            y={2}
            width={w - 4}
            height={d - 4}
            rx={Math.min(w, d) * 0.25}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
          <ellipse
            cx={w / 2}
            cy={d / 2}
            rx={w * 0.35}
            ry={d * 0.32}
            fill="none"
            stroke={accentColor}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        </g>
      );
    }

    case 'bed': {
      const headboardD = 14;
      const pillowW = Math.min(65, (w - 20) / 2);
      const pillowD = 40;

      return (
        <g>
          {/* Base Frame */}
          <rect
            x={0}
            y={0}
            width={w}
            height={d}
            rx={4}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
          {/* Headboard */}
          <rect
            x={0}
            y={0}
            width={w}
            height={headboardD}
            rx={2}
            fill={cushionColor}
            stroke={strokeColor}
            strokeWidth={1.5}
          />
          {/* Left Pillow */}
          <rect
            x={8}
            y={headboardD + 6}
            width={pillowW}
            height={pillowD}
            rx={6}
            fill="#FFFFFF"
            stroke={strokeColor}
            strokeWidth={1.2}
          />
          {/* Right Pillow */}
          <rect
            x={w - pillowW - 8}
            y={headboardD + 6}
            width={pillowW}
            height={pillowD}
            rx={6}
            fill="#FFFFFF"
            stroke={strokeColor}
            strokeWidth={1.2}
          />
          {/* Folded Duvet Fold line */}
          <line
            x1={4}
            y1={d * 0.55}
            x2={w - 4}
            y2={d * 0.55}
            stroke={strokeColor}
            strokeWidth={1.2}
          />
          <rect
            x={4}
            y={d * 0.55}
            width={w - 8}
            height={d * 0.43}
            fill={cushionColor}
            opacity={0.6}
          />
        </g>
      );
    }

    case 'desk': {
      return (
        <g>
          {/* Desktop */}
          <rect
            x={1}
            y={1}
            width={w - 2}
            height={d - 2}
            rx={4}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
          {/* Leather Blotter / Working Area */}
          <rect
            x={w * 0.25}
            y={d * 0.15}
            width={w * 0.5}
            height={d * 0.65}
            rx={3}
            fill={cushionColor}
            stroke={accentColor}
            strokeWidth={1}
          />
          {/* Cable Grommet */}
          <circle cx={w * 0.85} cy={d * 0.25} r={4} fill="none" stroke={accentColor} strokeWidth={1.2} />
        </g>
      );
    }

    case 'credenza':
    case 'wardrobe':
    case 'storage': {
      const isWardrobe = d >= 50;
      return (
        <g>
          <rect
            x={1}
            y={1}
            width={w - 2}
            height={d - 2}
            rx={3}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
          {isWardrobe ? (
            /* Slatted Louvre Lines for Wardrobe */
            Array.from({ length: Math.floor(w / 12) }).map((_, i) => (
              <line
                key={i}
                x1={8 + i * 12}
                y1={4}
                x2={8 + i * 12}
                y2={d - 4}
                stroke={accentColor}
                strokeWidth={0.8}
                opacity={0.7}
              />
            ))
          ) : (
            /* Cabinet Door Division Lines for Credenza */
            <>
              <line x1={w / 3} y1={2} x2={w / 3} y2={d - 2} stroke={accentColor} strokeWidth={1} />
              <line x1={(w * 2) / 3} y1={2} x2={(w * 2) / 3} y2={d - 2} stroke={accentColor} strokeWidth={1} />
            </>
          )}
        </g>
      );
    }

    case 'lamp':
    case 'lighting': {
      return (
        <g>
          {/* Radial Light Halo */}
          <circle
            cx={w / 2}
            cy={d / 2}
            r={Math.min(w, d) / 2}
            fill="#FEF9C3"
            opacity={0.4}
            stroke={accentColor}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          {/* Fixture Base */}
          <circle
            cx={w / 2}
            cy={d / 2}
            r={Math.min(w, d) * 0.3}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
          {/* Central Bulb */}
          <circle cx={w / 2} cy={d / 2} r={3} fill={accentColor} />
        </g>
      );
    }

    default: {
      return (
        <g>
          <rect
            x={1}
            y={1}
            width={w - 2}
            height={d - 2}
            rx={3}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={1.8}
          />
          <line x1={1} y1={1} x2={w - 1} y2={d - 1} stroke={accentColor} strokeWidth={0.6} />
          <line x1={w - 1} y1={1} x2={1} y2={d - 1} stroke={accentColor} strokeWidth={0.6} />
        </g>
      );
    }
  }
}

/**
 * Maps a product category / ID to an architectural glyph symbol type.
 */
export function getFurnitureGlyphType(product) {
  if (!product) return 'default';
  const id = product.id?.toLowerCase() || '';
  const cat = product.category?.toLowerCase() || '';

  if (id.includes('sofa')) return 'sofa';
  if (id.includes('komorebi') || id.includes('florence') || id.includes('lounge') || id.includes('accent')) return 'lounge';
  if (id.includes('dining-chair') || id.includes('nordic')) return 'dining-chair';
  if (id.includes('dining') || id.includes('asahi')) return 'dining-table';
  if (id.includes('kanso') || id.includes('coffee') || id.includes('bench')) return 'coffee-table';
  if (id.includes('bed') || cat.includes('bed')) return 'bed';
  if (id.includes('desk') || id.includes('atelier')) return 'desk';
  if (id.includes('wardrobe') || id.includes('koto')) return 'wardrobe';
  if (id.includes('credenza') || id.includes('nara') || id.includes('bookshelf') || id.includes('nightstand')) return 'credenza';
  if (cat.includes('lighting') || id.includes('lamp') || id.includes('pendant')) return 'lamp';
  if (cat === 'seating') return 'lounge';
  if (cat === 'tables') return 'table';
  if (cat === 'storage') return 'credenza';

  return 'default';
}
