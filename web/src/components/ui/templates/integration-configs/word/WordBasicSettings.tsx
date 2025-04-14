/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { IWordConfig } from '@/types/integrations-configs/microsoft-word-types';

interface WordBasicSettingsProps {
  settings: Partial<IWordConfig>;
  updateSettings: (updates: Partial<IWordConfig>) => void;
  toggleSetting: (key: keyof IWordConfig) => void;
}

export const WordBasicSettings: React.FC<WordBasicSettingsProps> = ({
  settings,
  updateSettings,
  toggleSetting
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Configurações Básicas</h3>
      
      <div>
        <label htmlFor="word-api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Chave da API (Microsoft Graph)
        </label>
        <div className="mt-1">
          <input
            id="word-api-key"
            type="password"
            value={settings.apiKey}
            onChange={(e) => updateSettings({ apiKey: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            placeholder="Insira sua chave de API"
            autoComplete="new-password"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Necessária para conectar com a API do Office 365
        </p>
      </div>

      <div>
        <label htmlFor="template-path" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Pasta de Templates
        </label>
        <div className="mt-1">
          <input
            id="template-path"
            type="text"
            value={settings.templatePath}
            onChange={(e) => updateSettings({ templatePath: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            placeholder="/templates/word"
            autoComplete="off"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Caminho onde os templates do Word estão armazenados
        </p>
      </div>

      <div>
        <label htmlFor="default-format" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Formato Padrão
        </label>
        <div className="mt-1">
          <select
            id="default-format"
            value={settings.defaultFormat}
            onChange={(e) => updateSettings({ defaultFormat: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
          >
            <option value="docx">Word Document (DOCX)</option>
            <option value="doc">Word 97-2003 (DOC)</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Formato padrão para geração de documentos
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">Autosalvar Documentos</span>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Salva automaticamente documentos na pasta definida
          </p>
        </div>
        <button
          type="button"
          onClick={() => toggleSetting('autoSave')}
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            settings.autoSave ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            settings.autoSave ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
    </div>
  );
};