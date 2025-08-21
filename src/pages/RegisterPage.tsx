import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import { registerUser } from '../features/auth/authSlice';
import type { RegisterRequest } from '../types';

type FormErrors = Partial<Record<keyof RegisterRequest, string>>;
type TouchedFields = Partial<Record<keyof RegisterRequest, boolean>>;

export const RegisterPage: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
    const [formData, setFormData] = useState<RegisterRequest>({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: 'ROLE_BUSINESS_OWNER',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<TouchedFields>({});
    const dispatch = useDispatch<AppDispatch>();
    const { status, error: apiError } = useSelector((state: RootState) => state.auth);

    const validateForm = (data: RegisterRequest): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.firstname.trim()) newErrors.firstname = 'First name is required.';
        if (!data.lastname.trim()) newErrors.lastname = 'Last name is required.';
        if (!data.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Email address is invalid.';
        }
        if (!data.password) {
            newErrors.password = 'Password is required.';
        } else if (data.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters.';
        }
        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            setErrors(validateForm(newData));
            return newData;
        });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name } = e.target as HTMLInputElement;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);
        setTouched({
            firstname: true,
            lastname: true,
            email: true,
            password: true,
        });

        if (Object.keys(validationErrors).length === 0) {
            const resultAction = await dispatch(registerUser(formData));
            if (registerUser.fulfilled.match(resultAction)) {
                onSwitch();
            }
        }
    };

    const isFormInvalid = Object.keys(validateForm(formData)).length > 0;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
                    <p className="text-gray-500 mt-2">Join us to manage your business efficiently.</p>
                </div>

                {apiError && <p className="text-red-600 bg-red-50 p-3 rounded-md text-center mb-4 text-sm">{apiError}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.firstname && touched.firstname ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`} />
                            {errors.firstname && touched.firstname && <p className="mt-1 text-xs text-red-600">{errors.firstname}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.lastname && touched.lastname ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`} />
                            {errors.lastname && touched.lastname && <p className="mt-1 text-xs text-red-600">{errors.lastname}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.email && touched.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`} />
                        {errors.email && touched.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.password && touched.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`} />
                        {errors.password && touched.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select name="role" onChange={handleChange} onBlur={handleBlur} value={formData.role} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="ROLE_BUSINESS_OWNER">Business Owner</option>
                            <option value="ROLE_INVENTORY_MANAGER">Inventory Manager</option>
                            <option value="ROLE_SUPPLY_CHAIN_COORDINATOR">Supply Chain Coordinator</option>
                        </select>
                    </div>
                    <button type="submit" disabled={isFormInvalid || status === 'loading'} className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors">
                        {status === 'loading' ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <button onClick={onSwitch} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
};
