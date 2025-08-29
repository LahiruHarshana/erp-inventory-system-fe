import axios from 'axios';
import type { SalesOrder, PlaceSalesOrder, Payment, SalesStatus } from '../types';

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

export const salesOrderApiService = {
    getSalesOrders: () => axiosInstance.get<SalesOrder[]>('/sales-orders'),
    placeSalesOrder: (orderData: PlaceSalesOrder) => axiosInstance.post<SalesOrder>('/sales-orders', orderData),
    shipSalesOrder: (id: number) => axiosInstance.post<void>(`/sales-orders/${id}/ship`),
    processPayment: (id: number, paymentData: Payment) => axiosInstance.post<void>(`/sales-orders/${id}/payment`, paymentData),
    updateSalesOrderStatus: (id: number, status: SalesStatus) => axiosInstance.put<SalesOrder>(`/sales-orders/${id}/status`, null, { params: { status } }),
};
