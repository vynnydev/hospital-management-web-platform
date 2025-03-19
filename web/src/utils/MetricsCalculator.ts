/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAlert } from '@/types/alert-types';
import { IWorkflowTemplate } from '@/types/workflow/customize-process-by-workflow-types';
import { INetworkData } from '@/types/hospital-network-types';
import { IStaffData } from '@/types/staff-types';
import { 
    IActiveProcessesMetric, 
    IDashboardWorkflowProcessMetrics, 
    IEfficiencyMetric, 
    IOccupancyRateMetric, 
    ISLAComplianceMetric 
} from '@/types/metrics-workflow-process-calculator-types';

/**
 * Classe utilitária para calcular todas as métricas do dashboard
 */
export class MetricsCalculator {
  /**
   * Calcula métricas de processos ativos
   */
  static calculateActiveProcesses(
    templates: IWorkflowTemplate[],
    alerts: IAlert[]
  ): IActiveProcessesMetric {
    // Se não houver dados, retorne valores padrão
    if (!templates || !alerts) {
      return {
        count: 0,
        critical: 0,
        trend: 0,
        loading: true
      };
    }
  
    const activeTemplatesCount = templates.length;
    
    // Opção 1: Maneira segura de filtrar alertas de alta prioridade
    const criticalAlerts = alerts.filter(alert => {
      // Verificamos se o valor da prioridade é um dos esperados
      return alert.priority === 'high' || alert.priority === 'critical';
    }).length;
  
    // Tendência simulada, em um cenário real seria calculada com dados históricos
    const trend = 2.8;
  
    return {
      count: activeTemplatesCount,
      critical: criticalAlerts,
      trend,
      loading: false
    };
  }

  static calculateActiveProcessesAlt(
    templates: IWorkflowTemplate[],
    alerts: IAlert[]
  ): IActiveProcessesMetric {
    if (!templates || !alerts) {
      return {
        count: 0,
        critical: 0,
        trend: 0,
        loading: true
      };
    }
  
    const activeTemplatesCount = templates.length;
    
    // Define as prioridades altas como string literals para evitar erro de tipo
    const highPriorityValues = ['high', 'critical'] as const;
    
    // Agora usamos o operador 'in' em vez de includes para verificar 
    // se a propriedade priority do alerta é uma das prioridades aceitas
    const criticalAlerts = alerts.filter(alert => 
      alert.priority && highPriorityValues.includes(alert.priority as any)
    ).length;
  
    const trend = 2.8;
  
    return {
      count: activeTemplatesCount,
      critical: criticalAlerts,
      trend,
      loading: false
    };
  }

  /**
   * Calcula métricas de eficiência média
   */
  static calculateEfficiency(staffData: IStaffData | null): IEfficiencyMetric {
    // Se não houver dados, retorne valores padrão
    if (!staffData || !staffData.staffTeams) {
      return {
        percentage: 0,
        trend: 0,
        loading: true
      };
    }

    let totalTeams = 0;
    let totalTaskCompletion = 0;
    
    Object.values(staffData.staffTeams).forEach(hospitalTeams => {
      hospitalTeams.forEach(team => {
        totalTaskCompletion += team.metrics.taskCompletion;
        totalTeams++;
      });
    });
    
    const efficiencyScore = totalTeams > 0 
      ? Math.round(totalTaskCompletion / totalTeams) 
      : 0;
    
    // Tendência simulada, em um cenário real seria calculada com dados históricos
    const trend = 5.2;

    return {
      percentage: efficiencyScore,
      trend,
      loading: false
    };
  }

  /**
   * Calcula métricas de cumprimento de SLAs
   */
  static calculateSLACompliance(alerts: IAlert[]): ISLAComplianceMetric {
    // Se não houver dados, retorne valores padrão
    if (!alerts) {
      return {
        percentage: 0,
        alertsHandled: 0,
        loading: true
      };
    }

    const totalAlerts = alerts.length;
    const resolvedAlerts = alerts.filter(alert => 
      alert.status === 'resolved' || alert.status === 'dismissed'
    ).length;
    
    const slaPercentage = totalAlerts > 0 
      ? Math.round((resolvedAlerts / totalAlerts) * 100) 
      : 0;

    return {
      percentage: slaPercentage,
      alertsHandled: resolvedAlerts,
      loading: false
    };
  }

  /**
   * Calcula métricas de taxa de ocupação
   */
  static calculateOccupancyRate(networkData: INetworkData | null): IOccupancyRateMetric {
    // Se não houver dados, retorne valores padrão
    if (!networkData || !networkData.hospitals || networkData.hospitals.length === 0) {
      return {
        percentage: 0,
        trend: 0,
        loading: true
      };
    }

    let totalOccupancy = 0;
    networkData.hospitals.forEach(hospital => {
      if (hospital.metrics?.overall?.occupancyRate) {
        totalOccupancy += hospital.metrics.overall.occupancyRate;
      }
    });
    
    const occupancyRate = Math.round(totalOccupancy / networkData.hospitals.length);
    
    // Tendência simulada, em um cenário real seria calculada com dados históricos
    const trend = -2.3;

    return {
      percentage: occupancyRate,
      trend,
      loading: false
    };
  }

  /**
   * Calcula todas as métricas do dashboard
   */
  static calculateAllMetrics(
    networkData: INetworkData | null,
    staffData: IStaffData | null,
    alerts: IAlert[],
    templates: IWorkflowTemplate[]
  ): IDashboardWorkflowProcessMetrics {
    // Verifica se todos os dados necessários estão disponíveis
    const dataAvailable = networkData && staffData && alerts && templates;
    
    // Se algum dado estiver faltando, retorne um estado de loading para todas as métricas
    if (!dataAvailable) {
      return {
        activeProcesses: { count: 0, critical: 0, trend: 0, loading: true },
        efficiency: { percentage: 0, trend: 0, loading: true },
        slaCompliance: { percentage: 0, alertsHandled: 0, loading: true },
        occupancyRate: { percentage: 0, trend: 0, loading: true }
      };
    }

    // Calcula cada métrica individualmente
    return {
      activeProcesses: this.calculateActiveProcesses(templates, alerts),
      efficiency: this.calculateEfficiency(staffData),
      slaCompliance: this.calculateSLACompliance(alerts),
      occupancyRate: this.calculateOccupancyRate(networkData)
    };
  }
}