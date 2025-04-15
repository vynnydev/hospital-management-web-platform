import React from 'react';
import { BarChart2, Clock, CheckCircle, Users, RefreshCw } from 'lucide-react';
import { IWorkflowStats } from '@/types/workflow/workflow-types';

interface WorkflowStatsProps {
  stats: IWorkflowStats;
  isLoading: boolean;
  onRefresh: () => void;
}

export const WorkflowStats: React.FC<WorkflowStatsProps> = ({ stats, isLoading, onRefresh }) => {
  // Calcular estatísticas resumidas
  const activeProcesses = stats.activeProcesses;
  const averageEfficiency = Math.round(stats.efficiencyRate * 100);
  const slasCompleted = Math.round((stats.slasCompleted / activeProcesses) * 100);
  const occupancyRate = Math.round(stats.occupancyRate.overall * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {/* Processos Ativos */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">Processos Ativos</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400">{activeProcesses}</p>
              <div className="ml-2 flex items-center text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${
                  activeProcesses > 40 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {activeProcesses > 40 ? 'Alta Demanda' : 'Normal'}
                </span>
              </div>
            </div>
          </div>
          <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded">
            <BarChart2 className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
        </div>
        
        <div className="mt-3">
          <div className="text-xs text-blue-600 dark:text-blue-300">
            <span>Distribuição por departamento</span>
            <div className="flex flex-col space-y-1 mt-1">
              {Object.entries(stats.distributionByDepartment).slice(0, 3).map(([dept, count]) => (
                <div key={dept} className="flex justify-between">
                  <span className="capitalize">{dept}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Eficiência Média */}
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-green-900 dark:text-green-300">Eficiência Média</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-semibold text-green-600 dark:text-green-400">{averageEfficiency}%</p>
              <div className="ml-2 flex items-center text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${
                  averageEfficiency > 85 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {stats.processingTimes.bottlenecks.length > 0
                    ? `vs. ${stats.processingTimes.bottlenecks.length} gargalos`
                    : `vs. mês anterior`}
                </span>
              </div>
            </div>
          </div>
          <div className="p-2 bg-green-100 dark:bg-green-800 rounded">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
          </div>
        </div>
        
        <div className="mt-3">
          <div className="text-xs text-green-600 dark:text-green-300">
            <span>Desempenho por tempo de processo</span>
            <div className="relative pt-1 mt-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block">Lento</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block">Rápido</span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-green-200 dark:bg-green-800">
                <div 
                  style={{ width: `${averageEfficiency}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SLAs Cumpridos */}
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-purple-900 dark:text-purple-300">SLAs Cumpridos</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-semibold text-purple-600 dark:text-purple-400">{slasCompleted}%</p>
              <div className="ml-2 flex items-center text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${
                  slasCompleted > 90 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                  slasCompleted > 75 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {slasCompleted > 90 ? 'Excelente' : slasCompleted > 75 ? 'Bom' : 'Atenção'}
                </span>
              </div>
            </div>
          </div>
          <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded">
            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-300" />
          </div>
        </div>
        
        <div className="mt-3">
          <div className="text-xs text-purple-600 dark:text-purple-300">
            <span>Distribuição por prioridade</span>
            <div className="flex flex-col space-y-1 mt-1">
              {Object.entries(stats.distributionByPriority).map(([priority, count]) => (
                <div key={priority} className="flex justify-between">
                  <span className="capitalize">{priority}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Taxa de Ocupação */}
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-amber-900 dark:text-amber-300">Taxa de Ocupação</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-semibold text-amber-600 dark:text-amber-400">{occupancyRate}%</p>
              <div className="ml-2 flex items-center text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${
                  occupancyRate > 85 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                  occupancyRate > 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {occupancyRate > 85 ? 'Atenção' : occupancyRate > 70 ? 'Moderado' : 'Disponível'}
                </span>
              </div>
            </div>
          </div>
          <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded">
            <Users className="h-5 w-5 text-amber-600 dark:text-amber-300" />
          </div>
        </div>
        
        <div className="mt-3">
          <div className="text-xs text-amber-600 dark:text-amber-300">
            <span>Capacidade por departamento</span>
            <div className="flex flex-col space-y-1 mt-1">
              {Object.entries(stats.occupancyRate.byDepartment).slice(0, 3).map(([dept, rate]) => (
                <div key={dept} className="flex justify-between">
                  <span className="capitalize">{dept}</span>
                  <span className="font-medium">{Math.round(rate * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Botão de atualização */}
      <button 
        onClick={onRefresh}
        disabled={isLoading}
        className="absolute top-6 right-6 p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
        title="Atualizar estatísticas"
      >
        <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};