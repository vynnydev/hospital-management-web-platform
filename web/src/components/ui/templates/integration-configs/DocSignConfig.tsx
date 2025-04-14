/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Info } from 'lucide-react';

// Interface para os dados de configuração do DocSign
export interface DocSignConfig {
  apiKey: string;
  webhookURL: string;
  environment: 'sandbox' | 'production';
  autoSign: boolean;
  requirePatientAuth: boolean;
  signerTypes: string[];
  notifySigners: boolean;
  allowReminders: boolean;
  reminderFrequency: number; // dias
  expirationTime: number; // dias
  redirectURL: string;
}

interface DocSignConfigProps {
  config?: Partial<DocSignConfig>;
  onChange: (config: Partial<DocSignConfig>) => void;
}

export const DocSignConfig: React.FC<DocSignConfigProps> = ({
  config = {},
  onChange
}) => {
  // Estado local para gerenciar as configurações
  const [settings, setSettings] = useState<Partial<DocSignConfig>>({
    apiKey: '',
    webhookURL: '',
    environment: 'sandbox',
    autoSign: false,
    requirePatientAuth: true,
    signerTypes: ['doctor', 'patient'],
    notifySigners: true,
    allowReminders: true,
    reminderFrequency: 3,
    expirationTime: 30,
    redirectURL: '',
    ...config
  });

  // Função para atualizar as configurações
  const updateSettings = (updates: Partial<DocSignConfig>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    onChange(newSettings);
  };

  // Função para alternar configurações booleanas
  const toggleSetting = (key: keyof DocSignConfig) => {
    updateSettings({ [key]: !settings[key] } as any);
  };

  // Função para atualizar tipos de assinantes
  const toggleSignerType = (type: string) => {
    const signerTypes = settings.signerTypes || [];
    const newSignerTypes = signerTypes.includes(type)
      ? signerTypes.filter(t => t !== type)
      : [...signerTypes, type];
    
    updateSettings({ signerTypes: newSignerTypes });
  };

  return (
    <div className="">
      {/* Ambiente */}
      <div className="space-y-2">

        
        <div className='grid grid-cols-3 gap-8'>

            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ambiente</label>

                <div className="flex space-x-4">
                <label className="inline-flex items-center">
                    <input
                    type="radio"
                    name="environment"
                    value="sandbox"
                    checked={settings.environment === 'sandbox'}
                    onChange={() => updateSettings({ environment: 'sandbox' })}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                    autoComplete="off"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Sandbox</span>
                </label>
                <label className="inline-flex items-center">
                    <input
                    type="radio"
                    name="environment"
                    value="production"
                    checked={settings.environment === 'production'}
                    onChange={() => updateSettings({ environment: 'production' })}
                    className="h-4 w-4 text-blue-600 dark:text-blue-500"
                    autoComplete="off"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Produção</span>
                </label>
                </div>

                {/* API Key */}
                <div className="space-y-2 pt-4">
                    <label htmlFor="docsign-api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Chave de API
                    </label>
                    <div className="mt-1">
                    <input
                        id="docsign-api-key"
                        type="password"
                        value={settings.apiKey}
                        onChange={(e) => updateSettings({ apiKey: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                        placeholder="Insira sua chave de API"
                        autoComplete="new-password" // Truque para evitar preenchimento automático
                    />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                    Encontre sua chave de API no painel de desenvolvedor do DocSign
                    </p>
                </div>

                {/* Webhook URL */}
                <div className="space-y-2 pt-4">
                    <label htmlFor="docsign-webhook" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    URL do Webhook
                    </label>
                    <div className="mt-1">
                    <input
                        id="docsign-webhook"
                        type="text"
                        value={settings.webhookURL}
                        onChange={(e) => updateSettings({ webhookURL: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                        placeholder="https://seu-dominio.com/webhook/docsign"
                        autoComplete="off"
                    />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                    URL para receber notificações quando documentos forem assinados
                    </p>
                </div>

                <div className="space-y-2 pt-4">
                    <label htmlFor="docsign-redirect" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    URL de Redirecionamento
                    </label>
                    <div className="mt-1">
                    <input
                        id="docsign-redirect"
                        type="text"
                        value={settings.redirectURL}
                        onChange={(e) => updateSettings({ redirectURL: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                        placeholder="https://seu-dominio.com/assinatura/concluido"
                        autoComplete="off"
                    />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                    URL para onde o usuário será redirecionado após assinar
                    </p>
                </div>
            </div>

            <div className="flex flex-col">
                {/* Configurações de Assinatura */}
                <div className="pt-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Configurações de Assinatura</h3>
                    
                    <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Enviar automaticamente para assinatura</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Envia documentos para assinatura automaticamente após geração
                        </p>
                        </div>
                        <button
                        type="button"
                        onClick={() => toggleSetting('autoSign')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            settings.autoSign ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            settings.autoSign ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Requer autenticação de pacientes</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Requer verificação de identidade do paciente para assinatura
                        </p>
                        </div>
                        <button
                        type="button"
                        onClick={() => toggleSetting('requirePatientAuth')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            settings.requirePatientAuth ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            settings.requirePatientAuth ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Notificar assinantes</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Envia email quando um documento estiver pronto para assinatura
                        </p>
                        </div>
                        <button
                        type="button"
                        onClick={() => toggleSetting('notifySigners')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            settings.notifySigners ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            settings.notifySigners ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Permitir lembretes</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Envia lembretes para documentos pendentes de assinatura
                        </p>
                        </div>
                        <button
                        type="button"
                        onClick={() => toggleSetting('allowReminders')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            settings.allowReminders ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            settings.allowReminders ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                        </button>
                    </div>

                    {settings.allowReminders && (
                        <div className="flex items-center justify-between pl-6 border-l-2 border-blue-200 dark:border-blue-800">
                        <div>
                            <span className="text-gray-700 dark:text-gray-300">Frequência de lembretes</span>
                        </div>
                        <select
                            value={settings.reminderFrequency}
                            onChange={(e) => updateSettings({ reminderFrequency: parseInt(e.target.value) })}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1 text-gray-900 dark:text-white"
                        >
                            <option value="1">Diariamente</option>
                            <option value="3">A cada 3 dias</option>
                            <option value="7">Semanalmente</option>
                            <option value="14">A cada 2 semanas</option>
                        </select>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Tempo de expiração</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Período após o qual o link de assinatura expira
                        </p>
                        </div>
                        <select
                        value={settings.expirationTime}
                        onChange={(e) => updateSettings({ expirationTime: parseInt(e.target.value) })}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1 text-gray-900 dark:text-white"
                        >
                        <option value="7">7 dias</option>
                        <option value="14">14 dias</option>
                        <option value="30">30 dias</option>
                        <option value="60">60 dias</option>
                        <option value="90">90 dias</option>
                        </select>
                    </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col">      
                {/* Tipos de Assinantes */}
                <div className="pt-4">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Tipos de Assinantes</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Selecione quais funções podem assinar documentos
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                            <input
                            type="checkbox"
                            checked={settings.signerTypes?.includes('doctor')}
                            onChange={() => toggleSignerType('doctor')}
                            className="h-4 w-4 text-blue-600 dark:text-blue-500 rounded"
                            />
                            <div>
                            <span className="block font-medium text-gray-700 dark:text-gray-300">Médico</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Assinatura principal</span>
                            </div>
                        </label>
                        
                        <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                            <input
                            type="checkbox"
                            checked={settings.signerTypes?.includes('patient')}
                            onChange={() => toggleSignerType('patient')}
                            className="h-4 w-4 text-blue-600 dark:text-blue-500 rounded"
                            />
                            <div>
                            <span className="block font-medium text-gray-700 dark:text-gray-300">Paciente</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Consentimento</span>
                            </div>
                        </label>
                        
                        <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                            <input
                            type="checkbox"
                            checked={settings.signerTypes?.includes('nurse')}
                            onChange={() => toggleSignerType('nurse')}
                            className="h-4 w-4 text-blue-600 dark:text-blue-500 rounded"
                            />
                            <div>
                            <span className="block font-medium text-gray-700 dark:text-gray-300">Enfermeiro</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Testemunha</span>
                            </div>
                        </label>
                        
                        <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                            <input
                            type="checkbox"
                            checked={settings.signerTypes?.includes('administrator')}
                            onChange={() => toggleSignerType('administrator')}
                            className="h-4 w-4 text-blue-600 dark:text-blue-500 rounded"
                            />
                            <div>
                            <span className="block font-medium text-gray-700 dark:text-gray-300">Administrador</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Aprovações</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Aviso Legal */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-start mt-6">
                    <Info className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    <p className="font-medium mb-1">Importante</p>
                    <p>
                        As configurações do DocSign afetam todo o fluxo de assinaturas digitais do hospital. 
                        Certifique-se de que as configurações estão corretas antes de salvar.
                    </p>
                    </div>
                </div>
            </div>

        </div>
      </div>



    </div>
  );
};