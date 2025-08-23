import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { purchaseOrderApiService } from '../../services/purchaseOrderApiService';
import type { PurchaseOrder, NewPurchaseOrder, Payment } from '../../types';
import { OrderStatus } from '../../types';
import type { RootState } from '../../app/store';

interface PurchaseOrderState {
    items: PurchaseOrder[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PurchaseOrderState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchPurchaseOrders = createAsyncThunk('purchaseOrders/fetch', async (_, { rejectWithValue }) => {
    try {
        const response = await purchaseOrderApiService.getPurchaseOrders();
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch purchase orders');
    }
});

export const addNewPurchaseOrder = createAsyncThunk('purchaseOrders/create', async (order: NewPurchaseOrder, { rejectWithValue }) => {
    try {
        const response = await purchaseOrderApiService.createPurchaseOrder(order);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create purchase order');
    }
});

export const receiveOrder = createAsyncThunk('purchaseOrders/receive', async ({ id, warehouseId }: { id: number, warehouseId: number }, { rejectWithValue, dispatch }) => {
    try {
        await purchaseOrderApiService.receivePurchaseOrder(id, warehouseId);
        await dispatch(fetchPurchaseOrders()); // Refetch to get updated order status
        return { id };
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to receive order');
    }
});

export const processPayment = createAsyncThunk('purchaseOrders/pay', async ({ id, paymentData }: { id: number, paymentData: Payment }, { rejectWithValue, dispatch }) => {
    try {
        await purchaseOrderApiService.makePayment(id, paymentData);
        await dispatch(fetchPurchaseOrders()); // Refetch to get updated order status
        return { id };
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to process payment');
    }
});


const purchaseOrderSlice = createSlice({
    name: 'purchaseOrders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPurchaseOrders.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchPurchaseOrders.fulfilled, (state, action: PayloadAction<PurchaseOrder[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchPurchaseOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(addNewPurchaseOrder.fulfilled, (state, action: PayloadAction<PurchaseOrder>) => {
                state.items.push(action.payload);
            });
    },
});

export const selectAllPurchaseOrders = (state: RootState) => state.purchaseOrders.items;

export default purchaseOrderSlice.reducer;
