import React, { useRef, useState, useEffect, useCallback } from 'react';
import { renderFurnitureGlyph } from './furnitureVectors';
import { screenToSVGCoordinates, clampItemWithinRoom } from '../../utils/roomPlannerUtils';

export default function FloorplanCanvas({
  roomLength,
  roomWidth,
  placedItems = [],
  selectedInstanceId,
  collidingItemIds = new Set(),
  onSelectItem,
  onDeselect,
  onUpdateItemPosition,
  snapToGrid = true,
  showDimensions = true,
}) {
  const svgRef = useRef(null);
  const [dragState, setDragState] = useState(null); // { instanceId, offsetX, offsetY }

  const roomWCm = Math.round(roomWidth * 100);
  const roomLCm = Math.round(roomLength * 100);

  // SVG Margin around room boundary for architectural dimensions and walls
  const margin = 45;
  const wallThick = 14;

  const viewBox = `-${margin} -${margin} ${roomWCm + margin * 2} ${roomLCm + margin * 2}`;

  // Pointer Down on furniture piece
  const handlePointerDown = (e, item) => {
    e.stopPropagation();
    // Capture pointer on target so pointer moves outside SVG still track smoothly
    try {
      e.target.setPointerCapture(e.pointerId);
    } catch (_) {}

    onSelectItem(item.instanceId);

    const svgPt = screenToSVGCoordinates(svgRef.current, e.clientX, e.clientY);
    setDragState({
      instanceId: item.instanceId,
      pointerId: e.pointerId,
      offsetX: svgPt.x - item.x,
      offsetY: svgPt.y - item.y,
    });
  };

  // Pointer Move during drag
  const handlePointerMove = useCallback(
    (e) => {
      if (!dragState || !svgRef.current) return;

      const currentItem = placedItems.find((it) => it.instanceId === dragState.instanceId);
      if (!currentItem) return;

      const svgPt = screenToSVGCoordinates(svgRef.current, e.clientX, e.clientY);
      let targetX = svgPt.x - dragState.offsetX;
      let targetY = svgPt.y - dragState.offsetY;

      if (snapToGrid) {
        targetX = Math.round(targetX / 10) * 10;
        targetY = Math.round(targetY / 10) * 10;
      }

      const clamped = clampItemWithinRoom(
        { ...currentItem, x: targetX, y: targetY },
        roomWidth,
        roomLength
      );

      onUpdateItemPosition(dragState.instanceId, clamped.x, clamped.y);
    },
    [dragState, placedItems, roomWidth, roomLength, snapToGrid, onUpdateItemPosition]
  );

  // Pointer Up release
  const handlePointerUp = useCallback(
    (e) => {
      if (dragState) {
        try {
          e.target.releasePointerCapture(e.pointerId);
        } catch (_) {}
        setDragState(null);
      }
    },
    [dragState]
  );

  // Grid lines calculation (every 50cm minor, 100cm major)
  const gridLines = [];
  // Vertical lines (along width)
  for (let x = 50; x < roomWCm; x += 50) {
    const isMajor = x % 100 === 0;
    gridLines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={roomLCm}
        stroke={isMajor ? '#D8C8B5' : '#ECE5DB'}
        strokeWidth={isMajor ? 1.2 : 0.7}
        strokeDasharray={isMajor ? undefined : '3 3'}
      />
    );
  }
  // Horizontal lines (along length)
  for (let y = 50; y < roomLCm; y += 50) {
    const isMajor = y % 100 === 0;
    gridLines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={roomWCm}
        y2={y}
        stroke={isMajor ? '#D8C8B5' : '#ECE5DB'}
        strokeWidth={isMajor ? 1.2 : 0.7}
        strokeDasharray={isMajor ? undefined : '3 3'}
      />
    );
  }

  // Doorway parameters (standard 90cm architectural swing)
  const doorWidth = Math.min(90, roomWCm * 0.25);
  const doorStartX = Math.max(30, roomWCm * 0.15);

  return (
    <div
      className="card-architectural p-4 sm:p-6 bg-white overflow-hidden shadow-subtle flex flex-col items-center justify-center min-h-[440px] sm:min-h-[580px] relative select-none"
      onClick={onDeselect}
    >
      {/* Floating Canvas Status Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-sand/60 rounded text-[10px] font-mono uppercase tracking-wider text-charcoal font-medium shadow-subtle">
          Scale 1:1 cm &bull; {roomWidth.toFixed(2)}m &times; {roomLength.toFixed(2)}m
        </span>
        {placedItems.length > 0 && (
          <span className="px-2 py-0.5 bg-forest/10 border border-forest/30 text-forest rounded text-[10px] font-medium">
            {placedItems.length} Piece{placedItems.length === 1 ? '' : 's'} Placed
          </span>
        )}
      </div>

      {/* SVG Floorboard Stage */}
      <div className="w-full h-full flex items-center justify-center">
        <svg
          ref={svgRef}
          viewBox={viewBox}
          className="w-full max-h-[540px] touch-none cursor-default drop-shadow-sm transition-all"
          preserveAspectRatio="xMidYMid meet"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Defs for drop shadows and patterns */}
          <defs>
            <filter id="furnitureShadow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="1" dy="3" stdDeviation="3" floodColor="#292824" floodOpacity="0.12" />
            </filter>
            <filter id="selectionGlow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#35483D" floodOpacity="0.35" />
            </filter>
            <filter id="collisionGlow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#DC2626" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Exterior Architectural Walls (Outer structure) */}
          <rect
            x={-wallThick}
            y={-wallThick}
            width={roomWCm + wallThick * 2}
            height={roomLCm + wallThick * 2}
            fill="#EBE5DC"
            stroke="#7C7267"
            strokeWidth={1.5}
            rx={2}
          />

          {/* Interior Floorboard Canvas */}
          <rect
            x={0}
            y={0}
            width={roomWCm}
            height={roomLCm}
            fill="#FCFAF7"
            stroke="#5C5549"
            strokeWidth={2}
          />

          {/* Metric Floor Grid */}
          <g opacity={0.85}>{gridLines}</g>

          {/* Architectural Entrance / Door Swing (Bottom Wall) */}
          <g>
            {/* Opening gap in bottom wall */}
            <rect
              x={doorStartX}
              y={roomLCm - 1}
              width={doorWidth}
              height={wallThick + 2}
              fill="#FCFAF7"
            />
            {/* Door Leaf (open inward 90 deg) */}
            <line
              x1={doorStartX}
              y1={roomLCm}
              x2={doorStartX}
              y2={roomLCm - doorWidth}
              stroke="#5C5549"
              strokeWidth={2.5}
            />
            {/* Door Swing Arc */}
            <path
              d={`M ${doorStartX + doorWidth},${roomLCm} A ${doorWidth} ${doorWidth} 0 0 0 ${doorStartX},${roomLCm - doorWidth}`}
              fill="none"
              stroke="#A58B70"
              strokeWidth={1.2}
              strokeDasharray="4 3"
            />
          </g>

          {/* Dimension Ticks & Measurements */}
          {showDimensions && (
            <g className="font-mono text-[10px] fill-taupe select-none">
              {/* Top Width Ruler */}
              <g transform="translate(0, -18)">
                <line x1={0} y1={0} x2={roomWCm} y2={0} stroke="#A58B70" strokeWidth={1} />
                <line x1={0} y1={-4} x2={0} y2={4} stroke="#A58B70" strokeWidth={1} />
                <line x1={roomWCm} y1={-4} x2={roomWCm} y2={4} stroke="#A58B70" strokeWidth={1} />
                <rect
                  x={roomWCm / 2 - 28}
                  y={-9}
                  width={56}
                  height={16}
                  fill="#FCFAF7"
                  rx={2}
                />
                <text
                  x={roomWCm / 2}
                  y={3}
                  textAnchor="middle"
                  className="font-medium text-[11px] fill-charcoal"
                >
                  {roomWidth.toFixed(2)} m
                </text>
              </g>

              {/* Left Length Ruler */}
              <g transform="translate(-18, 0)">
                <line x1={0} y1={0} x2={0} y2={roomLCm} stroke="#A58B70" strokeWidth={1} />
                <line x1={-4} y1={0} x2={4} y2={0} stroke="#A58B70" strokeWidth={1} />
                <line x1={-4} y1={roomLCm} x2={4} y2={roomLCm} stroke="#A58B70" strokeWidth={1} />
                <g transform={`translate(0, ${roomLCm / 2}) rotate(-90)`}>
                  <rect x={-28} y={-8} width={56} height={16} fill="#FCFAF7" rx={2} />
                  <text
                    x={0}
                    y={4}
                    textAnchor="middle"
                    className="font-medium text-[11px] fill-charcoal"
                  >
                    {roomLength.toFixed(2)} m
                  </text>
                </g>
              </g>
            </g>
          )}

          {/* Placed Furniture Blocks */}
          {placedItems.map((item) => {
            const isSelected = item.instanceId === selectedInstanceId;
            const hasCollision = collidingItemIds.has(item.instanceId);
            const isDragging = dragState?.instanceId === item.instanceId;

            return (
              <g
                key={item.instanceId}
                transform={`translate(${item.x}, ${item.y}) rotate(${item.rotation || 0}, ${item.w / 2}, ${item.d / 2})`}
                onPointerDown={(e) => handlePointerDown(e, item)}
                style={{
                  cursor: isDragging ? 'grabbing' : 'grab',
                }}
                filter={
                  hasCollision
                    ? 'url(#collisionGlow)'
                    : isSelected
                    ? 'url(#selectionGlow)'
                    : 'url(#furnitureShadow)'
                }
                className="transition-transform duration-75"
              >
                {/* Active Selection / Collision Envelope Ring */}
                {(isSelected || hasCollision) && (
                  <rect
                    x={-4}
                    y={-4}
                    width={item.w + 8}
                    height={item.d + 8}
                    rx={6}
                    fill="none"
                    stroke={hasCollision ? '#EF4444' : '#35483D'}
                    strokeWidth={1.8}
                    strokeDasharray={hasCollision ? '4 3' : undefined}
                    opacity={0.9}
                  />
                )}

                {/* Vector Glyph Scaled Exactly to cm dimensions */}
                {renderFurnitureGlyph(item.glyphType, item.w, item.d, isSelected, hasCollision)}

                {/* Subtle Name Label inside/under piece */}
                {isSelected && (
                  <text
                    x={item.w / 2}
                    y={item.d / 2 + 4}
                    textAnchor="middle"
                    className="fill-charcoal text-[9px] font-sans font-medium pointer-events-none select-none bg-white"
                  >
                    {item.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Empty Room Hint when no pieces placed */}
      {placedItems.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
          <div className="p-4 bg-white/90 backdrop-blur-sm border border-dashed border-sand rounded text-center max-w-sm space-y-1 shadow-subtle">
            <p className="font-serif text-base text-charcoal font-medium">Floorplan Ready for Staging</p>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Select any piece from the Furniture Palette on the left to place it inside your room boundary.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
