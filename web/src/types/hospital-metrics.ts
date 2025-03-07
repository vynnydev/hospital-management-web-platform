// Tipo base para todas as métricas
// Tipos de cartões para métricas principais
export type TMainCardType = 'critical-hospital' | 'staff' | 'maintenance' | 'waiting';

// Tipos de cartões para métricas adicionais
export type TAdditionalCardType = 
  'hospital-critico' | 'burnout' | 'manutencao' | 'taxa-giro' | 
  'eficiencia' | 'ocupacao' | 'variacao' | 'treinamento';
  
// Interface para resposta da API de métricas
export interface IMetricsApiResponse {
  metrics: TMetric[];
  panelMetrics: Record<string, string[]>;
  metricTypes: {
    main: Array<{
      value: string;
      label: string;
      description: string;
      icon: string;
    }>;
    additional: Array<{
      value: string;
      label: string;
      description: string;
      icon: string;
    }>;
  };
}

// Interface para informações adicionais
export interface IAdditionalInfo {
  label: string;
  value: string;
}

// Interface base para todas as métricas
export interface IMetricBase {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
  isCustom: boolean;
}

// Interface para métricas principais
export interface IMainMetric extends IMetricBase {
  type: 'main';
  cardType: TMainCardType;
}

// Interface para métricas adicionais
export interface IAdditionalMetric extends IMetricBase {
  type: 'additional';
  cardType: TAdditionalCardType;
  trend?: number;
  additionalInfo?: IAdditionalInfo;
}

// Tipo união para representar qualquer tipo de métrica
export type TMetric = IMainMetric | IAdditionalMetric;

// Interface para payload de criação de métricas
export interface ICreateMetricPayload {
  title: string;
  subtitle?: string;
  description?: string;
  type: 'main' | 'additional';
  cardType: string;
  trend?: number;
  additionalInfo?: IAdditionalInfo;
  createdBy?: string;
}

// Interface para payload de atualização de métricas
export interface IUpdateMetricPayload {
  title?: string;
  subtitle?: string;
  description?: string;
  trend?: number;
  additionalInfo?: IAdditionalInfo;
}

// Interface para definição de painel de métricas
export interface IMetricPanel {
  id: string;
  name: string;
  description?: string;
  metrics: string[]; // IDs das métricas
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  isDefault?: boolean;
}

// Interface para informações adicionais
export interface IAdditionalInfo {
  label: string;
  value: string;
}

// Interface base para todas as métricas
export interface IMetricBase {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
  isCustom: boolean;
}

// Interface para métricas principais
export interface IMainMetric extends IMetricBase {
  type: 'main';
  cardType: TMainCardType;
}

// Interface para métricas adicionais
export interface IAdditionalMetric extends IMetricBase {
  type: 'additional';
  cardType: TAdditionalCardType;
  trend?: number;
  additionalInfo?: IAdditionalInfo;
}

// Interface para payload de criação de métricas
export interface ICreateMetricPayload {
  title: string;
  subtitle?: string;
  description?: string;
  type: 'main' | 'additional';
  cardType: string;
  trend?: number;
  additionalInfo?: IAdditionalInfo;
  createdBy?: string;
}

// Interface para payload de atualização de métricas
export interface IUpdateMetricPayload {
  title?: string;
  subtitle?: string;
  description?: string;
  trend?: number;
  additionalInfo?: IAdditionalInfo;
}

// Interface para definição de painel de métricas
export interface IMetricPanel {
  id: string;
  name: string;
  description?: string;
  metrics: string[]; // IDs das métricas
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  isDefault?: boolean;
}

// Definição de tipo para metricTypes
export interface IMetricTypeDefinition {
  value: string;
  label: string;
  description: string;
  icon: string;
}

// Interface para a resposta da API de métricas
export interface IMetricsResponse {
  metrics: TMetric[];
  panelMetrics: Record<string, string[]>;
  metricTypes: {
    main: IMetricTypeDefinition[];
    additional: IMetricTypeDefinition[];
  };
}

// Mapeamento de status para cores
export const metricStatusColors = {
  normal: {
    bg: "bg-emerald-500",
    text: "text-white",
    icon: "text-white",
    border: "border-green-500/30",
    gradient: "from-green-950/50 to-emerald-900/50"
  },
  attention: {
    bg: "bg-yellow-500",
    text: "text-white",
    icon: "text-white",
    border: "border-yellow-500/30",
    gradient: "from-yellow-950/50 to-amber-900/50"
  },
  critical: {
    bg: "bg-red-500",
    text: "text-white",
    icon: "text-white",
    border: "border-red-500/30",
    gradient: "from-red-950/50 to-rose-900/50"
  }
};

// Mapeamento de tipos de cartão para gradientes
export const cardTypeGradients: Record<string, string> = {
  'critical-hospital': 'from-red-400/20 to-rose-500/20 dark:from-red-500/20 dark:to-rose-600/20',
  'staff': 'from-amber-400/20 to-yellow-500/20 dark:from-amber-500/20 dark:to-yellow-600/20',
  'maintenance': 'from-blue-400/20 to-indigo-500/20 dark:from-blue-500/20 dark:to-indigo-600/20',
  'waiting': 'from-violet-400/20 to-purple-500/20 dark:from-violet-500/20 dark:to-purple-600/20',
  
  'hospital-critico': 'from-[#3D2A2A] to-[#2D1F1F]',
  'burnout': 'from-[#3D3426] to-[#2D271F]',
  'manutencao': 'from-[#2A2F3D] to-[#1F222D]',
  'taxa-giro': 'from-[#2A323D] to-[#1F242D]',
  'eficiencia': 'from-[#2A3D2E] to-[#1F2D22]',
  'ocupacao': 'from-[#2E2A3D] to-[#221F2D]',
  'variacao': 'from-[#3D2A3A] to-[#2D1F2A]',
  'treinamento': 'from-[#2A3D3D] to-[#1F2D2D]'
};