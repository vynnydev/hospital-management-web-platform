import React from 'react';
import { Menu } from '@/components/ui/organisms/menu';
import { Activity, BrainCircuit, LineChart, Workflow, Bot, AlertTriangle, Calendar } from 'lucide-react';

interface FlowMenuProps {
  onSelect: (option: string) => void;
}

export const FlowMenu = ({ onSelect }: FlowMenuProps) => {
  const menuItems = [
    {
      label: 'Análise Preditiva',
      icon: <BrainCircuit className="h-5 w-5" />,
      description: 'Previsões de ocupação e demanda',
      action: 'predictive'
    },
    {
      label: 'Simulação de Cenários',
      icon: <Workflow className="h-5 w-5" />,
      description: 'Simular diferentes configurações',
      action: 'simulation'
    },
    {
      label: 'Gestão de Escalas',
      icon: <Calendar className="h-5 w-5" />,
      description: 'Otimização automática de escalas',
      action: 'scheduling'
    },
    {
      label: 'Monitoramento em Tempo Real',
      icon: <Activity className="h-5 w-5" />,
      description: 'Acompanhamento de métricas',
      action: 'monitoring'
    },
    {
      label: 'Alertas Inteligentes',
      icon: <AlertTriangle className="h-5 w-5" />,
      description: 'Sistema proativo de alertas',
      action: 'alerts'
    },
    {
      label: 'Análise de Eficiência',
      icon: <LineChart className="h-5 w-5" />,
      description: 'Métricas de performance',
      action: 'efficiency'
    }
  ];

  return (
    <Menu
      trigger={
        <button className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-cyan-700 text-white transition-all duration-300 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-cyan-500/10 to-blue-600/0 animate-shimmer"></div>
          <Bot className="h-6 w-6 text-white z-10" />
        </button>
      }
      items={menuItems}
      onSelect={onSelect}
      className="w-72 mt-1 p-2 bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 shadow-xl rounded-lg divide-y divide-gray-700/50"
    />
  );
};