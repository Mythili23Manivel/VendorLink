import * as paymentUseCase from '../usecases/paymentUseCase.js';

export const createPayment = async (req, res, next) => {
  try {
    const payment = await paymentUseCase.createPaymentUseCase(req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

export const getPayments = async (req, res, next) => {
  try {
    const { page, limit, sort, status, vendorId } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (vendorId) filters.vendorId = vendorId;

    const result = await paymentUseCase.getPaymentsUseCase(filters, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: sort || '-createdAt',
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await paymentUseCase.getPaymentByIdUseCase(req.params.id);
    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

export const markPaymentPaid = async (req, res, next) => {
  try {
    const payment = await paymentUseCase.markPaymentPaidUseCase(req.params.id);
    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};
