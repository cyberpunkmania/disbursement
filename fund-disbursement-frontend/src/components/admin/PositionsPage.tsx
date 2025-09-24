import React, { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { usePositions, useDeletePosition } from '@/hooks/useAdmin';
import { useNotifications } from '@/components/ui/NotificationProvider';
import { PositionModal } from './PositionModal';
import type { Position } from '@/types/admin.types';

const PositionsPage: React.FC = () => {
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | undefined>();

  const { data: positions, isLoading, error } = usePositions(showActiveOnly);
  const deletePositionMutation = useDeletePosition();
  const { addNotification } = useNotifications();

  // Filter positions based on search term
  const filteredPositions = positions?.filter(position =>
    position.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (position.description && position.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleCreate = () => {
    setEditingPosition(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (position: Position) => {
    setEditingPosition(position);
    setIsModalOpen(true);
  };

  const handleDelete = (uuid: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the position "${name}"? This action cannot be undone.`)) {
      deletePositionMutation.mutate(uuid, {
        onSuccess: () => {
          addNotification({ 
            type: 'success', 
            title: 'Position deleted successfully',
            message: `${name} has been removed from the system.`
          });
        },
        onError: (error: any) => {
          addNotification({ 
            type: 'error', 
            title: 'Failed to delete position',
            message: error.message || 'An unexpected error occurred.'
          });
        },
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPosition(undefined);
  };

  if (error) {
    return (
      <div className="container-responsive py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center">
            <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                Error Loading Positions
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                {error.message || 'Failed to load positions. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <BuildingOfficeIcon className="w-8 h-8 mr-3 text-primary-600" />
            Positions Management
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage organizational positions and roles
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus-visible-ring"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Position
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center space-x-3">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Active only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Positions List */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Positions ({filteredPositions.length})
            </h3>
            {searchTerm && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Filtered by: "{searchTerm}"
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="divide-y divide-gray-200 dark:divide-dark-700">
          {isLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-2/3"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-dark-700 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 dark:bg-dark-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredPositions.length === 0 ? (
            <div className="p-6 text-center">
              <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {searchTerm ? 'No positions found' : 'No positions'}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm 
                  ? `No positions match "${searchTerm}"`
                  : 'Get started by creating a new position.'
                }
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button
                    onClick={handleCreate}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus-visible-ring"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Position
                  </button>
                </div>
              )}
            </div>
          ) : (
            filteredPositions.map((position) => (
              <div
                key={position.uuid}
                className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white truncate">
                        {position.name}
                      </h4>
                      {position.active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircleIcon className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                          <XCircleIcon className="w-3 h-3 mr-1" />
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                      {position.description || 'No description provided'}
                    </p>
                    {position.multiplier !== undefined && (
                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        Multiplier: {position.multiplier}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(position)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus-visible-ring rounded-lg"
                      aria-label={`Edit ${position.name}`}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(position.uuid, position.name)}
                      disabled={deletePositionMutation.isPending}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 focus-visible-ring rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Delete ${position.name}`}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Position Modal */}
      <PositionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        position={editingPosition}
      />
    </div>
  );
};

export default PositionsPage;
