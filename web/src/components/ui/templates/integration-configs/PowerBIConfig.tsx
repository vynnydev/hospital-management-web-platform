import React, { useState } from 'react';
import { 
  BarChart3, 
  Save, 
  Check, 
  AlertTriangle, 
  RefreshCw,  
  Database, 
} from 'lucide-react';
import { authService } from '@/services/auth/AuthService';

interface PowerBIConfigProps {
  isActive: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const PowerBIConfig: React.FC<PowerBIConfigProps> = ({ 
  isActive, 
  onToggle, 
  onClose 
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [configData, setConfigData] = useState({
    workspaceId: '',
    clientId: '',
    clientSecret: '',
    tenantId: '',
    refreshToken: '',
    autoRefresh: true,
    refreshInterval: 30,
    embedType: 'report',
    datasetUpdateMode: 'scheduled',
    allowExport: true,
    allowFiltering: true,
    allowDrilldown: true,
    accessLevel: 'view'
  });

  const isAdmin = authService.isAdministrator();
  const isDoctor = authService.isDoctor();

  const handleChange = (field: string, value: string | boolean | number) => {
    setConfigData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulação de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em um ambiente real, faria uma chamada à API
      console.log('Configurações do PowerBI salvas:', configData);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden max-w-7xl w-full lg:h-[500px] overflow-y-scroll">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">PowerBI</h2>
            <p className="text-sm text-white/80">Configuração de integração com dashboards</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggle}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isActive 
                ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50' 
                : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
            }`}
          >
            {isActive ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-4 flex items-center">
          <Check className="w-5 h-5 mr-2" />
          <span>Configurações salvas com sucesso!</span>
        </div>
      )}

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Credenciais Azure</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Workspace ID
                </label>
                <input
                  type="text"
                  value={configData.workspaceId}
                  onChange={(e) => handleChange('workspaceId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="ex: 3f9b8e7d-6c5a-4b3d-2e1f-0a9b8c7d6e5f"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Client ID (App ID)
                </label>
                <input
                  type="text"
                  value={configData.clientId}
                  onChange={(e) => handleChange('clientId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="ex: 1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Client Secret
                </label>
                <input
                  type="password"
                  value={configData.clientSecret}
                  onChange={(e) => handleChange('clientSecret', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="••••••••••••••••••••••••"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tenant ID (Directory ID)
                </label>
                <input
                  type="text"
                  value={configData.tenantId}
                  onChange={(e) => handleChange('tenantId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="ex: 9a8b7c6d-5e4f-3g2h-1i0j-9k8l7m6n5o4p"
                />
              </div>
            </div>
            
            <div className="flex items-start bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="ml-3 text-sm text-blue-600 dark:text-blue-400">
                As credenciais são armazenadas com criptografia e acessíveis apenas pelos administradores do sistema.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Configurações de Visualização</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Incorporação
                </label>
                <select
                  value={configData.embedType}
                  onChange={(e) => handleChange('embedType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="report">Relatório</option>
                  <option value="dashboard">Dashboard</option>
                  <option value="tile">Tile Específico</option>
                  <option value="visual">Visual Específico</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Atualização Automática</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Atualizar dados automaticamente
                  </p>
                </div>
                <button
                  onClick={() => handleChange('autoRefresh', !configData.autoRefresh)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    configData.autoRefresh ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    configData.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className={configData.autoRefresh ? '' : 'opacity-50 pointer-events-none'}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Intervalo de Atualização (minutos)
                </label>
                <select
                  value={configData.refreshInterval.toString()}
                  onChange={(e) => handleChange('refreshInterval', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  disabled={!configData.autoRefresh}
                >
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="120">2 horas</option>
                  <option value="360">6 horas</option>
                  <option value="720">12 horas</option>
                </select>
              </div>
              
              <div className="space-y-3 mt-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Permissões de Interação</h4>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Permitir Exportação
                  </div>
                  <button
                    onClick={() => handleChange('allowExport', !configData.allowExport)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      configData.allowExport ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      configData.allowExport ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Permitir Filtragem
                  </div>
                  <button
                    onClick={() => handleChange('allowFiltering', !configData.allowFiltering)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      configData.allowFiltering ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      configData.allowFiltering ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Permitir Drill-down
                  </div>
                  <button
                    onClick={() => handleChange('allowDrilldown', !configData.allowDrilldown)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      configData.allowDrilldown ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      configData.allowDrilldown ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {isAdmin && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Configurações Avançadas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Modo de Atualização de Dataset
                </label>
                <select
                  value={configData.datasetUpdateMode}
                  onChange={(e) => handleChange('datasetUpdateMode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="scheduled">Agendado</option>
                  <option value="onDemand">Sob Demanda</option>
                  <option value="streaming">Streaming</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nível de Acesso Padrão
                </label>
                <select
                  value={configData.accessLevel}
                  onChange={(e) => handleChange('accessLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="view">Visualização</option>
                  <option value="edit">Edição</option>
                  <option value="create">Criação</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {isDoctor && (
          <div className="flex items-start bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="ml-3 text-sm text-yellow-600 dark:text-yellow-400">
              Como médico, você terá acesso somente a dashboards e relatórios específicos para sua especialidade e seus pacientes.
              Para acesso a relatórios adicionais, entre em contato com o administrador do sistema.
            </p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <RefreshCw className="w-4 h-4 mr-1" />
          <span>Última sincronização: Hoje, 09:45</span>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2 inline-block" />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};