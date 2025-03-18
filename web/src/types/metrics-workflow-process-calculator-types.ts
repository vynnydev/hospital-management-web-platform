/**
 * Interface para as métricas de processos ativos
 */
export interface IActiveProcessesMetric {
  count: number;
  critical: number;
  trend: number;
  loading: boolean;
}

/**
 * Interface para as métricas de eficiência
 */
export interface IEfficiencyMetric {
  percentage: number;
  trend: number;
  loading: boolean;
}

/**
 * Interface para as métricas de cumprimento de SLAs
 */
export interface ISLAComplianceMetric {
  percentage: number;
  alertsHandled: number;
  loading: boolean;
}

/**
 * Interface para as métricas de taxa de ocupação
 */
export interface IOccupancyRateMetric {
  percentage: number;
  trend: number;
  loading: boolean;
}

/**
 * Interface para o conjunto completo de métricas
 */
export interface IDashboardWorkflowProcessMetrics {
  activeProcesses: IActiveProcessesMetric;
  efficiency: IEfficiencyMetric;
  slaCompliance: ISLAComplianceMetric;
  occupancyRate: IOccupancyRateMetric;
}