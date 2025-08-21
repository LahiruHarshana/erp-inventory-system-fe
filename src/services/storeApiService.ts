import axios from 'axios';
import type { Store, NewStore } from '../types';

const STORE_API_URL = '/api/v1/stores';

// This function should be centralized in a real app
const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const storeApiService = {
    getStores: (): Promise<{ data: Store[] }> => axiosInstance.get(STORE_API_URL),
    createStore: (storeData: NewStore): Promise<{ data: Store }> => axiosInstance.post(STORE_API_URL, storeData),
    updateStore: (id: number, storeData: Partial<Store>): Promise<{ data: Store }> => axiosInstance.put(`${STORE_API_URL}/${id}`, storeData),
    deleteStore: (id: number): Promise<void> => axiosInstance.delete(`${STORE_API_URL}/${id}`),
};