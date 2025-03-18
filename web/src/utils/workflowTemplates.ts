import React from 'react';
import { 
  Clipboard, FileCheck, UserCheck, BookOpen, Stethoscope, 
  Building2, Pill, ClipboardCheck, FileText, CalendarCheck, 
  AlertCircle, Activity, BarChart2, Ambulance, Heart, 
  Thermometer, Microscope, LucideProps, Bed, 
  Laptop, ShieldCheck, Zap, GitBranch, Clock, Lock
} from 'lucide-react';
import { IWorkflowNode, IWorkflowTemplate, TPriority } from '@/types/workflow/customize-process-by-workflow-types';

// Definição do tipo para ícones do Lucide
type LucideIconType = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;

// Interface para o departamento no workflow
interface WorkflowDepartment {
  id: string;
  label: string;
  icon: LucideIconType;
  subtitle?: string;
  color?: string;
  description?: string;
}

// Função utilitária para criar nós de workflow com posicionamento automático
export const createWorkflowNode = (
  department: WorkflowDepartment,
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

// Templates pré-definidos para processos hospitalares - Versão expandida
export const workflowTemplates: IWorkflowTemplate[] = [
  // TEMPLATES DE CATEGORIA GERAL
  {
    id: '1',
    name: 'Admissão de Paciente',
    description: 'Processo completo desde a chegada até a alocação de leito, com triagem e avaliação inicial.',
    category: 'geral',
    baseNodes: [
      createWorkflowNode({ id: 'reception', label: 'Recepção', icon: Clipboard, subtitle: 'Registro inicial', color: 'blue', description: 'Registro dos dados do paciente e documentação' }, 0),
      createWorkflowNode({ id: 'triage', label: 'Triagem', icon: FileCheck, subtitle: 'Avaliação inicial', color: 'green', description: 'Classificação de risco e avaliação de sinais vitais' }, 1, 'reception'),
      createWorkflowNode({ id: 'medical_eval', label: 'Avaliação Médica', icon: Stethoscope, subtitle: 'Exame clínico', color: 'orange', description: 'Anamnese e exame físico pelo médico' }, 2, 'triage'),
      createWorkflowNode({ id: 'bed_allocation', label: 'Alocação de Leito', icon: Building2, subtitle: 'Internação', color: 'purple', description: 'Definição de setor e leito apropriado' }, 3, 'medical_eval')
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
    description: 'Processo de liberação do paciente e documentação, incluindo instruções de cuidados pós-alta.',
    category: 'geral',
    baseNodes: [
      createWorkflowNode({ id: 'med_clearance', label: 'Liberação Médica', icon: ClipboardCheck, subtitle: 'Avaliação final', color: 'green', description: 'Avaliação médica final e autorização de alta' }, 0),
      createWorkflowNode({ id: 'pharmacy', label: 'Farmácia', icon: Pill, subtitle: 'Medicação de alta', color: 'blue', description: 'Dispensação de medicamentos para continuidade do tratamento' }, 1, 'med_clearance'),
      createWorkflowNode({ id: 'admin_checkout', label: 'Checkout Administrativo', icon: FileText, subtitle: 'Documentação', color: 'amber', description: 'Fechamento de conta e documentação final' }, 2, 'pharmacy'),
      createWorkflowNode({ id: 'discharge', label: 'Saída do Paciente', icon: UserCheck, subtitle: 'Finalização', color: 'cyan', description: 'Instruções finais e entrega de relatório de alta' }, 3, 'admin_checkout'),
      createWorkflowNode({ id: 'followup', label: 'Agendamento de Follow-up', icon: CalendarCheck, subtitle: 'Acompanhamento', color: 'indigo', description: 'Agendamento de consulta de retorno' }, 4, 'discharge')
    ],
    slaSettings: [
      { departmentId: 'med_clearance', maxTime: 2, timeUnit: 'hour', alertAt: 1 },
      { departmentId: 'pharmacy', maxTime: 30, timeUnit: 'minute', alertAt: 25 },
      { departmentId: 'admin_checkout', maxTime: 1, timeUnit: 'hour', alertAt: 45 },
      { departmentId: 'discharge', maxTime: 30, timeUnit: 'minute', alertAt: 20 }
    ],
    exceptionFlows: [
      { condition: 'Pendências administrativas', targetDepartment: 'admin_manager', priority: 'high' },
      { condition: 'Necessidade de home care', targetDepartment: 'social_service', priority: 'medium' }
    ]
  },
  {
    id: '3',
    name: 'Agendamento Cirúrgico',
    description: 'Workflow para preparação, confirmação e realização de cirurgias eletivas e de urgência.',
    category: 'cirurgias',
    baseNodes: [
      createWorkflowNode({ id: 'surgical_consult', label: 'Consulta Cirúrgica', icon: Stethoscope, subtitle: 'Avaliação inicial', color: 'blue', description: 'Avaliação médica e indicação cirúrgica' }, 0),
      createWorkflowNode({ id: 'preop_exam', label: 'Exames Pré-Operatórios', icon: FileCheck, subtitle: 'Análises clínicas', color: 'green', description: 'Exames laboratoriais e de imagem pré-operatórios' }, 1, 'surgical_consult'),
      createWorkflowNode({ id: 'anesthesia_eval', label: 'Avaliação Anestésica', icon: Thermometer, subtitle: 'Risco anestésico', color: 'teal', description: 'Avaliação de risco anestésico e aprovação' }, 2, 'preop_exam'),
      createWorkflowNode({ id: 'scheduling', label: 'Agendamento', icon: CalendarCheck, subtitle: 'Data e hora', color: 'amber', description: 'Definição de data, hora e sala cirúrgica' }, 3, 'anesthesia_eval'),
      createWorkflowNode({ id: 'surgery', label: 'Procedimento Cirúrgico', icon: Building2, subtitle: 'Realização', color: 'red', description: 'Realização do procedimento cirúrgico' }, 4, 'scheduling'),
      createWorkflowNode({ id: 'postop_care', label: 'Cuidados Pós-Operatórios', icon: Heart, subtitle: 'Recuperação', color: 'pink', description: 'Recuperação e cuidados após cirurgia' }, 5, 'surgery')
    ],
    slaSettings: [
      { departmentId: 'surgical_consult', maxTime: 5, timeUnit: 'day', alertAt: 4 },
      { departmentId: 'preop_exam', maxTime: 3, timeUnit: 'day', alertAt: 2 },
      { departmentId: 'anesthesia_eval', maxTime: 2, timeUnit: 'day', alertAt: 1 },
      { departmentId: 'scheduling', maxTime: 1, timeUnit: 'day', alertAt: 4 }
    ],
    exceptionFlows: [
      { condition: 'Exames alterados', targetDepartment: 'med_consult', priority: 'high' },
      { condition: 'Risco anestésico elevado', targetDepartment: 'intensive_care', priority: 'high' },
      { condition: 'Necessidade de UTI', targetDepartment: 'icu_reservation', priority: 'medium' }
    ]
  },
  {
    id: '4',
    name: 'Exames Laboratoriais',
    description: 'Fluxo de solicitação, coleta, processamento, análise e liberação de resultados de exames.',
    category: 'diagnósticos',
    baseNodes: [
      createWorkflowNode({ id: 'exam_request', label: 'Solicitação de Exame', icon: FileText, subtitle: 'Pedido médico', color: 'blue', description: 'Requisição médica de exames' }, 0),
      createWorkflowNode({ id: 'sample_collection', label: 'Coleta de Amostra', icon: BookOpen, subtitle: 'Procedimento', color: 'green', description: 'Coleta de material biológico para análise' }, 1, 'exam_request'),
      createWorkflowNode({ id: 'sample_processing', label: 'Processamento de Amostra', icon: Microscope, subtitle: 'Preparação', color: 'indigo', description: 'Preparação e processamento inicial da amostra' }, 2, 'sample_collection'),
      createWorkflowNode({ id: 'lab_analysis', label: 'Análise Laboratorial', icon: Stethoscope, subtitle: 'Processamento', color: 'amber', description: 'Análise técnica da amostra' }, 3, 'sample_processing'),
      createWorkflowNode({ id: 'medical_review', label: 'Revisão Médica', icon: ClipboardCheck, subtitle: 'Validação', color: 'orange', description: 'Revisão dos resultados pelo médico patologista' }, 4, 'lab_analysis'),
      createWorkflowNode({ id: 'results', label: 'Liberação de Resultados', icon: ClipboardCheck, subtitle: 'Entrega', color: 'purple', description: 'Disponibilização dos resultados para médico e paciente' }, 5, 'medical_review')
    ],
    slaSettings: [
      { departmentId: 'exam_request', maxTime: 30, timeUnit: 'minute', alertAt: 25 },
      { departmentId: 'sample_collection', maxTime: 1, timeUnit: 'hour', alertAt: 45 },
      { departmentId: 'sample_processing', maxTime: 2, timeUnit: 'hour', alertAt: 1 },
      { departmentId: 'lab_analysis', maxTime: 4, timeUnit: 'hour', alertAt: 3 },
      { departmentId: 'medical_review', maxTime: 2, timeUnit: 'hour', alertAt: 1 }
    ],
    exceptionFlows: [
      { condition: 'Amostra inadequada', targetDepartment: 'new_collection', priority: 'high' },
      { condition: 'Resultado crítico', targetDepartment: 'urgent_notification', priority: 'critical' }
    ]
  },
  {
    id: '5',
    name: 'Protocolo de Emergência',
    description: 'Atendimento rápido para casos críticos, com priorização baseada em risco e fluxo acelerado.',
    category: 'emergência',
    baseNodes: [
      createWorkflowNode({ id: 'triage_emerg', label: 'Triagem de Emergência', icon: FileCheck, subtitle: 'Priorização', color: 'red', description: 'Classificação de risco e priorização imediata' }, 0),
      createWorkflowNode({ id: 'stabilization', label: 'Estabilização', icon: Stethoscope, subtitle: 'Primeiros cuidados', color: 'orange', description: 'Intervenções iniciais e suporte vital' }, 1, 'triage_emerg'),
      createWorkflowNode({ id: 'critical_care', label: 'Cuidados Críticos', icon: Heart, subtitle: 'Monitoramento intensivo', color: 'red', description: 'Monitoramento de sinais vitais e intervenções específicas' }, 2, 'stabilization'),
      createWorkflowNode({ id: 'diagnosis', label: 'Diagnóstico', icon: ClipboardCheck, subtitle: 'Avaliação clínica', color: 'amber', description: 'Exames e procedimentos diagnósticos de emergência' }, 3, 'critical_care'),
      createWorkflowNode({ id: 'emergency_treatment', label: 'Tratamento', icon: Building2, subtitle: 'Intervenção', color: 'purple', description: 'Tratamento específico baseado no diagnóstico' }, 4, 'diagnosis'),
      createWorkflowNode({ id: 'destination_decision', label: 'Definição de Destino', icon: GitBranch, subtitle: 'Encaminhamento', color: 'blue', description: 'Decisão sobre internação, UTI ou alta' }, 5, 'emergency_treatment')
    ],
    slaSettings: [
      { departmentId: 'triage_emerg', maxTime: 5, timeUnit: 'minute', alertAt: 3 },
      { departmentId: 'stabilization', maxTime: 15, timeUnit: 'minute', alertAt: 10 },
      { departmentId: 'critical_care', maxTime: 30, timeUnit: 'minute', alertAt: 15 },
      { departmentId: 'diagnosis', maxTime: 30, timeUnit: 'minute', alertAt: 20 },
      { departmentId: 'emergency_treatment', maxTime: 1, timeUnit: 'hour', alertAt: 45 }
    ],
    exceptionFlows: [
      { condition: 'Parada cardíaca', targetDepartment: 'cpr', priority: 'critical' },
      { condition: 'Trauma grave', targetDepartment: 'trauma_center', priority: 'critical' },
      { condition: 'Necessidade de cirurgia', targetDepartment: 'emergency_surgery', priority: 'critical' }
    ]
  },
  // Novos Templates
  {
    id: '6',
    name: 'Gestão de Leitos',
    description: 'Otimização da alocação e monitoramento de leitos para maximizar capacidade e reduzir tempo de espera.',
    category: 'geral',
    baseNodes: [
      createWorkflowNode({ id: 'bed_request', label: 'Solicitação de Leito', icon: Bed, subtitle: 'Requisição', color: 'blue', description: 'Pedido de leito para paciente' }, 0),
      createWorkflowNode({ id: 'bed_evaluation', label: 'Avaliação de Disponibilidade', icon: BarChart2, subtitle: 'Análise', color: 'amber', description: 'Verificação de disponibilidade e priorização' }, 1, 'bed_request'),
      createWorkflowNode({ id: 'bed_assignment', label: 'Atribuição de Leito', icon: ClipboardCheck, subtitle: 'Alocação', color: 'green', description: 'Definição de leito e comunicação às equipes' }, 2, 'bed_evaluation'),
      createWorkflowNode({ id: 'patient_transfer', label: 'Transferência do Paciente', icon: UserCheck, subtitle: 'Movimentação', color: 'purple', description: 'Transporte do paciente ao leito designado' }, 3, 'bed_assignment'),
      createWorkflowNode({ id: 'bed_monitoring', label: 'Monitoramento', icon: Activity, subtitle: 'Acompanhamento', color: 'indigo', description: 'Monitoramento de ocupação e previsão de alta' }, 4, 'patient_transfer')
    ],
    slaSettings: [
      { departmentId: 'bed_request', maxTime: 30, timeUnit: 'minute', alertAt: 20 },
      { departmentId: 'bed_evaluation', maxTime: 1, timeUnit: 'hour', alertAt: 45 },
      { departmentId: 'bed_assignment', maxTime: 30, timeUnit: 'minute', alertAt: 20 },
      { departmentId: 'patient_transfer', maxTime: 1, timeUnit: 'hour', alertAt: 45 }
    ],
    exceptionFlows: [
      { condition: 'Falta de leitos', targetDepartment: 'crisis_management', priority: 'high' },
      { condition: 'Necessidade de isolamento', targetDepartment: 'infection_control', priority: 'high' }
    ]
  },
  {
    id: '7',
    name: 'Gestão de Ambulâncias',
    description: 'Coordenação de chamados, despacho e monitoramento de ambulâncias para atendimento pré-hospitalar.',
    category: 'emergência',
    baseNodes: [
      createWorkflowNode({ id: 'emergency_call', label: 'Chamado de Emergência', icon: AlertCircle, subtitle: 'Recepção', color: 'red', description: 'Recebimento e registro do chamado' }, 0),
      createWorkflowNode({ id: 'call_triage', label: 'Triagem do Chamado', icon: FileCheck, subtitle: 'Classificação', color: 'amber', description: 'Avaliação da gravidade e definição de prioridade' }, 1, 'emergency_call'),
      createWorkflowNode({ id: 'ambulance_dispatch', label: 'Despacho de Ambulância', icon: Ambulance, subtitle: 'Atribuição', color: 'blue', description: 'Seleção e envio de ambulância adequada' }, 2, 'call_triage'),
      createWorkflowNode({ id: 'route_tracking', label: 'Monitoramento da Rota', icon: Activity, subtitle: 'Acompanhamento', color: 'green', description: 'Acompanhamento em tempo real do deslocamento' }, 3, 'ambulance_dispatch'),
      createWorkflowNode({ id: 'onsite_care', label: 'Atendimento no Local', icon: Stethoscope, subtitle: 'Procedimentos', color: 'purple', description: 'Cuidados e estabilização no local' }, 4, 'route_tracking'),
      createWorkflowNode({ id: 'transport_decision', label: 'Decisão de Transporte', icon: GitBranch, subtitle: 'Encaminhamento', color: 'indigo', description: 'Definição sobre necessidade e destino de transporte' }, 5, 'onsite_care'),
      createWorkflowNode({ id: 'hospital_arrival', label: 'Chegada ao Hospital', icon: Building2, subtitle: 'Entrega', color: 'cyan', description: 'Transferência de cuidados para equipe hospitalar' }, 6, 'transport_decision')
    ],
    slaSettings: [
      { departmentId: 'emergency_call', maxTime: 2, timeUnit: 'minute', alertAt: 1 },
      { departmentId: 'call_triage', maxTime: 3, timeUnit: 'minute', alertAt: 2 },
      { departmentId: 'ambulance_dispatch', maxTime: 5, timeUnit: 'minute', alertAt: 3 },
      { departmentId: 'onsite_care', maxTime: 20, timeUnit: 'minute', alertAt: 15 },
      { departmentId: 'transport_decision', maxTime: 5, timeUnit: 'minute', alertAt: 3 }
    ],
    exceptionFlows: [
      { condition: 'Múltiplas vítimas', targetDepartment: 'disaster_management', priority: 'critical' },
      { condition: 'Paciente crítico', targetDepartment: 'icu_alert', priority: 'critical' },
      { condition: 'Local de difícil acesso', targetDepartment: 'special_rescue', priority: 'high' }
    ]
  },
  {
    id: '8',
    name: 'Atendimento Pediátrico',
    description: 'Workflow especializado para atendimento de crianças e adolescentes, com foco em particularidades pediátricas.',
    category: 'geral',
    baseNodes: [
      createWorkflowNode({ id: 'ped_reception', label: 'Recepção Pediátrica', icon: Clipboard, subtitle: 'Acolhimento', color: 'green', description: 'Recepção e acolhimento da criança e responsáveis' }, 0),
      createWorkflowNode({ id: 'ped_triage', label: 'Triagem Pediátrica', icon: FileCheck, subtitle: 'Avaliação inicial', color: 'blue', description: 'Avaliação inicial com parâmetros específicos para idade' }, 1, 'ped_reception'),
      createWorkflowNode({ id: 'ped_consultation', label: 'Consulta Pediátrica', icon: Stethoscope, subtitle: 'Avaliação médica', color: 'purple', description: 'Atendimento médico pediátrico' }, 2, 'ped_triage'),
      createWorkflowNode({ id: 'ped_procedures', label: 'Procedimentos', icon: Thermometer, subtitle: 'Intervenções', color: 'amber', description: 'Realização de procedimentos diagnósticos ou terapêuticos' }, 3, 'ped_consultation'),
      createWorkflowNode({ id: 'parent_orientation', label: 'Orientação aos Pais', icon: BookOpen, subtitle: 'Educação', color: 'cyan', description: 'Orientações para continuidade de cuidados' }, 4, 'ped_procedures'),
      createWorkflowNode({ id: 'ped_discharge', label: 'Alta Pediátrica', icon: UserCheck, subtitle: 'Finalização', color: 'teal', description: 'Conclusão do atendimento e encaminhamentos' }, 5, 'parent_orientation')
    ],
    slaSettings: [
      { departmentId: 'ped_reception', maxTime: 10, timeUnit: 'minute', alertAt: 8 },
      { departmentId: 'ped_triage', maxTime: 15, timeUnit: 'minute', alertAt: 10 },
      { departmentId: 'ped_consultation', maxTime: 30, timeUnit: 'minute', alertAt: 25 },
      { departmentId: 'ped_procedures', maxTime: 30, timeUnit: 'minute', alertAt: 25 },
      { departmentId: 'parent_orientation', maxTime: 15, timeUnit: 'minute', alertAt: 10 }
    ],
    exceptionFlows: [
      { condition: 'Criança em emergência', targetDepartment: 'ped_emergency', priority: 'critical' },
      { condition: 'Suspeita de maus-tratos', targetDepartment: 'social_services', priority: 'high' }
    ]
  },
  {
    id: '9',
    name: 'Gestão de Medicação',
    description: 'Controle de prescrição, dispensação, administração e monitoramento de medicamentos.',
    category: 'diagnósticos',
    baseNodes: [
      createWorkflowNode({ id: 'med_prescription', label: 'Prescrição Médica', icon: FileText, subtitle: 'Receituário', color: 'blue', description: 'Prescrição de medicamentos pelo médico' }, 0),
      createWorkflowNode({ id: 'prescription_review', label: 'Revisão Farmacêutica', icon: ClipboardCheck, subtitle: 'Validação', color: 'purple', description: 'Análise farmacêutica da prescrição' }, 1, 'med_prescription'),
      createWorkflowNode({ id: 'med_preparation', label: 'Preparação', icon: Pill, subtitle: 'Manipulação', color: 'green', description: 'Separação e preparação dos medicamentos' }, 2, 'prescription_review'),
      createWorkflowNode({ id: 'med_dispensation', label: 'Dispensação', icon: ShieldCheck, subtitle: 'Entrega', color: 'amber', description: 'Liberação e entrega dos medicamentos' }, 3, 'med_preparation'),
      createWorkflowNode({ id: 'med_administration', label: 'Administração', icon: Clock, subtitle: 'Aplicação', color: 'red', description: 'Administração do medicamento ao paciente' }, 4, 'med_dispensation'),
      createWorkflowNode({ id: 'med_monitoring', label: 'Monitoramento', icon: Activity, subtitle: 'Acompanhamento', color: 'cyan', description: 'Acompanhamento de efeitos e eficácia' }, 5, 'med_administration')
    ],
    slaSettings: [
      { departmentId: 'med_prescription', maxTime: 30, timeUnit: 'minute', alertAt: 25 },
      { departmentId: 'prescription_review', maxTime: 20, timeUnit: 'minute', alertAt: 15 },
      { departmentId: 'med_preparation', maxTime: 30, timeUnit: 'minute', alertAt: 25 },
      { departmentId: 'med_dispensation', maxTime: 15, timeUnit: 'minute', alertAt: 10 },
      { departmentId: 'med_administration', maxTime: 15, timeUnit: 'minute', alertAt: 10 }
    ],
    exceptionFlows: [
      { condition: 'Medicamento não disponível', targetDepartment: 'pharmacy_management', priority: 'high' },
      { condition: 'Reação adversa', targetDepartment: 'adverse_reaction', priority: 'critical' },
      { condition: 'Interação medicamentosa', targetDepartment: 'pharmacist_review', priority: 'high' }
    ]
  },
  {
    id: '10',
    name: 'Telemedicina',
    description: 'Atendimento virtual com processos específicos para consultas remotas e monitoramento à distância.',
    category: 'diagnósticos',
    baseNodes: [
      createWorkflowNode({ id: 'teleconsultation_request', label: 'Solicitação de Teleconsulta', icon: Laptop, subtitle: 'Agendamento', color: 'blue', description: 'Solicitação e agendamento de consulta virtual' }, 0),
      createWorkflowNode({ id: 'patient_data_collection', label: 'Coleta de Dados Prévios', icon: Clipboard, subtitle: 'Pré-consulta', color: 'green', description: 'Coleta de informações e queixas do paciente' }, 1, 'teleconsultation_request'),
      createWorkflowNode({ id: 'teleconsultation', label: 'Teleconsulta', icon: Stethoscope, subtitle: 'Atendimento virtual', color: 'purple', description: 'Consulta médica por videoconferência' }, 2, 'patient_data_collection'),
      createWorkflowNode({ id: 'remote_diagnosis', label: 'Diagnóstico Remoto', icon: FileText, subtitle: 'Avaliação', color: 'amber', description: 'Elaboração de diagnóstico e plano terapêutico' }, 3, 'teleconsultation'),
      createWorkflowNode({ id: 'eprescription', label: 'Prescrição Eletrônica', icon: Pill, subtitle: 'Medicamentos', color: 'red', description: 'Emissão de receita digital' }, 4, 'remote_diagnosis'),
      createWorkflowNode({ id: 'telemedicine_followup', label: 'Acompanhamento Remoto', icon: Activity, subtitle: 'Monitoramento', color: 'cyan', description: 'Monitoramento contínuo e follow-up' }, 5, 'eprescription')
    ],
    slaSettings: [
      { departmentId: 'teleconsultation_request', maxTime: 4, timeUnit: 'hour', alertAt: 3 },
      { departmentId: 'patient_data_collection', maxTime: 1, timeUnit: 'hour', alertAt: 45 },
      { departmentId: 'teleconsultation', maxTime: 30, timeUnit: 'minute', alertAt: 25 },
      { departmentId: 'remote_diagnosis', maxTime: 30, timeUnit: 'minute', alertAt: 25 },
      { departmentId: 'eprescription', maxTime: 15, timeUnit: 'minute', alertAt: 10 }
    ],
    exceptionFlows: [
      { condition: 'Problemas técnicos', targetDepartment: 'it_support', priority: 'high' },
      { condition: 'Necessidade de avaliação presencial', targetDepartment: 'in_person_consult', priority: 'medium' },
      { condition: 'Problema de conexão', targetDepartment: 'technical_support', priority: 'medium' }
    ]
  },
  {
    id: '11',
    name: 'Protocolo de Isolamento',
    description: 'Gestão de pacientes com doenças infecto-contagiosas que requerem isolamento ou precauções especiais.',
    category: 'emergência',
    baseNodes: [
      createWorkflowNode({ id: 'isolation_identification', label: 'Identificação de Caso', icon: AlertCircle, subtitle: 'Detecção', color: 'red', description: 'Identificação de caso suspeito que requer isolamento' }, 0),
      createWorkflowNode({ id: 'isolation_assessment', label: 'Avaliação de Risco', icon: ShieldCheck, subtitle: 'Classificação', color: 'orange', description: 'Determinação do tipo de isolamento necessário' }, 1, 'isolation_identification'),
      createWorkflowNode({ id: 'isolation_preparation', label: 'Preparação de Área', icon: Lock, subtitle: 'Adequação', color: 'yellow', description: 'Preparação do ambiente de isolamento apropriado' }, 2, 'isolation_assessment'),
      createWorkflowNode({ id: 'patient_isolation', label: 'Isolamento do Paciente', icon: Bed, subtitle: 'Contenção', color: 'purple', description: 'Transferência e manutenção do paciente em isolamento' }, 3, 'isolation_preparation'),
      createWorkflowNode({ id: 'isolation_monitoring', label: 'Monitoramento', icon: Activity, subtitle: 'Acompanhamento', color: 'blue', description: 'Vigilância contínua do paciente e da equipe' }, 4, 'patient_isolation'),
      createWorkflowNode({ id: 'contact_tracing', label: 'Rastreamento de Contatos', icon: GitBranch, subtitle: 'Mapeamento', color: 'green', description: 'Identificação e monitoramento de pessoas expostas' }, 5, 'isolation_monitoring'),
      createWorkflowNode({ id: 'isolation_discontinuation', label: 'Descontinuação', icon: UserCheck, subtitle: 'Liberação', color: 'teal', description: 'Avaliação para suspensão do isolamento' }, 6, 'isolation_monitoring')
    ],
    slaSettings: [
      { departmentId: 'isolation_identification', maxTime: 15, timeUnit: 'minute', alertAt: 10 },
      { departmentId: 'isolation_assessment', maxTime: 30, timeUnit: 'minute', alertAt: 20 },
      { departmentId: 'isolation_preparation', maxTime: 1, timeUnit: 'hour', alertAt: 45 },
      { departmentId: 'patient_isolation', maxTime: 30, timeUnit: 'minute', alertAt: 20 },
      { departmentId: 'contact_tracing', maxTime: 4, timeUnit: 'hour', alertAt: 3 }
    ],
    exceptionFlows: [
      { condition: 'Doença de notificação compulsória', targetDepartment: 'health_authorities', priority: 'high' },
      { condition: 'Surto identificado', targetDepartment: 'outbreak_management', priority: 'critical' },
      { condition: 'Necessidade de transferência', targetDepartment: 'reference_hospital', priority: 'high' }
    ]
  },
  {
    id: '12',
    name: 'Prevenção de Infecção Hospitalar',
    description: 'Processos de vigilância, monitoramento e intervenção para prevenção de infecções relacionadas à assistência à saúde.',
    category: 'geral',
    baseNodes: [
      createWorkflowNode({ id: 'infection_surveillance', label: 'Vigilância Epidemiológica', icon: BarChart2, subtitle: 'Monitoramento', color: 'blue', description: 'Coleta e análise de dados sobre infecções' }, 0),
      createWorkflowNode({ id: 'infection_risk_assessment', label: 'Avaliação de Risco', icon: ShieldCheck, subtitle: 'Análise', color: 'amber', description: 'Identificação de fatores de risco para infecção' }, 1, 'infection_surveillance'),
      createWorkflowNode({ id: 'preventive_measures', label: 'Medidas Preventivas', icon: Lock, subtitle: 'Proteção', color: 'green', description: 'Implementação de protocolos de prevenção' }, 2, 'infection_risk_assessment'),
      createWorkflowNode({ id: 'education_training', label: 'Educação e Treinamento', icon: BookOpen, subtitle: 'Capacitação', color: 'purple', description: 'Treinamento da equipe sobre práticas seguras' }, 3, 'preventive_measures'),
      createWorkflowNode({ id: 'compliance_monitoring', label: 'Monitoramento de Adesão', icon: ClipboardCheck, subtitle: 'Verificação', color: 'orange', description: 'Avaliação da conformidade com protocolos' }, 4, 'education_training'),
      createWorkflowNode({ id: 'outbreak_management', label: 'Gestão de Surtos', icon: AlertCircle, subtitle: 'Contenção', color: 'red', description: 'Protocolos para contenção de surtos' }, 5, 'compliance_monitoring')
    ],
    slaSettings: [
      { departmentId: 'infection_surveillance', maxTime: 24, timeUnit: 'hour', alertAt: 20 },
      { departmentId: 'infection_risk_assessment', maxTime: 48, timeUnit: 'hour', alertAt: 40 },
      { departmentId: 'preventive_measures', maxTime: 24, timeUnit: 'hour', alertAt: 20 },
      { departmentId: 'education_training', maxTime: 7, timeUnit: 'day', alertAt: 5 },
      { departmentId: 'compliance_monitoring', maxTime: 3, timeUnit: 'day', alertAt: 2 }
    ],
    exceptionFlows: [
      { condition: 'Resistência antimicrobiana', targetDepartment: 'antibiotic_stewardship', priority: 'high' },
      { condition: 'Surto identificado', targetDepartment: 'crisis_committee', priority: 'critical' }
    ]
  },
  {
    id: '13',
    name: 'Cuidados Paliativos',
    description: 'Workflow para coordenação de cuidados integrais a pacientes com doenças graves, progressivas e terminais.',
    category: 'geral',
    baseNodes: [
      createWorkflowNode({ id: 'palliative_referral', label: 'Referenciamento', icon: FileText, subtitle: 'Encaminhamento', color: 'blue', description: 'Identificação e encaminhamento do paciente' }, 0),
      createWorkflowNode({ id: 'palliative_assessment', label: 'Avaliação Multidimensional', icon: Stethoscope, subtitle: 'Avaliação', color: 'amber', description: 'Avaliação completa do paciente e família' }, 1, 'palliative_referral'),
      createWorkflowNode({ id: 'care_planning', label: 'Plano de Cuidados', icon: ClipboardCheck, subtitle: 'Planejamento', color: 'green', description: 'Elaboração de plano individualizado' }, 2, 'palliative_assessment'),
      createWorkflowNode({ id: 'symptom_management', label: 'Controle de Sintomas', icon: Activity, subtitle: 'Alívio', color: 'red', description: 'Manejo de dor e outros sintomas' }, 3, 'care_planning'),
      createWorkflowNode({ id: 'psychosocial_support', label: 'Suporte Psicossocial', icon: Heart, subtitle: 'Apoio', color: 'purple', description: 'Apoio emocional ao paciente e família' }, 4, 'care_planning'),
      createWorkflowNode({ id: 'advance_care_planning', label: 'Diretivas Antecipadas', icon: FileText, subtitle: 'Decisões', color: 'indigo', description: 'Documentação de preferências de cuidado' }, 5, 'care_planning'),
      createWorkflowNode({ id: 'end_of_life_care', label: 'Cuidados de Fim de Vida', icon: Heart, subtitle: 'Conforto', color: 'cyan', description: 'Cuidados específicos para fase final' }, 6, 'symptom_management')
    ],
    slaSettings: [
      { departmentId: 'palliative_referral', maxTime: 24, timeUnit: 'hour', alertAt: 20 },
      { departmentId: 'palliative_assessment', maxTime: 48, timeUnit: 'hour', alertAt: 36 },
      { departmentId: 'care_planning', maxTime: 24, timeUnit: 'hour', alertAt: 20 },
      { departmentId: 'symptom_management', maxTime: 4, timeUnit: 'hour', alertAt: 2 }
    ],
    exceptionFlows: [
      { condition: 'Sintomas refratários', targetDepartment: 'pain_specialist', priority: 'high' },
      { condition: 'Crise familiar', targetDepartment: 'family_support', priority: 'high' },
      { condition: 'Sofrimento espiritual', targetDepartment: 'spiritual_care', priority: 'medium' }
    ]
  },
  {
    id: '14',
    name: 'Transplante de Órgãos',
    description: 'Coordenação do processo completo de transplante, desde a captação até o acompanhamento pós-operatório.',
    category: 'cirurgias',
    baseNodes: [
      createWorkflowNode({ id: 'donor_identification', label: 'Identificação de Doador', icon: AlertCircle, subtitle: 'Detecção', color: 'red', description: 'Identificação de potencial doador' }, 0),
      createWorkflowNode({ id: 'donor_evaluation', label: 'Avaliação do Doador', icon: Stethoscope, subtitle: 'Análise', color: 'blue', description: 'Avaliação da viabilidade para doação' }, 1, 'donor_identification'),
      createWorkflowNode({ id: 'organ_procurement', label: 'Captação de Órgãos', icon: Clock, subtitle: 'Procedimento', color: 'orange', description: 'Procedimento de retirada dos órgãos' }, 2, 'donor_evaluation'),
      createWorkflowNode({ id: 'organ_allocation', label: 'Alocação de Órgãos', icon: GitBranch, subtitle: 'Distribuição', color: 'purple', description: 'Designação de órgãos para receptores compatíveis' }, 3, 'organ_procurement'),
      createWorkflowNode({ id: 'recipient_preparation', label: 'Preparação do Receptor', icon: FileCheck, subtitle: 'Preparação', color: 'green', description: 'Preparação do paciente para receber o órgão' }, 4, 'organ_allocation'),
      createWorkflowNode({ id: 'transplant_surgery', label: 'Cirurgia de Transplante', icon: Activity, subtitle: 'Procedimento', color: 'amber', description: 'Realização do transplante' }, 5, 'recipient_preparation'),
      createWorkflowNode({ id: 'post_transplant_care', label: 'Cuidados Pós-Transplante', icon: Heart, subtitle: 'Acompanhamento', color: 'indigo', description: 'Cuidados imediatos após o transplante' }, 6, 'transplant_surgery'),
      createWorkflowNode({ id: 'immunosuppression_management', label: 'Gestão da Imunossupressão', icon: Pill, subtitle: 'Tratamento', color: 'cyan', description: 'Manejo de medicamentos imunossupressores' }, 7, 'post_transplant_care'),
      createWorkflowNode({ id: 'long_term_followup', label: 'Acompanhamento de Longo Prazo', icon: CalendarCheck, subtitle: 'Continuidade', color: 'teal', description: 'Monitoramento contínuo do enxerto e paciente' }, 8, 'immunosuppression_management')
    ],
    slaSettings: [
      { departmentId: 'donor_identification', maxTime: 1, timeUnit: 'hour', alertAt: 45 },
      { departmentId: 'donor_evaluation', maxTime: 4, timeUnit: 'hour', alertAt: 3 },
      { departmentId: 'organ_procurement', maxTime: 6, timeUnit: 'hour', alertAt: 5 },
      { departmentId: 'organ_allocation', maxTime: 2, timeUnit: 'hour', alertAt: 1 },
      { departmentId: 'recipient_preparation', maxTime: 4, timeUnit: 'hour', alertAt: 3 },
      { departmentId: 'post_transplant_care', maxTime: 2, timeUnit: 'hour', alertAt: 1 }
    ],
    exceptionFlows: [
      { condition: 'Rejeição aguda', targetDepartment: 'transplant_immunology', priority: 'critical' },
      { condition: 'Infecção oportunista', targetDepartment: 'infectious_disease', priority: 'high' },
      { condition: 'Complicação cirúrgica', targetDepartment: 'surgical_emergency', priority: 'critical' }
    ]
  },
  {
    id: '15',
    name: 'Gerenciamento de Riscos',
    description: 'Processo para identificação, análise, avaliação e mitigação de riscos relacionados à assistência ao paciente.',
    category: 'geral',
    baseNodes: [
      createWorkflowNode({ id: 'risk_identification', label: 'Identificação de Riscos', icon: AlertCircle, subtitle: 'Detecção', color: 'red', description: 'Identificação de potenciais riscos à segurança' }, 0),
      createWorkflowNode({ id: 'risk_analysis', label: 'Análise de Riscos', icon: BarChart2, subtitle: 'Avaliação', color: 'amber', description: 'Análise da probabilidade e impacto dos riscos' }, 1, 'risk_identification'),
      createWorkflowNode({ id: 'risk_prioritization', label: 'Priorização de Riscos', icon: GitBranch, subtitle: 'Classificação', color: 'orange', description: 'Categorização de riscos por criticidade' }, 2, 'risk_analysis'),
      createWorkflowNode({ id: 'mitigation_planning', label: 'Planejamento de Mitigação', icon: ClipboardCheck, subtitle: 'Estratégia', color: 'blue', description: 'Desenvolvimento de planos de ação' }, 3, 'risk_prioritization'),
      createWorkflowNode({ id: 'mitigation_implementation', label: 'Implementação', icon: Activity, subtitle: 'Execução', color: 'green', description: 'Execução das ações de mitigação' }, 4, 'mitigation_planning'),
      createWorkflowNode({ id: 'monitoring_review', label: 'Monitoramento e Revisão', icon: Clock, subtitle: 'Acompanhamento', color: 'purple', description: 'Acompanhamento da eficácia das ações' }, 5, 'mitigation_implementation'),
      createWorkflowNode({ id: 'incident_management', label: 'Gestão de Incidentes', icon: Zap, subtitle: 'Resposta', color: 'indigo', description: 'Resposta rápida a eventos adversos' }, 6, 'monitoring_review')
    ],
    slaSettings: [
      { departmentId: 'risk_identification', maxTime: 24, timeUnit: 'hour', alertAt: 20 },
      { departmentId: 'risk_analysis', maxTime: 48, timeUnit: 'hour', alertAt: 36 },
      { departmentId: 'risk_prioritization', maxTime: 24, timeUnit: 'hour', alertAt: 20 },
      { departmentId: 'mitigation_planning', maxTime: 72, timeUnit: 'hour', alertAt: 60 },
      { departmentId: 'mitigation_implementation', maxTime: 7, timeUnit: 'day', alertAt: 5 },
      { departmentId: 'incident_management', maxTime: 1, timeUnit: 'hour', alertAt: 30 }
    ],
    exceptionFlows: [
      { condition: 'Evento sentinela', targetDepartment: 'quality_committee', priority: 'critical' },
      { condition: 'Risco institucional', targetDepartment: 'executive_board', priority: 'high' },
      { condition: 'Near miss', targetDepartment: 'safety_team', priority: 'medium' }
    ]
  }
];