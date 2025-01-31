import {
    ChartBarIcon,
    ExclamationTriangleIcon,
    CogIcon,
    ClockIcon,
    BoltIcon,
    UserGroupIcon,
    BuildingOfficeIcon,
    ArrowTrendingUpIcon,
    ClipboardDocumentCheckIcon,
    ShieldExclamationIcon
  } from '@heroicons/react/24/outline';
  import { ISection } from '@/types/analytics-types';
  
  export const analyticsSections: Omit<ISection, 'content' | 'actionPlan'>[] = [
    {
      title: "1. ANÁLISE DA SITUAÇÃO ATUAL",
      icon: ChartBarIcon,
      gradient: "from-emerald-500 to-emerald-700",
      tooltip: "Análise detalhada da situação atual do hospital",
      subCards: [
        {
          title: "Equilíbrio Capacidade-Demanda",
          icon: BuildingOfficeIcon,
          gradient: "from-emerald-400 to-emerald-600",
          extractionStart: "**Equilíbrio entre Capacidade e Demanda**",
          extractionEnd: "**Comparação com Padrões do Setor**",
          content: '' // Será preenchido dinamicamente
        },
        {
          title: "Padrões do Setor",
          icon: ArrowTrendingUpIcon,
          gradient: "from-emerald-400 to-emerald-600",
          extractionStart: "**Comparação com Padrões do Setor**",
          extractionEnd: "**Padrões nas Tendências Atuais**",
          content: '' // Será preenchido dinamicamente
        }
      ],
      lines: [
        {
          title: "Tendências Atuais",
          extractionStart: "**Padrões nas Tendências Atuais**",
          extractionEnd: "**Impacto das Variações Recentes**",
          content: '' // Será preenchido dinamicamente
        },
        {
          title: "Variações Recentes",
          extractionStart: "**Impacto das Variações Recentes**",
          extractionEnd: "**2. PONTOS CRÍTICOS**",
          content: '' // Será preenchido dinamicamente
        }
      ],
      actionPlanStart: "**Planos de Ação para Situação Atual:**",
      actionPlanEnd: "**2. PONTOS CRÍTICOS**"
    },
    // ... outras seções seguem o mesmo padrão
  ];