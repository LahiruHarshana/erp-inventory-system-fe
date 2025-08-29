import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type {AppDispatch } from '../app/store';
import { runForecast, selectForecasting } from '../features/forecasting/forecastingSlice';
import { TrendingUpIcon } from '../components/icons';

export const ForecastingPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { historicalRecords, prediction, status, error } = useSelector(selectForecasting);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = () => {
        if (startDate && endDate) {
            dispatch(runForecast({ startDate, endDate }));
        } else {
            alert('Please select a start and end date.');
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Sales Forecaster</h1>
                <p className="mt-1 text-sm text-gray-500">Generate future sales predictions based on historical data from your ERP.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">1. Select Date Range</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full input"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full input"/>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">2. Run Forecast</h2>
                        <button onClick={handleSubmit} disabled={status === 'loading'} className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                            <TrendingUpIcon className="h-5 w-5 mr-2"/>
                            {status === 'loading' ? 'Processing...' : 'Generate Forecast'}
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Results</h2>
                    {status === 'loading' && <div className="flex justify-center items-center h-48"><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div></div>}
                    {error && <p className="text-red-600 bg-red-50 p-3 rounded-md text-center text-sm">{error}</p>}
                    {prediction && (
                        <div className="text-center">
                            <p className="text-gray-500">Predicted Units Sold</p>
                            <p className="text-6xl font-bold text-indigo-600 my-4">{Math.round(prediction[0])}</p>
                            <p className="text-sm text-gray-500">for the next time step based on {historicalRecords.length} historical records.</p>
                        </div>
                    )}
                    {status === 'idle' && !prediction && <p className="text-center text-gray-500 mt-16">Select a date range and run a forecast to see results.</p>}
                </div>
            </div>
        </div>
    );
};
