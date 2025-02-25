import React from 'react';
import { Button } from '@/components/ui/organisms/button';

interface ConnectionStats {
  activeConnections: number;
  dailyTransfers: number;
  dataVolume: string;
  failures: number;
}

interface ConnectionStatsProps {
  stats: ConnectionStats;
  onViewFullReport?: () => void;
}

export const ConnectionStats: React.FC<ConnectionStatsProps> = ({
  stats,
  onViewFullReport
}) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
        Atividade de Integração
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Total de integrações ativas</span>
          <span className="font-medium">{stats.activeConnections}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Transferências hoje</span>
          <span className="font-medium">{stats.dailyTransfers}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Volume de dados (24h)</span>
          <span className="font-medium">{stats.dataVolume}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Falhas (24h)</span>
          <span className="font-medium text-amber-600 dark:text-amber-400">{stats.failures}</span>
        </div>
      </div>
      <Button 
        variant="outline" 
        className="w-full mt-4 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700"
        onClick={onViewFullReport}
      >
        Ver Relatório Completo
      </Button>
    </div>
  );
};

// Estatísticas de exemplo para uso em outros componentes
export const sampleConnectionStats: ConnectionStats = {
  activeConnections: 3,
  dailyTransfers: 128,
  dataVolume: '14.2 MB',
  failures: 3
};