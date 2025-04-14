/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { IWordConfig } from '@/types/integrations-configs/microsoft-word-types';

import { WordBasicSettings } from './word/WordBasicSettings';
import { WordFormattingSettings } from './word/WordFormattingSettings';
import { WordHeaderFooterSettings } from './word/WordHeaderFooterSettings';
import { WordTemplateSettings } from './word/WordTemplateSettings';

interface WordConfigProps {
  config?: Partial<IWordConfig>;
  onChange: (config: Partial<IWordConfig>) => void;
}

export const WordConfig: React.FC<WordConfigProps> = ({
  config = {},
  onChange
}) => {
  // Estado local para gerenciar as configurações
  const [settings, setSettings] = useState<Partial<IWordConfig>>({
    apiKey: '',
    templatePath: '/templates/word',
    autoSave: true,
    defaultFormat: 'docx',
    headerFooterEnabled: true,
    customHeaderText: 'Hospital System - Documento Gerado Automaticamente',
    customFooterText: 'Confidencial',
    pageNumbering: true,
    watermarkText: '',
    watermarkEnabled: false,
    fontFamily: 'Arial',
    fontSize: 11,
    marginTop: 2.5,
    marginBottom: 2.5,
    marginLeft: 2.5,
    marginRight: 2.5,
    templates: [
      { id: 'prescription', name: 'Receituário', description: 'Modelo para prescrição médica' },
      { id: 'medical_report', name: 'Relatório Médico', description: 'Modelo para relatórios e laudos' },
      { id: 'discharge', name: 'Alta Hospitalar', description: 'Modelo para documentos de alta' }
    ],
    ...config
  });

  // Função para atualizar as configurações
  const updateSettings = (updates: Partial<IWordConfig>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    onChange(newSettings);
  };

  // Função para alternar configurações booleanas
  const toggleSetting = (key: keyof IWordConfig) => {
    updateSettings({ [key]: !settings[key] } as any);
  };

  return (
    <div className="space-y-6 lg:h-[500px] overflow-y-scroll">
      {/* Configurações Básicas */}
      <WordBasicSettings 
        settings={settings} 
        updateSettings={updateSettings} 
        toggleSetting={toggleSetting} 
      />

      {/* Configurações de Formatação */}
      <WordFormattingSettings 
        settings={settings} 
        updateSettings={updateSettings} 
      />

      {/* Cabeçalho e Rodapé */}
      <WordHeaderFooterSettings 
        settings={settings} 
        updateSettings={updateSettings} 
        toggleSetting={toggleSetting} 
      />

      {/* Templates */}
      <WordTemplateSettings 
        settings={settings} 
        updateSettings={updateSettings} 
      />

      {/* Aviso Legal */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start mt-6">
        <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium mb-1">Observação</p>
          <p>
            Para utilizar a integração com o Microsoft Word, é necessário ter uma licença do Office 365 
            e as permissões adequadas para acessar a API do Microsoft Graph. Todas as configurações de 
            formatação serão aplicadas aos novos documentos gerados.
          </p>
        </div>
      </div>
    </div>
  );
};