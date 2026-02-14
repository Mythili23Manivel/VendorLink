import { useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { usePurchaseOrdersViewModel } from '../hooks/usePurchaseOrdersViewModel';
import { PO_STATUS } from '../utils/constants';

export default function PurchaseOrders() {
  const vm = usePurchaseOrdersViewModel();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    totalAmount: 0,
  });
  const [actionError, setActionError] = useState('');

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0 }],
    });
  };

  const updateItem = (i, field, val) => {
    const items = [...formData.items];
    items[i] = { ...items[i], [field]: field === 'quantity' || field === 'unitPrice' ? Number(val) || 0 : val };
    const totalAmount = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
    setFormData({ ...formData, items, totalAmount });
  };

  const removeItem = (i) => {
    const items = formData.items.filter((_, idx) => idx !== i);
    const totalAmount = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
    setFormData({ ...formData, items, totalAmount });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    const result = await vm.createOrder({
      vendorId: formData.vendorId,
      items: formData.items,
      totalAmount: formData.totalAmount,
    });
    if (result.success) {
      setShowModal(false);
      setFormData({ vendorId: '', items: [{ description: '', quantity: 1, unitPrice: 0 }], totalAmount: 0 });
    } else {
      setActionError(result.error);
    }
  };

  const columns = [
    { key: '_id', label: 'ID', render: (v) => v?.slice(-6) },
    {
      key: 'vendorId',
      label: 'Vendor',
      render: (v) => (v?.name || v),
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (v) => (v != null ? `$${Number(v).toLocaleString()}` : '-'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => {
        const colors = { Pending: 'text-amber-400', Approved: 'text-green-400', Completed: 'text-blue-400' };
        return <span className={colors[v] || ''}>{v}</span>;
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (v) => (v ? new Date(v).toLocaleDateString() : '-'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) =>
        row.status === PO_STATUS.Pending ? (
          <button
            onClick={() => vm.approveOrder(row._id)}
            className="text-primary-400 hover:underline text-sm"
          >
            Approve
          </button>
        ) : null,
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="font-display font-bold text-2xl text-white">Purchase Orders</h1>
        <div className="flex gap-4">
          <select
            value={vm.statusFilter}
            onChange={(e) => vm.setStatusFilter(e.target.value)}
            className="input-field max-w-[160px]"
          >
            <option value="">All Status</option>
            {Object.values(PO_STATUS).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={vm.vendorFilter}
            onChange={(e) => vm.setVendorFilter(e.target.value)}
            className="input-field max-w-[200px]"
          >
            <option value="">All Vendors</option>
            {vm.vendors.map((v) => (
              <option key={v._id} value={v._id}>{v.name}</option>
            ))}
          </select>
          <button onClick={() => { setShowModal(true); setActionError(''); }} className="btn-primary">
            Create PO
          </button>
        </div>
      </div>

      {vm.error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {vm.error}
        </div>
      )}

      <DataTable columns={columns} data={vm.orders} loading={vm.loading} />

      <div className="flex justify-between mt-4 text-slate-400 text-sm">
        <span>Page {vm.page} of {vm.totalPages || 1} ({vm.total} total)</span>
        <div className="flex gap-2">
          <button disabled={vm.page <= 1} onClick={() => vm.setPage((p) => p - 1)} className="disabled:opacity-50 hover:text-white">Prev</button>
          <button disabled={vm.page >= vm.totalPages} onClick={() => vm.setPage((p) => p + 1)} className="disabled:opacity-50 hover:text-white">Next</button>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Purchase Order">
        <form onSubmit={handleSubmit} className="space-y-4">
          {actionError && <div className="text-red-400 text-sm">{actionError}</div>}
          <div>
            <label className="block text-slate-400 text-sm mb-1">Vendor</label>
            <select
              value={formData.vendorId}
              onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select vendor</option>
              {vm.vendors.map((v) => (
                <option key={v._id} value={v._id}>{v.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2">Items</label>
            {formData.items.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(i, 'description', e.target.value)}
                  className="input-field flex-1"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                  className="input-field w-20"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(i, 'unitPrice', e.target.value)}
                  className="input-field w-24"
                />
                <button type="button" onClick={() => removeItem(i)} className="text-red-400">×</button>
              </div>
            ))}
            <button type="button" onClick={addItem} className="text-primary-400 text-sm">+ Add item</button>
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Total Amount</label>
            <input type="number" value={formData.totalAmount} readOnly className="input-field bg-slate-800" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn-primary">Create</button>
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
