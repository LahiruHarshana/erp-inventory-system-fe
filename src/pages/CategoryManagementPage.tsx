import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import type { RootState, AppDispatch } from '../app/store';
import { fetchCategories, addNewCategory, deleteExistingCategory } from '../features/category/categorySlice';
import type { NewCategory } from '../types';
import { PlusIcon, TrashIcon, ExclamationIcon } from '../components/icons';
import { CategoryModal } from '../features/category/CategoryModal';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-10">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
);

export const CategoryManagementPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: categories, status, error } = useSelector((state: RootState) => state.categories);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategories());
        }
    }, [status, dispatch]);

    // We can use a separate useEffect to show a fetch error toast
    useEffect(() => {
        if (status === 'failed' && error) {
            toast.error(`Error fetching data: ${error}`);
        }
    }, [status, error]);


    const handleFormSubmit = async (categoryData: NewCategory) => {
        // Use a promise-based approach for toasts
        const promise = dispatch(addNewCategory(categoryData)).unwrap();

        toast.promise(promise, {
            loading: 'Creating category...',
            success: (newCategory) => `Category "${newCategory.name}" created successfully!`,
            error: (err) => err || 'Failed to create category.',
        });
    };

    const handleDelete = (id: number) => {
        // Replace window.confirm with a modern confirmation toast
        toast((t) => (
            <div className="flex flex-col items-center gap-3 p-2">
                <div className="flex items-center">
                    {/* You would need to create this ExclamationIcon or use one from a library */}
                    <ExclamationIcon className="h-8 w-8 text-red-500 mr-3" />
                    <div className="text-left">
                        <p className="font-bold text-gray-800">Delete Category</p>
                        <p className="text-sm text-gray-600">Are you sure you want to delete this category?</p>
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
                                await dispatch(deleteExistingCategory(id)).unwrap();
                                toast.success('Category deleted successfully!');
                            } catch (err: any) {
                                toast.error(err || 'Failed to delete category.');
                            }
                        }}
                        className="px-4 py-1.5 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), {
            duration: 6000, // Keep it open longer for user to decide
        });
    };

    const renderContent = () => {
        if (status === 'loading' && categories.length === 0) return <LoadingSpinner />;
        // The error is now primarily handled by toasts, but this can be a fallback
        if (status === 'failed' && categories.length === 0) return <div className="text-center p-8 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>;
        if (status !== 'loading' && categories.length === 0) return <div className="text-center p-8 text-gray-500">No categories found. Add one to get started!</div>;

        return (
            <ul className="divide-y divide-gray-200">
                {categories.map((category) => (
                    <li key={category.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">{category.name}</p>
                        <button onClick={() => handleDelete(category.id)} className="text-gray-400 hover:text-red-600 p-1 rounded-full transition-colors">
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            {/* --- Add Toaster Component Here --- */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#ffffff',
                        color: '#333',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10B981', // green-500
                            secondary: '#ffffff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#EF4444', // red-500
                            secondary: '#ffffff',
                        },
                    },
                }}
            />

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Category Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage all product categories.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center shadow-sm font-medium">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add New Category
                </button>
            </header>

            <main className="bg-white shadow-sm rounded-lg">
                {renderContent()}
            </main>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
};