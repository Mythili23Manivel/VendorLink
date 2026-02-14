import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
});

const purchaseOrderSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Vendor is required'],
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Completed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

purchaseOrderSchema.index({ vendorId: 1 });
purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ createdAt: -1 });

export default mongoose.model('PurchaseOrder', purchaseOrderSchema);
