import PurchaseOrder from '../models/PurchaseOrder.js';

class PurchaseOrderRepository {
  async create(poData) {
    return await PurchaseOrder.create(poData);
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10, sort = '-createdAt' } = options;
    const query = { ...filters };

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      PurchaseOrder.find(query).sort(sort).skip(skip).limit(limit).populate('vendorId', 'name email').lean(),
      PurchaseOrder.countDocuments(query),
    ]);

    return { orders, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return await PurchaseOrder.findById(id).populate('vendorId');
  }

  async update(id, updateData) {
    return await PurchaseOrder.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async countByVendor(vendorId) {
    return await PurchaseOrder.countDocuments({ vendorId });
  }

  async countApprovedOrCompletedByVendor(vendorId) {
    return await PurchaseOrder.countDocuments({
      vendorId,
      status: { $in: ['Approved', 'Completed'] },
    });
  }
}

export default new PurchaseOrderRepository();
