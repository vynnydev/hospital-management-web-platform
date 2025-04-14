/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, BarChart3, MessageCircle, 
  Mail, FileText, Bell, Check, FileSignature,
  AlertTriangle, Loader2, Search, Filter, ShieldCheck, BookOpen
} from 'lucide-react';
import { IntegrationConfigModal } from '../modals/IntegrationConfigModal';

// Componentes de Configuração para integrações específicas
import { DocSignConfig } from '../integration-configs/DocSignConfig';
import { ExcelConfig } from '../integration-configs/ExcelConfig';
import { SlackConfig } from '../integration-configs/SlackConfig';
import { EmailConfig } from '../integration-configs/EmailConfig';
import { PDFConfig } from '../integration-configs/PDFConfig';
import { EHRConfig } from '../integration-configs/EHRConfig';
import { JiraConfig } from '../integration-configs/JiraConfig';
import { PowerBIConfig } from '../integration-configs/PowerBIConfig';
import { SecureHealthConfig } from '../integration-configs/SecureHealthConfig';
import { TeamsConfig } from '../integration-configs/TeamsConfig';
import { WhatsAppConfig } from '../integration-configs/WhatsAppConfig';
import { WordConfig } from '../integration-configs/WordConfig';

// Tipagem para as integrações
interface Integration {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  isActive: boolean;
  category: string;
  gradientColors: string;
  isNew?: boolean;
  isPopular?: boolean;
}

// Componente para mostrar o cartão de integração
const IntegrationCard = ({ 
  integration, 
  onToggle, 
  onOpenConfig 
}: { 
  integration: Integration;
  onToggle: (id: string) => void;
  onOpenConfig: (id: string) => void;
}) => (
  <div 
    className={`relative p-4 rounded-xl border transition-all duration-300
      ${integration.isActive
        ? `${integration.gradientColors} border-transparent shadow-lg`
        : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400'
      }
    `}
  >
    {integration.isNew && (
      <span className="absolute top-3 right-3 bg-yellow-500 text-xs font-bold py-1 px-2 rounded-full text-white">
        NOVO
      </span>
    )}

    {!integration.isNew && integration.isActive && (
      <div className="absolute top-3 right-3">
        <span className="flex items-center text-white text-sm">
          <Check size={16} className="mr-1" />
          Ativo
        </span>
      </div>
    )}

    {!integration.isNew && !integration.isActive && (
      <div className="absolute top-3 right-3">
        <span className="text-gray-400 dark:text-gray-500 text-sm">Inativo</span>
      </div>
    )}

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
      {integration.isPopular && (
        <span className="ml-2 text-xs inline-block bg-blue-600 dark:bg-blue-500 text-white px-2 py-0.5 rounded-full">
          Popular
        </span>
      )}
    </h3>
    
    <p className={`text-sm mb-4
      ${integration.isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
      {integration.description}
    </p>

    <button
      onClick={() => integration.isActive ? onOpenConfig(integration.id) : onToggle(integration.id)}
      className={`w-full py-2 px-4 rounded-lg border transition-colors
        ${integration.isActive
          ? 'border-white/20 text-white hover:bg-white/10'
          : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400'
        }`}
    >
      {integration.isActive ? 'Configurar' : 'Ativar'}
    </button>
  </div>
);

export const IntegrationsContent = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Gerenciamento de modais de configuração
  const [activeConfigModal, setActiveConfigModal] = useState<string | null>(null);
  
  // Configurações atuais de cada integração
  const [integrationsConfig, setIntegrationsConfig] = useState<Record<string, any>>({
    docsign: {},
    excel: {},
    slack: {},
    email: {},
    pdf: {},
    ehr: {},
    word: {},
    jira: {},
    whatsapp: {},
    powerbi: {},
    teams: {},
    security: {}
  });
  
  // Lista de integrações
  const [integrations, setIntegrations] = useState<Integration[]>([
    // DocSign Integration
    {
      id: 'docsign',
      name: 'DocSign',
      icon: <FileSignature className="w-6 h-6 text-teal-600" />,
      description: 'Assinatura digital de protocolos e documentos médicos',
      isActive: true,
      category: 'export',
      gradientColors: 'bg-gradient-to-br from-teal-600 to-emerald-600',
      isPopular: true
    },
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
      gradientColors: 'bg-gradient-to-br from-green-500 to-emerald-500',
      isPopular: true
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
    },
    {
      id: 'ehr',
      name: 'EHR Connect',
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      description: 'Integração com prontuário eletrônico',
      isActive: false,
      category: 'interoperability',
      gradientColors: 'bg-gradient-to-br from-blue-600 to-indigo-600',
      isNew: true
    },
    {
      id: 'security',
      name: 'SecureHealth',
      icon: <ShieldCheck className="w-6 h-6 text-red-600" />,
      description: 'Verificação de segurança de dados médicos',
      isActive: false,
      category: 'security',
      gradientColors: 'bg-gradient-to-br from-red-600 to-rose-600',
      isNew: true
    }
  ]);

  // Simular carregamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Limpar completamente a barra de busca quando qualquer modal estiver aberto
  useEffect(() => {
    if (activeConfigModal) {
      setSearchQuery('');
    }
  }, [activeConfigModal]);

  // Categorias
  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'export', label: 'Exportação' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'communication', label: 'Comunicação' },
    { id: 'security', label: 'Segurança' },
    { id: 'interoperability', label: 'Interoperabilidade' }
  ];

  // Ativar integração
  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, isActive: !integration.isActive }
          : integration
      )
    );
    
    // Se estiver ativando, abrir o modal de configuração
    const integration = integrations.find(i => i.id === id);
    if (integration && !integration.isActive) {
      setTimeout(() => {
        setActiveConfigModal(id);
      }, 300);
    }
  };

  // Abrir modal de configuração
  const openConfigModal = (id: string) => {
    // Limpar o campo de busca para evitar que seja preenchido automaticamente
    setSearchQuery('');
    
    // Só então abrir o modal
    setActiveConfigModal(id);
  };

  // Fechar modal de configuração
  const closeConfigModal = () => {
    setActiveConfigModal(null);
  };

  // Desativar integração
  const deactivateIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, isActive: false }
          : integration
      )
    );
    closeConfigModal();
  };

  // Salvar configurações de integração
  const saveIntegrationConfig = (id: string, config: any) => {
    setIntegrationsConfig(prev => ({
      ...prev,
      [id]: config
    }));
    
    console.log(`Configurações da integração ${id} salvas:`, config);
  };

  // Filtrar integrações
  const filteredIntegrations = integrations.filter(integration => {
    // Filtro por categoria
    const categoryMatch = selectedCategory === 'all' || integration.category === selectedCategory;
    
    // Filtro por status ativo
    const activeMatch = !showActiveOnly || integration.isActive;
    
    // Filtro por pesquisa
    const searchMatch = searchQuery === '' || 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && activeMatch && searchMatch;
  });

  // Renderizar conteúdo do modal de configuração baseado na integração
  const renderConfigModalContent = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return null;

    const handleConfigChange = (config: any) => {
      saveIntegrationConfig(id, config);
    };

    switch (id) {
      case 'docsign':
        return <DocSignConfig config={integrationsConfig.docsign} onChange={handleConfigChange} />;
        
      case 'ehr':
        return <EHRConfig config={integrationsConfig.ehr} onChange={handleConfigChange} />;
        
      case 'email':
        return <EmailConfig config={integrationsConfig.email} onChange={handleConfigChange} />;

      case 'excel':
        return <ExcelConfig config={integrationsConfig.excel} onChange={handleConfigChange} />;

      case 'jira':
        return <JiraConfig config={integrationsConfig.jira} onChange={handleConfigChange} />;
      
      case 'pdf':
        return <PDFConfig config={integrationsConfig.pdf} onChange={handleConfigChange} />;

      case 'powerbi':
        return <PowerBIConfig {...integrationsConfig.powerbi} onChange={handleConfigChange} />;

      case 'security':
        return <SecureHealthConfig {...integrationsConfig.security} onChange={handleConfigChange} />;

      case 'slack':
        return <SlackConfig config={integrationsConfig.slack} onChange={handleConfigChange} />;
      
      case 'teams':
        return <TeamsConfig {...integrationsConfig.teams} onChange={handleConfigChange} />;

      case 'whatsapp':
        return <WhatsAppConfig {...integrationsConfig.whatsapp} onChange={handleConfigChange} />;

      case 'word':
        return <WordConfig {...integrationsConfig.word} onChange={handleConfigChange} />;
      
      // Para integrações sem componentes específicos ainda
      default:
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                Configurações para {integration.name} ainda não implementadas.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Esta funcionalidade estará disponível em breve.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="w-full">
        {/* Barra de busca e filtros */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Buscar integrações..."
              value={searchQuery} // Controlado pelo estado React
              onChange={(e) => setSearchQuery(e.target.value)}
              // Adicionar os seguintes atributos para prevenir autocompletamento
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              id="integration-search" // ID único para esse campo
              className="pl-10 pr-4 py-2 w-full md:w-72 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={() => setShowActiveOnly(!showActiveOnly)}
                className="rounded text-blue-600 dark:text-blue-500"
              />
              <span>Mostrar apenas ativas</span>
            </label>
            
            <div className="flex items-center space-x-2 ml-4">
              <Filter size={16} className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Filtrar:</span>
            </div>
          </div>
        </div>

        {/* Categorias */}
        <div className="flex flex-wrap gap-2 mb-6">
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

        {/* Estado de carregamento */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Carregando integrações...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-red-500 dark:text-red-400 mb-2">Erro ao carregar integrações</p>
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            {/* Lista de integrações */}
            {filteredIntegrations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIntegrations.map(integration => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onToggle={toggleIntegration}
                    onOpenConfig={openConfigModal}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhuma integração encontrada
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Tente ajustar seus filtros ou buscar por outro termo.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Modais de configuração */}
      {integrations.map(integration => (
        <IntegrationConfigModal
          key={integration.id}
          isOpen={activeConfigModal === integration.id}
          onClose={closeConfigModal}
          onDeactivate={() => deactivateIntegration(integration.id)}
          onSave={async (data) => {
            saveIntegrationConfig(integration.id, data);
            closeConfigModal();
            return true; // Ensure the function returns a Promise<boolean>
          }}
          title={`Configuração - ${integration.name}`}
        >
          {renderConfigModalContent(integration.id)}
        </IntegrationConfigModal>
      ))}
    </>
  );
};