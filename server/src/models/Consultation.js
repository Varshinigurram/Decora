import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Nullable: allows unauthenticated guest submissions
      index: true,
    },
    referenceCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    roomType: {
      type: String,
      enum: ['Living Room', 'Bedroom', 'Dining Room', 'Home Office', 'Entire Home', 'Other'],
      default: 'Living Room',
    },
    preferredStyle: {
      type: String,
      enum: ['Japandi', 'Warm Editorial', 'Nordic Minimalist', 'Modern Architectural', 'Organic Modern', 'Undecided'],
      default: 'Warm Editorial',
    },
    budgetRange: {
      type: String,
      trim: true,
      default: '₹50,000 - ₹1,50,000',
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1500, 'Message cannot exceed 1500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Completed'],
      default: 'New',
      index: true,
    },
    adminNotes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export function serializeConsultation(doc) {
  if (!doc) return null;
  const raw = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: raw._id ? raw._id.toString() : raw.id,
    _id: raw._id ? raw._id.toString() : raw.id,
    referenceCode: raw.referenceCode,
    fullName: raw.fullName,
    email: raw.email,
    phone: raw.phone,
    roomType: raw.roomType,
    preferredStyle: raw.preferredStyle,
    budgetRange: raw.budgetRange,
    message: raw.message,
    status: raw.status,
    adminNotes: raw.adminNotes,
    userId: raw.userId ? raw.userId.toString() : null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

const Consultation = mongoose.model('Consultation', consultationSchema);

export default Consultation;
