import React, { useState } from 'react';
import { useSendBatch, useDisbursementBatches } from '@/hooks/useAdmin';
import { useNotifications } from '@/components/ui/NotificationProvider';
import DataTable from '@/components/ui/DataTable';
import DisbursementBatchDetails from './DisbursementBatchDetails';

type DisbursementBatch = {
  batchUuid: string;
  status: string;
  createdAt: string;
  payoutCount: number;
  amountTotal: number;
};

type DraftBatchesResponse = {
  content: DisbursementBatch[];
  totalPages: number;
  number: number;
  first: boolean;
  last: boolean;
};

const BatchDisbursementPage: React.FC = () => {
  const sendBatch = useSendBatch();
  const { addNotification } = useNotifications();
  const [draftPage, setDraftPage] = useState(0);
  const [viewBatchUuid, setViewBatchUuid] = useState<string | null>(null);
  const [confirmBatchUuid, setConfirmBatchUuid] = useState<string | null>(null);

  const { data: draftBatchesRaw, isLoading: loadingDrafts } = useDisbursementBatches(draftPage, 20);
  const draftBatches: DraftBatchesResponse = draftBatchesRaw !== undefined && draftBatchesRaw !== null
    ? draftBatchesRaw as DraftBatchesResponse
    : { content: [], totalPages: 1, number: 0, first: true, last: true };

  const draftOnly = draftBatches.content.filter((b: any) => b.status === 'DRAFT');

  const doSend = (uuid: string) => {
    sendBatch.mutate(uuid, {
      onSuccess: () => {
        addNotification({ type: 'success', title: 'Batch sent' });
        setConfirmBatchUuid(null);
      },
      onError: () => addNotification({ type: 'error', title: 'Send failed' }),
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Batch Disbursements</h2>

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

export default BatchDisbursementPage;