import React from 'react';

/**
 * Architectural 2D Top-Down Furniture Vector Glyphs
 * 
 * Standardized CAD/drafting representations scaled to exact physical cm dimensions:
 * w = width (cm), d = depth (cm)
 * 
 * Live Material Customization:
 * - activeConfig.fabricColor: Custom upholstery textile color (Hex)
 * - activeConfig.finishColor: Custom wood/timber finish color (Hex)
 */

export function renderFurnitureGlyph(type, w, d, isSelected, hasCollision, activeConfig = {}) {
  const customFabric = activeConfig?.fabricColor;
  const customFinish = activeConfig?.finishColor;

  const strokeColor = hasCollision ? '#B91C1C' : isSelected ? '#35483D' : '#4E483E';
  const woodFrameColor = hasCollision ? '#FEE2E2' : (customFinish || '#D8C8B5');
  const upholsteryColor = hasCollision ? '#FEE2E2' : (customFabric || '#ECE7DE');
  const accentColor = hasCollision ? '#EF4444' : isSelected ? '#35483D' : (customFinish || '#A58B70');

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
          {/* Solid Timber Plinth Base & Outer Frame */}
          <rect
            x={0}
            y={0}
            width={w}
            height={d}
            rx={5}
            fill={woodFrameColor}
            stroke={strokeColor}
            strokeWidth={1.8}
          />

          {/* Upholstered Backrest */}
          <rect
            x={armWidth}
            y={2}
            width={seatWidth}
            height={backDepth - 2}
            rx={3}
            fill={upholsteryColor}
            stroke={strokeColor}
            strokeWidth={1.2}
          />

          {/* Left Upholstered / Timber Armrest */}
          <rect
            x={2}
            y={2}
            width={armWidth - 2}
            height={d - 4}
            rx={3}
            fill={upholsteryColor}
            stroke={strokeColor}
            strokeWidth={1.2}
          />

          {/* Right Upholstered / Timber Armrest */}
          <rect
            x={w - armWidth}
            y={2}
            width={armWidth - 2}
            height={d - 4}
            rx={3}
            fill={upholsteryColor}
            stroke={strokeColor}
            strokeWidth={1.2}
          />

          {/* Front Timber Plinth Reveal */}
          <rect
            x={armWidth}
            y={d - 4}
            width={seatWidth}
            height={3}
            fill={woodFrameColor}
            opacity={0.9}
          />

          {/* Deep Seat Cushions */}
          {Array.from({ length: cushionCount }).map((_, i) => (
            <rect
              key={i}
              x={armWidth + i * cushionW + 1.5}
              y={backDepth + 2}
              width={cushionW - 3}
              height={seatDepth - 6}
              rx={4}
              fill={upholsteryColor}
              stroke={strokeColor}
              strokeWidth={1.2}
            />
          ))}
        </g>
      );
    }

    case 'lounge':
    case 'accent-chair': {
      return (
        <g>
          {/* Exposed Timber Legs / Frame Trim */}
          <rect
            x={2}
            y={2}
            width={w - 4}
            height={d - 4}
            rx={w * 0.2}
            fill={woodFrameColor}
            stroke={strokeColor}
            strokeWidth={1.5}
          />
          {/* Curved Back Shell */}
          <path
            d={`M 5,${d - 6} C 5,8 ${w - 5},8 ${w - 5},${d - 6} L ${w - 9},${d - 6} C ${w - 9},16 9,16 9,${d - 6} Z`}
            fill={upholsteryColor}
            stroke={strokeColor}
            strokeWidth={1.5}
          />
          {/* Padded Seat Cushion */}
          <ellipse
            cx={w / 2}
            cy={d * 0.58}
            rx={w * 0.36}
            ry={d * 0.32}
            fill={upholsteryColor}
            stroke={strokeColor}
            strokeWidth={1.8}
          />
          {/* Center Button Tufting */}
          <circle cx={w / 2} cy={d * 0.58} r={2.5} fill={accentColor} />
        </g>
      );
    }

    case 'dining-chair': {
      return (
        <g>
          {/* Timber Frame & Legs */}
          <rect
            x={2}
            y={d * 0.2}
            width={w - 4}
            height={d * 0.75}
            rx={w * 0.15}
            fill={customFabric ? upholsteryColor : woodFrameColor}
            stroke={strokeColor}
            strokeWidth={1.8}
          />
          {/* Curved Solid Wood Backrest Bar */}
          <path
            d={`M 2,${d * 0.35} C 2,2 ${w - 2},2 ${w - 2},${d * 0.35}`}
            fill="none"
            stroke={woodFrameColor}
            strokeWidth={4.5}
            strokeLinecap="round"
          />
          <path
            d={`M 2,${d * 0.35} C 2,2 ${w - 2},2 ${w - 2},${d * 0.35}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={1.2}
            strokeLinecap="round"
          />
        </g>
      );
    }

    case 'table':
    case 'dining-table': {
      return (
        <g>
          {/* Solid Wood Table Surface */}
          <rect
            x={1}
            y={1}
            width={w - 2}
            height={d - 2}
            rx={5}
            fill={woodFrameColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
          {/* Beveled Edge Inset Detail */}
          <rect
            x={6}
            y={6}
            width={w - 12}
            height={d - 12}
            rx={3}
            fill="none"
            stroke={strokeColor}
            strokeWidth={0.8}
            strokeDasharray="4 2"
            opacity={0.4}
          />
          {/* Center Architectural Runner */}
          <line
            x1={w * 0.25}
            y1={d / 2}
            x2={w * 0.75}
            y2={d / 2}
            stroke={strokeColor}
            strokeWidth={1.2}
            opacity={0.6}
          />
        </g>
      );
    }

    case 'coffee-table': {
      return (
        <g>
          {/* Sculpted Timber Slab */}
          <rect
            x={2}
            y={2}
            width={w - 4}
            height={d - 4}
            rx={Math.min(w, d) * 0.25}
            fill={woodFrameColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
          <ellipse
            cx={w / 2}
            cy={d / 2}
            rx={w * 0.35}
            ry={d * 0.32}
            fill="none"
            stroke={strokeColor}
            strokeWidth={1}
            strokeDasharray="3 3"
            opacity={0.4}
          />
        </g>
      );
    }

    case 'bed': {
      const headboardD = 16;
      const pillowW = Math.min(65, (w - 20) / 2);
      const pillowD = 40;

      return (
        <g>
          {/* Platform Wood Base */}
          <rect
            x={0}
            y={0}
            width={w}
            height={d}
            rx={4}
            fill={woodFrameColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
          {/* Upholstered Headboard */}
          <rect
            x={0}
            y={0}
            width={w}
            height={headboardD}
            rx={2}
            fill={upholsteryColor}
            stroke={strokeColor}
            strokeWidth={1.5}
          />
          {/* Mattress Foundation */}
          <rect
            x={4}
            y={headboardD + 2}
            width={w - 8}
            height={d - headboardD - 6}
            rx={3}
            fill="#FAFAF8"
            stroke={strokeColor}
            strokeWidth={1}
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
          {/* Upholstered Folded Duvet Runner */}
          <rect
            x={4}
            y={d * 0.55}
            width={w - 8}
            height={d * 0.43}
            fill={upholsteryColor}
            stroke={strokeColor}
            strokeWidth={1.2}
            opacity={0.9}
          />
        </g>
      );
    }

    case 'desk': {
      return (
        <g>
          {/* Solid Hardwood Desktop */}
          <rect
            x={1}
            y={1}
            width={w - 2}
            height={d - 2}
            rx={4}
            fill={woodFrameColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
          {/* Leather Blotter / Working Zone */}
          <rect
            x={w * 0.25}
            y={d * 0.15}
            width={w * 0.5}
            height={d * 0.65}
            rx={3}
            fill={customFabric || '#5C5248'}
            stroke={strokeColor}
            strokeWidth={1}
            opacity={0.85}
          />
          {/* Brass Cable Grommet */}
          <circle cx={w * 0.85} cy={d * 0.25} r={4} fill="none" stroke={strokeColor} strokeWidth={1.2} />
        </g>
      );
    }

    case 'wardrobe':
    case 'credenza':
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
            fill={woodFrameColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
          {isWardrobe ? (
            /* Slatted Timber / Linen Panels */
            <>
              {customFabric && (
                <rect
                  x={6}
                  y={6}
                  width={w - 12}
                  height={d - 12}
                  fill={upholsteryColor}
                  opacity={0.7}
                />
              )}
              {Array.from({ length: Math.floor(w / 12) }).map((_, i) => (
                <line
                  key={i}
                  x1={8 + i * 12}
                  y1={4}
                  x2={8 + i * 12}
                  y2={d - 4}
                  stroke={strokeColor}
                  strokeWidth={0.8}
                  opacity={0.6}
                />
              ))}
            </>
          ) : (
            /* Cabinet Doors */
            <>
              <line x1={w / 3} y1={2} x2={w / 3} y2={d - 2} stroke={strokeColor} strokeWidth={1} />
              <line x1={(w * 2) / 3} y1={2} x2={(w * 2) / 3} y2={d - 2} stroke={strokeColor} strokeWidth={1} />
            </>
          )}
        </g>
      );
    }

    case 'lamp':
    case 'lighting': {
      return (
        <g>
          {/* Light Glow Halo */}
          <circle
            cx={w / 2}
            cy={d / 2}
            r={Math.min(w, d) / 2}
            fill="#FEF9C3"
            opacity={0.4}
            stroke="#EAB308"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          {/* Fixture Base */}
          <circle
            cx={w / 2}
            cy={d / 2}
            r={Math.min(w, d) * 0.3}
            fill={woodFrameColor}
            stroke={strokeColor}
            strokeWidth={2}
          />
          {/* Bulb */}
          <circle cx={w / 2} cy={d / 2} r={3} fill="#CA8A04" />
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
            fill={woodFrameColor}
            stroke={strokeColor}
            strokeWidth={1.8}
          />
          <line x1={1} y1={1} x2={w - 1} y2={d - 1} stroke={strokeColor} strokeWidth={0.6} opacity={0.4} />
          <line x1={w - 1} y1={1} x2={1} y2={d - 1} stroke={strokeColor} strokeWidth={0.6} opacity={0.4} />
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
