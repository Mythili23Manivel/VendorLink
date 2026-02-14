import express from 'express';
import authRoutes from './authRoutes.js';
import vendorRoutes from './vendorRoutes.js';
import purchaseOrderRoutes from './purchaseOrderRoutes.js';
import invoiceRoutes from './invoiceRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import aiAssistantRoutes from './aiAssistantRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/vendors', vendorRoutes);
router.use('/purchase-orders', purchaseOrderRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/payments', paymentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/ai-assistant', aiAssistantRoutes);

export default router;
