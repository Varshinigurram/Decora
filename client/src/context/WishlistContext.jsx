import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

const STORAGE_KEY = 'decora_wishlist_ids';

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validIds = parsed.filter(
            (id) => typeof id === 'string' && id.trim().length > 0
          );
          return new Set(validIds);
        }
      }
    } catch (e) {
      console.warn('Unable to load wishlist from localStorage:', e);
    }
    // Default initial seeded item for immediate aesthetic engagement on first visit
    return new Set(['chair-komorebi']);
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(wishlistIds)));
    } catch (e) {
      console.warn('Unable to persist wishlist to localStorage:', e);
    }
  }, [wishlistIds]);

  const toggleWishlist = (productId) => {
    if (!productId) return;
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistIds.has(productId);
  };

  const addToWishlist = (productId) => {
    if (!productId) return;
    setWishlistIds((prev) => new Set(prev).add(productId));
  };

  const removeFromWishlist = (productId) => {
    if (!productId) return;
    setWishlistIds((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  };

  const clearWishlist = () => {
    setWishlistIds(new Set());
  };

  const value = {
    wishlistIds,
    wishlistCount: wishlistIds.size,
    isInWishlist,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
