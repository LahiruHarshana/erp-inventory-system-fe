import React, { useState, useEffect } from 'react';
import { XIcon } from '../../components/icons';
import type { Payment } from '../../types';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (paymentData: Payment) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [paymentData, setPaymentData] = useState<Payment>({ transactionId: '', paymentMethod: 'Credit Card' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen) {
            setPaymentData({ transactionId: '', paymentMethod: 'Credit Card' });
            setErrors({});
        }
    }, [isOpen]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!paymentData.transactionId.trim()) newErrors.transactionId = 'Transaction ID is required.';
        if (!paymentData.paymentMethod) newErrors.paymentMethod = 'Payment method is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(paymentData);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h3 className="text-xl font-semibold text-gray-800">Process Payment</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><XIcon className="h-6 w-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <select value={paymentData.paymentMethod} onChange={e => setPaymentData(p => ({...p, paymentMethod: e.target.value}))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Credit Card</option>
                            <option>Bank Transfer</option>
                            <option>PayPal</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                        <input type="text" value={paymentData.transactionId} onChange={e => setPaymentData(p => ({...p, transactionId: e.target.value}))} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.transactionId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}/>
                        {errors.transactionId && <p className="text-xs text-red-600 mt-1">{errors.transactionId}</p>}
                    </div>
                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 border border-gray-300 font-medium">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium">Submit Payment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
