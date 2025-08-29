import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { reportApiService } from '../../services/reportApiService';
import type { InventorySummary, LowStockItem, PurchaseOrderHistory } from '../../types';
import { OrderStatus } from '../../types';
import type { RootState } from '../../app/store';

interface ReportState {
    inventorySummary: InventorySummary | null;
    purchaseOrderHistory: PurchaseOrderHistory;
    lowStockItems: LowStockItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ReportState = {
    inventorySummary: null,
    purchaseOrderHistory: [],
    lowStockItems: [],
    status: 'idle',
    error: null,
};

interface PurchaseOrderFilter {
    startDate?: string;
    endDate?: string;
    supplierId?: number;
    status?: OrderStatus;
}

export const fetchInventorySummary = createAsyncThunk('reports/fetchInventorySummary', async (_, { rejectWithValue }) => {
    try {
        const response = await reportApiService.getInventorySummary();
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch summary');
    }
});

export const fetchPurchaseOrderHistory = createAsyncThunk('reports/fetchPurchaseOrderHistory', async (filters: PurchaseOrderFilter, { rejectWithValue }) => {
    try {
        const response = await reportApiService.getPurchaseOrderHistory(filters);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch PO history');
    }
});

export const fetchLowStockReport = createAsyncThunk('reports/fetchLowStock', async (threshold: number | undefined, { rejectWithValue }) => {
    try {
        const response = await reportApiService.getLowStockReport(threshold);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch low stock report');
    }
});

const reportSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInventorySummary.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchInventorySummary.fulfilled, (state, action: PayloadAction<InventorySummary>) => {
                state.status = 'succeeded';
                state.inventorySummary = action.payload;
            })
            .addCase(fetchInventorySummary.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchPurchaseOrderHistory.fulfilled, (state, action: PayloadAction<PurchaseOrderHistory>) => {
                state.purchaseOrderHistory = action.payload;
            })
            .addCase(fetchLowStockReport.fulfilled, (state, action: PayloadAction<LowStockItem[]>) => {
                state.lowStockItems = action.payload;
            });
    },
});

export const selectReports = (state: RootState) => state.reports;

export default reportSlice.reducer;
