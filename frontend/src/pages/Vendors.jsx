import { useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useVendorsViewModel } from '../hooks/useVendorsViewModel';

export default function Vendors() {
  const vm = useVendorsViewModel();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', contact: '' });
  const [actionError, setActionError] = useState('');

  const resetForm = () => {
    setFormData({ name: '', email: '', contact: '' });
    setEditing(null);
    setActionError('');
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (v) => {
    setFormData({ name: v.name, email: v.email, contact: v.contact || '' });
    setEditing(v);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    const result = editing
      ? await vm.updateVendor(editing._id, formData)
      : await vm.createVendor(formData);
    if (result.success) {
      setShowModal(false);
      resetForm();
    } else {
      setActionError(result.error);
    }
  };

  const handleDelete = async (v) => {
    if (!confirm(`Delete vendor "${v.name}"?`)) return;
    await vm.deleteVendor(v._id);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'contact', label: 'Contact' },
    { key: 'totalOrders', label: 'Orders' },
    {
      key: 'rating',
      label: 'Rating',
      render: (v) => (v ? `★ ${v}` : '-'),
    },
    {
      key: 'mismatchRate',
      label: 'Mismatch %',
      render: (v) => (v != null ? `${v}%` : '-'),
    },
    {
      key: 'delayRate',
      label: 'Delay %',
      render: (v) => (v != null ? `${v}%` : '-'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(row)} className="text-primary-400 hover:underline text-sm">
            Edit
          </button>
          <button onClick={() => handleDelete(row)} className="text-red-400 hover:underline text-sm">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="font-display font-bold text-2xl text-white">Vendors</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={vm.search}
            onChange={(e) => vm.setSearch(e.target.value)}
            className="input-field max-w-xs"
          />
          <select
            value={vm.sort}
            onChange={(e) => vm.setSort(e.target.value)}
            className="input-field max-w-[180px]"
          >
            <option value="-createdAt">Newest first</option>
            <option value="createdAt">Oldest first</option>
            <option value="-rating">Rating (high)</option>
            <option value="name">Name A-Z</option>
          </select>
          <button onClick={openCreate} className="btn-primary">
            Add Vendor
          </button>
        </div>
      </div>

      {vm.error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {vm.error}
        </div>
      )}

      <DataTable columns={columns} data={vm.vendors} loading={vm.loading} />

      <div className="flex justify-between mt-4 text-slate-400 text-sm">
        <span>Page {vm.page} of {vm.totalPages || 1} ({vm.total} total)</span>
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

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editing ? 'Edit Vendor' : 'Add Vendor'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {actionError && <div className="text-red-400 text-sm">{actionError}</div>}
          <div>
            <label className="block text-slate-400 text-sm mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Contact</label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn-primary">
              {editing ? 'Update' : 'Create'}
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
