import express from 'express';
import * as poController from '../controllers/purchaseOrderController.js';
import { purchaseOrderValidator, mongoIdValidator } from '../utils/validators.js';
import { validate } from '../middlewares/validator.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(poController.getPurchaseOrders)
  .post(authorize('Admin', 'ProcurementOfficer'), purchaseOrderValidator, validate, poController.createPurchaseOrder);

router.route('/:id')
  .get(mongoIdValidator, validate, poController.getPurchaseOrderById);

router.put('/:id/approve', authorize('Admin', 'ProcurementOfficer'), mongoIdValidator, validate, poController.approvePurchaseOrder);

export default router;
