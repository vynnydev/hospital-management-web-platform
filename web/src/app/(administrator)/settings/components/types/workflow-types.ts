// Tipos de departamentos
export interface IWorkflowDepartment {
  id: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactElement;
  subtitle?: string;
}

// Interface para nó no workflow
export interface IWorkflowNode extends IWorkflowDepartment {
  x: number;
  y: number;
}

export interface ISavedWorkflow {
    id: string;
    name: string;
    nodes: IWorkflowNode[];
    createdAt: Date;
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