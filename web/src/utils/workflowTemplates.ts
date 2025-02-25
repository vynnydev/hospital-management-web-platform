import React from 'react';
import { 
    Clipboard, FileCheck, UserCheck, BookOpen, Stethoscope, 
    Building2, Pill, ClipboardCheck, FileText, CalendarCheck, 
    LucideProps
  } from 'lucide-react';
import { IWorkflowNode, IWorkflowTemplate, TPriority } from '@/types/workflow/customize-process-by-workflow-types';

type LucideIconType = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;

// Função utilitária para criar nós de workflow com posicionamento automático
export const createWorkflowNode = (
    department: { 
      id: string; 
      label: string; 
      icon: LucideIconType; 
      subtitle?: string; 
      color?: string; 
      description?: string;
    },
    index: number,
    parentId?: string
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
      priority: 'medium' as TPriority
    };
  };
  
  // Templates pré-definidos para processos hospitalares
  export const workflowTemplates: IWorkflowTemplate[] = [
    {
      id: '1',
      name: 'Admissão de Paciente',
      description: 'Fluxo completo desde a chegada até a alocação de leito',
      category: 'geral',
      baseNodes: [
        createWorkflowNode({ id: 'reception', label: 'Recepção', icon: Clipboard, subtitle: 'Registro inicial', color: 'blue' }, 0),
        createWorkflowNode({ id: 'triage', label: 'Triagem', icon: FileCheck, subtitle: 'Avaliação inicial', color: 'green' }, 1, 'reception'),
        createWorkflowNode({ id: 'medical_eval', label: 'Avaliação Médica', icon: Stethoscope, subtitle: 'Exame clínico', color: 'orange' }, 2, 'triage'),
        createWorkflowNode({ id: 'bed_allocation', label: 'Alocação de Leito', icon: Building2, subtitle: 'Internação', color: 'purple' }, 3, 'medical_eval')
      ],
      slaSettings: [
        { departmentId: 'reception', maxTime: 15, timeUnit: 'minute', alertAt: 10 },
        { departmentId: 'triage', maxTime: 30, timeUnit: 'minute', alertAt: 20 },
        { departmentId: 'medical_eval', maxTime: 1, timeUnit: 'hour', alertAt: 45 }
      ],
      exceptionFlows: [
        { condition: 'Paciente de alto risco', targetDepartment: 'emergency', priority: 'critical' }
      ]
    },
    {
      id: '2',
      name: 'Alta Hospitalar',
      description: 'Processo de liberação do paciente e documentação',
      category: 'geral',
      baseNodes: [
        createWorkflowNode({ id: 'med_clearance', label: 'Liberação Médica', icon: ClipboardCheck, subtitle: 'Avaliação final', color: 'green' }, 0),
        createWorkflowNode({ id: 'pharmacy', label: 'Farmácia', icon: Pill, subtitle: 'Medicação de alta', color: 'blue' }, 1, 'med_clearance'),
        createWorkflowNode({ id: 'admin_checkout', label: 'Checkout Administrativo', icon: FileText, subtitle: 'Documentação', color: 'amber' }, 2, 'pharmacy'),
        createWorkflowNode({ id: 'discharge', label: 'Saída do Paciente', icon: UserCheck, subtitle: 'Finalização', color: 'cyan' }, 3, 'admin_checkout')
      ],
      slaSettings: [
        { departmentId: 'med_clearance', maxTime: 2, timeUnit: 'hour', alertAt: 1 },
        { departmentId: 'pharmacy', maxTime: 30, timeUnit: 'minute', alertAt: 25 },
        { departmentId: 'admin_checkout', maxTime: 1, timeUnit: 'hour', alertAt: 45 }
      ]
    },
    {
      id: '3',
      name: 'Agendamento Cirúrgico',
      description: 'Workflow para preparação e realização de cirurgias',
      category: 'cirurgias',
      baseNodes: [
        createWorkflowNode({ id: 'surgical_consult', label: 'Consulta Cirúrgica', icon: Stethoscope, subtitle: 'Avaliação inicial', color: 'blue' }, 0),
        createWorkflowNode({ id: 'preop_exam', label: 'Exames Pré-Operatórios', icon: FileCheck, subtitle: 'Análises clínicas', color: 'green' }, 1, 'surgical_consult'),
        createWorkflowNode({ id: 'scheduling', label: 'Agendamento', icon: CalendarCheck, subtitle: 'Data e hora', color: 'amber' }, 2, 'preop_exam'),
        createWorkflowNode({ id: 'surgery', label: 'Procedimento Cirúrgico', icon: Building2, subtitle: 'Realização', color: 'red' }, 3, 'scheduling')
      ],
      slaSettings: [
        { departmentId: 'surgical_consult', maxTime: 5, timeUnit: 'day', alertAt: 4 },
        { departmentId: 'preop_exam', maxTime: 3, timeUnit: 'day', alertAt: 2 },
        { departmentId: 'scheduling', maxTime: 1, timeUnit: 'day', alertAt: 4 }
      ],
      exceptionFlows: [
        { condition: 'Exames alterados', targetDepartment: 'med_consult', priority: 'high' }
      ]
    },
    {
      id: '4',
      name: 'Exames Laboratoriais',
      description: 'Fluxo de solicitação, coleta e resultado de exames',
      category: 'diagnósticos',
      baseNodes: [
        createWorkflowNode({ id: 'exam_request', label: 'Solicitação de Exame', icon: FileText, subtitle: 'Pedido médico', color: 'blue' }, 0),
        createWorkflowNode({ id: 'sample_collection', label: 'Coleta de Amostra', icon: BookOpen, subtitle: 'Procedimento', color: 'green' }, 1, 'exam_request'),
        createWorkflowNode({ id: 'lab_analysis', label: 'Análise Laboratorial', icon: Stethoscope, subtitle: 'Processamento', color: 'amber' }, 2, 'sample_collection'),
        createWorkflowNode({ id: 'results', label: 'Resultados', icon: ClipboardCheck, subtitle: 'Liberação', color: 'purple' }, 3, 'lab_analysis')
      ],
      slaSettings: [
        { departmentId: 'exam_request', maxTime: 30, timeUnit: 'minute', alertAt: 25 },
        { departmentId: 'sample_collection', maxTime: 1, timeUnit: 'hour', alertAt: 45 },
        { departmentId: 'lab_analysis', maxTime: 4, timeUnit: 'hour', alertAt: 3 }
      ]
    },
    {
      id: '5',
      name: 'Protocolo de Emergência',
      description: 'Atendimento rápido para casos críticos',
      category: 'geral',
      baseNodes: [
        createWorkflowNode({ id: 'triage_emerg', label: 'Triagem de Emergência', icon: FileCheck, subtitle: 'Priorização', color: 'red' }, 0),
        createWorkflowNode({ id: 'stabilization', label: 'Estabilização', icon: Stethoscope, subtitle: 'Primeiros cuidados', color: 'orange' }, 1, 'triage_emerg'),
        createWorkflowNode({ id: 'diagnosis', label: 'Diagnóstico', icon: ClipboardCheck, subtitle: 'Avaliação clínica', color: 'amber' }, 2, 'stabilization'),
        createWorkflowNode({ id: 'emergency_treatment', label: 'Tratamento', icon: Building2, subtitle: 'Intervenção', color: 'purple' }, 3, 'diagnosis')
      ],
      slaSettings: [
        { departmentId: 'triage_emerg', maxTime: 5, timeUnit: 'minute', alertAt: 3 },
        { departmentId: 'stabilization', maxTime: 15, timeUnit: 'minute', alertAt: 10 },
        { departmentId: 'diagnosis', maxTime: 30, timeUnit: 'minute', alertAt: 20 }
      ],
      exceptionFlows: [
        { condition: 'Parada cardíaca', targetDepartment: 'cpr', priority: 'critical' },
        { condition: 'Trauma grave', targetDepartment: 'trauma_center', priority: 'critical' }
      ]
    }
];