/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Save, AlertTriangle, RefreshCw, Bell, Lock, Users, Zap, Activity } from 'lucide-react';
import { IWorkflowSettings } from '@/types/workflow/workflow-types';
import { authService } from '@/services/general/auth/AuthService';

interface WorkflowSettingsProps {
  settings: IWorkflowSettings;
  isLoading: boolean;
  onSave: (settings: IWorkflowSettings) => Promise<void>;
}

export const WorkflowSettings: React.FC<WorkflowSettingsProps> = ({ 
  settings: initialSettings,
  isLoading,
  onSave
}) => {
  const [settings, setSettings] = useState<IWorkflowSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'roles' | 'departments' | 'integrations'>('general');
  
  const user = authService.getCurrentUser();
  const isAdmin = authService.isAdministrator();

  // Função para atualizar configurações gerais
  const handleGeneralSettingChange = (key: keyof IWorkflowSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Função para salvar as configurações
  const handleSaveSettings = async () => {
    if (!isAdmin) return;
    
    setIsSaving(true);
    try {
      await onSave(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Aviso de sucesso */}
      {saveSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-lg flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Configurações salvas com sucesso!</p>
          </div>
        </div>
      )}

      {/* Aviso de permissão */}
      {!isAdmin && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 p-4 rounded-lg flex items-center mb-6">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <p className="text-sm">
            Você está em modo de visualização. Apenas administradores podem modificar estas configurações.
          </p>
        </div>
      )}

      {/* Navegação de Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Activity className="inline-block w-4 h-4 mr-2" />
            Geral
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Bell className="inline-block w-4 h-4 mr-2" />
            Notificações
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'roles'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Users className="inline-block w-4 h-4 mr-2" />
            Permissões
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'departments'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Zap className="inline-block w-4 h-4 mr-2" />
            Departamentos
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'integrations'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Lock className="inline-block w-4 h-4 mr-2" />
            Integrações
          </button>
        </nav>
      </div>

      {/* Conteúdo da tab selecionada */}
      <div className="mt-6">
        {/* Tab Geral */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Configurações de Workflow
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Configure opções gerais para todos os fluxos de trabalho
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Auto-atribuir a funcionários disponíveis
                      </label>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Atribui automaticamente tarefas a funcionários disponíveis
                      </p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <button
                        type="button"
                        onClick={() => handleGeneralSettingChange('autoAssignToAvailableStaff', !settings.autoAssignToAvailableStaff)}
                        className={`${
                          settings.autoAssignToAvailableStaff ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}
                        disabled={!isAdmin}
                      >
                        <span
                          aria-hidden="true"
                          className={`${
                            settings.autoAssignToAvailableStaff ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
                        ></span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Notificar quebras de SLA
                      </label>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Envia notificações quando prazos são ultrapassados
                      </p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <button
                        type="button"
                        onClick={() => handleGeneralSettingChange('notifyOnSLABreaches', !settings.notifyOnSLABreaches)}
                        className={`${
                          settings.notifyOnSLABreaches ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}
                        disabled={!isAdmin}
                      >
                        <span
                          aria-hidden="true"
                          className={`${
                            settings.notifyOnSLABreaches ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
                        ></span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Escalonar tarefas atrasadas
                      </label>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Encaminha tarefas atrasadas para níveis superiores
                      </p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <button
                        type="button"
                        onClick={() => handleGeneralSettingChange('escalateDelayedTasks', !settings.escalateDelayedTasks)}
                        className={`${
                          settings.escalateDelayedTasks ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}
                        disabled={!isAdmin}
                      >
                        <span
                          aria-hidden="true"
                          className={`${
                            settings.escalateDelayedTasks ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
                        ></span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Requer aprovação para exceções
                      </label>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Exige aprovação de supervisor para fluxos de exceção
                      </p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <button
                        type="button"
                        onClick={() => handleGeneralSettingChange('requireApprovalForExceptions', !settings.requireApprovalForExceptions)}
                        className={`${
                          settings.requireApprovalForExceptions ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}
                        disabled={!isAdmin}
                      >
                        <span
                          aria-hidden="true"
                          className={`${
                            settings.requireApprovalForExceptions ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
                        ></span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Habilitar recomendações de IA
                      </label>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Utiliza IA para sugerir otimizações de fluxo
                      </p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <button
                        type="button"
                        onClick={() => handleGeneralSettingChange('enableAIRecommendations', !settings.enableAIRecommendations)}
                        className={`${
                          settings.enableAIRecommendations ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}
                        disabled={!isAdmin}
                      >
                        <span
                          aria-hidden="true"
                          className={`${
                            settings.enableAIRecommendations ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
                        ></span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="defaultPriority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Prioridade padrão
                      </label>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Prioridade utilizada quando não especificada
                      </p>
                    </div>
                    <div className="ml-4">
                      <select
                        id="defaultPriority"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        value={settings.defaultPriority}
                        onChange={(e) => handleGeneralSettingChange('defaultPriority', e.target.value)}
                        disabled={!isAdmin}
                      >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                        <option value="critical">Crítica</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="defaultTimeUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Unidade de tempo padrão
                      </label>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Unidade utilizada para contagem de SLAs
                      </p>
                    </div>
                    <div className="ml-4">
                      <select
                        id="defaultTimeUnit"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        value={settings.defaultTimeUnit}
                        onChange={(e) => handleGeneralSettingChange('defaultTimeUnit', e.target.value)}
                        disabled={!isAdmin}
                      >
                        <option value="minute">Minutos</option>
                        <option value="hour">Horas</option>
                        <option value="day">Dias</option>
                        <option value="week">Semanas</option>
                        <option value="month">Meses</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab de Notificações - Simplificado para este exemplo */}
        {activeTab === 'notifications' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg flex items-center">
            <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-300">Configurações de Notificações</h3>
              <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                Esta funcionalidade será implementada em breve. Fique atento às atualizações.
              </p>
            </div>
          </div>
        )}

        {/* Demais tabs também simplificadas */}
        {(activeTab === 'roles' || activeTab === 'departments' || activeTab === 'integrations') && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg flex items-center">
            <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-300">
                Configurações de {activeTab === 'roles' ? 'Permissões' : activeTab === 'departments' ? 'Departamentos' : 'Integrações'}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                Esta funcionalidade será implementada em breve. Fique atento às atualizações.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botão de salvar */}
      {isAdmin && (
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                <span>Salvar Configurações</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};