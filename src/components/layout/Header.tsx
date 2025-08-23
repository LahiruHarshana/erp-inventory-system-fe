import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
export interface User {
    token: string;
    role: Role;
    email: string;
    firstname: string;
    lastname: string;
}
export type Role = 'ROLE_BUSINESS_OWNER' | 'ROLE_INVENTORY_MANAGER' | 'ROLE_SUPPLY_CHAIN_COORDINATOR' | 'ROLE_ADMIN';

export const Header: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    // Determine the dashboard title based on user role
    const getDashboardTitle = (role?: Role): string => {
        switch (role) {
            case 'ROLE_BUSINESS_OWNER':
                return 'Business Owner Dashboard';
            case 'ROLE_INVENTORY_MANAGER':
                return 'Inventory Manager Dashboard';
            case 'ROLE_SUPPLY_CHAIN_COORDINATOR':
                return 'Supply Chain Coordinator Dashboard';
            case 'ROLE_ADMIN':
            default:
                return 'Dashboard';
        }
    };

    // Map role enum to meaningful role name
    const getRoleName = (role?: Role): string => {
        switch (role) {
            case 'ROLE_BUSINESS_OWNER':
                return 'Business Owner';
            case 'ROLE_INVENTORY_MANAGER':
                return 'Inventory Manager';
            case 'ROLE_SUPPLY_CHAIN_COORDINATOR':
                return 'Supply Chain Coordinator';
            case 'ROLE_ADMIN':
                return 'Administrator';
            default:
                return 'User';
        }
    };

    return (
        <header className="bg-gray-800 shadow-lg p-4 flex justify-between items-center sticky top-0 z-10 transition-all duration-300">
            <h1 className="text-2xl font-bold text-white tracking-tight">{getDashboardTitle(user?.role)}</h1>
            <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end">
                    <span className="font-semibold text-white">{user?.name || user?.email || 'Guest'}</span>
                    <span className="text-xs text-blue-100">({getRoleName(user?.role)})</span>
                </div>
                <img
                    src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm hover:scale-105 transition-transform duration-200"
                />
            </div>
        </header>
    );
};