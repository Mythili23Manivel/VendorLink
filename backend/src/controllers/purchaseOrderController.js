import * as purchaseOrderUseCase from '../usecases/purchaseOrderUseCase.js';

export const createPurchaseOrder = async (req, res, next) => {
  try {
    const po = await purchaseOrderUseCase.createPurchaseOrderUseCase(req.body);
    res.status(201).json({ success: true, data: po });
  } catch (error) {
    next(error);
  }
};

export const getPurchaseOrders = async (req, res, next) => {
  try {
    const { page, limit, sort, status, vendorId } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (vendorId) filters.vendorId = vendorId;

    const result = await purchaseOrderUseCase.getPurchaseOrdersUseCase(filters, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: sort || '-createdAt',
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getPurchaseOrderById = async (req, res, next) => {
  try {
    const po = await purchaseOrderUseCase.getPurchaseOrderByIdUseCase(req.params.id);
    res.json({ success: true, data: po });
  } catch (error) {
    next(error);
  }
};

export const approvePurchaseOrder = async (req, res, next) => {
  try {
    const po = await purchaseOrderUseCase.approvePurchaseOrderUseCase(req.params.id);
    res.json({ success: true, data: po });
  } catch (error) {
    next(error);
  }
};
