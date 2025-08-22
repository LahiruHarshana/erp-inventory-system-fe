import React, { useState, useEffect } from 'react';
import { XIcon } from '../../components/icons';
import type { Warehouse, NewWarehouse } from '../../types';

interface WarehouseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (warehouseData: Warehouse | NewWarehouse) => void;
    warehouse: Warehouse | null;
}

type FormErrors = Partial<Record<keyof NewWarehouse, string>>;
type TouchedFields = Partial<Record<keyof NewWarehouse, boolean>>;

export const WarehouseModal: React.FC<WarehouseModalProps> = ({ isOpen, onClose, onSubmit, warehouse }) => {
    const [formData, setFormData] = useState<NewWarehouse>({
        name: '', location: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<TouchedFields>({});

    useEffect(() => {
        if (isOpen) {
            if (warehouse) {
                setFormData(warehouse);
            } else {
                setFormData({ name: '', location: '' });
            }
            setErrors({});
            setTouched({});
        }
    }, [isOpen, warehouse]);

    const validate = (data: NewWarehouse): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.name.trim()) newErrors.name = 'Warehouse name is required.';
        if (!data.location.trim()) newErrors.location = 'Location is required.';
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
        setTouched({ name: true, location: true });
        if (Object.keys(validationErrors).length === 0) {
            onSubmit(warehouse ? { ...warehouse, ...formData } : formData);
            onClose();
        }
    };

    const isFormInvalid = Object.keys(validate(formData)).length > 0;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-lg w-full transform transition-transform duration-300 animate-scaleIn">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h3 className="text-xl font-semibold text-gray-800">{warehouse ? 'Edit Warehouse' : 'Add New Warehouse'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"><XIcon className="h-6 w-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Warehouse Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.name && touched.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}/>
                        {errors.name && touched.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.location && touched.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}/>
                        {errors.location && touched.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
                    </div>
                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 border border-gray-300 font-medium">Cancel</button>
                        <button type="submit" disabled={isFormInvalid} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium disabled:bg-indigo-300 disabled:cursor-not-allowed">{warehouse ? 'Save Changes' : 'Create Warehouse'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
