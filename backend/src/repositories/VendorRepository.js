import Vendor from '../models/Vendor.js';

class VendorRepository {
  async create(vendorData) {
    return await Vendor.create(vendorData);
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10, sort = '-createdAt', search = '' } = options;
    const query = { ...filters };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [vendors, total] = await Promise.all([
      Vendor.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Vendor.countDocuments(query),
    ]);

    return { vendors, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return await Vendor.findById(id);
  }

  async update(id, updateData) {
    return await Vendor.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Vendor.findByIdAndDelete(id);
  }
}

export default new VendorRepository();
