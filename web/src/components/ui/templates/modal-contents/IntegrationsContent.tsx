import React, { useState } from 'react';
import { 
  FileSpreadsheet, BarChart3, MessageCircle, 
  Mail, FileText, Bell, Check
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  isActive: boolean;
  category: string;
  gradientColors: string;
}

const IntegrationCard = ({ integration, onToggle }: { 
  integration: Integration;
  onToggle: (id: string) => void;
}) => (
  <div 
    className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-300
      ${integration.isActive
        ? `${integration.gradientColors} border-transparent shadow-lg`
        : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400'
      }
    `}
  >
    <div className="absolute top-3 right-3">
      {integration.isActive ? (
        <span className="flex items-center text-white text-sm">
          <Check size={16} className="mr-1" />
          Ativo
        </span>
      ) : (
        <span className="text-gray-400 dark:text-gray-500 text-sm">Inativo</span>
      )}
    </div>

    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4
      ${integration.isActive
        ? 'bg-white/20'
        : 'bg-gray-100 dark:bg-gray-800'
      }`}>
      {integration.icon}
    </div>

    <h3 className={`text-lg font-semibold mb-2 
      ${integration.isActive ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
      {integration.name}
    </h3>
    
    <p className={`text-sm mb-4
      ${integration.isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
      {integration.description}
    </p>

    <button
      onClick={() => onToggle(integration.id)}
      className={`w-full py-2 px-4 rounded-lg border transition-colors
        ${integration.isActive
          ? 'border-white/20 text-white hover:bg-white/10'
          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400'
        }`}
    >
      {integration.isActive ? 'Configurar' : 'Ativar'}
    </button>
  </div>
);

export const IntegrationsContent = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'word',
      name: 'Microsoft Word',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      description: 'Geração de documentos e relatórios médicos',
      isActive: false,
      category: 'export',
      gradientColors: 'bg-gradient-to-br from-blue-600 to-sky-600'
    },
    {
      id: 'jira',
      name: 'Jira Software',
      icon: <FileSpreadsheet className="w-6 h-6 text-blue-600" />,
      description: 'Gestão de tarefas e projetos hospitalares',
      isActive: false,
      category: 'analytics',
      gradientColors: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageCircle className="w-6 h-6 text-green-600" />,
      description: 'Comunicação com pacientes e equipe médica',
      isActive: false,
      category: 'communication',
      gradientColors: 'bg-gradient-to-br from-green-500 to-emerald-500'
    },
    {
      id: 'excel',
      name: 'Excel/Sheets',
      icon: <FileSpreadsheet className="w-6 h-6 text-green-600" />,
      description: 'Exportação de métricas e relatórios',
      isActive: true,
      category: 'export',
      gradientColors: 'bg-gradient-to-br from-green-600 to-emerald-600'
    },
    {
      id: 'powerbi',
      name: 'PowerBI',
      icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
      description: 'Dashboard de análise em tempo real',
      isActive: false,
      category: 'analytics',
      gradientColors: 'bg-gradient-to-br from-purple-600 to-indigo-600'
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: <MessageCircle className="w-6 h-6 text-blue-600" />,
      description: 'Notificações e alertas em tempo real',
      isActive: true,
      category: 'communication',
      gradientColors: 'bg-gradient-to-br from-blue-600 to-cyan-600'
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      icon: <Bell className="w-6 h-6 text-indigo-600" />,
      description: 'Integrações com equipes e comunicação',
      isActive: false,
      category: 'communication',
      gradientColors: 'bg-gradient-to-br from-indigo-600 to-purple-600'
    },
    {
      id: 'email',
      name: 'Email',
      icon: <Mail className="w-6 h-6 text-red-600" />,
      description: 'Relatórios e notificações por email',
      isActive: true,
      category: 'communication',
      gradientColors: 'bg-gradient-to-br from-red-600 to-pink-600'
    },
    {
      id: 'pdf',
      name: 'PDF Reports',
      icon: <FileText className="w-6 h-6 text-orange-600" />,
      description: 'Geração de relatórios em PDF',
      isActive: false,
      category: 'export',
      gradientColors: 'bg-gradient-to-br from-orange-600 to-red-600'
    }
  ]);

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'export', label: 'Exportação' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'communication', label: 'Comunicação' }
  ];

  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, isActive: !integration.isActive }
          : integration
      )
    );
  };

  const filteredIntegrations = integrations.filter(
    integration => selectedCategory === 'all' || integration.category === selectedCategory
  );

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors
              ${selectedCategory === category.id
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map(integration => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onToggle={toggleIntegration}
          />
        ))}
      </div>
    </div>
  );
};