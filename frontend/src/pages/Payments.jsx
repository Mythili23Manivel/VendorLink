import { useMemo, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { usePaymentsViewModel } from '../hooks/usePaymentsViewModel';
import { PAYMENT_STATUS } from '../utils/constants';

export default function Payments() {
  const vm = usePaymentsViewModel();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: '',
    invoiceId: '',
    amount: 0,
    dueDate: '',
  });
  const [actionError, setActionError] = useState('');
  const [markingId, setMarkingId] = useState(null);
  const [creating, setCreating] = useState(false);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    setCreating(true);

    const result = await vm.createPayment(formData);
    setCreating(false);

    if (result.success) {
      setShowModal(false);
      setFormData({ vendorId: '', invoiceId: '', amount: 0, dueDate: '' });
    } else {
      setActionError(result.error);
    }
  };

  const handleMarkPaid = async (id) => {
    const ok = window.confirm('Mark this payment as Paid?');
    if (!ok) return;

    setMarkingId(id);
    try {
      await vm.markPaid(id);
    } finally {
      setMarkingId(null);
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
      key: 'amount',
      label: 'Amount',
      render: (v) => (v != null ? `$${Number(v).toLocaleString()}` : '-'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => {
        const colors = { Pending: 'text-amber-400', Paid: 'text-green-400', Overdue: 'text-red-400' };
        return <span className={colors[v] || ''}>{v}</span>;
      },
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (v) => (v ? new Date(v).toLocaleDateString() : '-'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) =>
        row.status === PAYMENT_STATUS.Pending || row.status === PAYMENT_STATUS.Overdue ? (
          <button
            onClick={() => handleMarkPaid(row._id)}
            disabled={markingId === row._id}
            className="text-primary-400 hover:underline text-sm disabled:opacity-50"
          >
            {markingId === row._id ? 'Marking...' : 'Mark Paid'}
          </button>
        ) : null,
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="font-display font-bold text-2xl text-white">Payments</h1>

        <div className="flex gap-4">
          <select
            value={vm.statusFilter}
            onChange={(e) => vm.setStatusFilter(e.target.value)}
            className="input-field max-w-[160px]"
          >
            <option value="">All Status</option>
            {Object.values(PAYMENT_STATUS).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={vm.vendorFilter}
            onChange={(e) => vm.setVendorFilter(e.target.value)}
            className="input-field max-w-[200px]"
          >
            <option value="">All Vendors</option>
            {vm.vendors.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setShowModal(true);
              setActionError('');
            }}
            className="btn-primary"
          >
            Create Payment
          </button>
        </div>
      </div>

      {vm.error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {vm.error}
        </div>
      )}

      <DataTable columns={columns} data={vm.payments} loading={vm.loading} />

      <div className="flex justify-between mt-4 text-slate-400 text-sm">
        <span>
          Page {vm.page} of {vm.totalPages || 1} ({vm.total} total)
        </span>
        <div className="flex gap-2">
          <button
            disabled={vm.page <= 1}
            onClick={() => vm.setPage((p) => p - 1)}
            className="disabled:opacity-50 hover:text-white"
          >
            Prev
          </button>
          <button
            disabled={vm.page >= vm.totalPages}
            onClick={() => vm.setPage((p) => p + 1)}
            className="disabled:opacity-50 hover:text-white"
          >
            Next
          </button>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Payment">
        <form onSubmit={handleSubmit} className="space-y-4">
          {actionError && <div className="text-red-400 text-sm">{actionError}</div>}

          <div>
            <label className="block text-slate-400 text-sm mb-1">Vendor</label>
            <select
              value={formData.vendorId}
              onChange={(e) => setFormData({ ...formData, vendorId: e.target.value, invoiceId: '' })}
              className="input-field"
              required
            >
              <option value="">Select vendor</option>
              {vm.vendors.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">Invoice</label>
            <select
              value={formData.invoiceId}
              onChange={(e) => {
                const inv = vm.invoices.find((i) => i._id === e.target.value);
                setFormData({
                  ...formData,
                  invoiceId: e.target.value,
                  amount: inv?.invoiceAmount || 0,
                });
              }}
              className="input-field"
              required
            >
              <option value="">Select invoice</option>
              {(formData.vendorId
                ? vm.invoices.filter((i) => String(i.vendorId?._id || i.vendorId) === String(formData.vendorId))
                : vm.invoices
              ).map((inv) => (
                <option key={inv._id} value={inv._id}>
                  {inv._id?.slice(-6)} - ${inv.invoiceAmount?.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">Due Date</label>
            <input
              type="date"
              min={today}
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={creating} className="btn-primary disabled:opacity-50">
              {creating ? 'Creating...' : 'Create'}
            </button>
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
