import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchStores } from '../stores/storeSlice';

export const BusinessOwnerDashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: stores, status, error } = useSelector((state: RootState) => state.stores);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchStores());
        }
    }, [status, dispatch]);

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div>Error: {error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Business Owner Dashboard</h1>
            <p>You have {stores.length} stores.</p>
            {/* The full store management UI would go here */}
        </div>
    );
};