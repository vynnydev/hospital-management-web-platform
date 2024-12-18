import { TrendDirection } from "./trends";

// Interface para capacidade máxima departamental
export interface DepartmentCapacity {
  maxBeds: number;
  maxOccupancy: number;
  recommendedMaxOccupancy: number;
}

// Interface para capacidade total
export interface TotalCapacity {
  maxBeds: number;
  maxOccupancy: number;
}

// Interface para todas as capacidades
export interface Capacity {
  total: TotalCapacity;
  departmental: {
    uti: DepartmentCapacity;
    enfermaria: DepartmentCapacity;
  };
}

// Interface para tendências
export interface TrendData {
  value: number;
  direction: 'up' | 'down' | 'stable';  // Adicionado 'stable'
}

// Interface para detalhamento
export interface Breakdown {
  label: string;
  value: string;
}

// Interface para detalhes das métricas
export interface MetricDetails {
  subtitle: string;
  breakdown: Breakdown[];
}

export interface ApiResponse {
  data: HospitalMetrics;
  status: number;
  message?: string;
}

// type MetricStatus = 'empty' | 'normal' | 'warning' | 'critical';

export interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  maxValue?: number;  // Valor máximo para a barra de progresso
  trend?: TrendData;
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
export interface ProgressCalculation {
  percentage: number;
  status: 'normal' | 'warning' | 'critical';
  remainingCapacity: number;
}

// Interface para métricas departamentais
export interface DepartmentMetrics {
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
export interface PeriodComparison {
  value: number;
  trend: 'stable' | 'up' | 'down';
}

// Interface principal de métricas hospitalares
export interface HospitalMetrics {
  capacity: Capacity,
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
      occupancy: PeriodComparison;
      patients: PeriodComparison;
      beds: PeriodComparison;
      turnover: PeriodComparison;
      mortality: PeriodComparison;
      readmission: PeriodComparison;
      infection: PeriodComparison;
      revenue: PeriodComparison;
      costs: PeriodComparison;
    };
  };
  
  // Métricas por departamento
  departmental: {
    uti: DepartmentMetrics;
    enfermaria: DepartmentMetrics;
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
export interface DateFilter {
  startDate: Date;
  endDate: Date;
}

// Interface para configurações de visualização
export interface MetricsVisualization {
  timeFrame: 'daily' | 'weekly' | 'monthly' | 'yearly';
  departments: string[];
  metrics: string[];
}