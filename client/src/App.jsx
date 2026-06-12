import { Navigate } from 'react-router-dom';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';
import CategoriesPage from './pages/CategoriesPage';
import DealsPage from './pages/DealsPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import { getCartAPI } from './api/cartAPI';
import { setCart } from './slices/cartSlice';
import OrderDetailPage from './pages/OrderDetailPage';

const Placeholder = ({ title }) => (
  <div className="page-bg min-h-[60vh] flex items-center justify-center">
    <p className="text-gray-400 dark:text-gray-500 text-[14px]">{title} — coming soon</p>
  </div>
);

function AppContent() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);

  // Sync cart count whenever user logs in or page reloads
  useEffect(() => {
    if (user) {
      getCartAPI()
        .then(({ data }) => dispatch(setCart(data)))
        .catch(() => {});
    }
  }, [user]);

  function AdminRoute({ children }) {
    const { user } = useSelector(s => s.auth);
    if (!user)              return <Navigate to="/login" replace />;
    if (user.role !== 'admin') return <Navigate to="/" replace />;
    return children;
  }

  return (
    <div className="page-bg min-h-screen transition-colors duration-300">
      <Navbar />
      <main>
        <Routes>
          <Route path="/"             element={<HomePage />} />
          <Route path="/login"        element={<LoginPage />} />
          <Route path="/products"     element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart"         element={<CartPage />} />
          <Route path="/wishlist"     element={<WishlistPage />} />
          <Route path="/admin"        element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index              element={<AdminDashboard />} />
            <Route path="products"    element={<AdminProducts />} />
            <Route path="orders"      element={<AdminOrders />} />
          </Route>
          <Route path="/categories"   element={<CategoriesPage />} />
          <Route path="/deals"        element={<DealsPage />} />
          <Route path="/search"       element={<ProductsPage />} />
          <Route path="/about"        element={<Placeholder title="About Us" />} />
          <Route path="/contact"      element={<Placeholder title="Contact" />} />
          <Route path="/privacy"      element={<Placeholder title="Privacy Policy" />} />
          <Route path="/terms"        element={<Placeholder title="Terms of Service" />} />
          <Route path="*"             element={<Placeholder title="404 — Not Found" />} />
          <Route path="/orders"       element={<OrdersPage />} />
          <Route path="/checkout"     element={<CheckoutPage />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right"
        toastOptions={{ style: { fontSize: '13px', borderRadius: '10px' } }} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}