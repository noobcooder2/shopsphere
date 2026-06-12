import API from './axios';
export const getAdminStatsAPI     = ()           => API.get('/admin/stats');
export const updateOrderStatusAPI = (id, status) => API.put(`/orders/${id}/status`, { orderStatus: status });
export const createProductAPI     = (data)       => API.post('/products', data);
export const updateProductAPI     = (id, data)   => API.put(`/products/${id}`, data);
export const deleteProductAPI     = (id)         => API.delete(`/products/${id}`);
export const getAllOrdersAPI       = ()           => API.get('/orders/all');