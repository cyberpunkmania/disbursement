import React, { useMemo, useState } from 'react';
import { useWorkers, useCreateSingleDisbursement, useSendBatch, useDisbursementBatches } from '@/hooks/useAdmin';
import { useNotifications } from '@/components/ui/NotificationProvider';
import DataTable from '@/components/ui/DataTable';
import DisbursementBatchDetails from './DisbursementBatchDetails';

const DisbursementsPage: React.FC = () => {
  const { data: workers } = useWorkers();
  const createSingle = useCreateSingleDisbursement();
  const sendBatch = useSendBatch();
  const { addNotification } = useNotifications();
  const [single, setSingle] = useState({ workerUuid: '', amount: '' });
  const [draftPage, setDraftPage] = useState(0);
  type DisbursementBatch = {
    batchUuid: string;
    status: string;
    createdAt: string;
    payoutCount: number;
    amountTotal: number;
    // add other fields as needed
  };

  type DraftBatchesResponse = {
    content: DisbursementBatch[];
    totalPages: number;
    number: number;
    first: boolean;
    last: boolean;
    // add other fields as needed
  };

  const { data: draftBatchesRaw, isLoading: loadingDrafts } = useDisbursementBatches(draftPage, 20);
  const draftBatches: DraftBatchesResponse = draftBatchesRaw !== undefined && draftBatchesRaw !== null
    ? draftBatchesRaw as DraftBatchesResponse
    : { content: [], totalPages: 1, number: 0, first: true, last: true };
  const [viewBatchUuid, setViewBatchUuid] = useState<string | null>(null);
  const [confirmBatchUuid, setConfirmBatchUuid] = useState<string | null>(null);

  const draftOnly = draftBatches.content.filter((b: any) => b.status === 'DRAFT');

  const submitSingle = () => {
    if (!single.workerUuid || !single.amount) return;
    createSingle.mutate({ workerUuid: single.workerUuid, amount: parseFloat(single.amount) }, {
      onSuccess: (res) => {
        console.log("Create single disbursement response:", res);
        addNotification({ type: 'success', title: 'Single batch created' });
       // const b = (res as any)?.data?.batchUuid;
        // const b = (res as any)?.data?.batchUuid;
        // if (b) setBatchUuid(b);
      },
    });
  };

  const doSend = (uuid: string) => {
    sendBatch.mutate(uuid, {
      onSuccess: () => {
        addNotification({ type: 'success', title: 'Batch sent' });
        setConfirmBatchUuid(null);
      },
      onError: () => addNotification({ type: 'error', title: 'Send failed' }),
    });
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
      <h2 className="text-2xl font-bold mb-6">Disbursements</h2>

      {/* Single payout card */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4 sm:p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Single Payout Batch</h3>
        <div className="space-y-3">
          <select className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-white" value={single.workerUuid} onChange={(e) => setSingle({ ...single, workerUuid: e.target.value })}>
            <option value="">Select worker</option>
            {workers?.map(w => (<option key={w.uuid} value={w.uuid}>{w.fullName}</option>))}
          </select>
          <input className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-white" type="number" step="0.01" placeholder="Amount" value={single.amount} onChange={(e) => setSingle({ ...single, amount: e.target.value })} />
          <button className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus-visible-ring" onClick={submitSingle}>Create</button>
        </div>
        <div className="mt-4">
          <DataTable<{ uuid: string; fullName: string; email: string; phone: string; amount: string }>
            data={singlePreview}
            emptyLabel="No worker selected"
            columns={[
              { key: 'fullName', header: 'Name', render: (r) => (
                <div className="flex flex-col"><span className="font-medium text-gray-900 dark:text-white">{r.fullName}</span><span className="text-xs text-gray-500 dark:text-gray-400">{r.email}</span></div>
              ) },
              { key: 'phone', header: 'Phone' },
              { key: 'amount', header: 'Amount', render: (r) => (<span>KES {r.amount || '-'}</span>) },
            ]}
          />
        </div>
      </div>

      {/* Draft Batches Section */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Draft Disbursement Batches</h3>
        {loadingDrafts ? (
          <div className="p-6">Loading...</div>
        ) : draftOnly.length === 0 ? (
          <div className="p-6">No draft batches to display.</div>
        ) : (
          <DataTable<any>
            data={draftOnly}
            emptyLabel="No draft batches to display"
            columns={[
              { key: 'batchUuid', header: 'Batch UUID', render: (b) => (
                <span className="font-mono text-xs">{b.batchUuid}</span>
              ) },
              { key: 'createdAt', header: 'Created', render: (b) => (
                <span>{new Date(b.createdAt).toLocaleString()}</span>
              ) },
              { key: 'payoutCount', header: 'Payouts' },
              { key: 'amountTotal', header: 'Amount', render: (b) => (
                <span>KES {Number(b.amountTotal).toLocaleString()}</span>
              ) },
              { key: 'actions', header: 'Actions', className: 'text-right', render: (b) => (
                <div className="space-x-1">
                  <button
                    className="p-2 text-blue-600 hover:text-blue-800 focus-visible-ring rounded-lg"
                    onClick={() => setViewBatchUuid(b.batchUuid)}
                  >
                    View
                  </button>
                  <button
                    className="p-2 text-green-600 hover:text-green-800 focus-visible-ring rounded-lg"
                    onClick={() => setConfirmBatchUuid(b.batchUuid)}
                  >
                    Disburse
                  </button>
                </div>
              ) },
            ]}
          />
        )}

        {(draftBatches && (draftBatches as DraftBatchesResponse).totalPages > 1) ? (
          <div className="flex justify-between items-center p-4 border-t mt-2">
            <button
              onClick={() => setDraftPage((p) => Math.max(p - 1, 0))}
              disabled={(draftBatches as DraftBatchesResponse).first}
              className="px-3 py-1 rounded bg-gray-100 dark:bg-dark-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {(draftBatches as DraftBatchesResponse).number + 1} of {(draftBatches as DraftBatchesResponse).totalPages}
            </span>
            <button
              onClick={() => setDraftPage((p) => (!(draftBatches as DraftBatchesResponse).last ? p + 1 : p))}
              disabled={(draftBatches as DraftBatchesResponse).last}
              className="px-3 py-1 rounded bg-gray-100 dark:bg-dark-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : null}

        {/* Batch Details Modal */}
        {viewBatchUuid && (
          <DisbursementBatchDetails
            batchUuid={viewBatchUuid}
            onClose={() => setViewBatchUuid(null)}
          />
        )}

        {/* Confirmation Dialog */}
        {confirmBatchUuid && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h4 className="text-lg font-semibold mb-4">Confirm Disbursement</h4>
              <p className="mb-6">Are you sure you want to disburse this batch?</p>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-dark-700"
                  onClick={() => setConfirmBatchUuid(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-green-600 text-white"
                  onClick={() => doSend(confirmBatchUuid)}
                >
                  Yes, Disburse
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisbursementsPage;
