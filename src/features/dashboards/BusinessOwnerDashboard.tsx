import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { RootState, AppDispatch } from '../../app/store';
import { BuildingIcon, CheckCircleIcon, ClockIcon } from '../../components/icons';
import {fetchStores} from "../stores/storeSlice.ts";

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full p-10">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
);

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="bg-indigo-100 text-indigo-600 rounded-full p-3">
            <Icon className="h-6 w-6" />
        </div>
    </div>
);

export const BusinessOwnerDashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { items: stores, status: storesStatus } = useSelector((state: RootState) => state.stores);

    useEffect(() => {
        if (storesStatus === 'idle') {
            dispatch(fetchStores());
        }
    }, [storesStatus, dispatch]);

    const storeStatusData = useMemo(() => {
        if (storesStatus !== 'succeeded') return [];
        const verifiedCount = stores.filter(store => store.verified).length;
        const pendingCount = stores.length - verifiedCount;
        return [
            { name: 'Verified', value: verifiedCount },
            { name: 'Pending', value: pendingCount },
        ];
    }, [stores, storesStatus]);

    const recentStores = useMemo(() => {
        return [...stores].sort((a, b) => b.id - a.id).slice(0, 5);
    }, [stores]);


    const COLORS = ['#10B981', '#F59E0B']; // Green for Verified, Amber for Pending

    if (storesStatus === 'loading') {
        return <LoadingSpinner />;
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Business Owner Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title="Total Stores" value={stores.length} icon={BuildingIcon} />
                <StatCard title="Verified Stores" value={storeStatusData[0]?.value || 0} icon={CheckCircleIcon} />
                <StatCard title="Pending Verification" value={storeStatusData[1]?.value || 0} icon={ClockIcon} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Store Status</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={storeStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                {storeStatusData.map((_,index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Recently Added Stores</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Store Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration No.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {recentStores.map(store => (
                                <tr key={store.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{store.storeName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.storeRegistrationNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${store.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {store.verified ? 'Verified' : 'Pending'}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
