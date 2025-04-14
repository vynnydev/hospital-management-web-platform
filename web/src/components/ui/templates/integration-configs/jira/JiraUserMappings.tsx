import React, { useState } from 'react';
import { Plus, Trash2, User, Users, RefreshCw, AlertTriangle } from 'lucide-react';
import { IJiraConfig, IJiraUserMapping } from '@/types/integrations-configs/jira-software-types';

interface IJiraUserMappingsProps {
  settings: Partial<IJiraConfig>;
  updateSettings: (updates: Partial<IJiraConfig>) => void;
}

export const JiraUserMappings: React.FC<IJiraUserMappingsProps> = ({
  settings,
  updateSettings
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{id: string, displayName: string, accountId: string}[]>([]);
  
  // Estado para novo mapeamento de usuário
  const [newMapping, setNewMapping] = useState<Partial<IJiraUserMapping>>({
    hospitalUserId: '',
    hospitalUserName: '',
    jiraAccountId: '',
    jiraDisplayName: '',
    role: 'doctor'
  });

  // Estado para usuário hospitalar selecionado
  const [selectedHospitalUser, setSelectedHospitalUser] = useState<{id: string, name: string, role: string} | null>(null);

  // Adicionar/atualizar mapeamento de usuário
  const addUserMapping = () => {
    if (
      newMapping.hospitalUserId && 
      newMapping.hospitalUserName && 
      newMapping.jiraAccountId && 
      newMapping.jiraDisplayName
    ) {
      const mappings = [...(settings.userMapping || [])];
      
      // Verificar se já existe um mapeamento para este usuário do hospital
      const existingIndex = mappings.findIndex(m => m.hospitalUserId === newMapping.hospitalUserId);
      
      if (existingIndex >= 0) {
        // Atualizar mapeamento existente
        mappings[existingIndex] = {
          ...mappings[existingIndex],
          ...newMapping,
          id: mappings[existingIndex].id
        } as IJiraUserMapping;
      } else {
        // Adicionar novo mapeamento
        mappings.push({
          ...newMapping,
          id: `user-mapping-${Date.now()}`,
          role: newMapping.role || 'other'
        } as IJiraUserMapping);
      }
      
      updateSettings({ userMapping: mappings });
      
      // Resetar o formulário
      setNewMapping({
        hospitalUserId: '',
        hospitalUserName: '',
        jiraAccountId: '',
        jiraDisplayName: '',
        role: 'doctor'
      });
      
      setSelectedHospitalUser(null);
    }
  };

  // Remover mapeamento de usuário
  const removeUserMapping = (id: string) => {
    const mappings = settings.userMapping?.filter(m => m.id !== id) || [];
    updateSettings({ userMapping: mappings });
  };

  // Simular busca de usuários no Jira
  const searchJiraUsers = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      // Em um ambiente real, isso seria uma chamada à API do Jira
      // Simulação de busca
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Resultados simulados
      const results = [
        { id: `jira-user-${Date.now()}-1`, displayName: `${searchQuery} Silva`, accountId: `${searchQuery.toLowerCase().replace(/\s+/g, '.')}_silva` },
        { id: `jira-user-${Date.now()}-2`, displayName: `Maria ${searchQuery}`, accountId: `maria.${searchQuery.toLowerCase().replace(/\s+/g, '.')}` },
        { id: `jira-user-${Date.now()}-3`, displayName: `João ${searchQuery}`, accountId: `joao.${searchQuery.toLowerCase().replace(/\s+/g, '.')}` }
      ];
      
      setSearchResults(results);
    } catch (error) {
      console.error('Erro ao buscar usuários do Jira:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Selecionar usuário do sistema hospitalar
  const selectHospitalUser = (user: {id: string, name: string, role: string}) => {
    setSelectedHospitalUser(user);
    setNewMapping({
      ...newMapping,
      hospitalUserId: user.id,
      hospitalUserName: user.name,
      role: user.role
    });
  };

  // Selecionar usuário do Jira
  const selectJiraUser = (user: {id: string, displayName: string, accountId: string}) => {
    setNewMapping({
      ...newMapping,
      jiraAccountId: user.accountId,
      jiraDisplayName: user.displayName
    });
    
    // Limpar resultados de busca
    setSearchResults([]);
    setSearchQuery('');
  };

  // Lista simulada de usuários do sistema hospitalar
  const hospitalUsers = [
    { id: 'USR001', name: 'Administrador', role: 'admin' },
    { id: 'DR001', name: 'Carlos Oliveira', role: 'doctor' },
    { id: 'DR002', name: 'Juliana Andrade', role: 'doctor' },
    { id: 'DR003', name: 'Marcelo Santos', role: 'doctor' },
    { id: 'ENF001', name: 'Fernanda Lima', role: 'nurse' },
    { id: 'ATD001', name: 'Juliana Santos', role: 'attendant' },
    { id: 'ATD002', name: 'Ricardo Almeida', role: 'attendant' }
  ];

  // Verificar se um usuário do hospital já tem mapeamento
  const getUserMappingByHospitalId = (hospitalUserId: string) => {
    return settings.userMapping?.find(m => m.hospitalUserId === hospitalUserId);
  };

  // Obter string de exibição do papel/função
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'doctor': return 'Médico';
      case 'nurse': return 'Enfermeiro';
      case 'attendant': return 'Atendente';
      case 'patient': return 'Paciente';
      default: return 'Outro';
    }
  };

  return (
    <div className="space-y-6">
      {/* Lista de Mapeamentos Existentes */}
      <div>
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Mapeamento de Usuários</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Associe usuários do sistema hospitalar com usuários do Jira para rastreabilidade e notificações.
        </p>
        
        <div className="space-y-3 mb-6">
          {(settings.userMapping || []).length > 0 ? (
            (settings.userMapping || []).map((mapping) => (
              <div key={mapping.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Sistema Hospitalar:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{mapping.hospitalUserName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {mapping.hospitalUserId}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Jira:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{mapping.jiraDisplayName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {mapping.jiraAccountId}</p>
                      </div>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                        {getRoleDisplay(mapping.role)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeUserMapping(mapping.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  aria-label="Remover mapeamento"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum mapeamento de usuário configurado. Adicione mapeamentos abaixo.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Seleção de Usuário do Hospital */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">1. Selecione um Usuário do Hospital</h4>
          
          <div className="space-y-3">
            <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              {hospitalUsers.map((user) => {
                const existingMapping = getUserMappingByHospitalId(user.id);
                return (
                  <div 
                    key={user.id} 
                    className={`flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                      selectedHospitalUser?.id === user.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => selectHospitalUser(user)}
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{user.id}</span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                          {getRoleDisplay(user.role)}
                        </span>
                      </div>
                    </div>
                    {existingMapping && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                        Mapeado
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Busca de Usuário do Jira */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">2. Busque um Usuário do Jira</h4>
          
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Buscar usuário do Jira..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-md"
                disabled={!selectedHospitalUser}
              />
              <button
                type="button"
                onClick={searchJiraUsers}
                disabled={isSearching || !searchQuery.trim() || !selectedHospitalUser}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSearching ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <User className="w-4 h-4 mr-2" />}
                Buscar
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mt-2">
                <div className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1">
                  Resultados da busca:
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div 
                      key={user.id} 
                      className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => selectJiraUser(user)}
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.displayName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.accountId}</p>
                      </div>
                      <button
                        type="button"
                        className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded"
                      >
                        Selecionar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedHospitalUser && newMapping.jiraAccountId && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Mapeamento Selecionado:</h5>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div>
                    <span className="text-xs text-blue-600 dark:text-blue-400">Hospital:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{newMapping.hospitalUserName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-blue-600 dark:text-blue-400">Jira:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{newMapping.jiraDisplayName}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botão para adicionar mapeamento */}
      {selectedHospitalUser && newMapping.jiraAccountId && (
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={addUserMapping}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            {getUserMappingByHospitalId(newMapping.hospitalUserId || '') ? 'Atualizar Mapeamento' : 'Adicionar Mapeamento'}
          </button>
        </div>
      )}

      {/* Mensagem de alerta */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-start mt-4">
        <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-sm text-yellow-700 dark:text-yellow-300">
          <p className="font-medium mb-1">Importante</p>
          <p>
            O mapeamento de usuários é necessário para rastreabilidade e atribuição correta de tarefas no Jira.
            Em um ambiente real, os usuários seriam buscados diretamente da sua instância do Jira e do sistema hospitalar.
          </p>
        </div>
      </div>
    </div>
  );
};