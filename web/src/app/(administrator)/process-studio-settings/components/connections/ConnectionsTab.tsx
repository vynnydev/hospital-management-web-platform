/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { TabsContent } from '@/components/ui/organisms/tabs';
import { 
  Database, Server, CreditCard, Users, AlertTriangle
} from 'lucide-react';
import { ConnectionsList } from './ConnectionsList';
import { ConnectionStats } from './ConnectionStats';
import { ConnectionHistory } from './ConnectionHistory';
import { ConnectionForm } from './ConnectionForm';
import { ImportMappingModal } from './ImportMappingModal';
import { Skeleton } from '@/components/ui/organisms/skeleton';
import { Alert, AlertDescription } from '@/components/ui/organisms/alert';

import { useConnectors } from '@/services/hooks/connectors/useConnectors';
import { useSyncHistory } from '@/services/hooks/connectors/useSyncHistory';
import { useConnectionStats } from '@/services/hooks/connectors/useConnectionStats';
import { useConnectorImportExport } from '@/services/hooks/connectors/useConnectorImportExport';

import { ISystemConnector, IImportValidationResult } from '@/types/connectors-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card';

export const ConnectionsTab: React.FC = () => {
  // Estados e hooks
  const { 
    connectors, 
    loading: loadingConnectors, 
    error: connectorsError,
    syncConnector,
    toggleConnector,
    updateConnector
  } = useConnectors();

  const {
    syncHistory,
    loading: loadingSyncHistory,
    error: syncHistoryError,
    getSyncDetails
  } = useSyncHistory();

  const {
    stats,
    loading: loadingStats,
    error: statsError
  } = useConnectionStats();

  const {
    loading: loadingImportExport,
    error: importExportError,
    validationResult,
    exportData,
    validateImport,
    importConfig
  } = useConnectorImportExport();

  useEffect(() => {
    console.log("ConnectorsTab - connectors:", connectors);
    console.log("ConnectorsTab - connectors array?", Array.isArray(connectors));
    console.log("ConnectorsTab - connectors length:", connectors ? connectors.length : 0);
  }, [connectors]);

  // Estado para modais e outras ações de UI
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importValidation, setImportValidation] = useState<IImportValidationResult | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<ISystemConnector | null>(null);

  // Handlers para ações
  const handleSyncSystem = async (connectorId: string) => {
    try {
      await syncConnector(connectorId);
    } catch (error) {
      console.error('Error syncing system:', error);
    }
  };

  const handleConfigureSystem = (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId);
    if (connector) {
      setSelectedConnector(connector);
      setConfigModalOpen(true);
    }
  };

  const handleToggleConnection = async (connectorId: string, connect: boolean) => {
    try {
      await toggleConnector(connectorId, connect);
    } catch (error) {
      console.error(`Error ${connect ? 'connecting' : 'disconnecting'} system:`, error);
    }
  };

  const handleViewSyncDetails = async (syncId: string) => {
    try {
      const details = await getSyncDetails(syncId);
      if (details) {
        // Aqui você poderia abrir um modal com os detalhes
        console.log('Sync details:', details);
      }
    } catch (error) {
      console.error('Error fetching sync details:', error);
    }
  };

  const handleAddConnection = async (connectionData: Omit<ISystemConnector, 'id'>) => {
    // Esta função seria implementada no ConnectionForm
    console.log('Adding new connection:', connectionData);
  };

  const handleExportData = async (format: 'json' | 'xml' | 'csv' | 'fhir') => {
    try {
      await exportData(format);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleImportConfig = async (file: File) => {
    try {
      setSelectedFile(file);
      const validation = await validateImport(file);
      
      if (validation) {
        setImportValidation(validation);
        
        if (validation.valid) {
          // Se for totalmente válido, pode importar diretamente
          await importConfig(file);
        } else if (validation.matchedFields > 0) {
          // Se tiver alguns campos compatíveis, mostra o modal de mapeamento
          setShowMappingModal(true);
        }
      }
    } catch (error) {
      console.error('Error importing config:', error);
    }
  };

  const handleConfirmImport = async (mappings: Array<{ source: string; target: string }>) => {
    if (selectedFile) {
      try {
        await importConfig(selectedFile, mappings);
        setShowMappingModal(false);
        setSelectedFile(null);
        setImportValidation(null);
      } catch (error) {
        console.error('Error confirming import:', error);
      }
    }
  };

  const handleViewAPI = () => {
    // Navegar para a documentação da API
    window.open('/api/docs', '_blank');
  };

  // Manipulação de ícones para conectores
  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case 'database':
        return Database;
      case 'server':
        return Server;
      case 'billing':
        return CreditCard;
      case 'users':
        return Users;
      default:
        return Database;
    }
  };

  // Mapear conectores para o formato esperado pelo componente ConnectionsList
  const mappedConnectors = connectors.map(connector => ({
    id: connector.id,
    name: connector.name,
    icon: getIconComponent(connector.iconType),
    status: connector.status,
    lastSync: connector.lastSync || '-'
  }));

  // Mapear histórico de sincronização para o formato esperado pelo componente ConnectionHistory
  const mappedSyncHistory = syncHistory && syncHistory.length > 0 
  ? syncHistory.map(item => {
      const date = new Date(item.timestamp);
      
      return {
        id: item.id,
        systemId: item.connectorId,
        systemName: item.connectorName,
        icon: getIconComponent(item.connectorId === 'emr' ? 'database' : 
                             item.connectorId === 'lab' || item.connectorId === 'pharmacy' ? 'server' : 
                             item.connectorId === 'billing' ? 'billing' : 'users'),
        date: date.toLocaleDateString('pt-BR'),
        time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: item.status === 'success' ? 'success' : 'error',
        recordCount: item.recordCount
      };
    })
  : [];

  // Verificar se há algum erro para exibir
  const hasError = connectorsError || syncHistoryError || statsError || importExportError;

  const validConnectors = Array.isArray(connectors) ? connectors : [];
  const hasConnectors = validConnectors.length > 0;

  return (
    <TabsContent value="connections" className="space-y-4">
      {hasError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {connectorsError || syncHistoryError || statsError || importExportError}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Painel principal de conexões */}
        <div className="lg:col-span-2">
          {loadingConnectors ? (
            <Skeleton className="w-full h-[500px] rounded-lg" />
          ) : hasConnectors ? (
            <ConnectionsList 
              connectors={mappedConnectors}
              onSync={handleSyncSystem}
              onConfigure={handleConfigureSystem}
              onToggleConnection={handleToggleConnection}
            />
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Nenhuma conexão configurada.</p>
            </div>
          )}
          
          {loadingStats ? (
            <Skeleton className="w-full h-[200px] mt-4 rounded-lg" />
          ) : stats ? (
            <div className="mt-4 px-6">
              <ConnectionStats 
                stats={stats}
                onViewFullReport={() => window.open('/reports/connections', '_blank')}
              />
            </div>
          ) : (
            <div className="mt-4">
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {statsError || "Não foi possível carregar estatísticas de conexão."}
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          {/* Histórico de sincronizações */}
          {loadingSyncHistory ? (
            <Skeleton className="w-full h-[300px] mt-4 rounded-lg" />
          ) : syncHistory && syncHistory.length > 0 ? (
            <ConnectionHistory 
              syncRecords={mappedSyncHistory}
              onViewDetails={handleViewSyncDetails}
            />
          ) : (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Histórico de Sincronizações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Nenhum registro de sincronização.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Painel Lateral para Adicionar Conexão */}
        <ConnectionForm 
          onConnect={handleAddConnection}
          onExport={handleExportData}
          onImport={handleImportConfig}
          onViewDocs={handleViewAPI}
          isLoading={loadingImportExport}
        />
      </div>

      {/* Modal para mapeamento de campos durante importação */}
      {showMappingModal && importValidation && (
        <ImportMappingModal 
          validation={importValidation}
          onConfirm={handleConfirmImport}
          onCancel={() => {
            setShowMappingModal(false);
            setSelectedFile(null);
            setImportValidation(null);
          }}
        />
      )}
    </TabsContent>
  );
};