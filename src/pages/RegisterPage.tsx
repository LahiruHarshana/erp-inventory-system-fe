import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import { registerUser } from '../features/auth/authSlice';
import type { RegisterRequest } from '../types';

export const RegisterPage: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
    const [formData, setFormData] = useState<RegisterRequest>({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: 'ROLE_BUSINESS_OWNER',
    });
    // State to display a success message to the user
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.auth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);

        const resultAction = await dispatch(registerUser(formData));

        if (registerUser.fulfilled.match(resultAction)) {
            setSuccessMessage('Account created successfully! Please sign in.');
            setTimeout(() => {
                onSwitch();
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

                {/* Show server error OR success message */}
                {error && !successMessage && <p className="text-red-500 text-center mb-4">{error}</p>}
                {successMessage && <p className="text-green-600 bg-green-50 p-3 rounded-md text-center mb-4">{successMessage}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" name="firstname" onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" name="lastname" onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select name="role" onChange={handleChange} value={formData.role} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="ROLE_BUSINESS_OWNER">Business Owner</option>
                            <option value="ROLE_INVENTORY_MANAGER">Inventory Manager</option>
                            <option value="ROLE_SUPPLY_CHAIN_COORDINATOR">Supply Chain Coordinator</option>
                        </select>
                    </div>
                    <button type="submit" disabled={status === 'loading'} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                        {status === 'loading' ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{' '}
                    <button onClick={onSwitch} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
};
