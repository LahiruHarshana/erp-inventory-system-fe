import axios from 'axios';
import type { ForecastRequest, ForecastResponse, SalesRecord } from '../types';

const ERP_API_URL = 'http://localhost:8080/api/v1';
const FORECASTING_API_URL = 'http://localhost:8000';

const erpAxios = axios.create({ baseURL: ERP_API_URL });
const forecastingAxios = axios.create({ baseURL: FORECASTING_API_URL });

erpAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface SalesRecordFilter {
    startDate?: string;
    endDate?: string;
}

export const forecastingApiService = {
    getSalesRecords: (filters: SalesRecordFilter) =>
        erpAxios.get<SalesRecord[]>('/sales-records', { params: filters }),

    predict: (requestData: ForecastRequest) => {
        // Map the incoming records to match the FastAPI RawDataRecord schema
        const formattedRequest: ForecastRequest = {
            records: requestData.records.map(record => ({
                Date: record.date,
                Store_ID: record.storeId,
                Product_ID: record.productId,
                Category: record.category,
                Region: record.region,
                Inventory_Level: parseFloat(record.inventoryLevel?.toString() ?? '0'),
                Units_Sold: parseFloat(record.unitsSold?.toString() ?? '0'),
                Units_Ordered: parseFloat(record.unitsOrdered?.toString() ?? '0'),
                Price: parseFloat(record.price?.toString() ?? '0'),
                Discount: parseFloat(record.discount?.toString() ?? '0'),
                Weather_Condition: record.weatherCondition,
                Holiday_Promotion: parseInt(record.holidayPromotion?.toString() ?? '0', 10),
                Competitor_Pricing: parseFloat(record.competitorPricing?.toString() ?? '0'),
                Seasonality: record.seasonality,
            })),
        };
        console.log('[predict] formattedRequest:', formattedRequest);
        return forecastingAxios.post<ForecastResponse>('/predict/', formattedRequest);
    },
};