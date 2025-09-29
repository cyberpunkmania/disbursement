import React, { useState } from 'react';
import { usePayPeriods, useCreatePayPeriod, useGeneratePayItems, useApprovePayPeriod, useCreateBatchFromPeriod } from '@/hooks/useAdmin';
import { useNotifications } from '@/components/ui/NotificationProvider';

const statusColor = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return 'bg-gray-200 text-gray-800';
    case 'APPROVED':
      return 'bg-blue-100 text-blue-700';
    case 'LOCKED':
      return 'bg-yellow-100 text-yellow-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-700';
    case 'CANCELLED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const PayrollPage: React.FC = () => {
  const { data: periods, isLoading } = usePayPeriods();
  const createMutation = useCreatePayPeriod();
  const generateItems = useGeneratePayItems();
  const approve = useApprovePayPeriod();
  const createBatchFromPeriod = useCreateBatchFromPeriod();
  const { addNotification } = useNotifications();
  const [form, setForm] = useState({ frequency: 'WEEKLY', startDate: '', endDate: '', label: '' });
  const [formError, setFormError] = useState('');

  const isFormFilled = form.frequency && form.startDate && form.endDate && form.label.trim();

  const submit = () => {
    if (!form.label.trim()) {
      setFormError('Label is required');
      return;
    }
    setFormError('');
    createMutation.mutate(form as any, {
      onSuccess: () => addNotification({ type: 'success', title: 'Pay period created' }),
      onError: (e: any) => addNotification({ type: 'error', title: e?.message || 'Create failed' }),
    });
  };

  const doGenerate = (uuid: string) => {
    generateItems.mutate(uuid, {
      onSuccess: () => addNotification({ type: 'success', title: 'Pay items generated' }),
      onError: () => addNotification({ type: 'error', title: 'Generate failed' }),
    });
  };

  const doApprove = (uuid: string) => {
    approve.mutate(uuid, {
      onSuccess: () => addNotification({ type: 'success', title: 'Period approved' }),
      onError: () => addNotification({ type: 'error', title: 'Approve failed' }),
    });
  };

  const doCreateBatch = (uuid: string) => {
    createBatchFromPeriod.mutate(uuid, {
      onSuccess: () => addNotification({ type: 'success', title: 'Batch created from period' }),
      onError: () => addNotification({ type: 'error', title: 'Batch creation failed' }),
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Payroll</h2>

      <div className="mb-6 p-4 border rounded-xl bg-white dark:bg-dark-800 shadow-sm">
        <h3 className="font-semibold mb-3">Create Pay Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select className="border rounded px-2 py-1" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
            <option value="DAILY">DAILY</option>
            <option value="WEEKLY">WEEKLY</option>
            <option value="MONTHLY">MONTHLY</option>
          </select>
          <input className="border rounded px-2 py-1" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <input className="border rounded px-2 py-1" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          <input
            className={`border rounded px-2 py-1 ${formError ? 'border-red-500' : ''}`}
            placeholder="Label"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
          <button
            onClick={submit}
            className={`bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition ${!isFormFilled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isFormFilled}
          >
            Create
          </button>
        </div>
        {formError && <div className="text-red-600 text-sm mt-2">{formError}</div>}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="p-6">Loading...</div>
        ) : (
          periods?.map((p) => (
            <div
              key={p.uuid}
              className="p-4 border rounded-xl bg-white dark:bg-dark-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between transition hover:shadow-md"
            >
              <div>
                <div className="font-medium text-lg">{p.label || p.uuid}</div>
                <div className="text-sm text-gray-500">
                  <span className="font-semibold">{p.frequency}</span>
                  {' '}
                  <span>{p.startDate} → {p.endDate}</span>
                  {' '}
                  <span className={`inline-block ml-2 px-2 py-0.5 rounded text-xs font-semibold ${statusColor(p.status)}`}>
                    {p.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-0">
                {p.status === 'DRAFT' && (
                  <>
                    <button
                      className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 dark:bg-dark-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark-600 border border-gray-300 dark:border-dark-600 transition font-medium shadow-sm"
                      onClick={() => doGenerate(p.uuid)}
                    >
                      <span>🛠️</span>
                      Generate Items
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 border border-blue-200 dark:border-blue-700 transition font-medium shadow-sm"
                      onClick={() => doApprove(p.uuid)}
                    >
                      <span>✅</span>
                      Approve
                    </button>
                  </>
                )}
                <button
                  className="flex items-center gap-1 px-3 py-1 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-800 border border-emerald-200 dark:border-emerald-700 transition font-medium shadow-sm"
                  onClick={() => doCreateBatch(p.uuid)}
                >
                  <span>💸</span>
                  Create Batch
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default PayrollPage;
