import { IMetricCategory, IMetricTemplate } from "@/types/custom-metrics";
import { Activity, AlertCircle, Clock, CreditCard, Hospital, TrendingUp, UserCheck, Users } from "lucide-react";

export const metricTemplates: IMetricTemplate[] = [
    { 
      id: 'occupancy-rate', 
      name: 'Taxa de Ocupação', 
      description: 'Percentual de leitos ocupados em relação ao total disponível',
      category: 'operational',
      dataSource: 'beds',
      chartType: 'gauge',
      formula: '(leitos_ocupados / total_leitos) * 100',
      icon: Activity,
      iconColor: 'text-blue-500',
      thresholds: {
        target: 85,
        warning: 90,
        critical: 95
      },
      unit: '%',
      refreshInterval: 'hourly'
    },
    { 
      id: 'average-ticket', 
      name: 'Ticket Médio', 
      description: 'Valor médio de faturamento por paciente',
      category: 'financial',
      dataSource: 'billing',
      chartType: 'bar',
      icon: CreditCard,
      iconColor: 'text-green-500',
      unit: 'R$',
      refreshInterval: 'daily'
    },
    { 
      id: 'infection-rate', 
      name: 'Taxa de Infecção', 
      description: 'Porcentagem de pacientes com infecções relacionadas à assistência',
      category: 'clinical',
      dataSource: 'infections',
      chartType: 'line',
      formula: '(pacientes_com_infeccao / total_pacientes) * 100',
      icon: Hospital,
      iconColor: 'text-red-500',
      thresholds: {
        target: 2,
        warning: 5,
        critical: 7
      },
      unit: '%',
      refreshInterval: 'daily'
    },
    { 
      id: 'patient-satisfaction', 
      name: 'Satisfação do Paciente', 
      description: 'Índice de satisfação dos pacientes com o atendimento',
      category: 'satisfaction',
      dataSource: 'surveys',
      chartType: 'gauge',
      icon: UserCheck,
      iconColor: 'text-yellow-500',
      thresholds: {
        target: 90,
        warning: 80,
        critical: 70
      },
      unit: '%',
      refreshInterval: 'weekly'
    },
    { 
      id: 'employee-turnover', 
      name: 'Turnover de Funcionários', 
      description: 'Taxa de rotatividade de funcionários',
      category: 'hr',
      dataSource: 'staff',
      chartType: 'line',
      formula: '((admissoes + demissoes) / (total_funcionarios)) * 100',
      icon: Users,
      iconColor: 'text-purple-500',
      thresholds: {
        target: 5,
        warning: 10,
        critical: 15
      },
      unit: '%',
      refreshInterval: 'monthly'
    },
    { 
      id: 'average-stay', 
      name: 'Tempo Médio de Permanência', 
      description: 'Tempo médio que os pacientes permanecem internados',
      category: 'operational',
      dataSource: 'admissions',
      chartType: 'line',
      icon: Clock,
      iconColor: 'text-indigo-500',
      unit: 'dias',
      refreshInterval: 'daily'
    },
    { 
      id: 'readmission-rate', 
      name: 'Taxa de Readmissão', 
      description: 'Percentual de pacientes readmitidos em até 30 dias',
      category: 'clinical',
      dataSource: 'admissions',
      chartType: 'bar',
      formula: '(readmissoes_30_dias / total_altas) * 100',
      icon: AlertCircle,
      iconColor: 'text-orange-500',
      thresholds: {
        target: 5,
        warning: 8,
        critical: 12
      },
      unit: '%',
      refreshInterval: 'weekly'
    },
    { 
      id: 'profit-margin', 
      name: 'Margem de Lucro', 
      description: 'Percentual de lucro em relação à receita',
      category: 'financial',
      dataSource: 'financial',
      chartType: 'bar',
      formula: '(receita_total - custos_totais) / receita_total * 100',
      icon: TrendingUp,
      iconColor: 'text-emerald-500',
      thresholds: {
        target: 15,
        warning: 10,
        critical: 5
      },
      unit: '%',
      refreshInterval: 'monthly'
    }
];

// Exportando também as categorias padrão para uso em outros componentes
export const defaultMetricCategories: IMetricCategory[] = [
    {
        id: 'operational', name: 'Operacionais', icon: Activity, color: 'text-blue-500',
        description: "",
        count: 0
    },
    {
        id: 'financial', name: 'Financeiras', icon: CreditCard, color: 'text-green-500',
        description: "",
        count: 0
    },
    {
        id: 'clinical', name: 'Clínicas', icon: Hospital, color: 'text-red-500',
        description: "",
        count: 0
    },
    {
        id: 'satisfaction', name: 'Satisfação', icon: UserCheck, color: 'text-yellow-500',
        description: "",
        count: 0
    },
    {
        id: 'hr', name: 'Recursos Humanos', icon: Users, color: 'text-purple-500',
        description: "",
        count: 0
    }
];