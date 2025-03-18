import React from 'react';
import { Activity, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Progress } from '@/components/ui/organisms/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/organisms/tooltip';
import { MetricWorkflowProcessCard } from './MetricWorkflowProcessCard';

interface IActiveProcessesMetric {
  count: number;
  critical: number;
  trend: number;
  loading: boolean;
}

interface IActiveProcessesCardProps {
  data: IActiveProcessesMetric;
}

/**
 * Card específico para a métrica de Processos Ativos
 * 
 * Exibe o número total de processos ativos, processos críticos,
 * tendência em relação ao período anterior e distribuição por departamento
 */
export const ActiveProcessesCard: React.FC<IActiveProcessesCardProps> = ({ data }) => {
  const safeData = {
    count: data?.count ?? 0,
    critical: data?.critical ?? 0,
    trend: data?.trend ?? 0,
    loading: data?.loading ?? false
  };

  return (
    <MetricWorkflowProcessCard
      title="Processos Ativos"
      icon={Activity}
      iconColor="text-blue-400"
      gradient={{ from: 'from-blue-900', to: 'to-blue-950' }}
      borderColor="border-blue-800"
      isLoading={safeData.loading}
    >
      <div className="flex mt-2 items-end justify-between">
        <div>
          <span className="text-4xl font-bold text-white">{safeData.count}</span>
          <div className="flex items-center mt-1">
            <span className={`flex items-center text-sm ${safeData.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {safeData.trend > 0 ? (
                <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
              )}
              {Math.abs(safeData.trend)}%
            </span>
            <span className="text-xs text-blue-300 ml-2">vs. mês anterior</span>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="px-2 py-1 rounded-full bg-red-900/60 flex items-center">
                <AlertCircle className="h-3.5 w-3.5 text-red-400 mr-1" />
                <span className="text-red-300 text-xs">{safeData.critical}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{safeData.critical} processos críticos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mt-6">
        <div className="flex justify-between text-xs text-blue-200 mb-1">
          <span>Distribuição por departamento</span>
        </div>
        <Progress 
          value={65} 
          className="h-1.5 bg-blue-800"
        />
        <div className="flex justify-between text-xs text-blue-400 mt-1">
          <span>Recepção</span>
          <span>UTI</span>
          <span>Emergência</span>
        </div>
      </div>
    </MetricWorkflowProcessCard>
  );
};