import { createContext, ReactNode, useEffect, useState } from "react";
import { IConnectorContextProps, IImportValidationResult, ISystemConnector } from "@/types/connectors-types";

import { useConnectionStats } from "@/services/hooks/connectors/useConnectionStats";
import { useConnectorImportExport } from "@/services/hooks/connectors/useConnectorImportExport";
import { useConnectors } from "@/services/hooks/connectors/useConnectors";
import { useSyncHistory } from "@/services/hooks/connectors/useSyncHistory";

// Criar o contexto
const ConnectorContext = createContext<IConnectorContextProps | undefined>(undefined);

// Provider do contexto
export const ConnectorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Hooks de dados
    const { 
      connectors, 
      loading: loadingConnectors, 
      error: connectorsError,
      fetchConnectors: fetchConnectorsHook,
      createConnector: createConnectorHook,
      updateConnector: updateConnectorHook,
      deleteConnector: deleteConnectorHook,
      toggleConnector: toggleConnectorHook,
      syncConnector: syncConnectorHook
    } = useConnectors();
  
    const {
      syncHistory,
      loading: loadingSyncHistory,
      error: syncHistoryError,
      fetchSyncHistory: fetchSyncHistoryHook
    } = useSyncHistory();
  
    const {
      stats,
      loading: loadingStats,
      error: statsError,
      fetchStats: fetchStatsHook
    } = useConnectionStats();
  
    const {
      loading: loadingImportExport,
      error: importExportError,
      validationResult: importValidationHook,
      exportData: exportDataHook,
      validateImport: validateImportHook,
      importConfig: importConfigHook
    } = useConnectorImportExport();
  
    // Estado local para UI
    const [selectedConnector, setSelectedConnector] = useState<ISystemConnector | null>(null);
    const [showMappingModal, setShowMappingModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [importValidation, setImportValidation] = useState<IImportValidationResult | null>(null);
  
    // Sincronizar o estado de validação de importação do hook com o estado local
    useEffect(() => {
      if (importValidationHook) {
        setImportValidation(importValidationHook);
      }
    }, [importValidationHook]);
  
    // Métodos de API encapsulados
    const fetchConnectors = async () => {
      await fetchConnectorsHook();
    };
  
    const fetchSyncHistory = async (page = 1, limit = 10) => {
      await fetchSyncHistoryHook(page, limit);
    };
  
    const fetchStats = async () => {
      await fetchStatsHook();
    };
  
    const syncConnector = async (connectorId: string) => {
      return await syncConnectorHook(connectorId);
    };
  
    const createConnector = async (connector: Omit<ISystemConnector, 'id'>) => {
      return await createConnectorHook(connector);
    };
  
    const updateConnector = async (id: string, connector: Partial<ISystemConnector>) => {
      return await updateConnectorHook(id, connector);
    };
  
    const deleteConnector = async (id: string) => {
      return await deleteConnectorHook(id);
    };
  
    const toggleConnector = async (id: string, connect: boolean) => {
      return await toggleConnectorHook(id, connect);
    };
  
    const exportData = async (format: 'json' | 'xml' | 'csv' | 'fhir', connectorIds?: string[]) => {
      return await exportDataHook(format, connectorIds);
    };
  
    const validateImport = async (file: File) => {
      const result = await validateImportHook(file);
      if (result) {
        setImportValidation(result);
        if (!result.valid && result.matchedFields > 0) {
          setShowMappingModal(true);
        } else if (result.valid) {
          setShowPreviewModal(true);
        }
      }
      return result;
    };
  
    const importConfig = async (file: File, mappings?: Array<{ source: string; target: string }>) => {
      const result = await importConfigHook(file, mappings);
      if (result) {
        setShowMappingModal(false);
        setShowPreviewModal(false);
        setSelectedFile(null);
        setImportValidation(null);
        fetchConnectors();
      }
      return result;
    };
  
    // Valores do contexto
    const contextValue: IConnectorContextProps = {
      // Dados
      connectors,
      syncHistory,
      stats,
      selectedConnector,
      importValidation,
      
      // Estados de UI
      isLoading: {
        connectors: loadingConnectors,
        syncHistory: loadingSyncHistory,
        stats: loadingStats,
        importExport: loadingImportExport
      },
      errors: {
        connectors: connectorsError,
        syncHistory: syncHistoryError,
        stats: statsError,
        importExport: importExportError
      },
      
      // Modais e estados de UI
      showMappingModal,
      showPreviewModal,
      showConfigModal,
      selectedFile,
      
      // Ações
      fetchConnectors,
      fetchSyncHistory,
      fetchStats,
      syncConnector,
      createConnector,
      updateConnector,
      deleteConnector,
      toggleConnector,
      exportData,
      validateImport,
      importConfig,
      
      // Ações de UI
      setSelectedConnector,
      setShowMappingModal,
      setShowPreviewModal,
      setShowConfigModal,
      setSelectedFile,
      setImportValidation
    };
  
    return (
      <ConnectorContext.Provider value={contextValue}>
        {children}
      </ConnectorContext.Provider>
    );
};