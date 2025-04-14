import React from 'react';
import { IWordConfig } from '@/types/integrations-configs/microsoft-word-types';

interface WordFormattingSettingsProps {
  settings: Partial<IWordConfig>;
  updateSettings: (updates: Partial<IWordConfig>) => void;
}

export const WordFormattingSettings: React.FC<WordFormattingSettingsProps> = ({
  settings,
  updateSettings
}) => {
  return (
    <div className="pt-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Formatação do Documento</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="font-family" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fonte Padrão
            </label>
            <select
              id="font-family"
              value={settings.fontFamily}
              onChange={(e) => updateSettings({ fontFamily: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
            >
              <option value="Arial">Arial</option>
              <option value="Calibri">Calibri</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Tahoma">Tahoma</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tamanho da Fonte
            </label>
            <select
              id="font-size"
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
            >
              <option value="9">9 pt</option>
              <option value="10">10 pt</option>
              <option value="11">11 pt</option>
              <option value="12">12 pt</option>
              <option value="14">14 pt</option>
            </select>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Margens (cm)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="margin-top" className="block text-xs text-gray-500 dark:text-gray-400">
                Superior
              </label>
              <input
                id="margin-top"
                type="number"
                step="0.5"
                min="0"
                value={settings.marginTop}
                onChange={(e) => updateSettings({ marginTop: parseFloat(e.target.value) })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="margin-bottom" className="block text-xs text-gray-500 dark:text-gray-400">
                Inferior
              </label>
              <input
                id="margin-bottom"
                type="number"
                step="0.5"
                min="0"
                value={settings.marginBottom}
                onChange={(e) => updateSettings({ marginBottom: parseFloat(e.target.value) })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="margin-left" className="block text-xs text-gray-500 dark:text-gray-400">
                Esquerda
              </label>
              <input
                id="margin-left"
                type="number"
                step="0.5"
                min="0"
                value={settings.marginLeft}
                onChange={(e) => updateSettings({ marginLeft: parseFloat(e.target.value) })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="margin-right" className="block text-xs text-gray-500 dark:text-gray-400">
                Direita
              </label>
              <input
                id="margin-right"
                type="number"
                step="0.5"
                min="0"
                value={settings.marginRight}
                onChange={(e) => updateSettings({ marginRight: parseFloat(e.target.value) })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};