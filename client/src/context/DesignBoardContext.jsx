import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { designBoardService } from '../services/designBoardService';
import { PRODUCTS } from '../data/products';
import { calculateConfiguredPrice } from '../utils/pricingEngine';

const DesignBoardContext = createContext(null);

export function DesignBoardProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync auth mode to service
  useEffect(() => {
    designBoardService.setAuthMode(isAuthenticated);
  }, [isAuthenticated]);

  // Initial load from persistence service
  const refreshBoards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      designBoardService.setAuthMode(isAuthenticated);
      const data = await designBoardService.getBoards();
      setBoards(data);
    } catch (err) {
      console.error('Failed to load design boards:', err);
      setError(err.message || 'Failed to load design boards');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshBoards();
  }, [refreshBoards]);

  // Create a new board
  const createBoard = async (boardData) => {
    try {
      const created = await designBoardService.createBoard(boardData);
      setBoards((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Failed to create board:', err);
      throw err;
    }
  };

  // Update existing board metadata
  const updateBoard = async (boardId, updates) => {
    try {
      const updated = await designBoardService.updateBoard(boardId, updates);
      setBoards((prev) => prev.map((b) => (b.id === boardId || b._id === boardId ? updated : b)));
      return updated;
    } catch (err) {
      console.error('Failed to update board:', err);
      throw err;
    }
  };

  // Delete a board
  const deleteBoard = async (boardId) => {
    try {
      await designBoardService.deleteBoard(boardId);
      setBoards((prev) => prev.filter((b) => b.id !== boardId && b._id !== boardId));
      return true;
    } catch (err) {
      console.error('Failed to delete board:', err);
      throw err;
    }
  };

  // Retrieve a specific board by ID
  const getBoardById = useCallback(
    (boardId) => {
      return boards.find((b) => b.id === boardId || b._id === boardId) || null;
    },
    [boards]
  );

  // Add an item snapshot to a board
  const addItemToBoard = async (boardId, itemSnapshot) => {
    try {
      const updated = await designBoardService.saveBoardItem(boardId, itemSnapshot);
      setBoards((prev) => prev.map((b) => (b.id === boardId || b._id === boardId ? updated : b)));
      return updated;
    } catch (err) {
      console.error('Failed to add item to board:', err);
      throw err;
    }
  };

  // Update quantity on an item snapshot
  const updateItemQuantity = async (boardId, boardItemId, quantity) => {
    try {
      const safeQty = Math.max(1, parseInt(quantity, 10) || 1);
      const updated = await designBoardService.updateBoardItem(boardId, boardItemId, {
        quantity: safeQty,
      });
      setBoards((prev) => prev.map((b) => (b.id === boardId || b._id === boardId ? updated : b)));
      return updated;
    } catch (err) {
      console.error('Failed to update item quantity:', err);
      throw err;
    }
  };

  // Update an item's customization configuration and re-evaluate price
  const updateItemConfiguration = async (boardId, boardItemId, nextConfig) => {
    try {
      const targetBoard = boards.find((b) => b.id === boardId || b._id === boardId);
      if (!targetBoard) throw new Error('Board not found');

      const existingItem = targetBoard.items?.find((it) => it.boardItemId === boardItemId);
      if (!existingItem) throw new Error('Item not found on board');

      const product = PRODUCTS.find((p) => p.id === existingItem.productId);
      if (!product) throw new Error('Product definition not found');

      const pricing = calculateConfiguredPrice(product, nextConfig);
      if (!pricing.isValid) {
        throw new Error(`Invalid configuration: ${pricing.errors.join(', ')}`);
      }

      const updates = {
        configuration: nextConfig,
        unitPrice: pricing.finalPrice,
        isCustomized: !pricing.isStandardBaseline,
        selectedOptions: pricing.selectedOptions,
      };

      const updated = await designBoardService.updateBoardItem(boardId, boardItemId, updates);
      setBoards((prev) => prev.map((b) => (b.id === boardId || b._id === boardId ? updated : b)));
      return updated;
    } catch (err) {
      console.error('Failed to update item configuration:', err);
      throw err;
    }
  };

  // Remove an item from a board
  const removeItemFromBoard = async (boardId, boardItemId) => {
    try {
      const updated = await designBoardService.removeBoardItem(boardId, boardItemId);
      setBoards((prev) => prev.map((b) => (b.id === boardId || b._id === boardId ? updated : b)));
      return updated;
    } catch (err) {
      console.error('Failed to remove item from board:', err);
      throw err;
    }
  };

  // Save room layout (dimensions + placed pieces) to a board
  const saveRoomLayoutToBoard = async (boardId, roomLayout) => {
    try {
      const updated = await designBoardService.saveRoomLayout(boardId, roomLayout);
      setBoards((prev) => prev.map((b) => (b.id === boardId || b._id === boardId ? updated : b)));
      return updated;
    } catch (err) {
      console.error('Failed to save room layout to board:', err);
      throw err;
    }
  };

  // Duplicate an existing user board
  const duplicateBoard = async (boardId) => {
    try {
      const created = await designBoardService.duplicateBoard(boardId);
      setBoards((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Failed to duplicate board:', err);
      throw err;
    }
  };

  // Duplicate an inspiration template
  const duplicateTemplate = async (templateId) => {
    try {
      const created = await designBoardService.duplicateTemplate(templateId);
      setBoards((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Failed to duplicate template:', err);
      throw err;
    }
  };

  // Helper: compute total budget from saved snapshots and quantities
  const calculateBoardBudget = useCallback((board) => {
    if (!board || !Array.isArray(board.items)) return 0;
    return board.items.reduce((acc, item) => {
      const price = Number(item.unitPrice) || 0;
      const qty = Number(item.quantity) || 1;
      return acc + price * qty;
    }, 0);
  }, []);

  // Helper: compute total item piece count
  const calculateBoardItemCount = useCallback((board) => {
    if (!board || !Array.isArray(board.items)) return 0;
    return board.items.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
  }, []);

  const value = {
    boards,
    isLoading,
    error,
    templates: designBoardService.getSampleTemplates(),
    refreshBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    getBoardById,
    addItemToBoard,
    updateItemQuantity,
    updateItemConfiguration,
    removeItemFromBoard,
    saveRoomLayoutToBoard,
    duplicateBoard,
    duplicateTemplate,
    calculateBoardBudget,
    calculateBoardItemCount,
  };

  return (
    <DesignBoardContext.Provider value={value}>
      {children}
    </DesignBoardContext.Provider>
  );
}

export function useDesignBoards() {
  const context = useContext(DesignBoardContext);
  if (!context) {
    throw new Error('useDesignBoards must be used within a DesignBoardProvider');
  }
  return context;
}
