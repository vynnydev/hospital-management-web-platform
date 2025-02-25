import { useEffect, useState } from "react";
import { 
    IExceptionFlow, 
    ISLASettings, 
    IWorkflowNode, 
    IWorkflowTemplate 
} from "@/types/workflow/customize-process-by-workflow-types";
import { workflowTemplates } from "@/utils/workflowTemplates";

// Hook para gerenciar a integração dos templates com o workflow
export const useTemplateWorkflowIntegration = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<IWorkflowTemplate | null>(null);
    const [workflow, setWorkflow] = useState<IWorkflowNode[]>([]);
    const [slaSettings, setSlaSettings] = useState<ISLASettings[]>([]);
    const [exceptionFlows, setExceptionFlows] = useState<IExceptionFlow[]>([]);
  
    // Quando um template é selecionado, carrega seu fluxo de trabalho
    useEffect(() => {
      if (selectedTemplate) {
        setWorkflow(selectedTemplate.baseNodes);
        setSlaSettings(selectedTemplate.slaSettings || []);
        setExceptionFlows(selectedTemplate.exceptionFlows || []);
      }
    }, [selectedTemplate]);
  
    // Função para selecionar um template (modificada para aceitar null)
    const selectTemplate = (template: IWorkflowTemplate | null) => {
      setSelectedTemplate(template);
      if (!template) {
        // Limpar estados se null for passado
        setWorkflow([]);
        setSlaSettings([]);
        setExceptionFlows([]);
      }
    };
  
    // Função para selecionar um template por ID
    const selectTemplateById = (templateId: string) => {
      const template = workflowTemplates.find(t => t.id === templateId);
      if (template) {
        setSelectedTemplate(template);
      }
    };
  
    return {
      selectedTemplate,
      workflow,
      slaSettings,
      exceptionFlows,
      selectTemplate,
      selectTemplateById,
      setWorkflow,
      setSlaSettings,
      setExceptionFlows
    };
};