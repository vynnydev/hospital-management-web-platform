import React, { useState } from 'react';
import { Bell, Calendar, FileText, AlertTriangle, User, Save } from 'lucide-react';
import { authService } from '@/services/auth/AuthService';

export const NotificationsContent: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      enabled: true,
      appointments: true,
      prescriptions: true,
      labResults: true,
      system: true
    },
    inApp: {
      enabled: true,
      appointments: true,
      prescriptions: true,
      labResults: true,
      system: true
    },
    push: {
      enabled: false,
      appointments: true,
      prescriptions: false,
      labResults: true,
      system: false
    }
  });

  const isDoctor = authService.isDoctor();
  const isPatient = authService.isPatient();

  const handleSave = () => {
    setIsSaving(true);
    // Simulação de salvamento
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const toggleMainSetting = (channel: 'email' | 'inApp' | 'push') => {
    setNotificationSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        enabled: !prev[channel].enabled
      }
    }));
  };

  const toggleNotificationType = (channel: 'email' | 'inApp' | 'push', type: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: !prev[channel][type as keyof typeof prev[typeof channel]]
      }
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Configurações de Notificações</h3>
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
              Salvar Configurações
            </>
          )}
        </button>
      </div>
      
      {/* Email Notifications */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Email</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receba notificações por email</p>
            </div>
          </div>
          <button
            onClick={() => toggleMainSetting('email')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              notificationSettings.email.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              notificationSettings.email.enabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className={`divide-y divide-gray-200 dark:divide-gray-700 ${!notificationSettings.email.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
              <span className="text-gray-700 dark:text-gray-300">Consultas e Agendamentos</span>
            </div>
            <button
              onClick={() => toggleNotificationType('email', 'appointments')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                notificationSettings.email.appointments ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              disabled={!notificationSettings.email.enabled}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                notificationSettings.email.appointments ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
              <span className="text-gray-700 dark:text-gray-300">Prescrições e Medicamentos</span>
            </div>
            <button
              onClick={() => toggleNotificationType('email', 'prescriptions')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                notificationSettings.email.prescriptions ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              disabled={!notificationSettings.email.enabled}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                notificationSettings.email.prescriptions ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Resultados de Exames</span>
            </div>
            <button
              onClick={() => toggleNotificationType('email', 'labResults')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                notificationSettings.email.labResults ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              disabled={!notificationSettings.email.enabled}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                notificationSettings.email.labResults ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
              <span className="text-gray-700 dark:text-gray-300">Alertas do Sistema</span>
            </div>
            <button
              onClick={() => toggleNotificationType('email', 'system')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                notificationSettings.email.system ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              disabled={!notificationSettings.email.enabled}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                notificationSettings.email.system ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
      
      {/* In-App Notifications */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg mr-3">
              <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Notificações no Aplicativo</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Alertas dentro do sistema</p>
            </div>
          </div>
          <button
            onClick={() => toggleMainSetting('inApp')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              notificationSettings.inApp.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              notificationSettings.inApp.enabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className={`divide-y divide-gray-200 dark:divide-gray-700 ${!notificationSettings.inApp.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
              <span className="text-gray-700 dark:text-gray-300">Consultas e Agendamentos</span>
            </div>
            <button
              onClick={() => toggleNotificationType('inApp', 'appointments')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                notificationSettings.inApp.appointments ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              disabled={!notificationSettings.inApp.enabled}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                notificationSettings.inApp.appointments ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          {/* Repetir os outros tipos de notificação aqui como no email */}
          {/* Similar ao bloco de email acima */}
        </div>
      </div>
      
      {/* Push Notifications */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Notificações Push</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receba alertas no seu dispositivo</p>
            </div>
          </div>
          <button
            onClick={() => toggleMainSetting('push')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              notificationSettings.push.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              notificationSettings.push.enabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className={`divide-y divide-gray-200 dark:divide-gray-700 ${!notificationSettings.push.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Similar ao bloco de email acima */}
        </div>
      </div>
      
      {/* Avisos específicos conforme o tipo de usuário */}
      {isDoctor && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Notificações críticas para médicos</h4>
            <p className="text-sm text-yellow-500 dark:text-yellow-300 mt-1">
              Notificações sobre emergências e resultados críticos de exames serão sempre enviadas, independentemente das configurações acima.
            </p>
          </div>
        </div>
      )}
      
      {isPatient && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start space-x-3">
          <User className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">Dica para pacientes</h4>
            <p className="text-sm text-blue-500 dark:text-blue-300 mt-1">
              Recomendamos manter ativadas as notificações de consultas e resultados de exames para não perder informações importantes sobre seu tratamento.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};