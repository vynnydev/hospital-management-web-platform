/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { IWorkflowTemplate } from '@/types/workflow/customize-process-by-workflow-types';
import { INetworkData } from '@/types/hospital-network-types';
import { IStaffData } from '@/types/staff-types';
import { IAmbulanceData } from '@/types/ambulance-types';
import { IAlert } from '@/types/alert-types';
import { IDashboardWorkflowProcessMetrics } from '@/types/metrics-workflow-process-calculator-types';
import { MetricsCalculator } from '@/utils/MetricsCalculator';
import { ActiveProcessesCard } from './workflow-metrics-panels/ActiveProcessesCard';
import { EfficiencyMetricWorkflowProcessCard } from './workflow-metrics-panels/EfficiencyMetricWorkflowProcessCard';
import { SLAComplianceMetricWorkflowProcessCard } from './workflow-metrics-panels/SLAComplianceMetricWorkflowProcessCard';
import { OccupancyRateMetricWorkflowProcessCard } from './workflow-metrics-panels/OccupancyRateMetricWorkflowProcessCard';

/**
 * Props para o componente DynamicWorkflowProcessMetricsPanel
 */
interface IDynamicWorkflowProcessMetricsPanelProps {
  networkData: INetworkData | null;
  staffData: {
    staffData: IStaffData | null;
    loading: boolean;
    error: string | null;
  };
  ambulanceData: {
    ambulanceData: IAmbulanceData | null;
    loading: boolean;
    error: string | null;
  };
  alerts: IAlert[];
  templates: IWorkflowTemplate[];
  activeTemplateId?: string;
}

/**
 * Componente principal que exibe o painel de métricas dinâmicas
 * 
 * Agrupa os quatro cards de métricas diferentes em um grid responsivo
 * e gerencia o cálculo e atualização das métricas.
 */
export const DynamicWorkflowProcessMetricsPanel: React.FC<IDynamicWorkflowProcessMetricsPanelProps> = ({
  networkData,
  staffData,
  ambulanceData,
  alerts,
  templates,
  activeTemplateId
}) => {
  // Estado inicial com valores de fallback para garantir que algo seja exibido
  const [metrics, setMetrics] = useState<IDashboardWorkflowProcessMetrics>({
    activeProcesses: { 
      count: templates?.length || 0, 
      critical: 0, 
      trend: 0, 
      loading: true 
    },
    efficiency: { 
      percentage: 75, // valor de fallback razoável
      trend: 0, 
      loading: true 
    },
    slaCompliance: { 
      percentage: 80, // valor de fallback razoável 
      alertsHandled: 0, 
      loading: true 
    },
    occupancyRate: { 
      percentage: 65, // valor de fallback razoável
      trend: 0, 
      loading: true 
    }
  });

  // Log para depuração - remover depois
  useEffect(() => {
    console.log("DynamicMetricsPanel - Dados recebidos:", {
      networkData: !!networkData,
      staffData: !!staffData.staffData,
      ambulanceData: !!ambulanceData.ambulanceData,
      alertsCount: alerts?.length,
      templatesCount: templates?.length
    });
  }, [networkData, staffData, ambulanceData, alerts, templates]);

  // Calcula as métricas sempre que os dados são atualizados
  useEffect(() => {
    // Debug de dados
    console.log("Tentando calcular métricas com: ", {
      hasNetworkData: !!networkData?.hospitals,
      hasStaffData: !!staffData?.staffData,
      hasAmbulanceData: !!ambulanceData?.ambulanceData,
      hasTemplates: !!templates,
      hasAlerts: !!alerts
    });
    
    // Verificar se os dados necessários estão disponíveis
    if (!networkData?.hospitals || !staffData?.staffData || !templates || !alerts) {
      console.log("Dados incompletos para calcular métricas. Usando valores de fallback.");
      return; // mantém os valores de fallback
    }

    try {
      // Calcula todas as métricas de uma vez
      const calculatedMetrics = MetricsCalculator.calculateAllMetrics(
        networkData,
        staffData.staffData,
        alerts,
        templates
      );

      console.log("Métricas calculadas:", calculatedMetrics);

      // Atualiza o estado com as métricas calculadas
      setMetrics(calculatedMetrics);
    } catch (error) {
      console.error("Erro ao calcular métricas:", error);
      // Mantém os valores de fallback em caso de erro
    }
  }, [networkData, staffData.staffData, ambulanceData.ambulanceData, alerts, templates]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Card de Processos Ativos */}
      <ActiveProcessesCard data={metrics.activeProcesses} />
      
      {/* Card de Eficiência Média */}
      <EfficiencyMetricWorkflowProcessCard data={metrics.efficiency} />
      
      {/* Card de Cumprimento de SLAs */}
      <SLAComplianceMetricWorkflowProcessCard data={metrics.slaCompliance} />
      
      {/* Card de Taxa de Ocupação */}
      <OccupancyRateMetricWorkflowProcessCard data={metrics.occupancyRate} />
    </div>
  );
};