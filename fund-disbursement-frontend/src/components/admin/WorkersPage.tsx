import React from 'react';
import { useWorkers, useDeleteWorker, useToggleWorkerPayable } from '@/hooks/useAdmin';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/components/ui/NotificationProvider';
import { WorkerModal } from './WorkerModal';
import type { Worker } from '@/types/admin.types';
import DataTable from '@/components/ui/DataTable';

const WorkersPage: React.FC = () => {
  const { data: workers, isLoading } = useWorkers();
  const deleteWorkerMutation = useDeleteWorker();
  const togglePayableMutation = useToggleWorkerPayable();
  const { addNotification } = useNotifications();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingWorker, setEditingWorker] = React.useState<Worker | undefined>();

  const handleCreate = () => {
    setEditingWorker(undefined);
    setIsModalOpen(true);
  };
  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setIsModalOpen(true);
  };
  const handleDelete = (uuid: string) => {
    if (window.confirm('Delete this worker?')) {
      deleteWorkerMutation.mutate(uuid, {
        onSuccess: () => addNotification({ type: 'success', title: 'Worker deleted' }),
        onError: () => addNotification({ type: 'error', title: 'Delete failed' }),
      });
    }
  };

  const handleTogglePayable = (uuid: string, current: boolean) => {
    togglePayableMutation.mutate(
      { uuid, payable: !current },
      {
        onSuccess: () => addNotification({ type: 'success', title: `Marked as ${!current ? 'payable' : 'not payable'}` }),
        onError: () => addNotification({ type: 'error', title: 'Toggle failed' }),
      }
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Workers</h2>
        <button onClick={handleCreate} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center">
          <PlusIcon className="w-4 h-4 mr-2" /> Add Worker
        </button>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
        {isLoading ? (
          <div className="p-6">Loading...</div>
        ) : (
          <DataTable<Worker>
            data={workers || []}
            emptyLabel="No workers to display"
            columns={[
              { key: 'fullName', header: 'Name', render: (w) => (
                <div className="flex flex-col">
                  <span className="text-gray-900 dark:text-white font-medium">{w.fullName}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{w.email}</span>
                </div>
              ) },
              { key: 'phone', header: 'Phone', render: (w) => (
                <span className="text-gray-700 dark:text-gray-300">{w.phone}</span>
              ) },
              { key: 'payFrequency', header: 'Frequency' },
              { key: 'rate', header: 'Rate', render: (w) => (
                <span>KES {Number(w.rate).toLocaleString()}</span>
              ) },
              { key: 'team', header: 'Team', render: (w) => (
                <span className="text-gray-700 dark:text-gray-300">{w.team || '-'}</span>
              ) },
              { key: 'status', header: 'Status', render: (w) => (
                w.status === 'ACTIVE' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Active</span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">Inactive</span>
                )
              ) },
              { key: 'payable', header: 'Payable', render: (w) => (
                <label className="inline-flex items-center space-x-2">
                  <input type="checkbox" checked={w.payable} onChange={() => handleTogglePayable(w.uuid, w.payable)} />
                  <span className="text-sm">{w.payable ? 'Yes' : 'No'}</span>
                </label>
              ) },
              { key: 'actions', header: 'Actions', className: 'text-right', render: (w) => (
                <div className="space-x-1">
                  <button onClick={() => handleEdit(w)} className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus-visible-ring rounded-lg" aria-label={`Edit ${w.fullName}`}>
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(w.uuid)} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 focus-visible-ring rounded-lg" aria-label={`Delete ${w.fullName}`}>
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ) },
            ]}
          />
        )}
      </div>

      <WorkerModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingWorker(undefined); }}
        worker={editingWorker}
      />
    </div>
  );
};
export default WorkersPage;
