/* eslint-disable @typescript-eslint/no-explicit-any */
import { LucideIcon } from 'lucide-react';

// Tipos de prioridade para processos e nós
export type TPriority = 'low' | 'medium' | 'high' | 'critical';

// Unidades de tempo para SLAs
export type TTimeUnit = 'minute' | 'hour' | 'day' | 'week' | 'month';

// Interface para nós do workflow
export interface IWorkflowNode {
  id: string;
  label: string;
  icon: LucideIcon;
  subtitle?: string;
  description?: string;
  color?: string;
  x: number;
  y: number;
  parentId?: string;
  priority: TPriority;
}

// Configuração de SLA para departamentos
export interface ISLASetting {
  departmentId: string;
  maxTime: number;
  timeUnit: TTimeUnit;
  alertAt: number;
}

// Fluxos de exceção
export interface IExceptionFlow {
  condition: string;
  targetDepartment: string;
  priority: TPriority;
}

// Template de workflow
export interface IWorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  baseNodes: IWorkflowNode[];
  slaSettings: ISLASetting[];
  exceptionFlows: IExceptionFlow[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// Workflow personalizado (instância de um template)
export interface ICustomWorkflow extends Omit<IWorkflowTemplate, 'id' | 'baseNodes'> {
  id: string;
  templateId: string;
  nodes: IWorkflowNode[];
  status: 'draft' | 'active' | 'inactive' | 'archived';
  lastRun?: string;
  stats?: {
    completed: number;
    inProgress: number;
    delayed: number;
    efficiency: number;
  };
}

// Estatísticas do workflow
export interface IWorkflowStats {
  processingTimes: any;
  activeProcesses: number;
  efficiencyRate: number;
  slasCompleted: number;
  occupancyRate: {
    overall: number;
    byDepartment: Record<string, number>;
  };
  distributionByDepartment: Record<string, number>;
  distributionByPriority: Record<TPriority, number>;
}

// Configurações de workflow
export interface IWorkflowSettings {
  autoAssignToAvailableStaff: boolean;
  notifyOnSLABreaches: boolean;
  escalateDelayedTasks: boolean;
  requireApprovalForExceptions: boolean;
  enableAIRecommendations: boolean;
  trackMetrics: boolean;
  defaultPriority: TPriority;
  defaultTimeUnit: TTimeUnit;
}