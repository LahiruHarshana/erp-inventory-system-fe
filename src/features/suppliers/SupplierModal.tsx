import React, { useState, useEffect } from 'react';
import { XIcon } from '../../components/icons';
import type { Supplier, NewSupplier } from '../../types';

interface SupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (supplierData: Supplier | NewSupplier) => void;
    supplier: Supplier | null;
}

type FormErrors = Partial<Record<keyof NewSupplier, string>>;
type TouchedFields = Partial<Record<keyof NewSupplier, boolean>>;

export const SupplierModal: React.FC<SupplierModalProps> = ({ isOpen, onClose, onSubmit, supplier }) => {
    const [formData, setFormData] = useState<NewSupplier>({
        name: '', contactPerson: '', email: '', phone: '', apiUrl: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<TouchedFields>({});

    useEffect(() => {
        if (isOpen) {
            if (supplier) {
                setFormData(supplier);
            } else {
                setFormData({ name: '', contactPerson: '', email: '', phone: '', apiUrl: '' });
            }
            setErrors({});
            setTouched({});
        }
    }, [isOpen, supplier]);

    const validate = (data: NewSupplier): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.name.trim()) newErrors.name = 'Supplier name is required.';
        if (!data.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required.';
        if (!data.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Email address is invalid.';
        }
        if (!data.phone.trim()) newErrors.phone = 'Phone number is required.';
        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            setErrors(validate(newData));
            return newData;
        });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        setErrors(validationErrors);
        setTouched({ name: true, contactPerson: true, email: true, phone: true });
        if (Object.keys(validationErrors).length === 0) {
            onSubmit(supplier ? { ...supplier, ...formData } : formData);
            onClose();
        }
    };

    const isFormInvalid = Object.keys(validate(formData)).length > 0;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-md z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-2xl w-full transform transition-transform duration-300 animate-scaleIn">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h3 className="text-xl font-semibold text-gray-800">{supplier ? 'Edit Supplier' : 'Add New Supplier'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"><XIcon className="h-6 w-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.name && touched.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}/>
                            {errors.name && touched.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                            <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.contactPerson && touched.contactPerson ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}/>
                            {errors.contactPerson && touched.contactPerson && <p className="text-xs text-red-600 mt-1">{errors.contactPerson}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.email && touched.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}/>
                            {errors.email && touched.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.phone && touched.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}/>
                            {errors.phone && touched.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">API URL (Optional)</label>
                            <input type="text" name="apiUrl" value={formData.apiUrl} onChange={handleChange} onBlur={handleBlur} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 border border-gray-300 font-medium">Cancel</button>
                        <button type="submit" disabled={isFormInvalid} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium disabled:bg-indigo-300 disabled:cursor-not-allowed">{supplier ? 'Save Changes' : 'Create Supplier'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
