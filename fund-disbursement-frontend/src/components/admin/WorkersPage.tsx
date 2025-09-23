import React from 'react';
import { useWorkers, useDeleteWorker } from '@/hooks/useAdmin';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/components/ui/NotificationProvider';
import { WorkerModal } from './WorkerModal';
import type { Worker } from '@/types/admin.types';

const WorkersPage: React.FC = () => {
  const { data: workers, isLoading } = useWorkers();
  const deleteWorkerMutation = useDeleteWorker();
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

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Workers</h2>
        <button onClick={handleCreate} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center">
          <PlusIcon className="w-4 h-4 mr-2" /> Add Worker
        </button>
      </div>
      <div className="space-y-3">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          workers?.map((worker) => (
            <div key={worker.uuid} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{worker.fullName}</p>
                <p className="text-sm text-gray-500">{worker.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => handleEdit(worker)} className="p-1 text-gray-400 hover:text-blue-600"><PencilIcon className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(worker.uuid)} className="p-1 text-gray-400 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
              </div>
            </div>
          ))
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
