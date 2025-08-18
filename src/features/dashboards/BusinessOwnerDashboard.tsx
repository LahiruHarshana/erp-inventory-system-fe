import React from 'react';
import Card from '../../components/common/Card';
import { BarChartIcon, PackageIcon, ShoppingCartIcon, UsersIcon } from '../../components/icons';

const BusinessOwnerDashboard = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Business Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Total Revenue" value="$1.2M" icon={<BarChartIcon className="h-6 w-6"/>} change="+12.5%" changeType="increase" />
                <Card title="Profit Margin" value="24%" icon={<PackageIcon className="h-6 w-6"/>} change="+2.1%" changeType="increase" />
                <Card title="Total Orders" value="8,450" icon={<ShoppingCartIcon className="h-6 w-6"/>} change="+8.3%" changeType="increase" />
                <Card title="Active Users" value="1,200" icon={<UsersIcon className="h-6 w-6"/>} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-800">Sales vs. Inventory Value</h3>
                <p className="text-gray-500 mt-2">Charts and detailed analytics for business owners will be displayed here.</p>
                {/* Placeholder for a chart library like Recharts or Chart.js */}
            </div>
        </div>
    );
};

export default BusinessOwnerDashboard;