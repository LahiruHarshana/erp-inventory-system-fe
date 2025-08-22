import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchWarehouses, addNewWarehouse, updateExistingWarehouse, deleteExistingWarehouse } from '../features/warehouses/warehouseSlice';
import type { Warehouse, NewWarehouse } from '../types';
import { PlusIcon, EditIcon, TrashIcon, HomeIcon } from '../components/icons';
import { WarehouseModal } from '../features/warehouses/WarehouseModal';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-10"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
);

const EmptyState: React.FC<{ onAddNew: () => void }> = ({ onAddNew }) => (
    <div className="text-center p-8 bg-gray-50 rounded-lg">
        <HomeIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No warehouses found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new warehouse.</p>
        <div className="mt-6">
            <button onClick={onAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm font-medium inline-flex items-center">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add New Warehouse
            </button>
        </div>
    </div>
);

export const WarehouseManagementPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: warehouses, status, error } = useSelector((state: RootState) => state.warehouses);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);

    useEffect(() => {
        if (status === 'idle') dispatch(fetchWarehouses());
    }, [status, dispatch]);

    const handleOpenModal = (warehouse: Warehouse | null = null) => {
        setEditingWarehouse(warehouse);
        setIsModalOpen(true);
    };

    const handleFormSubmit = (warehouseData: Warehouse | NewWarehouse) => {
        if ('id' in warehouseData) {
            dispatch(updateExistingWarehouse(warehouseData as Warehouse));
        } else {
            dispatch(addNewWarehouse(warehouseData as NewWarehouse));
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this warehouse?')) {
            dispatch(deleteExistingWarehouse(id));
        }
    };

    const renderContent = () => {
        if (status === 'loading') return <LoadingSpinner />;
        if (status === 'failed') return <div className="text-center p-8 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>;
        if (warehouses.length === 0) return <EmptyState onAddNew={() => handleOpenModal()} />;

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {warehouses.map((warehouse) => (
                        <tr key={warehouse.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{warehouse.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warehouse.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right space-x-4">
                                <button onClick={() => handleOpenModal(warehouse)} className="text-indigo-600 hover:text-indigo-900 p-1"><EditIcon className="h-5 w-5"/></button>
                                <button onClick={() => handleDelete(warehouse.id)} className="text-red-600 hover:text-red-900 p-1"><TrashIcon className="h-5 w-5"/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Warehouse Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage all company warehouses.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm font-medium flex items-center">
                    <PlusIcon className="h-5 w-5 mr-2"/> Add New Warehouse
                </button>
            </header>
            <main className="bg-white shadow-sm rounded-lg">
                {renderContent()}
            </main>
            <WarehouseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                warehouse={editingWarehouse}
            />
        </div>
    );
};
