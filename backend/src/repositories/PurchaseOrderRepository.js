import mongoose from 'mongoose';
import PurchaseOrder from '../models/PurchaseOrder.js';

class PurchaseOrderRepository {
  async create(poData) {
    return PurchaseOrder.create(poData);
  }

  async findAll(filters = {}, options = {}) {
    const page = Math.max(parseInt(options.page) || 1, 1);
    const limit = Math.max(parseInt(options.limit) || 10, 1);
    const sort = options.sort || '-createdAt';

    const query = { ...filters };
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      PurchaseOrder.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('vendorId', 'name email')
        .lean(),
      PurchaseOrder.countDocuments(query),
    ]);

    return {
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    return PurchaseOrder.findById(id)
      .populate('vendorId', 'name email')
      .lean();
  }

  async update(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    return PurchaseOrder.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async countByVendor(vendorId) {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) return 0;

    return PurchaseOrder.countDocuments({ vendorId });
  }

  async countApprovedOrCompletedByVendor(vendorId) {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) return 0;

    return PurchaseOrder.countDocuments({
      vendorId,
      status: { $in: ['Approved', 'Completed'] },
    });
  }
}

export default new PurchaseOrderRepository();
