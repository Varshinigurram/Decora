import React from 'react';
import { PackageOpen } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No Furniture Found',
  message = 'No designs match the selected filters or search terms. Try clearing filters or refining your query.',
  actionLabel = 'Reset All Filters',
  onAction,
  icon: Icon = PackageOpen,
  className = '',
}) {
  return (
    <div
      className={`py-16 px-6 text-center bg-white border border-dashed border-sand/70 rounded p-8 sm:p-12 space-y-4 max-w-xl mx-auto shadow-subtle ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-ivory-subtle border border-sand/40 flex items-center justify-center mx-auto text-taupe">
        <Icon className="w-7 h-7 text-forest" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
          {title}
        </h3>
        <p className="text-sm text-charcoal-muted leading-relaxed max-w-md mx-auto">
          {message}
        </p>
      </div>

      {onAction && (
        <div className="pt-2">
          <Button variant="secondary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
