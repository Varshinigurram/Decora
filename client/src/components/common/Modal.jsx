import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Frame */}
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
          className={`w-full ${maxWidth} bg-white rounded border border-sand/60 shadow-elevated text-left transform transition-all animate-in zoom-in-95 duration-200 p-6 sm:p-7 relative space-y-5`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-sand/40 pb-4">
            <div>
              {subtitle && (
                <span className="text-[10px] uppercase tracking-widest text-taupe font-semibold block">
                  {subtitle}
                </span>
              )}
              <h3
                id="modal-headline"
                className="font-serif text-2xl font-semibold text-charcoal mt-0.5 leading-snug"
              >
                {title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-taupe hover:text-charcoal p-1.5 rounded hover:bg-ivory transition-colors -mr-1.5 -mt-1.5"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
