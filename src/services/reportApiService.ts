import axios from 'axios';
import type { InventorySummary, LowStockItem, PurchaseOrderHistory } from '../types';
import { OrderStatus } from '../types';

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

interface PurchaseOrderFilter {
    startDate?: string;
    endDate?: string;
    supplierId?: number;
    status?: OrderStatus;
}

export const reportApiService = {
    getInventorySummary: () => axiosInstance.get<InventorySummary>('/reports/inventory-summary'),
    getPurchaseOrderHistory: (filters: PurchaseOrderFilter) => axiosInstance.get<PurchaseOrderHistory>('/reports/purchase-orders', { params: filters }),
    getLowStockReport: (threshold?: number) => axiosInstance.get<LowStockItem[]>('/reports/low-stock', { params: { threshold } }),
};
