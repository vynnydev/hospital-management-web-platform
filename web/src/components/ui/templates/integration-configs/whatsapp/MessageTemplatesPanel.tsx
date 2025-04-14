/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { IMessageTemplate } from '@/types/integrations-configs/whatsapp-types';

interface MessageTemplatesPanelProps {
  templates: IMessageTemplate[];
  onChange: (templates: IMessageTemplate[]) => void;
}

export const MessageTemplatesPanel: React.FC<MessageTemplatesPanelProps> = ({
  templates,
  onChange
}) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Estado para o template em edição ou novo template
  const [currentTemplate, setCurrentTemplate] = useState<IMessageTemplate>({
    id: '',
    name: '',
    content: '',
    category: 'notification',
    variables: [],
    isActive: true
  });
  
  // Novo nome de variável para adicionar
  const [newVariable, setNewVariable] = useState('');
  
  // Adicionar uma nova variável ao template atual
  const addVariable = () => {
    if (newVariable && !currentTemplate.variables.includes(newVariable)) {
      setCurrentTemplate({
        ...currentTemplate,
        variables: [...currentTemplate.variables, newVariable]
      });
      setNewVariable('');
    }
  };
  
  // Remover uma variável do template atual
  const removeVariable = (variable: string) => {
    setCurrentTemplate({
      ...currentTemplate,
      variables: currentTemplate.variables.filter(v => v !== variable)
    });
  };
  
  // Iniciar edição de um template existente
  const startEdit = (template: IMessageTemplate) => {
    setCurrentTemplate({ ...template });
    setEditMode(template.id);
    setShowAddForm(false);
  };
  
  // Iniciar criação de um novo template
  const startAdd = () => {
    // Gerar um ID único
    const newId = `template_${Date.now()}`;
    setCurrentTemplate({
      id: newId,
      name: '',
      content: '',
      category: 'notification',
      variables: [],
      isActive: true
    });
    setShowAddForm(true);
    setEditMode(null);
  };
  
  // Cancelar edição ou adição
  const cancelEdit = () => {
    setEditMode(null);
    setShowAddForm(false);
  };
  
  // Salvar um template (novo ou editado)
  const saveTemplate = () => {
    if (currentTemplate.name && currentTemplate.content) {
      let newTemplates: IMessageTemplate[];
      
      if (editMode) {
        // Editando um template existente
        newTemplates = templates.map(template => 
          template.id === editMode ? { ...currentTemplate } : template
        );
      } else {
        // Adicionando um novo template
        newTemplates = [...templates, { ...currentTemplate }];
      }
      
      onChange(newTemplates);
      setEditMode(null);
      setShowAddForm(false);
    }
  };
  
  // Remover um template
  const removeTemplate = (id: string) => {
    onChange(templates.filter(template => template.id !== id));
  };
  
  // Alternar status ativo de um template
  const toggleTemplateStatus = (id: string) => {
    onChange(templates.map(template => 
      template.id === id ? { ...template, isActive: !template.isActive } : template
    ));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Templates de Mensagem</h3>
        <button
          type="button"
          onClick={startAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          disabled={showAddForm || editMode !== null}
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Template
        </button>
      </div>
      
      {/* Formulário de adição/edição */}
      {(showAddForm || editMode) && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {editMode ? 'Editar Template' : 'Novo Template'}
            </h4>
            <button
              type="button"
              onClick={cancelEdit}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="template-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome do Template
              </label>
              <input
                id="template-name"
                type="text"
                value={currentTemplate.name}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="Nome do template"
              />
            </div>
            
            <div>
              <label htmlFor="template-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Categoria
              </label>
              <select
                id="template-category"
                value={currentTemplate.category}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, category: e.target.value as any })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
              >
                <option value="appointment">Agendamento</option>
                <option value="reminder">Lembrete</option>
                <option value="notification">Notificação</option>
                <option value="marketing">Marketing</option>
                <option value="other">Outro</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="template-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Conteúdo da Mensagem
              </label>
              <textarea
                id="template-content"
                value={currentTemplate.content}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, content: e.target.value })}
                rows={4}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="Digite o conteúdo da mensagem. Use {{variavel}} para inserir variáveis."
              ></textarea>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Use {'{{nome_variavel}}'} para inserir variáveis dinâmicas.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Variáveis
              </label>
              
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newVariable}
                  onChange={(e) => setNewVariable(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-l-md"
                  placeholder="Nome da variável"
                />
                <button
                  type="button"
                  onClick={addVariable}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  disabled={!newVariable}
                >
                  Adicionar
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {currentTemplate.variables.map((variable) => (
                  <div 
                    key={variable}
                    className="flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full"
                  >
                    <span>{variable}</span>
                    <button
                      type="button"
                      onClick={() => removeVariable(variable)}
                      className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {currentTemplate.variables.length === 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Nenhuma variável definida
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="template-active"
                checked={currentTemplate.isActive}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 dark:text-blue-500 rounded"
              />
              <label htmlFor="template-active" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Template ativo
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                disabled={!currentTemplate.name || !currentTemplate.content}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Template
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Lista de templates */}
      <div className="space-y-3">
        {templates.map((template) => (
          <div 
            key={template.id}
            className={`p-4 rounded-lg border ${
              template.isActive 
                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-70'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    template.isActive 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                  }`}>
                    {template.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  Categoria: {
                    template.category === 'appointment' ? 'Agendamento' :
                    template.category === 'reminder' ? 'Lembrete' :
                    template.category === 'notification' ? 'Notificação' :
                    template.category === 'marketing' ? 'Marketing' : 'Outro'
                  }
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => toggleTemplateStatus(template.id)}
                  className={`p-1 rounded-full ${
                    template.isActive 
                      ? 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300' 
                      : 'text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
                  }`}
                  title={template.isActive ? 'Desativar template' : 'Ativar template'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                    {template.isActive && <path fillRule="evenodd" d="M10 4a6 6 0 100 12 6 6 0 000-12z" clipRule="evenodd" />}
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(template)}
                  className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-full"
                  title="Editar template"
                  disabled={editMode !== null || showAddForm}
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeTemplate(template.id)}
                  className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full"
                  title="Remover template"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/30 rounded border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{template.content}</p>
            </div>
            
            {template.variables.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {template.variables.map((variable) => (
                  <span 
                    key={variable}
                    className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded"
                  >
                    {variable}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {templates.length === 0 && (
          <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum template de mensagem adicionado
            </p>
            <button
              type="button"
              onClick={startAdd}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
};