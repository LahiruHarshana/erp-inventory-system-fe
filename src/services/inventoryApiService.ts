import axios from 'axios';
import type { Inventory } from '../types';

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
});

export const inventoryApiService = {
    getInventoryByWarehouse: (warehouseId: number) =>
        axiosInstance.get<Inventory[]>(`/inventory/warehouse/${warehouseId}`),
};
