import React, { useState } from 'react';
import { Lock, Shield, KeyRound, Smartphone, AlertTriangle, Save } from 'lucide-react';
import { authService } from '@/services/general/auth/AuthService';

export const SecurityContent: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30,
    requirePasswordChange: 90, // dias
    allowMultipleDevices: true
  });
  
  const isAdmin = authService.isAdministrator();
  const isDoctor = authService.isDoctor();

  const handleChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSetting = (setting: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const updateSetting = (setting: string, value: number) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulação de salvamento
    setTimeout(() => {
      setIsSaving(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }, 1000);
  };

  const hasPasswordError = () => {
    if (!passwordData.newPassword) return false;
    if (passwordData.newPassword.length < 8) return true;
    if (passwordData.newPassword !== passwordData.confirmPassword) return true;
    return false;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Segurança & Acesso</h3>
        <button
          onClick={handleSave}
          disabled={isSaving || hasPasswordError()}
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
      
      {/* Alterar Senha */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Alterar Senha
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Senha forte ajuda a proteger sua conta
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6 space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Senha Atual
            </label>
            <input
              type="password"
              id="current-password"
              value={passwordData.currentPassword}
              onChange={(e) => handleChange('currentPassword', e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nova Senha
            </label>
            <input
              type="password"
              id="new-password"
              value={passwordData.newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            />
            {passwordData.newPassword && passwordData.newPassword.length < 8 && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                A senha deve ter pelo menos 8 caracteres
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirm-password"
              value={passwordData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            />
            {passwordData.newPassword && 
             passwordData.confirmPassword && 
             passwordData.newPassword !== passwordData.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                As senhas não coincidem
              </p>
            )}
          </div>
          
          <div className="mt-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Força da Senha</h4>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              {passwordData.newPassword && (
                <div 
                  className={`h-2.5 rounded-full ${
                    passwordData.newPassword.length < 8 ? 'bg-red-500' :
                    passwordData.newPassword.length < 12 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, (passwordData.newPassword.length / 16) * 100)}%` }}
                ></div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Use letras maiúsculas, minúsculas, números e caracteres especiais
            </p>
          </div>
        </div>
      </div>
      
      {/* Configurações de Segurança */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Configurações de Segurança
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Configurações adicionais para proteger sua conta
          </p>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="flex items-center justify-between p-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Autenticação de Dois Fatores</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Adicione uma camada extra de segurança à sua conta
              </p>
            </div>
            <button
              onClick={() => toggleSetting('twoFactorEnabled')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                securitySettings.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                securitySettings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Notificações de Login</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ser notificado quando ocorrer um login em um novo dispositivo
              </p>
            </div>
            <button
              onClick={() => toggleSetting('loginNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                securitySettings.loginNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                securitySettings.loginNotifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Permitir Múltiplos Dispositivos</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Logar em vários dispositivos simultaneamente
              </p>
            </div>
            <button
              onClick={() => toggleSetting('allowMultipleDevices')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                securitySettings.allowMultipleDevices ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                securitySettings.allowMultipleDevices ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Tempo Limite da Sessão</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tempo de inatividade antes do logout automático
              </p>
            </div>
            <select
              value={securitySettings.sessionTimeout.toString()}
              onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2"
            >
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="60">60 minutos</option>
              <option value="120">2 horas</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Alteração Periódica de Senha</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Solicitar alteração de senha a cada período
              </p>
            </div>
            <select
              value={securitySettings.requirePasswordChange.toString()}
              onChange={(e) => updateSetting('requirePasswordChange', parseInt(e.target.value))}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2"
            >
              <option value="30">30 dias</option>
              <option value="60">60 dias</option>
              <option value="90">90 dias</option>
              <option value="180">6 meses</option>
              <option value="365">1 ano</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Dispositivos Conectados */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Dispositivos Conectados
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Dispositivos onde sua conta está logada
          </p>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Dispositivo atual */}
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Computador Windows 10 - Chrome
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="mr-2">Local:</span>
                      <span>São Paulo, Brasil</span>
                    </div>
                    <div className="mx-2 text-gray-300 dark:text-gray-600">•</div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="mr-2">Último acesso:</span>
                      <span>Agora (dispositivo atual)</span>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center">
                    <span className="flex h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-xs text-green-600 dark:text-green-400">Sessão atual</span>
                  </div>
                </div>
              </div>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Terminar Sessão
              </button>
            </div>
          </div>
          
          {/* Outro dispositivo */}
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    iPhone 13 - Safari
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="mr-2">Local:</span>
                      <span>São Paulo, Brasil</span>
                    </div>
                    <div className="mx-2 text-gray-300 dark:text-gray-600">•</div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="mr-2">Último acesso:</span>
                      <span>Hoje, 14:32</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="text-sm text-red-600 dark:text-red-400 hover:underline font-medium">
                Remover
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Avisos específicos para médicos */}
      {isDoctor && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Restrições de segurança para dados médicos</h4>
            <p className="text-sm text-yellow-500 dark:text-yellow-300 mt-1">
              Como profissional médico, seu acesso aos dados de pacientes é monitorado e requer medidas adicionais de segurança para conformidade com regulamentações de saúde.
            </p>
          </div>
        </div>
      )}
      
      {/* Avisos para administradores */}
      {isAdmin && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start space-x-3">
          <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">Acesso administrativo</h4>
            <p className="text-sm text-blue-500 dark:text-blue-300 mt-1">
              Como administrador, você tem acesso elevado ao sistema. Recomendamos o uso de autenticação de dois fatores e senhas fortes para garantir a segurança do sistema.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};