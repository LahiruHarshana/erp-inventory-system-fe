import React, { useState, useEffect } from 'react';
import { XIcon, PlusIcon, TrashIcon } from '../../components/icons';
import type {NewPurchaseOrder, Product, PurchaseOrderItem, Supplier} from "../../types";

interface PurchaseOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (orderData: NewPurchaseOrder) => void;
    products: Product[];
    suppliers: Supplier[];
}

export const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({ isOpen, onClose, onSubmit, products, suppliers }) => {
    const [supplierId, setSupplierId] = useState<number>(0);
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
    const [orderItems, setOrderItems] = useState<Omit<PurchaseOrderItem, 'id' | 'productName'>[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen) {
            setSupplierId(suppliers[0]?.id || 0);
            setExpectedDeliveryDate('');
            setOrderItems([{ productId: 0, quantity: 1, unitPrice: 0 }]);
            setErrors({});
        }
    }, [isOpen, suppliers]);

    const handleItemChange = (index: number, field: keyof Omit<PurchaseOrderItem, 'id' | 'productName'>, value: string | number) => {
        const newItems = [...orderItems];
        const numericValue = Number(value) || 0;

        if (field === 'productId') {
            const product = products.find(p => p.id === numericValue);
            newItems[index] = { ...newItems[index], productId: numericValue, unitPrice: product?.unitPrice || 0 };
        } else {
            (newItems[index] as any)[field] = numericValue;
        }
        setOrderItems(newItems);
    };

    const addItem = () => {
        setOrderItems([...orderItems, { productId: 0, quantity: 1, unitPrice: 0 }]);
    };

    const removeItem = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!supplierId || supplierId === 0) newErrors.supplierId = 'Supplier is required.';
        if (!expectedDeliveryDate) newErrors.expectedDeliveryDate = 'Expected delivery date is required.';
        if (orderItems.length === 0) newErrors.items = 'At least one item is required.';
        orderItems.forEach((item, index) => {
            if (!item.productId || item.productId === 0) newErrors[`item_product_${index}`] = 'Product is required.';
            if (item.quantity <= 0) newErrors[`item_quantity_${index}`] = 'Quantity must be positive.';
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const finalOrderItems = orderItems.map(({ productId, quantity, unitPrice }) => ({ productId, quantity, unitPrice }));
            onSubmit({ supplierId, expectedDeliveryDate, orderItems: finalOrderItems });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-4xl w-full transform transition-transform duration-300 animate-scaleIn">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h3 className="text-xl font-semibold text-gray-800">Create Purchase Order</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"><XIcon className="h-6 w-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Supplier</label>
                            <select value={supplierId} onChange={e => setSupplierId(Number(e.target.value))} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.supplierId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}>
                                <option value={0} disabled>Select a supplier</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.supplierId && <p className="text-xs text-red-600 mt-1">{errors.supplierId}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
                            <input type="date" value={expectedDeliveryDate} onChange={e => setExpectedDeliveryDate(e.target.value)} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.expectedDeliveryDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}/>
                            {errors.expectedDeliveryDate && <p className="text-xs text-red-600 mt-1">{errors.expectedDeliveryDate}</p>}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-lg font-medium text-gray-800 border-b pb-2">Order Items</h4>
                        {orderItems.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-3 items-start">
                                <div className="col-span-12 sm:col-span-5">
                                    <label className="text-xs text-gray-600">Product</label>
                                    <select value={item.productId} onChange={e => handleItemChange(index, 'productId', Number(e.target.value))} className={`w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors[`item_product_${index}`] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}>
                                        <option value={0} disabled>Select a product</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="text-xs text-gray-600">Quantity</label>
                                    <input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className={`w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors[`item_quantity_${index}`] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}/>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="text-xs text-gray-600">Unit Price</label>
                                    <input type="number" step="0.01" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"/>
                                </div>
                                <div className="col-span-12 sm:col-span-1 flex items-end justify-end sm:justify-center h-full">
                                    <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 h-10 mt-1"><TrashIcon className="h-5 w-5"/></button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addItem} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center px-2 py-1 rounded-md hover:bg-indigo-50">
                            <PlusIcon className="h-4 w-4 mr-1"/>Add Item
                        </button>
                        {errors.items && <p className="text-xs text-red-600 mt-1">{errors.items}</p>}
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 border border-gray-300 font-medium">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium disabled:bg-indigo-300 disabled:cursor-not-allowed">Create Order</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
