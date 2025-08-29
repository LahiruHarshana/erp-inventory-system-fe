import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { salesOrderApiService } from '../../services/salesOrderApiService';
import type { SalesOrder, PlaceSalesOrder, Payment } from '../../types';
import type { RootState } from '../../app/store';

interface SalesOrderState {
    items: SalesOrder[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: SalesOrderState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchSalesOrders = createAsyncThunk('salesOrders/fetch', async (_, { rejectWithValue }) => {
    try {
        return (await salesOrderApiService.getSalesOrders()).data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch sales orders');
    }
});

export const placeNewSalesOrder = createAsyncThunk('salesOrders/place', async (order: PlaceSalesOrder, { rejectWithValue }) => {
    try {
        return (await salesOrderApiService.placeSalesOrder(order)).data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to place order');
    }
});

export const shipOrder = createAsyncThunk('salesOrders/ship', async (id: number, { dispatch, rejectWithValue }) => {
    try {
        await salesOrderApiService.shipSalesOrder(id);
        dispatch(fetchSalesOrders());
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to ship order');
    }
});

export const payForOrder = createAsyncThunk('salesOrders/pay', async ({ id, paymentData }: { id: number, paymentData: Payment }, { dispatch, rejectWithValue }) => {
    try {
        await salesOrderApiService.processPayment(id, paymentData);
        dispatch(fetchSalesOrders());
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to process payment');
    }
});

const salesOrderSlice = createSlice({
    name: 'salesOrders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSalesOrders.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchSalesOrders.fulfilled, (state, action: PayloadAction<SalesOrder[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchSalesOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(placeNewSalesOrder.fulfilled, (state, action: PayloadAction<SalesOrder>) => {
                state.items.push(action.payload);
            })
            .addMatcher(
                (action) => [shipOrder.pending, payForOrder.pending].includes(action.type),
                (state) => { state.status = 'loading'; }
            )
            .addMatcher(
                (action) => [shipOrder.rejected, payForOrder.rejected].includes(action.type),
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload as string;
                }
            );
    },
});

export const selectAllSalesOrders = (state: RootState) => state.salesOrders.items;

export default salesOrderSlice.reducer;
