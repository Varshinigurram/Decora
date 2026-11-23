import api from './api.js';

export const wishlistService = {
  /**
   * Retrieves the current user's wishlist from MongoDB.
   */
  async getWishlist() {
    const response = await api.get('/wishlist');
    return response.data?.data || { productIds: [], products: [], total: 0 };
  },

  /**
   * Toggles product in/out of the user's wishlist.
   */
  async toggleWishlist(productId) {
    const response = await api.post('/wishlist/toggle', { productId });
    return response.data?.data;
  },

  /**
   * Adds a product to the user's wishlist.
   */
  async addItem(productId) {
    const response = await api.post('/wishlist/items', { productId });
    return response.data?.data;
  },

  /**
   * Removes a product from the user's wishlist.
   */
  async removeItem(productId) {
    const response = await api.delete(`/wishlist/items/${productId}`);
    return response.data?.data;
  },

  /**
   * Clears the user's wishlist on the server.
   */
  async clearWishlist() {
    const response = await api.delete('/wishlist');
    return response.data?.data;
  },

  /**
   * Bulk syncs guest wishlist into authenticated user account.
   */
  async syncWishlist(productIds) {
    const response = await api.post('/wishlist/sync', { productIds });
    return response.data?.data;
  },

  /**
   * Retrieves guest wishlist IDs from localStorage, supporting both
   * the current key ('decora_wishlist_ids') and legacy keys ('decora_wishlist').
   * Normalizes IDs from string arrays and object arrays [{ id }, { productId }].
   */
  getGuestWishlistIds() {
    const ids = new Set();
    const tryParse = (key) => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((item) => {
            if (typeof item === 'string' && item.trim().length > 0) {
              ids.add(item.trim());
            } else if (item && typeof item === 'object') {
              const id = item.id || item.productId;
              if (typeof id === 'string' && id.trim().length > 0) {
                ids.add(id.trim());
              }
            }
          });
        }
      } catch (e) {
        console.warn(`Failed to parse wishlist from ${key}:`, e);
      }
    };

    tryParse('decora_wishlist_ids');
    tryParse('decora_wishlist');
    return Array.from(ids);
  },

  /**
   * Safely clears all guest wishlist storage keys.
   */
  clearGuestStorage() {
    try {
      localStorage.removeItem('decora_wishlist_ids');
      localStorage.removeItem('decora_wishlist');
    } catch {}
  },
};

export default wishlistService;
