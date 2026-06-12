import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiMapPin, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getOrderByIdAPI } from '../api/orderAPI';

const STEPS  = ['processing','confirmed','shipped','out_for_delivery','delivered'];
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

export default function OrderDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [order,  setOrder]  = useState(null);
  const [loading,setLoading]= useState(true);

  useEffect(() => {
    getOrderByIdAPI(id)
      .then(({ data }) => setOrder(data))
      .catch(() => { toast.error('Order not found'); navigate('/orders'); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="page-bg min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent
                      rounded-full animate-spin" />
    </div>
  );

  if (!order) return null;

  const stepIdx   = STEPS.indexOf(order.orderStatus);
  const cancelled = order.orderStatus === 'cancelled';

  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Back */}
        <button onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-[13px] text-gray-500
                     dark:text-gray-400 hover:text-primary transition-colors mb-6">
          <FiArrowLeft size={16} /> Back to Orders
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-1">
              Order Details
            </h1>
            <p className="text-[12px] font-mono text-gray-400">
              #{order._id?.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-gray-400 mb-1">
              {new Date(order.createdAt).toLocaleDateString('en-IN',
                { day:'numeric', month:'long', year:'numeric' })}
            </p>
            <span className={`text-[11px] font-medium px-3 py-1
                              rounded-full capitalize ${STATUS_STYLE[order.orderStatus]}`}>
              {LABELS[order.orderStatus]}
            </span>
          </div>
        </div>

        {/* Tracking stepper */}
        {!cancelled && (
          <div className="bg-white dark:bg-[#0E0E22] rounded-2xl
                          border border-gray-100 dark:border-white/[0.06] p-6 mb-4">
            <div className="flex items-center gap-1 mb-2">
              <FiPackage className="text-primary" size={16} />
              <h2 className="text-[14px] font-medium text-gray-900 dark:text-white">
                Order Tracking
              </h2>
            </div>
            <p className="text-[12px] text-gray-400 mb-5">
              Estimated delivery: 5–7 business days
            </p>
            <div className="flex items-start">
              {STEPS.map((step, i) => {
                const done   = i <= stepIdx;
                const active = i === stepIdx;
                const isLast = i === STEPS.length - 1;
                return (
                  <div key={step} className={`flex items-center ${!isLast ? 'flex-1' : ''}`}>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center
                                      justify-center text-[12px] font-bold shrink-0
                                      transition-all duration-300
                        ${active
                          ? 'bg-primary text-white ring-4 ring-primary/20'
                          : done
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 dark:bg-[#14142A] text-gray-400'}`}>
                        {done && !active ? '✓' : i + 1}
                      </div>
                      <p className={`text-[10px] mt-2 text-center w-16 leading-tight
                        ${done
                          ? 'text-gray-700 dark:text-gray-300 font-medium'
                          : 'text-gray-400'}`}>
                        {LABELS[step]}
                      </p>
                    </div>
                    {!isLast && (
                      <div className={`flex-1 h-0.5 mb-6 mx-1 transition-all
                        ${i < stepIdx ? 'bg-green-400' : 'bg-gray-100 dark:bg-[#14142A]'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order items */}
        <div className="bg-white dark:bg-[#0E0E22] rounded-2xl
                        border border-gray-100 dark:border-white/[0.06] p-6 mb-4">
          <h2 className="text-[14px] font-medium text-gray-900 dark:text-white mb-4">
            Items Ordered ({order.items?.length})
          </h2>
          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div key={i}
                className="flex gap-4 items-center pb-3
                           border-b border-gray-50 dark:border-white/[0.04] last:border-0">
                <div className="w-16 h-16 bg-gray-50 dark:bg-[#14142A] rounded-xl
                                flex items-center justify-center shrink-0 overflow-hidden">
                  {item.image
                    ? <img src={item.image} alt={item.name}
                        className="w-full h-full object-cover" />
                    : <span className="text-2xl">🛍️</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-gray-900 dark:text-white
                                line-clamp-1">{item.name}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
                  </p>
                </div>
                <p className="text-[14px] font-medium text-gray-900 dark:text-white shrink-0">
                  ₹{(item.price * item.quantity)?.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-gray-100 dark:border-white/[0.06]
                          mt-4 pt-4 flex justify-between">
            <span className="text-[15px] font-medium text-gray-900 dark:text-white">
              Total Paid
            </span>
            <span className="text-[15px] font-medium text-primary">
              ₹{order.totalPrice?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Shipping address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#0E0E22] rounded-2xl
                          border border-gray-100 dark:border-white/[0.06] p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiMapPin className="text-primary" size={15} />
              <h2 className="text-[13px] font-medium text-gray-900 dark:text-white">
                Delivery Address
              </h2>
            </div>
            <div className="text-[12px] text-gray-500 dark:text-gray-400 space-y-1">
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {order.shippingAddress?.fullName}
              </p>
              <p>{order.shippingAddress?.addressLine}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
              <p>Pincode: {order.shippingAddress?.pincode}</p>
              <p>📞 {order.shippingAddress?.phone}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0E0E22] rounded-2xl
                          border border-gray-100 dark:border-white/[0.06] p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiCreditCard className="text-primary" size={15} />
              <h2 className="text-[13px] font-medium text-gray-900 dark:text-white">
                Payment Info
              </h2>
            </div>
            <div className="text-[12px] text-gray-500 dark:text-gray-400 space-y-1.5">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-green-500 font-medium capitalize">
                  {order.paymentStatus}
                </span>
              </div>
              {order.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span>Payment ID</span>
                  <span className="font-mono text-[10px] text-gray-600 dark:text-gray-400">
                    {order.razorpayPaymentId?.slice(-12)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}