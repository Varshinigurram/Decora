/**
 * Décora – Design Board Persistence Service Adapter
 * 
 * Provides an asynchronous service interface for managing design boards and item snapshots.
 * Current implementation uses browser localStorage, isolated so it can seamlessly
 * migrate to backend API endpoints (e.g. Axios / MongoDB) in Phase 4/5.
 * 
 * Guarantees:
 * - Pure asynchronous API (returns Promises).
 * - Graceful error handling for corrupted or quota-limited storage.
 * - Does not auto-seed personal boards when storage is empty (clean empty state).
 * - Offers optional sample templates for explicit user duplication.
 */

const STORAGE_KEY = 'decora_design_boards';

/**
 * Optional editorial inspiration templates.
 * These are NEVER auto-injected into personal boards; the user must explicitly
 * choose to duplicate or explore them.
 */
export const SAMPLE_BOARD_TEMPLATES = [
  {
    id: 'template-japandi-living',
    title: 'Japandi Living Sanctuary',
    description: 'A harmonious blend of Japanese minimalism and Scandinavian warmth featuring low-profile oak and cream bouclé.',
    roomType: 'Living Room',
    style: 'Japandi',
    coverImage: '/assets/categories/cat-living.svg',
    items: [
      {
        boardItemId: 'tmpl-item-sylvan',
        productId: 'sofa-sylvan',
        productSlug: 'sylvan-minimalist-sofa',
        name: 'Sylvan 3-Seater Minimalist Sofa',
        category: 'Seating',
        image: '/assets/categories/cat-living.svg',
        quantity: 1,
        unitPrice: 51500,
        isCustomized: true,
        configuration: {
          fabricId: 'fab-boucle-warm',
          finishId: 'fin-oak',
          sizeId: 'size-3seater',
        },
        selectedOptions: {
          fabric: { id: 'fab-boucle-warm', name: 'Oatmeal Bouclé', delta: 6500, colorHex: '#F0ECE1' },
          finish: { id: 'fin-oak', name: 'Natural White Oak', delta: 0, colorHex: '#D8C8B5' },
          size: { id: 'size-3seater', name: '3-Seater (220 cm)', delta: 0, scaleFactor: 1.0 },
        },
        dimensions: { width: 220, depth: 90, height: 76, formatted: '220 × 90 × 76 cm' },
        addedAt: '2026-11-17T10:00:00.000Z',
      },
      {
        boardItemId: 'tmpl-item-kanso',
        productId: 'table-kanso',
        productSlug: 'kanso-sculptural-coffee-table',
        name: 'Kanso Sculptural Coffee Table',
        category: 'Tables',
        image: '/assets/categories/cat-living.svg',
        quantity: 1,
        unitPrice: 18500,
        isCustomized: false,
        configuration: { fabricId: null, finishId: null, sizeId: null },
        selectedOptions: { fabric: null, finish: null, size: null },
        dimensions: { width: 110, depth: 60, height: 42, formatted: '110 × 60 × 42 cm' },
        addedAt: '2026-11-17T10:00:00.000Z',
      },
      {
        boardItemId: 'tmpl-item-komorebi',
        productId: 'chair-komorebi',
        productSlug: 'komorebi-lounge-chair',
        name: 'Komorebi Lounge Chair',
        category: 'Seating',
        image: '/assets/categories/cat-living.svg',
        quantity: 1,
        unitPrice: 33700,
        isCustomized: true,
        configuration: {
          fabricId: 'fab-boucle',
          finishId: 'fin-walnut',
          sizeId: 'sz-std',
        },
        selectedOptions: {
          fabric: { id: 'fab-boucle', name: 'Cream Bouclé', delta: 3500, colorHex: '#F4F0EA' },
          finish: { id: 'fin-walnut', name: 'Smoked Walnut', delta: 2200, colorHex: '#4A3525' },
          size: { id: 'sz-std', name: 'Standard Scale', delta: 0, scaleFactor: 1.0 },
        },
        dimensions: { width: 78, depth: 84, height: 72, formatted: '78 × 84 × 72 cm' },
        addedAt: '2026-11-17T10:00:00.000Z',
      },
    ],
    roomLayout: {
      roomLength: 5.5,
      roomWidth: 4.2,
      units: 'm',
      furnitureInstances: [
        {
          instanceId: 'inst-tmpl-sofa',
          boardItemId: 'tmpl-item-sylvan',
          productId: 'sofa-sylvan',
          name: 'Sylvan 3-Seater Minimalist Sofa',
          x: 100,
          y: 70,
          rotation: 0,
          w: 220,
          d: 90,
          glyphType: 'sofa',
          price: 51500,
          configuration: { fabricId: 'fab-boucle-warm', finishId: 'fin-oak', sizeId: 'size-3seater' },
          activeFabric: { id: 'fab-boucle-warm', name: 'Oatmeal Bouclé', colorHex: '#F0ECE1' },
          activeFinish: { id: 'fin-oak', name: 'Natural White Oak', colorHex: '#D8C8B5' },
        },
        {
          instanceId: 'inst-tmpl-table',
          boardItemId: 'tmpl-item-kanso',
          productId: 'table-kanso',
          name: 'Kanso Sculptural Coffee Table',
          x: 155,
          y: 200,
          rotation: 0,
          w: 110,
          d: 60,
          glyphType: 'coffee-table',
          price: 18500,
          configuration: { fabricId: null, finishId: null, sizeId: null },
          activeFabric: null,
          activeFinish: { id: 'fin-kanso', name: 'Travertine & Oak', colorHex: '#D8C8B5' },
        },
      ],
    },
  },
  {
    id: 'template-bedroom-suite',
    title: 'Minimalist Bedroom Suite',
    description: 'Serene architectural retreat highlighting natural raw Belgian linen, tactile timber nightstands, and soft diffused lighting.',
    roomType: 'Bedroom',
    style: 'Modern Architectural',
    coverImage: '/assets/categories/cat-bedroom.svg',
    items: [
      {
        boardItemId: 'tmpl-item-bed',
        productId: 'bed-linen-sanctuary',
        productSlug: 'aura-platform-bed',
        name: 'Aura Upholstered Platform Bed',
        category: 'Beds',
        image: '/assets/categories/cat-bedroom.svg',
        quantity: 1,
        unitPrice: 42500,
        isCustomized: true,
        configuration: {
          fabricId: 'fab-bed-sand',
          finishId: 'fin-bed-oak',
          sizeId: 'size-queen',
        },
        selectedOptions: {
          fabric: { id: 'fab-bed-sand', name: 'Warm Sand Linen', delta: 4500, colorHex: '#D5C9BC' },
          finish: { id: 'fin-bed-oak', name: 'Natural White Oak', delta: 0, colorHex: '#D8C8B5' },
          size: { id: 'size-queen', name: 'Queen (160 × 205 cm)', delta: 0, scaleFactor: 1.0 },
        },
        dimensions: { width: 160, depth: 205, height: 95, formatted: '160 × 205 × 95 cm' },
        addedAt: '2026-11-17T10:00:00.000Z',
      },
      {
        boardItemId: 'tmpl-item-nightstand',
        productId: 'nightstand-aura',
        productSlug: 'aura-solid-oak-nightstand',
        name: 'Aura Floating Solid Oak Nightstand',
        category: 'Storage',
        image: '/assets/categories/cat-bedroom.svg',
        quantity: 2,
        unitPrice: 12000,
        isCustomized: false,
        configuration: { fabricId: null, finishId: null, sizeId: null },
        selectedOptions: { fabric: null, finish: null, size: null },
        dimensions: { width: 45, depth: 38, height: 25, formatted: '45 × 38 × 25 cm' },
        addedAt: '2026-11-17T10:00:00.000Z',
      },
    ],
    roomLayout: {
      roomLength: 5.0,
      roomWidth: 4.0,
      units: 'm',
      furnitureInstances: [
        {
          instanceId: 'inst-tmpl-bed',
          boardItemId: 'tmpl-item-bed',
          productId: 'bed-linen-sanctuary',
          name: 'Aura Upholstered Platform Bed',
          x: 120,
          y: 40,
          rotation: 0,
          w: 160,
          d: 205,
          glyphType: 'bed',
          price: 42500,
          configuration: { fabricId: 'fab-bed-sand', finishId: 'fin-bed-oak', sizeId: 'size-queen' },
          activeFabric: { id: 'fab-bed-sand', name: 'Warm Sand Linen', colorHex: '#D5C9BC' },
          activeFinish: { id: 'fin-bed-oak', name: 'Natural White Oak', colorHex: '#D8C8B5' },
        },
      ],
    },
  },
];

/**
 * Internal helper to read raw array from localStorage
 */
function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('Storage format error: expected array for design boards');
      return [];
    }
    return parsed;
  } catch (err) {
    console.warn('Unable to parse design boards from localStorage:', err);
    return [];
  }
}

/**
 * Internal helper to write raw array to localStorage
 */
function writeStorage(boards) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
  } catch (err) {
    console.error('LocalStorage write failed for design boards:', err);
    throw new Error('Storage write failed. Quota exceeded or private browsing restricted.');
  }
}

/**
 * Asynchronous Design Board Service API
 */
export const designBoardService = {
  /**
   * Retrieves all user design boards
   * @returns {Promise<Array>} Array of DesignBoard objects
   */
  async getBoards() {
    return new Promise((resolve) => {
      // Simulate minor microtask async latency matching real API convention
      setTimeout(() => {
        resolve(readStorage());
      }, 10);
    });
  },

  /**
   * Retrieves a specific board by ID
   * @param {string} boardId 
   * @returns {Promise<Object|null>}
   */
  async getBoardById(boardId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const boards = readStorage();
        const found = boards.find((b) => b.id === boardId);
        resolve(found || null);
      }, 10);
    });
  },

  /**
   * Creates a new design board
   * @param {Object} boardData 
   * @returns {Promise<Object>} The created board
   */
  async createBoard(boardData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const boards = readStorage();
          const timestamp = new Date().toISOString();
          const newBoard = {
            id: boardData.id || `board-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            title: boardData.title?.trim() || 'Untitled Sanctuary',
            description: boardData.description?.trim() || '',
            roomType: boardData.roomType || 'Living Room',
            style: boardData.style || 'Warm Editorial',
            coverImage: boardData.coverImage || null,
            createdAt: timestamp,
            updatedAt: timestamp,
            items: Array.isArray(boardData.items) ? boardData.items : [],
            roomLayout: boardData.roomLayout || null,
          };

          boards.unshift(newBoard);
          writeStorage(boards);
          resolve(newBoard);
        } catch (err) {
          reject(err);
        }
      }, 10);
    });
  },

  /**
   * Updates an existing board's metadata or room layout
   * @param {string} boardId 
   * @param {Object} updates 
   * @returns {Promise<Object>}
   */
  async updateBoard(boardId, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const boards = readStorage();
          const index = boards.findIndex((b) => b.id === boardId);
          if (index === -1) {
            return reject(new Error(`Design Board "${boardId}" not found.`));
          }

          const existing = boards[index];
          const updated = {
            ...existing,
            ...updates,
            updatedAt: new Date().toISOString(),
          };

          boards[index] = updated;
          writeStorage(boards);
          resolve(updated);
        } catch (err) {
          reject(err);
        }
      }, 10);
    });
  },

  /**
   * Deletes a board by ID
   * @param {string} boardId 
   * @returns {Promise<boolean>}
   */
  async deleteBoard(boardId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const boards = readStorage();
          const filtered = boards.filter((b) => b.id !== boardId);
          writeStorage(filtered);
          resolve(true);
        } catch (err) {
          reject(err);
        }
      }, 10);
    });
  },

  /**
   * Appends or updates an item snapshot on a board
   * @param {string} boardId 
   * @param {Object} itemSnapshot 
   * @returns {Promise<Object>} The updated board
   */
  async saveBoardItem(boardId, itemSnapshot) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const boards = readStorage();
          const board = boards.find((b) => b.id === boardId);
          if (!board) {
            return reject(new Error(`Design Board "${boardId}" not found.`));
          }

          // Ensure valid boardItemId
          const snapshot = {
            ...itemSnapshot,
            boardItemId: itemSnapshot.boardItemId || `bitem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            quantity: Math.max(1, itemSnapshot.quantity || 1),
            unitPrice: typeof itemSnapshot.unitPrice === 'number' ? itemSnapshot.unitPrice : 0,
            addedAt: itemSnapshot.addedAt || new Date().toISOString(),
          };

          board.items = board.items || [];
          board.items.push(snapshot);

          // Update cover image if none set
          if (!board.coverImage && snapshot.image) {
            board.coverImage = snapshot.image;
          }

          board.updatedAt = new Date().toISOString();
          writeStorage(boards);
          resolve(board);
        } catch (err) {
          reject(err);
        }
      }, 10);
    });
  },

  /**
   * Updates an item snapshot (e.g. quantity or configuration) on a board
   * @param {string} boardId 
   * @param {string} boardItemId 
   * @param {Object} updates 
   * @returns {Promise<Object>}
   */
  async updateBoardItem(boardId, boardItemId, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const boards = readStorage();
          const board = boards.find((b) => b.id === boardId);
          if (!board) {
            return reject(new Error(`Design Board "${boardId}" not found.`));
          }

          const itemIndex = board.items.findIndex((it) => it.boardItemId === boardItemId);
          if (itemIndex === -1) {
            return reject(new Error(`Item "${boardItemId}" not found on board "${boardId}".`));
          }

          board.items[itemIndex] = {
            ...board.items[itemIndex],
            ...updates,
          };

          board.updatedAt = new Date().toISOString();
          writeStorage(boards);
          resolve(board);
        } catch (err) {
          reject(err);
        }
      }, 10);
    });
  },

  /**
   * Removes an item snapshot from a board
   * @param {string} boardId 
   * @param {string} boardItemId 
   * @returns {Promise<Object>} The updated board
   */
  async removeBoardItem(boardId, boardItemId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const boards = readStorage();
          const board = boards.find((b) => b.id === boardId);
          if (!board) {
            return reject(new Error(`Design Board "${boardId}" not found.`));
          }

          board.items = board.items.filter((it) => it.boardItemId !== boardItemId);
          board.updatedAt = new Date().toISOString();
          writeStorage(boards);
          resolve(board);
        } catch (err) {
          reject(err);
        }
      }, 10);
    });
  },

  /**
   * Saves or updates a complete 2D Room Planner layout on a board
   * @param {string} boardId 
   * @param {Object} roomLayout { roomLength, roomWidth, units, furnitureInstances }
   * @returns {Promise<Object>}
   */
  async saveRoomLayout(boardId, roomLayout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const boards = readStorage();
          const board = boards.find((b) => b.id === boardId);
          if (!board) {
            return reject(new Error(`Design Board "${boardId}" not found.`));
          }

          board.roomLayout = roomLayout;
          board.updatedAt = new Date().toISOString();
          writeStorage(boards);
          resolve(board);
        } catch (err) {
          reject(err);
        }
      }, 10);
    });
  },

  /**
   * Duplicates an existing board into a completely independent new board
   * @param {string} boardId 
   * @returns {Promise<Object>} The created duplicate board
   */
  async duplicateBoard(boardId) {
    const existing = await this.getBoardById(boardId);
    if (!existing) {
      throw new Error(`Board "${boardId}" not found for duplication.`);
    }

    const newBoardData = {
      title: `${existing.title} (Copy)`,
      description: existing.description,
      roomType: existing.roomType,
      style: existing.style,
      coverImage: existing.coverImage,
      items: existing.items.map((it) => ({
        ...it,
        boardItemId: `bitem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        addedAt: new Date().toISOString(),
      })),
      roomLayout: existing.roomLayout ? JSON.parse(JSON.stringify(existing.roomLayout)) : null,
    };

    return this.createBoard(newBoardData);
  },

  /**
   * Duplicates an optional sample template into the user's personal boards
   * @param {string} templateId 
   * @returns {Promise<Object>} The created personal board
   */
  async duplicateTemplate(templateId) {
    const template = SAMPLE_BOARD_TEMPLATES.find((t) => t.id === templateId);
    if (!template) {
      throw new Error(`Template "${templateId}" not found.`);
    }

    const newBoardData = {
      title: `${template.title} (Personal)`,
      description: template.description,
      roomType: template.roomType,
      style: template.style,
      coverImage: template.coverImage,
      items: template.items.map((it) => ({
        ...it,
        boardItemId: `bitem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        addedAt: new Date().toISOString(),
      })),
      roomLayout: template.roomLayout ? JSON.parse(JSON.stringify(template.roomLayout)) : null,
    };

    return this.createBoard(newBoardData);
  },

  /**
   * Returns the available static inspiration templates
   */
  getSampleTemplates() {
    return SAMPLE_BOARD_TEMPLATES;
  },
};
