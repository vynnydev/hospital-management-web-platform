/* eslint-disable @typescript-eslint/no-explicit-any */
// Tipos e interfaces
export interface ISystemConnector {
    id: string;
    name: string;
    type: string;
    iconType: string;
    status: 'connected' | 'error' | 'pending';
    lastSync: string | null;
    connectionDetails: {
      url: string;
      authMethod: 'none' | 'basic' | 'apikey' | 'oauth';
      credentials?: Record<string, string>;
      syncInterval: 'realtime' | 'minute' | 'hour' | 'day' | 'manual';
      apiVersion?: string;
      mappings?: Array<{
        sourceField: string;
        targetField: string;
        transform?: string;
      }>;
    };
    metadata?: Record<string, any>;
}

export interface ISyncRecord {
  id: string;
  systemId: string;
  systemName: string;
  icon: React.ElementType;
  date: string;
  time: string;
  status: 'success' | 'error';
  recordCount?: number;
}
  
export interface ISyncHistoryItem {
    id: string;
    connectorId: string;
    connectorName: string;
    timestamp: string;
    status: 'success' | 'error' | 'in_progress';
    recordCount?: number;
    errorDetails?: string;
    duration?: number; // in seconds
    dataVolume?: number; // in bytes
}
  
export interface IConnectionStats {
    activeConnections: number;
    dailyTransfers: number;
    dataVolume: string;
    failures: number;
    uptime?: string;
    successRate?: number; // percentage
    averageSyncTime?: number; // in seconds
}
  
export interface IApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    errors?: Array<{
      code: string;
      message: string;
      field?: string;
    }>;
}
  
export interface IImportValidationResult {
    valid: boolean;
    totalFields: number;
    matchedFields: number;
    unmatchedFields: string[];
    suggestedMappings?: Array<{
        sourceField: string;
        suggestedTargetField: string;
        confidence: number;
    }>;
    sampleData?: any;
}

// Interface para o contexto
export interface IConnectorContextProps {
    // Dados
    connectors: ISystemConnector[];
    syncHistory: ISyncHistoryItem[];
    stats: IConnectionStats | null;
    selectedConnector: ISystemConnector | null;
    importValidation: IImportValidationResult | null;
    
    // Estados de UI
    isLoading: {
      connectors: boolean;
      syncHistory: boolean;
      stats: boolean;
      importExport: boolean;
    };
    errors: {
      connectors: string | null;
      syncHistory: string | null;
      stats: string | null;
      importExport: string | null;
    };
    
    // Modais e estados de UI
    showMappingModal: boolean;
    showPreviewModal: boolean;
    showConfigModal: boolean;
    selectedFile: File | null;
    
    // Ações
    fetchConnectors: () => Promise<void>;
    fetchSyncHistory: (page?: number, limit?: number) => Promise<void>;
    fetchStats: () => Promise<void>;
    syncConnector: (connectorId: string) => Promise<ISyncHistoryItem | null>;
    createConnector: (connector: Omit<ISystemConnector, 'id'>) => Promise<ISystemConnector | null>;
    updateConnector: (id: string, connector: Partial<ISystemConnector>) => Promise<ISystemConnector | null>;
    deleteConnector: (id: string) => Promise<boolean>;
    toggleConnector: (id: string, connect: boolean) => Promise<ISystemConnector | null>;
    exportData: (format: 'json' | 'xml' | 'csv' | 'fhir', connectorIds?: string[]) => Promise<boolean>;
    validateImport: (file: File) => Promise<IImportValidationResult | null>;
    importConfig: (file: File, mappings?: Array<{ source: string; target: string }>) => Promise<ISystemConnector | null>;
    
    // Ações de UI
    setSelectedConnector: (connector: ISystemConnector | null) => void;
    setShowMappingModal: (show: boolean) => void;
    setShowPreviewModal: (show: boolean) => void;
    setShowConfigModal: (show: boolean) => void;
    setSelectedFile: (file: File | null) => void;
    setImportValidation: (validation: IImportValidationResult | null) => void;
}