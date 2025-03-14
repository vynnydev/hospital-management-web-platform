/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Tipos de recomendações que o assistente de IA pode fornecer
 */
export type TRecommendationType = 
  | 'resource-optimization'  // Otimização de recursos hospitalares
  | 'staff-allocation'       // Alocação e escala de equipes
  | 'patient-transfer'       // Transferência de pacientes
  | 'ambulance-dispatch'     // Despacho e rotas de ambulâncias
  | 'bed-management'         // Gestão de ocupação de leitos
  | 'scheduling'             // Agendamento de procedimentos
  | 'ai-prediction';         // Análises preditivas com IA

/**
 * Interface para recomendações geradas pelo assistente de IA
 */
// Tipos para prioridades
export type TRecommendationPriority = 'high' | 'medium' | 'low';

// Interface para recomendações
export interface IRecommendation {
  id: string;
  type: TRecommendationType;
  title: string;
  description: string;
  priority: TRecommendationPriority;
  actionText: string;
  timestamp: Date;
  confidence: number; // 0.0 - 1.0
  applied: boolean;
  metadata?: Record<string, any>; // Dados adicionais específicos do tipo
}

// Interface para estatísticas do hospital
export interface IStatistics {
  bedOccupancy: number; // Porcentagem
  averageWaitTime: number; // Em minutos
  criticalResourcesNeeded: number;
  staffEfficiency: number; // Porcentagem
  patientFlow: number; // Pacientes por hora
  emergencyResponseTime: number; // Em minutos
}

// Interface para as ações de previsão
export interface IPredictionAction {
  id: string;
  title: string;
  description: string;
  type: 'staff' | 'beds' | 'resources' | 'general';
  impact: 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short-term' | 'long-term';
}

// Interface para análises do assistente
export interface IAssistantAnalysis {
  title: string;
  description: string;
  insights: string[];
  metrics: Record<string, number>;
  recommendations: IRecommendation[];
  trends: {
    increasing: string[];
    decreasing: string[];
    stable: string[];
  };
}

// Interface para eventos de timeline
export interface ITimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: 'alert' | 'recommendation' | 'action' | 'system';
  priority: 'high' | 'medium' | 'low';
  relatedEntityId?: string;
  relatedEntityType?: string;
}

// Interface para o contexto do assistente (estado global)
export interface IAssistantContext {
  hospitalId: string;
  recommendations: IRecommendation[];
  statistics: IStatistics | null;
  timeline: ITimelineEvent[];
  analyses: IAssistantAnalysis[];
  predictions: IPredictionAction[];
  lastUpdate: Date;
}

/**
 * Interface para eventos gerados pelo assistente de IA
 */
export interface IAIEvent {
  id: string;
  type: 'recommendation' | 'alert' | 'insight' | 'suggestion';
  timestamp: Date;
  priority: TRecommendationPriority;
  title: string;
  description: string;
  source: 'ai' | 'system' | 'user';
  acknowledged: boolean;
  metadata?: Record<string, any>;
}

/**
 * Interface para respostas da API de IA
 */
export interface IAIResponse {
  success: boolean;
  recommendations?: IRecommendation[];
  insights?: string[];
  message?: string;
  error?: string;
  timestamp: string;
  executionTime?: number;
}

/**
 * Interface para configurações do assistente de IA
 */
export interface IAIAssistantConfig {
  enabled: boolean;
  features: {
    recommendations: boolean;
    insights: boolean;
    alerts: boolean;
    predictions: boolean;
  };
  autoOpen: boolean;
  notificationLevel: 'all' | 'high-only' | 'none';
  minimizedByDefault: boolean;
  voiceEnabled: boolean;
  language: 'pt-BR' | 'en-US' | 'es-ES';
}