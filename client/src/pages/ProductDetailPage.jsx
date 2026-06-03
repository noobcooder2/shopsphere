import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiHeart, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getProductByIdAPI } from '../api/productAPI';
import { addToCartAPI } from '../api/cartAPI';
import { toggleWishlistAPI } from '../api/wishlistAPI';
import { setCart } from '../slices/cartSlice';

export default function ProductDetailPage() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { user }  = useSelector(s => s.auth);

  const [product,     setProduct]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [quantity,    setQuantity]    = useState(1);
  const [addingCart,  setAddingCart]  = useState(false);
  const [inWishlist,  setInWishlist]  = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await getProductByIdAPI(id);
      setProduct(data);
    } catch {
      toast.error('Product not found');
      navigate('/products');
    } finally { setLoading(false); }
  };

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login first'); return navigate('/login'); }
    try {
      setAddingCart(true);
      const { data } = await addToCartAPI(product._id, quantity);
      dispatch(setCart(data));
      toast.success(`${product.name} added to cart! 🛒`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally { setAddingCart(false); }
  };

  const handleWishlist = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await toggleWishlistAPI(product._id);
      setInWishlist(data.action === 'added');
      toast.success(data.action === 'added' ? 'Added to wishlist ❤️' : 'Removed from wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  };

  if (loading) return (
    <div className="page-bg min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent
                      rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;

  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[13px] text-gray-500
                     dark:text-gray-400 hover:text-primary transition-colors mb-8">
          <FiArrowLeft size={16} /> Back to products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Image */}
          <div className="bg-white dark:bg-[#0E0E22] rounded-3xl
                          border border-gray-100 dark:border-white/[0.06]
                          h-80 md:h-[420px] flex items-center justify-center overflow-hidden">
            {product.images?.[0]
              ? <img src={product.images[0]} alt={product.name}
                  className="w-full h-full object-cover" />
              : <span className="text-9xl">🛍️</span>}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-primary uppercase
                             tracking-widest mb-2">{product.category}</span>
            <h1 className="text-3xl font-medium text-gray-900 dark:text-white
                           leading-tight mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className="text-lg"
                    style={{ color: s <= Math.round(product.rating || 4) ? '#F59E0B' : '#D1D5DB' }}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-[13px] text-gray-500 dark:text-gray-400">
                {product.rating || 4.5} · {product.numReviews || 0} reviews
              </span>
            </div>

            {/* Price */}
            <p className="text-4xl font-medium text-gray-900 dark:text-white mb-1">
              ₹{product.price?.toLocaleString('en-IN')}
            </p>
            <p className={`text-[12px] mb-5 font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {product.stock > 0 ? `✓ In stock (${product.stock} left)` : '✗ Out of stock'}
            </p>

            {/* Description */}
            <p className="text-[14px] text-gray-500 dark:text-gray-400
                          leading-relaxed mb-6">{product.description}</p>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[13px] text-gray-500 dark:text-gray-400">
                  Quantity:
                </span>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#14142A]
                                rounded-xl border border-gray-200 dark:border-white/[0.08] p-1">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center
                               text-gray-500 hover:bg-gray-100
                               dark:hover:bg-white/[0.06] transition-colors">
                    <FiMinus size={13} />
                  </button>
                  <span className="text-[14px] font-medium text-gray-900
                                   dark:text-white w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center
                               text-gray-500 hover:bg-gray-100
                               dark:hover:bg-white/[0.06] transition-colors">
                    <FiPlus size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={handleAddToCart}
                disabled={product.stock === 0 || addingCart}
                className="flex-1 py-3 bg-primary text-white rounded-xl text-[14px]
                           font-medium hover:opacity-90 transition-opacity
                           flex items-center justify-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed">
                {addingCart
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><FiShoppingCart size={16} /> Add to Cart</>}
              </button>
              <button onClick={handleWishlist}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center
                            transition-all duration-200
                  ${inWishlist
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800 text-red-500'
                    : 'border-gray-200 dark:border-white/[0.08] text-gray-400 hover:text-red-500 hover:border-red-300'}`}>
                <FiHeart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Meta */}
            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/[0.06]
                            flex gap-6 text-[12px] text-gray-500 dark:text-gray-400">
              <span>Brand: <strong className="text-gray-800 dark:text-gray-200">{product.brand}</strong></span>
              <span>Category: <strong className="text-gray-800 dark:text-gray-200">{product.category}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}