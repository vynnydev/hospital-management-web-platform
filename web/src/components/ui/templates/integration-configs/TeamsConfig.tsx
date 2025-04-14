/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { MessageSquare, Save, Check, AlertTriangle } from 'lucide-react';
import { authService } from '@/services/auth/AuthService';

// Importar componentes auxiliares
import { TeamsAuthSection } from './microsoft-teams/TeamsAuthSection';
import { TeamsFeaturesTab } from './microsoft-teams/TeamsFeaturesTab';
import { TeamsWebhooksTab } from './microsoft-teams/TeamsWebhooksTab';
import { TeamsUsersTab } from './microsoft-teams/TeamsUsersTab';
import { TeamsNotificationSettings } from './microsoft-teams/TeamsNotificationSettings';

interface TeamsConfigProps {
  isActive: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const TeamsConfig: React.FC<TeamsConfigProps> = ({ 
  isActive, 
  onToggle, 
  onClose 
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'features' | 'webhooks' | 'users'>('features');
  
  const [configData, setConfigData] = useState({
    // Credenciais
    tenantId: '',
    clientId: '',
    clientSecret: '',
    redirectUri: window.location.origin + '/api/auth/callback/teams',
    
    // Webhooks
    notificationsWebhook: '',
    appointmentsWebhook: '',
    alertsWebhook: '',
    
    // Recursos selecionados
    features: {
      notifications: true,
      chat: true,
      meetings: true,
      calendar: true,
      documents: false,
      tasks: false
    },
    
    // Configurações de notificações
    notifyOnPatientAdmission: true,
    notifyOnDischargePlan: true,
    notifyOnTestResults: true,
    notifyOnMedicationChange: false,
    
    // Permissões de acesso do Teams
    allowTeamsAccess: true,
    limitTeamsAccessToWorkHours: false,
    teamsSyncFrequency: 'realtime',
    teamsLogLevel: 'error',
    enableTeamsSSO: true
  });

  const isAdmin = authService.isAdministrator();
  const isDoctor = authService.isDoctor();

  const handleChange = (field: string, value: any) => {
    const fields = field.split('.');
    
    if (fields.length === 1) {
      setConfigData(prev => ({
        ...prev,
        [field]: value
      }));
    } else if (fields.length === 2) {
      const [parent, child] = fields;
      setConfigData(prev => {
        const parentKey = parent as keyof typeof prev;
        const parentObj = typeof prev[parentKey] === 'object' && prev[parentKey] !== null 
          ? prev[parentKey] 
          : {};
        
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: value
          }
        };
      });
    }
  };

  const toggleFeature = (feature: string) => {
    setConfigData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature as keyof typeof prev.features]
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulação de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em um ambiente real, faria uma chamada à API
      console.log('Configurações do Microsoft Teams salvas:', configData);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Preparando objetos para passar aos componentes filhos
  const authCredentials = {
    tenantId: configData.tenantId,
    clientId: configData.clientId,
    clientSecret: configData.clientSecret,
    redirectUri: configData.redirectUri
  };

  const webhooks = {
    notificationsWebhook: configData.notificationsWebhook,
    appointmentsWebhook: configData.appointmentsWebhook,
    alertsWebhook: configData.alertsWebhook
  };

  const userSettings = {
    allowTeamsAccess: configData.allowTeamsAccess,
    limitTeamsAccessToWorkHours: configData.limitTeamsAccessToWorkHours,
    teamsSyncFrequency: configData.teamsSyncFrequency,
    teamsLogLevel: configData.teamsLogLevel,
    enableTeamsSSO: configData.enableTeamsSSO
  };

  const notificationSettings = {
    notifyOnPatientAdmission: configData.notifyOnPatientAdmission,
    notifyOnDischargePlan: configData.notifyOnDischargePlan,
    notifyOnTestResults: configData.notifyOnTestResults,
    notifyOnMedicationChange: configData.notifyOnMedicationChange
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden max-w-4xl w-full mx-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.25 17.25H15.75C16.1642 17.25 16.5 17.5858 16.5 18V21.5C16.5 21.7761 16.2761 22 16 22H11C10.7239 22 10.5 21.7761 10.5 21.5V15.5C10.5 15.2239 10.7239 15 11 15H13.25C12.4216 15 11.75 15.6716 11.75 16.5C11.75 16.9142 12.0858 17.25 12.5 17.25H12.25Z" />
              <path d="M17.25 1H19.75C20.9926 1 22 2.00736 22 3.25V12.75C22 13.9926 20.9926 15 19.75 15H17.25V19.25C17.25 20.5761 16.1928 21.6551 14.8813 21.6551C14.1091 21.6551 13.374 21.3089 12.8799 20.7111L6.0028 12.8344C5.38221 12.0795 5.00076 11.1465 5 10.1907V3.25C5 2.00736 6.00736 1 7.25 1H17.25Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Microsoft Teams</h2>
            <p className="text-sm text-white/80">Integrações com equipes e comunicação</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggle}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isActive 
                ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50' 
                : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
            }`}
          >
            {isActive ? 'Desativar' : 'Ativar'}
          </button>
          <button
            onClick={onClose}
            className="ml-2 px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20"
          >
            Fechar
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-4 flex items-center">
          <Check className="w-5 h-5 mr-2" />
          <span>Configurações salvas com sucesso!</span>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Autenticação Microsoft */}
        <TeamsAuthSection 
          credentials={authCredentials}
          onCredentialChange={handleChange}
        />

        {/* Tabs de configuração */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                activeTab === 'features' 
                  ? 'bg-white dark:bg-gray-800 border-t border-l border-r border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Recursos
            </button>
            <button
              onClick={() => setActiveTab('webhooks')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                activeTab === 'webhooks' 
                  ? 'bg-white dark:bg-gray-800 border-t border-l border-r border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Webhooks
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                activeTab === 'users' 
                  ? 'bg-white dark:bg-gray-800 border-t border-l border-r border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Usuários & Acesso
            </button>
          </div>

          <div className="py-6">
            {activeTab === 'features' && (
              <TeamsFeaturesTab 
                features={configData.features}
                toggleFeature={toggleFeature}
              />
            )}

            {activeTab === 'webhooks' && (
              <TeamsWebhooksTab 
                webhooks={webhooks}
                onWebhookChange={handleChange}
              />
            )}

            {activeTab === 'users' && (
              <TeamsUsersTab 
                settings={userSettings}
                onSettingChange={handleChange}
              />
            )}
          </div>
        </div>

        {/* Configurações de Notificações */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <TeamsNotificationSettings
            settings={notificationSettings}
            onSettingChange={handleChange}
          />
        </div>

        {/* Avisos Específicos por Perfil */}
        {isDoctor && (
          <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Informação para médicos</h4>
              <p className="text-sm text-yellow-500 dark:text-yellow-300 mt-1">
                Como médico, você receberá notificações no Microsoft Teams apenas para seus pacientes e equipe,
                respeitando a confidencialidade dos dados. Atualizações críticas serão enviadas em tempo real.
              </p>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">Dica para administradores</h4>
              <p className="text-sm text-blue-500 dark:text-blue-300 mt-1">
                A integração com o Microsoft Teams requer configurações adicionais no Azure AD. 
                Você precisará criar um aplicativo registrado com as permissões corretas no portal Azure 
                e configurar redirecionamento OAuth para autenticação segura.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex justify-end items-center border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2 inline-block" />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};