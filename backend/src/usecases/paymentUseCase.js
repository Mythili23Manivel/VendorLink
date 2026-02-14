import PaymentRepository from '../repositories/PaymentRepository.js';
import VendorRepository from '../repositories/VendorRepository.js';
import Payment from '../models/Payment.js';

const OVERDUE_DAYS = 7;

const updateOverduePayments = async () => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - OVERDUE_DAYS);

  await Payment.updateMany(
    { status: 'Pending', dueDate: { $lt: cutoff } },
    { status: 'Overdue' }
  );
};

const recalculateVendorDelayRate = async (vendorId) => {
  const payments = await Payment.find({ vendorId });
  const total = payments.length;
  if (total === 0) return;
  const overdue = payments.filter((p) => p.status === 'Overdue').length;
  const delayRate = (overdue / total) * 100;
  await VendorRepository.update(vendorId, { delayRate: Math.round(delayRate * 100) / 100 });
};

export const createPaymentUseCase = async (paymentData) => {
  const payment = await PaymentRepository.create(paymentData);
  await updateOverduePayments();
  return await PaymentRepository.findById(payment._id);
};

export const getPaymentsUseCase = async (filters, options) => {
  await updateOverduePayments();
  return await PaymentRepository.findAll(filters, options);
};

export const getPaymentByIdUseCase = async (id) => {
  const payment = await PaymentRepository.findById(id);
  if (!payment) throw new Error('Payment not found');
  return payment;
};

export const markPaymentPaidUseCase = async (id) => {
  const payment = await PaymentRepository.findById(id);
  if (!payment) throw new Error('Payment not found');
  if (payment.status === 'Paid') throw new Error('Payment already marked as paid');

  await PaymentRepository.update(id, {
    status: 'Paid',
    paidDate: new Date(),
  });

  await recalculateVendorDelayRate(payment.vendorId);
  return await PaymentRepository.findById(id);
};
