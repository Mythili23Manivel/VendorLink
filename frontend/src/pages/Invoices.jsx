import { useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useInvoicesViewModel } from '../hooks/useInvoicesViewModel';

export default function Invoices() {
  const vm = useInvoicesViewModel();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: '',
    purchaseOrderId: '',
    invoiceAmount: 0,
  });
  const [actionError, setActionError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    const result = await vm.createInvoice(formData);
    if (result.success) {
      setShowModal(false);
      setFormData({ vendorId: '', purchaseOrderId: '', invoiceAmount: 0 });
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
      key: 'invoiceAmount',
      label: 'Amount',
      render: (v) => (v != null ? `$${Number(v).toLocaleString()}` : '-'),
    },
    {
      key: 'matched',
      label: 'Matched',
      render: (v) => (v ? '✓ Yes' : '✗ No'),
    },
    {
      key: 'mismatchPercentage',
      label: 'Mismatch %',
      render: (v) => (v != null ? `${v}%` : '-'),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (v) => (v ? new Date(v).toLocaleDateString() : '-'),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="font-display font-bold text-2xl text-white">Invoices</h1>
        <div className="flex gap-4">
          <select
            value={vm.matchedFilter}
            onChange={(e) => vm.setMatchedFilter(e.target.value)}
            className="input-field max-w-[160px]"
          >
            <option value="">All</option>
            <option value="true">Matched</option>
            <option value="false">Mismatched</option>
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
            Create Invoice
          </button>
        </div>
      </div>

      {vm.error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {vm.error}
        </div>
      )}

      <DataTable columns={columns} data={vm.invoices} loading={vm.loading} />

      <div className="flex justify-between mt-4 text-slate-400 text-sm">
        <span>Page {vm.page} of {vm.totalPages || 1} ({vm.total} total)</span>
        <div className="flex gap-2">
          <button disabled={vm.page <= 1} onClick={() => vm.setPage((p) => p - 1)} className="disabled:opacity-50 hover:text-white">Prev</button>
          <button disabled={vm.page >= vm.totalPages} onClick={() => vm.setPage((p) => p + 1)} className="disabled:opacity-50 hover:text-white">Next</button>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Invoice">
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
            <label className="block text-slate-400 text-sm mb-1">Purchase Order</label>
            <select
              value={formData.purchaseOrderId}
              onChange={(e) => setFormData({ ...formData, purchaseOrderId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select PO</option>
              {vm.orders.map((o) => (
                <option key={o._id} value={o._id}>
                  {o._id?.slice(-6)} - ${o.totalAmount?.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Invoice Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.invoiceAmount}
              onChange={(e) => setFormData({ ...formData, invoiceAmount: parseFloat(e.target.value) || 0 })}
              className="input-field"
              required
            />
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
