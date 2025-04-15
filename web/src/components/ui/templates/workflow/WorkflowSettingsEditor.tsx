/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Loader2, Save, X, PlusCircle, Download, Upload, ArrowLeft } from 'lucide-react';
import { useWorkflow } from '@/hooks/workflows/useWorkflow';
import { IWorkflowTemplate, ICustomWorkflow, IWorkflowNode } from '@/types/workflow/workflow-types';

interface WorkflowSettingsEditorProps {
  templateId: string | null;
  workflowId: string | null;
  onSave: () => void;
}

export const WorkflowSettingsEditor: React.FC<WorkflowSettingsEditorProps> = ({ 
  templateId, 
  workflowId, 
  onSave 
}) => {
  const { 
    templates, 
    customWorkflows,
    isLoading,
    error,
    createCustomWorkflow,
    updateCustomWorkflow,
    exportWorkflow,
    importWorkflow
  } = useWorkflow();

  const [selectedTemplate, setSelectedTemplate] = useState<IWorkflowTemplate | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ICustomWorkflow | null>(null);
  const [isNewWorkflow, setIsNewWorkflow] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Formulário
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    nodes: [] as IWorkflowNode[],
    status: 'draft' as 'draft' | 'active' | 'inactive' | 'archived'
  });

  // Carrega template ou workflow quando os IDs mudarem
  useEffect(() => {
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setSelectedTemplate(template);
        setSelectedWorkflow(null);
        setIsNewWorkflow(true);
        setFormData({
          name: `${template.name} - Personalizado`,
          description: template.description,
          category: template.category,
          nodes: JSON.parse(JSON.stringify(template.baseNodes)), // Deep copy
          status: 'draft'
        });
      }
    } else if (workflowId) {
      const workflow = customWorkflows.find(w => w.id === workflowId);
      if (workflow) {
        setSelectedWorkflow(workflow);
        setSelectedTemplate(null);
        setIsNewWorkflow(false);
        setFormData({
          name: workflow.name,
          description: workflow.description,
          category: workflow.category,
          nodes: JSON.parse(JSON.stringify(workflow.nodes)), // Deep copy
          status: workflow.status
        });
      }
    } else {
      // Novo workflow em branco
      setSelectedTemplate(null);
      setSelectedWorkflow(null);
      setIsNewWorkflow(true);
      setFormData({
        name: 'Novo Workflow',
        description: 'Descrição do novo workflow',
        category: 'geral',
        nodes: [],
        status: 'draft'
      });
    }
  }, [templateId, workflowId, templates, customWorkflows]);

  // Lidar com mudanças no formulário
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Função para salvar o workflow
  const handleSaveWorkflow = async () => {
    setIsSaving(true);
    try {
      if (isNewWorkflow) {
        await createCustomWorkflow(templateId || '', {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          nodes: formData.nodes,
          status: formData.status
        });
      } else if (selectedWorkflow) {
        await updateCustomWorkflow(selectedWorkflow.id, {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          nodes: formData.nodes,
          status: formData.status
        });
      }
      
      onSave();
    } catch (error) {
      console.error('Erro ao salvar workflow:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Exportar workflow como JSON
  const handleExportWorkflow = async () => {
    if (!selectedWorkflow) return;
    
    try {
      const jsonData = await exportWorkflow(selectedWorkflow.id);
      if (!jsonData) {
        console.error('Erro: Dados do workflow estão vazios.');
        return;
      }
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `workflow-${selectedWorkflow.id}.json`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    } catch (error) {
      console.error('Erro ao exportar workflow:', error);
    }
  };

  // Importar workflow a partir de JSON
  const handleImportWorkflow = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const jsonData = event.target?.result as string;
          await importWorkflow(jsonData);
          onSave();
        } catch (error) {
          console.error('Erro ao importar workflow:', error);
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  // Estado de carregamento
  if (isLoading.templates || isLoading.workflows) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Carregando editor de workflow...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {isNewWorkflow ? 'Criar Novo Workflow' : 'Editar Workflow'}
        </h3>
        
        <div className="flex space-x-3">
          {selectedWorkflow && (
            <button
              type="button"
              onClick={handleExportWorkflow}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>
          )}
          
          <button
            type="button"
            onClick={handleImportWorkflow}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          <div className="flex">
            <X className="h-5 w-5 mr-3 text-red-500" />
            <div>
              <h3 className="text-sm font-medium">Erro ao carregar dados</h3>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulário de edição */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome do Workflow
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Categoria
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="geral">Geral</option>
              <option value="cirurgias">Cirurgias</option>
              <option value="diagnósticos">Diagnósticos</option>
              <option value="emergência">Emergência</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value as any)}
              className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="draft">Rascunho</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>
          
          {/* Área do Editor de Workflow (Simplificado para este exemplo) */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nós do Workflow ({formData.nodes.length})
              </h4>
              <button
                type="button"
                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/40"
              >
                <PlusCircle className="h-3 w-3 mr-1" />
                Adicionar Nó
              </button>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Para uma experiência completa de edição de workflows, acesse o Editor Visual.
              </p>
              <button className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Abrir Editor Visual
              </button>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 sm:px-6 flex justify-end">
          <button
            type="button"
            onClick={handleSaveWorkflow}
            disabled={isSaving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                <span>Salvar Workflow</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};