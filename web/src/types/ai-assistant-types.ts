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
export interface IRecommendation {
  id: string;
  type: TRecommendationType;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionText: string;
  actionLink?: string;
  relatedAlertIds?: string[];
  timestamp: Date;
  confidence: number; // 0 a 1
  applied: boolean;
}

/**
 * Interface para estatísticas do hospital
 */
export interface IStatistics {
  bedOccupancy: number;
  averageWaitTime: number;
  criticalResourcesNeeded: number;
  staffEfficiency: number;
  patientFlow: number;
  emergencyResponseTime: number;
}

/**
 * Props para o componente H24Assistant
 */
export interface IH24AssistantProps {
  userId?: string;
  hospitalId?: string;
  onRecommendationApply?: (recommendation: IRecommendation) => void;
  onViewAllAlerts?: () => void;
  onShowChat?: () => void;
}

/**
 * Props para o botão do assistente
 */
export interface AssistantButtonProps {
  unreadAlertsCount?: number;
  onClick?: () => void;
  className?: string;
}

/**
 * Props para o modal do assistente
 */
export interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: IStatistics[];
  alerts: any[]; // Usar o tipo Alert do AlertsProvider
  statistics: IStatistics | null;
  hospitalName: string;
  userName: string;
  userRole: string;
  onApplyRecommendation: (recommendation: IRecommendation) => void;
  onViewAllAlerts: () => void;
  onShowChat: () => void;
}

/**
 * Estados de visualização do modal do assistente
 */
export type AssistantModalView = 'welcome' | 'recommendations' | 'alerts' | 'statistics';

/**
 * Interface para mensagens do assistente
 */
export interface AssistantMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: 'greeting' | 'alert' | 'recommendation' | 'information' | 'analysis';
  priority?: 'high' | 'medium' | 'low';
  metadata?: Record<string, any>;
}

/**
 * Interface para insights gerados pelo assistente
 */
export interface AssistantInsight {
  id: string;
  title: string;
  description: string;
  category: 'efficiency' | 'quality' | 'resources' | 'staff' | 'patients';
  dataPoints: {
    label: string;
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  timestamp: Date;
  confidence: number;
}