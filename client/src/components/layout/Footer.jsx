import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

const LINKS = {
  Shop: [
    { label: 'All Products', path: '/products' },
    { label: 'New Arrivals', path: '/products?sort=newest' },
    { label: 'Deals', path: '/deals' },
    { label: 'Categories', path: '/categories' },
  ],
  Account: [
    { label: 'Login', path: '/login' },
    { label: 'Register', path: '/login?tab=register' },
    { label: 'My Orders', path: '/orders' },
    { label: 'Wishlist', path: '/wishlist' },
  ],
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' },
    { label: 'Blog', path: '/blog' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white/60 dark:bg-[#0A0A1E]/80 backdrop-blur-xl
                       border-t border-gray-100 dark:border-white/[0.05] mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-[20px] font-medium text-gray-900
                                     dark:text-white mb-3 block">
              Shop<span className="text-primary">Sphere</span>
            </Link>
            <p className="text-[13px] text-gray-500 dark:text-gray-400
                          leading-relaxed mb-4">
              Your one-stop destination for everything you need, delivered fast.
            </p>
            <div className="flex gap-3">
              {[FiGithub, FiTwitter, FiInstagram].map((Icon, i) => (
                <button key={i}
                  className="w-8 h-8 rounded-lg border border-gray-200
                             dark:border-white/[0.07] flex items-center justify-center
                             text-gray-400 hover:border-primary hover:text-primary
                             transition-all">
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-[12px] font-medium text-gray-900 dark:text-white
                            uppercase tracking-wider mb-4">{heading}</p>
              <ul className="space-y-2.5">
                {links.map(({ label, path }) => (
                  <li key={label}>
                    <Link to={path}
                      className="text-[13px] text-gray-500 dark:text-gray-400
                                 hover:text-primary dark:hover:text-primary
                                 transition-colors duration-150">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 dark:border-white/[0.05] pt-6
                        flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-gray-400">
            © 2026 ShopSphere. All rights reserved.
          </p>
          <div className="flex gap-4">
            {[
              { label: 'Privacy Policy', path: '/privacy' },
              { label: 'Terms of Service', path: '/terms' },
              { label: 'Cookie Policy', path: '/cookies' },
            ].map(({ label, path }) => (
              <Link key={label} to={path}
                className="text-[12px] text-gray-400 hover:text-primary
                           transition-colors duration-150">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}