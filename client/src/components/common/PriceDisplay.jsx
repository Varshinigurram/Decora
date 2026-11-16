import React from 'react';
import { formatINR } from '../../utils/formatters';

/**
 * Standardized INR (₹) Price Display Component
 */
export default function PriceDisplay({
  amount = 0,
  prefix = '',
  isDelta = false,
  size = 'md',
  className = '',
}) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm font-medium',
    lg: 'text-lg font-semibold',
    xl: 'text-2xl font-semibold',
  };

  const formatted = formatINR(amount);
  const displayValue = isDelta && amount > 0 ? `+${formatted}` : formatted;

  return (
    <span
      className={`tabular-nums inline-flex items-center tracking-tight ${
        isDelta ? 'text-forest font-medium' : 'text-charcoal'
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {prefix && <span className="text-charcoal-muted font-normal mr-1">{prefix}</span>}
      {displayValue}
    </span>
  );
}
