import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Position, CreatePositionRequest, UpdatePositionRequest } from '@/types/admin.types';
import { useCreatePosition, useUpdatePosition } from '@/hooks/useAdmin';
import { useNotifications } from '@/components/ui/NotificationProvider';

// Validation schema
const positionSchema = z.object({
  name: z.string().min(1, 'Position name is required').max(100, 'Name too long'),
  description: z.string().optional(),
  active: z.boolean().optional(),
  multiplier: z.number().min(0).max(1).optional(),
});

interface PositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  position?: Position; // Renamed from 'data' for clarity
  onSubmit?: (data: CreatePositionRequest | UpdatePositionRequest) => Promise<any>;
}

export const PositionModal: React.FC<PositionModalProps> = ({
  isOpen,
  onClose,
  position,
  onSubmit,
}) => {
  const { addNotification } = useNotifications();
    const createMutation = useCreatePosition();
    const updateMutation = useUpdatePosition();
    const [submitting, setSubmitting] = useState(false);
  const isEditing = !!position;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(positionSchema),
    defaultValues: position || { active: true },
  });

  // Reset form when position changes
  useEffect(() => {
    if (position) {
      reset(position);
    } else {
      reset({ active: true });
    }
  }, [position, reset]);

  const handleFormSubmit = async (formData: any) => {
    setSubmitting(true);
    try {
      if (onSubmit) {
        // Parent will handle create/update
        await onSubmit(formData as CreatePositionRequest | UpdatePositionRequest);
        setTimeout(() => {
          addNotification({
            type: 'success',
            title: isEditing ? 'Position updated successfully' : 'Position created successfully',
            message: `${formData.name} has been ${isEditing ? 'updated' : 'created'}.`,
          });
          handleClose();
        }, 300);
      } else {
        if (isEditing && position) {
          await updateMutation.mutateAsync({
            uuid: position.uuid,
            data: formData as UpdatePositionRequest,
          });
          // Wait for positions query to refetch
          setTimeout(() => {
            addNotification({
              type: 'success',
              title: 'Position updated successfully',
              message: `${formData.name} has been updated.`,
            });
            handleClose();
          }, 300);
        } else {
          await createMutation.mutateAsync(formData as CreatePositionRequest);
          // Wait for positions query to refetch
          setTimeout(() => {
            addNotification({
              type: 'success',
              title: 'Position created successfully',
              message: `${formData.name} has been created.`,
            });
            handleClose();
          }, 300);
        }
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: isEditing ? 'Failed to update position' : 'Failed to create position',
        message: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md mx-auto bg-white dark:bg-dark-800 shadow-xl rounded-xl border border-gray-200 dark:border-dark-700">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Position' : 'Create Position'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg transition-colors duration-200 focus-visible-ring"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Position Name*
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter position name (e.g., SUPERVISOR, WORKER)"
              disabled={isLoading || submitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              placeholder="Enter position description (optional)"
              disabled={isLoading || submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Multiplier
            </label>
            <select
              {...register('multiplier', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || submitting}
            >
              <option value="">Select multiplier (optional)</option>
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('active')}
              id="active"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || submitting}
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-900 dark:text-white">
              Active Position
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200 dark:border-dark-700">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 focus-visible-ring transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || submitting}
              className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus-visible-ring transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || submitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                isEditing ? 'Update Position' : 'Create Position'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};