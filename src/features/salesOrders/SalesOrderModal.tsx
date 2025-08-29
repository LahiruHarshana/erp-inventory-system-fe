import React, { useState, useEffect } from 'react';
import { XIcon, PlusIcon, TrashIcon } from '../../components/icons';
import type {PlaceSalesOrder, Product, SalesOrderItem, Store, Warehouse} from "../../types";

interface SalesOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (orderData: PlaceSalesOrder) => void;
    products: Product[];
    stores: Store[];
    warehouses: Warehouse[];
}

export const SalesOrderModal: React.FC<SalesOrderModalProps> = ({ isOpen, onClose, onSubmit, products, stores, warehouses }) => {
    const [formData, setFormData] = useState<Omit<PlaceSalesOrder, 'orderItems'>>({ buyerStoreId: 0, warehouseId: 0 });
    const [orderItems, setOrderItems] = useState<Omit<SalesOrderItem, 'id' | 'productName' | 'unitPrice'>[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen) {
            setFormData({ buyerStoreId: 0, warehouseId: 0 });
            setOrderItems([{ productId: 0, quantity: 1 }]);
            setErrors({});
        }
    }, [isOpen]);

    const handleItemChange = (index: number, field: keyof Omit<SalesOrderItem, 'id' | 'productName' | 'unitPrice'>, value: number) => {
        const newItems = [...orderItems];
        newItems[index][field] = value;
        setOrderItems(newItems);
    };

    const addItem = () => setOrderItems([...orderItems, { productId: 0, quantity: 1 }]);
    const removeItem = (index: number) => setOrderItems(orderItems.filter((_, i) => i !== index));

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.buyerStoreId) newErrors.buyerStoreId = 'Buyer store is required.';
        if (!formData.warehouseId) newErrors.warehouseId = 'Warehouse is required.';
        if (orderItems.length === 0) newErrors.items = 'At least one item is required.';
        orderItems.forEach((item, index) => {
            if (!item.productId) newErrors[`item_product_${index}`] = 'Product is required.';
            if (item.quantity <= 0) newErrors[`item_quantity_${index}`] = 'Quantity must be positive.';
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({ ...formData, orderItems });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-4xl w-full transform transition-transform duration-300 animate-scaleIn">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h3 className="text-xl font-semibold text-gray-800">Place Sales Order</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"><XIcon className="h-6 w-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Buyer Store</label>
                            <select value={formData.buyerStoreId} onChange={e => setFormData(f => ({ ...f, buyerStoreId: Number(e.target.value) }))} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.buyerStoreId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}>
                                <option value={0} disabled>Select buyer</option>
                                {stores.map(s => <option key={s.id} value={s.id}>{s.storeName}</option>)}
                            </select>
                            {errors.buyerStoreId && <p className="text-xs text-red-600 mt-1">{errors.buyerStoreId}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Warehouse (From)</label>
                            <select value={formData.warehouseId} onChange={e => setFormData(f => ({ ...f, warehouseId: Number(e.target.value) }))} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.warehouseId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}>
                                <option value={0} disabled>Select warehouse</option>
                                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                            </select>
                            {errors.warehouseId && <p className="text-xs text-red-600 mt-1">{errors.warehouseId}</p>}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-lg font-medium text-gray-800 border-b pb-2">Order Items</h4>
                        {orderItems.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-3 items-start">
                                <div className="col-span-8">
                                    <label className="text-xs text-gray-600">Product</label>
                                    <select value={item.productId} onChange={e => handleItemChange(index, 'productId', Number(e.target.value))} className={`w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors[`item_product_${index}`] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}>
                                        <option value={0} disabled>Select a product</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-3">
                                    <label className="text-xs text-gray-600">Quantity</label>
                                    <input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} className={`w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors[`item_quantity_${index}`] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}/>
                                </div>
                                <div className="col-span-1 flex items-end h-full"><button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 h-10 mt-1"><TrashIcon className="h-5 w-5"/></button></div>
                            </div>
                        ))}
                        <button type="button" onClick={addItem} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center px-2 py-1 rounded-md hover:bg-indigo-50"><PlusIcon className="h-4 w-4 mr-1"/>Add Item</button>
                        {errors.items && <p className="text-xs text-red-600 mt-1">{errors.items}</p>}
                    </div>
                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 border border-gray-300 font-medium">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium disabled:bg-indigo-300 disabled:cursor-not-allowed">Place Order</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
