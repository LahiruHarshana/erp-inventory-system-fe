import { useSelector } from 'react-redux';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import BusinessOwnerDashboard from './features/dashboards/BusinessOwnerDashboard';
import InventoryManagerDashboard from './features/dashboards/InventoryManagerDashboard';
import SupplyChainCoordinatorDashboard from './features/dashboards/SupplyChainCoordinatorDashboard';
import type {RootState} from "./app/store.ts";

const MainContent = () => {
    const currentRole = useSelector((state: RootState) => state.user.role);

    const renderDashboard = () => {
        switch (currentRole) {
            case 'Inventory Manager':
                return <InventoryManagerDashboard />;
            case 'Business Owner':
                return <BusinessOwnerDashboard />;
            case 'Supply Chain Coordinator':
                return <SupplyChainCoordinatorDashboard />;
            default:
                return <div className="p-8">Please select a valid role.</div>;
        }
    };

    return (
        <main className="flex-1 p-8 overflow-y-auto bg-gray-100">
            {renderDashboard()}
        </main>
    );
};

const App = () => {
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

export default App;