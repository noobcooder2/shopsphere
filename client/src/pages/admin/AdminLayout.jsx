import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiGrid, FiPackage, FiShoppingBag, FiArrowLeft,
         FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { logout } from '../../slices/authSlice';
import { clearCart } from '../../slices/cartSlice';
import { useTheme } from '../../context/ThemeContext';

const NAV = [
  { to: '/admin',          label: 'Dashboard', icon: FiGrid,      end: true },
  { to: '/admin/products', label: 'Products',  icon: FiShoppingBag },
  { to: '/admin/orders',   label: 'Orders',    icon: FiPackage },
];

export default function AdminLayout() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { user }  = useSelector(s => s.auth);
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100 dark:border-white/[0.06]">
        <p className="text-[17px] font-medium text-gray-900 dark:text-white">
          Shop<span className="text-primary">Sphere</span>
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px]
               font-medium transition-all duration-150
               ${isActive
                 ? 'bg-primary text-white'
                 : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.05] hover:text-primary'}`}>
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-4 space-y-1 border-t border-gray-100
                      dark:border-white/[0.06] pt-3">
        {/* Theme toggle */}
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="text-[11px] text-gray-400 flex-1">Theme</span>
          <div className="flex bg-gray-100 dark:bg-white/[0.06] rounded-full p-0.5">
            {['Light','Dark'].map(t => (
              <button key={t} onClick={() => setTheme(t.toLowerCase())}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium
                            transition-all duration-200
                  ${theme === t.toLowerCase()
                    ? 'bg-primary text-white'
                    : 'text-gray-500 dark:text-gray-400'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => navigate('/')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px]
                     font-medium text-gray-500 dark:text-gray-400 w-full
                     hover:bg-gray-50 dark:hover:bg-white/[0.05]
                     hover:text-primary transition-colors">
          <FiArrowLeft size={16} /> Back to Store
        </button>

        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px]
                     font-medium text-red-500 w-full
                     hover:bg-red-50 dark:hover:bg-red-900/20
                     transition-colors">
          <FiLogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen page-bg">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-0 h-screen
                        bg-white dark:bg-[#0E0E22]
                        border-r border-gray-100 dark:border-white/[0.06]">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-56 bg-white dark:bg-[#0E0E22]
                          border-r border-gray-100 dark:border-white/[0.06]">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 h-14
                        bg-white dark:bg-[#0E0E22]
                        border-b border-gray-100 dark:border-white/[0.06]">
          <button onClick={() => setOpen(true)}
            className="text-gray-500 dark:text-gray-400">
            <FiMenu size={20} />
          </button>
          <p className="text-[15px] font-medium text-gray-900 dark:text-white">
            Shop<span className="text-primary">Sphere</span> Admin
          </p>
        </div>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}