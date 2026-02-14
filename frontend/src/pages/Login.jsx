import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthViewModel } from '../hooks/useAuthViewModel';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser, loading, error, setError } = useAuthViewModel();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await loginUser({ email, password });
    if (result.success) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-primary-400">VendorLink</h1>
          <p className="text-slate-400 mt-1">AI-Powered Supplier Management</p>
        </div>
        <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-slate-400 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-slate-400 text-sm mt-6 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
