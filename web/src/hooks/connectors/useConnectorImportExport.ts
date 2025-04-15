import connectorService from "@/services/general/connectors/ConnectorService";
import { IImportValidationResult } from "@/types/connectors-types";
import { useState } from "react";

export const useConnectorImportExport = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationResult, setValidationResult] = useState<IImportValidationResult | null>(null);
  
    const exportData = async (format: 'json' | 'xml' | 'csv' | 'fhir', connectorIds?: string[]) => {
      setLoading(true);
      setError(null);
      try {
        const blob = await connectorService.exportData(format, connectorIds);
        
        // Create a download link and trigger it
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `connector-export-${new Date().toISOString().slice(0, 10)}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        return false;
      } finally {
        setLoading(false);
      }
    };
  
    const validateImport = async (file: File) => {
      setLoading(true);
      setError(null);
      try {
        const response = await connectorService.validateImport(file);
        if (response.success) {
          setValidationResult(response.data);
          return response.data;
        } else {
          setError(response.message || 'Failed to validate import file');
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    const importConfig = async (file: File, mappings?: Array<{ source: string; target: string }>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await connectorService.importConfig(file, mappings);
        if (response.success) {
          return response.data;
        } else {
          setError(response.message || 'Failed to import configuration');
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    return {
      loading,
      error,
      validationResult,
      exportData,
      validateImport,
      importConfig
    };
};