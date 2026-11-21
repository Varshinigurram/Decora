import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Layers, Palette, List, Sparkles, FolderOpen, Compass } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import BoardBudgetSummary from '../components/designBoards/BoardBudgetSummary';
import BoardItemCard from '../components/designBoards/BoardItemCard';
import BoardMoodboardCanvas from '../components/designBoards/BoardMoodboardCanvas';
import CreateBoardModal from '../components/designBoards/CreateBoardModal';
import DeleteBoardModal from '../components/designBoards/DeleteBoardModal';
import { useDesignBoards } from '../context/DesignBoardContext';

export default function DesignBoardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getBoardById,
    updateBoard,
    deleteBoard,
    updateItemQuantity,
    removeItemFromBoard,
    calculateBoardBudget,
    calculateBoardItemCount,
  } = useDesignBoards();

  const [activeTab, setActiveTab] = useState('moodboard'); // 'moodboard' | 'items'
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Look up board
  const board = getBoardById(id);

  // Computed metrics
  const budget = useMemo(() => calculateBoardBudget(board), [board, calculateBoardBudget]);
  const itemCount = useMemo(() => calculateBoardItemCount(board), [board, calculateBoardItemCount]);
  const uniqueCount = useMemo(() => {
    if (!board || !Array.isArray(board.items)) return 0;
    return new Set(board.items.map((it) => it.productId)).size;
  }, [board]);

  const items = board?.items || [];

  // Handlers
  const handleUpdateBoardData = async (updates) => {
    if (!board) return;
    await updateBoard(board.id, updates);
  };

  const handleDeleteBoard = async () => {
    if (!board) return;
    await deleteBoard(board.id);
    navigate('/boards');
  };

  const handleUpdateQuantity = async (boardItemId, qty) => {
    if (!board) return;
    await updateItemQuantity(board.id, boardItemId, qty);
  };

  const handleRemoveItem = async (boardItemId) => {
    if (!board) return;
    await removeItemFromBoard(board.id, boardItemId);
  };

  // If board does not exist
  if (!board) {
    return (
      <div className="bg-ivory min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <EmptyState
          title="Design Board Not Found"
          message={`The requested design board "${id}" does not exist, was removed, or has not been created yet.`}
          actionLabel="Return to All Design Boards"
          onAction={() => navigate('/boards')}
          icon={FolderOpen}
        />
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Design Boards', path: '/boards' },
    { label: board.title },
  ];

  const dateFormatted = board.updatedAt
    ? new Date(board.updatedAt).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="bg-ivory min-h-screen pb-24">
      {/* Sticky Top Breadcrumbs Navigation */}
      <div className="border-b border-sand/40 bg-white/60 backdrop-blur-sm sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Breadcrumbs items={breadcrumbs} />
          <Link
            to="/boards"
            className="text-xs text-taupe hover:text-forest transition-colors inline-flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">All Design Boards</span>
            <span className="sm:hidden">Boards</span>
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Board Header Summary */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sand/40 pb-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="forest" size="xs">
                {board.roomType}
              </Badge>
              <Badge variant="taupe" size="xs">
                {board.style}
              </Badge>
              {board.roomLayout && (
                <span className="px-2 py-0.5 bg-white border border-sand/60 rounded text-[10px] font-mono text-charcoal flex items-center gap-1 shadow-xs">
                  <Compass className="w-3 h-3 text-forest" />
                  Room Plan Saved
                </span>
              )}
              {dateFormatted && (
                <span className="text-[11px] font-mono text-taupe">
                  &bull; Updated {dateFormatted}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-charcoal leading-tight">
                {board.title}
              </h1>
              <button
                type="button"
                onClick={() => setEditModalOpen(true)}
                className="p-1.5 text-taupe hover:text-forest hover:bg-white rounded transition-colors"
                title="Rename or edit board details"
                aria-label="Edit board title and details"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {board.description ? (
              <p className="text-sm text-charcoal-muted leading-relaxed font-serif italic">
                "{board.description}"
              </p>
            ) : (
              <p className="text-xs text-taupe italic">
                No description provided. Click edit to add design notes.
              </p>
            )}
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-end flex-wrap">
            <Link to={`/room-planner?boardId=${board.id}`}>
              <Button
                variant="primary"
                size="sm"
                className="flex items-center gap-1.5 text-xs shadow-subtle"
                title={board.roomLayout ? 'Open interactive 2D floorplan for this board' : 'Stage a new 2D room plan for this board'}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{board.roomLayout ? 'Open Room Plan' : 'Stage Room Layout'}</span>
              </Button>
            </Link>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-charcoal"
            >
              <Edit2 className="w-3.5 h-3.5 text-taupe" />
              <span>Edit Details</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {/* Live Budget & Metrics Summary */}
        <BoardBudgetSummary
          board={board}
          budget={budget}
          itemCount={itemCount}
          uniqueCount={uniqueCount}
        />

        {/* Studio View Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-sand/40 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('moodboard')}
              className={`px-3.5 py-2 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'moodboard'
                  ? 'bg-forest text-white shadow-subtle'
                  : 'bg-white border border-sand/60 text-charcoal hover:border-forest/50'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Editorial Moodboard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('items')}
              className={`px-3.5 py-2 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'items'
                  ? 'bg-forest text-white shadow-subtle'
                  : 'bg-white border border-sand/60 text-charcoal hover:border-forest/50'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Curated Pieces ({itemCount})</span>
            </button>
          </div>

          <span className="text-xs font-mono text-taupe hidden sm:inline">
            {items.length} Snapshot{items.length === 1 ? '' : 's'} Active
          </span>
        </div>

        {/* Active Tab View */}
        {activeTab === 'moodboard' ? (
          <BoardMoodboardCanvas board={board} />
        ) : (
          <div className="space-y-4">
            {items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item) => (
                  <BoardItemCard
                    key={item.boardItemId}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            ) : (
              <div className="card-architectural p-8 sm:p-12 bg-white text-center space-y-4 border border-dashed border-sand">
                <div className="w-12 h-12 rounded-full bg-ivory-subtle border border-sand/50 flex items-center justify-center mx-auto text-taupe">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h4 className="font-serif text-xl font-semibold text-charcoal">
                    No Pieces in this Design Board
                  </h4>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    Explore our furniture catalog or customize architectural pieces with bespoke textiles to populate this board.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <Link to="/catalog">
                    <Button variant="primary" size="sm">
                      Browse Furniture Catalog
                    </Button>
                  </Link>
                  <Link to="/inspiration">
                    <Button variant="secondary" size="sm">
                      Explore Inspiration
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Rename / Edit Details Modal */}
      <CreateBoardModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleUpdateBoardData}
        initialData={board}
      />

      {/* Delete Confirmation Modal */}
      <DeleteBoardModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteBoard}
        boardTitle={board.title}
      />
    </div>
  );
}
