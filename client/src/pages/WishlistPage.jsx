import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getWishlistAPI, toggleWishlistAPI } from '../api/wishlistAPI';
import { addToCartAPI } from '../api/cartAPI';
import { setCart } from '../slices/cartSlice';

export default function WishlistPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);

  const [wishlist,   setWishlist]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [addingId,   setAddingId]   = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login', { state: { from: '/wishlist' } }); return; }
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await getWishlistAPI();
      setWishlist(data.products || []);
    } catch { toast.error('Failed to load wishlist'); }
    finally { setLoading(false); }
  };

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);
      await toggleWishlistAPI(productId);
      setWishlist(prev => prev.filter(p => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed to remove'); }
    finally { setRemovingId(null); }
  };

  const handleMoveToCart = async (productId) => {
    try {
      setAddingId(productId);
      const { data } = await addToCartAPI(productId, 1);
      dispatch(setCart(data));
      await toggleWishlistAPI(productId);
      setWishlist(prev => prev.filter(p => p._id !== productId));
      toast.success('Moved to cart! 🛒');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setAddingId(null); }
  };

  if (loading) return (
    <div className="page-bg min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent
                      rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="flex items-center gap-3 mb-1">
          <FiHeart size={22} className="text-red-500" fill="currentColor" />
          <h1 className="text-3xl font-medium text-gray-900 dark:text-white">
            My Wishlist
          </h1>
        </div>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-8">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
        </p>

        {wishlist.length === 0 ? (
          <div className="text-center py-28">
            <p className="text-7xl mb-5">💝</p>
            <p className="text-[18px] font-medium text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </p>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-6">
              Save items you love and buy them later
            </p>
            <button onClick={() => navigate('/products')}
              className="px-6 py-3 bg-primary text-white rounded-xl
                         text-[14px] font-medium hover:opacity-90 transition-opacity">
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlist.map(product => (
              <div key={product._id}
                className="bg-white dark:bg-[#0E0E22] rounded-2xl
                           border border-gray-100 dark:border-white/[0.06]
                           overflow-hidden hover:border-primary/40
                           hover:shadow-lg hover:shadow-primary/5
                           transition-all duration-300 group">

                {/* Image */}
                <div onClick={() => navigate(`/products/${product._id}`)}
                  className="bg-gray-50 dark:bg-[#14142A] h-44 relative
                             flex items-center justify-center cursor-pointer overflow-hidden">
                  {product.images?.[0]
                    ? <img src={product.images[0]} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105
                                   transition-transform duration-300" />
                    : <span className="text-5xl group-hover:scale-110
                                       transition-transform duration-300">🛍️</span>}

                  <button onClick={e => { e.stopPropagation(); handleRemove(product._id); }}
                    disabled={removingId === product._id}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full
                               bg-white/80 dark:bg-black/50 backdrop-blur-sm
                               flex items-center justify-center text-red-500
                               hover:bg-red-50 dark:hover:bg-red-900/30
                               opacity-0 group-hover:opacity-100 transition-all">
                    {removingId === product._id
                      ? <span className="w-3 h-3 border border-red-400
                                         border-t-transparent rounded-full animate-spin" />
                      : <FiTrash2 size={13} />}
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-[10px] text-primary font-medium uppercase
                                tracking-wide mb-1">{product.category}</p>
                  <p onClick={() => navigate(`/products/${product._id}`)}
                    className="text-[13px] font-medium text-gray-900 dark:text-white
                               line-clamp-1 mb-1 cursor-pointer
                               hover:text-primary transition-colors">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    <span style={{ color: '#F59E0B' }}>★</span>
                    <span className="text-[11px] text-gray-400">{product.rating || '4.5'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[15px] font-medium text-gray-900 dark:text-white">
                      ₹{product.price?.toLocaleString('en-IN')}
                    </p>
                    <button onClick={() => handleMoveToCart(product._id)}
                      disabled={addingId === product._id || product.stock === 0}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary
                                 text-white rounded-lg text-[11px] font-medium
                                 hover:opacity-90 transition-opacity
                                 disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
                      {addingId === product._id
                        ? <span className="w-3 h-3 border-2 border-white
                                           border-t-transparent rounded-full animate-spin" />
                        : <><FiShoppingCart size={12} /> Add to Cart</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}