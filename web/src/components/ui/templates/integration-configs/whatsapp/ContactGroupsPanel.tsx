import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Users, Tag } from 'lucide-react';
import { IContactGroup } from '@/types/integrations-configs/whatsapp-types';

interface ContactGroupsPanelProps {
  groups: IContactGroup[];
  onChange: (groups: IContactGroup[]) => void;
}

export const ContactGroupsPanel: React.FC<ContactGroupsPanelProps> = ({
  groups,
  onChange
}) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Estado para o grupo em edição ou novo grupo
  const [currentGroup, setCurrentGroup] = useState<IContactGroup>({
    id: '',
    name: '',
    description: '',
    tags: [],
    contactCount: 0
  });
  
  // Estado para nova tag
  const [newTag, setNewTag] = useState('');
  
  // Adicionar uma nova tag ao grupo atual
  const addTag = () => {
    if (newTag && !currentGroup.tags.includes(newTag)) {
      setCurrentGroup({
        ...currentGroup,
        tags: [...currentGroup.tags, newTag]
      });
      setNewTag('');
    }
  };
  
  // Remover uma tag do grupo atual
  const removeTag = (tag: string) => {
    setCurrentGroup({
      ...currentGroup,
      tags: currentGroup.tags.filter(t => t !== tag)
    });
  };
  
  // Iniciar edição de um grupo existente
  const startEdit = (group: IContactGroup) => {
    setCurrentGroup({ ...group });
    setEditMode(group.id);
    setShowAddForm(false);
  };
  
  // Iniciar criação de um novo grupo
  const startAdd = () => {
    // Gerar um ID único
    const newId = `group_${Date.now()}`;
    setCurrentGroup({
      id: newId,
      name: '',
      description: '',
      tags: [],
      contactCount: 0
    });
    setShowAddForm(true);
    setEditMode(null);
  };
  
  // Cancelar edição ou adição
  const cancelEdit = () => {
    setEditMode(null);
    setShowAddForm(false);
  };
  
  // Salvar um grupo (novo ou editado)
  const saveGroup = () => {
    if (currentGroup.name) {
      let newGroups: IContactGroup[];
      
      if (editMode) {
        // Editando um grupo existente
        newGroups = groups.map(group => 
          group.id === editMode ? { ...currentGroup } : group
        );
      } else {
        // Adicionando um novo grupo
        newGroups = [...groups, { ...currentGroup }];
      }
      
      onChange(newGroups);
      setEditMode(null);
      setShowAddForm(false);
    }
  };
  
  // Remover um grupo
  const removeGroup = (id: string) => {
    onChange(groups.filter(group => group.id !== id));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Grupos de Contatos</h3>
        <button
          type="button"
          onClick={startAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          disabled={showAddForm || editMode !== null}
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Grupo
        </button>
      </div>
      
      {/* Formulário de adição/edição */}
      {(showAddForm || editMode) && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {editMode ? 'Editar Grupo' : 'Novo Grupo'}
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
              <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome do Grupo
              </label>
              <input
                id="group-name"
                type="text"
                value={currentGroup.name}
                onChange={(e) => setCurrentGroup({ ...currentGroup, name: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="Nome do grupo"
              />
            </div>
            
            <div>
              <label htmlFor="group-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descrição
              </label>
              <textarea
                id="group-description"
                value={currentGroup.description}
                onChange={(e) => setCurrentGroup({ ...currentGroup, description: e.target.value })}
                rows={2}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="Descrição do grupo"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-l-md"
                  placeholder="Nova tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  disabled={!newTag}
                >
                  Adicionar
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {currentGroup.tags.map((tag) => (
                  <div 
                    key={tag}
                    className="flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {currentGroup.tags.length === 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Nenhuma tag definida
                  </span>
                )}
              </div>
            </div>
            
            {editMode && (
              <div>
                <label htmlFor="contact-count" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quantidade de Contatos
                </label>
                <input
                  id="contact-count"
                  type="number"
                  min="0"
                  value={currentGroup.contactCount}
                  onChange={(e) => setCurrentGroup({ 
                    ...currentGroup, 
                    contactCount: parseInt(e.target.value) || 0 
                  })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Este campo será atualizado automaticamente quando importar contatos
                </p>
              </div>
            )}
            
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
                onClick={saveGroup}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                disabled={!currentGroup.name}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Grupo
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Lista de grupos */}
      <div className="space-y-3">
        {groups.map((group) => (
          <div 
            key={group.id}
            className="p-4 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium text-gray-900 dark:text-white">{group.name}</h4>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {group.contactCount} contatos
                    </span>
                  </span>
                </div>
                {group.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {group.description}
                  </p>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => startEdit(group)}
                  className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-full"
                  title="Editar grupo"
                  disabled={editMode !== null || showAddForm}
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeGroup(group.id)}
                  className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full"
                  title="Remover grupo"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {group.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {group.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="flex items-center text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded"
                  >
                    <Tag className="w-3 h-3 mr-1" /> {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className="text-xs flex items-center px-2 py-1 border border-gray-300 dark:border-gray-700 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Plus className="w-3 h-3 mr-1" /> Importar Contatos
              </button>
              <button
                type="button"
                className="text-xs flex items-center px-2 py-1 border border-gray-300 dark:border-gray-700 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Exportar Lista
              </button>
            </div>
          </div>
        ))}
        
        {groups.length === 0 && (
          <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum grupo de contatos adicionado
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-1">
              Crie grupos para segmentar seus contatos por perfil, preferências ou comportamento
            </p>
            <button
              type="button"
              onClick={startAdd}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Grupo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};