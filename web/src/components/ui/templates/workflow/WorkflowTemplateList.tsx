import React, { useState } from 'react';
import { 
  Clipboard, FileCheck, Stethoscope, Building2, CalendarCheck, 
  Pill, Loader2, AlertTriangle, User, ArrowRight, Activity,
  Heart, Search, GitBranch
} from 'lucide-react';
import { IWorkflowTemplate, ICustomWorkflow } from '@/types/workflow/workflow-types';

interface WorkflowTemplateListProps {
  templates: IWorkflowTemplate[];
  customWorkflows: ICustomWorkflow[];
  isLoading: boolean;
  onTemplateSelect: (templateId: string) => void;
  onWorkflowSelect: (workflowId: string) => void;
}

// Função para obter o ícone correto
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Clipboard': return <Clipboard className="w-6 h-6" />;
    case 'FileCheck': return <FileCheck className="w-6 h-6" />;
    case 'Stethoscope': return <Stethoscope className="w-6 h-6" />;
    case 'Building2': return <Building2 className="w-6 h-6" />;
    case 'CalendarCheck': return <CalendarCheck className="w-6 h-6" />;
    case 'Pill': return <Pill className="w-6 h-6" />;
    case 'User': return <User className="w-6 h-6" />;
    case 'Heart': return <Heart className="w-6 h-6" />;
    case 'Activity': return <Activity className="w-6 h-6" />;
    case 'GitBranch': return <GitBranch className="w-6 h-6" />;
    default: return <Clipboard className="w-6 h-6" />;
  }
};

// Função para obter a cor de fundo do ícone
const getIconBgColor = (color: string) => {
  switch (color) {
    case 'blue': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    case 'green': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
    case 'orange': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
    case 'purple': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
    case 'red': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
    case 'cyan': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400';
    case 'amber': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
    case 'indigo': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400';
    case 'pink': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400';
    case 'teal': return 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400';
    default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
  }
};

export const WorkflowTemplateList: React.FC<WorkflowTemplateListProps> = ({ 
  templates, 
  customWorkflows, 
  isLoading, 
  onTemplateSelect, 
  onWorkflowSelect
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'recentes'>('templates');

  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Carregando processos...</p>
      </div>
    );
  }

  // Sem resultados
  if (templates.length === 0 && customWorkflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Nenhum processo encontrado
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Tente ajustar seus filtros ou criar um novo processo.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Abas para alternar entre templates e fluxos recentes */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeTab === 'templates'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Templates Disponíveis
        </button>
        
        <button
          onClick={() => setActiveTab('recentes')}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeTab === 'recentes'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Fluxos Personalizados
        </button>
      </div>

      {/* Templates de processos */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div 
              key={template.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-300 cursor-pointer"
              onClick={() => onTemplateSelect(template.id)}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${
                    getIconBgColor(template.baseNodes[0]?.color || 'gray')
                  }`}>
                    {typeof template.baseNodes[0]?.icon === 'function' ? React.createElement(template.baseNodes[0].icon, { className: "w-6 h-6" }) : <Clipboard className="w-6 h-6" />}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                      {template.category === 'geral' ? 'Geral' : 
                      template.category === 'cirurgias' ? 'Cirurgias' : 
                      template.category === 'diagnósticos' ? 'Diagnósticos' : 
                      template.category === 'emergência' ? 'Emergência' : 
                      template.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{template.baseNodes.length} etapas</span>
                  <span>{template.slaSettings.length} alertas</span>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/30 flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Usar Template
                </span>
                <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fluxos personalizados */}
      {activeTab === 'recentes' && (
        <div>
          {customWorkflows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customWorkflows.map((workflow) => (
                <div 
                  key={workflow.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  onClick={() => onWorkflowSelect(workflow.id)}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${
                        getIconBgColor(workflow.nodes[0]?.color || 'gray')
                      }`}>
                        {getIconComponent(workflow.nodes[0]?.icon as unknown as string)}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {workflow.name}
                        </h3>
                        <div className="flex items-center">
                          <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 mr-2">
                            {workflow.category === 'geral' ? 'Geral' : 
                            workflow.category === 'cirurgias' ? 'Cirurgias' : 
                            workflow.category === 'diagnósticos' ? 'Diagnósticos' : 
                            workflow.category === 'emergência' ? 'Emergência' : 
                            workflow.category}
                          </span>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            workflow.status === 'active' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                            workflow.status === 'draft' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                            'bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                          }`}>
                            {workflow.status === 'active' ? 'Ativo' : 
                            workflow.status === 'draft' ? 'Rascunho' :
                            workflow.status === 'inactive' ? 'Inativo' : 'Arquivado'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {workflow.description}
                    </p>
                    
                    {workflow.stats && (
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded-md">
                          <span className="font-medium">{workflow.stats.completed}</span>
                          <span>Concluídos</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded-md">
                          <span className="font-medium">{workflow.stats.inProgress}</span>
                          <span>Em Progresso</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded-md">
                          <span className="font-medium">{workflow.stats.efficiency}%</span>
                          <span>Eficiência</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{workflow.nodes.length} etapas</span>
                      <span>Última execução: {new Date(workflow.lastRun || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/30 flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Editar Workflow
                    </span>
                    <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
              <AlertTriangle className="w-10 h-10 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
                Nenhum fluxo personalizado encontrado
              </h3>
              <p className="text-blue-600 dark:text-blue-400 mb-4">
                Escolha um template para criar seu primeiro fluxo de trabalho personalizado.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};