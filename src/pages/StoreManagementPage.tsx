import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { fetchStores, addNewStore, updateExistingStore, deleteExistingStore } from '../features/stores/storeSlice';
import { Store, NewStore } from '../types';
import { BuildingIcon, PlusIcon, EditIcon, TrashIcon } from '../components/icons';
import {StoreModal} from "../features/stores/StoreModal.tsx";

export const StoreManagementPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { stores, status, error } = useSelector((state: RootState) => state.stores);

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
        if (window.confirm('Are you sure you want to delete this store?')) {
            dispatch(deleteExistingStore(id));
        }
    };

    const renderContent = () => {
        if (status === 'loading') {
            return <div className="text-center p-8">Loading stores...</div>;
        }
        if (status === 'failed') {
            return <div className="text-center p-8 text-red-500">Error: {error}</div>;
        }
        return (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg. Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {stores.map((store) => (
                        <tr key={store.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{store.storeName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.storeRegistrationNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${store.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {store.isVerified ? 'Verified' : 'Pending'}
                                    </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                <button onClick={() => handleOpenModal(store)} className="text-indigo-600 hover:text-indigo-900"><EditIcon className="h-5 w-5"/></button>
                                <button onClick={() => handleDelete(store.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5"/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <BuildingIcon className="h-8 w-8 mr-3 text-indigo-600"/>
                    Store Management
                </h1>
                <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center">
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    Add New Store
                </button>
            </header>

            {renderContent()}

            <StoreModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleFormSubmit}
                store={editingStore}
            />
        </div>
    );
};