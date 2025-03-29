import React, { useState, useEffect } from 'react';
import { TabsContent } from '@/components/ui/organisms/tabs';
import { AlertEditor } from './AlertEditor';
import { AlertHistory } from './AlertHistory';
import { AlertTemplates } from './AlertTemplates';
import { IAlertTemplate, IAlert } from '@/types/alert-types';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useAlerts } from '@/services/hooks/alerts/useAlerts';
import { useNotificationSettings } from '@/services/hooks/notification-settings/useNotificationSettings';
import { AlertsNotifications } from '@/components/ui/templates/alerts/AlertsNotifications';
import { useAlertTemplates } from '@/services/hooks/alerts/useAlertTemplates';
import { AlertsProvider } from '@/components/ui/templates/providers/alerts/AlertsProvider';

export const NotificationsTab: React.FC = () => {
  // Estados
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<IAlertTemplate | null>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<IAlert | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Hooks customizados
  const { networkData, loading: loadingNetwork } = useNetworkData();
  const { 
    alerts, 
    loading: loadingAlerts, 
    error: alertsError,
    unreadCount,
    fetchAlerts,
    markAsRead,
    updateAlertStatus,
    testAlert,
    createAlert,
    dismissAlert
  } = useAlerts(selectedHospitalId);
  
  const {
    templates,
    loading: loadingTemplates,
    error: templatesError,
    fetchTemplateById,
    createTemplate,
    updateTemplate
  } = useAlertTemplates();
  
  const {
    settings,
    loading: loadingSettings,
    updateSettings
  } = useNotificationSettings();
  
  // Selecionar hospital padrão quando os dados de rede forem carregados
  useEffect(() => {
    if (networkData && networkData.hospitals && networkData.hospitals.length > 0 && !selectedHospitalId) {
      setSelectedHospitalId(networkData.hospitals[0].id);
    }
  }, [networkData, selectedHospitalId]);
  
  // Efeito para carregar os detalhes de um template quando selecionado
  useEffect(() => {
    const loadTemplateDetails = async () => {
      if (selectedTemplateId) {
        const template = await fetchTemplateById(selectedTemplateId);
        if (template) {
          setSelectedTemplate(template);
          setIsEditing(true);
          setIsCreatingTemplate(false);
        }
      } else {
        setSelectedTemplate(null);
      }
    };
    
    loadTemplateDetails();
  }, [selectedTemplateId, fetchTemplateById]);
  
  // Efeito para carregar os detalhes de um alerta quando selecionado
  useEffect(() => {
    if (selectedAlertId) {
      const alert = alerts.find(a => a.id === selectedAlertId) || null;
      setSelectedAlert(alert);
      if (alert && !alert.read) {
        markAsRead(alert.id);
      }
    } else {
      setSelectedAlert(null);
    }
  }, [selectedAlertId, alerts, markAsRead]);
  
  // Handlers
  const handleTestAlert = async () => {
    if (selectedTemplate) {
      // Usando o template selecionado para testar o alerta
      await testAlert(selectedTemplate.id);
    }
  };
  
  const handleDisableAlert = () => {
    // Esta função seria para desativar um alerta no sistema
    console.log('Desativando alerta');
  };
  
  const handleCancelEdit = () => {
    setSelectedTemplateId(null);
    setSelectedTemplate(null);
    setIsEditing(false);
    setIsCreatingTemplate(false);
  };
  
  const handleSaveAlert = async (alertData: any) => {
    if (isCreatingTemplate) {
      // Criando um novo template
      const newTemplate = await createTemplate(alertData);
      if (newTemplate) {
        setSelectedTemplateId(newTemplate.id);
        setIsCreatingTemplate(false);
        setIsEditing(true);
      }
    } else if (isEditing && selectedTemplateId) {
      // Atualizando um template existente
      await updateTemplate(selectedTemplateId, alertData);
    } else {
      // Criando um alerta direto
      await createAlert({
        title: alertData.name || 'Novo Alerta',
        message: alertData.message,
        type: alertData.type,
        priority: alertData.priority,
        actionRequired: true,
        hospitalId: selectedHospitalId
      });
    }
  };
  
  const handleViewAlertDetails = (alertId: string) => {
    setSelectedAlertId(alertId);
    // Marcar como lido quando visualizado
    const alert = alerts.find(a => a.id === alertId);
    if (alert && !alert.read) {
      markAsRead(alertId);
    }
  };
  
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setIsEditing(true);
    setIsCreatingTemplate(false);
  };
  
  const handleCreateTemplate = () => {
    setSelectedTemplateId(null);
    setSelectedTemplate(null);
    setIsCreatingTemplate(true);
    setIsEditing(false);
  };
  
  const handleUpdateNotificationSettings = async (settings: any) => {
    await updateSettings(settings);
  };
  
  // Verificar se está carregando
  const isLoading = loadingNetwork || loadingAlerts || loadingTemplates || loadingSettings;
  
  // Verificar se há erros
  const hasErrors = alertsError || templatesError;
  
  if (isLoading) {
    return (
      <TabsContent value="notifications" className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando sistema de notificações...</p>
        </div>
      </TabsContent>
    );
  }
  
  if (hasErrors) {
    return (
      <TabsContent value="notifications" className="flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Erro ao carregar os dados</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {alertsError || templatesError || 'Não foi possível carregar os dados de notificações.'}
          </p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => {
              fetchAlerts();
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </TabsContent>
    );
  }
  
  return (
    <TabsContent value="notifications" className="space-y-4">
      {/* Seletor de Hospital (se houver mais de um) */}
      {networkData && networkData.hospitals && networkData.hospitals.length > 1 && (
        <div className="flex items-center mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <span className="text-sm font-medium mr-3">Hospital:</span>
          <select 
            className="border border-gray-300 dark:border-gray-600 rounded-md text-sm px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
          >
            {networkData.hospitals.map(hospital => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
              </option>
            ))}
          </select>
          
          <div className="ml-auto flex items-center">
            <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full text-xs font-medium">
              {unreadCount.highPriority} Alertas Críticos
            </span>
            <span className="ml-3 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-medium">
              {unreadCount.total} Não Lidos
            </span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Painel principal de alertas */}
        <div className="lg:col-span-2">
          {isEditing || isCreatingTemplate ? (
            <AlertEditor 
              template={selectedTemplate}
              isCreating={isCreatingTemplate}
              onTest={handleTestAlert}
              onDisable={handleDisableAlert}
              onCancel={handleCancelEdit}
              onSave={handleSaveAlert}
            />
          ) : (
            <>
              <AlertsProvider hospitalId={selectedHospitalId || ''} checkInterval={30000}>                
                <AlertsNotifications 
                  hospitalId={selectedHospitalId} 
                />
              </AlertsProvider>
              
              <AlertHistory 
                alerts={alerts.map(alert => ({
                  id: alert.id,
                  title: alert.title,
                  time: new Date(alert.timestamp).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }),
                  date: new Date(alert.timestamp).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  }),
                  type: alert.priority === 'high' || alert.priority === 'critical' 
                    ? 'critical' 
                    : alert.priority === 'medium' 
                      ? 'warning' 
                      : 'info'
                }))}
                onViewDetails={handleViewAlertDetails}
              />
            </>
          )}
        </div>
        
        {/* Painel Lateral para Templates e Configurações */}
        <AlertTemplates 
          templates={templates}
          onSelectTemplate={handleSelectTemplate}
          onCreateTemplate={handleCreateTemplate}
          showConfiguration={true}
          settings={settings || undefined}
          onUpdateSettings={handleUpdateNotificationSettings}
        />
      </div>
    </TabsContent>
  );
};