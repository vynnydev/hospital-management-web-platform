import React, { useState, useEffect } from 'react';
import { AlertTriangle, Save, PlusCircle, X, GitBranch } from 'lucide-react';
import { useWorkflow } from '@/hooks/workflows/useWorkflow';
import { 
  IWorkflowTemplate, 
  ICustomWorkflow, 
  IExceptionFlow,
  TPriority
} from '@/types/workflow/workflow-types';

interface ExceptionFlowEditorProps {
  templateId: string | null;
  workflowId: string | null;
  onSave: () => void;
}

export const ExceptionFlowEditor: React.FC<ExceptionFlowEditorProps> = ({ 
  templateId, 
  workflowId, 
  onSave 
}) => {
  const { 
    templates, 
    customWorkflows, 
    isLoading,
    error,
    updateCustomWorkflow
  } = useWorkflow();

  const [selectedTemplate, setSelectedTemplate] = useState<IWorkflowTemplate | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ICustomWorkflow | null>(null);
  const [exceptionFlows, setExceptionFlows] = useState<IExceptionFlow[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Controlando uma nova exceção a ser adicionada
  const [newException, setNewException] = useState<IExceptionFlow>({
    condition: '',
    targetDepartment: '',
    priority: 'medium'
  });

  // Carrega template ou workflow quando os IDs mudarem
  useEffect(() => {
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setSelectedTemplate(template);
        setSelectedWorkflow(null);
        setExceptionFlows(JSON.parse(JSON.stringify(template.exceptionFlows)));
      }
    } else if (workflowId) {
      const workflow = customWorkflows.find(w => w.id === workflowId);
      if (workflow) {
        setSelectedWorkflow(workflow);
        setSelectedTemplate(null);
        setExceptionFlows(workflow.exceptionFlows || []);
      }
    } else {
      setSelectedTemplate(null);
      setSelectedWorkflow(null);
      setExceptionFlows([]);
    }
  }, [templateId, workflowId, templates, customWorkflows]);

  // Função para adicionar uma nova exceção
  const handleAddException = () => {
    // Verificar se a condição já existe
    if (exceptionFlows.some(ex => ex.condition === newException.condition)) {
      return; // Condição já existe
    }
    
    setExceptionFlows([...exceptionFlows, { ...newException }]);
    
    // Reset do formulário de nova exceção
    setNewException({
      condition: '',
      targetDepartment: '',
      priority: 'medium'
    });
  };

  // Função para atualizar uma exceção existente
  const handleUpdateException = (index: number, field: keyof IExceptionFlow, value: string) => {
    const updatedFlows = [...exceptionFlows];
    
    if (field === 'priority') {
      updatedFlows[index][field] = value as TPriority;
    } else {
      updatedFlows[index][field] = value;
    }
    
    setExceptionFlows(updatedFlows);
  };

  // Função para remover uma exceção
  const handleRemoveException = (index: number) => {
    const updatedFlows = [...exceptionFlows];
    updatedFlows.splice(index, 1);
    setExceptionFlows(updatedFlows);
  };

  // Função para salvar as configurações de exceção
  const handleSaveExceptions = async () => {
    if (!selectedWorkflow) return;
    
    setIsSaving(true);
    try {
      await updateCustomWorkflow(selectedWorkflow.id, {
        exceptionFlows: exceptionFlows
      });
      
      onSave();
    } catch (error) {
      console.error('Erro ao salvar fluxos de exceção:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Obter departamentos disponíveis para redirecionamento
  const getAvailableDepartments = () => {
    // Aqui poderíamos buscar todos os departamentos disponíveis
    // Por enquanto, vamos usar uma lista estática para exemplo
    return [
      { id: 'emergency', label: 'Emergência' },
      { id: 'icu', label: 'UTI' },
      { id: 'surgery', label: 'Centro Cirúrgico' },
      { id: 'intensive_care', label: 'Terapia Intensiva' },
      { id: 'pharmacy', label: 'Farmácia' },
      { id: 'laboratory', label: 'Laboratório' },
      { id: 'radiology', label: 'Radiologia' },
      { id: 'admin_manager', label: 'Gerência Administrativa' },
      { id: 'social_service', label: 'Serviço Social' },
      { id: 'nursing', label: 'Enfermagem' },
      { id: 'reception', label: 'Recepção' },
      { id: 'triage', label: 'Triagem' }
    ];
  };

  // Estado de carregamento
  if (isLoading.templates || isLoading.workflows) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="text-gray-500 dark:text-gray-400 mt-4">Carregando editor de fluxos de exceção...</p>
      </div>
    );
  }

  // Mensagem caso nenhum workflow esteja selecionado
  if (!selectedWorkflow && !selectedTemplate) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg text-center">
        <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-2">
          Nenhum workflow selecionado
        </h3>
        <p className="text-yellow-600 dark:text-yellow-400 mb-4">
          Selecione um template ou workflow para configurar os fluxos de exceção.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <GitBranch className="w-5 h-5 mr-2" />
          Fluxos de Exceção
          {selectedWorkflow && <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm font-normal">({selectedWorkflow.name})</span>}
          {selectedTemplate && <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm font-normal">(Template: {selectedTemplate.name})</span>}
        </h3>
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

      <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-lg p-4 mb-6">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">Sobre Fluxos de Exceção</p>
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
              Fluxos de exceção definem caminhos alternativos em caso de situações especiais durante 
              o processo normal. Eles permitem redirecionar o fluxo para departamentos específicos com 
              prioridades ajustadas, garantindo resposta rápida a condições não previstas.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Fluxos de Exceção configurados */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Fluxos de Exceção Configurados
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Defina condições especiais e redirecionamentos para situações excepcionais
          </p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Condição
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Departamento Alvo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Prioridade
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {exceptionFlows.length > 0 ? (
                exceptionFlows.map((exception, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <input
                        type="text"
                        value={exception.condition}
                        onChange={(e) => handleUpdateException(index, 'condition', e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        disabled={!selectedWorkflow}
                        placeholder="Ex: Paciente com risco de vida"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <select
                        value={exception.targetDepartment}
                        onChange={(e) => handleUpdateException(index, 'targetDepartment', e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        disabled={!selectedWorkflow}
                      >
                        {getAvailableDepartments().map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <select
                        value={exception.priority}
                        onChange={(e) => handleUpdateException(index, 'priority', e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        disabled={!selectedWorkflow}
                      >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                        <option value="critical">Crítica</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {selectedWorkflow && (
                        <button
                          type="button"
                          onClick={() => handleRemoveException(index)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                    Nenhum fluxo de exceção configurado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulário para adicionar nova exceção */}
      {selectedWorkflow && (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Adicionar Novo Fluxo de Exceção
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Configure um novo caminho para situações excepcionais
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Condição
                </label>
                <input
                  type="text"
                  id="condition"
                  value={newException.condition}
                  onChange={(e) => setNewException({ ...newException, condition: e.target.value })}
                  className="mt-1 block w-full shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Ex: Paciente com risco de vida"
                />
              </div>
              
              <div>
                <label htmlFor="targetDepartment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Departamento Alvo
                </label>
                <select
                  id="targetDepartment"
                  value={newException.targetDepartment}
                  onChange={(e) => setNewException({ ...newException, targetDepartment: e.target.value })}
                  className="mt-1 block w-full shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                >
                  <option value="">Selecione...</option>
                  {getAvailableDepartments().map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prioridade
                </label>
                <select
                  id="priority"
                  value={newException.priority}
                  onChange={(e) => setNewException({ ...newException, priority: e.target.value as TPriority })}
                  className="mt-1 block w-full shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleAddException}
                disabled={!newException.condition || !newException.targetDepartment}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none disabled:opacity-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Exceção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botão de salvar */}
      {selectedWorkflow && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSaveExceptions}
            disabled={isSaving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none disabled:opacity-50"
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
                <span>Salvar Fluxos de Exceção</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Aviso quando um template está selecionado */}
      {selectedTemplate && !selectedWorkflow && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
          <GitBranch className="w-10 h-10 text-blue-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
            Visualizando Fluxos de Exceção do Template
          </h3>
          <p className="text-blue-600 dark:text-blue-400 mb-4">
            Para editar os fluxos de exceção, crie um workflow a partir deste template.
          </p>
        </div>
      )}
    </div>
  );
};