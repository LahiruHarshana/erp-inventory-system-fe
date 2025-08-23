import axios from 'axios';
import type { AuthenticationRequest, AuthenticationResponse, RegisterRequest } from '../types';

const API_URL = 'erp-inventory-system-be.railway.internal/api/v1/auth';

const authApiService = {
    register: (data: RegisterRequest): Promise<{ data: AuthenticationResponse }> => {
        console.log(data);
        
        return axios.post(`${API_URL}/register`, data);
    },
    authenticate: (data: AuthenticationRequest): Promise<{ data: AuthenticationResponse }> => {
        return axios.post(`${API_URL}/authenticate`, data);
    },
};

export default authApiService;