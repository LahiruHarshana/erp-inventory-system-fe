import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { warehouseApiService } from '../../services/warehouseApiService';
import type { Warehouse, NewWarehouse } from '../../types';
import type { RootState } from '../../app/store';

interface WarehouseState {
    items: Warehouse[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: WarehouseState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchWarehouses = createAsyncThunk('warehouses/fetchWarehouses', async (_, { rejectWithValue }) => {
    try {
        const response = await warehouseApiService.getWarehouses();
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch warehouses');
    }
});

export const addNewWarehouse = createAsyncThunk('warehouses/addNewWarehouse', async (newWarehouse: NewWarehouse, { rejectWithValue }) => {
    try {
        const response = await warehouseApiService.createWarehouse(newWarehouse);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create warehouse');
    }
});

export const updateExistingWarehouse = createAsyncThunk('warehouses/updateExistingWarehouse', async (warehouse: Warehouse, { rejectWithValue }) => {
    try {
        const response = await warehouseApiService.updateWarehouse(warehouse);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update warehouse');
    }
});

export const deleteExistingWarehouse = createAsyncThunk('warehouses/deleteExistingWarehouse', async (id: number, { rejectWithValue }) => {
    try {
        await warehouseApiService.deleteWarehouse(id);
        return id;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete warehouse');
    }
});

const warehouseSlice = createSlice({
    name: 'warehouses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWarehouses.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchWarehouses.fulfilled, (state, action: PayloadAction<Warehouse[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchWarehouses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(addNewWarehouse.pending, (state) => {
                state.error = null;
            })
            .addCase(addNewWarehouse.fulfilled, (state, action: PayloadAction<Warehouse>) => {
                state.items.push(action.payload);
            })
            .addCase(addNewWarehouse.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(updateExistingWarehouse.pending, (state) => {
                state.error = null;
            })
            .addCase(updateExistingWarehouse.fulfilled, (state, action: PayloadAction<Warehouse>) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateExistingWarehouse.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(deleteExistingWarehouse.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteExistingWarehouse.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(deleteExistingWarehouse.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const selectAllWarehouses = (state: RootState) => state.warehouses.items;

export default warehouseSlice.reducer;
