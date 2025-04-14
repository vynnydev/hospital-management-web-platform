/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { IJiraConfig } from '@/types/integrations-configs/jira-software-types';

interface IJiraBasicSettingsProps {
  settings: Partial<IJiraConfig>;
  updateSettings: (updates: Partial<IJiraConfig>) => void;
}

export const JiraBasicSettings: React.FC<IJiraBasicSettingsProps> = ({
  settings,
  updateSettings
}) => {
  // Função para alternar configurações booleanas
  const toggleSetting = (key: keyof IJiraConfig) => {
    updateSettings({ [key]: !settings[key] } as any);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="jira-base-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            URL do Jira
          </label>
          <div className="mt-1">
            <input
              id="jira-base-url"
              type="text"
              value={settings.baseUrl}
              onChange={(e) => updateSettings({ baseUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="https://your-domain.atlassian.net"
              autoComplete="off"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            URL base para sua instância do Jira
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Utilizar OAuth</span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Usar autenticação OAuth 2.0 em vez de token de API
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleSetting('useOAuth')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.useOAuth ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings.useOAuth ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {settings.useOAuth ? (
          <>
            <div>
              <label htmlFor="jira-client-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Client ID
              </label>
              <div className="mt-1">
                <input
                  id="jira-client-id"
                  type="text"
                  value={settings.clientId || ''}
                  onChange={(e) => updateSettings({ clientId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="Client ID do OAuth"
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label htmlFor="jira-client-secret" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Client Secret
              </label>
              <div className="mt-1">
                <input
                  id="jira-client-secret"
                  type="password"
                  value={settings.clientSecret || ''}
                  onChange={(e) => updateSettings({ clientSecret: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="Client Secret do OAuth"
                  autoComplete="new-password"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Mantenha este valor seguro e não compartilhe
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="jira-username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email/Usuário
              </label>
              <div className="mt-1">
                <input
                  id="jira-username"
                  type="text"
                  value={settings.username}
                  onChange={(e) => updateSettings({ username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="seu.email@empresa.com"
                  autoComplete="off"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Email ou nome de usuário da sua conta Atlassian
              </p>
            </div>

            <div>
              <label htmlFor="jira-api-token" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Token de API
              </label>
              <div className="mt-1">
                <input
                  id="jira-api-token"
                  type="password"
                  value={settings.apiToken}
                  onChange={(e) => updateSettings({ apiToken: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="Token de API do Jira"
                  autoComplete="new-password"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Gere um token em &#34;Gerenciar sua conta&#34; &gt; &#34;Segurança&#34; &gt; &#34;Criar e gerenciar tokens de API&#34;
              </p>
            </div>
          </>
        )}

        <div>
          <label htmlFor="jira-default-project" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Projeto Padrão
          </label>
          <div className="mt-1">
            <input
              id="jira-default-project"
              type="text"
              value={settings.defaultProject}
              onChange={(e) => updateSettings({ defaultProject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="HOSP"
              autoComplete="off"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Chave do projeto padrão para criação de issues (ex: HOSP, MED)
          </p>
        </div>
      </div>

      <div className="pt-4">
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Configurações de Sincronização</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Criação Automática de Issues</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cria automaticamente issues no Jira para eventos no hospital
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('autoCreateIssues')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.autoCreateIssues ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.autoCreateIssues ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Atualização Automática de Issues</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Atualiza issues no Jira conforme status muda no hospital
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('autoUpdateIssues')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.autoUpdateIssues ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.autoUpdateIssues ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="jira-sync-interval" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Intervalo de Sincronização
              </label>
              <div className="mt-1 flex items-center">
                <input
                  id="jira-sync-interval"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.syncInterval}
                  onChange={(e) => updateSettings({ syncInterval: parseInt(e.target.value) })}
                  className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                />
                <span className="ml-2 text-gray-600 dark:text-gray-400">minutos</span>
              </div>
            </div>

            <div>
              <label htmlFor="jira-sync-direction" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Direção da Sincronização
              </label>
              <div className="mt-1">
                <select
                  id="jira-sync-direction"
                  value={settings.syncDirection}
                  onChange={(e) => updateSettings({ syncDirection: e.target.value as 'one-way' | 'two-way' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                >
                  <option value="one-way">Hospital → Jira (Unidirecional)</option>
                  <option value="two-way">Hospital ↔ Jira (Bidirecional)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Configurações Adicionais</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Incluir Dados do Paciente</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Envia informações básicas do paciente para o Jira
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('includePatientData')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.includePatientData ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.includePatientData ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Incluir Anexos</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Envia arquivos anexos para o Jira (ex: imagens, PDFs)
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('includeAttachments')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.includeAttachments ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.includeAttachments ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {settings.includeAttachments && (
            <div className="pl-6 border-l-2 border-blue-200 dark:border-blue-800">
              <label htmlFor="jira-max-attachment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tamanho Máximo de Anexo (MB)
              </label>
              <div className="mt-1">
                <input
                  id="jira-max-attachment"
                  type="number"
                  min="1"
                  max="100"
                  value={settings.maxAttachmentSize}
                  onChange={(e) => updateSettings({ maxAttachmentSize: parseInt(e.target.value) })}
                  className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Limite de tamanho por arquivo em MB (máximo 100MB)
              </p>
            </div>
          )}

          <div>
            <label htmlFor="jira-default-priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Prioridade Padrão
            </label>
            <div className="mt-1">
              <select
                id="jira-default-priority"
                value={settings.defaultPriority}
                onChange={(e) => updateSettings({ defaultPriority: e.target.value as IJiraConfig['defaultPriority'] })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              >
                <option value="highest">Altíssima</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
                <option value="lowest">Muito Baixa</option>
              </select>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Prioridade padrão para novas issues
            </p>
          </div>
        </div>
      </div>

      {/* Alerta de segurança de dados */}
      {settings.includePatientData && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-yellow-700 dark:text-yellow-300">
            <p className="font-medium mb-1">Atenção: Dados Sensíveis</p>
            <p>
              Certifique-se de que a configuração de inclusão de dados do paciente esteja em conformidade com as políticas
              de privacidade e proteção de dados da sua instituição e com a legislação aplicável.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};