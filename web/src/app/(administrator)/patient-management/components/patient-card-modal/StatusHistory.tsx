import React from 'react';
import type { IStatusHistory } from '@/types/hospital-network-types';

interface StatusHistoryProps {
  statusHistory: IStatusHistory[] | undefined;
  expectedDischarge: string;
}

export const StatusHistory: React.FC<StatusHistoryProps> = ({
  statusHistory,
  expectedDischarge
}) => {
  const sortedHistory = statusHistory ? [...statusHistory].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ) : [];

  return (
    <div className="pt-8">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800 dark:text-white">
          Histórico de Status
        </h4>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Previsão de Alta: {
            expectedDischarge
              ? new Date(expectedDischarge).toLocaleDateString()
              : 'Não definida'
          }
        </div>
      </div>

      <div className="space-y-2">
        {sortedHistory && sortedHistory.length > 0 ? (
          sortedHistory.map((status, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-800 dark:text-white">
                  {status.status}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {status.department}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {status.specialty}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(status.timestamp).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {status.updatedBy.name}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Nenhum histórico disponível</p>
        )}
      </div>
    </div>
  );
};