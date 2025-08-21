import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import authApiService from '../../services/authApiService';
import type { AuthenticationRequest, RegisterRequest, User } from '../../types';

interface AuthState {
    user: User | null;
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Attempt to load user and token from localStorage on initial load
const userFromStorage = localStorage.getItem('user');
const tokenFromStorage = localStorage.getItem('token');

const initialState: AuthState = {
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    token: tokenFromStorage,
    status: 'idle',
    error: null,
};

// --- MODIFICATION 1: Update registerUser Thunk ---
// The thunk should just make the API call and return the response on success.
// It should not log the user in or set localStorage.
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData: RegisterRequest, { rejectWithValue }) => {
        try {
            // Simply make the API call and let the component know it succeeded.
            const response = await authApiService.register(userData);
            // On success, we can return the server's response data if needed,
            // but we won't use it to set the state.
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
            // In a real app, decode the JWT to get user details like role
            // For now, we'll mock it. You should replace this with a library like jwt-decode
            const decodedToken = { role: 'BUSINESS_OWNER' }; // Replace with actual decoding logic
            const userPayload = { token: response.data.token, role: decodedToken.role, email: userData.email };
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
            // --- MODIFICATION 2: Update registerUser.fulfilled Reducer ---
            // On successful registration, just update the status. DO NOT set user/token.
            // This ensures the user remains logged out.
            .addCase(registerUser.fulfilled, (state) => {
                state.status = 'succeeded';
                // Note: We are NOT changing state.user or state.token here.
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