import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { wishlistService } from '../services/wishlistService';
import { designBoardService } from '../services/designBoardService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Safe, non-blocking guest-to-account migration helper.
   * Migrates local guest wishlist and guest design boards to MongoDB.
   * Clears localStorage only after confirmed server persistence.
   */
  const migrateGuestData = async () => {
    // 1. Migrate guest wishlist (supports both current and legacy storage keys)
    try {
      const ids = wishlistService.getGuestWishlistIds();
      if (Array.isArray(ids) && ids.length > 0) {
        await wishlistService.syncWishlist(ids);
        wishlistService.clearGuestStorage();
      }
    } catch (err) {
      console.warn('Guest wishlist migration encountered a non-blocking error:', err);
    }

    // 2. Migrate guest design boards
    try {
      const guestBoards = designBoardService.getGuestBoardsFromStorage();
      if (Array.isArray(guestBoards) && guestBoards.length > 0) {
        await designBoardService.syncGuestBoards(guestBoards);
        designBoardService.clearGuestStorage();
      }
    } catch (err) {
      console.warn('Guest design board migration encountered a non-blocking error:', err);
    }
  };

  /**
   * Validates active session via GET /auth/me on mount.
   */
  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.success && response.data?.data?.user) {
        setUser(response.data.data.user);
      } else {
        setUser(null);
      }
    } catch {
      // 401 or network error: user is unauthenticated
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Listen for silent refresh failure events from api.js
    const handleSessionExpired = () => {
      setUser(null);
    };

    window.addEventListener('decora:session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('decora:session-expired', handleSessionExpired);
    };
  }, [checkAuth]);

  /**
   * Authenticates user credentials via POST /auth/login.
   */
  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const authenticatedUser = response.data.data.user;
    setUser(authenticatedUser);

    // Non-blocking guest migration
    migrateGuestData().catch((err) => console.warn('Background guest migration note:', err));

    return authenticatedUser;
  };

  /**
   * Registers a new customer account via POST /auth/register.
   */
  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    const newUser = response.data.data.user;
    setUser(newUser);

    // Non-blocking guest migration
    migrateGuestData().catch((err) => console.warn('Background guest migration note:', err));

    return newUser;
  };

  /**
   * Revokes session and clears cookies via POST /auth/logout.
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Proceed with client logout even if server returns error
    } finally {
      setUser(null);
      designBoardService.setAuthMode(false);
    }
  };

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    checkAuth,
    migrateGuestBoards: migrateGuestData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
