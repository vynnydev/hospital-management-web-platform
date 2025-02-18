/* eslint-disable @typescript-eslint/no-unused-vars */
// src/hooks/useWorkflowActions.ts
import { SetStateAction, useState } from 'react';
import { IWorkflowNode, IWorkflowDepartment, IWorkflowCollaboration, ISavedWorkflow } from '@/types/workflow/customize-process-by-workflow-types';
import { workflowCustomizeProcessToasts } from '@/services/toasts/workflowCustomizeProcessToasts';
import { toast } from '@/components/ui/hooks/use-toast';

export const useWorkflowActions = (
  setWorkflow: React.Dispatch<React.SetStateAction<IWorkflowNode[]>>,
  setSavedWorkflows: React.Dispatch<React.SetStateAction<ISavedWorkflow[]>>,
  setWorkflowToDelete: (value: SetStateAction<ISavedWorkflow | null>) => void,
  setDeleteWorkflowModalOpen: (value: SetStateAction<boolean>) => void,
  workflowToDelete: ISavedWorkflow | null,
  savedWorkflows: ISavedWorkflow[]
) => {
  const [workflowInProgress, setWorkflowInProgress] = useState(false);
  const [currentWorkflowName, setCurrentWorkflowName] = useState('');
  const [draggingNode, setDraggingNode] = useState<{
    node: IWorkflowNode;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [cancelWorkflowModalOpen, setCancelWorkflowModalOpen] = useState(false);
  const [collaboration, setCollaboration] = useState<IWorkflowCollaboration | null>(null);

  const startDragging = (e: React.MouseEvent<HTMLDivElement>, node: IWorkflowNode) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggingNode({
      node,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, setWorkflow: (fn: (prev: IWorkflowNode[]) => IWorkflowNode[]) => void) => {
    if (!draggingNode) return;

    const containerRect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - draggingNode.offsetX;
    const newY = e.clientY - containerRect.top - draggingNode.offsetY;

    setWorkflow(prev => prev.map(node => 
      node.id === draggingNode.node.id 
        ? {...node, x: newX, y: newY} 
        : node
    ));
  };

  const stopDragging = () => {
    setDraggingNode(null);
  };

  const startWorkflow = (dept: IWorkflowDepartment, handleAddNode: (dept: IWorkflowDepartment) => void) => {
    if (!workflowInProgress) {
      handleAddNode(dept);
      setWorkflowInProgress(true);
      setCurrentWorkflowName(dept.label);
    }
  };

  // Função para resetar o estado do workflow
  const resetWorkflowState = () => {
    setWorkflowInProgress(false);
    setCurrentWorkflowName('');
    setWorkflow([]); // Limpa os nós
  };

  const cancelWorkflow = () => {
    setWorkflow([]); // Limpa todos os nós do workflow
    setWorkflowInProgress(false);
    setCurrentWorkflowName('');
    setCancelWorkflowModalOpen(false);
  };

  // Função que será chamada após salvar
  const afterSaveWorkflow = () => {
    resetWorkflowState();
  };

  // Handler para iniciar o processo de deleção
  const handleDeleteWorkflowProcess = (workflowId: string): void => {
    const workflow = savedWorkflows.find((w) => w.id === workflowId);
    if (workflow) {
      setWorkflowToDelete(workflow);
      setDeleteWorkflowModalOpen(true);
    }
  };

  // Handler para confirmar a deleção
  const confirmDeleteWorkflowProcess = (): void => {
    if (workflowToDelete) {
      setSavedWorkflows((prev) => 
        prev.filter((w) => w.id !== workflowToDelete.id)
      );
      
      toast({
        title: "Workflow removido",
        description: `O workflow "${workflowToDelete.name}" foi removido com sucesso.`,
        variant: "default",
        duration: 3000,
      });

      setDeleteWorkflowModalOpen(false);
      setWorkflowToDelete(null);
    }
  };

  const createCollaboration = (workflow: IWorkflowNode[]) => {
    const newCollaboration: IWorkflowCollaboration = {
      id: `collab-${Date.now()}`,
      workflow,
      collaborators: [{
        id: 'current-user',
        name: 'Usuário Atual',
        role: 'owner'
      }],
      inviteCode: Math.random().toString(36).substring(7)
    };

    setCollaboration(newCollaboration);
    workflowCustomizeProcessToasts.collaborationCreated();
  };

  const joinCollaborativeWorkflow = (inviteCode: string) => {
    if (collaboration?.inviteCode === inviteCode) {
      const updatedCollaboration = {
        ...collaboration,
        collaborators: [
          ...collaboration.collaborators,
          {
            id: `user-${Date.now()}`,
            name: 'Novo Colaborador',
            role: 'editor' as const
          }
        ]
      };

      setCollaboration(updatedCollaboration);
      workflowCustomizeProcessToasts.collaborationJoined();
    } else {
      workflowCustomizeProcessToasts.invalidInviteCode();
    }
  };

  return {
    workflowInProgress,
    currentWorkflowName,
    draggingNode,
    collaboration,
    cancelWorkflowModalOpen,
    afterSaveWorkflow,
    handleDeleteWorkflowProcess,
    confirmDeleteWorkflowProcess,
    setCancelWorkflowModalOpen,
    startDragging,
    handleMouseMove,
    stopDragging,
    startWorkflow,
    cancelWorkflow,
    createCollaboration,
    joinCollaborativeWorkflow
  };
};