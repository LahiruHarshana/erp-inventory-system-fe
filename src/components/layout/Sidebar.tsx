import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { setView, selectActiveView } from '../../features/ui/uiSlice';
import type { AppDispatch, RootState } from '../../app/store';
const HomeIcon = () => <span>🏠</span>;
const PackageIcon = () => <span>📦</span>;
const BarChartIcon = () => <span>📊</span>;
const ShoppingCartIcon = () => <span>🛒</span>;
const UsersIcon = () => <span>👥</span>;
const BuildingIcon = () => <span>🏢</span>;
const TruckIcon = () => <span>🚚</span>;
const LogOutIcon = () => <span>🚪</span>;
const CategoryIcon = () => <span>🏷️</span>;


export const Sidebar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentRole = useSelector((state: RootState) => state.auth.user?.role);
    const activeView = useSelector(selectActiveView);

    const handleLogout = () => {
        dispatch(logout());
    };

    const navigation = [
        { name: 'Dashboard', view: 'dashboard', icon: HomeIcon, role: ['ROLE_INVENTORY_MANAGER', 'ROLE_BUSINESS_OWNER', 'ROLE_SUPPLY_CHAIN_COORDINATOR'] },
        { name: 'Stores', view: 'stores', icon: BuildingIcon, role: ['ROLE_BUSINESS_OWNER'] },
        { name: 'Categories', view: 'categories', icon: CategoryIcon, role: ['ROLE_INVENTORY_MANAGER'] },
        { name: 'Inventory', view: 'inventory', icon: PackageIcon, role: ['ROLE_INVENTORY_MANAGER'] },
        { name: 'Reports', view: 'reports', icon: BarChartIcon, role: ['ROLE_INVENTORY_MANAGER', 'ROLE_BUSINESS_OWNER'] },
        { name: 'Purchase Orders', view: 'purchaseOrders', icon: ShoppingCartIcon, role: ['ROLE_INVENTORY_MANAGER', 'ROLE_SUPPLY_CHAIN_COORDINATOR'] },
        { name: 'Suppliers', view: 'suppliers', icon: TruckIcon, role: ['SUPPLY_CHAIN_COORDINATOR'] },
        { name: 'Users', view: 'users', icon: UsersIcon, role: ['ROLE_BUSINESS_OWNER'] },
    ];

    return (
        <div className="flex flex-col w-64 bg-gray-800 text-gray-100">
            <div className="flex items-center justify-center h-20 border-b border-gray-700">
                <PackageIcon />
                <span className="ml-3 text-2xl font-bold">ERP System</span>
            </div>
            <div className="flex-1 overflow-y-auto">
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navigation.filter(item => currentRole && item.role.includes(currentRole)).map(item => (
                        <button
                            key={item.name}
                            onClick={() => dispatch(setView(item.view as any))}
                            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeView === item.view ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                        >
                            <item.icon />
                            <span className="ml-3">{item.name}</span>
                        </button>
                    ))}
                </nav>
            </div>
            <div className="p-4 border-t border-gray-700">
                <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                    <LogOutIcon />
                    <span className="ml-3">Logout</span>
                </button>
            </div>
        </div>
    );
};
