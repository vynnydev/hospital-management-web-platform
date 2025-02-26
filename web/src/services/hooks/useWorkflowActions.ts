/* eslint-disable @typescript-eslint/no-unused-vars */
import { SetStateAction, useState, useEffect, useRef } from 'react';
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
  
  // Referência para evitar o erro de profundidade máxima
  const lastUpdateTimeRef = useRef<number>(0);
  const positionUpdateThrottleRef = useRef<NodeJS.Timeout | null>(null);

  // Ouvir eventos globais para sincronização entre hooks
  useEffect(() => {
    const handleProcessStarted = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setWorkflowInProgress(true);
      if (detail?.name) {
        setCurrentWorkflowName(detail.name);
      }
    };

    const handleProcessCanceled = () => {
      resetWorkflowState();
    };

    // Adicionar event listeners
    window.addEventListener('workflow-process-started', handleProcessStarted);
    window.addEventListener('workflow-process-canceled', handleProcessCanceled);

    return () => {
      window.removeEventListener('workflow-process-started', handleProcessStarted);
      window.removeEventListener('workflow-process-canceled', handleProcessCanceled);
    };
  }, []);

  const startDragging = (e: React.MouseEvent<HTMLDivElement>, node: IWorkflowNode) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggingNode({
      node,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    });
    // Resetar o controle de throttling
    lastUpdateTimeRef.current = Date.now();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, setWorkflowFn: React.Dispatch<React.SetStateAction<IWorkflowNode[]>>) => {
    if (!draggingNode || !e.currentTarget) return;
  
    // Implementar throttling para evitar atualizações excessivas
    const now = Date.now();
    if (now - lastUpdateTimeRef.current < 16) { // ~60fps
      // Se uma atualização estiver programada, não programar outra
      if (positionUpdateThrottleRef.current) return;
      
      // Programa uma atualização para ocorrer após um pequeno atraso
      positionUpdateThrottleRef.current = setTimeout(() => {
        updateNodePosition(e);
        positionUpdateThrottleRef.current = null;
      }, 16);
      return;
    }
  
    // Se chegou aqui, faz a atualização imediatamente
    updateNodePosition(e);
    lastUpdateTimeRef.current = now;
  };

  // Função auxiliar para atualizar a posição do nó
  const updateNodePosition = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingNode) return;
    
    // Verificar se currentTarget existe antes de chamar getBoundingClientRect
    if (!e.currentTarget) {
      console.warn('currentTarget é null, abortando atualização da posição');
      return;
    }
    
    try {
      const containerRect = e.currentTarget.getBoundingClientRect();
      const newX = Math.max(0, e.clientX - containerRect.left - draggingNode.offsetX);
      const newY = Math.max(0, e.clientY - containerRect.top - draggingNode.offsetY);
  
      setWorkflow(prev => {
        // Não atualizar se o nó não existir mais
        const nodeIndex = prev.findIndex(node => node.id === draggingNode.node.id);
        if (nodeIndex === -1) return prev;
        
        // Verifique se a posição realmente mudou para evitar atualizações desnecessárias
        const existingNode = prev[nodeIndex];
        if (Math.abs(existingNode.x - newX) < 1 && Math.abs(existingNode.y - newY) < 1) {
          return prev; // Não atualiza se a mudança for muito pequena
        }
        
        // Criar uma nova cópia do array para evitar modificações diretas
        const newWorkflow = [...prev];
        newWorkflow[nodeIndex] = { ...existingNode, x: newX, y: newY };
        return newWorkflow;
      });
    } catch (error) {
      console.error('Erro ao atualizar posição do nó:', error);
      // Continue a execução sem quebrar o aplicativo
    }
  };

  const stopDragging = () => {
    setDraggingNode(null);
    // Limpar qualquer atualização agendada
    if (positionUpdateThrottleRef.current) {
      clearTimeout(positionUpdateThrottleRef.current);
      positionUpdateThrottleRef.current = null;
    }
  };

  const startWorkflow = (dept: IWorkflowDepartment, handleAddNode: (dept: IWorkflowDepartment) => void) => {
    if (!workflowInProgress) {
      handleAddNode(dept);
      setWorkflowInProgress(true);
      setCurrentWorkflowName(dept.label);
      
      // Disparar evento para sincronização com outros hooks
      const processStartedEvent = new CustomEvent('workflow-process-started', {
        detail: { name: dept.label }
      });
      window.dispatchEvent(processStartedEvent);
    }
  };

  // Função para resetar o estado do workflow
  const resetWorkflowState = () => {
    setWorkflowInProgress(false);
    setCurrentWorkflowName('');
    setWorkflow([]); // Limpa os nós
  };

  const cancelWorkflow = () => {
    // Limpa todos os nós do workflow
    setWorkflow([]);
    setWorkflowInProgress(false);
    setCurrentWorkflowName('');
    setCancelWorkflowModalOpen(false);
    
    // Disparar evento para sincronização com outros hooks
    const processCanceledEvent = new CustomEvent('workflow-process-canceled');
    window.dispatchEvent(processCanceledEvent);
    
    // Adicione um toast de confirmação para o usuário
    toast({
      title: "Processo cancelado",
      description: "O processo em andamento foi cancelado.",
      variant: "default",
      duration: 3000,
    });
  };

  // Função que será chamada após salvar
  const afterSaveWorkflow = () => {
    resetWorkflowState();
    
    // Disparar evento para sincronização com outros hooks
    const processCanceledEvent = new CustomEvent('workflow-process-canceled');
    window.dispatchEvent(processCanceledEvent);
    
    // Adicione um toast de confirmação para o usuário
    toast({
      title: "Workflow salvo",
      description: "O workflow foi salvo com sucesso!",
      variant: "default",
      duration: 3000,
    });
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
    joinCollaborativeWorkflow,
    // Expor essas funções adicionais para facilitar a integração
    setWorkflowInProgress,
    setCurrentWorkflowName,
    resetWorkflowState
  };
};