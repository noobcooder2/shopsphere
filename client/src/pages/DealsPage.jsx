import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getProductsAPI } from '../api/productAPI';
import { addToCartAPI } from '../api/cartAPI';
import { setCart } from '../slices/cartSlice';

export default function DealsPage() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { user }  = useSelector(s => s.auth);

  const [deals,    setDeals]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    getProductsAPI({ deals: 'true' })
      .then(({ data }) => {
        // One product per category — the one with highest discount
        const byCategory = {};
        data.forEach(p => {
          const disc = Math.round((1 - p.price / p.originalPrice) * 100);
          if (!byCategory[p.category] ||
              disc > Math.round((1 - byCategory[p.category].price / byCategory[p.category].originalPrice) * 100)) {
            byCategory[p.category] = p;
          }
        });
        setDeals(Object.values(byCategory));
      })
      .catch(() => toast.error('Failed to load deals'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    if (!user) { toast.error('Please login first'); return navigate('/login'); }
    try {
      setAddingId(productId);
      const { data } = await addToCartAPI(productId, 1);
      dispatch(setCart(data));
      toast.success('Added to cart! 🛒');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setAddingId(null); }
  };

  const getDiscount = p =>
    Math.round((1 - p.price / p.originalPrice) * 100);

  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl
                          flex items-center justify-center">
            <FiTag className="text-red-500" size={20} />
          </div>
          <h1 className="text-3xl font-medium text-gray-900 dark:text-white">
            Today's Deals
          </h1>
        </div>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-3">
          {loading ? 'Loading...' : `${deals.length} deals — one from each category`}
        </p>

        {/* Discount threshold badge */}
        <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20
                        border border-red-200 dark:border-red-800 rounded-full
                        px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[12px] text-red-600 dark:text-red-400 font-medium">
            30% or more off · Limited stock
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#0E0E22] rounded-2xl
                                      border border-gray-100 dark:border-white/[0.06]
                                      overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-100 dark:bg-[#14142A]" />
                <div className="p-4 space-y-2">
                  <div className="h-2.5 bg-gray-100 dark:bg-[#14142A] rounded w-1/3" />
                  <div className="h-4 bg-gray-100 dark:bg-[#14142A] rounded w-2/3" />
                  <div className="h-4 bg-gray-100 dark:bg-[#14142A] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {deals.map(product => {
              const disc = getDiscount(product);
              const saved = product.originalPrice - product.price;
              return (
                <div key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="bg-white dark:bg-[#0E0E22] rounded-2xl
                             border border-gray-100 dark:border-white/[0.06]
                             overflow-hidden cursor-pointer group
                             hover:border-primary/40 hover:shadow-xl
                             hover:shadow-primary/5 transition-all duration-300">

                  {/* Image */}
                  <div className="bg-gray-50 dark:bg-[#14142A] h-52 relative
                                  flex items-center justify-center overflow-hidden">
                    {product.images?.[0]
                      ? <img src={product.images[0]} alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105
                                     transition-transform duration-300" />
                      : <span className="text-5xl">🛍️</span>}

                    {/* Discount badge */}
                    <div className="absolute top-3 left-3 bg-red-500 text-white
                                    text-[11px] font-bold px-2.5 py-1 rounded-full
                                    flex items-center gap-1">
                      -{disc}% OFF
                    </div>

                    {/* Category badge top-right */}
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/60
                                    backdrop-blur-sm text-[10px] font-medium
                                    text-gray-600 dark:text-gray-300
                                    px-2 py-0.5 rounded-full">
                      {product.category}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-[14px] font-medium text-gray-900 dark:text-white
                                  line-clamp-1 mb-2">{product.name}</p>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 mb-1">
                      <p className="text-[18px] font-medium text-gray-900 dark:text-white">
                        ₹{product.price?.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[12px] text-gray-400 line-through">
                        ₹{product.originalPrice?.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <p className="text-[11px] text-green-500 font-medium mb-3">
                      You save ₹{saved?.toLocaleString('en-IN')}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span style={{ color:'#F59E0B' }}>★</span>
                        <span className="text-[11px] text-gray-400">
                          {product.rating || '4.5'}
                        </span>
                      </div>
                      <button onClick={e => handleAddToCart(product._id, e)}
                        disabled={product.stock === 0 || addingId === product._id}
                        className="w-9 h-9 rounded-xl bg-red-500 text-white flex
                                   items-center justify-center hover:bg-red-600
                                   transition-colors disabled:opacity-50">
                        {addingId === product._id
                          ? <span className="w-3 h-3 border-2 border-white
                                             border-t-transparent rounded-full animate-spin" />
                          : <span className="text-xl font-light">+</span>}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}