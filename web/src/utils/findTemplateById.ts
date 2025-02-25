import { workflowTemplates } from "./workflowTemplates";
import { IWorkflowTemplate } from "@/types/workflow/customize-process-by-workflow-types";

// Componente utilitário para encontrar um template por ID
export const findTemplateById = (templateId: string): IWorkflowTemplate | undefined => {
    return workflowTemplates.find(template => template.id === templateId);
};