// Domain entities - pure data structures
// These represent the core business objects

export const VendorEntity = (data) => ({
  id: data._id,
  name: data.name,
  email: data.email,
  contact: data.contact,
  totalOrders: data.totalOrders || 0,
  onTimeDeliveries: data.onTimeDeliveries || 0,
  rating: data.rating || 0,
  mismatchRate: data.mismatchRate || 0,
  delayRate: data.delayRate || 0,
});

export const PurchaseOrderEntity = (data) => ({
  id: data._id,
  vendorId: data.vendorId,
  items: data.items || [],
  totalAmount: data.totalAmount,
  status: data.status || 'Pending',
  createdAt: data.createdAt,
});

export const InvoiceEntity = (data) => ({
  id: data._id,
  vendorId: data.vendorId,
  purchaseOrderId: data.purchaseOrderId,
  invoiceAmount: data.invoiceAmount,
  matched: data.matched || false,
  mismatchPercentage: data.mismatchPercentage || 0,
  createdAt: data.createdAt,
});

export const PaymentEntity = (data) => ({
  id: data._id,
  vendorId: data.vendorId,
  invoiceId: data.invoiceId,
  amount: data.amount,
  status: data.status || 'Pending',
  dueDate: data.dueDate,
  paidDate: data.paidDate,
  createdAt: data.createdAt,
});
