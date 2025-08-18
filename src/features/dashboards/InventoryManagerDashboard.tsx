import { useSelector } from 'react-redux';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/common/Table';
import { PackageIcon, BarChartIcon, ShoppingCartIcon, TruckIcon } from '../../components/icons';
import type {RootState} from "../../app/store.ts";

const InventoryManagerDashboard = () => {
    const { items, purchaseOrders } = useSelector((state: RootState) => state.inventory);

    return (
        <div className="space-y-8">
            <section>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card title="Total Inventory Items" value={items.length.toString()} icon={<PackageIcon className="h-6 w-6"/>} change="+5.4%" changeType="increase" />
                    <Card title="Items Low in Stock" value={items.filter(i => i.status === 'Low Stock').length.toString()} icon={<BarChartIcon className="h-6 w-6"/>} change="-2.1%" changeType="decrease" />
                    <Card title="Stockouts This Month" value={items.filter(i => i.status === 'Out of Stock').length.toString()} icon={<ShoppingCartIcon className="h-6 w-6"/>} change="+1.2%" changeType="increase" />
                    <Card title="Pending POs" value={purchaseOrders.filter(po => po.status === 'Processing').length.toString()} icon={<TruckIcon className="h-6 w-6"/>} />
                </div>
            </section>
            <section>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Inventory Status</h2>
                <Table
                    headers={['Product ID', 'Name', 'Category', 'Stock', 'Status', 'Actions']}
                    data={items}
                    renderRow={(item) => (
                        <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stock}</td>
                            <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
                            </td>
                        </tr>
                    )}
                />
            </section>
        </div>
    );
};

export default InventoryManagerDashboard;