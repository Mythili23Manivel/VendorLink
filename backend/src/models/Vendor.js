import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vendor name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Vendor email is required'],
      trim: true,
      lowercase: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    onTimeDeliveries: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    mismatchRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    delayRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

vendorSchema.index({ name: 'text', email: 'text' });
vendorSchema.index({ rating: -1 });
vendorSchema.index({ mismatchRate: -1 });
vendorSchema.index({ delayRate: -1 });

export default mongoose.model('Vendor', vendorSchema);
