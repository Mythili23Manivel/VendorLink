import express from 'express';
import * as invoiceController from '../controllers/invoiceController.js';
import { invoiceValidator, mongoIdValidator } from '../utils/validators.js';
import { validate } from '../middlewares/validator.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(invoiceController.getInvoices)
  .post(authorize('Admin', 'ProcurementOfficer'), invoiceValidator, validate, invoiceController.createInvoice);

router.route('/:id')
  .get(mongoIdValidator, validate, invoiceController.getInvoiceById);

export default router;
