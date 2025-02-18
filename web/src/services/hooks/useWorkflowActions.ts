/* eslint-disable @typescript-eslint/no-unused-vars */
// src/hooks/useWorkflowActions.ts
import { useState } from 'react';
import { IWorkflowNode, IWorkflowDepartment, IWorkflowCollaboration } from '@/types/workflow/customize-process-by-workflow-types';
import { workflowCustomizeProcessToasts } from '@/services/toasts/workflowCustomizeProcessToasts';

export const useWorkflowActions = () => {
  const [draggingNode, setDraggingNode] = useState<{
    node: IWorkflowNode;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const [workflowInProgress, setWorkflowInProgress] = useState(false);
  const [currentWorkflowName, setCurrentWorkflowName] = useState('');
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

  const cancelWorkflow = () => {
    setWorkflowInProgress(false);
    setCurrentWorkflowName('');
    workflowCustomizeProcessToasts.workflowCanceled();
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
    draggingNode,
    workflowInProgress,
    currentWorkflowName,
    collaboration,
    startDragging,
    handleMouseMove,
    stopDragging,
    startWorkflow,
    cancelWorkflow,
    createCollaboration,
    joinCollaborativeWorkflow
  };
};