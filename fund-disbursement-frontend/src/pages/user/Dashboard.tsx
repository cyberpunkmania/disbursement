import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, History, User } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.firstName || 'User'}!</h1>
        <p className="text-gray-600">User Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/user/disbursements/new')}
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Make Payment</h3>
          <p className="text-gray-600">Create a single disbursement</p>
        </div>

        <div 
          className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/user/transactions')}
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <History className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
          <p className="text-gray-600">View your payment history</p>
        </div>

        <div 
          className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/user/profile')}
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <User className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Profile</h3>
          <p className="text-gray-600">Manage your account</p>
        </div>
      </div>
    </div>
  );
};