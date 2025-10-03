import React from 'react';
import { usePayoutKpi } from '@/hooks/useAdmin';

const PayoutStatCards: React.FC = () => {
  const { data: kpi, isLoading } = usePayoutKpi();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow border border-gray-200 dark:border-dark-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">Total Payouts</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {isLoading ? '...' : kpi?.total ?? '-'}
        </div>
      </div>
      
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow border border-gray-200 dark:border-dark-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">Pending</div>
        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
          {isLoading ? '...' : kpi?.pending ?? '-'}
        </div>
      </div>
      
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow border border-gray-200 dark:border-dark-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">Sent</div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {isLoading ? '...' : kpi?.sent ?? '-'}
        </div>
      </div>
      
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow border border-gray-200 dark:border-dark-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">Failed</div>
        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
          {isLoading ? '...' : kpi?.failed ?? '-'}
        </div>
      </div>
      
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow border border-gray-200 dark:border-dark-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">Total Amount</div>
        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          {isLoading ? '...' : kpi?.totalAmount ? `KES ${kpi.totalAmount.toLocaleString()}` : '-'}
        </div>
      </div>
      
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow border border-gray-200 dark:border-dark-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">Success Amount</div>
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
          {isLoading ? '...' : kpi?.successAmount ? `KES ${kpi.successAmount.toLocaleString()}` : '0'}
        </div>
      </div>
      
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow border border-gray-200 dark:border-dark-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">Success</div>
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
          {isLoading ? '...' : kpi?.success ?? '-'}
        </div>
      </div>
      
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow border border-gray-200 dark:border-dark-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">Success Rate</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {isLoading ? '...' : kpi?.total && kpi.total > 0 
            ? `${Math.round((kpi.success / kpi.total) * 100)}%` 
            : '-'}
        </div>
      </div>
    </div>
  );
};

export default PayoutStatCards;