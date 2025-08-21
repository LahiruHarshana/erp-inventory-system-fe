import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import authApiService from '../../services/authApiService';
import type { AuthenticationRequest, RegisterRequest, User } from '../../types';

interface AuthState {
    user: User | null;
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const userFromStorage = localStorage.getItem('user');
const tokenFromStorage = localStorage.getItem('token');

const initialState: AuthState = {
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    token: tokenFromStorage,
    status: 'idle',
    error: null,
};
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData: RegisterRequest, { rejectWithValue }) => {
        try {
            console.log('Registering user with data:', userData);
            const response = await authApiService.register(userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData: AuthenticationRequest, { rejectWithValue }) => {
        try {
            const response = await authApiService.authenticate(userData);
            localStorage.setItem('token', response.data.token);
            const decodedToken = { role: 'BUSINESS_OWNER' };
            const userPayload = { token: response.data.token, role: response.data.role, email: userData.email };
            localStorage.setItem('user', JSON.stringify(userPayload));
            return userPayload;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;