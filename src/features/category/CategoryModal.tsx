import React, { useState, useEffect } from 'react';
import { XIcon } from '../../components/icons';
import type { NewCategory } from '../../types/categoryTypes';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (categoryData: NewCategory) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('');
            setError('');
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim().length < 3) {
            setError('Category name must be at least 3 characters long.');
            return;
        }
        onSubmit({ name });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full transform transition-transform duration-300 animate-scaleIn">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h3 className="text-xl font-semibold text-gray-800">Add New Category</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (error) setError('');
                            }}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
                        />
                        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
                    </div>
                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 border border-gray-300 font-medium">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium">Create Category</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
