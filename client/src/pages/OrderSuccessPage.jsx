import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { getOrderByIdAPI } from '../api/orderAPI';

export default function OrderSuccessPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [order,  setOrder]  = useState(null);

  useEffect(() => {
    getOrderByIdAPI(id)
      .then(({ data }) => setOrder(data))
      .catch(() => {});
  }, [id]);

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#0E0E22] rounded-3xl
                        border border-gray-100 dark:border-white/[0.06] p-8 text-center">

          {/* Animated success icon */}
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full
                          flex items-center justify-center mx-auto mb-5">
            <FiCheckCircle className="text-green-500" size={38} />
          </div>

          <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">
            Order Confirmed! 🎉
          </h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
            Thank you for shopping with ShopSphere! Your order has been placed and will be delivered soon.
          </p>

          {order && (
            <div className="bg-gray-50 dark:bg-[#14142A] rounded-2xl p-4 mb-6 text-left space-y-2.5">
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400">Order ID</span>
                <span className="font-mono font-medium text-gray-800 dark:text-gray-200 text-[11px]">
                  #{order._id?.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400">Items</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {order.items?.length} item(s)
                </span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400">Amount Paid</span>
                <span className="font-medium text-primary">
                  ₹{order.totalPrice?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400">Deliver to</span>
                <span className="font-medium text-gray-800 dark:text-gray-200 text-right max-w-[180px]">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-400">Status</span>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600
                                 dark:text-blue-400 text-[10px] font-medium
                                 px-2 py-0.5 rounded-full capitalize">
                  {order.orderStatus}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/orders')}
              className="w-full py-3 bg-primary text-white rounded-xl text-[13px]
                         font-medium hover:opacity-90 transition-opacity
                         flex items-center justify-center gap-2">
              <FiPackage size={15} /> Track My Orders
            </button>
            <button onClick={() => navigate('/products')}
              className="w-full py-2.5 text-[13px] font-medium
                         text-gray-500 dark:text-gray-400 hover:text-primary
                         transition-colors flex items-center justify-center gap-1">
              <FiShoppingBag size={14} /> Continue Shopping
              <FiArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}