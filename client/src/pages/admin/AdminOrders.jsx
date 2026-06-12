import { useState, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getAllOrdersAPI, updateOrderStatusAPI } from '../../api/adminAPI';

const STATUSES = ['all','processing','confirmed','shipped','out_for_delivery','delivered','cancelled'];
const STATUS_STYLE = {
  processing:      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  confirmed:       'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  shipped:         'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  out_for_delivery:'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  delivered:       'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  cancelled:       'bg-red-100 dark:bg-red-900/30 text-red-500',
};

export default function AdminOrders() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [updating, setUpdating] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await getAllOrdersAPI();
      setOrders(data);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      await updateOrderStatusAPI(orderId, newStatus);
      setOrders(prev => prev.map(o =>
        o._id === orderId ? { ...o, orderStatus: newStatus } : o
      ));
      toast.success('Status updated!');
    } catch { toast.error('Failed to update'); }
    finally { setUpdating(null); }
  };

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.orderStatus === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Orders
          </h1>
          <p className="text-[13px] text-gray-400 mt-0.5">
            {orders.length} orders total
          </p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap mb-4">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-medium
                        capitalize transition-all border
              ${filter === s
                ? 'bg-primary text-white border-primary'
                : 'border-gray-200 dark:border-white/[0.08] text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary'}`}>
            {s === 'all' ? 'All Orders' : s.replace('_', ' ')}
            {s !== 'all' && (
              <span className="ml-1 text-[10px] opacity-70">
                ({orders.filter(o => o.orderStatus === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white dark:bg-[#0E0E22] rounded-2xl
                      border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent
                            rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 dark:border-white/[0.06]">
                <tr>
                  {['Order ID','Customer','Items','Total','Date','Status','Update'].map(h => (
                    <th key={h}
                      className="text-left py-3 px-4 text-[11px] font-medium
                                 text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order._id}
                    className="border-b border-gray-50 dark:border-white/[0.03]
                               hover:bg-gray-50 dark:hover:bg-white/[0.02]
                               transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px]
                                   text-gray-500 dark:text-gray-400">
                      #{order._id?.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[12px] font-medium text-gray-900
                                    dark:text-white">
                        {order.user?.name || 'N/A'}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {order.user?.email}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-[12px] text-gray-600
                                   dark:text-gray-400">
                      {order.items?.length} item(s)
                    </td>
                    <td className="py-3 px-4 text-[13px] font-medium text-primary">
                      ₹{order.totalPrice?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN',
                        { day:'numeric', month:'short', year:'numeric' })}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-medium px-2 py-0.5
                                        rounded-full capitalize whitespace-nowrap
                                        ${STATUS_STYLE[order.orderStatus]}`}>
                        {order.orderStatus?.replace('_',' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.orderStatus}
                        disabled={updating === order._id ||
                                  order.orderStatus === 'delivered' ||
                                  order.orderStatus === 'cancelled'}
                        onChange={e => handleStatusUpdate(order._id, e.target.value)}
                        className="text-[11px] px-2 py-1.5 rounded-lg
                                   bg-gray-50 dark:bg-[#14142A]
                                   border border-gray-200 dark:border-white/[0.08]
                                   text-gray-700 dark:text-gray-300
                                   outline-none focus:border-primary
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   transition-colors">
                        {['processing','confirmed','shipped',
                          'out_for_delivery','delivered','cancelled'].map(s => (
                          <option key={s} value={s}>
                            {s.replace('_',' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center py-10 text-[13px] text-gray-400">
                No orders found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}