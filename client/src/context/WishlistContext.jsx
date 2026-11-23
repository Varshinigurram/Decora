import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { wishlistService } from '../services/wishlistService';

const WishlistContext = createContext(null);

const STORAGE_KEY = 'decora_wishlist_ids';

export function WishlistProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const guestIds = wishlistService.getGuestWishlistIds();
      if (guestIds.length > 0) {
        return new Set(guestIds);
      }
    } catch (e) {
      console.warn('Unable to load wishlist from localStorage:', e);
    }
    return new Set(['chair-komorebi']);
  });

  const [isLoading, setIsLoading] = useState(false);
  const isSyncingRef = useRef(false);

  /**
   * Syncs / fetches wishlist from MongoDB when user is authenticated.
   */
  const loadUserWishlist = useCallback(async () => {
    if (!isAuthenticated || isSyncingRef.current) return;
    try {
      setIsLoading(true);
      isSyncingRef.current = true;

      // 1. Check for guest items to migrate (supports current & legacy keys)
      let guestIds = [];
      try {
        guestIds = wishlistService.getGuestWishlistIds();
      } catch {
        guestIds = [];
      }

      let data;
      if (guestIds.length > 0) {
        // Sync guest items to account
        data = await wishlistService.syncWishlist(guestIds);
        // Clear local guest storage only after successful server confirmation
        wishlistService.clearGuestStorage();
      } else {
        // Retrieve account wishlist
        data = await wishlistService.getWishlist();
      }

      if (data && Array.isArray(data.productIds)) {
        setWishlistIds(new Set(data.productIds));
      }
    } catch (err) {
      console.error('Failed to sync authenticated wishlist with server:', err);
    } finally {
      setIsLoading(false);
      isSyncingRef.current = false;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserWishlist();
    }
  }, [isAuthenticated, loadUserWishlist]);

  // Persist guest wishlist to localStorage when unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(wishlistIds)));
      } catch (e) {
        console.warn('Unable to persist wishlist to localStorage:', e);
      }
    }
  }, [wishlistIds, isAuthenticated]);

  const toggleWishlist = async (productId) => {
    if (!productId) return;

    // Optimistic UI update
    const previous = new Set(wishlistIds);
    const next = new Set(previous);
    const isAdding = !next.has(productId);
    if (isAdding) {
      next.add(productId);
    } else {
      next.delete(productId);
    }
    setWishlistIds(next);

    // If authenticated, sync with server
    if (isAuthenticated) {
      try {
        await wishlistService.toggleWishlist(productId);
      } catch (err) {
        console.error('Wishlist server toggle failed, rolling back:', err);
        setWishlistIds(previous);
      }
    }
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistIds.has(productId);
  };

  const addToWishlist = async (productId) => {
    if (!productId || wishlistIds.has(productId)) return;

    const previous = new Set(wishlistIds);
    setWishlistIds(new Set(previous).add(productId));

    if (isAuthenticated) {
      try {
        await wishlistService.addItem(productId);
      } catch (err) {
        console.error('Wishlist server add failed, rolling back:', err);
        setWishlistIds(previous);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!productId || !wishlistIds.has(productId)) return;

    const previous = new Set(wishlistIds);
    const next = new Set(previous);
    next.delete(productId);
    setWishlistIds(next);

    if (isAuthenticated) {
      try {
        await wishlistService.removeItem(productId);
      } catch (err) {
        console.error('Wishlist server remove failed, rolling back:', err);
        setWishlistIds(previous);
      }
    }
  };

  const clearWishlist = async () => {
    const previous = new Set(wishlistIds);
    setWishlistIds(new Set());

    if (isAuthenticated) {
      try {
        await wishlistService.clearWishlist();
      } catch (err) {
        console.error('Wishlist server clear failed, rolling back:', err);
        setWishlistIds(previous);
      }
    } else {
      wishlistService.clearGuestStorage();
    }
  };

  const value = {
    wishlistIds,
    wishlistCount: wishlistIds.size,
    isLoading,
    isInWishlist,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    refreshWishlist: loadUserWishlist,
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
