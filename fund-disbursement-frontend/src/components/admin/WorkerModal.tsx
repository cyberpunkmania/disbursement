import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { 
  Worker, 
  CreateWorkerRequest, 
  UpdateWorkerRequest, 
} from '@/types/admin.types';
import { useCreateWorker, useUpdateWorker, usePositions } from '@/hooks/useAdmin';
import { useNotifications } from '@/components/ui/NotificationProvider';

const workerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  payFrequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
  rate: z.number().positive('Rate must be positive'),
  team: z.string().optional(),
  positionUuid: z.string().uuid('Invalid position selection'),
  nationalId: z.string().optional(),
  kraPin: z.string().optional(),
});

interface WorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker?: Worker;
}

export const WorkerModal: React.FC<WorkerModalProps> = ({
  isOpen,
  onClose,
  worker,
}) => {
  const { addNotification } = useNotifications();
  const { data: positions } = usePositions();
  const createMutation = useCreateWorker();
  const updateMutation = useUpdateWorker();
  const isEditing = !!worker;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(workerSchema),
    defaultValues: worker || {},
  });

  useEffect(() => {
    if (worker) {
      reset(worker);
    } else {
      reset({});
    }
  }, [worker, reset]);

  const handleFormSubmit = async (formData: any) => {
    try {
      if (isEditing && worker) {
        await updateMutation.mutateAsync({
          uuid: worker.uuid,
          data: formData as UpdateWorkerRequest,
        });
        addNotification({
          type: 'success',
          title: 'Worker updated successfully',
          message: `${formData.fullName} has been updated.`,
        });
      } else {
        await createMutation.mutateAsync(formData as CreateWorkerRequest);
        addNotification({
          type: 'success',
          title: 'Worker created successfully',
          message: `${formData.fullName} has been created.`,
        });
      }
      handleClose();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: isEditing ? 'Failed to update worker' : 'Failed to create worker',
        message: error.message || 'An unexpected error occurred.',
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-dark-800">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {isEditing ? 'Edit Worker' : 'Create Worker'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name*
              </label>
              <input
                type="text"
                {...register('fullName')}
                className="mt-1 block w-full border border-gray-300 dark:border-dark-600 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                placeholder="Enter full name"
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email*
              </label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 block w-full border border-gray-300 dark:border-dark-600 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                placeholder="Enter email address"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone*
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="mt-1 block w-full border border-gray-300 dark:border-dark-600 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                placeholder="Enter phone number"
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Position*
              </label>
              <select
                {...register('positionUuid')}
                className="mt-1 block w-full border border-gray-300 dark:border-dark-600 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                disabled={isLoading}
              >
                <option value="">Select a position</option>
                {positions?.map((position) => (
                  <option key={position.uuid} value={position.uuid}>
                    {position.name}
                  </option>
                ))}
              </select>
              {errors.positionUuid && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.positionUuid.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Pay Frequency*
              </label>
              <select
                {...register('payFrequency')}
                className="mt-1 block w-full border border-gray-300 dark:border-dark-600 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                disabled={isLoading}
              >
                <option value="">Select frequency</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
              {errors.payFrequency && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.payFrequency.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rate*
              </label>
              <input
                type="number"
                step="0.01"
                {...register('rate', { valueAsNumber: true })}
                className="mt-1 block w-full border border-gray-300 dark:border-dark-600 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                placeholder="Enter hourly/daily rate"
                disabled={isLoading}
              />
              {errors.rate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Team
              </label>
              <input
                type="text"
                {...register('team')}
                className="mt-1 block w-full border border-gray-300 dark:border-dark-600 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                placeholder="Enter team name (optional)"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                National ID
              </label>
              <input
                type="text"
                {...register('nationalId')}
                className="mt-1 block w-full border border-gray-300 dark:border-dark-600 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                placeholder="Enter national ID (optional)"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                KRA PIN
              </label>
              <input
                type="text"
                {...register('kraPin')}
                className="mt-1 block w-full border border-gray-300 dark:border-dark-600 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                placeholder="Enter KRA PIN (optional)"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : isEditing ? 'Update Worker' : 'Create Worker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};