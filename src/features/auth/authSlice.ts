import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import authApiService from '../../services/authApiService';
import type { AuthenticationRequest, RegisterRequest, User, AuthenticationResponse } from '../../types';

interface AuthState {
    user: User | null;
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Helper function to safely parse JSON from localStorage
const getUserFromStorage = (): User | null => {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    try {
        return JSON.parse(userString) as User;
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        return null;
    }
};

const initialState: AuthState = {
    user: getUserFromStorage(),
    token: localStorage.getItem('token'),
    status: 'idle',
    error: null,
};

export const registerUser = createAsyncThunk<unknown, RegisterRequest, { rejectValue: string }>(
    'auth/registerUser',
    async (userData: RegisterRequest, { rejectWithValue }) => {
        try {
            console.log('Registering user with data:', userData);
            const response = await authApiService.register(userData);
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Registration failed');
        }
    }
);

export const loginUser = createAsyncThunk<User, AuthenticationRequest, { rejectValue: string }>(
    'auth/loginUser',
    async (loginData: AuthenticationRequest, { rejectWithValue }) => {
        try {
            const response = await authApiService.authenticate(loginData);
            const authResponse: AuthenticationResponse = response.data;

            // **FIX:** Create the payload with firstname and lastname to match the User type.
            const userPayload: User = {
                token: authResponse.token,
                role: authResponse.role,
                email: loginData.email,
                name:authResponse.firstname,
            };

            localStorage.setItem('token', userPayload.token);
            localStorage.setItem('user', JSON.stringify(userPayload));

            return userPayload;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Login failed');
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
                // **FIX:** Provide a fallback to null if the payload is undefined.
                state.error = action.payload || null;
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                // **FIX:** Provide a fallback to null if the payload is undefined.
                state.error = action.payload || null;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
