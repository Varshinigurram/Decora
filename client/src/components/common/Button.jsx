import React from 'react';

/**
 * Architectural Button Primitive
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon = null,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded';

  const variants = {
    primary: 'bg-forest text-ivory hover:bg-forest-dark border border-transparent shadow-subtle',
    secondary: 'bg-transparent border border-charcoal text-charcoal hover:bg-ivory-subtle hover:border-forest hover:text-forest',
    ghost: 'bg-transparent text-charcoal-muted hover:text-charcoal hover:bg-ivory-subtle/60 border border-transparent',
    destructive: 'bg-red-50 text-accent-error border border-red-200 hover:bg-red-100',
    icon: 'p-2 bg-transparent text-charcoal hover:bg-ivory-subtle rounded-full',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        variant !== 'icon' ? sizes[size] || sizes.md : ''
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
