import axios from 'axios';
import type { Supplier, NewSupplier } from '../types';
const API_BASE = process.env.REACT_APP_API_URL || 'https://erp-inventory-system-be-production.up.railway.app';

const API_BASE_URL = `${API_BASE}/api/v1`;

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

export const supplierApiService = {
    getSuppliers: () => axiosInstance.get<Supplier[]>('/suppliers'),
    createSupplier: (supplierData: NewSupplier) => axiosInstance.post<Supplier>('/suppliers', supplierData),
    updateSupplier: (supplier: Supplier) => axiosInstance.put<Supplier>(`/suppliers/${supplier.id}`, supplier),
    deleteSupplier: (id: number) => axiosInstance.delete<void>(`/suppliers/${id}`),
};
