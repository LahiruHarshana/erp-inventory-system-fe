import axios from 'axios';
import type { Product, NewProduct } from '../types';
// const API_BASE = process.env.REACT_APP_API_URL || 'https://erp-inventory-system-be-production.up.railway.app';
//
// const API_BASE_URL = `${API_BASE}/api/v1`;

const API_BASE_URL = 'http://localhost:8080/api/v1';


const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const productApiService = {
    getProducts: () => axiosInstance.get<Product[]>('/products'),
    createProduct: (productData: NewProduct) => axiosInstance.post<Product>('/products', productData),
    updateProduct: (product: Product) => axiosInstance.put<Product>(`/products/${product.id}`, product),
    deleteProduct: (id: number) => axiosInstance.delete<void>(`/products/${id}`),
};
