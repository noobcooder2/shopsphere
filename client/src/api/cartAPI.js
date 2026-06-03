import API from './axios';
export const getCartAPI      = ()                     => API.get('/cart');
export const addToCartAPI    = (productId, quantity)  => API.post('/cart/add', { productId, quantity });
export const updateCartAPI   = (productId, quantity)  => API.put('/cart/update', { productId, quantity });
export const removeFromCartAPI = (productId)          => API.delete(`/cart/remove/${productId}`);
export const clearCartAPI    = ()                     => API.delete('/cart/clear');