import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { Loader2, AlertCircle, Compass } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Button from '../components/common/Button';
import RoomBudgetBar from '../components/roomPlanner/RoomBudgetBar';
import RoomBoardToolbar from '../components/roomPlanner/RoomBoardToolbar';
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
import {
  getDefaultConfiguration,
  calculateConfiguredPrice,
  validateConfiguration,
} from '../utils/pricingEngine';
import { useDesignBoards } from '../context/DesignBoardContext';

/**
 * Serializes room layout for robust dirty-state tracking.
 * Captures dimensions, positions, rotations, and configurations.
 */
function serializeLayout(length, width, items) {
  return JSON.stringify({
    roomLength: Number(Number(length).toFixed(2)),
    roomWidth: Number(Number(width).toFixed(2)),
    items: (items || []).map((it) => ({
      instanceId: it.instanceId,
      productId: it.productId,
      x: Math.round(it.x),
      y: Math.round(it.y),
      rotation: it.rotation,
      w: it.w,
      d: it.d,
      configuration: it.configuration || null,
    })),
  });
}

export default function RoomPlannerPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get('boardId');
  const customHandoffItem = location.state?.configuredProduct || null;

  const { getBoardById, saveRoomLayoutToBoard, isLoading: isBoardsLoading } = useDesignBoards();

  // Active linked board (if boardId param exists)
  const board = useMemo(() => {
    if (!boardId || isBoardsLoading) return null;
    return getBoardById(boardId);
  }, [boardId, isBoardsLoading, getBoardById]);

  // Missing board warning state
  const [missingBoardId, setMissingBoardId] = useState(null);

  // Room Dimensions in metres
  const [roomLength, setRoomLength] = useState(5.0);
  const [roomWidth, setRoomWidth] = useState(4.0);

  // Canvas View Preferences
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);

  // Placed Furniture State with Per-Instance Customization
  const [placedItems, setPlacedItems] = useState(() => {
    // If not linking to a board, use default sample layout
    if (boardId) return [];

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

  const [selectedInstanceId, setSelectedInstanceId] = useState(() => (boardId ? null : 'inst-init-sofa'));

  // Dirty State & Persistence Tracking
  const lastSavedSignature = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [restorationErrors, setRestorationErrors] = useState([]);

  // Initialization & Restoration Effect
  useEffect(() => {
    if (isBoardsLoading) return;

    if (boardId) {
      const targetBoard = getBoardById(boardId);
      if (!targetBoard) {
        setMissingBoardId(boardId);
        return;
      }

      setMissingBoardId(null);

      // Restore saved layout if present
      if (targetBoard.roomLayout) {
        const savedLayout = targetBoard.roomLayout;
        const len = typeof savedLayout.roomLength === 'number' ? savedLayout.roomLength : 5.0;
        const wid = typeof savedLayout.roomWidth === 'number' ? savedLayout.roomWidth : 4.0;
        setRoomLength(len);
        setRoomWidth(wid);

        const errors = [];
        const restoredItems = (savedLayout.furnitureInstances || []).map((inst) => {
          const product = PRODUCTS.find((p) => p.id === inst.productId);
          if (!product) {
            errors.push(`Product "${inst.productId}" was not found in catalog.`);
            return { ...inst, hasError: true };
          }

          if (product.customizable && product.customizationOptions) {
            const validation = validateConfiguration(product, inst.configuration);
            if (!validation.isValid) {
              errors.push(
                `Configuration issue for "${inst.name || product.name}": ${validation.errors.join(', ')}`
              );
              // Preserve original data and price without fabricated defaults (Requirement 2)
              return {
                ...inst,
                glyphType: inst.glyphType || getFurnitureGlyphType(product),
                hasError: true,
                errorDetails: validation.errors,
              };
            }

            // Recalculate price strictly using pricingEngine
            const pricing = calculateConfiguredPrice(product, inst.configuration);
            let w = inst.w || product.dimensions?.width || 80;
            let d = inst.d || product.dimensions?.depth || 80;
            if (pricing.selectedOptions.size?.scaleFactor) {
              w = Math.round((product.dimensions?.width || 80) * pricing.selectedOptions.size.scaleFactor);
            }

            const validatedItem = {
              ...inst,
              w,
              d,
              price: pricing.finalPrice,
              glyphType: inst.glyphType || getFurnitureGlyphType(product),
              activeFabric: pricing.selectedOptions.fabric || inst.activeFabric,
              activeFinish: pricing.selectedOptions.finish || inst.activeFinish,
              activeSize: pricing.selectedOptions.size || inst.activeSize,
            };

            return clampItemWithinRoom(validatedItem, wid, len);
          } else {
            const basePrice = product.price || product.basePrice || 0;
            const validatedItem = {
              ...inst,
              price: basePrice,
              glyphType: inst.glyphType || getFurnitureGlyphType(product),
            };
            return clampItemWithinRoom(validatedItem, wid, len);
          }
        });

        setRestorationErrors(errors);
        setPlacedItems(restoredItems);
        setSelectedInstanceId(restoredItems[0]?.instanceId || null);
        lastSavedSignature.current = serializeLayout(len, wid, restoredItems);
      } else {
        // Board exists but has NO saved room layout -> Initialize empty room (Requirement 1)
        setRoomLength(5.0);
        setRoomWidth(4.0);
        setPlacedItems([]);
        setSelectedInstanceId(null);
        setRestorationErrors([]);
        lastSavedSignature.current = serializeLayout(5.0, 4.0, []);
      }
    } else {
      // Standalone mode: establish initial signature for sample layout
      if (!lastSavedSignature.current) {
        lastSavedSignature.current = serializeLayout(5.0, 4.0, placedItems);
      }
    }
  }, [boardId, isBoardsLoading, getBoardById]);

  // Compute dirty state against the last saved signature
  const isDirty = useMemo(() => {
    if (!board || !lastSavedSignature.current) return false;
    return lastSavedSignature.current !== serializeLayout(roomLength, roomWidth, placedItems);
  }, [board, roomLength, roomWidth, placedItems]);

  // Save room layout to board
  const handleSaveToBoard = async () => {
    if (!board || isSaving) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const roomLayoutPayload = {
        roomLength,
        roomWidth,
        units: 'm',
        savedAt: new Date().toISOString(),
        furnitureInstances: placedItems.map((item) => ({
          instanceId: item.instanceId,
          productId: item.productId,
          name: item.name,
          category: item.category,
          price: item.price,
          x: item.x,
          y: item.y,
          rotation: item.rotation,
          w: item.w,
          d: item.d,
          glyphType: item.glyphType,
          configuration: item.configuration,
          activeFabric: item.activeFabric || null,
          activeFinish: item.activeFinish || null,
          activeSize: item.activeSize || null,
        })),
      };

      await saveRoomLayoutToBoard(board.id, roomLayoutPayload);

      // Reset dirty state to new signature
      lastSavedSignature.current = serializeLayout(roomLength, roomWidth, placedItems);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3500);
    } catch (err) {
      console.error('Failed to save room layout:', err);
      setSaveError(err.message || 'Could not save room plan to design board.');
    } finally {
      setIsSaving(false);
    }
  };

  // When room dimensions change, re-clamp all items so none sit outside boundary
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

  // Loading state
  if (isBoardsLoading && boardId) {
    return (
      <div className="bg-ivory min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-forest animate-spin mx-auto" />
          <p className="font-serif text-lg text-charcoal">Loading Design Board Floorplan...</p>
        </div>
      </div>
    );
  }

  // Missing Board Dedicated Error State (Requirement 1 Quality Check: do not silently initialize demo furniture or allow saving)
  if (missingBoardId && !isBoardsLoading) {
    return (
      <div className="bg-ivory min-h-screen pb-20">
        <div className="border-b border-sand/40 bg-white/60 backdrop-blur-sm sticky top-20 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <Breadcrumbs
              items={[
                { label: 'Home', path: '/' },
                { label: 'Design Boards', path: '/boards' },
                { label: 'Board Not Found' },
              ]}
            />
          </div>
        </div>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="card-architectural p-8 sm:p-12 bg-white text-center space-y-6 shadow-subtle border border-sand/60">
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-[10px] uppercase tracking-widest text-taupe font-semibold block">
                Staging Error
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
                Design Board Not Found
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                We could not locate any design board matching <strong className="text-charcoal font-mono">"{missingBoardId}"</strong>. It may have been removed, renamed, or the link may be incorrect.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/boards">
                <Button variant="primary" size="md" className="flex items-center gap-1.5 shadow-subtle">
                  <span>Return to All Design Boards</span>
                </Button>
              </Link>

              <Link to="/room-planner">
                <Button variant="secondary" size="md" className="flex items-center gap-1.5 text-charcoal">
                  <Compass className="w-4 h-4 text-forest" />
                  <span>Open Standalone Planner</span>
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Dynamic Breadcrumbs
  const breadcrumbs = board
    ? [
        { label: 'Home', path: '/' },
        { label: 'Design Boards', path: '/boards' },
        { label: board.title, path: `/boards/${board.id}` },
        { label: '2D Room Planner' },
      ]
    : [
        { label: 'Home', path: '/' },
        { label: '2D Room Planner' },
      ];

  return (
    <div className="bg-ivory min-h-screen pb-20">
      {/* Breadcrumbs Navigation */}
      <div className="border-b border-sand/40 bg-white/60 backdrop-blur-sm sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Breadcrumbs items={breadcrumbs} />
          {board && (
            <Link
              to={`/boards/${board.id}`}
              className="text-xs text-taupe hover:text-forest transition-colors font-medium hidden sm:inline-flex items-center gap-1"
            >
              <span>Back to {board.title}</span>
            </Link>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Active Design Board Integration Toolbar (when linked to a board) */}
        {board && (
          <RoomBoardToolbar
            board={board}
            isDirty={isDirty}
            isSaving={isSaving}
            saveSuccess={saveSuccess}
            saveError={saveError}
            restorationErrors={restorationErrors}
            onSaveLayout={handleSaveToBoard}
          />
        )}

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
