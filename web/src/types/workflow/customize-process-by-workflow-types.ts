// Tipos de departamentos

import { LucideProps } from "lucide-react";
import { IWorkflowTemplate } from "./workflow-types";

type TPriority = 'low' | 'medium' | 'high' | 'critical'
type TWorkflowSelectHandler = (workflow: ISavedWorkflow) => void;

export type { TPriority, TWorkflowSelectHandler }

// Tipo específico para ícones do Lucide
export type LucideIconType = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;

export interface IWorkflowDepartment {
  id: string;
  label: string;
  icon: LucideIconType;
  subtitle?: string;
  description?: string;
  color?: string;
}
  
// Interface para nó no workflow
export interface IWorkflowNode extends IWorkflowDepartment {
    x: number;
    y: number;
    parentId?: string;
    priority: TPriority;
}

export interface ISavedWorkflow {
    id: string;
    name: string;
    nodes: IWorkflowNode[];
    createdAt: Date;
    lastModified?: Date;
    description?: string;
}

// Tipos de movimento e configuração
export type TNodeMovementMode = 'free' | 'grid' | 'snap';

export interface IWorkflowExportFormat {
    version: string;
    metadata: {
      createdAt: string;
      name: string;
    };
    nodes: IWorkflowNode[];
}

export interface ICollaborator {
    id: string;
    name: string;
    avatar?: string;
    role: 'owner' | 'editor' | 'viewer';
  }
  
export interface IWorkflowCollaboration {
    id: string;
    workflow: IWorkflowNode[];
    collaborators: ICollaborator[];
    inviteCode?: string;
}

export interface IWorkflowSliderProps {
  savedWorkflows: ISavedWorkflow[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (workflow: ISavedWorkflow) => void;
  onDelete: (workflowId: string) => void;
}

export interface ITemplateWorkflowIntegration {
  selectedTemplate: IWorkflowTemplate | null;
  workflow: IWorkflowNode[];
  slaSettings: ISLASettings[];
  exceptionFlows: IExceptionFlow[];
  selectTemplate: (template: IWorkflowTemplate | null) => void; // Aceita null agora
  selectTemplateById: (templateId: string) => void;
  setWorkflow: React.Dispatch<React.SetStateAction<IWorkflowNode[]>>;
  setSlaSettings: React.Dispatch<React.SetStateAction<ISLASettings[]>>;
  setExceptionFlows: React.Dispatch<React.SetStateAction<IExceptionFlow[]>>;
}

export interface IWorkflowCanvasProps {
  workflow: IWorkflowNode[];
  onNodeDrag?: (e: React.MouseEvent<HTMLDivElement>, node: IWorkflowNode) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  onNodeEdit?: (node: IWorkflowNode) => void;
  onNodeDelete?: (node: IWorkflowNode) => void;
  onAddSubNode?: (node: IWorkflowNode) => void;
  onNodeConfig?: (node: IWorkflowNode) => void;
}

// Interfaces para os templates com propriedades específicas
export interface ISLASettings {
  departmentId: string;
  maxTime: number;
  timeUnit: 'minute' | 'hour' | 'day';
  alertAt: number;
}

export interface IExceptionFlow {
  condition: string;
  targetDepartment: string;
  priority: TPriority;
}