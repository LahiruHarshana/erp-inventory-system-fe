import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
// Assuming icons are in a central place
// import { HomeIcon, PackageIcon, BarChartIcon, ShoppingCartIcon, UsersIcon, BuildingIcon, TruckIcon, LogOutIcon } from '../icons';

// Mock Icons for standalone example
const HomeIcon = () => <span>🏠</span>;
const PackageIcon = () => <span>📦</span>;
const BarChartIcon = () => <span>📊</span>;
const ShoppingCartIcon = () => <span>🛒</span>;
const UsersIcon = () => <span>👥</span>;
const BuildingIcon = () => <span>🏢</span>;
const TruckIcon = () => <span>🚚</span>;
const LogOutIcon = () => <span>🚪</span>;


export const Sidebar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentRole = useSelector((state: RootState) => state.auth.user?.role);

    const handleLogout = () => {
        dispatch(logout());
    };

    const navigation = [
        { name: 'Dashboard', icon: HomeIcon, role: ['INVENTORY_MANAGER', 'BUSINESS_OWNER', 'SUPPLY_CHAIN_COORDINATOR'] },
        { name: 'Stores', icon: BuildingIcon, role: ['BUSINESS_OWNER'] },
        { name: 'Inventory', icon: PackageIcon, role: ['INVENTORY_MANAGER'] },
        { name: 'Reports', icon: BarChartIcon, role: ['INVENTORY_MANAGER', 'BUSINESS_OWNER'] },
        { name: 'Purchase Orders', icon: ShoppingCartIcon, role: ['INVENTORY_MANAGER', 'SUPPLY_CHAIN_COORDINATOR'] },
        { name: 'Suppliers', icon: TruckIcon, role: ['SUPPLY_CHAIN_COORDINATOR'] },
        { name: 'Users', icon: UsersIcon, role: ['BUSINESS_OWNER'] },
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
                        <a key={item.name} href="#" className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-700 bg-gray-900">
                            <item.icon />
                            <span className="ml-3">{item.name}</span>
                        </a>
                    ))}
                </nav>
            </div>
            <div className="p-4 border-t border-gray-700">
                <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-700">
                    <LogOutIcon />
                    <span className="ml-3">Logout</span>
                </button>
            </div>
        </div>
    );
};