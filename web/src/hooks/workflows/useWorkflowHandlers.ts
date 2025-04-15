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

  // Para departamentos
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

  // Para sub-nós
  const handleAddSubNode = (parentNode: IWorkflowNode) => {
    const subNode: IWorkflowNode = {
      id: `sub-${Math.random().toString(36).substr(2, 9)}`,
      label: 'Novo Processo',
      subtitle: 'Defina suas informações',
      icon: parentNode.icon,
      x: parentNode.x + 200,
      y: parentNode.y + 100,
      parentId: parentNode.id,
      priority: 'high'
    };
  
    setWorkflow(prev => [...prev, subNode]);
    setSelectedNode(subNode);
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
    handleAddSubNode, // Adicionado ao retorno
    handleWorkflowSelect,
    handleNodeConfigOpen,
    handleNodeConfigSave
  };
};