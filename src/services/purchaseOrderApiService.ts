import axios from 'axios';
import type { PurchaseOrder, NewPurchaseOrder, Payment } from '../types';
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

export const purchaseOrderApiService = {
    getPurchaseOrders: () => axiosInstance.get<PurchaseOrder[]>('/purchase-orders'),
    createPurchaseOrder: (orderData: NewPurchaseOrder) => axiosInstance.post<PurchaseOrder>('/purchase-orders', orderData),
    updateOrderStatus: (id: number, status: OrderStatus) => axiosInstance.put<PurchaseOrder>(`/purchase-orders/${id}/status`, null, { params: { status } }),
    receivePurchaseOrder: (id: number, warehouseId: number) => axiosInstance.post<void>(`/purchase-orders/${id}/receive`, null, { params: { warehouseId } }),
    makePayment: (id: number, paymentData: Payment) => axiosInstance.post<void>(`/purchase-orders/${id}/payment`, paymentData),
};
