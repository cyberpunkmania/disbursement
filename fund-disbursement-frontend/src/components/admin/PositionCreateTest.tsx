import React, { useState } from 'react';
import { useCreatePosition } from '@/hooks/useAdmin';
import { useNotifications } from '@/components/ui/NotificationProvider';

const PositionCreateTest: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  
  const createMutation = useCreatePosition();
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      addNotification({ type: 'error', title: 'Name is required' });
      return;
    }

    try {
      console.log('Creating position with data:', { name, description, active });
      
      const result = await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        active,
      });
      
      console.log('Position created successfully:', result);
      
      addNotification({ 
        type: 'success', 
        title: 'Position created successfully',
        message: `${name} has been created.`
      });
      
      // Reset form
      setName('');
      setDescription('');
      setActive(true);
      
    } catch (error: any) {
      console.error('Failed to create position:', error);
      addNotification({ 
        type: 'error', 
        title: 'Failed to create position',
        message: error.message || 'An unexpected error occurred.'
      });
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Position Creation Test
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Position Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., SUPERVISOR"
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            disabled={createMutation.isPending}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Oversees site workers"
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            disabled={createMutation.isPending}
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="active-test"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="mr-2"
            disabled={createMutation.isPending}
          />
          <label htmlFor="active-test" className="text-sm text-gray-700 dark:text-gray-300">
            Active Position
          </label>
        </div>
        
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {createMutation.isPending ? 'Creating...' : 'Create Position'}
        </button>
      </form>
      
      {createMutation.error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error: {createMutation.error.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default PositionCreateTest;