import React from 'react';
import { IHospital } from '@/types/hospital-network-types';

// Interfaces atualizadas para resolver problemas de tipagem
export interface IActiveRoute {
  source: string;
  target: string;
}

export interface ITransferStatusPanelProps {
  transfers: Array<{
    sourceId: string;
    targetId: string;
    resourceType: string;
    resourceCategory: 'equipment' | 'supplies';
    quantity: number;
    priority: 'high' | 'medium' | 'low';
    estimatedTime: number;
  }>;
  hospitals: IHospital[];
  onTransferClick: (sourceId: string, targetId: string) => void;
}

export const TransferStatusPanel: React.FC<ITransferStatusPanelProps> = ({
  transfers,
  hospitals,
  onTransferClick
}) => {
  if (transfers.length === 0) return null;

  const getResourceLabel = (type: string): string => {
    const labels: Record<string, string> = {
      respirators: 'Respiradores',
      monitors: 'Monitores',
      defibrillators: 'Desfibriladores',
      medications: 'Medicamentos',
      bloodBank: 'Banco de Sangue',
      ppe: 'EPIs'
    };
    return labels[type] || type;
  };

  const getPriorityStyle = (priority: 'high' | 'medium' | 'low') => {
    const styles = {
      high: 'bg-red-900/50 text-red-200',
      medium: 'bg-yellow-900/50 text-yellow-200',
      low: 'bg-green-900/50 text-green-200'
    };
    return styles[priority];
  };

  return (
    <div className="absolute bottom-16 right-4 z-20 bg-blue-900/80 backdrop-blur-sm p-3 rounded-lg shadow-xl">
      <p className="text-white text-sm font-medium mb-2">
        Transferências Ativas: {transfers.length}
      </p>
      <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
        {transfers.map((transfer, index) => {
          const source = hospitals.find(h => h.id === transfer.sourceId)?.name || transfer.sourceId;
          const target = hospitals.find(h => h.id === transfer.targetId)?.name || transfer.targetId;
          const elapsedTime = Math.floor(Math.random() * 100);
          const progress = Math.min(90, elapsedTime);

          return (
            <div 
              key={`${transfer.sourceId}-${transfer.targetId}-${index}`}
              className="bg-gray-800/50 p-2 rounded-md cursor-pointer hover:bg-gray-700/50"
              onClick={() => onTransferClick(transfer.sourceId, transfer.targetId)}
            >
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span className="truncate max-w-[110px]">{source} → {target}</span>
                <span>{transfer.quantity}x {getResourceLabel(transfer.resourceType)}</span>
              </div>
              <div className="w-full bg-gray-700 h-1.5 rounded-full">
                <div 
                  className="h-1.5 rounded-full bg-blue-500 transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${getPriorityStyle(transfer.priority)}`}>
                  {transfer.priority === 'high' ? 'Alta' : 
                   transfer.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
                <span>
                  {Math.floor(transfer.estimatedTime * (progress/100))} / {transfer.estimatedTime} min
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};