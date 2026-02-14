import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Vendor is required'],
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: [true, 'Invoice is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Overdue'],
      default: 'Pending',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    paidDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ vendorId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ dueDate: 1 });

export default mongoose.model('Payment', paymentSchema);
