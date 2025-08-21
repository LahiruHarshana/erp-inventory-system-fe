// src/pages/StoreManagementPage.tsx

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchStores, addNewStore, updateExistingStore, deleteExistingStore } from '../features/stores/storeSlice';
import type { Store, NewStore } from '../types';
import { BuildingIcon, PlusIcon, EditIcon, TrashIcon } from '../components/icons';
import { StoreModal } from "../features/stores/StoreModal";

// A simple loading spinner component
const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-10">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
);

// An improved empty state component
const EmptyState: React.FC<{ onAddNew: () => void }> = ({ onAddNew }) => (
    <div className="text-center p-8 bg-gray-50 rounded-lg">
        <BuildingIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No stores found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new store.</p>
        <div className="mt-6">
            <button onClick={onAddNew} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add New Store
            </button>
        </div>
    </div>
);


export const StoreManagementPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: stores, status, error } = useSelector((state: RootState) => state.stores);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStore, setEditingStore] = useState<Store | null>(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchStores());
        }
    }, [status, dispatch]);

    const handleOpenModal = (store: Store | null = null) => {
        setEditingStore(store);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStore(null);
    };

    const handleFormSubmit = (storeData: Store | NewStore) => {
        if ('id' in storeData) {
            dispatch(updateExistingStore(storeData as Store));
        } else {
            dispatch(addNewStore(storeData as NewStore));
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
            dispatch(deleteExistingStore(id));
        }
    };

    const renderContent = () => {
        if (status === 'loading') {
            return <LoadingSpinner />;
        }
        if (status === 'failed') {
            return <div className="text-center p-8 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>;
        }
        if (stores.length === 0) {
            return <EmptyState onAddNew={() => handleOpenModal()} />;
        }
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg. Number</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {stores.map((store) => (
                        <tr key={store.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{store.storeName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.storeRegistrationNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${store.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {store.isVerified ? 'Verified' : 'Pending'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                <button onClick={() => handleOpenModal(store)} className="text-indigo-600 hover:text-indigo-900 p-1"><EditIcon className="h-5 w-5"/></button>
                                <button onClick={() => handleDelete(store.id)} className="text-red-600 hover:text-red-900 p-1"><TrashIcon className="h-5 w-5"/></button>
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
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
                        Store Management
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">Create, edit, and manage all company stores.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="mt-4 md:mt-0 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center shadow-sm font-medium">
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    Add New Store
                </button>
            </header>

            <main className="bg-white shadow-sm rounded-lg">
                {renderContent()}
            </main>

            <StoreModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleFormSubmit}
                store={editingStore}
            />
        </div>
    );
};
