import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { storeApiService } from '../../services/storeApiService'; 
import type { Store } from '../../types';

interface StoreState {
    items: Store[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialStoreState: StoreState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchStores = createAsyncThunk('stores/fetchStores', async (_, { rejectWithValue }) => {
    try {
        const response = await storeApiService.getStores();
        return response.data;
    } catch (error: any) { 
        return rejectWithValue(error.response?.data?.message || error.message); 
    }
});
// ... other store thunks (addNewStore, etc.) would go here ...

export const storeSlice = createSlice({
    name: 'stores',
    initialState: initialStoreState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStores.pending, (state) => { 
                state.status = 'loading'; 
            })
            .addCase(fetchStores.fulfilled, (state, action: PayloadAction<Store[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchStores.rejected, (state, action) => { 
                state.status = 'failed'; 
                state.error = action.payload as string; 
            });
    },
});

export default storeSlice.reducer;