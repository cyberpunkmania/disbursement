import React from 'react';
import { useDisbursementBatch } from '@/hooks/useAdmin';

type Props = {
  batchUuid: string;
  onClose: () => void;
};

type Payout = {
  uuid: string;
  worker?: {
    fullName?: string;
    phone?: string;
  };
  amount: number;
  state: string;
};

type DisbursementBatch = {
  payouts?: Payout[];
};

const DisbursementBatchDetails: React.FC<Props> = ({ batchUuid, onClose }) => {
  const { data, isLoading } = useDisbursementBatch(batchUuid) as { data: DisbursementBatch; isLoading: boolean };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <h3 className="text-xl font-bold mb-4">Batch Details</h3>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="p-2">Worker</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.payouts?.map((payout: any) => (
                <tr key={payout.uuid}>
                  <td className="p-2">{payout.worker?.fullName}</td>
                  <td className="p-2">{payout.worker?.phone}</td>
                  <td className="p-2">{payout.amount}</td>
                  <td className="p-2">{payout.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DisbursementBatchDetails;