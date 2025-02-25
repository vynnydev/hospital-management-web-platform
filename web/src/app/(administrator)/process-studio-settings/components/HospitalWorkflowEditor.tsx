/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/workflow/HospitalWorkflowEditor/index.tsx
import React, { useState, useEffect } from 'react';

// Hooks e serviços
import { useWorkflowActions } from '@/services/hooks/useWorkflowActions';
import { useWorkflowManager } from '@/services/hooks/useWorkflowManager';
import { useWorkflowImportExport } from '@/services/hooks/workflows/useWorkflowImportExport';

// Componentes
import { WorkflowHeader } from './workflow/WorkflowHeader';
import { WorkflowSlider } from './workflow/WorkflowSlider';
import { DepartmentsList } from './workflow/DepartmentsList';
import { WorkflowCanvas } from './workflow/WorkflowCanvas';
import { EditNodeModal } from './workflow/modals/EditNodeModal';
import { AuthorizationModal } from './workflow/modals/AuthorizationModal';
import { CancelWorkflowModal } from './workflow/modals/CancelWorkflowModal';
import { DeleteNodeModal } from './workflow/modals/DeleteNodeModal';
import { CollaborationInviteModal } from './workflow/modals/CollaborationInviteModal';
import { NodeConfigModal } from './workflow/modals/NodeConfigModal';

// Hook dos handlers
import { useWorkflowHandlers } from '@/services/hooks/workflows/useWorkflowHandlers';

// Tipos das funções handlers
import { 
  ISavedWorkflow, 
  IWorkflowNode 
} from '@/types/workflow/customize-process-by-workflow-types';
import { departmentTypes } from './workflow/constants/departmentTypes';
import { DeleteWorkflowModal } from './workflow/modals/DeleteWorkflowModal';
import { SaveWorkflowModal } from './workflow/modals/SaveWorkflowModal';

// Novas props para o componente
interface HospitalWorkflowEditorProps {
  initialWorkflow?: IWorkflowNode[];
  onWorkflowUpdate?: (updatedWorkflow: IWorkflowNode[]) => void;
  readOnly?: boolean;
  savedWorkflow?: ISavedWorkflow | null;
  onCancelProcess?: () => void; // Nova prop para cancelar o processo
  processName?: string; // Nome do processo em andamento
}

export const HospitalWorkflowEditor: React.FC<HospitalWorkflowEditorProps> = ({
  initialWorkflow,
  onWorkflowUpdate,
  readOnly = false,
  savedWorkflow = null,
  onCancelProcess,
  processName
}) => {
  // Estados locais
  const [editingNode, setEditingNode] = useState<IWorkflowNode | null>(null);
  const [nodeToDelete, setNodeToDelete] = useState<IWorkflowNode | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState<boolean>(false);
  const [cancelWorkflowModalOpen, setCancelWorkflowModalOpen] = useState<boolean>(false);
  const [authorizationModalOpen, setAuthorizationModalOpen] = useState<boolean>(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ISavedWorkflow | null>(null);
  const [selectedNode, setSelectedNode] = useState<IWorkflowNode | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [deleteWorkflowModalOpen, setDeleteWorkflowModalOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<ISavedWorkflow | null>(null);

  // Estados e hooks globais
  const {
    workflow,
    setWorkflow,
    savedWorkflows,
    setSavedWorkflows,
    currentWorkflowSlide,
    setCurrentWorkflowSlide,
    handleSaveProcessWorkflow,
    errors
  } = useWorkflowManager();

  // Atualiza o workflow quando as props mudam
  useEffect(() => {
    if (initialWorkflow && initialWorkflow.length > 0) {
      setWorkflow(initialWorkflow);
    }
  }, [initialWorkflow, setWorkflow]);

  // Propaga as mudanças de workflow para o componente pai quando solicitado
  useEffect(() => {
    if (onWorkflowUpdate && !readOnly) {
      onWorkflowUpdate(workflow);
    }
  }, [workflow, onWorkflowUpdate, readOnly]);

  const {
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
    handleDeleteWorkflowProcess,
    confirmDeleteWorkflowProcess,
    joinCollaborativeWorkflow,
    afterSaveWorkflow
  } = useWorkflowActions(
      setWorkflow,
      setSavedWorkflows,
      setWorkflowToDelete,
      setDeleteWorkflowModalOpen,
      workflowToDelete,
      savedWorkflows
  );

  const {
    exportFormat,
    setExportFormat,
    exportWorkflow,
    importWorkflow
  } = useWorkflowImportExport();

  // Usando o hook de handlers
  const {
    handleNodeEdit,
    handleNodeDelete,
    handleAddNode,
    handleAddSubNode,
    handleWorkflowSelect,
    handleNodeConfigOpen,
    handleNodeConfigSave
  } = useWorkflowHandlers(
    setEditingNode,
    setNodeToDelete,
    setWorkflow,
    setSelectedWorkflow,
    setAuthorizationModalOpen,
    setSelectedNode
  );

  // Defina as tipagens corretas para evitar erros
  const onNodeDrag: ((e: React.MouseEvent<HTMLDivElement>, node: IWorkflowNode) => void) | undefined = 
    readOnly ? undefined : startDragging;

  const onMouseMove: ((e: React.MouseEvent<HTMLDivElement>) => void) | undefined = 
    readOnly ? undefined : (e) => handleMouseMove(e, setWorkflow);

  const onNodeEdit: ((node: IWorkflowNode) => void) | undefined = 
    readOnly ? undefined : handleNodeEdit;

  const onNodeDelete: ((node: IWorkflowNode) => void) | undefined = 
    readOnly ? undefined : handleNodeDelete;

  const onAddSubNode: ((node: IWorkflowNode) => void) | undefined = 
    readOnly ? undefined : handleAddSubNode;

  const onNodeConfig: ((node: IWorkflowNode) => void) | undefined = 
    readOnly ? undefined : handleNodeConfigOpen;

  // Função para cancelar o processo atual e limpar o workflow
  const handleProcessCancel = () => {
    if (onCancelProcess) {
      // Chama a função de cancelamento passada via props
      onCancelProcess();
    } else {
      // Comportamento padrão de cancelamento
      cancelWorkflow();
      setCancelWorkflowModalOpen(false);
    }
  };

  // Calcula se um workflow está em progresso para o DepartmentsList
  // Garantindo que ele sempre receba um boolean
  const isWorkflowInProgress = Boolean(
    workflowInProgress || (initialWorkflow && initialWorkflow.length > 0)
  );

  // Nome do workflow atual para o DepartmentsList
  const displayWorkflowName = processName || currentWorkflowName || '';

  // Determina se há um workflow ativo
  const hasActiveWorkflow = workflow.length > 0;

  // Calcula a altura do container com base no workflow ativo
  const containerStyle = {
    height: hasActiveWorkflow ? '100%' : 'auto',
    display: 'flex',
    flexDirection: 'column' as 'column'
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white rounded-xl" style={containerStyle}>
      {!readOnly && (
        <>
          <WorkflowHeader 
            onCreateCollaboration={() => createCollaboration(workflow)}
            onJoinCollaboration={() => setInviteModalOpen(true)}
            onAIAnalysis={() => {/* Implementar análise de IA */}}
            onSaveClick={() => setSaveModalOpen(true)}
            onExport={() => exportWorkflow(workflow)}
            onImport={(e) => importWorkflow(e, setWorkflow)}
            exportFormat={exportFormat}
            onExportFormatChange={setExportFormat}
          />

          <WorkflowSlider 
            savedWorkflows={savedWorkflow ? [savedWorkflow] : savedWorkflows}
            currentIndex={currentWorkflowSlide}
            onNext={() => setCurrentWorkflowSlide(prev => prev + 1)}
            onPrevious={() => setCurrentWorkflowSlide(prev => prev - 1)}
            onSelect={handleWorkflowSelect}
            onDelete={handleDeleteWorkflowProcess}
          />
        </>
      )}

      {/* Container principal com flex e altura total */}
      <div 
        className="flex flex-1 relative mb-4" 
        style={{ 
          minHeight: hasActiveWorkflow ? '800px' : '600px',
          height: '100%'
        }}
      >
        {/* Departamentos (com largura fixa) */}
        <div className={initialWorkflow && initialWorkflow.length > 0 ? "opacity-50 pointer-events-none" : ""}>
          <DepartmentsList 
            departments={departmentTypes}
            workflowInProgress={isWorkflowInProgress}
            currentWorkflowName={displayWorkflowName}
            onStartWorkflow={(dept) => startWorkflow(dept, handleAddNode)}
            onCancelWorkflow={() => {
              if (initialWorkflow && initialWorkflow.length > 0) {
                handleProcessCancel();
              } else {
                setCancelWorkflowModalOpen(true);
              }
            }}
          />
        </div>

        {/* Canvas (com flex-grow para ocupar o espaço disponível) */}
        <div className="flex-1 h-full">
          <WorkflowCanvas 
            workflow={workflow}
            onNodeDrag={onNodeDrag}
            onMouseMove={onMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
            onNodeEdit={onNodeEdit}
            onNodeDelete={onNodeDelete}
            onAddSubNode={onAddSubNode}
            onNodeConfig={onNodeConfig}
          />
        </div>
      </div>

      {/* Modais - só mostrar se não estiver em modo somente leitura */}
      {!readOnly && (
        <>
          <AuthorizationModal 
            isOpen={authorizationModalOpen}
            onClose={() => setAuthorizationModalOpen(false)}
            workflow={selectedWorkflow}
            onAuthorize={() => {
              if (selectedWorkflow?.nodes) {
                setWorkflow([...selectedWorkflow.nodes]);
                setAuthorizationModalOpen(false);
              }
            }}
            onDeny={() => setAuthorizationModalOpen(false)}
          />

          <CancelWorkflowModal 
            isOpen={cancelWorkflowModalOpen}
            onClose={() => setCancelWorkflowModalOpen(false)}
            onConfirm={() => {
              cancelWorkflow();
              setCancelWorkflowModalOpen(false);
            }}
            workflowName={displayWorkflowName}
          />

          <EditNodeModal 
            node={editingNode}
            onClose={() => setEditingNode(null)}
            onSave={(updatedNode) => {
              setWorkflow(prev => 
                prev.map(node => node.id === updatedNode.id ? updatedNode : node)
              );
              setEditingNode(null);
            }}
          />

          <DeleteNodeModal 
            node={nodeToDelete}
            onClose={() => setNodeToDelete(null)}
            onConfirm={() => {
              if (nodeToDelete) {
                setWorkflow(prev => 
                  prev.filter(node => 
                    node.id !== nodeToDelete.id && 
                    node.parentId !== nodeToDelete.id
                  )
                );
                setNodeToDelete(null);
              }
            }}
          />

          {inviteModalOpen && (
            <CollaborationInviteModal 
              onClose={() => setInviteModalOpen(false)}
              onJoin={joinCollaborativeWorkflow}
            />
          )}

          <NodeConfigModal 
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onSave={handleNodeConfigSave}
          />

          <SaveWorkflowModal 
            isOpen={saveModalOpen}
            onClose={() => setSaveModalOpen(false)}
            onSave={handleSaveProcessWorkflow}
            afterSaveWorkflow={afterSaveWorkflow}
          />

          <DeleteWorkflowModal 
            isOpen={deleteWorkflowModalOpen}
            onClose={() => setDeleteWorkflowModalOpen(false)}
            onConfirm={confirmDeleteWorkflowProcess}
            workflow={workflowToDelete}
          />
        </>
      )}
    </div>
  );
};