import axios from 'axios';
import type { Store, NewStore } from '../types';

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

export const storeApiService = {
    /**
     * Fetches all stores from the backend.
     * Corresponds to: GET /stores
     */
    getStores: () => axiosInstance.get<Store[]>('/stores'),

    /**
     * Creates a new store.
     * Corresponds to: POST /stores
     */


    createStore: (storeData: NewStore) => axiosInstance.post<Store>('/stores', storeData),

    /**
     * Updates an existing store by its ID.
     * Corresponds to: PUT /stores/{id}
     */
    updateStore: (store: Store) => axiosInstance.put<Store>(`/stores/${store.id}`, store),

    /**
     * Deletes a store by its ID.
     * Corresponds to: DELETE /stores/{id}
     */
    deleteStore: (id: number) => axiosInstance.delete<void>(`/stores/${id}`),
};
