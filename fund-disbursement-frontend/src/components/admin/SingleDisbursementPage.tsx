import React, { useMemo, useState } from 'react';
import { useWorkers, useCreateSingleDisbursement } from '@/hooks/useAdmin';
import { useNotifications } from '@/components/ui/NotificationProvider';
import DataTable from '@/components/ui/DataTable';

const SingleDisbursementPage: React.FC = () => {
  const { data: workers } = useWorkers();
  const createSingle = useCreateSingleDisbursement();
  const { addNotification } = useNotifications();
  const [single, setSingle] = useState({ workerUuid: '', amount: '' });

  const submitSingle = () => {
    if (!single.workerUuid || !single.amount) {
      addNotification({ type: 'error', title: 'Please select a worker and enter an amount' });
      return;
    }
    createSingle.mutate(
      { workerUuid: single.workerUuid, amount: parseFloat(single.amount) },
      {
        onSuccess: (res) => {
          console.log("Create single disbursement response:", res);
          addNotification({ type: 'success', title: 'Single disbursement batch created' });
          // Reset form
          setSingle({ workerUuid: '', amount: '' });
        },
        onError: () => {
          addNotification({ type: 'error', title: 'Failed to create disbursement' });
        },
      }
    );
  };

  const singlePreview = useMemo(() => {
    const w = (workers || []).find(w => w.uuid === single.workerUuid);
    return w ? [{
      uuid: w.uuid,
      fullName: w.fullName,
      email: w.email,
      phone: w.phone,
      amount: single.amount,
    }] : [] as Array<{ uuid: string; fullName: string; email: string; phone: string; amount: string }>;
  }, [workers, single]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Single Disbursement</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Create a disbursement batch for a single worker
        </p>
      </div>

      {/* Single payout card */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Worker Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Worker
            </label>
            <select
              className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={single.workerUuid}
              onChange={(e) => setSingle({ ...single, workerUuid: e.target.value })}
            >
              <option value="">Select worker</option>
              {workers?.map(w => (
                <option key={w.uuid} value={w.uuid}>
                  {w.fullName} - {w.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount (KES)
            </label>
            <input
              className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              type="number"
              step="0.01"
              placeholder="Enter amount"
              value={single.amount}
              onChange={(e) => setSingle({ ...single, amount: e.target.value })}
            />
          </div>

          <button
            className="inline-flex items-center justify-center px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus-visible-ring disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={submitSingle}
            disabled={createSingle.isPending || !single.workerUuid || !single.amount}
          >
            {createSingle.isPending ? 'Creating...' : 'Create Disbursement Batch'}
          </button>
        </div>

        {/* Preview */}
        {single.workerUuid && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Preview
            </h4>
            <DataTable<{ uuid: string; fullName: string; email: string; phone: string; amount: string }>
              data={singlePreview}
              emptyLabel="No worker selected"
              columns={[
                {
                  key: 'fullName',
                  header: 'Name',
                  render: (r) => (
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {r.fullName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {r.email}
                      </span>
                    </div>
                  ),
                },
                { key: 'phone', header: 'Phone' },
                {
                  key: 'amount',
                  header: 'Amount',
                  render: (r) => (
                    <span className="font-semibold text-gray-900 dark:text-white">
                      KES {r.amount ? Number(r.amount).toLocaleString() : '-'}
                    </span>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleDisbursementPage;