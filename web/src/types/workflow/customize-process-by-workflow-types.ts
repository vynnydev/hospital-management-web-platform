// Tipos de departamentos

import { LucideIcon } from "lucide-react";

type TPriority = 'low' | 'medium' | 'high' | 'critical'
type TWorkflowSelectHandler = (workflow: ISavedWorkflow) => void;

export type { TPriority, TWorkflowSelectHandler }

export interface IWorkflowDepartment {
  id: string;
  label: string;
  icon: LucideIcon;
  subtitle?: string;
  description?: string;
  color?: string;
}
  
// Interface para nó no workflow
export interface IWorkflowNode extends IWorkflowDepartment {
    x: number;
    y: number;
    parentId?: string;
    priority?: TPriority;
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
}

export interface IWorkflowCanvasProps {
  workflow: IWorkflowNode[];
  onNodeDrag: (e: React.MouseEvent<HTMLDivElement>, node: IWorkflowNode) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onNodeEdit: (node: IWorkflowNode) => void;
  onNodeDelete: (node: IWorkflowNode) => void;
  onAddSubNode: (node: IWorkflowNode) => void;
  onNodeConfig: (node: IWorkflowNode) => void;
}