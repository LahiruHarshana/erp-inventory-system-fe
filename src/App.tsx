import React, { useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store, type RootState } from './app/store';
import { selectActiveView } from './features/ui/uiSlice';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { BusinessOwnerDashboard } from './features/dashboards/BusinessOwnerDashboard';
import { InventoryManagerDashboard } from './features/dashboards/InventoryManagerDashboard';
import { SupplyChainCoordinatorDashboard } from './features/dashboards/SupplyChainCoordinatorDashboard';
import { StoreManagementPage } from './pages/StoreManagementPage';
import { CategoryManagementPage } from './pages/CategoryManagementPage';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import {ProductManagementPage} from "./pages/ProductManagementPage.tsx";
import {SupplierManagementPage} from "./pages/SupplierManagementPage.tsx";
import {WarehouseManagementPage} from "./pages/WarehouseManagementPage.tsx";

const MainContent: React.FC = () => {
    const activeView = useSelector(selectActiveView);
    const currentRole = useSelector((state: RootState) => state.auth.user?.role);

    const renderDashboard = () => {
        switch (currentRole) {
            case 'ROLE_INVENTORY_MANAGER': return <InventoryManagerDashboard />;
            case 'ROLE_BUSINESS_OWNER': return <BusinessOwnerDashboard />;
            case 'ROLE_SUPPLY_CHAIN_COORDINATOR': return <SupplyChainCoordinatorDashboard />;
            default: return <div>Welcome!</div>;
        }
    };

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return renderDashboard();
            case 'stores':
                return <StoreManagementPage />;
            case 'categories':
                return <CategoryManagementPage />;
            case 'products':
                return <ProductManagementPage/>
            case 'suppliers':
                return <SupplierManagementPage/>
            case 'warehouses':
                return <WarehouseManagementPage/>
            //     return <InventoryPage />;
            default:
                return renderDashboard();
        }
    };

    return (
        <main className="flex-1 overflow-y-auto bg-gray-100">
            {renderView()}
        </main>
    );
};

const AppLayout: React.FC = () => (
    <div className="flex h-screen font-sans bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
            <Header />
            <MainContent />
        </div>
    </div>
);

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

const App: React.FC = () => (
    <Provider store={store}>
        <AuthHandler />
    </Provider>
);

export default App;
