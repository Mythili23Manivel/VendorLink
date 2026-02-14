import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Invoice from '../models/Invoice.js';
import Payment from '../models/Payment.js';
import connectDB from '../config/db.js';

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Vendor.deleteMany({});
    await PurchaseOrder.deleteMany({});
    await Invoice.deleteMany({});
    await Payment.deleteMany({});

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@vendorlink.com',
      password: 'admin123',
      role: 'Admin',
    });

    const officer = await User.create({
      name: 'Procurement Officer',
      email: 'officer@vendorlink.com',
      password: 'officer123',
      role: 'ProcurementOfficer',
    });

    const vendors = await Vendor.insertMany([
      { name: 'TechSupplies Inc', email: 'orders@techsupplies.com', contact: '+1-555-0101', totalOrders: 15, onTimeDeliveries: 14, rating: 4.5, mismatchRate: 3.2, delayRate: 6.7 },
      { name: 'Office Depot Pro', email: 'b2b@officedepot.com', contact: '+1-555-0102', totalOrders: 8, onTimeDeliveries: 7, rating: 4.2, mismatchRate: 12.5, delayRate: 25 },
      { name: 'Global Parts Co', email: 'sales@globalparts.com', contact: '+1-555-0103', totalOrders: 22, onTimeDeliveries: 20, rating: 4.8, mismatchRate: 2.1, delayRate: 4.5 },
      { name: 'Metro Logistics', email: 'info@metrologistics.com', contact: '+1-555-0104', totalOrders: 5, onTimeDeliveries: 3, rating: 3.5, mismatchRate: 18, delayRate: 40 },
      { name: 'Premium Materials Ltd', email: 'contact@premiummaterials.com', contact: '+1-555-0105', totalOrders: 12, onTimeDeliveries: 11, rating: 4.6, mismatchRate: 5, delayRate: 8.3 },
    ]);

    const purchaseOrders = await PurchaseOrder.insertMany([
      { vendorId: vendors[0]._id, items: [{ description: 'Laptops', quantity: 10, unitPrice: 899 }, { description: 'Monitors', quantity: 10, unitPrice: 249 }], totalAmount: 11480, status: 'Approved' },
      { vendorId: vendors[0]._id, items: [{ description: 'Keyboards', quantity: 50, unitPrice: 49 }], totalAmount: 2450, status: 'Pending' },
      { vendorId: vendors[1]._id, items: [{ description: 'Office Chairs', quantity: 20, unitPrice: 199 }], totalAmount: 3980, status: 'Completed' },
      { vendorId: vendors[2]._id, items: [{ description: 'Steel Bolts', quantity: 1000, unitPrice: 0.5 }, { description: 'Washers', quantity: 2000, unitPrice: 0.2 }], totalAmount: 900, status: 'Approved' },
      { vendorId: vendors[3]._id, items: [{ description: 'Shipping Pallets', quantity: 100, unitPrice: 25 }], totalAmount: 2500, status: 'Pending' },
    ]);

    const dueDate1 = new Date();
    dueDate1.setDate(dueDate1.getDate() + 5);
    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - 10);

    const invoices = await Invoice.insertMany([
      { vendorId: vendors[0]._id, purchaseOrderId: purchaseOrders[0]._id, invoiceAmount: 11480, matched: true, mismatchPercentage: 0 },
      { vendorId: vendors[1]._id, purchaseOrderId: purchaseOrders[2]._id, invoiceAmount: 4180, matched: false, mismatchPercentage: 5.03 },
      { vendorId: vendors[2]._id, purchaseOrderId: purchaseOrders[3]._id, invoiceAmount: 900, matched: true, mismatchPercentage: 0 },
    ]);

    await Payment.insertMany([
      { vendorId: vendors[0]._id, invoiceId: invoices[0]._id, amount: 11480, status: 'Paid', dueDate: overdueDate, paidDate: new Date() },
      { vendorId: vendors[1]._id, invoiceId: invoices[1]._id, amount: 4180, status: 'Overdue', dueDate: overdueDate },
      { vendorId: vendors[2]._id, invoiceId: invoices[2]._id, amount: 900, status: 'Pending', dueDate: dueDate1 },
    ]);

    console.log('Seed data created successfully!');
    console.log('Admin: admin@vendorlink.com / admin123');
    console.log('Officer: officer@vendorlink.com / officer123');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();
