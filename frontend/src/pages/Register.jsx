import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthViewModel } from '../hooks/useAuthViewModel';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ProcurementOfficer',
  });
  const { register, loading, error, setError } = useAuthViewModel();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await register(formData);
    if (result.success) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-primary-400">VendorLink</h1>
          <p className="text-slate-400 mt-1">AI-Powered Supplier Management</p>
        </div>
        <h2 className="text-xl font-semibold text-white mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-slate-400 text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="ProcurementOfficer">Procurement Officer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p className="text-slate-400 text-sm mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
