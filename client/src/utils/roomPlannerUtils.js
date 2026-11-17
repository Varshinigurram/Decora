/**
 * Architectural 2D Floorplan Coordinate & Spatial Utilities
 * 
 * Standard metric system:
 * - Dimensions: 1 SVG canvas unit = 1 centimeter (cm)
 * - 1 meter = 100 cm
 */

export const ROOM_PRESETS = [
  { label: 'Living Sanctuary', length: 5.5, width: 4.2 },
  { label: 'Master Suite', length: 5.0, width: 4.0 },
  { label: 'Architectural Studio', length: 4.5, width: 3.8 },
  { label: 'Dining Salon', length: 4.8, width: 3.6 },
];

/**
 * Calculates oriented AABB for an item with rotation around its center
 */
export function getItemBoundingBox(item) {
  const cx = item.x + item.w / 2;
  const cy = item.y + item.d / 2;
  const rad = ((item.rotation || 0) * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));

  const effectiveW = item.w * cos + item.d * sin;
  const effectiveH = item.w * sin + item.d * cos;

  return {
    minX: cx - effectiveW / 2,
    maxX: cx + effectiveW / 2,
    minY: cy - effectiveH / 2,
    maxY: cy + effectiveH / 2,
    effectiveW,
    effectiveH,
  };
}

/**
 * Clamps an item's position so its rotated envelope stays within the room boundary [0, roomW] x [0, roomL]
 */
export function clampItemWithinRoom(item, roomWidthM, roomLengthM) {
  const roomWCm = roomWidthM * 100;
  const roomLCm = roomLengthM * 100;

  const box = getItemBoundingBox(item);
  let dx = 0;
  let dy = 0;

  if (box.minX < 0) {
    dx = -box.minX;
  } else if (box.maxX > roomWCm) {
    dx = roomWCm - box.maxX;
  }

  if (box.minY < 0) {
    dy = -box.minY;
  } else if (box.maxY > roomLCm) {
    dy = roomLCm - box.maxY;
  }

  return {
    ...item,
    x: Math.round(item.x + dx),
    y: Math.round(item.y + dy),
  };
}

/**
 * Checks overlap between two items
 */
export function doItemsOverlap(itemA, itemB) {
  if (itemA.instanceId === itemB.instanceId) return false;

  const boxA = getItemBoundingBox(itemA);
  const boxB = getItemBoundingBox(itemB);

  // 4cm clearance margin prevents false positive triggers when furniture touches
  const margin = 4;
  return (
    boxA.minX + margin < boxB.maxX - margin &&
    boxA.maxX - margin > boxB.minX + margin &&
    boxA.minY + margin < boxB.maxY - margin &&
    boxA.maxY - margin > boxB.minY + margin
  );
}

/**
 * Identifies set of instanceIds that are in collision with at least one other item
 */
export function findCollidingItemIds(items = []) {
  const collidingIds = new Set();

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (doItemsOverlap(items[i], items[j])) {
        collidingIds.add(items[i].instanceId);
        collidingIds.add(items[j].instanceId);
      }
    }
  }

  return collidingIds;
}

/**
 * Converts screen Pointer event coordinates to SVG room floorplan cm coordinates
 */
export function screenToSVGCoordinates(svgElement, clientX, clientY) {
  if (!svgElement) return { x: 0, y: 0 };

  const pt = svgElement.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;

  const ctm = svgElement.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };

  const transformed = pt.matrixTransform(ctm.inverse());
  return {
    x: transformed.x,
    y: transformed.y,
  };
}
