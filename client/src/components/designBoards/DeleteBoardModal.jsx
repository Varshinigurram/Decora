import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function DeleteBoardModal({
  isOpen,
  onClose,
  onConfirm,
  boardTitle,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('Delete board error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Design Board"
      subtitle="Irreversible Action"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="p-3.5 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Are you sure you want to permanently delete <strong className="font-semibold text-red-900">"{boardTitle}"</strong>? All curated furniture snapshots and room layouts saved within this board will be removed.
          </p>
        </div>

        <div className="pt-2 border-t border-sand/30 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-700 text-white hover:bg-red-800 border-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete Board'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
