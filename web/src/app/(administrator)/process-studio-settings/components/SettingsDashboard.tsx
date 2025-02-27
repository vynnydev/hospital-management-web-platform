import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Card, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Settings2, FileText, BarChart2, Bot, Bell, Calendar, Link } from 'lucide-react';
import { WorkflowTab } from './workflow/WorkflowTab';
import { AnalyticsTab } from './analytics/AnalyticsTab';
import { AIGenerativeTab } from './ai-generative/AIGenerativeTab';
import { NotificationsTab } from './notifications/NotificationsTab';
import { CalendarTab } from './calendar/CalendarTab';
import { ConnectionsTab } from './connections/ConnectionsTab';
import { useNetworkData } from '@/services/hooks/useNetworkData';

export const SettingsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workflow');
  const { networkData } = useNetworkData();

  const navigationItems = [
    { id: 'workflow', label: 'Fluxos de Trabalho', icon: FileText },
    { id: 'analytics', label: 'Painel Analítico', icon: BarChart2 },
    { id: 'ai_assistant', label: 'IA Generativa', icon: Bot },
    { id: 'notifications', label: 'Sistema de Notificações', icon: Bell },
    { id: 'calendar', label: 'Calendário Hospitalar', icon: Calendar },
    { id: 'connections', label: 'Conexões de Sistemas', icon: Link }
  ];

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

          {/* Barra de navegação estilizada */}
          <nav className="flex space-x-6 pt-6 overflow-x-auto pb-2 scrollbar-hide">
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
        </div>

        {/* Conteúdo das abas usando TabsContent */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="hidden">
            {navigationItems.map((item) => (
              <TabsTrigger key={item.id} value={item.id}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="workflow" className="space-y-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <WorkflowTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <AnalyticsTab networkData={networkData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai_assistant" className="space-y-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <AIGenerativeTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <NotificationsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <CalendarTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections" className="space-y-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <ConnectionsTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};