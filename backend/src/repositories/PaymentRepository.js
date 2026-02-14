import Payment from '../models/Payment.js';

class PaymentRepository {
  async create(paymentData) {
    return await Payment.create(paymentData);
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10, sort = '-createdAt' } = options;
    const query = { ...filters };

    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      Payment.find(query).sort(sort).skip(skip).limit(limit).populate('vendorId invoiceId').lean(),
      Payment.countDocuments(query),
    ]);

    return { payments, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return await Payment.findById(id).populate('vendorId invoiceId');
  }

  async update(id, updateData) {
    return await Payment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }
}

export default new PaymentRepository();
