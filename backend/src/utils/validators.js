import { body, param } from 'express-validator';

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['Admin', 'ProcurementOfficer']).withMessage('Invalid role'),
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const vendorValidator = [
  body('name').trim().notEmpty().withMessage('Vendor name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('contact').optional().trim(),
];

export const purchaseOrderValidator = [
  body('vendorId').isMongoId().withMessage('Valid vendor ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.description').notEmpty().withMessage('Item description is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be positive'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be positive'),
];

export const invoiceValidator = [
  body('vendorId').isMongoId().withMessage('Valid vendor ID is required'),
  body('purchaseOrderId').isMongoId().withMessage('Valid purchase order ID is required'),
  body('invoiceAmount').isFloat({ min: 0 }).withMessage('Invoice amount must be positive'),
];

export const paymentValidator = [
  body('vendorId').isMongoId().withMessage('Valid vendor ID is required'),
  body('invoiceId').isMongoId().withMessage('Valid invoice ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
];

export const mongoIdValidator = [param('id').isMongoId().withMessage('Invalid ID')];
