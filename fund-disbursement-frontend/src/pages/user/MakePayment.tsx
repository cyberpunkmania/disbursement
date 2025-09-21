import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/api/client';
import type { Worker } from '@/types/models.types';

export const MakePayment: React.FC = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const response = await apiClient.get<Worker[]>('/admin/workers');
      if (response.success && response.data) {
        setWorkers(response.data.filter(w => w.payable && w.status === 'ACTIVE'));
      }
    } catch (error) {
      console.error('Load workers error:', error);
      setError('Failed to load workers');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker || !amount) return;

    setLoading(true);
    setError('');
    try {
      const response = await apiClient.post('/disbursements/single', {
        workerUuid: selectedWorker.uuid,
        amount: parseFloat(amount)
      });

      if (response.success) {
        navigate('/user/dashboard', {
          state: { message: 'Payment initiated successfully!' }
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Make Single Payment</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Select Worker *</label>
          <select
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={selectedWorker?.uuid || ''}
            onChange={(e) => {
              const worker = workers.find(w => w.uuid === e.target.value);
              setSelectedWorker(worker || null);
            }}
            required
            aria-label="Select Worker"
          >
            <option value="">-- Select a worker --</option>
            {workers.map(worker => (
              <option key={worker.uuid} value={worker.uuid}>
                {worker.fullName} - {worker.phone}
              </option>
            ))}
          </select>
        </div>

        {selectedWorker && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Worker Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Name:</span> {selectedWorker.fullName}
              </div>
              <div>
                <span className="text-gray-600">Position:</span> {selectedWorker.positionName}
              </div>
              <div>
                <span className="text-gray-600">Team:</span> {selectedWorker.team || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">Rate:</span> KES {selectedWorker.rate.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Amount (KES) *</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="10"
            max="300000"
            step="0.01"
            placeholder="0.00"
            required
          />
          {amount && (
            <p className="mt-1 text-sm text-gray-600">
              Amount: KES {parseFloat(amount).toLocaleString()}
            </p>
          )}
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/user/dashboard')}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !selectedWorker || !amount}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Make Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};