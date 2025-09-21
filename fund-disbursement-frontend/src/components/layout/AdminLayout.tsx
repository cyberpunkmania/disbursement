import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Users, BarChart3, DollarSign, Settings, LogOut, Home } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Workers', path: '/admin/workers' },
    { icon: Settings, label: 'Positions', path: '/admin/positions' },
    { icon: BarChart3, label: 'Payroll', path: '/admin/payroll' },
    { icon: DollarSign, label: 'Disbursements', path: '/admin/disbursements' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="flex items-center justify-center h-16 border-b">
          <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-red-600 hover:bg-red-50 mt-8"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Fund Disbursement System
            </h2>
            <div className="text-sm text-gray-600">
              Welcome, Admin
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};