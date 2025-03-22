/* eslint-disable @typescript-eslint/no-explicit-any */
import { LucideIcon } from 'lucide-react';
import { IHospital } from '@/types/hospital-network-types';
import React from 'react';

// Tipos de cartões de métrica
export type TCardType = 
  'gauge' | 'line' | 'bar' | 'pie' | 'card' |
  'hospital-critico' | 'staff' | 'maintenance' | 'waiting' | 
  'burnout' | 'manutencao' | 'taxa-giro' | 'eficiencia' | 
  'ocupacao' | 'variacao' | 'treinamento';

// Tipos de severidade para alertas
export type TSeverity = 'low' | 'medium' | 'high';

// Tipos de charts
export type TChartType = 'gauge' | 'line' | 'bar' | 'pie' | 'card';

// Interface para template de métrica
export interface IMetricTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    dataSource: string;
    chartType: TChartType;
    formula?: string;
    icon: LucideIcon;
    iconColor: string;
    thresholds?: {
      target: number;
      warning: number;
      critical: number;
    };
    unit?: string;
    refreshInterval?: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
}
  
// Interface para métricas personalizadas que serão adicionadas ao dashboard
export interface ICustomMetric extends IMetricTemplate {
    position: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
    value?: number | null;
    data?: any[];
}

// Interface para categoria de métrica
export interface IMetricCategory {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    color: string;
    count: number;
}

// Interface para posição e tamanho no grid
export interface IMetricPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

// Interface para dados de chart
export interface IChartDataPoint {
  date?: string;
  label?: string;
  value: number;
}

// Interface para configuração de limiares
export interface IThresholdConfig {
  target: number;
  warning: number;
  critical: number;
}

// Interface para informação adicional
export interface IAdditionalInfo {
  label: string;
  value: string;
}

// Tipo para qualquer componente que aceite pelo menos className
export type IconComponent = React.ComponentType<{ className?: string } & Record<string, any>>;

// Interface para métrica
export interface IMetric {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  trend?: number;
  target?: number;
  color: string;
  cardType: TCardType;
  icon: IconComponent;
  valueSize?: 'small' | 'medium' | 'large';
  additionalInfo?: IAdditionalInfo;
  chartData?: IChartDataPoint[];
  position?: IMetricPosition;
  chartType?: TChartType;
  config?: IThresholdConfig;
}

// Interface para cartão de métrica
export interface IMetricCard {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  trend?: number;
  target?: number;
  color: string;
  cardType: TCardType;
  icon: IconComponent;
  valueSize?: 'small' | 'medium' | 'large';
  additionalInfo?: IAdditionalInfo;
}

// Interface para cartão de alerta
export interface IAlertCard {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  value: string | number;
  description: string;
  gradient: string;
  iconColor: string;
  cardType: TCardType;
  valueSize?: 'small' | 'medium' | 'large';
  severity: TSeverity;
  status?: string;
}

// Interface para métricas de alerta
export interface IAlertMetrics {
  hospitalWithHighestOccupancy: IHospital | null;
  hospitalsBelowStaffingNorms: number;
  equipmentMaintenanceAlerts: number;
  emergencyRoomWaitingTime: number;
}

// Interface para métricas adicionais
export interface IAdditionalMetrics {
  hospitalWithHighestOccupancy?: IHospital | null;
  burnoutRiskCalculation?: number;
  equipmentMaintenanceRisk?: number;
  bedTurnoverRate?: number;
  operationalEfficiency?: number;
  averageOccupancy?: number;
  departmentPatientVariation?: number;
  professionalTrainingRate?: number;
}