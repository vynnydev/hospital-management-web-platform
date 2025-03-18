import React from 'react';
import { Clock } from 'lucide-react';
import { MetricWorkflowProcessCard } from './MetricWorkflowProcessCard';

interface SLAComplianceMetric {
  percentage: number;
  alertsHandled: number;
  loading: boolean;
}

interface ISLAComplianceMetricWorkflowProcessCardProps {
  data: SLAComplianceMetric;
}

/**
 * Card específico para a métrica de Cumprimento de SLAs
 * 
 * Exibe a porcentagem de SLAs cumpridos, o número de
 * alertas gerenciados e uma visualização da distribuição
 * por prioridade
 */
export const SLAComplianceMetricWorkflowProcessCard: React.FC<ISLAComplianceMetricWorkflowProcessCardProps> = ({ data }) => {
  return (
    <MetricWorkflowProcessCard
      title="SLAs Cumpridos"
      icon={Clock}
      iconColor="text-purple-400"
      gradient={{ from: 'from-purple-900', to: 'to-purple-950' }}
      borderColor="border-purple-800"
      isLoading={data.loading}
    >
      <div className="flex mt-2 items-end justify-between">
        <div>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-white">{data.percentage}</span>
            <span className="text-xl text-purple-400 ml-1">%</span>
          </div>
          <p className="text-sm text-purple-300 mt-1">
            {data.alertsHandled} alertas gerenciados
          </p>
        </div>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-700 relative">
            <div 
              className="absolute inset-0 bg-gradient-to-b from-purple-500 to-purple-700"
              style={{ 
                height: `${data.percentage}%`,
                bottom: 0,
                top: 'auto'
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{data.percentage}%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex justify-between text-xs text-purple-200 mb-1">
          <span>Distribuição por prioridade</span>
        </div>
        <div className="flex items-center space-x-1 mt-1">
          <div className="h-1.5 rounded-l-full bg-red-500 w-1/4"></div>
          <div className="h-1.5 bg-amber-500 w-2/4"></div>
          <div className="h-1.5 rounded-r-full bg-green-500 w-1/4"></div>
        </div>
        <div className="flex justify-between text-xs text-purple-400 mt-1">
          <span>Crítico</span>
          <span>Médio</span>
          <span>Baixo</span>
        </div>
      </div>
    </MetricWorkflowProcessCard>
  );
};