/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITemplate } from "@/types/settings-types";
import { IWorkflowNode, TPriority } from "@/types/workflow/customize-process-by-workflow-types";
import { BookOpen, FileCheck, FileText, Stethoscope, Clipboard } from "lucide-react";
import { IWorkflowTemplate } from "@/types/workflow/workflow-types";

// Função utilitária para criar nós de workflow com posicionamento automático
export const createWorkflowNode = (
  department: {
    id: string;
    label: string;
    icon: any;
    subtitle?: string;
    color?: string;
    description?: string;
  },
  index: number,
  parentId?: string,
  priority: TPriority = 'medium'
): IWorkflowNode => {
  // Posicionamento automático em cascata
  const x = 50 + (index * 50); // incremento horizontal
  const y = 50 + (index * 80); // incremento vertical

  return {
    id: department.id,
    label: department.label,
    icon: department.icon,
    subtitle: department.subtitle,
    description: department.description,
    color: department.color,
    x,
    y,
    parentId,
    priority
  };
};

// Função para converter um template ITemplate para IWorkflowTemplate
export const convertTemplateToWorkflow = (template: ITemplate): IWorkflowTemplate => {
  // Configuração padrão de nós baseada na categoria do template
  let baseNodes: IWorkflowNode[] = [];
  
  switch(template.category) {
    case 'geral':
      baseNodes = [
        createWorkflowNode({ id: 'reception', label: 'Recepção', icon: Clipboard, subtitle: 'Registro inicial', color: 'blue' }, 0, undefined, 'medium'),
        createWorkflowNode({ id: 'triage', label: 'Triagem', icon: FileCheck, subtitle: 'Avaliação inicial', color: 'green' }, 1, 'reception', 'high')
      ];
      break;
    case 'cirurgias':
      baseNodes = [
        createWorkflowNode({ id: 'surgical_consult', label: 'Consulta Cirúrgica', icon: Stethoscope, subtitle: 'Avaliação inicial', color: 'blue' }, 0, undefined, 'high'),
        createWorkflowNode({ id: 'preop_exam', label: 'Exames Pré-Operatórios', icon: FileCheck, subtitle: 'Análises clínicas', color: 'green' }, 1, 'surgical_consult', 'high')
      ];
      break;
    case 'diagnósticos':
      baseNodes = [
        createWorkflowNode({ id: 'exam_request', label: 'Solicitação de Exame', icon: FileText, subtitle: 'Pedido médico', color: 'blue' }, 0, undefined, 'medium'),
        createWorkflowNode({ id: 'sample_collection', label: 'Coleta de Amostra', icon: BookOpen, subtitle: 'Procedimento', color: 'green' }, 1, 'exam_request', 'high')
      ];
      break;
    case 'emergência':
      baseNodes = [
        createWorkflowNode({ id: 'triage_emerg', label: 'Triagem de Emergência', icon: FileCheck, subtitle: 'Priorização', color: 'red' }, 0, undefined, 'critical'),
        createWorkflowNode({ id: 'stabilization', label: 'Estabilização', icon: Stethoscope, subtitle: 'Primeiros cuidados', color: 'orange' }, 1, 'triage_emerg', 'critical')
      ];
      break;
    default:
      baseNodes = [
        createWorkflowNode({ id: 'step1', label: 'Etapa 1', icon: Clipboard, subtitle: 'Início', color: 'blue' }, 0, undefined, 'medium'),
        createWorkflowNode({ id: 'step2', label: 'Etapa 2', icon: FileCheck, subtitle: 'Continuação', color: 'green' }, 1, 'step1', 'medium')
      ];
  }
  
  return {
    id: template.id,
    name: template.name,
    description: template.description || '',
    category: template.category,
    baseNodes,
    slaSettings: [],
    exceptionFlows: []
  };
};