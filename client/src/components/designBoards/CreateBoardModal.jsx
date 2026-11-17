import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export const ROOM_TYPE_OPTIONS = [
  'Living Room',
  'Bedroom',
  'Dining Room',
  'Home Office',
  'Architectural Studio',
  'Sanctuary',
];

export const STYLE_OPTIONS = [
  'Japandi',
  'Warm Editorial',
  'Nordic Minimalist',
  'Modern Architectural',
  'Organic Modern',
];

export default function CreateBoardModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roomType, setRoomType] = useState('Living Room');
  const [style, setStyle] = useState('Warm Editorial');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(initialData?.id);

  // Sync state when editing or opening
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setRoomType(initialData.roomType || 'Living Room');
      setStyle(initialData.style || 'Warm Editorial');
    } else {
      setTitle('');
      setDescription('');
      setRoomType('Living Room');
      setStyle('Warm Editorial');
    }
    setError('');
    setIsSubmitting(false);
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError('Please provide a name for your design board.');
      return;
    }

    if (cleanTitle.length < 2) {
      setError('Board name must be at least 2 characters.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit({
        title: cleanTitle,
        description: description.trim(),
        roomType,
        style,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save design board. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Rename & Edit Board' : 'Create New Design Board'}
      subtitle={isEditing ? 'Board Configuration' : 'Project Curation'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
            {error}
          </div>
        )}

        {/* Board Title Input */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-charcoal font-semibold mb-1.5">
            Board Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Living Room Sanctuary 2026"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            className="w-full px-3.5 py-2.5 text-sm border border-sand rounded bg-white text-charcoal focus:outline-none focus:ring-1 focus:ring-forest focus:border-forest"
            autoFocus
          />
        </div>

        {/* Room Type & Style Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal font-semibold mb-1.5">
              Room Category
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-sand rounded bg-white text-charcoal focus:outline-none focus:ring-1 focus:ring-forest"
            >
              {ROOM_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal font-semibold mb-1.5">
              Interior Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-sand rounded bg-white text-charcoal focus:outline-none focus:ring-1 focus:ring-forest"
            >
              {STYLE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-charcoal font-semibold mb-1.5">
            Design Narrative &amp; Notes <span className="text-taupe text-[11px] font-normal">(Optional)</span>
          </label>
          <textarea
            rows="3"
            placeholder="Brief vision, intended spatial mood, or material focus..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-sand rounded bg-white text-charcoal focus:outline-none focus:ring-1 focus:ring-forest resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-sand/30 flex items-center justify-end gap-3">
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Board' : 'Create Board'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
