import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Route View Pages
import HomePage from '../pages/HomePage';
import InspirationPage from '../pages/InspirationPage';
import InspirationDetailPage from '../pages/InspirationDetailPage';
import CatalogPage from '../pages/CatalogPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CustomizerPage from '../pages/CustomizerPage';
import WishlistPage from '../pages/WishlistPage';
import DesignBoardsPage from '../pages/DesignBoardsPage';
import DesignBoardDetailPage from '../pages/DesignBoardDetailPage';
import RoomPlannerPage from '../pages/RoomPlannerPage';
import ConsultationPage from '../pages/ConsultationPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/inspiration" element={<InspirationPage />} />
        <Route path="/inspiration/:id" element={<InspirationDetailPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:id" element={<ProductDetailPage />} />
        <Route path="/customizer" element={<CustomizerPage />} />
        <Route path="/customizer/:productId" element={<CustomizerPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/boards" element={<DesignBoardsPage />} />
        <Route path="/boards/:id" element={<DesignBoardDetailPage />} />
        <Route path="/room-planner" element={<RoomPlannerPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
