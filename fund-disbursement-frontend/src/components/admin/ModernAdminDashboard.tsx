import React, { useState } from 'react';
import { 
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { 
  useDashboardStats,
  usePositions,
  useWorkers,
  usePayPeriods,
  useDeletePosition,
  useDeleteWorker,
} from '@/hooks/useAdmin';
import { useNotifications } from '@/components/ui/NotificationProvider';
import { PositionModal } from './PositionModal';
import { WorkerModal } from './WorkerModal';
import PositionFilterTest from './PositionFilterTest';
import ErrorBoundary from '../common/ErrorBoundary';
import type { Position, Worker } from '@/types/admin.types';

// Modern Chart Component (placeholder for real charts)
const ChartComponent: React.FC<{ type: 'line' | 'bar' | 'pie'; data: any; className?: string }> = ({ type, className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-center h-32 text-primary-400">
        <ChartBarIcon className="w-16 h-16" />
        <span className="ml-2 text-sm font-medium">{type} Chart</span>
      </div>
    </div>
  );
};

// Modern Stats Card Component
const ModernStatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; isPositive: boolean };
  subtitle?: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}> = ({ title, value, icon: Icon, trend, subtitle, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              {trend.isPositive ? (
                <ArrowUpIcon className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ml-1 ${
                trend.isPositive ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityItem: React.FC<{ 
  action: string; 
  user: string; 
  time: string; 
  type: 'create' | 'update' | 'delete' | 'warning';
}> = ({ action, user, time, type }) => {
  const typeColors = {
    create: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
    update: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    delete: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  };

  return (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-dark-700/50 rounded-lg transition-colors duration-200">
      <div className={`w-2 h-2 rounded-full ${typeColors[type].replace('text-', 'bg-').split(' ')[0]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {action}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          by {user} • {time}
        </p>
      </div>
    </div>
  );
};

// Main Dashboard Component
const ModernAdminDashboard: React.FC = () => {
  const { addNotification } = useNotifications();
  
  // Modal states
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | undefined>();
  const [editingWorker, setEditingWorker] = useState<Worker | undefined>();

  // Use our custom hooks
  const stats = useDashboardStats();
  const { data: positions, isLoading: positionsLoading } = usePositions();
  const { data: workers, isLoading: workersLoading } = useWorkers();
  const { data: payPeriods } = usePayPeriods();

  // Delete mutations
  const deletePositionMutation = useDeletePosition();
  const deleteWorkerMutation = useDeleteWorker();

  const handleDeletePosition = (uuid: string) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      deletePositionMutation.mutate(uuid, {
        onSuccess: () => {
          addNotification({ type: 'success', title: 'Position deleted successfully' });
        },
        onError: () => {
          addNotification({ type: 'error', title: 'Failed to delete position' });
        },
      });
    }
  };

  const handleDeleteWorker = (uuid: string) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      deleteWorkerMutation.mutate(uuid, {
        onSuccess: () => {
          addNotification({ type: 'success', title: 'Worker deleted successfully' });
        },
        onError: () => {
          addNotification({ type: 'error', title: 'Failed to delete worker' });
        },
      });
    }
  };

  const handleCreatePosition = () => {
    setEditingPosition(undefined);
    setIsPositionModalOpen(true);
  };

  const handleEditPosition = (position: Position) => {
    setEditingPosition(position);
    setIsPositionModalOpen(true);
  };

  const handleCreateWorker = () => {
    setEditingWorker(undefined);
    setIsWorkerModalOpen(true);
  };

  const handleEditWorker = (worker: Worker) => {
    setEditingWorker(worker);
    setIsWorkerModalOpen(true);
  };

  // Sample activity data
  const recentActivity = [
    { action: 'New worker added', user: 'Admin', time: '2 minutes ago', type: 'create' as const },
    { action: 'Position updated', user: 'Admin', time: '15 minutes ago', type: 'update' as const },
    { action: 'Payroll processed', user: 'System', time: '1 hour ago', type: 'create' as const },
    { action: 'Security alert resolved', user: 'Admin', time: '2 hours ago', type: 'warning' as const },
  ];

  return (
    <ErrorBoundary>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
            Dashboard Overview
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your fund disbursement system.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleCreatePosition}
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Position
          </button>
          <button
            onClick={handleCreateWorker}
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Worker
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <ModernStatsCard
          title="Total Positions"
          value={stats.totalPositions}
          icon={BuildingOfficeIcon}
          trend={{ value: 12, isPositive: true }}
          subtitle={`${stats.activePositions} active positions`}
          color="blue"
        />
        <ModernStatsCard
          title="Total Workers"
          value={stats.totalWorkers}
          icon={UserGroupIcon}
          trend={{ value: 8, isPositive: true }}
          subtitle={`${stats.activeWorkers} active workers`}
          color="green"
        />
        <ModernStatsCard
          title="Pay Periods"
          value={stats.totalPayPeriods}
          icon={DocumentTextIcon}
          trend={{ value: 15, isPositive: true }}
          subtitle={`${stats.draftPayPeriods} draft, ${stats.approvedPayPeriods} approved`}
          color="purple"
        />
        <ModernStatsCard
          title="Pending Approvals"
          value={stats.draftPayPeriods}
          icon={ClockIcon}
          trend={{ value: 5, isPositive: false }}
          subtitle="Awaiting review"
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Disbursements
          </h3>
          <ChartComponent type="line" data={[]} />
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Department Distribution
          </h3>
          <ChartComponent type="pie" data={[]} />
          <p className="text-xs text-gray-500 mt-2">Pay periods: {payPeriods?.length || 0}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-1">
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>

        {/* Positions List */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Positions
            </h3>
            <button
              onClick={handleCreatePosition}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              aria-label="Add new position"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            {positionsLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-dark-700 rounded-lg" />
                ))}
              </div>
            ) : (
              positions?.slice(0, 5).map((position) => (
                <div
                  key={position.uuid}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors duration-200"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {position.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {position.description || 'No description'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <button
                      onClick={() => handleEditPosition(position)}
                      className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      aria-label="Edit position"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePosition(position.uuid)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      aria-label="Delete position"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Workers List */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Workers
            </h3>
            <button
              onClick={handleCreateWorker}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              aria-label="Add new worker"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            {workersLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-dark-700 rounded-lg" />
                ))}
              </div>
            ) : (
              workers?.slice(0, 5).map((worker) => (
                <div
                  key={worker.uuid}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors duration-200"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {worker.fullName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {worker.email}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <button
                      onClick={() => handleEditWorker(worker)}
                      className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      aria-label="Edit worker"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteWorker(worker.uuid)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      aria-label="Delete worker"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

  {/* Position Filter Test - Demonstrates client-side filtering */}
  <PositionFilterTest />

      {/* Security Alert */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
          <div className="ml-3 min-w-0">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              Security Notice
            </h3>
            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
              System security scan completed. All admin actions are being monitored and logged for audit purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PositionModal
        isOpen={isPositionModalOpen}
        onClose={() => {
          setIsPositionModalOpen(false);
          setEditingPosition(undefined);
        }}
        position={editingPosition}
      />

      <WorkerModal
        isOpen={isWorkerModalOpen}
        onClose={() => {
          setIsWorkerModalOpen(false);
          setEditingWorker(undefined);
        }}
        worker={editingWorker}
      />
      </div>
    </ErrorBoundary>
  );
};

export default ModernAdminDashboard;