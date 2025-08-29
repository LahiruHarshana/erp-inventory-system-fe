import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import type { RootState, AppDispatch } from '../app/store';
import { fetchSuppliers, addNewSupplier, updateExistingSupplier, deleteExistingSupplier } from '../features/suppliers/supplierSlice';
import type { Supplier, NewSupplier } from '../types';
import { PlusIcon, EditIcon, TrashIcon, TruckIcon, ExclamationIcon, SearchIcon } from '../components/icons';
import { SupplierModal } from '../features/suppliers/SupplierModal';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-10"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
);

const EmptyState: React.FC<{ onAddNew: () => void }> = ({ onAddNew }) => (
    <div className="text-center p-8 bg-white rounded-lg">
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
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (status === 'idle') dispatch(fetchSuppliers());
    }, [status, dispatch]);

    useEffect(() => {
        if (status === 'failed' && error) {
            toast.error(`Error fetching data: ${error}`);
        }
    }, [status, error]);

    const filteredSuppliers = useMemo(() => {
        if (!searchQuery) return suppliers;
        const lowercasedQuery = searchQuery.toLowerCase();
        return suppliers.filter(supplier =>
            supplier.name.toLowerCase().includes(lowercasedQuery) ||
            supplier.contactPerson.toLowerCase().includes(lowercasedQuery) ||
            supplier.email.toLowerCase().includes(lowercasedQuery)
        );
    }, [suppliers, searchQuery]);

    const handleOpenModal = (supplier: Supplier | null = null) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (supplierData: Supplier | NewSupplier) => {
        const isUpdating = 'id' in supplierData;
        const action = isUpdating
            ? updateExistingSupplier(supplierData as Supplier)
            : addNewSupplier(supplierData as NewSupplier);

        const promise = dispatch(action).unwrap();

        toast.promise(promise, {
            loading: isUpdating ? 'Updating supplier...' : 'Creating supplier...',
            success: (result) => `Supplier "${result.name}" ${isUpdating ? 'updated' : 'created'} successfully!`,
            error: (err) => err || `Failed to ${isUpdating ? 'update' : 'create'} supplier.`,
        });
    };

    const handleDelete = (id: number, name: string) => {
        toast((t) => (
            <div className="flex flex-col items-center gap-3 p-2">
                <div className="flex items-center">
                    <ExclamationIcon className="h-8 w-8 text-red-500 mr-3" />
                    <div className="text-left">
                        <p className="font-bold text-gray-800">Delete "{name}"</p>
                        <p className="text-sm text-gray-600">Are you sure you want to delete this supplier?</p>
                    </div>
                </div>
                <div className="w-full flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-1.5 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await dispatch(deleteExistingSupplier(id)).unwrap();
                                toast.success('Supplier deleted successfully!');
                            } catch (err: any) {
                                toast.error(err || 'Failed to delete supplier.');
                            }
                        }}
                        className="px-4 py-1.5 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), { duration: 6000 });
    };

    const renderContent = () => {
        if (status === 'loading' && suppliers.length === 0) return <LoadingSpinner />;
        if (status === 'failed' && suppliers.length === 0) return <div className="text-center p-8 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>;
        if (status !== 'loading' && suppliers.length === 0) return <EmptyState onAddNew={() => handleOpenModal()} />;

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
                    {filteredSuppliers.map((supplier) => (
                        <tr key={supplier.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{supplier.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.contactPerson}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right space-x-2">
                                <button onClick={() => handleOpenModal(supplier)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"><EditIcon className="h-5 w-5"/></button>
                                <button onClick={() => handleDelete(supplier.id, supplier.name)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"><TrashIcon className="h-5 w-5"/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {filteredSuppliers.length === 0 && searchQuery && (
                    <div className="text-center p-8 text-gray-500">No suppliers found for "{searchQuery}".</div>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

            <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Supplier Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage all company suppliers.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm font-medium flex items-center w-full md:w-auto justify-center">
                    <PlusIcon className="h-5 w-5 mr-2"/> Add New Supplier
                </button>
            </header>

            <div className="mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, contact, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <main className="bg-white shadow-sm rounded-lg">
                {renderContent()}
            </main>

            {isModalOpen && (
                <SupplierModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                    supplier={editingSupplier}
                />
            )}
        </div>
    );
};
