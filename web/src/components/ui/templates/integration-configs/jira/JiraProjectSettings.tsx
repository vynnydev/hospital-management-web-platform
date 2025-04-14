import React, { useState } from 'react';
import { Plus, Trash2, Search, RefreshCw } from 'lucide-react';
import { IJiraConfig } from '@/types/integrations-configs/jira-software-types';

interface IJiraProjectSettingsProps {
  settings: Partial<IJiraConfig>;
  updateSettings: (updates: Partial<IJiraConfig>) => void;
}

interface JiraProject {
  id: string;
  key: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export const JiraProjectSettings: React.FC<IJiraProjectSettingsProps> = ({
  settings,
  updateSettings
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<JiraProject[]>([]);
  
  // Estado para novo projeto
  const [newProject, setNewProject] = useState<JiraProject>({
    id: '',
    key: '',
    name: '',
    description: '',
    isActive: true
  });

  // Adicionar/atualizar projeto
  const addOrUpdateProject = (project: JiraProject) => {
    const existingProjects = settings.projects || [];
    const existingIndex = existingProjects.findIndex(p => p.id === project.id);
    
    let updatedProjects;
    if (existingIndex >= 0) {
      // Atualizar projeto existente
      updatedProjects = [...existingProjects];
      updatedProjects[existingIndex] = project;
    } else {
      // Adicionar novo projeto
      updatedProjects = [...existingProjects, project];
    }
    
    updateSettings({ projects: updatedProjects });
    
    // Resetar o form
    setNewProject({
      id: '',
      key: '',
      name: '',
      description: '',
      isActive: true
    });
  };

  // Remover projeto
  const removeProject = (id: string) => {
    const existingProjects = settings.projects || [];
    const updatedProjects = existingProjects.filter(p => p.id !== id);
    updateSettings({ projects: updatedProjects });
  };

  // Alternar estado ativo do projeto
  const toggleProjectActive = (id: string) => {
    const existingProjects = settings.projects || [];
    const updatedProjects = existingProjects.map(p =>
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    updateSettings({ projects: updatedProjects });
  };

  // Simular busca de projetos no Jira
  const searchJiraProjects = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Em um ambiente real, isso seria uma chamada à API do Jira
      // Simulação de busca de projetos
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Resultados simulados com base na consulta
      const results: JiraProject[] = [
        {
          id: `proj-${Date.now()}-1`,
          key: searchQuery.toUpperCase().substring(0, 4),
          name: `Projeto ${searchQuery}`,
          description: `Descrição do projeto ${searchQuery}`,
          isActive: true
        },
        {
          id: `proj-${Date.now()}-2`,
          key: `${searchQuery.toUpperCase().substring(0, 3)}X`,
          name: `${searchQuery} Premium`,
          description: `Versão premium do projeto ${searchQuery}`,
          isActive: true
        }
      ];
      
      setSearchResults(results);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Verificar se um projeto já está adicionado
  const isProjectAdded = (id: string) => {
    return (settings.projects || []).some(p => p.id === id);
  };

  // Adicionar projeto a partir dos resultados de busca
  const addProjectFromSearch = (project: JiraProject) => {
    if (!isProjectAdded(project.id)) {
      addOrUpdateProject(project);
      
      // Limpar resultados de busca após adicionar
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Lista de projetos mapeados */}
      <div>
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Projetos Mapeados</h3>
        
        <div className="space-y-3 mb-6">
          {(settings.projects || []).map((project) => (
            <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${project.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">{project.name}</span>
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-0.5 rounded">
                      {project.key}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{project.description}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => toggleProjectActive(project.id)}
                  className={`px-2 py-1 text-xs rounded-md ${
                    project.isActive
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400'
                  }`}
                >
                  {project.isActive ? 'Ativo' : 'Inativo'}
                </button>
                <button
                  type="button"
                  onClick={() => removeProject(project.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  aria-label="Remover projeto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {(!settings.projects || settings.projects.length === 0) && (
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum projeto mapeado. Adicione projetos abaixo.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Buscar Projetos do Jira */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Buscar Projetos no Jira</h4>
        
        <div className="flex space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome do projeto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
              autoComplete="off"
            />
          </div>
          <button
            type="button"
            onClick={searchJiraProjects}
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSearching ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
            Buscar
          </button>
        </div>

        {/* Resultados da busca */}
        {searchResults.length > 0 && (
          <div className="space-y-2 mb-4">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Resultados da busca:</h5>
            <div className="max-h-48 overflow-y-auto">
              {searchResults.map((project) => (
                <div key={project.id} className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">{project.name}</span>
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-0.5 rounded">
                        {project.key}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{project.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addProjectFromSearch(project)}
                    disabled={isProjectAdded(project.id)}
                    className={`flex items-center px-2 py-1 rounded-md ${
                      isProjectAdded(project.id)
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 hover:bg-green-200'
                    }`}
                  >
                    {isProjectAdded(project.id) ? 'Adicionado' : 'Adicionar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Adicionar Projeto Manualmente */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Adicionar Projeto Manualmente</h4>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="project-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Chave do Projeto
              </label>
              <input
                id="project-key"
                type="text"
                value={newProject.key}
                onChange={(e) => setNewProject({ ...newProject, key: e.target.value.toUpperCase() })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="HOSP"
              />
            </div>
            <div>
              <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome do Projeto
              </label>
              <input
                id="project-name"
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
                placeholder="Hospital System"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <input
              id="project-description"
              type="text"
              value={newProject.description || ''}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
              placeholder="Descrição do projeto (opcional)"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (newProject.key && newProject.name) {
                  addOrUpdateProject({
                    ...newProject,
                    id: `manual-${Date.now()}`
                  });
                }
              }}
              disabled={!newProject.key || !newProject.name}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Projeto
            </button>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-2">
        Nota: Em um ambiente real, os projetos seriam buscados diretamente da sua instância do Jira.
      </p>
    </div>
  );
};