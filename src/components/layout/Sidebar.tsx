import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { setView, selectActiveView } from '../../features/ui/uiSlice';
import type { AppDispatch, RootState } from '../../app/store';
import {
    BarChartIcon,
    BuildingIcon,
    EditIcon,
    HomeIcon, LogOutIcon,
    PackageIcon,
    ShoppingCartIcon,
    TruckIcon} from "../icons";

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
        { name: 'Categories', view: 'categories', icon: EditIcon, role: ['ROLE_INVENTORY_MANAGER'] },
        { name: 'Inventory', view: 'inventory', icon: PackageIcon, role: ['ROLE_INVENTORY_MANAGER'] },
        { name: 'Reports', view: 'reports', icon: BarChartIcon, role: ['ROLE_INVENTORY_MANAGER', 'ROLE_BUSINESS_OWNER'] },
        { name: 'Purchase Orders', view: 'purchaseOrders', icon:ShoppingCartIcon, this: ShoppingCartIcon, role: ['ROLE_SUPPLY_CHAIN_COORDINATOR'] },
        { name: 'Products', view: 'products', icon: ShoppingCartIcon, role: ['ROLE_INVENTORY_MANAGER']},
        { name: 'Suppliers', view: 'suppliers', icon: TruckIcon, role: ['ROLE_SUPPLY_CHAIN_COORDINATOR'] },
        // { name: 'Users', view: 'users', icon: UsersIcon, role: ['ROLE_BUSINESS_OWNER'] },
        { name: 'Warehouses', view: 'warehouses', icon: BuildingIcon, role: ['ROLE_INVENTORY_MANAGER'] },
        { name: 'Forcecasting', view: 'forcecasting', icon: BuildingIcon, role: ['ROLE_INVENTORY_MANAGER','ROLE_BUSINESS_OWNER','ROLE_SUPPLY_CHAIN_COORDINATOR'] },
        { name: 'Sales', view: 'sales', icon: BuildingIcon, role: ['ROLE_SUPPLY_CHAIN_COORDINATOR'] }
    ];

    return (
        <div className="flex flex-col w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl h-screen sticky top-0">
            <div className="flex items-center justify-center h-16 border-b border-gray-700/50">
                <PackageIcon className="w-6 h-6 text-blue-400" />
                <span className="ml-2 text-xl font-semibold tracking-tight">ERP System</span>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
                <nav className="space-y-1">
                    {navigation
                        .filter(item => currentRole && item.role.includes(currentRole))
                        .map(item => (
                            <button
                                key={item.name}
                                onClick={() => dispatch(setView(item.view as any))}
                                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out ${
                                    activeView === item.view
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-sm'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="ml-3">{item.name}</span>
                            </button>
                        ))}
                </nav>
            </div>
            <div className="p-3 border-t border-gray-700/50">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-300 hover:bg-red-600/50 hover:text-white transition-all duration-200"
                >
                    <LogOutIcon className="w-5 h-5" />
                    <span className="ml-3">Logout</span>
                </button>
            </div>
        </div>
    );
};