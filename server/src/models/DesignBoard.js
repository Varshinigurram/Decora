import mongoose from 'mongoose';

// Subdocument: Furniture Snapshot Item Saved on Board
const boardItemSnapshotSchema = new mongoose.Schema(
  {
    boardItemId: {
      type: String,
      required: true,
      default: () => `bitem-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    },
    productId: { type: String, required: true },
    productSlug: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, 'Unit price cannot be negative'],
    },
    isCustomized: {
      type: Boolean,
      default: false,
    },
    configuration: {
      fabricId: { type: String, default: null },
      finishId: { type: String, default: null },
      sizeId: { type: String, default: null },
    },
    selectedOptions: {
      fabric: {
        id: String,
        name: String,
        delta: Number,
        colorHex: String,
        texture: String,
      },
      finish: {
        id: String,
        name: String,
        delta: Number,
        colorHex: String,
      },
      size: {
        id: String,
        name: String,
        delta: Number,
        scaleFactor: Number,
      },
    },
    dimensions: {
      width: Number,
      depth: Number,
      height: Number,
      formatted: String,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Subdocument: 2D Furniture Instance Placed on Room Canvas
const furnitureInstanceSchema = new mongoose.Schema(
  {
    instanceId: { type: String, required: true },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String },
    price: { type: Number, required: true, min: 0 },
    x: { type: Number, required: true }, // cm relative to canvas top-left
    y: { type: Number, required: true }, // cm
    rotation: { type: Number, required: true, default: 0 }, // 0, 45, 90, 180, 270, etc.
    w: { type: Number, required: true, min: 1 }, // cm
    d: { type: Number, required: true, min: 1 }, // cm
    glyphType: { type: String, required: true }, // 'sofa', 'coffee-table', etc.
    configuration: {
      fabricId: { type: String, default: null },
      finishId: { type: String, default: null },
      sizeId: { type: String, default: null },
    },
    activeFabric: {
      id: String,
      name: String,
      delta: Number,
      colorHex: String,
    },
    activeFinish: {
      id: String,
      name: String,
      delta: Number,
      colorHex: String,
    },
    activeSize: {
      id: String,
      name: String,
      delta: Number,
      scaleFactor: Number,
    },
  },
  { _id: false }
);

// Subdocument: Room Layout Staged on Board
const roomLayoutSchema = new mongoose.Schema(
  {
    roomLength: { type: Number, required: true, min: 1.0, max: 20.0 }, // meters
    roomWidth: { type: Number, required: true, min: 1.0, max: 20.0 },  // meters
    units: { type: String, default: 'm', enum: ['m'] },
    savedAt: { type: Date, default: Date.now },
    furnitureInstances: [furnitureInstanceSchema],
  },
  { _id: false }
);

// Main DesignBoard Schema
const designBoardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Board title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    roomType: {
      type: String,
      required: true,
      enum: [
        'Living Room',
        'Bedroom',
        'Dining Room',
        'Home Office',
        'Architectural Studio',
        'Sanctuary',
      ],
      default: 'Living Room',
    },
    style: {
      type: String,
      required: true,
      enum: [
        'Japandi',
        'Warm Editorial',
        'Nordic Minimalist',
        'Modern Architectural',
        'Organic Modern',
      ],
      default: 'Warm Editorial',
    },
    coverImage: {
      type: String,
      default: '/assets/categories/cat-living.svg',
    },
    items: [boardItemSnapshotSchema],
    roomLayout: {
      type: roomLayoutSchema,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
designBoardSchema.index({ userId: 1, createdAt: -1 });
designBoardSchema.index({ 'items.boardItemId': 1 });

// Virtuals
designBoardSchema.virtual('totalEstimatedBudget').get(function () {
  if (!Array.isArray(this.items)) return 0;
  return this.items.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1), 0);
});

designBoardSchema.virtual('totalPieces').get(function () {
  if (!Array.isArray(this.items)) return 0;
  return this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
});

/**
 * Standard serializer for DesignBoard document.
 * Guarantees clean client-friendly structure with string id.
 */
export function serializeBoard(board) {
  if (!board) return null;
  const raw = board.toObject ? board.toObject({ virtuals: true }) : { ...board };

  const id = raw._id ? raw._id.toString() : raw.id;
  const items = Array.isArray(raw.items) ? raw.items : [];
  const totalBudget = items.reduce((sum, it) => sum + (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1), 0);
  const totalPieces = items.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0);

  return {
    id,
    _id: id,
    userId: raw.userId ? raw.userId.toString() : undefined,
    title: raw.title,
    description: raw.description || '',
    roomType: raw.roomType,
    style: raw.style,
    coverImage: raw.coverImage,
    items,
    roomLayout: raw.roomLayout || null,
    itemCount: totalPieces,
    totalPieces,
    estimatedBudget: totalBudget,
    totalEstimatedBudget: totalBudget,
    hasRoomLayout: Boolean(raw.roomLayout && Array.isArray(raw.roomLayout.furnitureInstances)),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export function serializeBoardList(boards) {
  if (!Array.isArray(boards)) return [];
  return boards.map(serializeBoard);
}

const DesignBoard = mongoose.model('DesignBoard', designBoardSchema);

export default DesignBoard;
