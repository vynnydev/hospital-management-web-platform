import React from 'react';
import { Activity, Clock, ArrowUpDown, AlertTriangle, BarChart, Percent } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Progress } from '@/components/ui/organisms/progress';
import { Skeleton } from '@/components/ui/organisms/skeleton';
import { IConnectionStats } from '@/types/connectors-types';

interface IConnectionStatsProps {
  stats: IConnectionStats;
  onViewFullReport?: () => void;
  loading?: boolean;
}

export const ConnectionStats: React.FC<IConnectionStatsProps> = ({
  stats,
  onViewFullReport,
  loading = false
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
          <Skeleton className="h-10 mt-4" />
        </CardContent>
      </Card>
    );
  }

  // Calcular taxa de sucesso ou usar o valor fornecido
  const successRate = stats.successRate !== undefined
    ? stats.successRate
    : stats.failures > 0
      ? 100 - (stats.failures / stats.dailyTransfers * 100)
      : 100;

  return (
    <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          Atividade de Integração
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Conexões Ativas */}
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Conexões Ativas</h4>
              <ArrowUpDown className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold mt-1">{stats.activeConnections}</p>
          </div>
          
          {/* Transferências Hoje */}
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Transferências</h4>
              <BarChart className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold mt-1">{stats.dailyTransfers}</p>
          </div>
          
          {/* Volume de Dados */}
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Volume (24h)</h4>
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold mt-1">{stats.dataVolume}</p>
          </div>
          
          {/* Falhas */}
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Falhas (24h)</h4>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">{stats.failures}</p>
          </div>
        </div>
        
        {/* Taxa de sucesso */}
        <div className="mt-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Taxa de Sucesso</h4>
            <div className="flex items-center">
              <Percent className="h-3 w-3 mr-1 text-blue-500" />
              <span className={`text-sm font-medium ${
                successRate > 90 ? 'text-green-600 dark:text-green-400' : 
                successRate > 70 ? 'text-amber-600 dark:text-amber-400' : 
                'text-red-600 dark:text-red-400'
              }`}>
                {successRate.toFixed(1)}%
              </span>
            </div>
          </div>
          <Progress 
            value={successRate} 
            className="h-2"
            variant={
              successRate > 90 ? 'success' : 
              successRate > 70 ? 'warning' : 
              'destructive'
            } 
          />
        </div>
        
        {/* Tempo de sincronização médio (se disponível) */}
        {stats.averageSyncTime !== undefined && (
          <div className="mt-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Tempo Médio de Sincronização</h4>
            <span className="text-sm font-medium">
              {stats.averageSyncTime < 60 
                ? `${stats.averageSyncTime}s` 
                : `${Math.floor(stats.averageSyncTime / 60)}m ${stats.averageSyncTime % 60}s`}
            </span>
          </div>
        )}
        
        {/* Tempo de atividade (se disponível) */}
        {stats.uptime && (
          <div className="mt-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Uptime</h4>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">{stats.uptime}</span>
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="w-full mt-4 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800"
          onClick={onViewFullReport}
        >
          Ver Relatório Completo
        </Button>
      </CardContent>
    </Card>
  );
};