import React from 'react';
import { IWordConfig } from '@/types/integrations-configs/microsoft-word-types';

interface WordHeaderFooterSettingsProps {
  settings: Partial<IWordConfig>;
  updateSettings: (updates: Partial<IWordConfig>) => void;
  toggleSetting: (key: keyof IWordConfig) => void;
}

export const WordHeaderFooterSettings: React.FC<WordHeaderFooterSettingsProps> = ({
  settings,
  updateSettings,
  toggleSetting
}) => {
  return (
    <div className="pt-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Cabeçalho e Rodapé</h3>
      
      <div className="space-y-4">
        {/* Opção para habilitar cabeçalho e rodapé */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Habilitar Cabeçalho e Rodapé</span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Adiciona cabeçalho e rodapé personalizados aos documentos
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleSetting('headerFooterEnabled')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.headerFooterEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings.headerFooterEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Configurações de cabeçalho e rodapé (visíveis quando habilitado) */}
        {settings.headerFooterEnabled && (
          <div className="space-y-4 pl-6 border-l-2 border-blue-200 dark:border-blue-800">
            <div>
              <label htmlFor="header-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Texto do Cabeçalho
              </label>
              <div className="mt-1">
                <input
                  id="header-text"
                  type="text"
                  value={settings.customHeaderText}
                  onChange={(e) => updateSettings({ customHeaderText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                  placeholder="Hospital System - Documento Gerado Automaticamente"
                />
              </div>
            </div>

            <div>
              <label htmlFor="footer-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Texto do Rodapé
              </label>
              <div className="mt-1">
                <input
                  id="footer-text"
                  type="text"
                  value={settings.customFooterText}
                  onChange={(e) => updateSettings({ customFooterText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                  placeholder="Confidencial"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Numeração de Páginas</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Adiciona números de página ao rodapé
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('pageNumbering')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.pageNumbering ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.pageNumbering ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        )}

        {/* Configurações de marca d'água */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Marca d&apos;Água</span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Adiciona marca d&apos;água em todos os documentos
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleSetting('watermarkEnabled')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.watermarkEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings.watermarkEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Campo de texto da marca d'água (visível quando habilitado) */}
        {settings.watermarkEnabled && (
          <div className="mt-3 pl-6 border-l-2 border-blue-200 dark:border-blue-800">
            <label htmlFor="watermark-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Texto da Marca d&apos;Água
            </label>
            <div className="mt-1">
              <input
                id="watermark-text"
                type="text"
                value={settings.watermarkText}
                onChange={(e) => updateSettings({ watermarkText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="CONFIDENCIAL"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};