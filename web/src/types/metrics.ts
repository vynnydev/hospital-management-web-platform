import { TrendDirection } from "./trends";

// Interface para capacidade máxima departamental
export interface IDepartmentCapacity {
  maxBeds: number;
  maxOccupancy: number;
  recommendedMaxOccupancy: number;
}

// Interface para capacidade total
export interface ITotalCapacity {
  maxBeds: number;
  maxOccupancy: number;
}

// Interface para todas as capacidades
export interface ICapacity {
  total: ITotalCapacity;
  departmental: {
    uti: IDepartmentCapacity;
    enfermaria: IDepartmentCapacity;
  };
}

// Interface para tendências
export interface ITrendData {
  value: number;
  direction: 'up' | 'down' | 'stable';  // Adicionado 'stable'
}

// Interface para detalhamento
export interface IBreakdown {
  label: string;
  value: string;
}

// Interface para detalhes das métricas
export interface MetricDetails {
  subtitle: string;
  breakdown: IBreakdown[];
}

export interface ApiResponse {
  data: IHospitalMetrics;
  status: number;
  message?: string;
}

// type MetricStatus = 'empty' | 'normal' | 'warning' | 'critical';

export interface IMetricCardProps {
  title: string;
  value: number;
  unit: string;
  maxValue?: number;  // Valor máximo para a barra de progresso
  trend?: ITrendData;
  status: 'normal' | 'empty' | 'warning' | 'critical';
  timestamp: Date;
  icon?: React.ReactNode;
  details?: MetricDetails;
  capacity?: {
    current: number;
    max: number;
    recommended?: number;
  };
}

// Interface auxiliar para cálculos de progresso
export interface IProgressCalculation {
  percentage: number;
  status: 'normal' | 'warning' | 'critical';
  remainingCapacity: number;
}

// Interface para métricas departamentais
export interface IDepartmentMetrics {
  occupancy: number;
  beds: number;
  patients: number;
  discharges: number;
  deaths: number;
  readmissions: number;
  patientDays: number;
  hospitalInfections: number;
  avgStayDuration: number;
  waitTime: number;
  revenue: number;
  costs: number;
}

// Interface para comparação de períodos
export interface IPeriodComparison {
  value: number;
  trend: 'stable' | 'up' | 'down';
}

// Interface principal de métricas hospitalares
export interface IHospitalMetrics {
  capacity: ICapacity,
  overall: {
    // Métricas de ocupação
    occupancyRate: number;
    totalPatients: number;
    availableBeds: number;
    patientDays: number;
    
    // Métricas de rotatividade
    avgStayDuration: number;
    turnoverRate: number;
    totalDischarges: number;
    
    // Métricas de qualidade
    deaths: number;
    readmissions: number;
    hospitalInfections: number;
    
    // Métricas financeiras
    revenue: number;
    costs: number;
    
    // Métricas de tempo
    totalWaitTime: number;
    avgWaitTime: number;
    
    // Registro temporal
    lastUpdate: string;

    // Têndencia de ocupação
    trends: TrendDirection
    
    // Comparações de período
    periodComparison: {
      occupancy: IPeriodComparison;
      patients: IPeriodComparison;
      beds: IPeriodComparison;
      turnover: IPeriodComparison;
      mortality: IPeriodComparison;
      readmission: IPeriodComparison;
      infection: IPeriodComparison;
      revenue: IPeriodComparison;
      costs: IPeriodComparison;
    };
  };
  
  // Métricas por departamento
  departmental: {
    uti: IDepartmentMetrics;
    enfermaria: IDepartmentMetrics;
  };
  
  // Métricas de qualidade
  quality: {
    readmissionRate: number
    patientSatisfaction: number;
    incidentReports: number;
    medicationErrors: number;
    bedSoresCases: number;
    fallsCases: number;
    infectionRate: number;
  };
  
  // Métricas de eficiência
  efficiency: {
    bedTurnoverInterval: number;
    operatingRoomUtilization: number;
    emergencyWaitTimes: number;
    scheduledSurgeryWaitTimes: number;
    diagnosticTestWaitTimes: number;
    avgWaitTime: number;
    bedTurnoverTime: number;
    resourceUtilization: number;
  };
}

// Interface para filtros de data
export interface IDateFilter {
  startDate: Date;
  endDate: Date;
}

// Interface para configurações de visualização
export interface IMetricsVisualization {
  timeFrame: 'daily' | 'weekly' | 'monthly' | 'yearly';
  departments: string[];
  metrics: string[];
}