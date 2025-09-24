import React, { useState } from 'react';
import { usePayPeriods, useCreatePayPeriod, useGeneratePayItems, useApprovePayPeriod, useCreateBatchFromPeriod } from '@/hooks/useAdmin';
import { useNotifications } from '@/components/ui/NotificationProvider';

const PayrollPage: React.FC = () => {
  const { data: periods, isLoading } = usePayPeriods();
  const createMutation = useCreatePayPeriod();
  const generateItems = useGeneratePayItems();
  const approve = useApprovePayPeriod();
  const createBatchFromPeriod = useCreateBatchFromPeriod();
  const { addNotification } = useNotifications();
  const [form, setForm] = useState({ frequency: 'WEEKLY', startDate: '', endDate: '', label: '' });

  const submit = () => {
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

      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="font-semibold mb-3">Create Pay Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select className="border rounded px-2 py-1" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
            <option value="DAILY">DAILY</option>
            <option value="WEEKLY">WEEKLY</option>
            <option value="MONTHLY">MONTHLY</option>
          </select>
          <input className="border rounded px-2 py-1" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <input className="border rounded px-2 py-1" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          <input className="border rounded px-2 py-1" placeholder="Label (optional)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          <button onClick={submit} className="bg-emerald-600 text-white px-3 py-1 rounded">Create</button>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          periods?.map((p) => (
            <div key={p.uuid} className="p-3 border rounded-lg flex items-center justify-between">
              <div>
                <div className="font-medium">{p.label || p.uuid}</div>
                <div className="text-sm text-gray-500">{p.frequency} {p.startDate} → {p.endDate} • {p.status}</div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border rounded" onClick={() => doGenerate(p.uuid)}>Generate Items</button>
                <button className="px-3 py-1 border rounded" onClick={() => doApprove(p.uuid)}>Approve</button>
                <button className="px-3 py-1 border rounded" onClick={() => doCreateBatch(p.uuid)}>Create Batch</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default PayrollPage;
