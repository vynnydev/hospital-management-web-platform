import { ISavedWorkflow, IWorkflowNode } from "@/types/workflow/customize-process-by-workflow-types";
import { useState } from "react";
import { toast } from "react-toastify";

// Hooks personalizados para gerenciamento de estado
export const useWorkflowManager = () => {
    const [workflow, setWorkflow] = useState<IWorkflowNode[]>([]);
    const [savedWorkflows, setSavedWorkflows] = useState<ISavedWorkflow[]>([]);
    const [currentWorkflowSlide, setCurrentWorkflowSlide] = useState(0);
    const [errors, setErrors] = useState<string[]>([]);
  
    const validateWorkflow = (nodes: IWorkflowNode[]): boolean => {
      const invalidNodes = nodes.filter(
        node => !node.label || node.label === 'Novo Processo' ||
                !node.subtitle || node.subtitle === 'Defina suas informações'
      );
  
      if (invalidNodes.length > 0) {
        setErrors(invalidNodes.map(node => 
          `Nó "${node.label}" precisa de título e subtítulo completos`
        ));
        return false;
      }
  
      setErrors([]);
      return true;
    };
  
    const handleSaveProcessWorkflow = (name: string, description: string) => {
      if (!validateWorkflow(workflow)) return;
    
      const newWorkflow: ISavedWorkflow = {
        id: `workflow-${Date.now()}`,
        name,
        description,
        nodes: workflow,
        createdAt: new Date()
      };
    
      setSavedWorkflows(prev => [...prev, newWorkflow]);
      
      // Limpa o workflow atual
      setWorkflow([]);
      
      // Reset dos estados de controle
      // afterSaveWorkflow();
      
      toast.success('Workflow salvo com sucesso!');
    };
  
    return {
      workflow,
      setWorkflow,
      savedWorkflows,
      setSavedWorkflows,
      currentWorkflowSlide,
      setCurrentWorkflowSlide,
      handleSaveProcessWorkflow,
      errors
    };
}