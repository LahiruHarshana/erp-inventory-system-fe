import axios from 'axios';
import type { Warehouse, NewWarehouse } from '../types';

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

export const warehouseApiService = {
    getWarehouses: () => axiosInstance.get<Warehouse[]>('/warehouses'),
    createWarehouse: (warehouseData: NewWarehouse) => axiosInstance.post<Warehouse>('/warehouses', warehouseData),
    updateWarehouse: (warehouse: Warehouse) => axiosInstance.put<Warehouse>(`/warehouses/${warehouse.id}`, warehouse),
    deleteWarehouse: (id: number) => axiosInstance.delete<void>(`/warehouses/${id}`),
};
