import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { supplierApiService } from '../../services/supplierApiService';
import type { Supplier, NewSupplier } from '../../types';
import type { RootState } from '../../app/store';

interface SupplierState {
    items: Supplier[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: SupplierState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchSuppliers = createAsyncThunk('suppliers/fetchSuppliers', async (_, { rejectWithValue }) => {
    try {
        const response = await supplierApiService.getSuppliers();
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch suppliers');
    }
});

export const addNewSupplier = createAsyncThunk('suppliers/addNewSupplier', async (newSupplier: NewSupplier, { rejectWithValue }) => {
    try {
        const response = await supplierApiService.createSupplier(newSupplier);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create supplier');
    }
});

export const updateExistingSupplier = createAsyncThunk('suppliers/updateExistingSupplier', async (supplier: Supplier, { rejectWithValue }) => {
    try {
        const response = await supplierApiService.updateSupplier(supplier);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update supplier');
    }
});

export const deleteExistingSupplier = createAsyncThunk('suppliers/deleteExistingSupplier', async (id: number, { rejectWithValue }) => {
    try {
        await supplierApiService.deleteSupplier(id);
        return id;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete supplier');
    }
});

const supplierSlice = createSlice({
    name: 'suppliers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuppliers.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchSuppliers.fulfilled, (state, action: PayloadAction<Supplier[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchSuppliers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(addNewSupplier.fulfilled, (state, action: PayloadAction<Supplier>) => {
                state.items.push(action.payload);
            })
            .addCase(updateExistingSupplier.fulfilled, (state, action: PayloadAction<Supplier>) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) { state.items[index] = action.payload; }
            })
            .addCase(deleteExistingSupplier.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    },
});

export const selectAllSuppliers = (state: RootState) => state.suppliers.items;

export default supplierSlice.reducer;
