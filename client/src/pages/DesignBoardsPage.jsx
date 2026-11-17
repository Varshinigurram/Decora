import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Layers, Sparkles, Compass, FolderPlus, ArrowRight, BookOpen } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import DesignBoardCard from '../components/designBoards/DesignBoardCard';
import CreateBoardModal from '../components/designBoards/CreateBoardModal';
import DeleteBoardModal from '../components/designBoards/DeleteBoardModal';
import { useDesignBoards } from '../context/DesignBoardContext';

export default function DesignBoardsPage() {
  const {
    boards,
    isLoading,
    templates,
    createBoard,
    updateBoard,
    deleteBoard,
    duplicateTemplate,
  } = useDesignBoards();

  const [activeRoomFilter, setActiveRoomFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [deletingBoard, setDeletingBoard] = useState(null);
  const [duplicatingTemplateId, setDuplicatingTemplateId] = useState(null);

  // Room type filter options
  const roomFilterOptions = useMemo(() => {
    return ['All', 'Living Room', 'Bedroom', 'Dining Room', 'Home Office', 'Architectural Studio'];
  }, []);

  // Filtered boards based on roomType
  const filteredBoards = useMemo(() => {
    if (activeRoomFilter === 'All') return boards;
    return boards.filter((b) => b.roomType === activeRoomFilter);
  }, [boards, activeRoomFilter]);

  // Handlers
  const handleSaveBoard = async (boardData) => {
    if (editingBoard) {
      await updateBoard(editingBoard.id, boardData);
      setEditingBoard(null);
    } else {
      await createBoard(boardData);
    }
  };

  const handleDuplicateTemplate = async (templateId) => {
    setDuplicatingTemplateId(templateId);
    try {
      await duplicateTemplate(templateId);
    } catch (err) {
      console.error('Failed to duplicate template:', err);
    } finally {
      setDuplicatingTemplateId(null);
    }
  };

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Design Boards' },
  ];

  return (
    <div className="bg-ivory min-h-screen pb-24">
      {/* Breadcrumbs Navigation */}
      <div className="border-b border-sand/40 bg-white/60 backdrop-blur-sm sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Editorial Hero Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sand/40 pb-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] uppercase tracking-widest text-taupe font-semibold block">
              Project Moodboards &amp; Staging
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-charcoal leading-tight">
              Virtual Design Boards
            </h1>
            <p className="text-sm text-charcoal-muted leading-relaxed">
              Curate personal room projects, retain bespoke material configurations, and manage estimated furniture budgets with architectural clarity.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setEditingBoard(null);
              setCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 shrink-0 self-start md:self-end shadow-subtle"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Board</span>
          </Button>
        </div>

        {/* Room Category Filter Tabs (Visible when boards exist) */}
        {boards.length > 0 && (
          <div className="flex items-center justify-between gap-4 border-b border-sand/40 pb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {roomFilterOptions.map((filter) => {
                const isSelected = activeRoomFilter === filter;
                const count =
                  filter === 'All'
                    ? boards.length
                    : boards.filter((b) => b.roomType === filter).length;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveRoomFilter(filter)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-forest text-white shadow-subtle'
                        : 'bg-white border border-sand/60 text-charcoal hover:border-forest/50'
                    }`}
                  >
                    <span>{filter}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-sand/30 text-taupe'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <span className="text-xs text-charcoal-muted font-mono hidden sm:inline">
              {filteredBoards.length} {filteredBoards.length === 1 ? 'Board' : 'Boards'}
            </span>
          </div>
        )}

        {/* Board Collection Grid */}
        {boards.length > 0 ? (
          filteredBoards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredBoards.map((board) => (
                <DesignBoardCard
                  key={board.id}
                  board={board}
                  onEdit={(b) => {
                    setEditingBoard(b);
                    setCreateModalOpen(true);
                  }}
                  onDelete={(b) => setDeletingBoard(b)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={`No Boards in "${activeRoomFilter}"`}
              message="You have no design boards categorized under this room type. Switch to All or create a new board for this space."
              actionLabel="View All Boards"
              onAction={() => setActiveRoomFilter('All')}
            />
          )
        ) : (
          /* Editorial Empty State when user has 0 boards */
          <div className="space-y-12">
            <div className="card-architectural p-8 sm:p-14 bg-white border border-dashed border-sand text-center space-y-6 max-w-2xl mx-auto shadow-subtle">
              <div className="w-16 h-16 rounded-full bg-ivory-subtle border border-sand/50 flex items-center justify-center mx-auto text-forest">
                <FolderPlus className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
                  Create Your First Design Board
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                  Design boards let you organize furniture compositions by room, save custom material configurations, and evaluate realistic spatial budgets.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setEditingBoard(null);
                    setCreateModalOpen(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 shadow-subtle"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Board</span>
                </Button>

                <Link to="/inspiration" className="w-full sm:w-auto">
                  <Button variant="secondary" size="md" className="w-full flex items-center justify-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-taupe" />
                    <span>Explore Inspiration</span>
                  </Button>
                </Link>

                <Link to="/catalog" className="w-full sm:w-auto">
                  <Button variant="secondary" size="md" className="w-full flex items-center justify-center gap-1.5">
                    <span>Browse Furniture</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Optional Static Inspiration Templates Section */}
            {templates.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-sand/40">
                <div className="space-y-1 max-w-xl">
                  <span className="text-[10px] uppercase tracking-widest text-taupe font-semibold block">
                    Optional Inspiration Templates
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-charcoal">
                    Begin with an Editorial Concept
                  </h3>
                  <p className="text-xs text-charcoal-muted">
                    Explore or duplicate a pre-configured design template into your personal boards to see how swatches and proportions harmonize.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="card-architectural p-6 bg-white flex flex-col justify-between space-y-4 shadow-subtle border border-sand/50"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-ivory-subtle border border-sand/50 rounded text-[10px] font-mono text-charcoal">
                            {template.roomType} &bull; {template.style}
                          </span>
                          <span className="text-[11px] font-mono text-taupe">
                            {template.items.length} Curated Pieces
                          </span>
                        </div>

                        <h4 className="font-serif text-xl font-semibold text-charcoal">
                          {template.title}
                        </h4>

                        <p className="text-xs text-charcoal-muted leading-relaxed">
                          {template.description}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          {template.items.map((item) => (
                            <span
                              key={item.boardItemId}
                              className="px-2 py-1 bg-ivory text-[10px] font-medium text-charcoal border border-sand/40 rounded truncate max-w-[140px]"
                            >
                              {item.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-sand/30 flex items-center justify-between">
                        <span className="text-xs text-charcoal font-serif font-medium">
                          Estimated Budget: ₹{template.items.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0).toLocaleString('en-IN')}
                        </span>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDuplicateTemplate(template.id)}
                          disabled={duplicatingTemplateId === template.id}
                          className="flex items-center gap-1.5 text-xs text-forest hover:bg-forest hover:text-white transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>
                            {duplicatingTemplateId === template.id ? 'Duplicating...' : 'Duplicate Template'}
                          </span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create / Edit Board Modal */}
      <CreateBoardModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setEditingBoard(null);
        }}
        onSubmit={handleSaveBoard}
        initialData={editingBoard}
      />

      {/* Delete Confirmation Modal */}
      <DeleteBoardModal
        isOpen={Boolean(deletingBoard)}
        onClose={() => setDeletingBoard(null)}
        onConfirm={async () => {
          if (deletingBoard) {
            await deleteBoard(deletingBoard.id);
          }
        }}
        boardTitle={deletingBoard?.title || ''}
      />
    </div>
  );
}
