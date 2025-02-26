import { IWorkflowNode, IWorkflowTemplate } from "@/types/workflow/customize-process-by-workflow-types";

// Função para converter um template para o formato do workflow
export const prepareTemplateForWorkflow = (template: IWorkflowTemplate): IWorkflowNode[] => {
    if (!template || !template.baseNodes) {
      console.warn("Template inválido ou sem nós");
      return [];
    }
    
    // Criar uma cópia profunda dos nós para evitar modificações indesejadas
    const nodes = JSON.parse(JSON.stringify(template.baseNodes));
    console.log(`Preparando ${nodes.length} nós para o workflow`);
    
    return nodes;
  };