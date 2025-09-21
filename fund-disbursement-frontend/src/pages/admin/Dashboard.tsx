import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Users, DollarSign, TrendingUp } from 'lucide-react';
import apiClient from '@/api/client';
import type { Worker } from '@/types/models.types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    activeWorkers: 0,
    pendingDisbursements: 0,
    monthlyPayroll: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load workers
      const workersResponse = await apiClient.get<Worker[]>('/admin/workers');
      if (workersResponse.success && workersResponse.data) {
        const workers = workersResponse.data;
        setStats(prev => ({
          ...prev,
          totalWorkers: workers.length,
          activeWorkers: workers.filter((w: Worker) => w.status === 'ACTIVE').length
        }));
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Workers',
      value: stats.totalWorkers,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Workers',
      value: stats.activeWorkers,
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Pending Disbursements',
      value: stats.pendingDisbursements,
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      title: 'Monthly Payroll',
      value: `KES ${stats.monthlyPayroll.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => window.location.href = '/admin/workers'}
        >
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Manage Workers</h3>
            <p className="text-sm text-gray-600">Add, edit, and manage worker information</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => window.location.href = '/admin/payroll'}
        >
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Create Pay Period</h3>
            <p className="text-sm text-gray-600">Start a new payroll period</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => window.location.href = '/admin/disbursements'}
        >
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Process Disbursements</h3>
            <p className="text-sm text-gray-600">Review and send pending payments</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};