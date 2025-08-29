import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import type { RootState, AppDispatch } from '../app/store';
import { fetchStores, addNewStore, updateExistingStore, deleteExistingStore } from '../features/stores/storeSlice';
import type { Store, NewStore } from '../types';
import { BuildingIcon, PlusIcon, EditIcon, TrashIcon, ExclamationIcon, SearchIcon } from '../components/icons';
import { StoreModal } from "../features/stores/StoreModal";

// --- Helper Components ---
const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-10"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
);

const EmptyState: React.FC<{ onAddNew: () => void }> = ({ onAddNew }) => (
    <div className="text-center p-8 bg-white rounded-lg">
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

// --- Main Component ---
export const StoreManagementPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: stores, status, error } = useSelector((state: RootState) => state.stores);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStore, setEditingStore] = useState<Store | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchStores());
            console.log('Fetching stores...');
            console.log(stores);
        }
    }, [status, dispatch]);

    useEffect(() => {
        if (status === 'failed' && error) {
            toast.error(`Error: ${error}`);
        }
    }, [status, error]);

    const filteredStores = useMemo(() => {
        if (!searchQuery) return stores;
        const lowercasedQuery = searchQuery.toLowerCase();
        return stores.filter(store =>
            store.storeName.toLowerCase().includes(lowercasedQuery) ||
            store.storeRegistrationNumber.toLowerCase().includes(lowercasedQuery)
        );
    }, [stores, searchQuery]);

    const handleOpenModal = (store: Store | null = null) => {
        setEditingStore(store);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStore(null);
    };

    const handleFormSubmit = (storeData: Store | NewStore) => {
        const isUpdating = 'id' in storeData;
        const action = isUpdating ? updateExistingStore(storeData as Store) : addNewStore(storeData as NewStore);

        toast.promise(dispatch(action).unwrap(), {
            loading: isUpdating ? 'Updating store...' : 'Creating store...',
            success: (result) => `Store "${result.storeName}" ${isUpdating ? 'updated' : 'created'} successfully!`,
            error: (err) => err || `Failed to ${isUpdating ? 'update' : 'create'} store.`,
        });
    };

    const handleDelete = (id: number, name: string) => {
        toast((t) => (
            <div className="flex flex-col items-center gap-3 p-2">
                <div className="flex items-center">
                    <ExclamationIcon className="h-8 w-8 text-red-500 mr-3" />
                    <div className="text-left">
                        <p className="font-bold text-gray-800">Delete "{name}"</p>
                        <p className="text-sm text-gray-600">Are you sure? This action cannot be undone.</p>
                    </div>
                </div>
                <div className="w-full flex justify-end gap-2">
                    <button onClick={() => toast.dismiss(t.id)} className="px-4 py-1.5 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300">
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            toast.promise(dispatch(deleteExistingStore(id)).unwrap(), {
                                loading: `Deleting ${name}...`,
                                success: 'Store deleted successfully!',
                                error: (err) => err || 'Failed to delete store.',
                            });
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
        if (status === 'loading' && stores.length === 0) return <LoadingSpinner />;
        if (status === 'failed' && stores.length === 0) return <div className="text-center p-8 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>;
        if (status !== 'loading' && stores.length === 0) return <EmptyState onAddNew={() => handleOpenModal()} />;

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
                    {filteredStores.map((store) => (
                        <tr key={store.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{store.storeName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.storeRegistrationNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${store.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {store.verified ? 'Verified' : 'Pending'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button onClick={() => handleOpenModal(store)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"><EditIcon className="h-5 w-5"/></button>
                                <button onClick={() => handleDelete(store.id, store.storeName)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"><TrashIcon className="h-5 w-5"/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {filteredStores.length === 0 && searchQuery && (
                    <div className="text-center p-8 text-gray-500">No stores found for "{searchQuery}".</div>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Store Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Create, edit, and manage all company stores.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center shadow-sm font-medium w-full md:w-auto justify-center">
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    Add New Store
                </button>
            </header>

            <div className="mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by store name or registration number..."
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
                <StoreModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleFormSubmit}
                    store={editingStore}
                />
            )}
        </div>
    );
};
