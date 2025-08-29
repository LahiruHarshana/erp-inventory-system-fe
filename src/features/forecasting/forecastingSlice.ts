import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { forecastingApiService } from '../../services/forecastingApiService';
import type { SalesRecord } from '../../types';
import type { RootState } from '../../app/store';

interface ForecastingState {
    historicalRecords: SalesRecord[];
    prediction: number[] | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ForecastingState = {
    historicalRecords: [],
    prediction: null,
    status: 'idle',
    error: null,
};

interface ForecastParams {
    startDate?: string;
    endDate?: string;
}

export const runForecast = createAsyncThunk(
    'forecasting/runForecast',
    async (filters: ForecastParams, { rejectWithValue }) => {
        try {
            // Step 1: Fetch real data from the Spring Boot backend
            const salesRecordsResponse = await forecastingApiService.getSalesRecords(filters);
            const records = salesRecordsResponse.data;

            if (records.length === 0) {
                return rejectWithValue('No historical data found for the selected range.');
            }

            // Step 2: Send the fetched data to the Python backend for prediction
            const predictionResponse = await forecastingApiService.predict({ records });

            // Return both the historical data and the prediction
            return {
                historicalRecords: records,
                prediction: predictionResponse.data.predictions,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Forecasting process failed');
        }
    }
);

const forecastingSlice = createSlice({
    name: 'forecasting',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(runForecast.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.prediction = null;
            })
            .addCase(runForecast.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.historicalRecords = action.payload.historicalRecords;
                state.prediction = action.payload.prediction;
            })
            .addCase(runForecast.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const selectForecasting = (state: RootState) => state.forecasting;
export default forecastingSlice.reducer;
