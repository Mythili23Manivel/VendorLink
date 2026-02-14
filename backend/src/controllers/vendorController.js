import * as vendorUseCase from '../usecases/vendorUseCase.js';

export const createVendor = async (req, res, next) => {
  try {
    const vendor = await vendorUseCase.createVendorUseCase(req.body);
    res.status(201).json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
};

export const getVendors = async (req, res, next) => {
  try {
    const { page, limit, sort, search } = req.query;
    const result = await vendorUseCase.getVendorsUseCase({}, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: sort || '-createdAt',
      search: search || '',
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getVendorById = async (req, res, next) => {
  try {
    const vendor = await vendorUseCase.getVendorByIdUseCase(req.params.id);
    res.json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
};

export const updateVendor = async (req, res, next) => {
  try {
    const vendor = await vendorUseCase.updateVendorUseCase(req.params.id, req.body);
    res.json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
};

export const deleteVendor = async (req, res, next) => {
  try {
    await vendorUseCase.deleteVendorUseCase(req.params.id);
    res.json({ success: true, message: 'Vendor deleted successfully' });
  } catch (error) {
    next(error);
  }
};
