import PurchaseOrderRepository from '../repositories/PurchaseOrderRepository.js';
import VendorRepository from '../repositories/VendorRepository.js';

export const createPurchaseOrderUseCase = async (poData) => {
  const po = await PurchaseOrderRepository.create(poData);
  return po;
};

export const getPurchaseOrdersUseCase = async (filters, options) => {
  return await PurchaseOrderRepository.findAll(filters, options);
};

export const getPurchaseOrderByIdUseCase = async (id) => {
  const po = await PurchaseOrderRepository.findById(id);
  if (!po) throw new Error('Purchase order not found');
  return po;
};

export const approvePurchaseOrderUseCase = async (id) => {
  const po = await PurchaseOrderRepository.findById(id);
  if (!po) throw new Error('Purchase order not found');
  if (po.status !== 'Pending') throw new Error('Only pending orders can be approved');

  await PurchaseOrderRepository.update(id, { status: 'Approved' });

  const count = await PurchaseOrderRepository.countApprovedOrCompletedByVendor(po.vendorId);
  await VendorRepository.update(po.vendorId, { totalOrders: count });

  return await PurchaseOrderRepository.findById(id);
};

export const completePurchaseOrderUseCase = async (id) => {
  const po = await PurchaseOrderRepository.findById(id);
  if (!po) throw new Error('Purchase order not found');

  await PurchaseOrderRepository.update(id, { status: 'Completed' });

  const vendor = await VendorRepository.findById(po.vendorId);
  const onTime = (vendor.onTimeDeliveries || 0) + 1;
  const total = (vendor.totalOrders || 0) + 1;
  await VendorRepository.update(po.vendorId, {
    onTimeDeliveries: onTime,
    totalOrders: total,
  });

  return await PurchaseOrderRepository.findById(id);
};
