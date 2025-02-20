// src/constants/departmentTypes.ts
import { ClipboardList, Stethoscope, Bed, Users, Brain } from 'lucide-react';
import { IWorkflowDepartment } from '@/types/workflow/customize-process-by-workflow-types';

export const departmentTypes: IWorkflowDepartment[] = [
  { 
    id: 'reception', 
    label: 'Recepção', 
    icon: ClipboardList,
    subtitle: 'Entrada do paciente',
    description: 'Setor responsável pelo primeiro atendimento ao paciente',
    color: 'blue'
  },
  { 
    id: 'triage', 
    label: 'Triagem', 
    icon: Stethoscope,
    subtitle: 'Avaliação inicial',
    description: 'Avaliação inicial do estado do paciente',
    color: 'green'
  },
  { 
    id: 'emergency', 
    label: 'Emergência', 
    icon: Bed,
    subtitle: 'Atendimento urgente',
    description: 'Atendimento de casos críticos e emergenciais',
    color: 'red'
  },
  { 
    id: 'ward', 
    label: 'Enfermaria', 
    icon: Users,
    subtitle: 'Acompanhamento',
    description: 'Acompanhamento e cuidados contínuos',
    color: 'purple'
  },
  { 
    id: 'icu', 
    label: 'UTI', 
    icon: Brain,
    subtitle: 'Cuidados intensivos',
    description: 'Unidade de Terapia Intensiva para casos graves',
    color: 'orange'
  },
];