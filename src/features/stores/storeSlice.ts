import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { storeApiService } from '../../services/storeApiService';
import type { Store, NewStore } from '../../types';
import type { RootState } from '../../app/store';

interface StoreState {
    items: Store[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: StoreState = {
    items: [],
    status: 'idle',
    error: null,
};

// --- No changes to async thunks ---
export const fetchStores = createAsyncThunk('stores/fetchStores', async (_, { rejectWithValue }) => {
    try {
        const response = await storeApiService.getStores();
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch stores');
    }
});

export const addNewStore = createAsyncThunk('stores/addNewStore', async (newStore: NewStore, { rejectWithValue }) => {
    try {
        const response = await storeApiService.createStore(newStore);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create store');
    }
});

export const updateExistingStore = createAsyncThunk('stores/updateExistingStore', async (store: Store, { rejectWithValue }) => {
    try {
        const response = await storeApiService.updateStore(store);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update store');
    }
});

export const deleteExistingStore = createAsyncThunk('stores/deleteExistingStore', async (id: number, { rejectWithValue }) => {
    try {
        await storeApiService.deleteStore(id);
        return id;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete store');
    }
});

export const storeSlice = createSlice({
    name: 'stores',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // --- Fetch Stores ---
            .addCase(fetchStores.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchStores.fulfilled, (state, action: PayloadAction<Store[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchStores.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // --- Add, Update, Delete ---
            .addCase(addNewStore.fulfilled, (state, action: PayloadAction<Store>) => {
                state.items.push(action.payload);
            })
            .addCase(updateExistingStore.fulfilled, (state, action: PayloadAction<Store>) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteExistingStore.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            // --- Generic Pending/Rejected Handlers for Toasts ---
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.status = 'loading';
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload as string;
                }
            );
    },
});

export const selectAllStores = (state: RootState) => state.stores.items;

export default storeSlice.reducer;
