import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthService } from './api/services/auth.service';
import { NotificationProvider } from './components/ui/NotificationProvider';
import { ThemeProvider } from './contexts/ThemeContext';

// Auth Pages
import { Login } from './pages/auth/Login';

// Admin Pages
import { AdminLayout } from './components/layout/AdminLayout';
import ModernAdminDashboard from './components/admin/ModernAdminDashboard';
import PositionsPage from './components/admin/PositionsPage';
import WorkersPage from './components/admin/WorkersPage';
import PayrollPage from './components/admin/PayrollPage';
import DisbursementsPage from './components/admin/DisbursementsPage';
import SettingsPage from './components/admin/SettingsPage';

// User Pages
import { UserLayout } from './components/layout/UserLayout';
import { UserDashboard } from './pages/user/Dashboard';
import { MakePayment } from './pages/user/MakePayment';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: string }> = ({ children, role }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const user = AuthService.getCurrentUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'} replace />;
  }
  
  return <>{children}</>;
};

// Home Route Component - redirects based on authentication
const HomeRoute: React.FC = () => {
  const isAuthenticated = AuthService.isAuthenticated();
  const user = AuthService.getCurrentUser();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect authenticated users to their dashboard
  return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'} replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NotificationProvider>
          <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<ModernAdminDashboard />} />
              <Route path="positions" element={<PositionsPage />} />
              <Route path="workers" element={<WorkersPage />} />
              <Route path="payroll" element={<PayrollPage />} />
              <Route path="disbursements" element={<DisbursementsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
            
            {/* User Routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute role="USER">
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="disbursements/new" element={<MakePayment />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
            
            {/* Default Redirect */}
            <Route path="/" element={<HomeRoute />} />
          </Routes>
        </BrowserRouter>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
