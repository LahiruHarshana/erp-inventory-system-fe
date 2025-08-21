import React, { useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store, type RootState } from './app/store';
import { BusinessOwnerDashboard } from './features/dashboards/BusinessOwnerDashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { InventoryManagerDashboard } from './features/dashboards/InventoryManagerDashboard';
import { SupplyChainCoordinatorDashboard } from './features/dashboards/SupplyChainCoordinatorDashboard';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

const MainContent: React.FC = () => {
    // The role is now sourced from the user object within the auth slice
    const currentRole = useSelector((state: RootState) => state.auth.user?.role);

    const renderDashboard = () => {
        console.log(`Current role: ${currentRole}`); // Debugging line to check the current role
        switch (currentRole) {
            case 'ROLE_INVENTORY_MANAGER':
                return <InventoryManagerDashboard />;
            case 'BUSINESS_OWNER':
                return <BusinessOwnerDashboard />;
            case 'ROLE_SUPPLY_CHAIN_COORDINATOR':
                return <SupplyChainCoordinatorDashboard />;
            default:
                return <div className="p-8">Welcome! Please select a valid role to see your dashboard.</div>;
        }
    };

    return (
        <main className="flex-1 overflow-y-auto bg-gray-100">
            {renderDashboard()}
        </main>
    );
};

const AppLayout: React.FC = () => {
    return (
        <div className="flex h-screen font-sans bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header />
                <MainContent />
            </div>
        </div>
    );
};


const AuthHandler: React.FC = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const [isLogin, setIsLogin] = useState(true);

    if (token) {
        return <AppLayout />;
    }

    return isLogin ? (
        <LoginPage onSwitch={() => setIsLogin(false)} />
    ) : (
        <RegisterPage onSwitch={() => setIsLogin(true)} />
    );
};


const App: React.FC = () => {
    return (
        <Provider store={store}>
            <AuthHandler />
        </Provider>
    );
};

export default App;