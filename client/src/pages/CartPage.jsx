import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMinus, FiPlus, FiTrash2, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getCartAPI, updateCartAPI, removeFromCartAPI } from '../api/cartAPI';
import { setCart } from '../slices/cartSlice';

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user }              = useSelector(s => s.auth);
  const { items, totalPrice } = useSelector(s => s.cart);

  const [loading,    setLoading]    = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login', { state: { from: '/cart' } }); return; }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await getCartAPI();
      dispatch(setCart(data));
    } catch { toast.error('Failed to load cart'); }
    finally { setLoading(false); }
  };

  const handleQty = async (productId, newQty) => {
    try {
      setUpdatingId(productId);
      const { data } = await updateCartAPI(productId, newQty);
      dispatch(setCart(data));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setUpdatingId(null); }
  };

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);
      const { data } = await removeFromCartAPI(productId);
      dispatch(setCart(data));
      toast.success('Item removed');
    } catch { toast.error('Remove failed'); }
    finally { setRemovingId(null); }
  };

  const shipping   = totalPrice > 0 && totalPrice < 499 ? 49 : 0;
  const finalTotal = totalPrice + shipping;

  if (loading) return (
    <div className="page-bg min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent
                      rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-1">
          Shopping Cart
        </h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-8">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>

        {items.length === 0 ? (
          <div className="text-center py-28">
            <p className="text-7xl mb-5">🛒</p>
            <p className="text-[18px] font-medium text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </p>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-6">
              Looks like you haven't added anything yet
            </p>
            <button onClick={() => navigate('/products')}
              className="px-6 py-3 bg-primary text-white rounded-xl
                         text-[14px] font-medium hover:opacity-90 transition-opacity">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Items */}
            <div className="flex-1 space-y-3">
              {items.map(item => {
                const pid = item.product?._id || item.product;
                return (
                  <div key={pid}
                    className="bg-white dark:bg-[#0E0E22] rounded-2xl
                               border border-gray-100 dark:border-white/[0.06]
                               p-4 flex gap-4 items-center
                               hover:border-primary/20 transition-all duration-200">

                    {/* Image */}
                    <div onClick={() => navigate(`/products/${pid}`)}
                      className="w-20 h-20 bg-gray-50 dark:bg-[#14142A] rounded-xl
                                 flex items-center justify-center shrink-0
                                 overflow-hidden cursor-pointer">
                      {item.image
                        ? <img src={item.image} alt={item.name}
                            className="w-full h-full object-cover" />
                        : <span className="text-3xl">🛍️</span>}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p onClick={() => navigate(`/products/${pid}`)}
                        className="text-[14px] font-medium text-gray-900 dark:text-white
                                   line-clamp-1 mb-0.5 cursor-pointer
                                   hover:text-primary transition-colors">
                        {item.name}
                      </p>
                      <p className="text-[13px] text-primary font-medium">
                        ₹{item.price?.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Subtotal: ₹{(item.price * item.quantity)?.toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#14142A]
                                    rounded-xl border border-gray-200
                                    dark:border-white/[0.08] p-1 shrink-0">
                      <button onClick={() => handleQty(pid, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updatingId === pid}
                        className="w-7 h-7 rounded-lg flex items-center justify-center
                                   text-gray-500 hover:bg-white dark:hover:bg-white/10
                                   transition-colors disabled:opacity-40">
                        <FiMinus size={12} />
                      </button>
                      <span className="text-[13px] font-medium text-gray-900
                                       dark:text-white w-7 text-center">
                        {updatingId === pid
                          ? <span className="w-3 h-3 border border-primary
                                             border-t-transparent rounded-full
                                             animate-spin inline-block" />
                          : item.quantity}
                      </span>
                      <button onClick={() => handleQty(pid, item.quantity + 1)}
                        disabled={updatingId === pid}
                        className="w-7 h-7 rounded-lg flex items-center justify-center
                                   text-gray-500 hover:bg-white dark:hover:bg-white/10
                                   transition-colors disabled:opacity-40">
                        <FiPlus size={12} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button onClick={() => handleRemove(pid)}
                      disabled={removingId === pid}
                      className="w-8 h-8 rounded-xl flex items-center justify-center
                                 text-gray-400 hover:text-red-500
                                 hover:bg-red-50 dark:hover:bg-red-900/20
                                 transition-all shrink-0">
                      {removingId === pid
                        ? <span className="w-3 h-3 border border-red-400
                                           border-t-transparent rounded-full animate-spin" />
                        : <FiTrash2 size={14} />}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-white dark:bg-[#0E0E22] rounded-2xl
                              border border-gray-100 dark:border-white/[0.06]
                              p-6 sticky top-20">
                <p className="text-[16px] font-medium text-gray-900 dark:text-white mb-5">
                  Order Summary
                </p>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-500 dark:text-gray-400">
                      Subtotal ({items.length} items)
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₹{totalPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                    <span className={`font-medium ${shipping === 0 ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[11px] text-amber-500 bg-amber-50
                                  dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                      Add ₹{(499 - totalPrice)} more for free shipping!
                    </p>
                  )}
                  <div className="border-t border-gray-100 dark:border-white/[0.06]
                                  pt-3 flex justify-between">
                    <span className="text-[15px] font-medium text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-[15px] font-medium text-primary">
                      ₹{finalTotal?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button onClick={() => navigate('/checkout')}
                  className="w-full py-3 bg-primary text-white rounded-xl
                             text-[14px] font-medium hover:opacity-90
                             transition-opacity flex items-center justify-center gap-2">
                  Proceed to Checkout <FiArrowRight size={15} />
                </button>

                <button onClick={() => navigate('/products')}
                  className="w-full mt-3 py-2.5 text-[13px] font-medium
                             text-gray-500 dark:text-gray-400 hover:text-primary
                             transition-colors flex items-center justify-center gap-1">
                  <FiShoppingBag size={14} /> Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}