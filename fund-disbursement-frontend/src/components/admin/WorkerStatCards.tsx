import React from 'react';
import { useWorkerKpi } from '@/hooks/useAdmin';

const WorkerStatCards: React.FC = () => {
  const { data: kpi, isLoading } = useWorkerKpi();
  console.log("Worker KPI data:", kpi);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow border">
        <div className="text-xs text-gray-500">Total Workers</div>
        <div className="text-2xl font-bold">{isLoading ? '...' : kpi?.totalWorkers ?? '-'}</div>
      </div>
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow border">
        <div className="text-xs text-gray-500">Active Workers</div>
        <div className="text-2xl font-bold text-green-600">{isLoading ? '...' : kpi?.activeWorkers ?? '-'}</div>
      </div>
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow border">
        <div className="text-xs text-gray-500">Inactive Workers</div>
        <div className="text-2xl font-bold text-red-600">{isLoading ? '...' : kpi?.inactiveWorkers ?? '-'}</div>
      </div>
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow border">
        <div className="text-xs text-gray-500">Payable Workers</div>
        <div className="text-2xl font-bold">{isLoading ? '...' : kpi?.payableWorkers ?? '-'}</div>
      </div>
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow border">
        <div className="text-xs text-gray-500">KYC Gaps</div>
        <div className="text-2xl font-bold">{isLoading ? '...' : kpi?.kycGaps ?? '-'}</div>
      </div>
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow border">
        <div className="text-xs text-gray-500">Valid Phones (%)</div>
        <div className="text-2xl font-bold">{isLoading ? '...' : kpi?.phoneValidPct ?? '-'}</div>
      </div>
    </div>
  );
};

export default WorkerStatCards;