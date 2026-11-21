import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route protection wrapper.
 * Guards routes against unauthenticated users and restricts admin routes.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.adminOnly=false] - When true, requires role === 'admin'
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-8 h-8 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest text-taupe font-medium">
          Verifying Session...
        </p>
      </div>
    );
  }

  // Unauthenticated visitors are redirected to /login with return destination preserved
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Non-admin customers attempting to access admin-only routes are redirected to home
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
