import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import type { RootState, AppDispatch } from '../app/store';
import { fetchSalesOrders, placeNewSalesOrder, shipOrder, payForOrder } from '../features/salesOrders/salesOrderSlice';
import { fetchProducts, selectAllProducts } from '../features/products/productSlice';
import { fetchStores, selectAllStores } from '../features/stores/storeSlice';
import { fetchWarehouses, selectAllWarehouses } from '../features/warehouses/warehouseSlice';
import type { PlaceSalesOrder, SalesOrder, Payment } from '../types';
import { SalesStatus } from '../types';
import { PlusIcon, ShoppingCartIcon, SearchIcon, ExclamationIcon } from '../components/icons';
import { SalesOrderModal } from '../features/salesOrders/SalesOrderModal';
import { PaymentModal } from '../features/purchaseOrders/PaymentModal';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-10"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
);

const EmptyState: React.FC<{ onAddNew: () => void }> = ({ onAddNew }) => (
    <div className="text-center p-8 bg-white rounded-lg">
        <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No sales orders found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by placing a new sales order.</p>
        <div className="mt-6">
            <button onClick={onAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm font-medium inline-flex items-center">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Place New Order
            </button>
        </div>
    </div>
);

const statusColors: { [key in SalesStatus]: string } = {
    [SalesStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [SalesStatus.SHIPPED]: 'bg-blue-100 text-blue-800',
    [SalesStatus.CANCELLED]: 'bg-red-100 text-red-800',
};

export const SalesOrderManagementPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: orders, status, error } = useSelector((state: RootState) => state.salesOrders);
    const products = useSelector(selectAllProducts);
    const stores = useSelector(selectAllStores);
    const warehouses = useSelector(selectAllWarehouses);
    const dataStatus = useSelector((state: RootState) => ({
        products: state.products.status,
        stores: state.stores.status,
        warehouses: state.warehouses.status,
    }));

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (status === 'idle') dispatch(fetchSalesOrders());
        if (dataStatus.products === 'idle') dispatch(fetchProducts());
        if (dataStatus.stores === 'idle') dispatch(fetchStores());
        if (dataStatus.warehouses === 'idle') dispatch(fetchWarehouses());
    }, [status, dataStatus, dispatch]);

    useEffect(() => {
        if (status === 'failed' && error) {
            toast.error(`Error: ${error}`);
        }
    }, [status, error]);

    const filteredOrders = useMemo(() => {
        if (!searchQuery) return orders;
        const lowercasedQuery = searchQuery.toLowerCase();
        return orders.filter(order => {
            const storeName = stores.find(s => s.id === order.buyerStoreId)?.storeName || '';
            return storeName.toLowerCase().includes(lowercasedQuery) || String(order.id).includes(lowercasedQuery);
        });
    }, [orders, searchQuery, stores]);

    const handleCreateSubmit = (orderData: PlaceSalesOrder) => {
        toast.promise(dispatch(placeNewSalesOrder(orderData)).unwrap(), {
            loading: 'Placing new order...',
            success: 'Sales order placed successfully!',
            error: (err) => err || 'Failed to place order.',
        });
    };

    const handleShipOrder = (id: number) => {
        toast((t) => (
            <div className="flex flex-col items-center gap-3 p-2">
                <div className="flex items-center">
                    <ExclamationIcon className="h-8 w-8 text-blue-500 mr-3" />
                    <div className="text-left">
                        <p className="font-bold text-gray-800">Confirm Shipment</p>
                        <p className="text-sm text-gray-600">Are you sure you want to mark this order as shipped?</p>
                    </div>
                </div>
                <div className="w-full flex justify-end gap-2">
                    <button onClick={() => toast.dismiss(t.id)} className="px-4 py-1.5 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300">
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            toast.promise(dispatch(shipOrder(id)).unwrap(), {
                                loading: 'Updating order status...',
                                success: `Order #${id} marked as shipped!`,
                                error: (err) => err || 'Failed to ship order.',
                            });
                        }}
                        className="px-4 py-1.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        ), { duration: 6000 });
    };

    const handlePaymentSubmit = (paymentData: Payment) => {
        if (selectedOrder) {
            toast.promise(dispatch(payForOrder({ id: selectedOrder.id, paymentData })).unwrap(), {
                loading: 'Processing payment...',
                success: `Payment for order #${selectedOrder.id} processed!`,
                error: (err) => err || 'Failed to process payment.',
            });
            setPaymentModalOpen(false);
        }
    };

    const openPaymentModal = (order: SalesOrder) => {
        setSelectedOrder(order);
        setPaymentModalOpen(true);
    };

    const renderContent = () => {
        const isLoading = status === 'loading' || Object.values(dataStatus).includes('loading');
        if (isLoading && orders.length === 0) return <LoadingSpinner />;
        if (status === 'failed' && orders.length === 0) return <div className="text-center p-8 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>;
        if (!isLoading && orders.length === 0) return <EmptyState onAddNew={() => setCreateModalOpen(true)} />;

        return (
            <div className="space-y-4">
                {filteredOrders.length > 0 ? filteredOrders.map(order => (
                    <div key={order.id} className="bg-white shadow-sm rounded-lg p-4 transition-shadow hover:shadow-md">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-indigo-600">SO #{order.id}</p>
                                <p className="text-lg font-bold text-gray-800">Buyer: {stores.find(s => s.id === order.buyerStoreId)?.storeName || 'N/A'}</p>
                                <p className="text-sm text-gray-500">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>{order.status}</span>
                            </div>
                        </div>
                        <div className="mt-4 border-t pt-2 flex justify-between items-center">
                            <ul className="text-sm text-gray-500 list-disc list-inside">
                                {order.orderItems.map(item => (
                                    <li key={item.id}>{products.find(p => p.id === item.productId)?.name || 'N/A'} (x{item.quantity})</li>
                                ))}
                            </ul>
                            <div className="space-x-2">
                                {order.status === SalesStatus.PENDING && (
                                    <button onClick={() => handleShipOrder(order.id)} className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                                        Ship Order
                                    </button>
                                )}
                                {order.status === SalesStatus.SHIPPED && (
                                    <button onClick={() => openPaymentModal(order)} className="text-sm bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">
                                        Process Payment
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center p-8 bg-white rounded-lg">
                        <p className="text-gray-500">No sales orders found{searchQuery && ` for "${searchQuery}"`}.</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Sales Orders</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage all company sales orders.</p>
                </div>
                <button onClick={() => setCreateModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm font-medium flex items-center w-full md:w-auto justify-center">
                    <PlusIcon className="h-5 w-5 mr-2"/> Place New Order
                </button>
            </header>

            <div className="mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by SO number or buyer name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <main>{renderContent()}</main>

            {isCreateModalOpen && <SalesOrderModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onSubmit={handleCreateSubmit} products={products} stores={stores} warehouses={warehouses} />}
            {selectedOrder && isPaymentModalOpen && <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} onSubmit={handlePaymentSubmit} orderAmount={selectedOrder.totalAmount}/>}
        </div>
    );
};
