import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  Plus,
  FolderPlus,
  ArrowRight,
  Layers,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import PriceDisplay from '../common/PriceDisplay';
import Badge from '../common/Badge';
import { formatINR } from '../../utils/formatters';
import { useDesignBoards } from '../../context/DesignBoardContext';
import { ROOM_TYPE_OPTIONS, STYLE_OPTIONS } from './CreateBoardModal';

/**
 * AddToBoardModal
 * 
 * Reusable modal allowing users to save either a standard or bespoke furniture snapshot
 * to an existing design board or create a new board inline.
 * 
 * Features:
 * - Snapshot preview with unit price in INR, dimensions, and swatch chips.
 * - Selection among existing boards.
 * - Inline "Create New Board" capability with room type and style selectors.
 * - Duplicate & configuration detection:
 *     - If identical configuration exists: allows incrementing quantity or adding separate item.
 *     - If different bespoke configuration exists: informs user that a distinct snapshot will be saved.
 * - Success feedback confirmation with direct "View Design Board →" navigation.
 */
export default function AddToBoardModal({
  isOpen,
  onClose,
  itemPayload,
  product,
}) {
  const navigate = useNavigate();
  const { boards, createBoard, addItemToBoard, updateItemQuantity } = useDesignBoards();

  // Selected board ID
  const [selectedBoardId, setSelectedBoardId] = useState('');
  // Inline board creation toggle
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  // New board inputs
  const [newTitle, setNewTitle] = useState('');
  const [newRoomType, setNewRoomType] = useState('Living Room');
  const [newStyle, setNewStyle] = useState('Warm Editorial');
  // Duplicate action: 'increment' | 'separate'
  const [duplicateAction, setDuplicateAction] = useState('increment');

  // Submission & feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  // Initialize or reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessData(null);
      setIsSubmitting(false);
      setDuplicateAction('increment');

      if (boards.length > 0) {
        setSelectedBoardId(boards[0].id);
        setIsCreatingNew(false);
      } else {
        setSelectedBoardId('');
        setIsCreatingNew(true);
      }
      setNewTitle('');
      setNewRoomType('Living Room');
      setNewStyle('Warm Editorial');
    }
  }, [isOpen, boards]);

  // Active target board
  const activeBoard = useMemo(() => {
    if (!selectedBoardId) return null;
    return boards.find((b) => b.id === selectedBoardId) || null;
  }, [boards, selectedBoardId]);

  // Inspect target board for existing items of same product
  const { identicalExistingItem, hasDifferentConfiguration } = useMemo(() => {
    if (!activeBoard || !itemPayload || !Array.isArray(activeBoard.items)) {
      return { identicalExistingItem: null, hasDifferentConfiguration: false };
    }

    const payloadProductId = itemPayload.productId;
    const payloadConfig = itemPayload.configuration || {};

    const matchingItems = activeBoard.items.filter(
      (it) => it.productId === payloadProductId
    );

    if (matchingItems.length === 0) {
      return { identicalExistingItem: null, hasDifferentConfiguration: false };
    }

    // Check for identical configuration
    const identical = matchingItems.find((it) => {
      const itConfig = it.configuration || {};
      return (
        (itConfig.fabricId ?? null) === (payloadConfig.fabricId ?? null) &&
        (itConfig.finishId ?? null) === (payloadConfig.finishId ?? null) &&
        (itConfig.sizeId ?? null) === (payloadConfig.sizeId ?? null)
      );
    });

    const different = matchingItems.some((it) => {
      const itConfig = it.configuration || {};
      return (
        (itConfig.fabricId ?? null) !== (payloadConfig.fabricId ?? null) ||
        (itConfig.finishId ?? null) !== (payloadConfig.finishId ?? null) ||
        (itConfig.sizeId ?? null) !== (payloadConfig.sizeId ?? null)
      );
    });

    return {
      identicalExistingItem: identical || null,
      hasDifferentConfiguration: Boolean(different),
    };
  }, [activeBoard, itemPayload]);

  if (!isOpen) return null;

  // Handle Form Submission
  const handleConfirm = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!itemPayload) {
        throw new Error('No furniture item configuration provided.');
      }

      let targetBoardId = selectedBoardId;
      let targetBoardTitle = activeBoard ? activeBoard.title : '';

      // 1. Create new board if user selected inline creation or has no existing boards
      if (isCreatingNew || boards.length === 0) {
        const cleanTitle = newTitle.trim();
        if (!cleanTitle) {
          throw new Error('Please enter a name for your new design board.');
        }

        const created = await createBoard({
          title: cleanTitle,
          roomType: newRoomType,
          style: newStyle,
          description: `Custom ${newRoomType} design board curated with bespoke pieces.`,
        });

        targetBoardId = created.id;
        targetBoardTitle = created.title;
      }

      if (!targetBoardId) {
        throw new Error('Please select or create a design board.');
      }

      // 2. Handle Duplicate / Increment vs Add as New Snapshot
      if (identicalExistingItem && duplicateAction === 'increment' && !isCreatingNew) {
        const newQty = (Number(identicalExistingItem.quantity) || 1) + (Number(itemPayload.quantity) || 1);
        await updateItemQuantity(targetBoardId, identicalExistingItem.boardItemId, newQty);
        setSuccessData({
          boardId: targetBoardId,
          boardTitle: targetBoardTitle,
          isIncrement: true,
          itemCount: newQty,
        });
      } else {
        // Save as a brand new item snapshot with guaranteed unique ID
        const finalSnapshot = {
          ...itemPayload,
          boardItemId: `bitem-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          addedAt: new Date().toISOString(),
        };

        await addItemToBoard(targetBoardId, finalSnapshot);
        setSuccessData({
          boardId: targetBoardId,
          boardTitle: targetBoardTitle,
          isIncrement: false,
        });
      }
    } catch (err) {
      console.error('Failed to save to design board:', err);
      setError(err.message || 'Could not save item to design board. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigateToBoard = () => {
    if (successData?.boardId) {
      onClose();
      navigate(`/boards/${successData.boardId}`);
    }
  };

  // Preview properties
  const selectedOptions = itemPayload?.selectedOptions || {};
  const fabric = selectedOptions.fabric;
  const finish = selectedOptions.finish;
  const size = selectedOptions.size;
  const unitPrice = Number(itemPayload?.unitPrice) || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={successData ? 'Saved to Design Board' : 'Add to Design Board'}
      subtitle={successData ? 'Design Studio' : 'Workspace Staging'}
      maxWidth="max-w-lg"
    >
      {/* SUCCESS CONFIRMATION VIEW */}
      {successData ? (
        <div className="space-y-6 text-center py-2 animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-full bg-forest/10 text-forest mx-auto flex items-center justify-center">
            <Check className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h4 className="font-serif text-2xl font-semibold text-charcoal">
              {itemPayload?.name || 'Item'} Saved!
            </h4>
            <p className="text-sm text-charcoal-muted leading-relaxed">
              {successData.isIncrement ? (
                <>
                  Updated quantity to <strong className="text-charcoal">{successData.itemCount}</strong> in{' '}
                  <strong className="text-forest font-serif">{successData.boardTitle}</strong>.
                </>
              ) : (
                <>
                  Successfully added snapshot to{' '}
                  <strong className="text-forest font-serif">{successData.boardTitle}</strong>.
                </>
              )}
            </p>
          </div>

          {/* Quick Snapshot Card */}
          <div className="bg-ivory-subtle p-3.5 rounded border border-sand/50 text-left flex items-center gap-3.5">
            <div className="w-14 h-14 bg-white rounded border border-sand/40 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
              <img
                src={itemPayload?.image || '/assets/placeholders/placeholder-product.svg'}
                alt={itemPayload?.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-taupe font-medium block">
                {itemPayload?.category} &bull; {itemPayload?.isCustomized ? 'Bespoke' : 'Standard'}
              </span>
              <p className="font-serif text-sm font-semibold text-charcoal truncate">
                {itemPayload?.name}
              </p>
              <PriceDisplay amount={unitPrice} size="sm" className="text-xs font-semibold text-forest font-serif" />
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
              className="w-full justify-center order-2 sm:order-1"
            >
              Continue Browsing
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleNavigateToBoard}
              className="w-full justify-center gap-1.5 order-1 sm:order-2 shadow-subtle"
            >
              <span>View Design Board</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        /* SELECTION & CONFIGURATION FORM VIEW */
        <form onSubmit={handleConfirm} className="space-y-5 text-left">
          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Item Snapshot Preview Header */}
          <div className="bg-ivory-subtle p-3.5 rounded border border-sand/50 flex items-start gap-3.5">
            <div className="w-16 h-16 bg-white rounded border border-sand/40 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
              <img
                src={itemPayload?.image || '/assets/placeholders/placeholder-product.svg'}
                alt={itemPayload?.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold">
                  {itemPayload?.category}
                </span>
                {itemPayload?.isCustomized ? (
                  <Badge variant="forest" size="xs">
                    Bespoke Snapshot
                  </Badge>
                ) : (
                  <Badge variant="taupe" size="xs">
                    Standard Spec
                  </Badge>
                )}
              </div>

              <h4 className="font-serif text-sm font-semibold text-charcoal truncate">
                {itemPayload?.name}
              </h4>

              {/* Material Chips / Swatches */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px]">
                {fabric && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-white border border-sand/60 rounded text-charcoal">
                    {fabric.colorHex && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-sand/60 shrink-0"
                        style={{ backgroundColor: fabric.colorHex }}
                      />
                    )}
                    <span className="truncate max-w-[100px]">{fabric.name}</span>
                  </span>
                )}
                {finish && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-white border border-sand/60 rounded text-charcoal">
                    {finish.colorHex && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-sand/60 shrink-0"
                        style={{ backgroundColor: finish.colorHex }}
                      />
                    )}
                    <span className="truncate max-w-[100px]">{finish.name}</span>
                  </span>
                )}
                {size && (
                  <span className="px-1.5 py-0.5 bg-white border border-sand/60 rounded font-mono text-[10px] text-forest">
                    {size.name}
                  </span>
                )}
              </div>

              <div className="pt-0.5">
                <PriceDisplay amount={unitPrice} size="sm" className="text-xs font-semibold text-charcoal font-serif" />
              </div>
            </div>
          </div>

          {/* BOARD SELECTION SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs uppercase tracking-wider text-taupe font-semibold">
                Destination Design Board
              </label>

              {boards.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsCreatingNew((prev) => !prev)}
                  className="text-xs font-medium text-forest hover:text-forest-dark transition-colors inline-flex items-center gap-1"
                >
                  {isCreatingNew ? (
                    'Select existing board'
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create new board</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Inline Board Creation Form */}
            {isCreatingNew || boards.length === 0 ? (
              <div className="p-4 bg-white rounded border border-forest/30 shadow-subtle space-y-3.5 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-forest text-xs font-medium">
                  <FolderPlus className="w-4 h-4" />
                  <span>Create & save to new board</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    Board Title <span className="text-accent-error">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Master Bedroom Sanctuary, Japandi Flat"
                    className="w-full px-3 py-2 text-sm bg-white border border-sand/70 rounded focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest text-charcoal"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      Room Type
                    </label>
                    <select
                      value={newRoomType}
                      onChange={(e) => setNewRoomType(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-sand/70 rounded focus:outline-none focus:border-forest text-charcoal"
                    >
                      {ROOM_TYPE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      Interior Style
                    </label>
                    <select
                      value={newStyle}
                      onChange={(e) => setNewStyle(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-sand/70 rounded focus:outline-none focus:border-forest text-charcoal"
                    >
                      {STYLE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              /* Existing Boards Radio List */
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {boards.map((b) => {
                  const isSelected = b.id === selectedBoardId;
                  const count = b.items?.length || 0;
                  return (
                    <label
                      key={b.id}
                      className={`flex items-center justify-between p-3 rounded border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-forest bg-forest/5 shadow-subtle'
                          : 'border-sand/60 bg-white hover:bg-ivory-subtle hover:border-sand'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="radio"
                          name="targetBoard"
                          value={b.id}
                          checked={isSelected}
                          onChange={() => setSelectedBoardId(b.id)}
                          className="w-4 h-4 text-forest focus:ring-forest border-sand accent-forest"
                        />
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${isSelected ? 'text-forest font-semibold' : 'text-charcoal'}`}>
                            {b.title}
                          </p>
                          <p className="text-[11px] text-taupe truncate">
                            {b.roomType} &bull; {b.style}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] text-charcoal-muted font-mono shrink-0 ml-2">
                        {count} {count === 1 ? 'piece' : 'pieces'}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* DUPLICATE & CONFIGURATION DETECTION ALERT */}
          {!isCreatingNew && activeBoard && (
            <div>
              {identicalExistingItem ? (
                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded space-y-2 text-xs text-amber-900 animate-in fade-in duration-150">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        Identical configuration already on this board
                      </p>
                      <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                        Current quantity on board: <strong>{identicalExistingItem.quantity || 1}</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1 pl-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="dupAction"
                        value="increment"
                        checked={duplicateAction === 'increment'}
                        onChange={() => setDuplicateAction('increment')}
                        className="text-forest focus:ring-forest accent-forest"
                      />
                      <span>Increase quantity of existing item (+1)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="dupAction"
                        value="separate"
                        checked={duplicateAction === 'separate'}
                        onChange={() => setDuplicateAction('separate')}
                        className="text-forest focus:ring-forest accent-forest"
                      />
                      <span>Add as a separate line item</span>
                    </label>
                  </div>
                </div>
              ) : hasDifferentConfiguration ? (
                <div className="p-3 bg-ivory-subtle border border-sand/60 rounded flex items-start gap-2 text-xs text-charcoal-muted animate-in fade-in duration-150">
                  <Sparkles className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Notice: A different custom configuration of this piece exists on this board. This item will be saved as a distinct snapshot.
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-sand/40">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting || (!isCreatingNew && !selectedBoardId)}
              className="flex items-center gap-1.5 shadow-subtle min-w-[130px] justify-center"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4" />
                  <span>{isCreatingNew ? 'Create & Add' : 'Add to Board'}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
