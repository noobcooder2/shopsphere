import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiMapPin, FiPhone, FiUser, FiArrowLeft, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getCartAPI } from '../api/cartAPI';
import { createRazorpayOrderAPI, placeOrderAPI } from '../api/orderAPI';
import { setCart, clearCart } from '../slices/cartSlice';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Chandigarh',
  'Jammu and Kashmir','Ladakh','Puducherry',
];

const Field = ({ label, name, value, onChange, placeholder, type='text', icon:Icon }) => (
  <div>
    <label className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
      {label} <span className="text-red-400">*</span>
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />}
      <input type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-9' : 'pl-4'} pr-4 py-2.5 rounded-xl text-[13px]
                   bg-gray-50 dark:bg-[#14142A]
                   border border-gray-200 dark:border-white/[0.08]
                   text-gray-800 dark:text-gray-200 placeholder-gray-400
                   outline-none focus:border-primary transition-colors`} />
    </div>
  </div>
);

export default function CheckoutPage() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { user }  = useSelector(s => s.auth);
  const { items, totalPrice } = useSelector(s => s.cart);

  const [payLoading,  setPayLoading]  = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [addr, setAddr] = useState({
    fullName: user?.name || '', phone: '',
    addressLine: '', city: '', state: '', pincode: '',
  });

  useEffect(() => {
    if (!user) { navigate('/login', { state: { from: '/checkout' } }); return; }
    if (items.length === 0) {
      setCartLoading(true);
      getCartAPI()
        .then(({ data }) => { dispatch(setCart(data)); if (!data.items?.length) navigate('/cart'); })
        .catch(() => navigate('/cart'))
        .finally(() => setCartLoading(false));
    }
  }, []);

  const shipping   = totalPrice > 0 && totalPrice < 499 ? 49 : 0;
  const finalTotal = totalPrice + shipping;

  const onChange = e => setAddr({ ...addr, [e.target.name]: e.target.value });

  const validate = () => {
    const { fullName, phone, addressLine, city, state, pincode } = addr;
    if (!fullName || !phone || !addressLine || !city || !state || !pincode)
      return toast.error('Fill all address fields'), false;
    if (!/^\d{10}$/.test(phone))
      return toast.error('Enter valid 10-digit phone number'), false;
    if (!/^\d{6}$/.test(pincode))
      return toast.error('Enter valid 6-digit pincode'), false;
    return true;
  };

  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const handlePayment = async () => {
    if (!validate()) return;
    try {
      setPayLoading(true);
      const ok = await loadRazorpay();
      if (!ok) { toast.error('Payment gateway failed to load'); return; }

      const { data: rzp } = await createRazorpayOrderAPI(finalTotal);

      new window.Razorpay({
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      rzp.amount,
        currency:    'INR',
        name:        'ShopSphere',
        description: `${items.length} item(s)`,
        order_id:    rzp.razorpayOrderId,
        prefill:     { name: addr.fullName, contact: addr.phone, email: user.email },
        theme:       { color: '#6366F1' },
        handler: async (res) => {
          try {
            const { data: order } = await placeOrderAPI({
              shippingAddress: addr,
              paymentMethod:       'Razorpay',
              razorpayOrderId:     res.razorpay_order_id,
              razorpayPaymentId:   res.razorpay_payment_id,
              razorpaySignature:   res.razorpay_signature,
            });
            dispatch(clearCart());
            toast.success('Order placed! 🎉');
            navigate(`/order-success/${order._id}`);
          } catch { toast.error('Order failed. Contact support.'); }
        },
        modal: { ondismiss: () => { toast.error('Payment cancelled'); setPayLoading(false); } },
      }).open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally { setPayLoading(false); }
  };

  if (cartLoading) return (
    <div className="page-bg min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">

        <button onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-[13px] text-gray-500
                     dark:text-gray-400 hover:text-primary transition-colors mb-6">
          <FiArrowLeft size={16} /> Back to Cart
        </button>
        <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Address form ── */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-[#0E0E22] rounded-2xl
                            border border-gray-100 dark:border-white/[0.06] p-6">
              <div className="flex items-center gap-2 mb-6">
                <FiMapPin className="text-primary" size={18} />
                <h2 className="text-[16px] font-medium text-gray-900 dark:text-white">
                  Delivery Address
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name"     name="fullName"    value={addr.fullName}
                  onChange={onChange} placeholder="John Doe" icon={FiUser} />
                <Field label="Phone Number"  name="phone"       value={addr.phone}
                  onChange={onChange} placeholder="10-digit number" icon={FiPhone} type="tel" />
                <div className="sm:col-span-2">
                  <Field label="Address Line" name="addressLine" value={addr.addressLine}
                    onChange={onChange} placeholder="House no, Street, Area, Landmark"
                    icon={FiMapPin} />
                </div>
                <Field label="City" name="city" value={addr.city}
                  onChange={onChange} placeholder="City" />
                <div>
                  <label className="text-[12px] font-medium text-gray-500
                                    dark:text-gray-400 mb-1.5 block">
                    State <span className="text-red-400">*</span>
                  </label>
                  <select name="state" value={addr.state} onChange={onChange}
                    className="w-full px-4 py-2.5 rounded-xl text-[13px]
                               bg-gray-50 dark:bg-[#14142A]
                               border border-gray-200 dark:border-white/[0.08]
                               text-gray-800 dark:text-gray-200
                               outline-none focus:border-primary transition-colors">
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <Field label="Pincode" name="pincode" value={addr.pincode}
                  onChange={onChange} placeholder="6-digit pincode" type="tel" />
              </div>
            </div>

            {/* Test mode notice */}
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20
                            border border-amber-200 dark:border-amber-800 rounded-xl">
              <p className="text-[12px] text-amber-700 dark:text-amber-400 font-medium mb-1">
                🧪 Razorpay Test Mode — use these card details:
              </p>
              <p className="text-[11px] text-amber-600 dark:text-amber-500 font-mono leading-relaxed">
                Card: 4111 1111 1111 1111<br />
                Expiry: Any future date (e.g. 12/26) · CVV: Any 3 digits
              </p>
            </div>
          </div>

          {/* ── Order summary ── */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#0E0E22] rounded-2xl
                            border border-gray-100 dark:border-white/[0.06] p-6 sticky top-20">
              <h2 className="text-[16px] font-medium text-gray-900 dark:text-white mb-5">
                Order Summary
              </h2>

              {/* Items list */}
              <div className="space-y-3 mb-5 max-h-52 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.product?._id || item.product}
                    className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-[#14142A] rounded-xl
                                    flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image
                        ? <img src={item.image} alt={item.name}
                            className="w-full h-full object-cover" />
                        : <span className="text-xl">🛍️</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-gray-800 dark:text-gray-200
                                    line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[13px] font-medium text-gray-900 dark:text-white shrink-0">
                      ₹{(item.price * item.quantity)?.toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 dark:border-white/[0.06]
                              pt-4 space-y-2.5 mb-5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{totalPrice?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                  <span className={`font-medium ${shipping===0 ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="border-t border-gray-100 dark:border-white/[0.06]
                                pt-2.5 flex justify-between">
                  <span className="text-[15px] font-medium text-gray-900 dark:text-white">Total</span>
                  <span className="text-[15px] font-medium text-primary">
                    ₹{finalTotal?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button onClick={handlePayment}
                disabled={payLoading || items.length === 0}
                className="w-full py-3.5 bg-primary text-white rounded-xl text-[14px]
                           font-medium hover:opacity-90 transition-opacity
                           flex items-center justify-center gap-2
                           disabled:opacity-60 disabled:cursor-not-allowed">
                {payLoading
                  ? <><span className="w-4 h-4 border-2 border-white
                                        border-t-transparent rounded-full animate-spin" />
                     Processing...</>
                  : <><FiLock size={15} /> Pay ₹{finalTotal?.toLocaleString('en-IN')}</>}
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-3">
                <FiLock size={11} className="text-gray-400" />
                <p className="text-[11px] text-gray-400">Secured by Razorpay · 256-bit SSL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}