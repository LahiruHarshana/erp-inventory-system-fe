import React, { useState, useEffect } from 'react';
import { XIcon } from '../../components/icons';
import type { Product, NewProduct } from '../../types';
import type { Category } from '../../types';
import type { Supplier } from '../../types';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (productData: Product | NewProduct) => void;
    product: Product | null;
    categories: Category[];
    suppliers: Supplier[];
}

type FormErrors = Partial<Record<keyof NewProduct, string>>;
type TouchedFields = Partial<Record<keyof NewProduct, boolean>>;

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSubmit, product, categories, suppliers }) => {
    const [formData, setFormData] = useState<NewProduct>({
        sku: '', name: '', description: '', categoryId: 0, supplierId: 0, unitPrice: 0,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<TouchedFields>({});

    useEffect(() => {
        if (isOpen) {
            if (product) {
                setFormData(product);
            } else {
                setFormData({ sku: '', name: '', description: '', categoryId: categories[0]?.id || 0, supplierId: suppliers[0]?.id || 0, unitPrice: 0 });
            }
            setErrors({});
            setTouched({});
        }
    }, [isOpen, product, categories, suppliers]);

    const validate = (data: NewProduct): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.name.trim()) newErrors.name = 'Product name is required.';
        if (!data.sku.trim()) newErrors.sku = 'SKU is required.';
        if (data.unitPrice <= 0) newErrors.unitPrice = 'Price must be greater than zero.';
        if (!data.categoryId || data.categoryId === 0) newErrors.categoryId = 'Please select a category.';
        if (!data.supplierId || data.supplierId === 0) newErrors.supplierId = 'Please select a supplier.';
        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: name === 'unitPrice' || name === 'categoryId' || name === 'supplierId' ? parseFloat(value) || 0 : value };
            setErrors(validate(newData));
            return newData;
        });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name } = e.target as HTMLInputElement;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        setErrors(validationErrors);
        setTouched({ sku: true, name: true, categoryId: true, supplierId: true, unitPrice: true });
        if (Object.keys(validationErrors).length === 0) {
            onSubmit(product ? { ...product, ...formData } : formData);
            onClose();
        }
    };

    const isFormInvalid = Object.keys(validate(formData)).length > 0;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-md z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-2xl w-full transform transition-transform duration-300 animate-scaleIn">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h3 className="text-xl font-semibold text-gray-800">{product ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"><XIcon className="h-6 w-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.name && touched.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}/>
                            {errors.name && touched.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">SKU</label>
                            <input type="text" name="sku" value={formData.sku} onChange={handleChange} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.sku && touched.sku ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}/>
                            {errors.sku && touched.sku && <p className="text-xs text-red-600 mt-1">{errors.sku}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} onBlur={handleBlur} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select name="categoryId" value={formData.categoryId} onChange={handleChange} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.categoryId && touched.categoryId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}>
                                <option value={0} disabled>Select a category</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                            {errors.categoryId && touched.categoryId && <p className="text-xs text-red-600 mt-1">{errors.categoryId}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Supplier</label>
                            <select name="supplierId" value={formData.supplierId} onChange={handleChange} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.supplierId && touched.supplierId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}>
                                <option value={0} disabled>Select a supplier</option>
                                {suppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
                            </select>
                            {errors.supplierId && touched.supplierId && <p className="text-xs text-red-600 mt-1">{errors.supplierId}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                            <input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleChange} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.unitPrice && touched.unitPrice ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}/>
                            {errors.unitPrice && touched.unitPrice && <p className="text-xs text-red-600 mt-1">{errors.unitPrice}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 border border-gray-300 font-medium">Cancel</button>
                        <button type="submit" disabled={isFormInvalid} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium disabled:bg-indigo-300 disabled:cursor-not-allowed">{product ? 'Save Changes' : 'Create Product'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
