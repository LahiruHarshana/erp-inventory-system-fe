import React from 'react';

interface CardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    change?: string;
    changeType?: 'increase' | 'decrease';
}

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

const Card: React.FC<CardProps> = ({ title, value, icon, change, changeType }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                {icon}
            </div>
        </div>
        {change && (
            <div className="mt-4 flex items-center">
        <span className={classNames(
            changeType === 'increase' ? 'text-green-600' : 'text-red-600',
            'text-sm font-semibold'
        )}>
          {change}
        </span>
                <span className="text-xs text-gray-500 ml-2">from last month</span>
            </div>
        )}
    </div>
);

export default Card;