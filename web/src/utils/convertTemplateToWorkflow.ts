import { ITemplate } from "@/types/settings-types";
import { IWorkflowNode, IWorkflowTemplate } from "@/types/workflow/customize-process-by-workflow-types";
import { createWorkflowNode } from "./workflowTemplates";
import { BookOpen, FileCheck, FileText, Stethoscope, Clipboard } from "lucide-react";

// Função para converter um template ITemplate para IWorkflowTemplate
export const convertTemplateToWorkflow = (template: ITemplate): IWorkflowTemplate => {
    // Configuração padrão de nós baseada na categoria do template
    let baseNodes: IWorkflowNode[] = [];
    
    switch(template.category) {
      case 'geral':
        baseNodes = [
          createWorkflowNode({ id: 'reception', label: 'Recepção', icon: Clipboard, subtitle: 'Registro inicial', color: 'blue' }, 0),
          createWorkflowNode({ id: 'triage', label: 'Triagem', icon: FileCheck, subtitle: 'Avaliação inicial', color: 'green' }, 1, 'reception')
        ];
        break;
      case 'cirurgias':
        baseNodes = [
          createWorkflowNode({ id: 'surgical_consult', label: 'Consulta Cirúrgica', icon: Stethoscope, subtitle: 'Avaliação inicial', color: 'blue' }, 0),
          createWorkflowNode({ id: 'preop_exam', label: 'Exames Pré-Operatórios', icon: FileCheck, subtitle: 'Análises clínicas', color: 'green' }, 1, 'surgical_consult')
        ];
        break;
      case 'diagnósticos':
        baseNodes = [
          createWorkflowNode({ id: 'exam_request', label: 'Solicitação de Exame', icon: FileText, subtitle: 'Pedido médico', color: 'blue' }, 0),
          createWorkflowNode({ id: 'sample_collection', label: 'Coleta de Amostra', icon: BookOpen, subtitle: 'Procedimento', color: 'green' }, 1, 'exam_request')
        ];
        break;
      default:
        baseNodes = [
          createWorkflowNode({ id: 'step1', label: 'Etapa 1', icon: Clipboard, subtitle: 'Início', color: 'blue' }, 0),
          createWorkflowNode({ id: 'step2', label: 'Etapa 2', icon: FileCheck, subtitle: 'Continuação', color: 'green' }, 1, 'step1')
        ];
    }
    
    return {
      id: template.id,
      name: template.name,
      description: template.description || '',
      category: template.category,
      baseNodes: baseNodes,
      slaSettings: [],
      exceptionFlows: []
    };
  };