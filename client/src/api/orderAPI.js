import API from './axios';
export const createRazorpayOrderAPI = (amount) => API.post('/orders/create-razorpay-order', { amount });
export const placeOrderAPI          = (data)   => API.post('/orders/place', data);
export const getMyOrdersAPI         = ()       => API.get('/orders/my-orders');
export const getOrderByIdAPI        = (id)     => API.get(`/orders/${id}`);