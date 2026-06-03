import API from './axios';
export const getProductsAPI   = (params) => API.get('/products', { params });
export const getProductByIdAPI = (id)    => API.get(`/products/${id}`);