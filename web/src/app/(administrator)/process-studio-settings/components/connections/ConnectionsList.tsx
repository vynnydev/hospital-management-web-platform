import React from 'react';
import { Share2, Rotate3d, Settings2, Lock, Unlock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';

interface Connector {
  id: string;
  name: string;
  icon: React.ElementType;
  status: 'connected' | 'error' | 'pending';
  lastSync: string;
}

interface ConnectionsListProps {
  connectors: Connector[];
  onSync?: (connectorId: string) => void;
  onConfigure?: (connectorId: string) => void;
  onToggleConnection?: (connectorId: string, connect: boolean) => void;
}

export const ConnectionsList: React.FC<ConnectionsListProps> = ({
  connectors,
  onSync,
  onConfigure,
  onToggleConnection
}) => {
  return (
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
          {connectors.map(connector => {
            const Icon = connector.icon;
            
            return (
              <div 
                key={connector.id}
                className="p-4 border rounded-lg border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center"
              >
                <div className="flex items-center mb-3 md:mb-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
                      onClick={() => onSync && onSync(connector.id)}
                    >
                      <Rotate3d className="h-4 w-4 mr-2" />
                      Sincronizar
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onConfigure && onConfigure(connector.id)}
                  >
                    <Settings2 className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                  {connector.status === 'connected' ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => onToggleConnection && onToggleConnection(connector.id, false)}
                    >
                      <Unlock className="h-4 w-4 mr-2" />
                      Desconectar
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                      onClick={() => onToggleConnection && onToggleConnection(connector.id, true)}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Conectar
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {connectors.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma conexão configurada.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};