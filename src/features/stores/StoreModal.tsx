import React, { useState, useEffect, useMemo } from 'react';
import { XIcon } from '../../components/icons';
import type { Store, NewStore } from '../../types';

interface StoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (storeData: Store | NewStore) => void;
    store: Store | null;
}

// Use a more specific type for form data to include the optional isVerified flag
type StoreFormData = NewStore & { verified?: boolean };
type FormErrors = Partial<Record<keyof NewStore, string>>;

export const StoreModal: React.FC<StoreModalProps> = ({ isOpen, onClose, onSubmit, store }) => {
    const [formData, setFormData] = useState<StoreFormData>({
        storeName: '',
        storeRegistrationNumber: '',
        taxId: '',
        operationalDetails: '',
        verified: true,
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const initialState = useMemo(() => ({
        storeName: '',
        storeRegistrationNumber: '',
        taxId: '',
        operationalDetails: '',
        verified: true,
    }), []);

    useEffect(() => {
        if (isOpen) {
            if (store) {
                setFormData({
                    storeName: store.storeName,
                    storeRegistrationNumber: store.storeRegistrationNumber,
                    taxId: store.taxId,
                    operationalDetails: store.operationalDetails,
                    verified: store.verified, // Set isVerified from the store being edited
                });
            } else {
                setFormData(initialState);
            }
            setErrors({});
        }
    }, [store, isOpen, initialState]);

    // --- No changes to validation logic ---
    const validateForm = (currentFormData: NewStore): FormErrors => {
        const newErrors: FormErrors = {};
        if (!currentFormData.storeName.trim()) newErrors.storeName = 'Store name is required.';
        if (!currentFormData.storeRegistrationNumber.trim()) newErrors.storeRegistrationNumber = 'Registration number is required.';
        if (!currentFormData.taxId.trim()) newErrors.taxId = 'Tax ID is required.';
        if (!currentFormData.operationalDetails.trim()) newErrors.operationalDetails = 'Operational details are required.';
        return newErrors;
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // Handle checkbox type for the toggle
        const isCheckbox = type === 'checkbox';
        const newFormData = { ...formData, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value };

        setFormData(newFormData);
        if (Object.keys(errors).length > 0) {
            setErrors(validateForm(newFormData));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Ensure isVerified is part of the submission data
        const submissionData = store ? { ...store, ...formData } : formData;
        onSubmit(submissionData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-60 backdrop-blur-md z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-2xl w-full transform transition-transform duration-300 animate-scaleIn">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h3 className="text-xl font-semibold text-gray-800">{store ? 'Edit Store' : 'Add New Store'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* --- Input fields remain the same --- */}
                    <div>
                        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Store Name</label>
                        <input type="text" name="storeName" id="storeName" value={formData.storeName} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.storeName ? 'border-red-500' : 'border-gray-300'}`}/>
                        {errors.storeName && <p className="mt-1 text-xs text-red-600">{errors.storeName}</p>}
                    </div>
                    <div>
                        <label htmlFor="storeRegistrationNumber" className="block text-sm font-medium text-gray-700">Registration Number</label>
                        <input type="text" name="storeRegistrationNumber" id="storeRegistrationNumber" value={formData.storeRegistrationNumber} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.storeRegistrationNumber ? 'border-red-500' : 'border-gray-300'}`}/>
                        {errors.storeRegistrationNumber && <p className="mt-1 text-xs text-red-600">{errors.storeRegistrationNumber}</p>}
                    </div>
                    <div>
                        <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">Tax ID / VAT Number</label>
                        <input type="text" name="taxId" id="taxId" value={formData.taxId} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.taxId ? 'border-red-500' : 'border-gray-300'}`}/>
                        {errors.taxId && <p className="mt-1 text-xs text-red-600">{errors.taxId}</p>}
                    </div>
                    <div>
                        <label htmlFor="operationalDetails" className="block text-sm font-medium text-gray-700">Operational Details</label>
                        <textarea name="operationalDetails" id="operationalDetails" value={formData.operationalDetails} onChange={handleChange} rows={3} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.operationalDetails ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                        {errors.operationalDetails && <p className="mt-1 text-xs text-red-600">{errors.operationalDetails}</p>}
                    </div>

                    {/* --- NEW: isVerified Toggle (only shows when editing) --- */}
                    {store && (
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-sm font-medium text-gray-700">Verification Status</span>
                            <label htmlFor="verified" className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="verified"
                                    name="verified"
                                    checked={formData.verified}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900">{formData.verified ? 'Verified' : 'Pending'}</span>
                            </label>
                        </div>
                    )}

                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 border border-gray-300 font-medium">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium disabled:bg-indigo-300 disabled:cursor-not-allowed">
                            {store ? 'Save Changes' : 'Create Store'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
