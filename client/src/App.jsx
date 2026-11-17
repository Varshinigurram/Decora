import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { DesignBoardProvider } from './context/DesignBoardContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <DesignBoardProvider>
            <AppRoutes />
          </DesignBoardProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
