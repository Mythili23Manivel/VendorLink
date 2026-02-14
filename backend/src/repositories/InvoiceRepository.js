import Invoice from '../models/Invoice.js';

class InvoiceRepository {
  async create(invoiceData) {
    return await Invoice.create(invoiceData);
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10, sort = '-createdAt' } = options;
    const query = { ...filters };

    const skip = (page - 1) * limit;
    const [invoices, total] = await Promise.all([
      Invoice.find(query).sort(sort).skip(skip).limit(limit).populate('vendorId purchaseOrderId').lean(),
      Invoice.countDocuments(query),
    ]);

    return { invoices, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return await Invoice.findById(id).populate('vendorId purchaseOrderId');
  }

  async countMatchedByVendor(vendorId) {
    return await Invoice.countDocuments({ vendorId, matched: true });
  }

  async countMismatchedByVendor(vendorId) {
    return await Invoice.countDocuments({ vendorId, matched: false });
  }
}

export default new InvoiceRepository();
