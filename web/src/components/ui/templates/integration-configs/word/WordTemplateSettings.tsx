import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { IWordConfig } from '@/types/integrations-configs/microsoft-word-types';

interface WordTemplateSettingsProps {
  settings: Partial<IWordConfig>;
  updateSettings: (updates: Partial<IWordConfig>) => void;
}

export const WordTemplateSettings: React.FC<WordTemplateSettingsProps> = ({
  settings,
  updateSettings
}) => {
  // Estado local para o novo template
  const [newTemplate, setNewTemplate] = useState({
    id: '',
    name: '',
    description: ''
  });

  // Adicionar novo template
  const addTemplate = () => {
    if (newTemplate.id && newTemplate.name) {
      const updatedTemplates = [...(settings.templates || []), { ...newTemplate }];
      updateSettings({ templates: updatedTemplates });
      setNewTemplate({ id: '', name: '', description: '' });
    }
  };

  // Remover template
  const removeTemplate = (id: string) => {
    const updatedTemplates = settings.templates?.filter(t => t.id !== id) || [];
    updateSettings({ templates: updatedTemplates });
  };

  // Validação para verificar se podemos adicionar um novo template
  const canAddTemplate = newTemplate.id.trim() !== '' && newTemplate.name.trim() !== '';

  return (
    <div className="pt-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Templates</h3>
      
      {/* Lista de templates existentes */}
      <div className="space-y-3 mb-4">
        {settings.templates?.map((template) => (
          <div key={template.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
              <span className="text-xs text-gray-400 dark:text-gray-500">ID: {template.id}</span>
            </div>
            <button
              type="button"
              onClick={() => removeTemplate(template.id)}
              className="text-red-500 hover:text-red-700 p-1"
              aria-label="Remover template"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}

        {(!settings.templates || settings.templates.length === 0) && (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            Nenhum template adicionado
          </p>
        )}
      </div>

      {/* Formulário para adicionar novo template */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Adicionar Template</h4>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="template-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                ID do Template
              </label>
              <input
                id="template-id"
                type="text"
                value={newTemplate.id}
                onChange={(e) => setNewTemplate({ ...newTemplate, id: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="template_id"
              />
            </div>
            <div>
              <label htmlFor="template-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome
              </label>
              <input
                id="template-name"
                type="text"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="Nome do Template"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="template-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <input
              id="template-description"
              type="text"
              value={newTemplate.description}
              onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
              placeholder="Breve descrição do modelo"
            />
          </div>
          
          <div className="mt-2">
            <button
              type="button"
              onClick={addTemplate}
              disabled={!canAddTemplate}
              className={`px-4 py-2 flex items-center justify-center rounded-md text-white ${
                canAddTemplate 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};