import React, { useState } from 'react';
import { usePositions } from '@/hooks/useAdmin';

const PositionFilterTest: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Get positions based on filter
  const activeOnly = filter === 'active' ? true : filter === 'inactive' ? false : undefined;
  const { data: positions, isLoading, error } = usePositions(activeOnly);

  return (
    <div className="p-6 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Position Filter Test
      </h3>
      
      {/* Filter Controls */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter Positions:
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-500'
            }`}
          >
            All Positions
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-500'
            }`}
          >
            Active Only
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'inactive'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-500'
            }`}
          >
            Inactive Only
          </button>
        </div>
      </div>

      {/* API Info */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>API Call:</strong> GET /api/admin/positions (no query parameters)
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
          <strong>Client-side Filter:</strong> {
            filter === 'all' ? 'None (showing all)' :
            filter === 'active' ? 'active === true' :
            'active === false'
          }
        </p>
      </div>

      {/* Results */}
      <div>
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
          Results ({positions?.length || 0} positions):
        </h4>
        
        {isLoading ? (
          <p className="text-sm text-blue-600">Loading positions...</p>
        ) : error ? (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              Error: {error.message}
            </p>
          </div>
        ) : positions && positions.length > 0 ? (
          <div className="space-y-2">
            {positions.map((position) => (
              <div
                key={position.uuid}
                className="p-3 border border-gray-200 dark:border-dark-600 rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {position.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {position.description || 'No description'}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    position.active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}
                >
                  {position.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No positions found for the selected filter.
          </p>
        )}
      </div>
    </div>
  );
};

export default PositionFilterTest;