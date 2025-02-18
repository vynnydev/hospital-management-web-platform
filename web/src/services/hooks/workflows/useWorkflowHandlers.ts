import { IWorkflowNode, IWorkflowDepartment, ISavedWorkflow } from '@/types/workflow/customize-process-by-workflow-types';

export const useWorkflowHandlers = (
  setEditingNode: (node: IWorkflowNode | null) => void,
  setNodeToDelete: (node: IWorkflowNode | null) => void,
  setWorkflow: (nodes: IWorkflowNode[] | ((prev: IWorkflowNode[]) => IWorkflowNode[])) => void,
  setSelectedWorkflow: (workflow: ISavedWorkflow | null) => void,
  setAuthorizationModalOpen: (open: boolean) => void,
  setSelectedNode: React.Dispatch<React.SetStateAction<IWorkflowNode | null>>
) => {
  const handleNodeEdit = (node: IWorkflowNode) => {
    setEditingNode(node);
  };

  const handleNodeDelete = (node: IWorkflowNode) => {
    setNodeToDelete(node);
  };

  const handleAddNode = (dept: IWorkflowDepartment) => {
    const newNode: IWorkflowNode = {
      ...dept,
      id: `node-${Date.now()}`,
      x: Math.random() * 600,
      y: Math.random() * 400,
      priority: 'high'
    };
    setWorkflow(prev => [...prev, newNode]);
  };

  const handleWorkflowSelect = (workflow: ISavedWorkflow) => {
    setSelectedWorkflow(workflow);
    setAuthorizationModalOpen(true);
  };

  const handleNodeConfigOpen = (node: IWorkflowNode) => {
    setSelectedNode(node);
  };
  
  const handleNodeConfigSave = (updatedNode: IWorkflowNode) => {
    setWorkflow(prev => 
      prev.map(node => node.id === updatedNode.id ? updatedNode : node)
    );
    setSelectedNode(null);
  };

  return {
    handleNodeEdit,
    handleNodeDelete,
    handleAddNode,
    handleWorkflowSelect,
    handleNodeConfigOpen,
    handleNodeConfigSave
  };
};