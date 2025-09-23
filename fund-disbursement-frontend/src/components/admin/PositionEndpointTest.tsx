import React, { useState } from 'react';
import { 
  usePositions, 
  usePosition, 
  useCreatePosition, 
  useUpdatePosition, 
  useDeletePosition 
} from '@/hooks/useAdmin';
import { useNotifications } from '@/components/ui/NotificationProvider';
import type { CreatePositionRequest, UpdatePositionRequest } from '@/types/admin.types';

const PositionEndpointTest: React.FC = () => {
  const { addNotification } = useNotifications();
  
  // State for testing
  const [selectedPositionUuid, setSelectedPositionUuid] = useState<string>('');
  const [createData, setCreateData] = useState<CreatePositionRequest>({
    name: '',
    description: '',
    active: true,
  });
  const [updateData, setUpdateData] = useState<UpdatePositionRequest>({
    name: '',
    description: '',
    active: true,
  });

  // Hooks
  const { data: allPositions, isLoading: loadingAll, error: errorAll } = usePositions();
  const { data: activePositions, isLoading: loadingActive, error: errorActive } = usePositions(true);
  const { data: inactivePositions, isLoading: loadingInactive, error: errorInactive } = usePositions(false);
  const { data: singlePosition, isLoading: loadingSingle, error: errorSingle } = usePosition(selectedPositionUuid);
  
  const createMutation = useCreatePosition();
  const updateMutation = useUpdatePosition();
  const deleteMutation = useDeletePosition();

  // Handlers
  const handleCreate = async () => {
    if (!createData.name.trim()) {
      addNotification({ type: 'error', title: 'Name is required' });
      return;
    }

    try {
      await createMutation.mutateAsync(createData);
      addNotification({ type: 'success', title: 'Position created successfully' });
      setCreateData({ name: '', description: '', active: true });
    } catch (error: any) {
      addNotification({ type: 'error', title: 'Failed to create position', message: error.message });
    }
  };

  const handleUpdate = async () => {
    if (!selectedPositionUuid) {
      addNotification({ type: 'error', title: 'Please select a position first' });
      return;
    }

    try {
      await updateMutation.mutateAsync({ uuid: selectedPositionUuid, data: updateData });
      addNotification({ type: 'success', title: 'Position updated successfully' });
    } catch (error: any) {
      addNotification({ type: 'error', title: 'Failed to update position', message: error.message });
    }
  };

  const handleDelete = async (uuid: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(uuid);
      addNotification({ type: 'success', title: 'Position deleted successfully' });
      if (selectedPositionUuid === uuid) {
        setSelectedPositionUuid('');
      }
    } catch (error: any) {
      addNotification({ type: 'error', title: 'Failed to delete position', message: error.message });
    }
  };

  const loadPositionForEdit = (position: any) => {
    setSelectedPositionUuid(position.uuid);
    setUpdateData({
      name: position.name,
      description: position.description || '',
      active: position.active,
    });
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Position Endpoints Test
      </h2>

      {/* 1.1 Create Position */}
      <div className="border border-gray-200 dark:border-dark-600 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          1.1 Create Position (POST /api/admin/positions)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={createData.name}
              onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
              placeholder="e.g., SUPERVISOR"
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={createData.description}
              onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
              placeholder="e.g., Oversees site workers"
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={createData.active}
                onChange={(e) => setCreateData({ ...createData, active: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
            </label>
          </div>
        </div>
        <button
          onClick={handleCreate}
          disabled={createMutation.isPending}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {createMutation.isPending ? 'Creating...' : 'Create Position'}
        </button>
      </div>

      {/* 1.2 List Positions */}
      <div className="border border-gray-200 dark:border-dark-600 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          1.2 List Positions (GET /api/admin/positions)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* All Positions */}
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              All Positions (no filter)
            </h4>
            {loadingAll ? (
              <p className="text-sm text-blue-600">Loading...</p>
            ) : errorAll ? (
              <p className="text-sm text-red-600">Error: {errorAll.message}</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {allPositions?.map((position) => (
                  <div
                    key={position.uuid}
                    className="p-2 border border-gray-200 dark:border-dark-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700"
                    onClick={() => loadPositionForEdit(position)}
                  >
                    <p className="font-medium text-sm">{position.name}</p>
                    <p className="text-xs text-gray-500">
                      {position.active ? 'Active' : 'Inactive'} • {position.description || 'No description'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Positions */}
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Active Positions (activeOnly=true)
            </h4>
            {loadingActive ? (
              <p className="text-sm text-blue-600">Loading...</p>
            ) : errorActive ? (
              <p className="text-sm text-red-600">Error: {errorActive.message}</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {activePositions?.map((position) => (
                  <div
                    key={position.uuid}
                    className="p-2 border border-gray-200 dark:border-dark-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700"
                    onClick={() => loadPositionForEdit(position)}
                  >
                    <p className="font-medium text-sm">{position.name}</p>
                    <p className="text-xs text-gray-500">
                      {position.description || 'No description'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Positions (including inactive) */}
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              All Positions (activeOnly=false)
            </h4>
            {loadingInactive ? (
              <p className="text-sm text-blue-600">Loading...</p>
            ) : errorInactive ? (
              <p className="text-sm text-red-600">Error: {errorInactive.message}</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {inactivePositions?.map((position) => (
                  <div
                    key={position.uuid}
                    className="p-2 border border-gray-200 dark:border-dark-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700"
                    onClick={() => loadPositionForEdit(position)}
                  >
                    <p className="font-medium text-sm">{position.name}</p>
                    <p className="text-xs text-gray-500">
                      {position.active ? 'Active' : 'Inactive'} • {position.description || 'No description'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1.3 Get Position by UUID */}
      <div className="border border-gray-200 dark:border-dark-600 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          1.3 Get Position by UUID (GET /api/admin/positions/{uuid})
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Position UUID
          </label>
          <input
            type="text"
            value={selectedPositionUuid}
            onChange={(e) => setSelectedPositionUuid(e.target.value)}
            placeholder="Enter position UUID or click on a position above"
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
          />
        </div>
        {selectedPositionUuid && (
          <div className="mt-4">
            {loadingSingle ? (
              <p className="text-sm text-blue-600">Loading position...</p>
            ) : errorSingle ? (
              <p className="text-sm text-red-600">Error: {errorSingle.message}</p>
            ) : singlePosition ? (
              <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white">{singlePosition.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  UUID: {singlePosition.uuid}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Status: {singlePosition.active ? 'Active' : 'Inactive'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Description: {singlePosition.description || 'No description'}
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* 1.4 Update Position */}
      <div className="border border-gray-200 dark:border-dark-600 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          1.4 Update Position (PATCH /api/admin/positions/{uuid})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={updateData.name}
              onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
              placeholder="e.g., LEAD_SUPERVISOR"
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={updateData.description}
              onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
              placeholder="e.g., Leads supervisors"
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={updateData.active}
                onChange={(e) => setUpdateData({ ...updateData, active: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
            </label>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleUpdate}
            disabled={updateMutation.isPending || !selectedPositionUuid}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Updating...' : 'Update Position'}
          </button>
          {selectedPositionUuid && singlePosition && (
            <button
              onClick={() => handleDelete(selectedPositionUuid, singlePosition.name)}
              disabled={deleteMutation.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Position'}
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="border border-gray-200 dark:border-dark-600 rounded-lg p-4 bg-gray-50 dark:bg-dark-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Endpoint Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="font-medium">Total Positions</p>
            <p className="text-2xl font-bold text-blue-600">{allPositions?.length || 0}</p>
          </div>
          <div>
            <p className="font-medium">Active Positions</p>
            <p className="text-2xl font-bold text-green-600">{activePositions?.length || 0}</p>
          </div>
          <div>
            <p className="font-medium">Inactive Positions</p>
            <p className="text-2xl font-bold text-red-600">
              {(allPositions?.length || 0) - (activePositions?.length || 0)}
            </p>
          </div>
          <div>
            <p className="font-medium">Selected</p>
            <p className="text-2xl font-bold text-purple-600">{selectedPositionUuid ? '1' : '0'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionEndpointTest;