import { workflowTemplates } from "./workflowTemplates";
import { IWorkflowTemplate } from "@/types/workflow/workflow-types";

// Versão melhorada da função para encontrar template por ID
export const enhancedFindTemplateById = (templateId: string): IWorkflowTemplate | null => {
    const template = workflowTemplates.find(template => template.id === templateId);
    console.log(`Buscando template ID ${templateId}:`, template ? "encontrado" : "não encontrado");
    return template || null;
};