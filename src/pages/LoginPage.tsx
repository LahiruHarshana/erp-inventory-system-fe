import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import type { AppDispatch, RootState } from '../app/store';
import { PackageIcon } from '../components/icons';

export const LoginPage: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.auth);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-block bg-indigo-100 text-indigo-600 rounded-full p-3 mb-4">
                        <PackageIcon className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Sign In to ERP System</h2>
                    <p className="text-gray-500 mt-2">Welcome back! Please enter your details.</p>
                </div>

                {error && <p className="text-red-600 bg-red-50 p-3 rounded-md text-center mb-4 text-sm">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {status === 'loading' ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <button onClick={onSwitch} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};
