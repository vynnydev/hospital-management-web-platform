import { IWorkflowNode, IWorkflowDepartment, ISavedWorkflow } from './customize-process-by-workflow-types';

export interface IWorkflowHandlers {
  handleNodeEdit: (node: IWorkflowNode) => void;
  handleNodeDelete: (node: IWorkflowNode) => void;
  handleAddNode: (dept: IWorkflowDepartment) => void;
  handleWorkflowSelect: (workflow: ISavedWorkflow) => void;
}

export type NodeEditHandler = (node: IWorkflowNode) => void;
export type NodeDeleteHandler = (node: IWorkflowNode) => void;
export type AddNodeHandler = (dept: IWorkflowDepartment) => void;
export type WorkflowSelectHandler = (workflow: ISavedWorkflow) => void;