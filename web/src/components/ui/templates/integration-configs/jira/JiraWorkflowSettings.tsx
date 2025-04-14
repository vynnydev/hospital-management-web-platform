import React, { useState } from 'react';
import { Info, Plus, Trash2 } from 'lucide-react';
import { IJiraConfig } from '@/types/integrations-configs/jira-software-types';

interface IJiraWorkflowSettingsProps {
  settings: Partial<IJiraConfig>;
  updateSettings: (updates: Partial<IJiraConfig>) => void;
}

interface CustomField {
  id: string;
  name: string;
  fieldId: string;
}

export const JiraWorkflowSettings: React.FC<IJiraWorkflowSettingsProps> = ({
  settings,
  updateSettings
}) => {
  // Estado para novo campo customizado
  const [newCustomField, setNewCustomField] = useState<CustomField>({
    id: '',
    name: '',
    fieldId: ''
  });

  // Atualizar mapeamento de workflow
  const updateWorkflowMapping = (key: keyof IJiraConfig['workflowMapping'], value: string) => {
    const workflowMapping = {
      appointment: settings.workflowMapping?.appointment || '',
      emergency: settings.workflowMapping?.emergency || '',
      surgery: settings.workflowMapping?.surgery || '',
      transfer: settings.workflowMapping?.transfer || '',
      discharge: settings.workflowMapping?.discharge || '',
      medication: settings.workflowMapping?.medication || '',
      [key]: value
    };
    
    updateSettings({ workflowMapping });
  };

  // Adicionar campo customizado
  const addCustomField = () => {
    if (newCustomField.name && newCustomField.fieldId) {
      const customFields = [...(settings.customFields || [])];
      customFields.push({
        ...newCustomField,
        id: `cf-${Date.now()}`
      });
      
      updateSettings({ customFields });
      
      // Resetar o form
      setNewCustomField({
        id: '',
        name: '',
        fieldId: ''
      });
    }
  };

  // Remover campo customizado
  const removeCustomField = (id: string) => {
    const customFields = settings.customFields?.filter(field => field.id !== id) || [];
    updateSettings({ customFields });
  };

  return (
    <div className="space-y-6">
      {/* Mapeamento de Workflow */}
      <div>
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Mapeamento de Workflow</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Defina como os tipos de eventos do hospital são mapeados para status no Jira.
        </p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="workflow-appointment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Consultas
              </label>
              <input
                id="workflow-appointment"
                type="text"
                value={settings.workflowMapping?.appointment || ''}
                onChange={(e) => updateWorkflowMapping('appointment', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="Consulta Médica"
              />
            </div>
            
            <div>
              <label htmlFor="workflow-emergency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Emergências
              </label>
              <input
                id="workflow-emergency"
                type="text"
                value={settings.workflowMapping?.emergency || ''}
                onChange={(e) => updateWorkflowMapping('emergency', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="Emergência"
              />
            </div>
            
            <div>
              <label htmlFor="workflow-surgery" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cirurgias
              </label>
              <input
                id="workflow-surgery"
                type="text"
                value={settings.workflowMapping?.surgery || ''}
                onChange={(e) => updateWorkflowMapping('surgery', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="Cirurgia"
              />
            </div>
            
            <div>
              <label htmlFor="workflow-transfer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Transferências
              </label>
              <input
                id="workflow-transfer"
                type="text"
                value={settings.workflowMapping?.transfer || ''}
                onChange={(e) => updateWorkflowMapping('transfer', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="Transferência"
              />
            </div>
            
            <div>
              <label htmlFor="workflow-discharge" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Altas
              </label>
              <input
                id="workflow-discharge"
                type="text"
                value={settings.workflowMapping?.discharge || ''}
                onChange={(e) => updateWorkflowMapping('discharge', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="Alta Hospitalar"
              />
            </div>
            
            <div>
              <label htmlFor="workflow-medication" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Medicações
              </label>
              <input
                id="workflow-medication"
                type="text"
                value={settings.workflowMapping?.medication || ''}
                onChange={(e) => updateWorkflowMapping('medication', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="Medicação"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Campos Personalizados */}
      <div className="pt-4">
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Campos Personalizados</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Configure campos personalizados do Jira para receber dados específicos do hospital.
        </p>
        
        <div className="space-y-4">
          {/* Lista de campos personalizados */}
          <div className="space-y-3 mb-4">
            {(settings.customFields || []).map((field) => (
              <div key={field.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{field.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID do Campo: {field.fieldId}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomField(field.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  aria-label="Remover campo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {(!settings.customFields || settings.customFields.length === 0) && (
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum campo personalizado configurado. Adicione campos abaixo.
                </p>
              </div>
            )}
          </div>

          {/* Formulário para adicionar novo campo */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Adicionar Campo Personalizado</h4>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="custom-field-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome do Campo
                  </label>
                  <input
                    id="custom-field-name"
                    type="text"
                    value={newCustomField.name}
                    onChange={(e) => setNewCustomField({ ...newCustomField, name: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                    placeholder="Ex: ID do Paciente"
                  />
                </div>
                <div>
                  <label htmlFor="custom-field-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ID do Campo no Jira
                  </label>
                  <input
                    id="custom-field-id"
                    type="text"
                    value={newCustomField.fieldId}
                    onChange={(e) => setNewCustomField({ ...newCustomField, fieldId: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                    placeholder="Ex: customfield_10001"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addCustomField}
                  disabled={!newCustomField.name || !newCustomField.fieldId}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Campo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações sobre campos personalizados */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start">
        <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium mb-1">Sobre Campos Personalizados</p>
          <p>
            Para encontrar o ID de um campo personalizado no Jira, você pode:
          </p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Abrir uma issue no Jira</li>
            <li>Pressionar F12 para abrir as ferramentas de desenvolvedor</li>
            <li>Inspecionar o campo personalizado desejado</li>
            <li>Procurar por um atributo como &quot;data-field-id&quot; ou &quot;id&quot; que contenha algo como &quot;customfield_XXXXX&quot;</li>
          </ol>
        </div>
      </div>
    </div>
  );
};