import React, { useState } from 'react';
import { Save, Info } from 'lucide-react';
import { authService } from '@/services/auth/AuthService';

export const PreferencesContent: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    language: 'pt_BR',
    dateFormat: 'dd/mm/yyyy',
    timezone: 'America/Sao_Paulo',
    startPage: 'dashboard',
    confirmCriticalActions: true,
    autoSaveForm: true,
    emailNotifications: true,
    pushNotifications: true,
    sessionTimeout: 30,
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulação de salvamento
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleChange = (field: string, value: string | boolean | number) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Preferências do Sistema</h3>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Preferências
            </>
          )}
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="flex items-center justify-between p-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Idioma do Sistema</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Escolha o idioma padrão da interface</p>
              </div>
              <select 
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2"
                value={preferences.language}
                onChange={(e) => handleChange('language', e.target.value)}
              >
                <option value="pt_BR">Português (Brasil)</option>
                <option value="en_US">English (US)</option>
                <option value="es_ES">Español</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Formato de Data</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Define como as datas são exibidas</p>
              </div>
              <select 
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2"
                value={preferences.dateFormat}
                onChange={(e) => handleChange('dateFormat', e.target.value)}
              >
                <option value="dd/mm/yyyy">DD/MM/AAAA</option>
                <option value="mm/dd/yyyy">MM/DD/AAAA</option>
                <option value="yyyy-mm-dd">AAAA-MM-DD</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Fuso Horário</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Define a referência de horário do sistema</p>
              </div>
              <select 
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2"
                value={preferences.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
              >
                <option value="America/Sao_Paulo">América/São Paulo (GMT-3)</option>
                <option value="America/New_York">América/New York (GMT-5)</option>
                <option value="Europe/London">Europa/Londres (GMT+0)</option>
                <option value="Asia/Tokyo">Ásia/Tóquio (GMT+9)</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Página Inicial</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Primeira tela após o login</p>
              </div>
              <select 
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2"
                value={preferences.startPage}
                onChange={(e) => handleChange('startPage', e.target.value)}
              >
                <option value="dashboard">Dashboard</option>
                <option value="patients">Pacientes</option>
                <option value="appointments">Consultas</option>
                <option value="reports">Relatórios</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white">Comportamento do Sistema</h4>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="flex items-center justify-between p-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Confirmações em Ações Críticas</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Solicitar confirmação antes de ações importantes</p>
              </div>
              <button 
                onClick={() => handleChange('confirmCriticalActions', !preferences.confirmCriticalActions)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  preferences.confirmCriticalActions ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  preferences.confirmCriticalActions ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Autosalvar Formulários</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Salvar automaticamente rascunhos de formulários</p>
              </div>
              <button 
                onClick={() => handleChange('autoSaveForm', !preferences.autoSaveForm)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  preferences.autoSaveForm ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  preferences.autoSaveForm ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Notificações por Email</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receber alertas e lembretes por email</p>
              </div>
              <button 
                onClick={() => handleChange('emailNotifications', !preferences.emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Tempo Limite da Sessão</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tempo de inatividade antes do logout automático (minutos)</p>
              </div>
              <select 
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2"
                value={preferences.sessionTimeout.toString()}
                onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
              >
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
                <option value="120">2 horas</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Conteúdo específico para médicos */}
        {authService.isDoctor() && (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white">Preferências Médicas</h4>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="flex items-center justify-between p-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Ordem das Anotações Clínicas</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ordem de exibição das anotações no prontuário</p>
                </div>
                <select className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2">
                  <option value="newest">Mais recentes primeiro</option>
                  <option value="oldest">Mais antigas primeiro</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Lista de Medicamentos</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Organização da lista de medicamentos</p>
                </div>
                <select className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2">
                  <option value="alphabetical">Ordem alfabética</option>
                  <option value="recent">Recentemente prescritos</option>
                  <option value="frequency">Frequência de uso</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">Sincronização de Preferências</h4>
            <p className="text-sm text-blue-500 dark:text-blue-300 mt-1">
              Suas preferências são automaticamente sincronizadas em todos os dispositivos onde você acessa o sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};