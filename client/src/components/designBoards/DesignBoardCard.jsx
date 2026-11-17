import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, MoreVertical, Copy, Edit2, Trash2, ArrowUpRight, Compass } from 'lucide-react';
import PriceDisplay from '../common/PriceDisplay';
import Badge from '../common/Badge';
import { useDesignBoards } from '../../context/DesignBoardContext';

export default function DesignBoardCard({
  board,
  onEdit,
  onDelete,
}) {
  const { duplicateBoard, calculateBoardBudget, calculateBoardItemCount } = useDesignBoards();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const budget = calculateBoardBudget(board);
  const itemCount = calculateBoardItemCount(board);
  const items = board.items || [];

  const handleDuplicate = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDuplicating(true);
    setMenuOpen(false);
    try {
      await duplicateBoard(board.id);
    } catch (err) {
      console.error('Failed to duplicate board:', err);
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    onEdit(board);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    onDelete(board);
  };

  // Formatted date
  const dateFormatted = board.updatedAt
    ? new Date(board.updatedAt).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <article className="card-architectural group overflow-hidden flex flex-col bg-white relative transition-all duration-300 hover:shadow-elevated">
      {/* Visual Cover / Mosaic Canvas */}
      <Link
        to={`/boards/${board.id}`}
        className="relative aspect-[16/10] bg-ivory-subtle overflow-hidden border-b border-sand/30 block"
        aria-label={`Open ${board.title}`}
      >
        {items.length > 0 ? (
          items.length >= 3 ? (
            /* 3+ Pieces Mosaic */
            <div className="grid grid-cols-2 h-full w-full gap-0.5 bg-sand/30">
              <div className="h-full overflow-hidden bg-white">
                <img
                  src={items[0]?.image || '/assets/placeholders/placeholder-product.svg'}
                  alt={items[0]?.name || 'Piece'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="grid grid-rows-2 h-full gap-0.5">
                <div className="h-full overflow-hidden bg-white">
                  <img
                    src={items[1]?.image || '/assets/placeholders/placeholder-product.svg'}
                    alt={items[1]?.name || 'Piece'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="h-full overflow-hidden bg-white">
                  <img
                    src={items[2]?.image || '/assets/placeholders/placeholder-product.svg'}
                    alt={items[2]?.name || 'Piece'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* 1 or 2 Pieces Single Hero */
            <div className="w-full h-full overflow-hidden bg-white flex items-center justify-center p-3">
              <img
                src={items[0]?.image || board.coverImage || '/assets/placeholders/placeholder-product.svg'}
                alt={board.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          )
        ) : (
          /* Empty Board Architectural Drafting State */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2 bg-ivory-subtle/80">
            <div className="w-12 h-12 rounded-full border border-dashed border-sand flex items-center justify-center text-taupe">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-xs font-serif text-taupe">Curated Canvas Empty</span>
          </div>
        )}

        {/* Room Type & Style Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          <Badge variant="forest" size="xs">
            {board.roomType || 'Living Room'}
          </Badge>
          {board.style && (
            <Badge variant="taupe" size="xs">
              {board.style}
            </Badge>
          )}
          {board.roomLayout && (
            <span className="px-1.5 py-0.5 bg-white/95 text-charcoal border border-sand/60 rounded text-[9px] font-mono font-medium flex items-center gap-0.5 shadow-xs">
              <Compass className="w-2.5 h-2.5 text-forest" />
              Room Plan
            </span>
          )}
        </div>
      </Link>

      {/* Content & Metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/boards/${board.id}`} className="block flex-1">
              <h3 className="font-serif text-xl font-semibold text-charcoal group-hover:text-forest transition-colors leading-snug line-clamp-1">
                {board.title}
              </h3>
            </Link>

            {/* Actions Dropdown Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="p-1 rounded text-taupe hover:text-charcoal hover:bg-ivory transition-colors"
                aria-label="Board options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded border border-sand/60 shadow-elevated z-30 py-1 text-xs">
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="w-full px-3 py-1.5 text-left text-charcoal hover:bg-ivory flex items-center gap-2 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-taupe" />
                      <span>Rename / Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDuplicate}
                      disabled={isDuplicating}
                      className="w-full px-3 py-1.5 text-left text-charcoal hover:bg-ivory flex items-center gap-2 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-taupe" />
                      <span>{isDuplicating ? 'Duplicating...' : 'Duplicate Board'}</span>
                    </button>
                    <div className="my-1 border-t border-sand/30" />
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="w-full px-3 py-1.5 text-left text-red-700 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      <span>Delete Board</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed min-h-[32px]">
            {board.description || 'No design notes provided yet.'}
          </p>

          <div className="flex items-center justify-between text-[11px] text-taupe pt-1">
            <span>
              {itemCount} {itemCount === 1 ? 'Piece' : 'Pieces'} Curated
            </span>
            {dateFormatted && <span>Updated {dateFormatted}</span>}
          </div>
        </div>

        {/* Pricing Strip & Action Footer */}
        <div className="pt-3 border-t border-sand/30 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block">
              Estimated Budget
            </span>
            <PriceDisplay amount={budget} size="lg" className="font-semibold text-charcoal" />
          </div>

          <Link
            to={`/boards/${board.id}`}
            className="py-1.5 px-3 bg-white border border-sand hover:border-forest text-forest hover:bg-forest hover:text-white text-xs font-medium rounded transition-all flex items-center gap-1 shadow-subtle group/btn"
          >
            <span>Open Board</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
