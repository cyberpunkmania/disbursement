import React, { useMemo, useState } from 'react';
import { useWorkers, useCreateSingleDisbursement, useCreateBatchDisbursement, useSendBatch } from '@/hooks/useAdmin';
import { useNotifications } from '@/components/ui/NotificationProvider';
import DataTable from '@/components/ui/DataTable';

const DisbursementsPage: React.FC = () => {
  const { data: workers } = useWorkers();
  const createSingle = useCreateSingleDisbursement();
  const createBatch = useCreateBatchDisbursement();
  const sendBatch = useSendBatch();
  const { addNotification } = useNotifications();
  const [single, setSingle] = useState({ workerUuid: '', amount: '' });
  const [selected, setSelected] = useState<string[]>([]);
  const [batchUuid, setBatchUuid] = useState('');

  const submitSingle = () => {
    if (!single.workerUuid || !single.amount) return;
    createSingle.mutate({ workerUuid: single.workerUuid, amount: parseFloat(single.amount) }, {
      onSuccess: (res) => {
        addNotification({ type: 'success', title: 'Single batch created' });
        const b = (res as any)?.data?.batchUuid;
        if (b) setBatchUuid(b);
      },
      onError: (e: any) => addNotification({ type: 'error', title: e?.message || 'Create failed' }),
    });
  };

  const submitBatch = () => {
    if (selected.length === 0) return;
    createBatch.mutate(selected, {
      onSuccess: (res) => {
        addNotification({ type: 'success', title: 'Batch created' });
        const b = (res as any)?.data?.batchUuid;
        if (b) setBatchUuid(b);
      },
      onError: () => addNotification({ type: 'error', title: 'Batch create failed' }),
    });
  };

  const doSend = () => {
    if (!batchUuid) return;
    sendBatch.mutate(batchUuid, {
      onSuccess: () => addNotification({ type: 'success', title: 'Batch sent' }),
      onError: () => addNotification({ type: 'error', title: 'Send failed' }),
    });
  };

  const selectedWorkers = useMemo(() => (workers || []).filter(w => selected.includes(w.uuid)), [workers, selected]);
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Single payout card */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4 sm:p-6">
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

        {/* Batch from selection card */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Batch from Selection</h3>
          <div className="max-h-60 overflow-auto border border-gray-200 dark:border-dark-700 rounded-lg">
            {(workers || []).map(w => (
              <label key={w.uuid} className="flex items-center justify-between px-3 py-2 border-b last:border-b-0 border-gray-200 dark:border-dark-700">
                <span className="text-sm text-gray-800 dark:text-gray-200">{w.fullName}</span>
                <input type="checkbox" checked={selected.includes(w.uuid)} onChange={(e) => setSelected((prev) => e.target.checked ? [...prev, w.uuid] : prev.filter(id => id !== w.uuid))} />
              </label>
            ))}
          </div>
          <div className="mt-3 flex items-center space-x-2">
            <button className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-sm" onClick={submitBatch}>Create Batch</button>
          </div>
          <div className="mt-4">
            <DataTable<typeof selectedWorkers[number]>
              data={selectedWorkers}
              emptyLabel="No workers selected"
              columns={[
                { key: 'fullName', header: 'Name', render: (w) => (
                  <div className="flex flex-col"><span className="font-medium text-gray-900 dark:text-white">{w.fullName}</span><span className="text-xs text-gray-500 dark:text-gray-400">{w.email}</span></div>
                ) },
                { key: 'phone', header: 'Phone' },
                { key: 'payFrequency', header: 'Frequency' },
                { key: 'rate', header: 'Rate', render: (w) => (<span>KES {Number(w.rate).toLocaleString()}</span>) },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Send batch */}
      <div className="mt-6 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Send Batch</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input className="flex-1 border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-white" placeholder="Batch UUID" value={batchUuid} onChange={(e) => setBatchUuid(e.target.value)} />
          <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-sm" onClick={doSend}>Send</button>
        </div>
        {batchUuid && (
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">Current batch: <span className="font-mono">{batchUuid}</span></div>
        )}
      </div>
    </div>
  );
};
export default DisbursementsPage;
