import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from "./pages/Dashboard";
import { UsersPage } from './pages/UsersPage';
import { BillingPage } from './pages/BillingPage';
import Summary from './components/CallHistoryList'; // Updated import
import { mockCallHistory } from './data/mockCallHistory';
import AIAgentManager from './pages/settings';
function App() {
  const [currentPage, setCurrentPage] = React.useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UsersPage />;
      case 'billing':
        return <BillingPage />;
      case 'callHistory': // Use a consistent naming convention
        return <Summary callHistory={mockCallHistory} />;
      case 'settings':
        return <AIAgentManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex bg-gray-50">
      <Sidebar onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;