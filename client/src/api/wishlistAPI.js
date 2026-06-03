import API from './axios';
export const getWishlistAPI    = ()          => API.get('/wishlist');
export const toggleWishlistAPI = (productId) => API.post('/wishlist/toggle', { productId });