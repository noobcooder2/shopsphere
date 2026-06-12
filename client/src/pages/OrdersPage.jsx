import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiPackage, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getMyOrdersAPI } from '../api/orderAPI';

const STEPS = ['processing','confirmed','shipped','out_for_delivery','delivered'];

const LABELS = {
  processing:'Processing', confirmed:'Confirmed', shipped:'Shipped',
  out_for_delivery:'Out for Delivery', delivered:'Delivered', cancelled:'Cancelled',
};

const STATUS_STYLE = {
  processing:      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  confirmed:       'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  shipped:         'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  out_for_delivery:'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  delivered:       'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  cancelled:       'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400',
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login', { state: { from: '/orders' } }); return; }
    getMyOrdersAPI()
      .then(({ data }) => {
        console.log('Orders API response:', data); // ← ADD THIS
        setOrders(data);
      })
      .catch((err) => {
          console.log('Orders API error:', err.response); // ← ADD THIS
          toast.error('Failed to load orders');
        })
        .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page-bg min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent
                      rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="flex items-center gap-3 mb-1">
          <FiPackage size={22} className="text-primary" />
          <h1 className="text-3xl font-medium text-gray-900 dark:text-white">My Orders</h1>
        </div>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-8">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
        </p>

        {orders.length === 0 ? (
          <div className="text-center py-28">
            <p className="text-7xl mb-5">📦</p>
            <p className="text-[18px] font-medium text-gray-900 dark:text-white mb-2">
              No orders yet
            </p>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-6">
              Your orders will appear here after purchase
            </p>
            <button onClick={() => navigate('/products')}
              className="px-6 py-3 bg-primary text-white rounded-xl text-[14px]
                         font-medium hover:opacity-90 transition-opacity">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const stepIdx    = STEPS.indexOf(order.orderStatus);
              const cancelled  = order.orderStatus === 'cancelled';

              return (
                <div key={order._id}
                  className="bg-white dark:bg-[#0E0E22] rounded-2xl
                             border border-gray-100 dark:border-white/[0.06] p-5">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">Order ID</p>
                      <p className="text-[13px] font-medium font-mono
                                    text-gray-900 dark:text-white">
                        #{order._id?.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-gray-400 mb-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN',
                          { day:'numeric', month:'short', year:'numeric' })}
                      </p>
                      <span className={`text-[11px] font-medium px-2.5 py-0.5
                                        rounded-full capitalize
                                        ${STATUS_STYLE[order.orderStatus]}`}>
                        {LABELS[order.orderStatus]}
                      </span>
                    </div>
                  </div>

                  {/* Item thumbnails */}
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                    {order.items?.slice(0, 5).map((item, i) => (
                      <div key={i}
                        className="w-14 h-14 bg-gray-50 dark:bg-[#14142A] rounded-xl
                                   shrink-0 flex items-center justify-center overflow-hidden">
                        {item.image
                          ? <img src={item.image} alt={item.name}
                              className="w-full h-full object-cover" />
                          : <span className="text-xl">🛍️</span>}
                      </div>
                    ))}
                    {order.items?.length > 5 && (
                      <div className="w-14 h-14 bg-gray-50 dark:bg-[#14142A] rounded-xl
                                      shrink-0 flex items-center justify-center">
                        <span className="text-[12px] text-gray-400 font-medium">
                          +{order.items.length - 5}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tracking stepper */}
                  {!cancelled && (
                    <div className="mb-4 px-1">
                      <div className="flex items-start">
                        {STEPS.map((step, i) => {
                          const done   = i <= stepIdx;
                          const active = i === stepIdx;
                          const isLast = i === STEPS.length - 1;
                          return (
                            <div key={step}
                              className={`flex items-center ${!isLast ? 'flex-1' : ''}`}>
                              <div className="flex flex-col items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center
                                                justify-center text-[10px] font-bold
                                                transition-all duration-300 shrink-0
                                  ${active
                                    ? 'bg-primary text-white ring-4 ring-primary/20'
                                    : done
                                      ? 'bg-green-500 text-white'
                                      : 'bg-gray-100 dark:bg-[#14142A] text-gray-400'}`}>
                                  {done && !active ? '✓' : i + 1}
                                </div>
                                <p className={`text-[8px] mt-1 text-center w-12 leading-tight
                                              hidden sm:block
                                  ${done
                                    ? 'text-gray-700 dark:text-gray-300'
                                    : 'text-gray-400'}`}>
                                  {LABELS[step]}
                                </p>
                              </div>
                              {!isLast && (
                                <div className={`flex-1 h-0.5 mb-4 mx-1 transition-all
                                  ${i < stepIdx
                                    ? 'bg-green-400'
                                    : 'bg-gray-100 dark:bg-[#14142A]'}`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3
                                  border-t border-gray-100 dark:border-white/[0.06]">
                    <p className="text-[13px]">
                      <span className="text-gray-400">{order.items?.length} item(s) · </span>
                      <span className="font-medium text-primary">
                        ₹{order.totalPrice?.toLocaleString('en-IN')}
                      </span>
                    </p>
                    <button onClick={() => navigate(`/orders/${order._id}`)}
                      className="flex items-center gap-1 text-[12px] text-primary
                                 font-medium hover:opacity-80 transition-opacity">
                      View Details <FiChevronRight size={14} />
                    </button>
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