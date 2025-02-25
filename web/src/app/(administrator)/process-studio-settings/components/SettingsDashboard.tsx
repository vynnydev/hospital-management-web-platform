import React, { useState } from 'react';
import { Tabs } from '@/components/ui/organisms/tabs';
import { Button } from '@/components/ui/organisms/button';
import { Settings2 } from 'lucide-react';
import { NavigationTabs } from './navigation/NavigationTabs';
import { WorkflowTab } from './workflow/WorkflowTab';
import { AnalyticsTab } from './analytics/AnalyticsTab';
import { AIAssistantTab } from './ai-assistant/AIAssistantTab';
import { NotificationsTab } from './notifications/NotificationsTab';
import { ConnectionsTab } from './connections/ConnectionsTab';
import { useNetworkData } from '@/services/hooks/useNetworkData';
import { CalendarTab } from './calendar/CalendarTab';

export const SettingsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workflow');
  const { networkData } = useNetworkData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 rounded-xl">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Configurações e Personalizações
            </h1>
            <Button variant="ghost" className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Componente de navegação entre abas */}
          <NavigationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Conteúdo das abas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          {/* Aba de Fluxos de Trabalho */}
          <WorkflowTab />

          {/* Aba de Painel Analítico */}
          <AnalyticsTab networkData={networkData} />

          {/* Aba de Assistente IA */}
          <AIAssistantTab />

          {/* Aba de Sistema de Notificações */}
          <NotificationsTab />

          {/* Aba de Calendário Hospitalar */}
          <CalendarTab />

          {/* Aba de Conexões de Sistemas */}
          <ConnectionsTab />
        </Tabs>
      </div>
    </div>
  );
};