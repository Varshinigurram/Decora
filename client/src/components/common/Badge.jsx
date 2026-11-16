import React from 'react';

/**
 * Architectural Badge Primitive
 */
export default function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
}) {
  const variants = {
    neutral: 'bg-ivory-subtle text-charcoal border border-sand/60',
    forest: 'bg-forest/10 text-forest border border-forest/20 font-medium',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200 font-medium',
    taupe: 'bg-taupe/15 text-taupe-muted border border-taupe/30 font-medium',
    charcoal: 'bg-charcoal text-ivory border border-transparent font-medium',
  };

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5 tracking-wider uppercase',
    sm: 'text-xs px-2.5 py-1 tracking-wide',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-sm ${variants[variant] || variants.neutral} ${
        sizes[size] || sizes.sm
      } ${className}`}
    >
      {children}
    </span>
  );
}
