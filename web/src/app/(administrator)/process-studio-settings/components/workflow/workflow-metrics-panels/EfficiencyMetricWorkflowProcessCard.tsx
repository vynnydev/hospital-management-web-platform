import React from 'react';
import { BarChart2, CheckCircle, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MetricWorkflowProcessCard } from './MetricWorkflowProcessCard';

interface EfficiencyMetric {
  percentage: number;
  trend: number;
  loading: boolean;
}

interface IEfficiencyMetricWorkflowProcessCardProps {
  data: EfficiencyMetric;
}

/**
 * Card específico para a métrica de Eficiência Média
 * 
 * Exibe a porcentagem de eficiência média dos processos,
 * tendência em relação ao período anterior e uma visualização
 * do desempenho por tempo de processo
 */
export const EfficiencyMetricWorkflowProcessCard: React.FC<IEfficiencyMetricWorkflowProcessCardProps> = ({ data }) => {
  return (
    <MetricWorkflowProcessCard
      title="Eficiência Média"
      icon={BarChart2}
      iconColor="text-green-400"
      gradient={{ from: 'from-green-900', to: 'to-green-950' }}
      borderColor="border-green-800"
      isLoading={data.loading}
    >
      <div className="flex mt-2 items-end justify-between">
        <div>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-white">{data.percentage}</span>
            <span className="text-xl text-green-400 ml-1">%</span>
          </div>
          <div className="flex items-center mt-1">
            <span className={`flex items-center text-sm ${data.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {data.trend > 0 ? (
                <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
              )}
              {Math.abs(data.trend)}%
            </span>
            <span className="text-xs text-green-300 ml-2">vs. mês anterior</span>
          </div>
        </div>
        <div className="h-12 w-12 rounded-full bg-green-800/40 flex items-center justify-center">
          {data.percentage >= 85 ? (
            <CheckCircle className="h-6 w-6 text-green-400" />
          ) : (
            <Activity className="h-6 w-6 text-amber-400" />
          )}
        </div>
      </div>
      <div className="mt-6">
        <div className="flex justify-between text-xs text-green-200 mb-1">
          <span>Desempenho por tempo de processo</span>
        </div>
        <div className="grid grid-cols-4 gap-1 mt-1">
          <div className="h-2 rounded-full bg-green-700"></div>
          <div className="h-2 rounded-full bg-green-600"></div>
          <div className="h-2 rounded-full bg-green-500"></div>
          <div className="h-2 rounded-full bg-green-400"></div>
        </div>
        <div className="flex justify-between text-xs text-green-400 mt-1">
          <span>Lento</span>
          <span>Rápido</span>
        </div>
      </div>
    </MetricWorkflowProcessCard>
  );
};