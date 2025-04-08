// types/subscription-types.ts

// Tipos de planos disponíveis
export type TPlanType = 'starter' | 'professional' | 'enterprise' | 'custom';

// Ciclos de cobrança
export type TBillingCycle = 'monthly' | 'yearly' | 'quarterly';

// Módulos disponíveis na plataforma
export type TModuleName = 
  | 'overview'                  // Visão Geral
  | 'health-digital-support'    // Atendimento Digital
  | 'bed-management'            // Gestão de Leitos
  | 'patient-management'        // Gestão de Pacientes
  | 'staff-management'          // Gestão de Equipes
  | 'predictive-analysis'       // Análise Preditiva
  | 'inventory-resources'       // Recursos & Inventário
  | 'process-studio-settings'   // Studio de Processos
  | 'telemedicine'              // Telemedicina
  | 'prescriptions'             // Prescrições
  | 'medical-records'           // Prontuários
  | 'appointments'              // Consultas
  | 'analytics'                 // Estatísticas
  | 'billing'                   // Faturamento
  | 'ai-assistant'              // Assistente IA
  | 'security-compliance';      // Segurança e Compliance

// Status de um plano
export type TPlanStatus = 'active' | 'pending' | 'trial' | 'canceled' | 'expired';

// Interface para recursos específicos de cada módulo
export interface IModuleFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
  isEnabled: boolean;
}

// Interface para representar um módulo da plataforma
export interface IPlatformModule {
  id: TModuleName;
  name: string;
  description: string;
  icon?: string;
  enabled: boolean;
  order: number;
  features: IModuleFeature[];
}

// Interface para limites por plano
export interface IPlanLimits {
  users: number;              // Quantidade de usuários
  patients: number;           // Quantidade de pacientes
  storage: number;            // Armazenamento em GB
  beds: number;               // Quantidade de leitos
  apiCalls: number;           // Chamadas de API por mês
  customReports: number;      // Relatórios personalizados
  aiAssistantQueries: number; // Consultas ao assistente IA
}

// Interface para representar um plano
export interface ISubscriptionPlan {
  id: string;
  name: string;
  type: TPlanType;
  description: string;
  price: {
    monthly: number;
    yearly: number;
    quarterly: number;
    setup?: number;
  };
  yearlyDiscount: number;     // Percentual de desconto para pagamento anual
  modules: IPlatformModule[]; // Módulos incluídos no plano
  limits: IPlanLimits;        // Limites do plano
  isPopular?: boolean;        // Plano em destaque
  isEnterprise?: boolean;     // Plano corporativo (preço personalizado)
  createdAt: string;
  updatedAt: string;
}

// Interface para representar uma assinatura de um usuário/hospital
export interface ISubscription {
  id: string;
  planId: string;
  hospitalId: string;
  status: TPlanStatus;
  currentCycle: TBillingCycle;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod: string;
  customModules?: IPlatformModule[]; // Módulos personalizados (planos custom)
  customLimits?: Partial<IPlanLimits>; // Limites personalizados
  paymentHistory: IPayment[];
  createdAt: string;
  updatedAt: string;
}

// Interface para representar um pagamento
export interface IPayment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processed' | 'failed' | 'refunded';
  paymentMethod: string;
  date: string;
  invoiceUrl?: string;
  receiptUrl?: string;
}

// Interface para atualização de plano
export interface IUpdatePlanRequest {
  planId: string;
  cycle?: TBillingCycle;
  modules?: Partial<Record<TModuleName, boolean>>;
  customLimits?: Partial<IPlanLimits>;
}