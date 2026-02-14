import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Vendor is required'],
    },
    purchaseOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PurchaseOrder',
      required: [true, 'Purchase order is required'],
    },
    invoiceAmount: {
      type: Number,
      required: [true, 'Invoice amount is required'],
      min: 0,
    },
    matched: {
      type: Boolean,
      default: false,
    },
    mismatchPercentage: {
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

invoiceSchema.index({ vendorId: 1 });
invoiceSchema.index({ purchaseOrderId: 1 });
invoiceSchema.index({ matched: 1 });

export default mongoose.model('Invoice', invoiceSchema);
