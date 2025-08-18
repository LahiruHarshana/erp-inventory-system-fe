import { useSelector } from 'react-redux';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/common/Table';
import type {RootState} from "../../app/store.ts";

const SupplyChainCoordinatorDashboard = () => {
    const { purchaseOrders } = useSelector((state: RootState) => state.inventory);
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Supply Chain Overview</h2>
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-700">Purchase Orders</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Create New PO
                    </button>
                </div>
                <Table
                    headers={['Order ID', 'Supplier', 'Date', 'Status', 'Total', 'Actions']}
                    data={purchaseOrders}
                    renderRow={(po) => (
                        <tr key={po.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{po.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{po.supplier}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{po.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={po.status} /></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{po.total}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href="#" className="text-indigo-600 hover:text-indigo-900">View Details</a>
                            </td>
                        </tr>
                    )}
                />
            </section>
        </div>
    );
};

export default SupplyChainCoordinatorDashboard;
