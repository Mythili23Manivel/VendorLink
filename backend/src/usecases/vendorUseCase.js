import VendorRepository from '../repositories/VendorRepository.js';

export const createVendorUseCase = async (vendorData) => {
  return await VendorRepository.create(vendorData);
};

export const getVendorsUseCase = async (filters, options) => {
  return await VendorRepository.findAll(filters, options);
};

export const getVendorByIdUseCase = async (id) => {
  const vendor = await VendorRepository.findById(id);
  if (!vendor) throw new Error('Vendor not found');
  return vendor;
};

export const updateVendorUseCase = async (id, updateData) => {
  const vendor = await VendorRepository.findById(id);
  if (!vendor) throw new Error('Vendor not found');
  return await VendorRepository.update(id, updateData);
};

export const deleteVendorUseCase = async (id) => {
  const vendor = await VendorRepository.findById(id);
  if (!vendor) throw new Error('Vendor not found');
  return await VendorRepository.delete(id);
};
