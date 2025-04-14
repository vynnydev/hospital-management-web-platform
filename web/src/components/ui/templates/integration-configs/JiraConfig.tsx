import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { JiraBasicSettings } from './jira/JiraBasicSettings';
import { JiraProjectSettings } from './jira/JiraProjectSettings';
import { JiraWorkflowSettings } from './jira/JiraWorkflowSettings';
import { JiraUserMappings } from './jira/JiraUserMappings';
import { IJiraConfig } from '@/types/integrations-configs/jira-software-types';

interface JiraConfigProps {
  config?: Partial<IJiraConfig>;
  onChange: (config: Partial<IJiraConfig>) => void;
}

export const JiraConfig: React.FC<JiraConfigProps> = ({
  config = {},
  onChange
}) => {
  // Estado para a tab ativa
  const [activeTab, setActiveTab] = useState<'basic' | 'projects' | 'workflow' | 'users'>('basic');
  
  // Estado local para gerenciar as configurações
  const [settings, setSettings] = useState<Partial<IJiraConfig>>({
    baseUrl: 'https://your-domain.atlassian.net',
    apiToken: '',
    username: '',
    defaultProject: '',
    useOAuth: false,
    clientId: '',
    clientSecret: '',
    projects: [],
    workflowMapping: {
      appointment: 'Appointment',
      emergency: 'Emergency',
      surgery: 'Surgery',
      transfer: 'Transfer',
      discharge: 'Discharge',
      medication: 'Medication'
    },
    syncInterval: 15,
    autoCreateIssues: true,
    autoUpdateIssues: true,
    syncDirection: 'one-way',
    userMapping: [],
    customFields: [],
    defaultPriority: 'medium',
    maxAttachmentSize: 10,
    includePatientData: true,
    includeAttachments: true,
    ...config
  });

  // Função para atualizar as configurações
  const updateSettings = (updates: Partial<IJiraConfig>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    onChange(newSettings);
  };

  // Renderizar a tab ativa
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <JiraBasicSettings 
            settings={settings} 
            updateSettings={updateSettings} 
          />
        );
      case 'projects':
        return (
          <JiraProjectSettings 
            settings={settings} 
            updateSettings={updateSettings} 
          />
        );
      case 'workflow':
        return (
          <JiraWorkflowSettings 
            settings={settings} 
            updateSettings={updateSettings} 
          />
        );
      case 'users':
        return (
          <JiraUserMappings 
            settings={settings} 
            updateSettings={updateSettings} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 lg:h-[500px] overflow-y-scroll">
      {/* Tabs de navegação */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px space-x-4">
          <button
            onClick={() => setActiveTab('basic')}
            className={`py-2 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'basic' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Configurações Básicas
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'projects' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Projetos
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`py-2 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'workflow' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Workflows
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'users' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Mapeamento de Usuários
          </button>
        </nav>
      </div>

      {/* Conteúdo da tab ativa */}
      <div className="mt-4">
        {renderActiveTab()}
      </div>

      {/* Informações gerais sobre a integração */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start mt-6">
        <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium mb-1">Sobre a Integração com Jira</p>
          <p className="mb-2">
            Esta integração permite sincronizar tarefas, problemas e projetos entre o sistema hospitalar e o Jira Software.
            É ideal para equipes que utilizam metodologias ágeis na gestão hospitalar.
          </p>
          <p>
            Para maior segurança, recomendamos criar um usuário específico no Jira para esta integração e utilizar tokens de API em vez de senhas.
          </p>
        </div>
      </div>
    </div>
  );
};