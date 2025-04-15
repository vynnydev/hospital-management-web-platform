/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  BarChart2, Clock, GitBranch, FileText, AlertTriangle, Settings,
  PlusCircle, Workflow, Filter, Search, Sliders
} from 'lucide-react';
import { useWorkflow } from '@/hooks/workflows/useWorkflow';
import { authService } from '@/services/general/auth/AuthService';
import { WorkflowStats } from './WorkflowStats';
import { WorkflowTemplateList } from './WorkflowTemplateList';
import { WorkflowSettings } from './WorkflowSettings';
import { WorkflowSettingsEditor } from './WorkflowSettingsEditor';
import { SLASettingsEditor } from './SLASettingsEditor';
import { ExceptionFlowEditor } from './ExceptionFlowEditor';

export const WorkflowContent: React.FC = () => {
  const { 
    templates, 
    customWorkflows, 
    stats, 
    settings, 
    isLoading, 
    error,
    loadTemplates,
    loadCustomWorkflows,
    loadSettings,
    loadStats,
    refreshStats,
    getSummaryStats,
    filterTemplatesByCategory
  } = useWorkflow();

  const [activeTab, setActiveTab] = useState<'templates' | 'editor' | 'sla' | 'exception' | 'settings'>('templates');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const user = authService.getCurrentUser();
  const isAdmin = authService.isAdministrator();
  const isDoctor = authService.isDoctor();

  useEffect(() => {
    loadTemplates();
    loadCustomWorkflows();
    loadSettings();
    loadStats();
  }, [loadCustomWorkflows, loadSettings, loadStats, loadTemplates]);

  // Filtrar templates com base na categoria e pesquisa
  const filteredTemplates = templates
    .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
    .filter(t => 
      searchQuery === '' || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Verificar permissões para exibir tabs
  const canAccessSettings = isAdmin;
  const canAccessEditor = isAdmin || isDoctor;

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (canAccessEditor) {
      setActiveTab('editor');
    }
  };

  const handleWorkflowSelect = (workflowId: string) => {
    setSelectedWorkflow(workflowId);
    if (canAccessEditor) {
      setActiveTab('editor');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Cabeçalho e Estatísticas */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Gestão de Processos Hospitalares
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Personalize fluxos de trabalho para melhorar a eficiência operacional
        </p>
        
        {/* Estatísticas Resumidas */}
        {stats && <WorkflowStats stats={stats} isLoading={isLoading.stats} onRefresh={refreshStats} />}
      </div>

      {/* Navegação de Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeTab === 'templates'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Workflow className="inline-block w-4 h-4 mr-2" />
          Templates de Processos
        </button>
        
        {canAccessEditor && (
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'editor'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <GitBranch className="inline-block w-4 h-4 mr-2" />
            Editor de Workflow
          </button>
        )}
        
        {canAccessEditor && (
          <button
            onClick={() => setActiveTab('sla')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'sla'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Clock className="inline-block w-4 h-4 mr-2" />
            Editor de SLAs
          </button>
        )}
        
        {canAccessEditor && (
          <button
            onClick={() => setActiveTab('exception')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'exception'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <AlertTriangle className="inline-block w-4 h-4 mr-2" />
            Fluxos de Exceção
          </button>
        )}
        
        {canAccessSettings && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Settings className="inline-block w-4 h-4 mr-2" />
            Configurações
          </button>
        )}
      </div>

      {/* Barra de Filtros e Pesquisa */}
      {activeTab === 'templates' && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Buscar processos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-72 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="ml-4 flex items-center">
              <Filter size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
              <select 
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 py-2 px-3"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Todas as categorias</option>
                <option value="geral">Geral</option>
                <option value="cirurgias">Cirurgias</option>
                <option value="diagnósticos">Diagnósticos</option>
                <option value="emergência">Emergência</option>
              </select>
            </div>
          </div>
          
          {canAccessEditor && (
            <button 
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              onClick={() => {
                setSelectedTemplate(null);
                setSelectedWorkflow(null);
                setActiveTab('editor');
              }}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Workflow
            </button>
          )}
        </div>
      )}

      {/* Exibição de Erro */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span className="font-medium">Erro ao carregar dados</span>
          </div>
          <p className="mt-1 ml-7">{error}</p>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        {activeTab === 'templates' && (
          <WorkflowTemplateList 
            templates={filteredTemplates}
            customWorkflows={customWorkflows}
            isLoading={isLoading.templates || isLoading.workflows}
            onTemplateSelect={handleTemplateSelect}
            onWorkflowSelect={handleWorkflowSelect}
          />
        )}

        {activeTab === 'editor' && (
          <WorkflowSettingsEditor 
            templateId={selectedTemplate}
            workflowId={selectedWorkflow}
            onSave={() => {
              loadCustomWorkflows();
              refreshStats();
            }}
          />
        )}

        {activeTab === 'sla' && (
          <SLASettingsEditor 
            templateId={selectedTemplate}
            workflowId={selectedWorkflow}
            onSave={() => loadCustomWorkflows()}
          />
        )}

        {activeTab === 'exception' && (
          <ExceptionFlowEditor 
            templateId={selectedTemplate}
            workflowId={selectedWorkflow}
            onSave={() => loadCustomWorkflows()}
          />
        )}

        {activeTab === 'settings' && settings && (
          <WorkflowSettings 
            settings={settings}
            isLoading={isLoading.settings}
            onSave={() => loadSettings()}
          />
        )}

        {/* Mensagem quando funcionalidade está em desenvolvimento */}
        {!settings && activeTab === 'settings' && !isLoading.settings && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium">Funcionalidade em desenvolvimento</p>
            <p className="mt-1">As configurações de workflow serão disponibilizadas em breve.</p>
          </div>
        )}
      </div>
    </div>
  );
};