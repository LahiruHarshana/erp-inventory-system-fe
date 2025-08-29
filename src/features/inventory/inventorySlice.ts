import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { inventoryApiService } from '../../services/inventoryApiService';
import type { Inventory } from '../../types';
import type { RootState } from '../../app/store';

interface InventoryState {
    items: Inventory[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: InventoryState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchInventoryByWarehouse = createAsyncThunk(
    'inventory/fetchByWarehouse',
    async (warehouseId: number, { rejectWithValue }) => {
        if (!warehouseId) return []; // Don't fetch if no warehouse is selected
        try {
            const response = await inventoryApiService.getInventoryByWarehouse(warehouseId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory');
        }
    }
);

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInventoryByWarehouse.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchInventoryByWarehouse.fulfilled, (state, action: PayloadAction<Inventory[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchInventoryByWarehouse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const selectAllInventory = (state: RootState) => state.inventory.items;

export default inventorySlice.reducer;
