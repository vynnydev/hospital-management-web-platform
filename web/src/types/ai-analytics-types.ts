/* eslint-disable @typescript-eslint/no-explicit-any */
// Tipos para o sistema de análise de IA 

// Tipos de alertas (também estão definidos no arquivo alert-types.ts)
export type TAlertType = 'capacity' | 'staff' | 'resource' | 'patient' | 'communication' | 'system';
export type TAlertPriority = 'high' | 'medium' | 'low';
export type TAlertStatus = 'pending' | 'acknowledged' | 'resolved' | 'dismissed';
export type TAlertSource = 'system' | 'staff' | 'communication' | 'ai' | 'external';

// Interface para alertas (simplificada, a completa está em alert-types.ts)
export interface IAlertBase {
  id: string;
  title: string;
  description: string;
  type: TAlertType;
  priority: TAlertPriority;
  timestamp: Date;
  read: boolean;
  status: TAlertStatus;
  source: TAlertSource;
  hospitalId?: string;
  metadata?: Record<string, any>;
}

// Tipos para recomendações
export type TRecommendationType = 'staff' | 'beds' | 'ambulance' | 'patient';
export type TRecommendationImpact = 'high' | 'medium' | 'low';
export type TRecommendationStatus = 'implemented' | 'dismissed' | 'pending';

export interface IRecommendation {
  id: string;
  title: string;
  description: string;
  type: TRecommendationType;
  impact: TRecommendationImpact;
  aiConfidence: number;
  timeToImplement: string;
  potentialBenefit: string;
  detailedSteps?: string[];
  status: TRecommendationStatus;
  createdAt: Date;
  implementedAt?: Date;
  dismissedAt?: Date;
  metadata?: Record<string, any>;
}

// Tipos para análise preditiva
export type TPredictionTimeframe = '24h' | '7d' | '30d' | '90d' | '24 horas' | '7 dias' | '30 dias' | '90 dias';
export type TPredictionConfidence = 'high' | 'medium' | 'low' | number;
export type TPredictionTrend = 'up' | 'down' | 'stable';
export type TPredictionCategory = 'occupancy' | 'admissions' | 'resources' | 'clinical';

export interface IPrediction {
  id: string;
  title: string;
  value: string | number;
  category: TPredictionCategory;
  timeframe: TPredictionTimeframe;
  confidence: TPredictionConfidence;
  trend: TPredictionTrend;
  change: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Interface para categoria de previsão
export interface IPredictionCategory {
  id: string;
  title: string;
  description: string;
  trend: TPredictionTrend;
  trendPercentage?: number;
  icon: React.ReactNode;
  color: string;
  predictions: IPrediction[];
}

// Tipos para insights de recursos
export type TResourceStatus = 'optimal' | 'warning' | 'critical' | 'neutral';
export type TResourceCategory = 'staff' | 'beds' | 'ambulances' | 'efficiency';

export interface IResourceIndicator {
  id: string;
  title: string; 
  value: string | number;
  category: TResourceCategory;
  status: TResourceStatus;
  trend?: TPredictionTrend;
  change?: number;
  details?: string;
  metadata?: Record<string, any>;
}

// Interface para visualizações e dashboards
export interface IDashboardConfig {
  hospitalId: string;
  title: string;
  description?: string;
  refreshInterval: number; // em minutos
  sections: {
    id: string;
    title: string;
    type: 'recommendations' | 'predictions' | 'alerts' | 'resources';
    visible: boolean;
    order: number;
    filters?: Record<string, any>;
  }[];
  lastUpdated?: Date;
  createdBy?: string;
}

// Interface para métricas de IA
export interface IAIMetrics {
  recommendationsGenerated: number;
  recommendationsImplemented: number;
  alertsGenerated: number;
  alertsResolved: number;
  predictionAccuracy: number;
  patientOutcomeImprovement: number;
  resourceOptimizationSavings: number;
  lastCalculated: Date;
}

// Interface para feedback sobre sugestões de IA
export interface IAIFeedback {
  id: string;
  itemId: string; // ID da recomendação, alerta ou previsão
  itemType: 'recommendation' | 'prediction' | 'alert';
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  submittedBy: string;
  submittedAt: Date;
  helpful: boolean;
  accurate: boolean;
  actionable: boolean;
}