import React from 'react';
import { TabsContent } from '@/components/ui/organisms/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { 
  Share2, Database, Server, CreditCard, Users, Rotate3d, Settings2, 
  Lock, Unlock, Link, Download, Upload, Code 
} from 'lucide-react';

interface SystemConnector {
  id: string;
  name: string;
  icon: React.ElementType;
  status: 'connected' | 'error' | 'pending';
  lastSync: string;
}

interface SyncHistoryItem {
  id: string;
  systemId: string;
  systemName: string;
  icon: React.ElementType;
  timestamp: string;
  status: 'success' | 'error';
  records?: number;
}

export const ConnectionsTab: React.FC = () => {
  // Sistema conectores
  const systemConnectors: SystemConnector[] = [
    { id: 'emr', name: 'Sistema de Prontuário Eletrônico', icon: Database, status: 'connected', lastSync: '24/02/2025 08:45' },
    { id: 'lab', name: 'Sistema de Laboratório', icon: Server, status: 'connected', lastSync: '24/02/2025 07:30' },
    { id: 'pharmacy', name: 'Sistema de Farmácia', icon: Server, status: 'connected', lastSync: '24/02/2025 06:15' },
    { id: 'billing', name: 'Sistema de Faturamento', icon: CreditCard, status: 'error', lastSync: '23/02/2025 18:20' },
    { id: 'hr', name: 'Sistema de RH', icon: Users, status: 'pending', lastSync: '-' }
  ];

  // Histórico de sincronização
  const syncHistory: SyncHistoryItem[] = [
    { 
      id: 'sync-1', 
      systemId: 'emr', 
      systemName: 'Sistema de Prontuário Eletrônico',
      icon: Database,
      timestamp: '24/02/2025 08:45',
      status: 'success',
      records: 358
    },
    { 
      id: 'sync-2', 
      systemId: 'lab', 
      systemName: 'Sistema de Laboratório',
      icon: Server,
      timestamp: '24/02/2025 07:30',
      status: 'success',
      records: 127
    },
    { 
      id: 'sync-3', 
      systemId: 'billing', 
      systemName: 'Sistema de Faturamento',
      icon: CreditCard,
      timestamp: '23/02/2025 18:20',
      status: 'error'
    }
  ];

  // Handlers para ações
  const handleSyncSystem = (systemId: string) => {
    console.log('Sincronizando sistema:', systemId);
    // Implementar lógica de sincronização
  };

  const handleConfigureSystem = (systemId: string) => {
    console.log('Configurando sistema:', systemId);
    // Implementar lógica para abrir configurações
  };

  const handleConnectSystem = (systemId: string) => {
    console.log('Conectando sistema:', systemId);
    // Implementar lógica para conectar sistema
  };

  const handleDisconnectSystem = (systemId: string) => {
    console.log('Desconectando sistema:', systemId);
    // Implementar lógica para desconectar sistema
  };

  const handleViewSyncDetails = (syncId: string) => {
    console.log('Visualizando detalhes da sincronização:', syncId);
    // Implementar modal ou navegação para detalhes
  };

  const handleAddConnection = () => {
    console.log('Adicionando nova conexão');
    // Implementar lógica para adicionar nova conexão
  };

  const handleExportData = (format: string) => {
    console.log('Exportando dados em formato:', format);
    // Implementar lógica de exportação
  };

  const handleImportConfig = () => {
    console.log('Importando configurações');
    // Implementar lógica de importação
  };

  const handleViewAPI = () => {
    console.log('Visualizando documentação da API');
    // Implementar navegação para documentação
  };

  return (
    <TabsContent value="connections" className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Painel principal de conexões */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-blue-500" />
                Conexões de Sistemas
              </CardTitle>
              <CardDescription>
                Gerencie a comunicação com outros sistemas do hospital
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Listagem de conexões existentes */}
              <div className="space-y-3">
                {systemConnectors.map(connector => (
                  <div 
                    key={connector.id}
                    className="p-4 border rounded-lg border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center"
                  >
                    <div className="flex items-center mb-3 md:mb-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                        <connector.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">{connector.name}</h3>
                        <div className="flex items-center mt-1">
                          {connector.status === 'connected' && (
                            <span className="flex items-center text-xs text-green-600 dark:text-green-400">
                              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                              Conectado
                            </span>
                          )}
                          {connector.status === 'error' && (
                            <span className="flex items-center text-xs text-red-600 dark:text-red-400">
                              <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                              Erro de Conexão
                            </span>
                          )}
                          {connector.status === 'pending' && (
                            <span className="flex items-center text-xs text-amber-600 dark:text-amber-400">
                              <span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span>
                              Pendente
                            </span>
                          )}
                          {connector.lastSync !== '-' && (
                            <span className="text-xs text-gray-500 ml-3">
                              Última sincronização: {connector.lastSync}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 md:ml-auto">
                      {connector.status !== 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSyncSystem(connector.id)}
                        >
                          <Rotate3d className="h-4 w-4 mr-2" />
                          Sincronizar
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConfigureSystem(connector.id)}
                      >
                        <Settings2 className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                      {connector.status === 'connected' ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => handleDisconnectSystem(connector.id)}
                        >
                          <Unlock className="h-4 w-4 mr-2" />
                          Desconectar
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                          onClick={() => handleConnectSystem(connector.id)}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Conectar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Informações de atividade */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
                  Atividade de Integração
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total de integrações ativas</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Transferências hoje</span>
                    <span className="font-medium">128</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Volume de dados (24h)</span>
                    <span className="font-medium">14.2 MB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Falhas (24h)</span>
                    <span className="font-medium text-amber-600 dark:text-amber-400">3</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700"
                >
                  Ver Relatório Completo
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Histórico de sincronizações */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Histórico de Sincronizações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {syncHistory.map(sync => (
                  <div 
                    key={sync.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div>
                      <div className="flex items-center">
                        <sync.icon className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="font-medium">{sync.systemName}</span>
                      </div>
                      <div className="flex text-xs text-gray-500 mt-1">
                        <span>{sync.timestamp}</span>
                        <span className="mx-2">•</span>
                        <span className={sync.status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {sync.status === 'success' ? 'Sucesso' : 'Falha'}
                        </span>
                      </div>
                    </div>
                    {sync.records ? (
                      <div className="text-xs">{sync.records} registros</div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => handleViewSyncDetails(sync.id)}
                      >
                        Ver Detalhes
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Painel Lateral para Adicionar Conexão */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5 text-blue-500" />
                Nova Conexão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL de Conexão
                </label>
                <Input placeholder="https://api.sistema.com/v1" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Método de Autenticação
                </label>
                <Select defaultValue="oauth">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                    <SelectItem value="apikey">API Key</SelectItem>
                    <SelectItem value="oauth">OAuth 2.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Credenciais
                </label>
                <div className="space-y-2">
                  <Input placeholder="Client ID" />
                  <Input type="password" placeholder="Client Secret" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Intervalo de Sincronização
                </label>
                <Select defaultValue="hour">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o intervalo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Tempo real</SelectItem>
                    <SelectItem value="minute">A cada 15 minutos</SelectItem>
                    <SelectItem value="hour">A cada hora</SelectItem>
                    <SelectItem value="day">Uma vez ao dia</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-2"
                onClick={handleAddConnection}
              >
                <Link className="h-4 w-4 mr-2" />
                Adicionar Conexão
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Opções Avançadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Exportar Dados
                </label>
                <Select defaultValue="json">
                  <SelectTrigger>
                    <SelectValue placeholder="Formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="fhir">FHIR</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  className="mt-2 w-full"
                  onClick={() => handleExportData('json')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Importar Configurações
                </label>
                <div className="flex mt-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleImportConfig}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Selecionar Arquivo
                  </Button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  variant="outline" 
                  className="w-full text-blue-600 dark:text-blue-400"
                  onClick={handleViewAPI}
                >
                  <Code className="h-4 w-4 mr-2" />
                  API Documentação
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
};