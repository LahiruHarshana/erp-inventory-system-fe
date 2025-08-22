import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchSuppliers, addNewSupplier, updateExistingSupplier, deleteExistingSupplier } from '../features/suppliers/supplierSlice';
import type { Supplier, NewSupplier } from '../types';
import { PlusIcon, EditIcon, TrashIcon, TruckIcon } from '../components/icons';
import { SupplierModal } from '../features/suppliers/SupplierModal';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-10"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
);

const EmptyState: React.FC<{ onAddNew: () => void }> = ({ onAddNew }) => (
    <div className="text-center p-8 bg-gray-50 rounded-lg">
        <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No suppliers found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new supplier.</p>
        <div className="mt-6">
            <button onClick={onAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm font-medium inline-flex items-center">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add New Supplier
            </button>
        </div>
    </div>
);

export const SupplierManagementPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: suppliers, status, error } = useSelector((state: RootState) => state.suppliers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

    useEffect(() => {
        if (status === 'idle') dispatch(fetchSuppliers());
    }, [status, dispatch]);

    const handleOpenModal = (supplier: Supplier | null = null) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleFormSubmit = (supplierData: Supplier | NewSupplier) => {
        if ('id' in supplierData) {
            dispatch(updateExistingSupplier(supplierData as Supplier));
        } else {
            dispatch(addNewSupplier(supplierData as NewSupplier));
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            dispatch(deleteExistingSupplier(id));
        }
    };

    const renderContent = () => {
        if (status === 'loading') return <LoadingSpinner />;
        if (status === 'failed') return <div className="text-center p-8 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>;
        if (suppliers.length === 0) return <EmptyState onAddNew={() => handleOpenModal()} />;

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {suppliers.map((supplier) => (
                        <tr key={supplier.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{supplier.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.contactPerson}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right space-x-4">
                                <button onClick={() => handleOpenModal(supplier)} className="text-indigo-600 hover:text-indigo-900 p-1"><EditIcon className="h-5 w-5"/></button>
                                <button onClick={() => handleDelete(supplier.id)} className="text-red-600 hover:text-red-900 p-1"><TrashIcon className="h-5 w-5"/></button>
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
                    <h1 className="text-3xl font-bold text-gray-900">Supplier Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage all company suppliers.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm font-medium flex items-center">
                    <PlusIcon className="h-5 w-5 mr-2"/> Add New Supplier
                </button>
            </header>
            <main className="bg-white shadow-sm rounded-lg">
                {renderContent()}
            </main>
            <SupplierModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                supplier={editingSupplier}
            />
        </div>
    );
};
