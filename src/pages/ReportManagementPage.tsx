import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AppDispatch, RootState } from '../app/store';
import { fetchInventorySummary, fetchLowStockReport, selectReports } from '../features/reports/reportSlice';
import { fetchInventoryByWarehouse, selectAllInventory } from '../features/inventory/inventorySlice';
import { fetchWarehouses, selectAllWarehouses } from '../features/warehouses/warehouseSlice';
import { PackageIcon, TrendingUpIcon, TrendingDownIcon, DownloadIcon } from '../components/icons';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-10"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
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

// Color palette for the charts
const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6'];

export const ReportManagementPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { inventorySummary, lowStockItems, status, error } = useSelector(selectReports);
    const warehouses = useSelector(selectAllWarehouses);
    const inventory = useSelector(selectAllInventory);
    const inventoryStatus = useSelector((state: RootState) => state.inventory.status);

    const [lowStockThreshold, setLowStockThreshold] = useState(10);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchInventorySummary());
        dispatch(fetchLowStockReport(lowStockThreshold));
        dispatch(fetchWarehouses());
    }, [dispatch, lowStockThreshold]);

    useEffect(() => {
        if (warehouses.length > 0 && !selectedWarehouseId) {
            setSelectedWarehouseId(warehouses[0].id);
        }
    }, [warehouses, selectedWarehouseId]);

    useEffect(() => {
        if (selectedWarehouseId) {
            dispatch(fetchInventoryByWarehouse(selectedWarehouseId));
        }
    }, [dispatch, selectedWarehouseId]);

    const downloadInventorySummaryPDF = () => {
        if (!inventorySummary) return;
        const doc = new jsPDF();
        doc.text("Inventory Summary Report", 14, 16);
        doc.setFontSize(12);
        doc.text(`Total Stock Value: $${inventorySummary.totalStockValue.toLocaleString()}`, 14, 24);
        doc.text(`Total Stock Quantity: ${inventorySummary.totalStockQuantity.toLocaleString()}`, 14, 30);
        doc.text(`Total Products: ${inventorySummary.totalProducts}`, 14, 36);

        autoTable(doc, {
            startY: 42,
            head: [['Warehouse Name', 'Product Count', 'Total Quantity']],
            body: inventorySummary.productsByWarehouse.map(w => [w.warehouseName, w.productCount, w.totalQuantity]),
        });

        doc.save('inventory_summary_report.pdf');
    };

    const downloadDetailedInventoryPDF = () => {
        if (!inventory || !selectedWarehouseId) return;
        const warehouseName = warehouses.find(w => w.id === selectedWarehouseId)?.name || 'Selected Warehouse';
        const doc = new jsPDF();
        doc.text(`Detailed Inventory Report for ${warehouseName}`, 14, 16);

        autoTable(doc, {
            startY: 22,
            head: [['Product Name', 'SKU', 'Quantity']],
            body: inventory.map(item => [item.productName, item.productSku, item.quantity]),
        });

        doc.save(`detailed_inventory_${warehouseName.replace(/\s+/g, '_')}.pdf`);
    };

    const downloadLowStockPDF = () => {
        if (!lowStockItems) return;
        const doc = new jsPDF();
        doc.text(`Low Stock Report (Threshold: ${lowStockThreshold})`, 14, 16);

        autoTable(doc, {
            startY: 22,
            head: [['Product Name', 'SKU', 'Warehouse', 'Supplier', 'Current Quantity']],
            body: lowStockItems.map(item => [item.productName, item.sku, item.warehouseName, item.supplierName, item.currentQuantity]),
        });

        doc.save('low_stock_report.pdf');
    };

    if (status === 'loading' && !inventorySummary) {
        return <LoadingSpinner />;
    }

    if (status === 'failed') {
        return <div className="text-center p-8 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>;
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                    <p className="mt-1 text-sm text-gray-500">Analytics and insights for your business.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title="Total Stock Value" value={`$${inventorySummary?.totalStockValue.toLocaleString() || 0}`} icon={TrendingUpIcon} />
                <StatCard title="Total Stock Quantity" value={inventorySummary?.totalStockQuantity.toLocaleString() || 0} icon={PackageIcon} />
                <StatCard title="Low Stock Items" value={lowStockItems.length} icon={TrendingDownIcon} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* --- MODIFIED: Stock Quantity by Warehouse Chart --- */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Stock Quantity by Warehouse</h2>
                        <button onClick={downloadInventorySummaryPDF} className="text-indigo-600 hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-50">
                            <DownloadIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={inventorySummary?.productsByWarehouse} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="warehouseName" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="totalQuantity" name="Total Quantity" fill="#8884d8">
                                {inventorySummary?.productsByWarehouse.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Low Stock Report</h2>
                        <button onClick={downloadLowStockPDF} className="text-indigo-600 hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-50">
                            <DownloadIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="flex justify-end items-center mb-4">
                        <label className="text-sm font-medium text-gray-700 mr-2">Threshold:</label>
                        <input type="number" value={lowStockThreshold} onChange={e => setLowStockThreshold(Number(e.target.value))} className="w-20 px-2 py-1 border border-gray-300 rounded-md"/>
                    </div>
                    <div className="overflow-y-auto h-64">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {lowStockItems.map(item => (
                                <tr key={`${item.productId}-${item.warehouseName}`}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{item.productName}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.warehouseName}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-red-600 font-bold text-right">{item.currentQuantity}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- NEW: Detailed Product Inventory Section --- */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 md:mb-0">Product Stock by Warehouse</h2>
                    <div className="flex items-center gap-4">
                        <select
                            value={selectedWarehouseId || ''}
                            onChange={e => setSelectedWarehouseId(Number(e.target.value))}
                            className="block w-full md:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {warehouses.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                        <button onClick={downloadDetailedInventoryPDF} disabled={!inventory || inventory.length === 0} className="text-indigo-600 hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-50 disabled:text-gray-400 disabled:cursor-not-allowed">
                            <DownloadIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                {inventoryStatus === 'loading' ? <LoadingSpinner /> : (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={inventory} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="productName" width={150} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="quantity" name="Stock Quantity">
                                {inventory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
