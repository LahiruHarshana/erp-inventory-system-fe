import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Legend as PieLegend } from 'recharts';
import type { RootState, AppDispatch } from '../../app/store';
import { OrderStatus } from '../../types';
import { TruckIcon, ShoppingCartIcon, PackageIcon } from '../../components/icons';
import {fetchProducts} from "../products/productSlice.ts";
import {fetchSuppliers} from "../suppliers/supplierSlice.ts";
import {fetchPurchaseOrders} from "../purchaseOrders/purchaseOrderSlice.ts";

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full p-10">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
);

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="bg-indigo-100 text-indigo-600 rounded-full p-3">
            <Icon className="h-6 w-6" />
        </div>
    </div>
);

export const SupplyChainCoordinatorDashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { items: products, status: productsStatus } = useSelector((state: RootState) => state.products);
    const { items: suppliers, status: suppliersStatus } = useSelector((state: RootState) => state.suppliers);
    const { items: purchaseOrders, status: poStatus } = useSelector((state: RootState) => state.purchaseOrders);

    useEffect(() => {
        if (productsStatus === 'idle') dispatch(fetchProducts());
        if (suppliersStatus === 'idle') dispatch(fetchSuppliers());
        if (poStatus === 'idle') dispatch(fetchPurchaseOrders());
    }, [productsStatus, suppliersStatus, poStatus, dispatch]);

    const productsBySupplier = useMemo(() => {
        if (suppliersStatus !== 'succeeded' || productsStatus !== 'succeeded') return [];
        return suppliers.map(supplier => ({
            name: supplier.name,
            value: products.filter(p => p.supplierId === supplier.id).length,
        })).filter(s => s.value > 0);
    }, [products, suppliers, productsStatus, suppliersStatus]);

    const orderStatusData = useMemo(() => {
        if (poStatus !== 'succeeded') return [];
        const statusCounts = Object.values(OrderStatus).reduce((acc, status) => {
            acc[status] = 0;
            return acc;
        }, {} as Record<OrderStatus, number>);

        purchaseOrders.forEach(order => {
            if (statusCounts[order.status] !== undefined) {
                statusCounts[order.status]++;
            }
        });

        return Object.entries(statusCounts).map(([name, value]) => ({ name, count: value }));
    }, [purchaseOrders, poStatus]);

    const recentOrders = useMemo(() => {
        return [...purchaseOrders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).slice(0, 5);
    }, [purchaseOrders]);

    const COLORS = ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE'];

    if ([productsStatus, suppliersStatus, poStatus].includes('loading')) {
        return <LoadingSpinner />;
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Supply Chain Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title="Total Suppliers" value={suppliers.length} icon={TruckIcon} />
                <StatCard title="Pending Orders" value={purchaseOrders.filter(o => o.status === OrderStatus.PENDING).length} icon={ShoppingCartIcon} />
                <StatCard title="Total Products" value={products.length} icon={PackageIcon} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Purchase Order Status</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={orderStatusData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#4F46E5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Products by Supplier</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={productsBySupplier} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                {productsBySupplier.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <PieLegend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Purchase Orders</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {recentOrders.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">PO #{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.supplierName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{order.status}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right font-semibold">${order.totalAmount.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
