import * as invoiceUseCase from '../usecases/invoiceUseCase.js';

export const createInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceUseCase.createInvoiceUseCase(req.body);
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const getInvoices = async (req, res, next) => {
  try {
    const { page, limit, sort, matched, vendorId } = req.query;
    const filters = {};
    if (matched !== undefined) filters.matched = matched === 'true';
    if (vendorId) filters.vendorId = vendorId;

    const result = await invoiceUseCase.getInvoicesUseCase(filters, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: sort || '-createdAt',
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceUseCase.getInvoiceByIdUseCase(req.params.id);
    res.json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};
