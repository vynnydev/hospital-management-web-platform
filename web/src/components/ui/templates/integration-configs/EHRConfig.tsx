/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Info, BookOpen, Lock, AlertTriangle } from 'lucide-react';
import { EHRFieldMapping, DataMapping } from './ehr/EHRFieldMapping';
import { EHRExportTypes, ExportTypes } from './ehr/EHRExportTypes';

// Interface para os dados de configuração do EHR Connect
export interface EHRConfig {
  apiEndpoint: string;
  apiKey: string;
  apiSecret: string;
  useOAuth: boolean;
  oauthClientId: string;
  oauthClientSecret: string;
  oauthRedirectUri: string;
  dataMapping: DataMapping;
  exportTypes: ExportTypes;
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'manual';
  syncDirection: 'import' | 'export' | 'bidirectional';
  enablePatientPortal: boolean;
  patientPortalUrl: string;
  ehrSystem: 'epic' | 'cerner' | 'allscripts' | 'nextgen' | 'eclinicalworks' | 'other';
  customEhrSystem: string;
  apiVersion: string;
  fhirEnabled: boolean;
  fhirVersion: 'dstu2' | 'stu3' | 'r4';
  enableAudit: boolean;
  debugMode: boolean;
}

// Interface para as props do componente
interface EHRConfigProps {
  config?: Partial<EHRConfig>;
  onChange: (config: Partial<EHRConfig>) => void;
}

export const EHRConfig: React.FC<EHRConfigProps> = ({
  config = {},
  onChange
}) => {
  // Estado local para gerenciar as configurações
  const [settings, setSettings] = useState<Partial<EHRConfig>>({
    apiEndpoint: '',
    apiKey: '',
    apiSecret: '',
    useOAuth: false,
    oauthClientId: '',
    oauthClientSecret: '',
    oauthRedirectUri: '',
    dataMapping: {
      patientId: 'patient_id',
      firstName: 'first_name',
      lastName: 'last_name',
      dateOfBirth: 'birth_date',
      gender: 'gender',
      address: 'address',
      phone: 'phone',
      email: 'email',
      insurance: 'insurance'
    },
    exportTypes: {
      demographics: true,
      allergies: true,
      medications: true,
      conditions: true,
      immunizations: true,
      labResults: true,
      vitals: true,
      procedures: false,
      socialHistory: false,
      familyHistory: false,
      notes: false
    },
    syncFrequency: 'daily',
    syncDirection: 'bidirectional',
    enablePatientPortal: false,
    patientPortalUrl: '',
    ehrSystem: 'epic',
    customEhrSystem: '',
    apiVersion: '1.0',
    fhirEnabled: true,
    fhirVersion: 'r4',
    enableAudit: true,
    debugMode: false,
    ...config
  });

  // Função para atualizar as configurações
  const updateSettings = (updates: Partial<EHRConfig>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    onChange(newSettings);
  };

  // Função para alternar configurações booleanas
  const toggleSetting = (key: keyof EHRConfig) => {
    updateSettings({ [key]: !settings[key] } as any);
  };

  // Atualizar mapeamento de dados
  const updateDataMapping = (mapping: DataMapping) => {
    updateSettings({ dataMapping: mapping });
  };

  // Atualizar tipos de exportação
  const updateExportTypes = (exportTypes: ExportTypes) => {
    updateSettings({ exportTypes });
  };

  return (
    <div className="space-y-8 lg:h-[500px] overflow-y-scroll">

      <div className='grid grid-cols-2 gap-8 border-b border-gray-200 dark:border-gray-700'>
        {/* Informações do Sistema EHR */}
        <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sistema EHR</h3>
            <div className="space-y-4">
            <div>
                <label htmlFor="ehr-system" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sistema de Prontuário Eletrônico
                </label>
                <div className="mt-1">
                <select
                    id="ehr-system"
                    value={settings.ehrSystem}
                    onChange={(e) => updateSettings({ ehrSystem: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                >
                    <option value="epic">Epic</option>
                    <option value="cerner">Cerner</option>
                    <option value="allscripts">Allscripts</option>
                    <option value="nextgen">NextGen</option>
                    <option value="eclinicalworks">eClinicalWorks</option>
                    <option value="other">Outro</option>
                </select>
                </div>
            </div>

            {settings.ehrSystem === 'other' && (
                <div>
                <label htmlFor="custom-ehr-system" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Especifique o Sistema EHR
                </label>
                <div className="mt-1">
                    <input
                    id="custom-ehr-system"
                    type="text"
                    value={settings.customEhrSystem}
                    onChange={(e) => updateSettings({ customEhrSystem: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                    placeholder="Nome do sistema EHR"
                    autoComplete="off"
                    />
                </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                <label htmlFor="api-version" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Versão da API
                </label>
                <div className="mt-1">
                    <input
                    id="api-version"
                    type="text"
                    value={settings.apiVersion}
                    onChange={(e) => updateSettings({ apiVersion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                    placeholder="ex: 1.0, 2.0"
                    autoComplete="off"
                    />
                </div>
                </div>

                <div className="flex items-end">
                <div className="flex items-center space-x-2">
                    <input
                    id="fhir-enabled"
                    type="checkbox"
                    checked={settings.fhirEnabled}
                    onChange={() => toggleSetting('fhirEnabled')}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <label htmlFor="fhir-enabled" className="text-sm text-gray-700 dark:text-gray-300">
                    Habilitar FHIR
                    </label>
                </div>
                </div>
            </div>

            {settings.fhirEnabled && (
                <div>
                <label htmlFor="fhir-version" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Versão FHIR
                </label>
                <div className="mt-1">
                    <select
                    id="fhir-version"
                    value={settings.fhirVersion}
                    onChange={(e) => updateSettings({ fhirVersion: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                    >
                    <option value="dstu2">DSTU2</option>
                    <option value="stu3">STU3</option>
                    <option value="r4">R4</option>
                    </select>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Padrão FHIR (Fast Healthcare Interoperability Resources) para troca de dados
                </p>
                </div>
            )}
            </div>
        </div>

        {/* Configurações de API */}
        <div className='mb-12'>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Configurações de API</h3>
            <div className="space-y-4">
            <div>
                <label htmlFor="api-endpoint" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Endpoint da API
                </label>
                <div className="mt-1">
                <input
                    id="api-endpoint"
                    type="text"
                    value={settings.apiEndpoint}
                    onChange={(e) => updateSettings({ apiEndpoint: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                    placeholder="https://api.ehrsystem.com/v1"
                    autoComplete="off"
                />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Método de Autenticação</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Escolha o método de autenticação com a API
                </p>
                </div>
                <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                    <input
                    type="radio"
                    checked={!settings.useOAuth}
                    onChange={() => updateSettings({ useOAuth: false })}
                    className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">API Key</span>
                </label>
                <label className="inline-flex items-center">
                    <input
                    type="radio"
                    checked={settings.useOAuth}
                    onChange={() => updateSettings({ useOAuth: true })}
                    className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">OAuth 2.0</span>
                </label>
                </div>
            </div>

            {!settings.useOAuth ? (
                // Autenticação por API Key
                <div className="space-y-4 pl-6 border-l-2 border-blue-200 dark:border-blue-800">
                <div>
                    <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    API Key
                    </label>
                    <div className="mt-1">
                    <input
                        id="api-key"
                        type="password"
                        value={settings.apiKey}
                        onChange={(e) => updateSettings({ apiKey: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                        placeholder="Chave da API"
                        autoComplete="new-password"
                    />
                    </div>
                </div>

                <div>
                    <label htmlFor="api-secret" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    API Secret
                    </label>
                    <div className="mt-1">
                    <input
                        id="api-secret"
                        type="password"
                        value={settings.apiSecret}
                        onChange={(e) => updateSettings({ apiSecret: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                        placeholder="Segredo da API"
                        autoComplete="new-password"
                    />
                    </div>
                </div>
                </div>
            ) : (
                // Autenticação OAuth 2.0
                <div className="space-y-4 pl-6 border-l-2 border-blue-200 dark:border-blue-800">
                <div>
                    <label htmlFor="oauth-client-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Client ID
                    </label>
                    <div className="mt-1">
                    <input
                        id="oauth-client-id"
                        type="text"
                        value={settings.oauthClientId}
                        onChange={(e) => updateSettings({ oauthClientId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                        placeholder="ID do cliente OAuth"
                        autoComplete="off"
                    />
                    </div>
                </div>

                <div>
                    <label htmlFor="oauth-client-secret" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Client Secret
                    </label>
                    <div className="mt-1">
                    <input
                        id="oauth-client-secret"
                        type="password"
                        value={settings.oauthClientSecret}
                        onChange={(e) => updateSettings({ oauthClientSecret: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                        placeholder="Segredo do cliente OAuth"
                        autoComplete="new-password"
                    />
                    </div>
                </div>

                <div>
                    <label htmlFor="oauth-redirect-uri" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Redirect URI
                    </label>
                    <div className="mt-1">
                    <input
                        id="oauth-redirect-uri"
                        type="text"
                        value={settings.oauthRedirectUri}
                        onChange={(e) => updateSettings({ oauthRedirectUri: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                        placeholder="https://seu-dominio.com/oauth/callback"
                        autoComplete="off"
                    />
                    </div>
                </div>
                </div>
            )}
            </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-8 pt-4 border-b border-gray-200 dark:border-gray-700'>
        {/* Mapeamento de Campos */}
        <div className='mb-12'>
            <EHRFieldMapping 
            mapping={settings.dataMapping as DataMapping} 
            onChange={updateDataMapping} 
            />
        </div>

        <div className='flex flex-col space-y-12 pt-4'>
            {/* Aviso de conformidade */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                <p className="font-medium mb-1">Importante - Conformidade com LGPD</p>
                <p>
                    A integração com sistemas de prontuário eletrônico envolve o processamento de dados sensíveis de saúde.
                    Certifique-se de que todas as operações estão em conformidade com a LGPD e outras regulamentações aplicáveis.
                </p>
                </div>
            </div>

            {/* Documentação e suporte */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start">
                <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Recursos Adicionais</p>
                <p>
                    Para obter mais informações sobre a integração com sistemas EHR, consulte a documentação
                    específica do seu sistema de prontuário eletrônico e as orientações sobre HL7 FHIR.
                </p>
                </div>
            </div>
        </div>
      </div>

      <div className='grid grid-cols-4 gap-4'>
        {/* Tipos de Exportação */}
        <div>
            <EHRExportTypes 
            exportTypes={settings.exportTypes as ExportTypes} 
            onChange={updateExportTypes} 
            />
        </div>

        {/* Configurações de Sincronização */}
        <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Configurações de Sincronização</h3>
            <div className="space-y-4">
            <div>
                <label htmlFor="sync-frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Frequência de Sincronização
                </label>
                <div className="mt-1">
                <select
                    id="sync-frequency"
                    value={settings.syncFrequency}
                    onChange={(e) => updateSettings({ syncFrequency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                >
                    <option value="realtime">Tempo Real</option>
                    <option value="hourly">A cada hora</option>
                    <option value="daily">Diariamente</option>
                    <option value="manual">Manual</option>
                </select>
                </div>
            </div>

            <div>
                <label htmlFor="sync-direction" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Direção da Sincronização
                </label>
                <div className="mt-1">
                <select
                    id="sync-direction"
                    value={settings.syncDirection}
                    onChange={(e) => updateSettings({ syncDirection: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                >
                    <option value="import">Apenas Importar</option>
                    <option value="export">Apenas Exportar</option>
                    <option value="bidirectional">Bidirecional</option>
                </select>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Determina se os dados são importados do EHR, exportados para o EHR, ou ambos
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <input
                id="enable-audit"
                type="checkbox"
                checked={settings.enableAudit}
                onChange={() => toggleSetting('enableAudit')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="enable-audit" className="text-sm text-gray-700 dark:text-gray-300">
                Habilitar registro de auditoria para todas as operações
                </label>
            </div>
            </div>
        </div>

        {/* Portal do Paciente */}
        <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Portal do Paciente</h3>
            <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Habilitar Portal do Paciente</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Permitir acesso do paciente aos seus dados via portal
                </p>
                </div>
                <button
                type="button"
                onClick={() => toggleSetting('enablePatientPortal')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.enablePatientPortal ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.enablePatientPortal ? 'translate-x-6' : 'translate-x-1'
                }`} />
                </button>
            </div>

            {settings.enablePatientPortal && (
                <div className="pl-6 border-l-2 border-blue-200 dark:border-blue-800">
                <label htmlFor="patient-portal-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    URL do Portal
                </label>
                <div className="mt-1">
                    <input
                    id="patient-portal-url"
                    type="text"
                    value={settings.patientPortalUrl}
                    onChange={(e) => updateSettings({ patientPortalUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                    placeholder="https://portal.hospital.com"
                    autoComplete="off"
                    />
                </div>
                </div>
            )}
            </div>
        </div>

        {/* Configurações Avançadas */}
        <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Configurações Avançadas</h3>
            <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <input
                id="debug-mode"
                type="checkbox"
                checked={settings.debugMode}
                onChange={() => toggleSetting('debugMode')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="debug-mode" className="text-sm text-gray-700 dark:text-gray-300">
                Modo de depuração (logging detalhado)
                </label>
            </div>
            </div>
        </div>
      </div>

    </div>
  );
};