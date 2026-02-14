import express from 'express';
import * as vendorController from '../controllers/vendorController.js';
import { vendorValidator, mongoIdValidator } from '../utils/validators.js';
import { validate } from '../middlewares/validator.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(vendorController.getVendors)
  .post(authorize('Admin', 'ProcurementOfficer'), vendorValidator, validate, vendorController.createVendor);

router.route('/:id')
  .get(mongoIdValidator, validate, vendorController.getVendorById)
  .put(authorize('Admin', 'ProcurementOfficer'), mongoIdValidator, validate, vendorController.updateVendor)
  .delete(authorize('Admin'), mongoIdValidator, validate, vendorController.deleteVendor);

export default router;
