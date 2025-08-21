// src/features/stores/StoreModal.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { XIcon } from '../../components/icons';
import type { Store, NewStore } from '../../types';

interface StoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (storeData: Store | NewStore) => void;
    store: Store | null;
}

// Define the shape for our validation errors
type FormErrors = Partial<Record<keyof NewStore, string>>;

export const StoreModal: React.FC<StoreModalProps> = ({ isOpen, onClose, onSubmit, store }) => {
    const [formData, setFormData] = useState<NewStore>({
        storeName: '',
        storeRegistrationNumber: '',
        taxId: '',
        operationalDetails: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});

    // Memoize the initial state to avoid re-creating it on every render
    const initialState = useMemo(() => ({
        storeName: '',
        storeRegistrationNumber: '',
        taxId: '',
        operationalDetails: '',
    }), []);

    // Effect to populate or reset the form when the modal's state changes
    useEffect(() => {
        if (isOpen) {
            if (store) {
                setFormData({
                    storeName: store.storeName,
                    storeRegistrationNumber: store.storeRegistrationNumber,
                    taxId: store.taxId,
                    operationalDetails: store.operationalDetails,
                });
            } else {
                setFormData(initialState);
            }
            // Clear previous errors when the modal opens
            setErrors({});
        }
    }, [store, isOpen, initialState]);

    // --- Validation Logic ---
    const validateForm = (currentFormData: NewStore): FormErrors => {
        const newErrors: FormErrors = {};
        if (!currentFormData.storeName.trim()) {
            newErrors.storeName = 'Store name is required.';
        } else if (currentFormData.storeName.length < 3) {
            newErrors.storeName = 'Store name must be at least 3 characters long.';
        }

        if (!currentFormData.storeRegistrationNumber.trim()) {
            newErrors.storeRegistrationNumber = 'Registration number is required.';
        }
        // Example of a more specific validation (e.g., must be alphanumeric)
        // else if (!/^[a-zA-Z0-9]+$/.test(currentFormData.storeRegistrationNumber)) {
        //     newErrors.storeRegistrationNumber = 'Can only contain letters and numbers.';
        // }

        if (!currentFormData.taxId.trim()) {
            newErrors.taxId = 'Tax ID is required.';
        }

        if (!currentFormData.operationalDetails.trim()) {
            newErrors.operationalDetails = 'Operational details are required.';
        }
        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        // Validate on change to give instant feedback
        setErrors(validateForm(newFormData));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);

        // Check if there are any errors before submitting
        if (Object.keys(validationErrors).length === 0) {
            const submissionData = store ? { ...store, ...formData } : formData;
            onSubmit(submissionData);
            onClose();
        }
    };

    // Disable the submit button if there are any errors
    const isFormInvalid = Object.keys(errors).some(key => !!errors[key as keyof NewStore]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-60 backdrop-blur-md z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fadeIn">
            <div
                className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-2xl w-full transform transition-transform duration-300 animate-scaleIn">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h3 className="text-xl font-semibold text-gray-800">{store ? 'Edit Store' : 'Add New Store'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form Field: Store Name */}
                    <div>
                        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Store Name</label>
                        <input type="text" name="storeName" id="storeName" value={formData.storeName} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.storeName ? 'border-red-500' : 'border-gray-300'}`}/>
                        {errors.storeName && <p className="mt-1 text-xs text-red-600">{errors.storeName}</p>}
                    </div>
                    {/* Form Field: Registration Number */}
                    <div>
                        <label htmlFor="storeRegistrationNumber" className="block text-sm font-medium text-gray-700">Registration Number</label>
                        <input type="text" name="storeRegistrationNumber" id="storeRegistrationNumber" value={formData.storeRegistrationNumber} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.storeRegistrationNumber ? 'border-red-500' : 'border-gray-300'}`}/>
                        {errors.storeRegistrationNumber && <p className="mt-1 text-xs text-red-600">{errors.storeRegistrationNumber}</p>}
                    </div>
                    {/* Form Field: Tax ID */}
                    <div>
                        <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">Tax ID / VAT Number</label>
                        <input type="text" name="taxId" id="taxId" value={formData.taxId} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.taxId ? 'border-red-500' : 'border-gray-300'}`}/>
                        {errors.taxId && <p className="mt-1 text-xs text-red-600">{errors.taxId}</p>}
                    </div>
                    {/* Form Field: Operational Details */}
                    <div>
                        <label htmlFor="operationalDetails" className="block text-sm font-medium text-gray-700">Operational Details</label>
                        <textarea name="operationalDetails" id="operationalDetails" value={formData.operationalDetails} onChange={handleChange} rows={3} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.operationalDetails ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                        {errors.operationalDetails && <p className="mt-1 text-xs text-red-600">{errors.operationalDetails}</p>}
                    </div>
                    {/* Action Buttons */}
                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 border border-gray-300 font-medium">Cancel</button>
                        <button type="submit" disabled={isFormInvalid} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium disabled:bg-indigo-300 disabled:cursor-not-allowed">
                            {store ? 'Save Changes' : 'Create Store'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
