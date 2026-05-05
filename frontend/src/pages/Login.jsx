import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthViewModel } from '../hooks/useAuthViewModel';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { loginUser, loading, error, setError } = useAuthViewModel();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await loginUser({
      email,
      password,
      rememberMe,
    });

    if (result.success) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md shadow-lg">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-primary-400">
            VendorLink
          </h1>
          <p className="text-slate-400 mt-1">
            AI-Powered Supplier Management
          </p>
        </div>

        <h2 className="text-xl font-semibold text-white mb-6 text-center">
          Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-slate-400 text-sm mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@company.com"
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-400 text-sm mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm hover:text-white"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-primary-400"
            />

            <label htmlFor="remember">
              Remember me
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 transition-all"
          >
            {loading ? 'Signing in, please wait...' : 'Sign In'}
          </button>

        </form>

        {/* Register */}
        <p className="text-slate-400 text-sm mt-6 text-center">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="text-primary-400 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}
