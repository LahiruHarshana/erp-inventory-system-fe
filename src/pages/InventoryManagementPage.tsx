import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchWarehouses } from '../features/warehouses/warehouseSlice';
import { fetchInventoryByWarehouse } from '../features/inventory/inventorySlice';
import { PackageIcon } from '../components/icons';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-10">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center p-8 bg-gray-50 rounded-lg">
        <PackageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">{message}</h3>
    </div>
);

export const InventoryManagementPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: warehouses, status: warehousesStatus } = useSelector((state: RootState) => state.warehouses);
    const { items: inventory, status: inventoryStatus, error } = useSelector((state: RootState) => state.inventory);

    const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);

    useEffect(() => {
        if (warehousesStatus === 'idle') {
            dispatch(fetchWarehouses());
        }
    }, [warehousesStatus, dispatch]);

    useEffect(() => {
        if (selectedWarehouseId) {
            dispatch(fetchInventoryByWarehouse(selectedWarehouseId));
        }
    }, [selectedWarehouseId, dispatch]);

    const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWarehouseId(Number(e.target.value));
    };

    const renderContent = () => {
        if (inventoryStatus === 'loading') return <LoadingSpinner />;
        if (inventoryStatus === 'failed') return <div className="text-center p-8 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>;
        if (!selectedWarehouseId) return <EmptyState message="Please select a warehouse to view its inventory." />;
        if (inventory.length === 0) return <EmptyState message="No inventory found for the selected warehouse." />;

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {inventory.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.productName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-semibold">{item.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.lastUpdated).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Warehouse Inventory</h1>
                    <p className="mt-1 text-sm text-gray-500">View current stock levels across different warehouses.</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <select
                        onChange={handleWarehouseChange}
                        value={selectedWarehouseId || ''}
                        className="w-full md:w-64 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="" disabled>Select a Warehouse</option>
                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                </div>
            </header>
            <main className="bg-white shadow-sm rounded-lg">
                {renderContent()}
            </main>
        </div>
    );
};
