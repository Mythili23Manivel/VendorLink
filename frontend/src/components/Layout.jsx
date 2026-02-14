import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/vendors', label: 'Vendors', icon: '🏢' },
  { to: '/purchase-orders', label: 'Purchase Orders', icon: '📋' },
  { to: '/invoices', label: 'Invoices', icon: '🧾' },
  { to: '/payments', label: 'Payments', icon: '💰' },
  { to: '/ai-assistant', label: 'AI Assistant', icon: '🤖' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-slate-900/80 border-r border-slate-700/50 flex flex-col">
        <div className="p-6 border-b border-slate-700/50">
          <h1 className="font-display font-bold text-xl text-primary-400">VendorLink</h1>
          <p className="text-slate-400 text-sm mt-1">Supplier Management</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive ? 'bg-primary-500/20 text-primary-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-4 py-2 text-slate-400 text-sm">
            <span className="w-8 h-8 rounded-full bg-primary-500/30 flex items-center justify-center text-primary-400">
              {user?.name?.[0] || 'U'}
            </span>
            <div>
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-xs">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-2 py-2 text-sm text-slate-400 hover:text-red-400 transition"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
