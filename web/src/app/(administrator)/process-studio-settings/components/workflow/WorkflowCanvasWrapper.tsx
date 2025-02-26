import React, { useEffect, useState } from 'react';
import { IWorkflowNode } from '@/types/workflow/customize-process-by-workflow-types';
import { WorkflowCanvas } from './WorkflowCanvas';

// Props para o componente wrapper
interface WorkflowCanvasWrapperProps {
  workflow: IWorkflowNode[];
  onNodeDrag?: (e: React.MouseEvent<HTMLDivElement>, node: IWorkflowNode) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  onNodeEdit?: (node: IWorkflowNode) => void;
  onNodeDelete?: (node: IWorkflowNode) => void;
  onAddSubNode?: (node: IWorkflowNode) => void;
  onNodeConfig?: (node: IWorkflowNode) => void;
}

export const WorkflowCanvasWrapper: React.FC<WorkflowCanvasWrapperProps> = ({
  workflow,
  onNodeDrag,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onNodeEdit,
  onNodeDelete,
  onAddSubNode,
  onNodeConfig
}) => {
  // Estado local para garantir que o workflow seja atualizado corretamente
  const [displayedWorkflow, setDisplayedWorkflow] = useState<IWorkflowNode[]>([]);
  const [key, setKey] = useState<number>(0);

  // Atualiza o workflow exibido quando o workflow de entrada muda
  useEffect(() => {
    console.log("WorkflowCanvasWrapper recebeu workflow com", workflow.length, "nodes");
    
    // Se houver nós no workflow, atualize o estado local e force o rerender
    if (workflow && workflow.length > 0) {
      setDisplayedWorkflow([...workflow]);
      // Força o rerender do componente alterando a key
      setKey(prev => prev + 1);
    } else {
      setDisplayedWorkflow([]);
    }
  }, [workflow]);

  // Logging para debug
  useEffect(() => {
    console.log("WorkflowCanvasWrapper está renderizando", displayedWorkflow.length, "nodes");
    if (displayedWorkflow.length > 0) {
      console.log("Primeiro node:", displayedWorkflow[0].label);
    }
  }, [displayedWorkflow]);

  // Renderiza o WorkflowCanvas com os nós atuais
  return (
    <div className="h-full w-full">
      {/* Informações de debug (remover em produção) */}
      {displayedWorkflow.length === 0 && (
        <div className="absolute top-2 left-2 text-xs text-gray-500 z-10 bg-gray-900 p-1 rounded">
          Nenhum node no workflow
        </div>
      )}
      {displayedWorkflow.length > 0 && (
        <div className="absolute top-2 left-2 text-xs text-gray-500 z-10 bg-gray-900 p-1 rounded">
          {displayedWorkflow.length} nodes no workflow
        </div>
      )}
      
      <WorkflowCanvas
        key={key}
        workflow={displayedWorkflow}
        onNodeDrag={onNodeDrag}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onNodeEdit={onNodeEdit}
        onNodeDelete={onNodeDelete}
        onAddSubNode={onAddSubNode}
        onNodeConfig={onNodeConfig}
      />
    </div>
  );
};