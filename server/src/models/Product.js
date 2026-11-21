import mongoose from 'mongoose';

// Subdocument Schema: Customization Option Item (Fabric, Finish, Size)
const optionItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    delta: { type: Number, required: true, default: 0 },
    colorHex: { type: String, trim: true },
    texture: { type: String, trim: true },
    scaleFactor: { type: Number, default: 1.0 },
  },
  { _id: false }
);

// Subdocument Schema: Product Dimensions
const dimensionsSchema = new mongoose.Schema(
  {
    width: { type: Number, required: true, min: 1 },
    depth: { type: Number, required: true, min: 1 },
    height: { type: Number, required: true, min: 1 },
    formatted: { type: String, required: true, trim: true },
  },
  { _id: false }
);

// Subdocument Schema: Technical Specifications
const specificationsSchema = new mongoose.Schema(
  {
    frameMaterial: { type: String, trim: true },
    joinery: { type: String, trim: true },
    cushionFill: { type: String, trim: true },
    origin: { type: String, trim: true },
    warranty: { type: String, trim: true },
    assemblyRequired: { type: Boolean, default: false },
    careInstructions: { type: String, trim: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['Seating', 'Tables', 'Beds', 'Storage', 'Lighting', 'Decor'],
      index: true,
    },
    roomType: {
      type: String,
      required: [true, 'Room type is required'],
      enum: ['living', 'dining', 'bedroom', 'office', 'architectural'],
      index: true,
    },
    style: {
      type: String,
      required: [true, 'Style is required'],
      enum: [
        'Japandi',
        'Minimalist',
        'Scandinavian',
        'Mid-Century',
        'Warm Editorial',
        'Nordic Minimalist',
        'Modern Architectural',
        'Organic Modern',
      ],
      index: true,
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price in INR is required'],
      min: [0, 'Base price cannot be negative'],
      index: true,
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },
    stockCount: {
      type: Number,
      default: 10,
      min: [0, 'Stock count cannot be negative'],
    },
    dimensions: {
      type: dimensionsSchema,
      required: [true, 'Product dimensions are required'],
    },
    weightKg: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
    },
    materials: [{ type: String, trim: true }],
    primaryMaterial: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    editorialNote: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Primary image asset path is required'],
      trim: true,
    },
    gallery: [{ type: String, trim: true }],
    fallback: {
      type: String,
      default: '/assets/placeholders/placeholder-product.svg',
    },
    tag: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    customizable: {
      type: Boolean,
      default: false,
      index: true,
    },
    customizationOptions: {
      fabrics: [optionItemSchema],
      finishes: [optionItemSchema],
      sizes: [optionItemSchema],
    },
    specifications: {
      type: specificationsSchema,
    },
    relatedProductIds: [{ type: String, trim: true }],
    prompt: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret.productId;
        ret._id = ret._id ? ret._id.toString() : undefined;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret.productId;
        ret._id = ret._id ? ret._id.toString() : undefined;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for high-throughput filtering and sorting
productSchema.index({ category: 1, roomType: 1, style: 1, basePrice: 1, inStock: 1 });
productSchema.index({ featured: 1, customizable: 1 });
// Compound text search index for search query parameter
productSchema.index({ name: 'text', description: 'text', primaryMaterial: 'text' });

/**
 * Standardized serializer for Product documents and lean queries.
 * Guarantees stable `id` and consistent object properties for all responses.
 */
export function serializeProduct(doc) {
  if (!doc) return null;
  const raw = doc.toObject ? doc.toObject() : { ...doc };

  return {
    id: raw.productId || raw.id,
    productId: raw.productId || raw.id,
    slug: raw.slug,
    name: raw.name,
    title: raw.title || raw.name,
    category: raw.category,
    roomType: raw.roomType,
    style: raw.style,
    basePrice: raw.basePrice,
    inStock: raw.inStock,
    stockCount: raw.stockCount,
    dimensions: raw.dimensions,
    weightKg: raw.weightKg,
    materials: raw.materials || [],
    primaryMaterial: raw.primaryMaterial,
    description: raw.description,
    editorialNote: raw.editorialNote,
    image: raw.image,
    gallery: raw.gallery || [],
    fallback: raw.fallback || '/assets/placeholders/placeholder-product.svg',
    tag: raw.tag,
    featured: raw.featured,
    customizable: raw.customizable,
    customizationOptions: raw.customizationOptions,
    specifications: raw.specifications,
    relatedProductIds: raw.relatedProductIds || [],
    prompt: raw.prompt,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    _id: raw._id ? raw._id.toString() : undefined,
  };
}

/**
 * Serializes an array of Product documents.
 */
export function serializeProductList(docs) {
  if (!Array.isArray(docs)) return [];
  return docs.map(serializeProduct);
}

const Product = mongoose.model('Product', productSchema);
export default Product;
