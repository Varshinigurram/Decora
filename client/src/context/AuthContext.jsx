import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    return authenticatedUser;
  };

  /**
   * Registers a new customer account via POST /auth/register.
   */
  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    const newUser = response.data.data.user;
    setUser(newUser);
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
    }
  };

  /**
   * Guest design-board migration boundary hook.
   * NOTE: As mandated by Stage 3 architecture, the backend /boards/migrate endpoint
   * will be implemented in Stage 5. Local storage is preserved and never cleared here.
   */
  const migrateGuestBoards = async () => {
    return { migrated: false, count: 0, reason: 'Deferred to Stage 5 backend board persistence' };
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
    migrateGuestBoards,
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
