import React from 'react';
import { usePayouts } from '@/hooks/useAdmin';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import DataTable from '@/components/ui/DataTable';
import type { Payout } from '@/types/admin.types';

type PaginatedPayouts = {
  content: Payout[];
  totalPages: number;
  number: number;
  first: boolean;
  last: boolean;
  totalElements: number;
};

const PAGE_SIZE = 10;

const PayoutsPage: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { data: payoutsData, isLoading } = usePayouts(page, PAGE_SIZE) as { 
    data?: PaginatedPayouts; 
    isLoading: boolean;
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'SENT':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredPayouts = React.useMemo(() => {
    if (!searchQuery || !payoutsData?.content) return payoutsData?.content || [];
    
    const query = searchQuery.toLowerCase();
    return payoutsData.content.filter(
      (payout) =>
        payout.workerName?.toLowerCase().includes(query) ||
        payout.workerPhone?.includes(query) ||
        payout.mpesaReceipt?.toLowerCase().includes(query)
    );
  }, [payoutsData?.content, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payouts</h2>
        
        {/* Search Bar */}
        <div className="relative w-80">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or receipt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Payouts</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {payoutsData?.totalElements || 0}
          </div>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Sent</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {payoutsData?.content.filter(p => p.state === 'SENT').length || 0}
          </div>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
            {payoutsData?.content.filter(p => p.state === 'PENDING').length || 0}
          </div>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Amount</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            KES {payoutsData?.content.reduce((sum, p) => sum + p.amount, 0).toLocaleString() || 0}
          </div>
        </div>
      </div> */}

      {/* Payouts Table */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
        {isLoading ? (
          <div className="p-6 text-center">Loading payouts...</div>
        ) : (
          <DataTable<Payout>
            data={filteredPayouts}
            emptyLabel="No payouts to display"
            columns={[
              {
                key: 'workerName',
                header: 'Worker',
                className: 'text-left',
                render: (p) => (
                  <div className="flex flex-col">
                    <span className="text-gray-900 dark:text-white font-medium">
                      {p.workerName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {p.workerPhone}
                    </span>
                  </div>
                ),
              },
              {
                key: 'amount',
                header: 'Amount',
                className: 'text-left',
                render: (p) => (
                  <span className="font-semibold text-gray-900 dark:text-white">
                    KES {p.amount.toLocaleString()}
                  </span>
                ),
              },
              {
                key: 'state',
                header: 'Status',
                className: 'text-left',
                render: (p) => (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(
                      p.state
                    )}`}
                  >
                    {p.state}
                  </span>
                ),
              },
            //   {
            //     key: 'mpesaReceipt',
            //     header: 'M-Pesa Receipt',
            //     render: (p) => (
            //       <span className="text-sm text-gray-700 dark:text-gray-300">
            //         {p.mpesaReceipt || '-'}
            //       </span>
            //     ),
            //   },
              {
                key: 'createdAt',
                header: 'Created At',
                className: 'text-left',
                render: (p) => (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(p.createdAt)}
                  </span>
                ),
              },
              {
                key: 'sentAt',
                header: 'Sent At',
                className: 'text-left',
                render: (p) => (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {p.sentAt ? formatDate(p.sentAt) : '-'}
                  </span>
                ),
              }
            ]}
          />
        )}

        {/* Pagination Controls */}
        {payoutsData && payoutsData.totalPages > 0 && (
          <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-dark-700">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={payoutsData.first}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {payoutsData.number + 1} of {payoutsData.totalPages} 
              <span className="ml-2 text-gray-500">
                ({payoutsData.totalElements} total)
              </span>
            </span>
            <button
              onClick={() => setPage((p) => (!payoutsData.last ? p + 1 : p))}
              disabled={payoutsData.last}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayoutsPage;