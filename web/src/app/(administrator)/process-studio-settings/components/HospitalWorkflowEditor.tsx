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
  NodeEditHandler, 
  NodeDeleteHandler, 
  AddNodeHandler, 
  WorkflowSelectHandler 
} from '@/types/workflow/customize-workflow-handlers';
import { ISavedWorkflow, IWorkflowNode } from '@/types/workflow/customize-process-by-workflow-types';
import { departmentTypes } from './workflow/constants/departmentTypes';
import { DeleteWorkflowModal } from './workflow/modals/DeleteWorkflowModal';
import { SaveWorkflowModal } from './workflow/modals/SaveWorkflowModal';


export const HospitalWorkflowEditor: React.FC = () => {
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

  return (
    <div className="h-full flex flex-col bg-gray-950 text-white">
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
        savedWorkflows={savedWorkflows}
        currentIndex={currentWorkflowSlide}
        onNext={() => setCurrentWorkflowSlide(prev => prev + 1)}
        onPrevious={() => setCurrentWorkflowSlide(prev => prev - 1)}
        onSelect={handleWorkflowSelect}
        onDelete={handleDeleteWorkflowProcess}
      />

      <div className="flex-1 flex relative min-h-0">
        <DepartmentsList 
          departments={departmentTypes}
          workflowInProgress={workflowInProgress}
          currentWorkflowName={currentWorkflowName}
          onStartWorkflow={(dept) => startWorkflow(dept, handleAddNode)}
          onCancelWorkflow={() => {
            setCancelWorkflowModalOpen(true);
          }}
        />

        <WorkflowCanvas 
          workflow={workflow}
          onNodeDrag={startDragging}
          onMouseMove={(e) => handleMouseMove(e, setWorkflow)}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          onNodeEdit={handleNodeEdit}
          onNodeDelete={handleNodeDelete}
          onAddSubNode={handleAddSubNode}
          onNodeConfig={handleNodeConfigOpen}
        />
      </div>

      {/* Modais */}
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
        workflowName={currentWorkflowName}
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
    </div>
  );
};