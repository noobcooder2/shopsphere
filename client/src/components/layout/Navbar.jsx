import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiHeart, FiShoppingCart, FiUser,
         FiSun, FiMoon, FiMenu, FiX, FiLogOut,
         FiPackage, FiSettings } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../../slices/authSlice';
import { clearCart } from '../../slices/cartSlice';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Deals', path: '/deals' },
  { label: 'Categories', path: '/categories' },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user } = useSelector(s => s.auth);
  const { itemCount } = useSelector(s => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    setDropOpen(false);
    navigate('/');
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 bg-white/75 dark:bg-[#0E0E22]/80
                    backdrop-blur-xl border-b border-white/50
                    dark:border-white/[0.055] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">

        {/* Logo */}
        <Link to="/" className="text-[19px] font-medium tracking-tight
                                 text-gray-900 dark:text-white shrink-0">
          Shop<span className="text-primary">Sphere</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, path }) => (
            <Link key={label} to={path}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150
                ${isActive(path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary'}`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5">

          {/* Search */}
          <button onClick={() => navigate('/search')}
            className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center
                       border border-gray-200 dark:border-white/[0.07]
                       text-gray-500 dark:text-gray-400
                       hover:border-primary hover:text-primary hover:bg-primary/10
                       transition-all duration-150">
            <FiSearch size={15} />
          </button>

          {/* Wishlist */}
          <button onClick={() => navigate('/wishlist')}
            className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center
                       border border-gray-200 dark:border-white/[0.07]
                       text-gray-500 dark:text-gray-400
                       hover:border-primary hover:text-primary hover:bg-primary/10
                       transition-all duration-150">
            <FiHeart size={15} />
          </button>

          {/* Cart */}
          <button onClick={() => navigate('/cart')}
            className="relative flex w-9 h-9 rounded-lg items-center justify-center
                       border border-gray-200 dark:border-white/[0.07]
                       text-gray-500 dark:text-gray-400
                       hover:border-primary hover:text-primary hover:bg-primary/10
                       transition-all duration-150">
            <FiShoppingCart size={15} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white
                               text-[9px] min-w-[18px] h-[18px] px-1 rounded-full
                               flex items-center justify-center font-semibold
                               border-2 border-white dark:border-[#0E0E22]
                               leading-none z-10">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          {/* User dropdown / Sign in */}
          {user ? (
            <div className="relative">
              <button onClick={() => setDropOpen(p => !p)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px]
                           font-medium border border-gray-200 dark:border-white/[0.07]
                           text-gray-700 dark:text-gray-300
                           hover:border-primary hover:text-primary
                           transition-all duration-150">
                <FiUser size={14} />
                <span className="hidden sm:block">{user.name?.split(' ')[0]}</span>
              </button>

              {dropOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48
                                bg-white dark:bg-[#14142A]
                                border border-gray-100 dark:border-white/[0.07]
                                rounded-xl shadow-xl z-50 overflow-hidden
                                animate-fade-up">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-white/[0.05]">
                    <p className="text-[13px] font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                  </div>
                  {[
                    { icon: FiPackage, label: 'My Orders', path: '/orders' },
                    { icon: FiHeart, label: 'Wishlist', path: '/wishlist' },
                    ...(user.role === 'admin'
                      ? [{ icon: FiSettings, label: 'Admin Panel', path: '/admin' }]
                      : []),
                  ].map(({ icon: Icon, label, path }) => (
                    <Link key={label} to={path}
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[13px]
                                 text-gray-700 dark:text-gray-300
                                 hover:bg-primary/5 hover:text-primary transition-colors">
                      <Icon size={14} />
                      {label}
                    </Link>
                  ))}
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px]
                               text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10
                               transition-colors border-t border-gray-100 dark:border-white/[0.05]">
                    <FiLogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                         bg-primary text-white text-[13px] font-medium
                         hover:opacity-90 transition-opacity">
              <FiUser size={14} /> Sign in
            </button>
          )}

          {/* Theme toggle */}
          <div className="flex bg-gray-100/80 dark:bg-white/[0.06] rounded-full p-0.5
                          border border-gray-200 dark:border-white/[0.06] ml-1">
            {[
              { label: 'Light', icon: FiSun, val: 'light' },
              { label: 'Dark', icon: FiMoon, val: 'dark' },
            ].map(({ label, icon: Icon, val }) => (
              <button key={val} onClick={() => setTheme(val)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px]
                            font-medium transition-all duration-200
                            ${theme === val
                              ? 'bg-primary text-white'
                              : 'text-gray-500 dark:text-gray-400'}`}>
                <Icon size={11} /> {label}
              </button>
            ))}
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(p => !p)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center
                       border border-gray-200 dark:border-white/[0.07]
                       text-gray-500 dark:text-gray-400">
            {menuOpen ? <FiX size={16} /> : <FiMenu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-white/[0.05]
                        bg-white/90 dark:bg-[#0E0E22]/95 backdrop-blur-xl px-4 py-3">
          {NAV_LINKS.map(({ label, path }) => (
            <Link key={label} to={path}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-[13px] font-medium
                         text-gray-600 dark:text-gray-400
                         hover:bg-primary/10 hover:text-primary transition-colors">
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}