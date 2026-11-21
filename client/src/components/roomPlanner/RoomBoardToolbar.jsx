import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Compass,
  Check,
  Save,
  AlertCircle,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

/**
 * RoomBoardToolbar
 * 
 * Dedicated control strip when the 2D Room Planner is linked to an active Design Board.
 * Keeps board save, dirty tracking, and return navigation cleanly separated
 * from budget calculation concerns (RoomBudgetBar).
 */
export default function RoomBoardToolbar({
  board,
  isDirty,
  isSaving,
  saveSuccess,
  saveError,
  restorationErrors = [],
  onSaveLayout,
}) {
  if (!board) return null;

  return (
    <div className="space-y-3">
      {/* Primary Toolbar Card */}
      <div className="card-architectural p-4 sm:p-4.5 bg-white border border-forest/30 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Board Context & Status */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={`/boards/${board.id}`}
            className="p-2 text-taupe hover:text-forest hover:bg-ivory-subtle rounded border border-sand/50 transition-colors shrink-0"
            title={`Return to ${board.title}`}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="min-w-0 space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-forest font-semibold flex items-center gap-1">
                <Compass className="w-3 h-3 text-forest" />
                Active Design Board
              </span>
              <Badge variant="forest" size="xs">
                {board.roomType}
              </Badge>
              {isDirty ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                  Unsaved Changes
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-forest/10 text-forest border border-forest/20">
                  <Check className="w-3 h-3" />
                  Layout Saved
                </span>
              )}
            </div>

            <h3 className="font-serif text-lg font-semibold text-charcoal truncate">
              {board.title}
            </h3>
          </div>
        </div>

        {/* Right: Save & Return Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Link to={`/boards/${board.id}`}>
            <Button
              variant="secondary"
              size="sm"
              className="text-xs text-charcoal flex items-center gap-1"
            >
              <span>Back to Board</span>
            </Button>
          </Link>

          <Button
            variant="primary"
            size="sm"
            onClick={onSaveLayout}
            disabled={isSaving}
            className={`flex items-center gap-1.5 text-xs shadow-subtle min-w-[130px] justify-center transition-all ${
              saveSuccess
                ? 'bg-forest-dark border-forest-dark'
                : isDirty
                ? 'bg-forest hover:bg-forest-dark'
                : 'bg-forest/80'
            }`}
          >
            {isSaving ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Plan...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Layout Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{isDirty ? 'Save to Board' : 'Update Layout'}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="p-3 bg-forest/10 border border-forest/30 rounded text-xs text-forest flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-forest shrink-0" />
            <span>
              Room plan successfully saved to <strong>{board.title}</strong>. All coordinates, rotations, and bespoke configurations are preserved.
            </span>
          </div>
          <Link
            to={`/boards/${board.id}`}
            className="font-medium underline hover:text-forest-dark shrink-0"
          >
            View Board &rarr;
          </Link>
        </div>
      )}

      {/* Save Error Alert */}
      {saveError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">Failed to save room layout</p>
            <p className="text-[11px] text-red-700">{saveError}</p>
          </div>
        </div>
      )}

      {/* Restoration Warnings Banner (if invalid configurations were preserved without fabrication) */}
      {restorationErrors.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 space-y-1 animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Configuration Warnings Restored from Board</span>
          </div>
          <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5 pl-1">
            {restorationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
          <p className="text-[10px] text-amber-700 pt-0.5 italic">
            Original data preserved without artificial default substitution.
          </p>
        </div>
      )}
    </div>
  );
}
