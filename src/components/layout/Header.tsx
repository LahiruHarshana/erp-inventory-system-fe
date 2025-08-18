import { useSelector, useDispatch } from 'react-redux';
import { setUserRole } from '../../features/user/userSlice';
import { BellIcon } from '../icons';
import type {RootState} from "../../app/store.ts";

const Header = () => {
    const { name, role, notifications } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setUserRole(e.target.value));
    };

    return (
        <header className="flex items-center justify-between h-20 px-6 bg-white border-b border-gray-200">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {name}!</p>
            </div>
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <select
                        value={role}
                        onChange={handleRoleChange}
                        className="p-2 border rounded-md bg-gray-50 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option>Inventory Manager</option>
                        <option>Business Owner</option>
                        <option>Supply Chain Coordinator</option>
                    </select>
                </div>
                <button className="relative p-2 text-gray-500 hover:text-gray-700">
                    <BellIcon className="h-6 w-6" />
                    {notifications > 0 &&
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                            {notifications}
                        </span>
                    }
                </button>
                <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full object-cover" src={`https://placehold.co/100x100/E2E8F0/4A5568?text=${name.charAt(0)}`} alt="User avatar" />
                    <div className="ml-3">
                        <p className="text-sm font-semibold text-gray-800">{name}</p>
                        <p className="text-xs text-gray-500">{role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;