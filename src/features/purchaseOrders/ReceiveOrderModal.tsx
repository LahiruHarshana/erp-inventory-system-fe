import React, { useState, useEffect } from 'react';
import { XIcon } from '../../components/icons';
import type { Warehouse } from '../../types';

interface ReceiveOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (warehouseId: number) => void;
    warehouses: Warehouse[];
}

export const ReceiveOrderModal: React.FC<ReceiveOrderModalProps> = ({ isOpen, onClose, onSubmit, warehouses }) => {
    const [warehouseId, setWarehouseId] = useState<number>(0);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setWarehouseId(warehouses[0]?.id || 0);
            setError('');
        }
    }, [isOpen, warehouses]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!warehouseId || warehouseId === 0) {
            setError('Please select a warehouse.');
            return;
        }
        onSubmit(warehouseId);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h3 className="text-xl font-semibold text-gray-800">Receive Purchase Order</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><XIcon className="h-6 w-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Warehouse</label>
                        <select value={warehouseId} onChange={e => setWarehouseId(Number(e.target.value))} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}>
                            <option value={0} disabled>Choose a warehouse...</option>
                            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                    </div>
                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 border border-gray-300 font-medium">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium">Confirm Reception</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
