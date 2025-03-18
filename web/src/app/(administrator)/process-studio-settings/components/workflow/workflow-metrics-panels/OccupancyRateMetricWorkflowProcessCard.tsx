import React from 'react';
import { Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MetricWorkflowProcessCard } from './MetricWorkflowProcessCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/organisms/tooltip';

interface OccupancyRateMetric {
  percentage: number;
  trend: number;
  loading: boolean;
}

interface IOccupancyRateMetricWorkflowProcessCardProps {
  data: OccupancyRateMetric;
}

/**
 * Card específico para a métrica de Taxa de Ocupação
 * 
 * Exibe a porcentagem de ocupação hospitalar, a tendência
 * em relação ao período anterior e uma visualização da
 * capacidade por departamento
 */
export const OccupancyRateMetricWorkflowProcessCard: React.FC<IOccupancyRateMetricWorkflowProcessCardProps> = ({ data }) => {
  // Função para determinar o status baseado na taxa de ocupação
  const getOccupancyStatus = () => {
    if (data.percentage > 90) {
      return {
        label: 'Crítico',
        className: 'bg-red-900/60 text-red-300',
        description: 'Ocupação crítica - acima de 90%'
      };
    } else if (data.percentage > 75) {
      return {
        label: 'Atenção',
        className: 'bg-amber-900/60 text-amber-300',
        description: 'Ocupação alta - entre 75% e 90%'
      };
    } else {
      return {
        label: 'Normal',
        className: 'bg-green-900/60 text-green-300',
        description: 'Ocupação normal - abaixo de 75%'
      };
    }
  };

  const status = getOccupancyStatus();

  return (
    <MetricWorkflowProcessCard
      title="Taxa de Ocupação"
      icon={Users}
      iconColor="text-amber-400"
      gradient={{ from: 'from-amber-900', to: 'to-amber-950' }}
      borderColor="border-amber-800"
      isLoading={data.loading}
    >
      <div className="flex mt-2 items-end justify-between">
        <div>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-white">{data.percentage}</span>
            <span className="text-xl text-amber-400 ml-1">%</span>
          </div>
          <div className="flex items-center mt-1">
            <span className={`flex items-center text-sm ${data.trend < 0 ? 'text-green-400' : 'text-red-400'}`}>
              {data.trend < 0 ? (
                <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
              ) : (
                <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
              )}
              {Math.abs(data.trend)}%
            </span>
            <span className="text-xs text-amber-300 ml-2">vs. mês anterior</span>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`px-2 py-1 rounded-full ${status.className} text-xs font-medium`}>
                {status.label}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{status.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mt-6">
        <div className="flex justify-between text-xs text-amber-200 mb-1">
          <span>Capacidade por departamento</span>
        </div>
        <div className="grid grid-cols-3 gap-1 mt-1">
          <div className="bg-amber-800 rounded-md p-1">
            <div className="text-xs text-center text-amber-200">UTI</div>
            <div className="text-center text-white font-bold text-sm">92%</div>
          </div>
          <div className="bg-amber-800 rounded-md p-1">
            <div className="text-xs text-center text-amber-200">Emergência</div>
            <div className="text-center text-white font-bold text-sm">78%</div>
          </div>
          <div className="bg-amber-800 rounded-md p-1">
            <div className="text-xs text-center text-amber-200">Enfermaria</div>
            <div className="text-center text-white font-bold text-sm">65%</div>
          </div>
        </div>
      </div>
    </MetricWorkflowProcessCard>
  );
};