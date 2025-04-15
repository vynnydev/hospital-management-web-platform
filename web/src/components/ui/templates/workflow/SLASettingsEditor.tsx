import React, { useState, useEffect } from 'react';
import { Clock, Save, PlusCircle, X, AlertTriangle } from 'lucide-react';
import { useWorkflow } from '@/hooks/workflows/useWorkflow';
import {
  IWorkflowTemplate, 
  ICustomWorkflow, 
  ISLASetting,
  TTimeUnit
} from '@/types/workflow/workflow-types';

interface ISLASettingsEditorProps {
  templateId: string | null;
  workflowId: string | null;
  onSave: () => void;
}

export const SLASettingsEditor: React.FC<ISLASettingsEditorProps> = ({ templateId, workflowId, onSave }) => {
  const { 
    templates, 
    customWorkflows, 
    isLoading,
    error,
    updateCustomWorkflow
  } = useWorkflow();

  const [selectedTemplate, setSelectedTemplate] = useState<IWorkflowTemplate | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ICustomWorkflow | null>(null);
  const [slaSettings, setSLASettings] = useState<ISLASetting[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Controlando um novo SLA a ser adicionado
  const [newSLA, setNewSLA] = useState<ISLASetting>({
    departmentId: '',
    maxTime: 15,
    timeUnit: 'minute',
    alertAt: 10
  });

  // Carrega template ou workflow quando os IDs mudarem
  useEffect(() => {
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setSelectedTemplate(template);
        setSelectedWorkflow(null);
        setSLASettings(JSON.parse(JSON.stringify(template.slaSettings)));
      }
    } else if (workflowId) {
      const workflow = customWorkflows.find(w => w.id === workflowId);
      if (workflow) {
        setSelectedWorkflow(workflow);
        setSelectedTemplate(null);
        setSLASettings(workflow.slaSettings || []);
      }
    } else {
      setSelectedTemplate(null);
      setSelectedWorkflow(null);
      setSLASettings([]);
    }
  }, [templateId, workflowId, templates, customWorkflows]);

  // Função para adicionar um novo SLA
  const handleAddSLA = () => {
    // Verificar se o departamento já possui um SLA
    if (slaSettings.some(sla => sla.departmentId === newSLA.departmentId)) {
      return; // Já existe um SLA para este departamento
    }
    
    setSLASettings([...slaSettings, { ...newSLA }]);
    
    // Reset do formulário de novo SLA
    setNewSLA({
      departmentId: '',
      maxTime: 15,
      timeUnit: 'minute',
      alertAt: 10
    });
  };

  // Função para atualizar um SLA existente
  const handleUpdateSLA = (index: number, field: keyof ISLASetting, value: string | number) => {
    const updatedSettings = [...slaSettings];
    
    if (field === 'timeUnit') {
      updatedSettings[index][field] = value as TTimeUnit;
    } else {
      if (field in updatedSettings[index]) {
        ((updatedSettings[index] as unknown) as Record<string, unknown>)[field] = value;
      }
    }
    
    setSLASettings(updatedSettings);
  };

  // Função para remover um SLA
  const handleRemoveSLA = (index: number) => {
    const updatedSettings = [...slaSettings];
    updatedSettings.splice(index, 1);
    setSLASettings(updatedSettings);
  };

  // Função para salvar as configurações de SLA
  const handleSaveSLAs = async () => {
    if (!selectedWorkflow) return;
    
    setIsSaving(true);
    try {
      await updateCustomWorkflow(selectedWorkflow.id, {
        slaSettings: slaSettings
      });
      
      onSave();
    } catch (error) {
      console.error('Erro ao salvar SLAs:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Obter departamentos disponíveis
  const getAvailableDepartments = () => {
    const workflow = selectedWorkflow || selectedTemplate;
    if (!workflow) return [];
    
    const nodes = selectedWorkflow?.nodes || selectedTemplate?.baseNodes || [];
    return nodes.map(node => ({
      id: node.id,
      label: node.label
    }));
  };

  // Estado de carregamento
  if (isLoading.templates || isLoading.workflows) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-500 dark:text-gray-400 mt-4">Carregando editor de SLAs...</p>
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
          Selecione um template ou workflow para configurar os SLAs.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Configuração de SLAs
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

      {/* Lista de SLAs configurados */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            SLAs Configurados
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Defina tempos máximos e alertas para cada etapa do processo
          </p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Departamento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tempo Máximo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Unidade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Alerta em
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {slaSettings.length > 0 ? (
                slaSettings.map((sla, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <select
                        value={sla.departmentId}
                        onChange={(e) => handleUpdateSLA(index, 'departmentId', e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                      <input
                        type="number"
                        min="1"
                        value={sla.maxTime}
                        onChange={(e) => handleUpdateSLA(index, 'maxTime', parseInt(e.target.value))}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
                        disabled={!selectedWorkflow}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <select
                        value={sla.timeUnit}
                        onChange={(e) => handleUpdateSLA(index, 'timeUnit', e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        disabled={!selectedWorkflow}
                      >
                        <option value="minute">Minutos</option>
                        <option value="hour">Horas</option>
                        <option value="day">Dias</option>
                        <option value="week">Semanas</option>
                        <option value="month">Meses</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <input
                        type="number"
                        min="1"
                        value={sla.alertAt}
                        onChange={(e) => handleUpdateSLA(index, 'alertAt', parseInt(e.target.value))}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
                        disabled={!selectedWorkflow}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {selectedWorkflow && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSLA(index)}
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
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                    Nenhum SLA configurado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulário para adicionar novo SLA */}
      {selectedWorkflow && (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Adicionar Novo SLA
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Configure um novo SLA para um departamento
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Departamento
                </label>
                <select
                  id="department"
                  value={newSLA.departmentId}
                  onChange={(e) => setNewSLA({ ...newSLA, departmentId: e.target.value })}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                >
                  <option value="">Selecione...</option>
                  {getAvailableDepartments()
                    .filter(dept => !slaSettings.some(sla => sla.departmentId === dept.id))
                    .map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.label}
                      </option>
                    ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="maxTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tempo Máximo
                </label>
                <input
                  type="number"
                  id="maxTime"
                  min="1"
                  value={newSLA.maxTime}
                  onChange={(e) => setNewSLA({ ...newSLA, maxTime: parseInt(e.target.value) })}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="timeUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Unidade
                </label>
                <select
                  id="timeUnit"
                  value={newSLA.timeUnit}
                  onChange={(e) => setNewSLA({ ...newSLA, timeUnit: e.target.value as TTimeUnit })}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                >
                  <option value="minute">Minutos</option>
                  <option value="hour">Horas</option>
                  <option value="day">Dias</option>
                  <option value="week">Semanas</option>
                  <option value="month">Meses</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="alertAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alerta em
                </label>
                <input
                  type="number"
                  id="alertAt"
                  min="1"
                  value={newSLA.alertAt}
                  onChange={(e) => setNewSLA({ ...newSLA, alertAt: parseInt(e.target.value) })}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleAddSLA}
                disabled={!newSLA.departmentId}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar SLA
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
            onClick={handleSaveSLAs}
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
                <span>Salvar SLAs</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Aviso quando um template está selecionado */}
      {selectedTemplate && !selectedWorkflow && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
          <Clock className="w-10 h-10 text-blue-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
            Visualizando SLAs do Template
          </h3>
          <p className="text-blue-600 dark:text-blue-400 mb-4">
            Para editar os SLAs, crie um workflow a partir deste template.
          </p>
        </div>
      )}
    </div>
  );
};