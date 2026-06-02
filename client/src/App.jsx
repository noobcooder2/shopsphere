import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';

// Placeholder pages — we'll build these Day 6-9
const Placeholder = ({ title }) => (
  <div className="page-bg min-h-[60vh] flex items-center justify-center">
    <p className="text-gray-400 dark:text-gray-500 text-[14px]">{title} — coming soon</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="page-bg min-h-screen transition-colors duration-300">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<Placeholder title="Products" />} />
            <Route path="/login" element={<Placeholder title="Login" />} />
            <Route path="/cart" element={<Placeholder title="Cart" />} />
            <Route path="/orders" element={<Placeholder title="Orders" />} />
            <Route path="/wishlist" element={<Placeholder title="Wishlist" />} />
            <Route path="/admin" element={<Placeholder title="Admin" />} />
            <Route path="*" element={<Placeholder title="404 — Page not found" />} />
            <Route path="/deals" element={<Placeholder title="Deals" />} />
            <Route path="/categories" element={<Placeholder title="Categories" />} />
            <Route path="/about" element={<Placeholder title="About Us" />} />
            <Route path="/contact" element={<Placeholder title="Contact" />} />
            <Route path="/search" element={<Placeholder title="Search" />} />
            <Route path="/privacy" element={<Placeholder title="Privacy Policy" />} />
            <Route path="/terms" element={<Placeholder title="Terms of Service" />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right"
          toastOptions={{
            style: {
              fontSize: '13px',
              borderRadius: '10px',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;