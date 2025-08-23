import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchPurchaseOrders, addNewPurchaseOrder, receiveOrder, processPayment } from '../features/purchaseOrders/purchaseOrderSlice';
import { fetchProducts, selectAllProducts } from '../features/products/productSlice';
import { fetchSuppliers, selectAllSuppliers } from '../features/suppliers/supplierSlice';
import { fetchWarehouses, selectAllWarehouses } from '../features/warehouses/warehouseSlice';
import type { NewPurchaseOrder, PurchaseOrder, Payment } from '../types';
import { OrderStatus } from '../types';
import { PlusIcon, ShoppingCartIcon } from '../components/icons';
import { PurchaseOrderModal } from '../features/purchaseOrders/PurchaseOrderModal';
import { ReceiveOrderModal } from '../features/purchaseOrders/ReceiveOrderModal';
import { PaymentModal } from '../features/purchaseOrders/PaymentModal';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-10"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
);

const statusColors: { [key in OrderStatus]: string } = {
    [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
    [OrderStatus.SHIPPED]: 'bg-cyan-100 text-cyan-800',
    [OrderStatus.RECEIVED]: 'bg-green-100 text-green-800',
    [OrderStatus.DELIVERED]: 'bg-emerald-100 text-emerald-800',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
    [OrderStatus.RETURNED]: 'bg-orange-100 text-orange-800',
};

export const PurchaseOrderManagementPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: orders, status, error } = useSelector((state: RootState) => state.purchaseOrders);
    const products = useSelector(selectAllProducts);
    const suppliers = useSelector(selectAllSuppliers);
    const warehouses = useSelector(selectAllWarehouses);
    const dataStatus = useSelector((state: RootState) => ({
        products: state.products.status,
        suppliers: state.suppliers.status,
        warehouses: state.warehouses.status,
    }));

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isReceiveModalOpen, setReceiveModalOpen] = useState(false);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

    useEffect(() => {
        if (status === 'idle') dispatch(fetchPurchaseOrders());
        if (dataStatus.products === 'idle') dispatch(fetchProducts());
        if (dataStatus.suppliers === 'idle') dispatch(fetchSuppliers());
        if (dataStatus.warehouses === 'idle') dispatch(fetchWarehouses());
    }, [status, dataStatus, dispatch]);

    const handleCreateSubmit = (orderData: NewPurchaseOrder) => dispatch(addNewPurchaseOrder(orderData));
    const handleReceiveSubmit = (warehouseId: number) => {
        if (selectedOrder) dispatch(receiveOrder({ id: selectedOrder.id, warehouseId }));
    };
    const handlePaymentSubmit = (paymentData: Payment) => {
        if (selectedOrder) dispatch(processPayment({ id: selectedOrder.id, paymentData }));
    };

    const openReceiveModal = (order: PurchaseOrder) => {
        setSelectedOrder(order);
        setReceiveModalOpen(true);
    };

    const openPaymentModal = (order: PurchaseOrder) => {
        setSelectedOrder(order);
        setPaymentModalOpen(true);
    };

    const renderContent = () => {
        if (Object.values(dataStatus).includes('loading')) return <LoadingSpinner />;
        if (status === 'failed') return <div className="text-center p-8 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>;

        return (
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="bg-white shadow-sm rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-indigo-600">PO #{order.id}</p>
                                <p className="text-lg font-bold text-gray-800">{order.supplierName}</p>
                                <p className="text-sm text-gray-500">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>{order.status}</span>
                            </div>
                        </div>
                        <div className="mt-4 border-t pt-2 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Items:</p>
                                <ul className="text-sm text-gray-500 list-disc list-inside">
                                    {order.orderItems.map(item => (
                                        <li key={item.id}>{item.productName} (x{item.quantity})</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-x-2">
                                {order.status === OrderStatus.PENDING && (
                                    <button
                                        onClick={() => openReceiveModal(order)}
                                        disabled={status === 'loading'}
                                        className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                    >
                                        {status === 'loading' ? 'Processing...' : 'Receive'}
                                    </button>
                                )}
                                {order.status === OrderStatus.RECEIVED && (
                                    <button
                                        onClick={() => openPaymentModal(order)}
                                        disabled={status === 'loading'}
                                        className="text-sm bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed"
                                    >
                                        {status === 'loading' ? 'Processing...' : 'Pay'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage all company purchase orders.</p>
                </div>
                <button onClick={() => setCreateModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm font-medium flex items-center">
                    <PlusIcon className="h-5 w-5 mr-2"/> Create New Order
                </button>
            </header>
            <main>{renderContent()}</main>
            <PurchaseOrderModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onSubmit={handleCreateSubmit} products={products} suppliers={suppliers} />
            <ReceiveOrderModal isOpen={isReceiveModalOpen} onClose={() => setReceiveModalOpen(false)} onSubmit={handleReceiveSubmit} warehouses={warehouses} />
            <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} onSubmit={handlePaymentSubmit} />
        </div>
    );
};
