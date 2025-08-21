import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

export const Header: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>
            <div>
                <span className="font-medium">{user?.name || user?.email}</span>
                <span className="text-sm text-gray-500 ml-2">({user?.role})</span>
            </div>
        </header>
    );
};