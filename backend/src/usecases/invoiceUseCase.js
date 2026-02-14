import InvoiceRepository from '../repositories/InvoiceRepository.js';
import VendorRepository from '../repositories/VendorRepository.js';
import PurchaseOrder from '../models/PurchaseOrder.js';

const MISMATCH_THRESHOLD = 5;

const recalculateVendorMismatchRate = async (vendorId) => {
  const matched = await InvoiceRepository.countMatchedByVendor(vendorId);
  const mismatched = await InvoiceRepository.countMismatchedByVendor(vendorId);
  const total = matched + mismatched;
  const mismatchRate = total > 0 ? (mismatched / total) * 100 : 0;
  await VendorRepository.update(vendorId, { mismatchRate: Math.round(mismatchRate * 100) / 100 });
};

export const createInvoiceUseCase = async (invoiceData) => {
  const po = await PurchaseOrder.findById(invoiceData.purchaseOrderId);
  if (!po) throw new Error('Purchase order not found');

  const expectedAmount = po.totalAmount;
  const actualAmount = invoiceData.invoiceAmount;
  const diff = Math.abs(expectedAmount - actualAmount);
  const mismatchPercentage = expectedAmount > 0 ? (diff / expectedAmount) * 100 : 0;
  const matched = mismatchPercentage <= MISMATCH_THRESHOLD;

  const invoice = await InvoiceRepository.create({
    ...invoiceData,
    matched,
    mismatchPercentage: Math.round(mismatchPercentage * 100) / 100,
  });

  await recalculateVendorMismatchRate(invoiceData.vendorId);
  return await InvoiceRepository.findById(invoice._id);
};

export const getInvoicesUseCase = async (filters, options) => {
  return await InvoiceRepository.findAll(filters, options);
};

export const getInvoiceByIdUseCase = async (id) => {
  const invoice = await InvoiceRepository.findById(id);
  if (!invoice) throw new Error('Invoice not found');
  return invoice;
};
