import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { adminService } from '@/api/services/admin.service';
import type { Position, Worker, PayPeriod } from '@/types/admin.types';
import { PositionModal } from './PositionModal';
import { WorkerModal } from './WorkerModal';
import { useNotifications } from '@/components/ui/NotificationProvider';

// Security Alert Component
const SecurityAlert: React.FC<{ message: string; type: 'info' | 'warning' | 'error' }> = ({ message, type }) => {
  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  return (
    <div className={`border p-3 rounded-lg mb-4 ${colors[type]}`}>
      <div className="flex items-center">
        <ShieldCheckIcon className="h-5 w-5 mr-2" />
        <span className="font-medium">Security Notice:</span>
      </div>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
};

// Stats Card Component
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  change?: string;
}> = ({ title, value, icon: Icon, color, change }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {change && (
                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  {change}
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

// Data Table Component with Security Features
const DataTable: React.FC<{
  title: string;
  data: any[];
  columns: { key: string; label: string; render?: (value: any, row: any) => React.ReactNode }[];
  actions?: { 
    label: string; 
    icon: React.ComponentType<{ className?: string }>; 
    onClick: (row: any) => void;
    variant: 'primary' | 'secondary' | 'danger';
  }[];
  onAdd?: () => void;
}> = ({ title, data, columns, actions, onAdd }) => {
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Sanitize search input to prevent XSS
  const sanitizeSearch = (input: string) => {
    return input.replace(/[<>]/g, '').trim();
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(sanitizeSearch(searchTerm).toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    const direction = sortDirection === 'asc' ? 1 : -1;
    return aVal < bVal ? -direction : aVal > bVal ? direction : 0;
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getButtonStyles = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'text-indigo-600 hover:text-indigo-900';
      case 'secondary':
        return 'text-gray-600 hover:text-gray-900';
      case 'danger':
        return 'text-red-600 hover:text-red-900';
      default:
        return 'text-gray-600 hover:text-gray-900';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
          {onAdd && (
            <button
              onClick={onAdd}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add New
            </button>
          )}
        </div>
        
        {/* Search Input with XSS Protection */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxLength={100} // Limit input length
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort(column.key)}
                  >
                    {column.label}
                    {sortColumn === column.key && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
                {actions && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((row, index) => (
                <tr key={row.uuid || row.id || index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            className={`${getButtonStyles(action.variant)} hover:underline`}
                            title={action.label}
                          >
                            <action.icon className="h-4 w-4" />
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          
          {sortedData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No data found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'positions' | 'workers' | 'payroll' | 'disbursements'>('overview');
  
  // Modal states
  const [positionModal, setPositionModal] = useState<{
    isOpen: boolean;
    data?: Position;
  }>({ isOpen: false });
  
  const [workerModal, setWorkerModal] = useState<{
    isOpen: boolean;
    data?: Worker;
  }>({ isOpen: false });

  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  // Data fetching with React Query
  const { data: positions, isLoading: positionsLoading } = useQuery({
    queryKey: ['positions'],
    queryFn: () => adminService.getPositions(),
  });

  const { data: workers, isLoading: workersLoading } = useQuery({
    queryKey: ['workers'],
    queryFn: () => adminService.getWorkers(),
  });

  const { data: payPeriods, isLoading: payPeriodsLoading } = useQuery({
    queryKey: ['payPeriods'],
    queryFn: () => adminService.getPayPeriods(),
  });

  // Show loading state
  const isLoading = positionsLoading || workersLoading || payPeriodsLoading;

  // Mutations for CRUD operations
  const createPositionMutation = useMutation({
    mutationFn: adminService.createPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      addNotification({
        type: 'success',
        title: 'Position Created',
        message: 'Position has been successfully created.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Failed to Create Position',
        message: error?.message || 'An error occurred while creating the position.',
      });
    },
  });

  const updatePositionMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: any }) => 
      adminService.updatePosition(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      addNotification({
        type: 'success',
        title: 'Position Updated',
        message: 'Position has been successfully updated.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Failed to Update Position',
        message: error?.message || 'An error occurred while updating the position.',
      });
    },
  });

  const deletePositionMutation = useMutation({
    mutationFn: adminService.deletePosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      addNotification({
        type: 'success',
        title: 'Position Deleted',
        message: 'Position has been successfully deleted.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Failed to Delete Position',
        message: error?.message || 'An error occurred while deleting the position.',
      });
    },
  });

  const createWorkerMutation = useMutation({
    mutationFn: adminService.createWorker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      addNotification({
        type: 'success',
        title: 'Worker Created',
        message: 'Worker has been successfully created.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Failed to Create Worker',
        message: error?.message || 'An error occurred while creating the worker.',
      });
    },
  });

  const updateWorkerMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: any }) => 
      adminService.updateWorker(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      addNotification({
        type: 'success',
        title: 'Worker Updated',
        message: 'Worker has been successfully updated.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Failed to Update Worker',
        message: error?.message || 'An error occurred while updating the worker.',
      });
    },
  });

  const deleteWorkerMutation = useMutation({
    mutationFn: adminService.deleteWorker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      addNotification({
        type: 'success',
        title: 'Worker Deleted',
        message: 'Worker has been successfully deleted.',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Failed to Delete Worker',
        message: error?.message || 'An error occurred while deleting the worker.',
      });
    },
  });
  const stats = {
    totalWorkers: workers?.data?.length || 0,
    totalPositions: positions?.data?.length || 0,
    activePeriods: payPeriods?.data?.filter(p => p.status === 'DRAFT').length || 0,
    totalDisbursements: 0, // Would come from disbursements API
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'positions', name: 'Positions', icon: BuildingOfficeIcon },
    { id: 'workers', name: 'Workers', icon: UserGroupIcon },
    { id: 'payroll', name: 'Payroll', icon: DocumentTextIcon },
    { id: 'disbursements', name: 'Disbursements', icon: CurrencyDollarIcon },
  ];

  const positionColumns = [
    { key: 'name', label: 'Position Name' },
    { 
      key: 'active', 
      label: 'Status',
      render: (value: boolean) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { key: 'description', label: 'Description' },
  ];

  const workerColumns = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { 
      key: 'payFrequency', 
      label: 'Pay Frequency',
      render: (value: string) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    { 
      key: 'rate', 
      label: 'Rate',
      render: (value: number) => `KES ${value.toLocaleString()}`
    },
    { 
      key: 'payable', 
      label: 'Payable',
      render: (value: boolean) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    },
  ];

  const payrollColumns = [
    { key: 'label', label: 'Period Label' },
    { key: 'frequency', label: 'Frequency' },
    { 
      key: 'startDate', 
      label: 'Start Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'endDate', 
      label: 'End Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'APPROVED' ? 'bg-green-100 text-green-800' :
          value === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
  ];

  const handleEditPosition = (position: Position) => {
    setPositionModal({ isOpen: true, data: position });
  };

  const handleDeletePosition = async (position: Position) => {
    if (window.confirm(`Are you sure you want to delete position "${position.name}"?`)) {
      try {
        await deletePositionMutation.mutateAsync(position.uuid);
      } catch (error) {
        console.error('Failed to delete position:', error);
        alert('Failed to delete position. Please try again.');
      }
    }
  };

  const handleEditWorker = (worker: Worker) => {
    setWorkerModal({ isOpen: true, data: worker });
  };

  const handleDeleteWorker = async (worker: Worker) => {
    if (window.confirm(`Are you sure you want to delete worker "${worker.fullName}"?`)) {
      try {
        await deleteWorkerMutation.mutateAsync(worker.uuid);
      } catch (error) {
        console.error('Failed to delete worker:', error);
        alert('Failed to delete worker. Please try again.');
      }
    }
  };

  const handleViewPayPeriod = (period: PayPeriod) => {
    console.log('View pay period:', period);
    // TODO: Open detailed view
  };

  // Modal submit handlers
  const handlePositionSubmit = async (data: any) => {
    if (positionModal.data) {
      await updatePositionMutation.mutateAsync({
        uuid: positionModal.data.uuid,
        data,
      });
    } else {
      await createPositionMutation.mutateAsync(data);
    }
    setPositionModal({ isOpen: false });
  };

  const handleWorkerSubmit = async (data: any) => {
    if (workerModal.data) {
      await updateWorkerMutation.mutateAsync({
        uuid: workerModal.data.uuid,
        data,
      });
    } else {
      await createWorkerMutation.mutateAsync(data);
    }
    setWorkerModal({ isOpen: false });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Security Alert */}
      <SecurityAlert 
        type="info" 
        message="All admin actions are logged for security purposes. Ensure you follow data protection protocols."
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Loading...</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Fetching admin data securely...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage positions, workers, payroll, and disbursements
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Secure Session</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Workers"
                value={stats.totalWorkers}
                icon={UserGroupIcon}
                color="text-blue-600"
                change="+12%"
              />
              <StatsCard
                title="Active Positions"
                value={stats.totalPositions}
                icon={BuildingOfficeIcon}
                color="text-green-600"
              />
              <StatsCard
                title="Pay Periods"
                value={stats.activePeriods}
                icon={DocumentTextIcon}
                color="text-yellow-600"
              />
              <StatsCard
                title="Disbursements"
                value={stats.totalDisbursements}
                icon={CurrencyDollarIcon}
                color="text-purple-600"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => setWorkerModal({ isOpen: true })}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <UserGroupIcon className="h-8 w-8 text-blue-600 mb-2" />
                  <div className="font-medium">Add Worker</div>
                  <div className="text-sm text-gray-500">Create new worker profile</div>
                </button>
                <button 
                  onClick={() => setPositionModal({ isOpen: true })}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <BuildingOfficeIcon className="h-8 w-8 text-green-600 mb-2" />
                  <div className="font-medium">New Position</div>
                  <div className="text-sm text-gray-500">Define job position</div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <DocumentTextIcon className="h-8 w-8 text-yellow-600 mb-2" />
                  <div className="font-medium">Create Pay Period</div>
                  <div className="text-sm text-gray-500">Set up payroll period</div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <CurrencyDollarIcon className="h-8 w-8 text-purple-600 mb-2" />
                  <div className="font-medium">Single Disbursement</div>
                  <div className="text-sm text-gray-500">Process individual payment</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'positions' && (
          <DataTable
            title="Positions"
            data={positions?.data || []}
            columns={positionColumns}
            actions={[
              { label: 'Edit', icon: PencilIcon, onClick: handleEditPosition, variant: 'primary' },
              { label: 'Delete', icon: TrashIcon, onClick: handleDeletePosition, variant: 'danger' },
            ]}
            onAdd={() => setPositionModal({ isOpen: true })}
          />
        )}

        {activeTab === 'workers' && (
          <DataTable
            title="Workers"
            data={workers?.data || []}
            columns={workerColumns}
            actions={[
              { label: 'Edit', icon: PencilIcon, onClick: handleEditWorker, variant: 'primary' },
              { label: 'Delete', icon: TrashIcon, onClick: handleDeleteWorker, variant: 'danger' },
            ]}
            onAdd={() => setWorkerModal({ isOpen: true })}
          />
        )}

        {activeTab === 'payroll' && (
          <DataTable
            title="Pay Periods"
            data={payPeriods?.data || []}
            columns={payrollColumns}
            actions={[
              { label: 'View', icon: EyeIcon, onClick: handleViewPayPeriod, variant: 'primary' },
            ]}
            onAdd={() => console.log('Create new pay period')}
          />
        )}

        {activeTab === 'disbursements' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Disbursements</h3>
            <p className="text-gray-500">Disbursement management coming soon...</p>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <PositionModal
        isOpen={positionModal.isOpen}
        onClose={() => setPositionModal({ isOpen: false })}
        position={positionModal.data}
        onSubmit={handlePositionSubmit}
      />
      
      <WorkerModal
        isOpen={workerModal.isOpen}
        onClose={() => setWorkerModal({ isOpen: false })}
        data={workerModal.data}
        positions={positions?.data || []}
        onSubmit={handleWorkerSubmit}
      />
    </div>
  );
}