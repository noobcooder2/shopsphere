import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiShoppingCart, FiPackage, FiUsers } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip,
         ResponsiveContainer, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';
import { getAdminStatsAPI } from '../../api/adminAPI';

const STATUS_STYLE = {
  processing:      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  confirmed:       'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  shipped:         'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  out_for_delivery:'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  delivered:       'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  cancelled:       'bg-red-100 dark:bg-red-900/30 text-red-500',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStatsAPI()
      .then(({ data }) => setStats(data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  const CARDS = stats ? [
    { label:'Total Revenue', value:`₹${stats.totalRevenue?.toLocaleString('en-IN')}`,
      icon:FiDollarSign, color:'text-green-500',  bg:'bg-green-100 dark:bg-green-900/30' },
    { label:'Total Orders',  value:stats.totalOrders,
      icon:FiShoppingCart, color:'text-blue-500',  bg:'bg-blue-100 dark:bg-blue-900/30' },
    { label:'Total Products',value:stats.totalProducts,
      icon:FiPackage,      color:'text-purple-500', bg:'bg-purple-100 dark:bg-purple-900/30' },
    { label:'Total Users',   value:stats.totalUsers,
      icon:FiUsers,        color:'text-amber-500', bg:'bg-amber-100 dark:bg-amber-900/30' },
  ] : [];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent
                      rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-1">
        Dashboard
      </h1>
      <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-6">
        Welcome back! Here's what's happening.
      </p>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {CARDS.map(({ label, value, icon:Icon, color, bg }) => (
          <div key={label}
            className="bg-white dark:bg-[#0E0E22] rounded-2xl
                       border border-gray-100 dark:border-white/[0.06] p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center
                             justify-center mb-3`}>
              <Icon className={color} size={20} />
            </div>
            <p className="text-2xl font-medium text-gray-900 dark:text-white mb-0.5">
              {value}
            </p>
            <p className="text-[12px] text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0E0E22] rounded-2xl
                        border border-gray-100 dark:border-white/[0.06] p-5">
          <h2 className="text-[15px] font-medium text-gray-900 dark:text-white mb-1">
            Revenue — Last 7 Days
          </h2>
          <p className="text-[12px] text-gray-400 mb-4">Daily revenue overview</p>
          {stats?.chartData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.chartData}
                margin={{ top:0, right:0, left:-20, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3"
                  stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="_id" tick={{ fontSize:11, fill:'#9CA3AF' }}
                  axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#9CA3AF' }}
                  axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background:'#1E293B', border:'none',
                    borderRadius:'10px', fontSize:'12px', color:'#fff'
                  }}
                  formatter={(v) => [`₹${v?.toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#6366F1"
                  radius={[6,6,0,0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-[13px] text-gray-400">
                No orders in the last 7 days
              </p>
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="bg-white dark:bg-[#0E0E22] rounded-2xl
                        border border-gray-100 dark:border-white/[0.06] p-5">
          <h2 className="text-[15px] font-medium text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            {[
              { label:'Manage Products', path:'/admin/products',
                color:'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
              { label:'View All Orders', path:'/admin/orders',
                color:'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
              { label:'Go to Store',    path:'/products',
                color:'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
            ].map(({ label, path, color }) => (
              <button key={label} onClick={() => navigate(path)}
                className={`w-full text-left px-4 py-3 rounded-xl text-[13px]
                            font-medium transition-all hover:scale-[1.01] ${color}`}>
                {label} →
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="mt-4 bg-white dark:bg-[#0E0E22] rounded-2xl
                      border border-gray-100 dark:border-white/[0.06] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-medium text-gray-900 dark:text-white">
            Recent Orders
          </h2>
          <button onClick={() => navigate('/admin/orders')}
            className="text-[12px] text-primary hover:opacity-80 transition-opacity">
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                {['Order ID','Customer','Total','Status','Date'].map(h => (
                  <th key={h}
                    className="text-left py-2 px-3 text-[11px] font-medium
                               text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map(order => (
                <tr key={order._id}
                  className="border-b border-gray-50 dark:border-white/[0.03]
                             hover:bg-gray-50 dark:hover:bg-white/[0.02]
                             transition-colors">
                  <td className="py-3 px-3 font-mono text-[11px]
                                 text-gray-600 dark:text-gray-400">
                    #{order._id?.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-[12px] font-medium text-gray-800
                                  dark:text-gray-200">
                      {order.user?.name || 'N/A'}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {order.user?.email}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-[13px] font-medium text-primary">
                    ₹{order.totalPrice?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5
                                      rounded-full capitalize
                                      ${STATUS_STYLE[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!stats?.recentOrders?.length && (
            <p className="text-center py-8 text-[13px] text-gray-400">
              No orders yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}