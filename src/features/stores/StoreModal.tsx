import React, { useState, useEffect } from 'react';
import {XIcon} from "../../components/icons";
import type { Store } from '@reduxjs/toolkit';
import type { NewStore } from '../../types';

interface StoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (storeData: Store | NewStore) => void;
    store: Store | null;
}

export const StoreModal: React.FC<StoreModalProps> = ({ isOpen, onClose, onSubmit, store }) => {
    const [formData, setFormData] = useState<NewStore>({
        storeName: '',
        storeRegistrationNumber: '',
        taxId: '',
        operationalDetails: '',
    });

    useEffect(() => {
        if (store) {
            setFormData({
                storeName: store.storeName,
                storeRegistrationNumber: store.storeRegistrationNumber,
                taxId: store.taxId,
                operationalDetails: store.operationalDetails,
            });
        } else {
            setFormData({
                storeName: '',
                storeRegistrationNumber: '',
                taxId: '',
                operationalDetails: '',
            });
        }
    }, [store, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submissionData = store ? { ...store, ...formData } : formData;
        onSubmit(submissionData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 m-4 max-w-xl w-full">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800">{store ? 'Edit Store' : 'Add New Store'}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form fields... */}
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">{store ? 'Save Changes' : 'Create Store'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};