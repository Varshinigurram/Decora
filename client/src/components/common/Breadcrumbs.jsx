import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({
  items = [],
  separator,
  className = '',
}) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`text-xs text-charcoal-muted ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center gap-1.5 sm:gap-2">
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="hover:text-forest transition-colors flex items-center gap-1"
                >
                  {index === 0 && item.label === 'Home' ? (
                    <Home className="w-3.5 h-3.5 text-taupe shrink-0" />
                  ) : null}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={isLast ? 'text-charcoal font-medium truncate max-w-[200px] sm:max-w-xs' : ''}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="text-sand select-none" aria-hidden="true">
                  {separator || <ChevronRight className="w-3.5 h-3.5 text-sand" />}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
