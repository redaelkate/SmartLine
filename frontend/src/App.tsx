import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { UsersPage } from './pages/UsersPage';
import { User, Lock, Check, Settings } from 'lucide-react';
import Logo from './assets/Logo.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BillingPage } from './pages/BillingPage';
import Summary from './components/CallHistoryList';
import { mockCallHistory } from './data/mockCallHistory';
import AIAgentManager from './pages/settings';
import OrdersView from './orders/OrdersView';
import { AuthProvider, useAuth } from './pages/AuthContext';
import Login from './pages/Login';
import LeadsView from './leads/LeadsView';

// ProtectedRoute Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

function AppContent() {
    const { user } = useAuth();

    const callHistory = mockCallHistory;

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {user && <Sidebar />}
            <main className="flex-1 overflow-y-auto p-4">
                <Routes>
                    {/* Public Routes */}
                    {!user && <Route path="/login" element={<Login />} />}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/orders" element={
                        <ProtectedRoute>
                            <OrdersView />
                        </ProtectedRoute>
                    } />
                    <Route path="/users" element={
                        <ProtectedRoute>
                            <UsersPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/support" element={
                        <ProtectedRoute>
                            <Summary  callHistory={mockCallHistory}/>
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/leads" element={
                        <ProtectedRoute>
                            <LeadsView />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/settings" element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/agents" element={
                        <ProtectedRoute>
                            <AIAgentManager />
                        </ProtectedRoute>
                    } />

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </main>
        </div>
    );
}




function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}
export default App;
