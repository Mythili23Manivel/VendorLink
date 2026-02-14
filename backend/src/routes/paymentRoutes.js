import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { paymentValidator, mongoIdValidator } from '../utils/validators.js';
import { validate } from '../middlewares/validator.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(paymentController.getPayments)
  .post(authorize('Admin', 'ProcurementOfficer'), paymentValidator, validate, paymentController.createPayment);

router.route('/:id')
  .get(mongoIdValidator, validate, paymentController.getPaymentById);

router.put('/:id/paid', authorize('Admin', 'ProcurementOfficer'), mongoIdValidator, validate, paymentController.markPaymentPaid);

export default router;
