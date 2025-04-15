import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Card, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Settings2, FileText, BarChart2, Bot, Bell, Calendar, Link, UserIcon, CreditCard, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkflowTab } from './workflow/WorkflowTab';
import { AnalyticsTab } from './analytics/AnalyticsTab';
import { AIGenerativeTab } from './ai-generative/AIGenerativeTab';
import { NotificationsTab } from './notifications/NotificationsTab';
import { CalendarTab } from './calendar/CalendarTab';
import { ConnectionsTab } from './connections/ConnectionsTab';
import { useNetworkData } from '@/hooks/network-hospital/useNetworkData';
import { AlertsProvider } from '@/components/ui/templates/providers/alerts/AlertsProvider';
import { UserManagement } from '@/components/ui/templates/UserManagement';
import { SecurityComplianceTab } from '@/components/ui/templates/SecurityComplianceTab';
import { SubscriptionManager } from '@/components/ui/templates/SubscriptionManager';

export const SettingsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workflow');
  const { networkData } = useNetworkData();

  const navigationItems = [
    { id: 'workflow', label: 'Fluxos de Trabalho', icon: FileText },
    { id: 'analytics', label: 'Painel Analítico', icon: BarChart2 },
    { id: 'ai_assistant', label: 'IA Generativa', icon: Bot },
    { id: 'notifications', label: 'Alertas e Gatilhos', icon: Bell },
    { id: 'calendar', label: 'Calendário Hospitalar', icon: Calendar },
    { id: 'connections', label: 'Conexões Externas', icon: Link },
    { id: 'user-management', label: 'Gerenciador de Usuários', icon: UserIcon },
    { id: 'security-compliance', label: 'Segurança & Compliance', icon: Shield },
    { id: 'subscription', label: 'Planos & Assinaturas', icon: Shield },
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
                  className={cn(
                      'w-36 text-sm font-medium rounded-full px-2 py-2 transition-all duration-300 ease-in-out relative',
                      'hover:bg-white/20 hover:text-white',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400',
                      isActive 
                          ? 'text-white bg-white/20' 
                          : 'text-white/60'
                  )}
                >
                  <span className="flex items-center justify-center ml-2">
                      {Icon && <Icon className="mr-2 h-6 w-6" />}
                      {item.label}
                  </span>
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

          <div className='border-b border-gray-700'/>

          {/* Implementar o "hospitalId no AlertsProvider" */}
          <TabsContent value="workflow" className="space-y-4">
            <Card className="h-full border-b border-gray-700">
              <CardContent className="p-0 h-full">
                <AlertsProvider>
                  <WorkflowTab />
                </AlertsProvider>
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

          <TabsContent value="user-management" className="space-y-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security-compliance" className="space-y-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <SecurityComplianceTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <SubscriptionManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};