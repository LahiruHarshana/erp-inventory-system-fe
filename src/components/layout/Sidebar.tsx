import { useSelector } from 'react-redux';
import { HomeIcon, PackageIcon, BarChartIcon, ShoppingCartIcon, UsersIcon, BuildingIcon, TruckIcon, LogOutIcon } from '../icons';
import type {RootState} from "../../app/store.ts";

const Sidebar = () => {
    const currentRole = useSelector((state: RootState) => state.user.role);

    const navigation = [
        { name: 'Dashboard', icon: HomeIcon, role: ['Inventory Manager', 'Business Owner', 'Supply Chain Coordinator'] },
        { name: 'Inventory', icon: PackageIcon, role: ['Inventory Manager'] },
        { name: 'Reports', icon: BarChartIcon, role: ['Inventory Manager', 'Business Owner'] },
        { name: 'Purchase Orders', icon: ShoppingCartIcon, role: ['Inventory Manager', 'Supply Chain Coordinator'] },
        { name: 'Suppliers', icon: TruckIcon, role: ['Supply Chain Coordinator'] },
        { name: 'Company', icon: BuildingIcon, role: ['Business Owner'] },
        { name: 'Users', icon: UsersIcon, role: ['Business Owner'] },
    ];

    return (
        <div className="flex flex-col w-64 bg-gray-800 text-gray-100">
            <div className="flex items-center justify-center h-20 border-b border-gray-700">
                <PackageIcon className="h-8 w-8 text-blue-400" />
                <span className="ml-3 text-2xl font-bold">ERP System</span>
            </div>
            <div className="flex-1 overflow-y-auto">
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navigation.filter(item => item.role.includes(currentRole)).map(item => (
                        <a key={item.name} href="#" className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-700">
                            <item.icon className="h-6 w-6 mr-3" />
                            {item.name}
                        </a>
                    ))}
                </nav>
            </div>
            <div className="p-4 border-t border-gray-700">
                <a href="#" className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-700">
                    <LogOutIcon className="h-6 w-6 mr-3" />
                    Logout
                </a>
            </div>
        </div>
    );
};

export default Sidebar;