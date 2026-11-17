import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';
import RoomBudgetBar from '../components/roomPlanner/RoomBudgetBar';
import RoomSetupPanel from '../components/roomPlanner/RoomSetupPanel';
import FurniturePalette from '../components/roomPlanner/FurniturePalette';
import FloorplanCanvas from '../components/roomPlanner/FloorplanCanvas';
import SelectedFurnitureInspector from '../components/roomPlanner/SelectedFurnitureInspector';
import {
  findCollidingItemIds,
  clampItemWithinRoom,
} from '../utils/roomPlannerUtils';
import { getFurnitureGlyphType } from '../components/roomPlanner/furnitureVectors';
import { PRODUCTS } from '../data/products';
import { getDefaultConfiguration, calculateConfiguredPrice } from '../utils/pricingEngine';

export default function RoomPlannerPage() {
  const location = useLocation();
  const customHandoffItem = location.state?.configuredProduct || null;

  // Room Dimensions in metres
  const [roomLength, setRoomLength] = useState(5.0);
  const [roomWidth, setRoomWidth] = useState(4.0);

  // Canvas View Preferences
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);

  // Placed Furniture State with Per-Instance Customization
  const [placedItems, setPlacedItems] = useState(() => {
    // Initial sample layout: one customizable sofa and one coffee table
    const sylvanProduct = PRODUCTS.find((p) => p.id === 'sofa-sylvan');
    const sylvanDefaultConfig = sylvanProduct
      ? getDefaultConfiguration(sylvanProduct)
      : { fabricId: 'fab-linen-raw', finishId: 'fin-oak', sizeId: 'size-3seater' };
    const sylvanPricing = sylvanProduct
      ? calculateConfiguredPrice(sylvanProduct, sylvanDefaultConfig)
      : { finalPrice: 45000, selectedOptions: {} };

    return [
      {
        instanceId: 'inst-init-sofa',
        productId: 'sofa-sylvan',
        name: 'Sylvan 3-Seater Minimalist Sofa',
        category: 'Seating',
        price: sylvanPricing.finalPrice,
        w: 220,
        d: 90,
        x: 90,
        y: 60,
        rotation: 0,
        glyphType: 'sofa',
        configuration: sylvanDefaultConfig,
        activeFabric: sylvanPricing.selectedOptions.fabric || {
          id: 'fab-linen-raw',
          name: 'Natural Flax Linen',
          delta: 0,
          colorHex: '#EAE5DB',
        },
        activeFinish: sylvanPricing.selectedOptions.finish || {
          id: 'fin-oak',
          name: 'Natural White Oak',
          delta: 0,
          colorHex: '#D8C8B5',
        },
        activeSize: sylvanPricing.selectedOptions.size || {
          id: 'size-3seater',
          name: '3-Seater (220 cm)',
          delta: 0,
        },
      },
      {
        instanceId: 'inst-init-table',
        productId: 'table-kanso',
        name: 'Kanso Sculptural Coffee Table',
        category: 'Tables',
        price: 18500,
        w: 110,
        d: 60,
        x: 145,
        y: 190,
        rotation: 0,
        glyphType: 'coffee-table',
        configuration: { fabricId: null, finishId: null, sizeId: null },
        activeFabric: null,
        activeFinish: { id: 'fin-kanso', name: 'Travertine & Oak', colorHex: '#D8C8B5' },
        activeSize: null,
      },
    ];
  });

  const [selectedInstanceId, setSelectedInstanceId] = useState('inst-init-sofa');

  // When room dimensions change, re-clamp all items so none sit outside the boundary
  const handleUpdateDimensions = (newLength, newWidth) => {
    setRoomLength(newLength);
    setRoomWidth(newWidth);
    setPlacedItems((prev) =>
      prev.map((item) => clampItemWithinRoom(item, newWidth, newLength))
    );
  };

  const handleSelectPreset = (length, width) => {
    handleUpdateDimensions(length, width);
  };

  // Add furniture piece from palette with independent instance configuration
  const handleAddFurniture = (product) => {
    const glyphType = getFurnitureGlyphType(product);
    const isCustomizable = Boolean(product.customizable && product.customizationOptions);

    let config = { fabricId: null, finishId: null, sizeId: null };
    let configuredPrice = product.price || product.basePrice || 0;
    let activeFabric = null;
    let activeFinish = null;
    let activeSize = null;
    let w = product.dimensions?.width || 80;
    let d = product.dimensions?.depth || 80;

    if (isCustomizable) {
      config = getDefaultConfiguration(product);
      const pricing = calculateConfiguredPrice(product, config);
      configuredPrice = pricing.finalPrice;
      activeFabric = pricing.selectedOptions.fabric;
      activeFinish = pricing.selectedOptions.finish;
      activeSize = pricing.selectedOptions.size;

      if (activeSize?.scaleFactor && activeSize.scaleFactor !== 1) {
        w = Math.round(w * activeSize.scaleFactor);
      }
    } else if (product.configuration) {
      // Incoming customizer handoff piece
      config = product.configuration;
    }

    // Place near center with slight staggering
    const stagger = (placedItems.length * 20) % 80;
    const initialX = Math.max(10, Math.round((roomWidth * 100 - w) / 2) + stagger);
    const initialY = Math.max(10, Math.round((roomLength * 100 - d) / 2) + stagger);

    const newItem = {
      instanceId: `inst-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      price: configuredPrice,
      w,
      d,
      x: initialX,
      y: initialY,
      rotation: 0,
      glyphType,
      configuration: config,
      activeFabric,
      activeFinish,
      activeSize,
    };

    const clampedItem = clampItemWithinRoom(newItem, roomWidth, roomLength);

    setPlacedItems((prev) => [...prev, clampedItem]);
    setSelectedInstanceId(clampedItem.instanceId);
  };

  // Update configuration specifically for ONE placed instance
  const handleUpdateConfiguration = (instanceId, nextConfig) => {
    setPlacedItems((prev) =>
      prev.map((item) => {
        if (item.instanceId !== instanceId) return item;
        const product = PRODUCTS.find((p) => p.id === item.productId);
        if (!product) return item;

        const pricing = calculateConfiguredPrice(product, nextConfig);
        if (!pricing.isValid) return item;

        let newW = product.dimensions?.width || item.w;
        let newD = product.dimensions?.depth || item.d;
        if (pricing.selectedOptions.size?.scaleFactor) {
          newW = Math.round(newW * pricing.selectedOptions.size.scaleFactor);
        }

        const updated = {
          ...item,
          configuration: nextConfig,
          price: pricing.finalPrice,
          activeFabric: pricing.selectedOptions.fabric,
          activeFinish: pricing.selectedOptions.finish,
          activeSize: pricing.selectedOptions.size,
          w: newW,
          d: newD,
        };

        return clampItemWithinRoom(updated, roomWidth, roomLength);
      })
    );
  };

  // Update position during drag
  const handleUpdateItemPosition = (instanceId, newX, newY) => {
    setPlacedItems((prev) =>
      prev.map((item) =>
        item.instanceId === instanceId ? { ...item, x: newX, y: newY } : item
      )
    );
  };

  // Rotate selected piece
  const handleRotate = (instanceId, deltaDegrees) => {
    setPlacedItems((prev) =>
      prev.map((item) => {
        if (item.instanceId !== instanceId) return item;
        const newRotation = (item.rotation + deltaDegrees + 360) % 360;
        const rotatedItem = { ...item, rotation: newRotation };
        return clampItemWithinRoom(rotatedItem, roomWidth, roomLength);
      })
    );
  };

  // Remove furniture piece
  const handleRemove = (instanceId) => {
    setPlacedItems((prev) => prev.filter((item) => item.instanceId !== instanceId));
    if (selectedInstanceId === instanceId) {
      setSelectedInstanceId(null);
    }
  };

  // Reset entire floorplan
  const handleResetCanvas = () => {
    setPlacedItems([]);
    setSelectedInstanceId(null);
  };

  // Collision detection
  const collidingItemIds = useMemo(() => {
    return findCollidingItemIds(placedItems);
  }, [placedItems]);

  const selectedItem = useMemo(() => {
    return placedItems.find((it) => it.instanceId === selectedInstanceId) || null;
  }, [placedItems, selectedInstanceId]);

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: '2D Room Planner' },
  ];

  return (
    <div className="bg-ivory min-h-screen pb-20">
      {/* Breadcrumbs Navigation */}
      <div className="border-b border-sand/40 bg-white/60 backdrop-blur-sm sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Dynamic Budget & Header Bar */}
        <RoomBudgetBar
          placedItems={placedItems}
          onResetCanvas={handleResetCanvas}
        />

        {/* 3-Column Architectural Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Room Setup & Furniture Palette (4 cols) */}
          <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
            <RoomSetupPanel
              roomLength={roomLength}
              roomWidth={roomWidth}
              onChangeLength={(len) => handleUpdateDimensions(len, roomWidth)}
              onChangeWidth={(w) => handleUpdateDimensions(roomLength, w)}
              onSelectPreset={handleSelectPreset}
              snapToGrid={snapToGrid}
              onToggleSnap={setSnapToGrid}
              showDimensions={showDimensions}
              onToggleDimensions={setShowDimensions}
            />

            <FurniturePalette
              onAddFurniture={handleAddFurniture}
              customHandoffItem={customHandoffItem}
            />
          </div>

          {/* Center Column: Interactive SVG Floorplan Canvas (8 cols) */}
          <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
            <FloorplanCanvas
              roomLength={roomLength}
              roomWidth={roomWidth}
              placedItems={placedItems}
              selectedInstanceId={selectedInstanceId}
              collidingItemIds={collidingItemIds}
              onSelectItem={setSelectedInstanceId}
              onDeselect={() => setSelectedInstanceId(null)}
              onUpdateItemPosition={handleUpdateItemPosition}
              snapToGrid={snapToGrid}
              showDimensions={showDimensions}
            />

            {/* Contextual Customization Panel & Selected Furniture Inspector */}
            <SelectedFurnitureInspector
              selectedItem={selectedItem}
              hasCollision={selectedItem ? collidingItemIds.has(selectedItem.instanceId) : false}
              onRotate={handleRotate}
              onRemove={handleRemove}
              onDeselect={() => setSelectedInstanceId(null)}
              onUpdateConfiguration={handleUpdateConfiguration}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
