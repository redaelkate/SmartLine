import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { UsersPage } from './pages/UsersPage';
import { BillingPage } from './pages/BillingPage';
import Summary from './components/CallHistoryList';
import { mockCallHistory } from './data/mockCallHistory';
import AIAgentManager from './pages/settings';
import LeadsView from './leads/LeadsView';
import OrdersView from './orders/OrdersView';
import LeadGenerationPage from './leads/leadgeneration';
import { AuthProvider, useAuth } from './pages/AuthContext';
import Login from './pages/Login';

// ProtectedRoute Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="flex bg-gray-50">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto">
                        <Routes>
                            {/* Public Route: Login */}
                            <Route path="/login" element={<Login />} />

                            {/* Protected Routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/users"
                                element={
                                    <ProtectedRoute>
                                        <UsersPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/callHistory"
                                element={
                                    <ProtectedRoute>
                                        <Summary callHistory={mockCallHistory} />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/orders"
                                element={
                                    <ProtectedRoute>
                                        <OrdersView />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/leads"
                                element={
                                    <ProtectedRoute>
                                        <LeadsView />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/settings"
                                element={
                                    <ProtectedRoute>
                                        <AIAgentManager />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/leadgeneration"
                                element={
                                    <ProtectedRoute>
                                        <LeadGenerationPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Default Route: Redirect to Dashboard */}
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />

                            {/* Fallback Route: 404 Not Found */}
                            <Route path="*" element={<div>404 Not Found</div>} />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;