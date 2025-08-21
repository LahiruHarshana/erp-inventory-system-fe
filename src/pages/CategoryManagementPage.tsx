// src/pages/CategoryManagementPage.tsx

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchCategories, addNewCategory, deleteExistingCategory } from '../features/category/categorySlice';
import type { NewCategory } from '../types';
import { PlusIcon, TrashIcon } from '../components/icons';
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

    const handleFormSubmit = (categoryData: NewCategory) => {
        dispatch(addNewCategory(categoryData));
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            dispatch(deleteExistingCategory(id));
        }
    };

    const renderContent = () => {
        if (status === 'loading') return <LoadingSpinner />;
        if (status === 'failed') return <div className="text-center p-8 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>;
        if (categories.length === 0) return <div className="text-center p-8 text-gray-500">No categories found.</div>;

        return (
            <ul className="divide-y divide-gray-200">
                {categories.map((category) => (
                    <li key={category.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">{category.name}</p>
                        <button onClick={() => handleDelete(category.id)} className="text-red-500 hover:text-red-700 p-1">
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
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
