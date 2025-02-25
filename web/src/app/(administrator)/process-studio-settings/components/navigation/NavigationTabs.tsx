import React from 'react';
import { Workflow, BarChart4, Brain, Bell, Calendar, Share2 } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, setActiveTab }) => {
  const navigationItems = [
    { id: 'workflow', label: 'Fluxos de Trabalho', icon: Workflow },
    { id: 'analytics', label: 'Painel Analítico', icon: BarChart4 },
    { id: 'ai-assistant', label: 'Assistente IA', icon: Brain },
    { id: 'notifications', label: 'Sistema de Notificações', icon: Bell },
    { id: 'calendar', label: 'Calendário Hospitalar', icon: Calendar },
    { id: 'connections', label: 'Conexões de Sistemas', icon: Share2 }
  ];

  return (
    <nav className="flex space-x-6 pt-8">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              isActive 
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            <Icon className="h-4 w-4 mr-2" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};