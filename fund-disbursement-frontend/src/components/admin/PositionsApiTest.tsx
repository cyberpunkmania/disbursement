import React, { useState } from 'react';
import { usePositions, useCreatePosition, useUpdatePosition } from '@/hooks/useAdmin';
import { useNotifications } from '@/components/ui/NotificationProvider';

const PositionsApiTest: React.FC = () => {
  const [testName, setTestName] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [testMultiplier, setTestMultiplier] = useState<number | undefined>(1);
  const [testActive, setTestActive] = useState(true);
  // tokenSet state removed (not used) to avoid TS warnings
  
  const { data: positions, isLoading, error, refetch } = usePositions();
  const createMutation = useCreatePosition();
  const updateMutation = useUpdatePosition();
  const { addNotification } = useNotifications();

  const setTestToken = () => {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJpZCI6MSwic3ViIjoiam9zZXBoYm9rZXI5M0BnbWFpbC5jb20iLCJpYXQiOjE3NTg2NTc3MzEsImV4cCI6MTc1ODc0NDEzMX0.nHPycKJl0eGVR9zUrn2eRztmWdznqpFkolN4vcAZme4';
  sessionStorage.setItem('accessToken', token);
    addNotification({
      type: 'success',
      title: 'Token Set',
      message: 'Bearer token has been set for testing'
    });
  };

  const handleCreateTest = async () => {
    if (!testName.trim()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Position name is required'
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: testName.trim(),
        description: testDescription.trim() || undefined,
        multiplier: testMultiplier,
        active: testActive,
      });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: `Position "${testName}" created successfully`
      });
      
      // Clear form
      setTestName('');
      setTestDescription('');
      setTestMultiplier(1);
      setTestActive(true);
      
    } catch (error: any) {
      console.error('Create position error:', error);
      addNotification({
        type: 'error',
        title: 'Create Failed',
        message: error.message || 'Failed to create position'
      });
    }
  };

  const handleUpdateTest = async (uuid: string) => {
    try {
      await updateMutation.mutateAsync({
        uuid,
        data: {
          name: `UPDATED_${Date.now()}`,
          description: 'Updated via API test',
          multiplier: 0,
          active: true,
        }
      });
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Position updated successfully'
      });
      
    } catch (error: any) {
      console.error('Update position error:', error);
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update position'
      });
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <h3 className="text-red-800 font-medium">API Error</h3>
        <p className="text-red-700 text-sm mt-1">
          {error.message || 'Failed to load positions'}
        </p>
        <button 
          onClick={() => refetch()}
          className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 m-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Positions API Test</h2>
        <button
          onClick={setTestToken}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
        >
          Set Test Token
        </button>
      </div>
      
      {/* Test Form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">Create New Position</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., TEST_POSITION"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={testDescription}
              onChange={(e) => setTestDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Optional description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Multiplier</label>
            <select
              value={testMultiplier || ''}
              onChange={(e) => setTestMultiplier(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              aria-label="Select multiplier value"
            >
              <option value="">None</option>
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </div>
          <div>
            <label className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                checked={testActive}
                onChange={(e) => setTestActive(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Active</span>
            </label>
          </div>
        </div>
        <button
          onClick={handleCreateTest}
          disabled={createMutation.isPending}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {createMutation.isPending ? 'Creating...' : 'Create Position'}
        </button>
      </div>

      {/* Positions List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Current Positions ({positions?.length || 0})</h3>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading positions...</div>
        ) : positions && positions.length > 0 ? (
          <div className="space-y-2">
            {positions.map((position) => (
              <div key={position.uuid} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{position.name}</h4>
                    <p className="text-sm text-gray-600">{position.description || 'No description'}</p>
                    <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                      <span>UUID: {position.uuid}</span>
                      <span>Active: {position.active ? 'Yes' : 'No'}</span>
                      {position.multiplier !== undefined && (
                        <span>Multiplier: {position.multiplier}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpdateTest(position.uuid)}
                    disabled={updateMutation.isPending}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:opacity-50"
                  >
                    Test Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No positions found. Create one using the form above.
          </div>
        )}
      </div>
      
      {/* API Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">API Status</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Create Mutation: </span>
            <span className={createMutation.isPending ? 'text-yellow-600' : createMutation.isError ? 'text-red-600' : 'text-green-600'}>
              {createMutation.isPending ? 'Loading' : createMutation.isError ? 'Error' : 'Ready'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Update Mutation: </span>
            <span className={updateMutation.isPending ? 'text-yellow-600' : updateMutation.isError ? 'text-red-600' : 'text-green-600'}>
              {updateMutation.isPending ? 'Loading' : updateMutation.isError ? 'Error' : 'Ready'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionsApiTest;