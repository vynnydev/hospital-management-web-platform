import connectorService from "@/services/general/connectors/ConnectorService";
import { ISystemConnector } from "@/types/connectors-types";
import { useCallback, useEffect, useState } from "react";

export const useConnectors = () => {
    const [connectors, setConnectors] = useState<ISystemConnector[]>([]);
    const [loading, setLoading] = useState(true); // Importante: iniciar como true
    const [error, setError] = useState<string | null>(null);
  
    const fetchConnectors = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Iniciando busca de conectores");
        const response = await connectorService.getConnectors();
        console.log("Resposta da API de conectores:", response);
        
        if (response && response.success) {
          // Verificar explicitamente se os dados existem e são um array
          const dataArray = Array.isArray(response.data) ? response.data : [];
          console.log("Dados de conectores recebidos:", dataArray);
          setConnectors(dataArray);
        } else {
          console.error("Falha na resposta da API:", response);
          setError(response?.message || 'Failed to fetch connectors');
          setConnectors([]); // Garantir array vazio em caso de erro
        }
      } catch (err) {
        console.error("Erro ao buscar conectores:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setConnectors([]); // Garantir array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    }, []);
  
    // Certifique-se que o fetchConnectors é chamado apenas uma vez
    useEffect(() => {
      console.log("Executando fetchConnectors no useEffect");
      fetchConnectors();
    }, [fetchConnectors]);

    // Adicionar um log sempre que o estado de conectores mudar
    useEffect(() => {
        console.log("Estado de conectores atualizado:", connectors);
    }, [connectors]);
  
    const createConnector = async (connectorData: Omit<ISystemConnector, 'id'>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await connectorService.createConnector(connectorData);
        if (response.success) {
          setConnectors(prev => [...prev, response.data]);
          return response.data;
        } else {
          setError(response.message || 'Failed to create connector');
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    const updateConnector = async (id: string, connectorData: Partial<ISystemConnector>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await connectorService.updateConnector(id, connectorData);
        if (response.success) {
          setConnectors(prev => 
            prev.map(connector => connector.id === id ? response.data : connector)
          );
          return response.data;
        } else {
          setError(response.message || 'Failed to update connector');
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    const deleteConnector = async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await connectorService.deleteConnector(id);
        if (response.success) {
          setConnectors(prev => prev.filter(connector => connector.id !== id));
          return true;
        } else {
          setError(response.message || 'Failed to delete connector');
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        return false;
      } finally {
        setLoading(false);
      }
    };
  
    const toggleConnector = async (id: string, connect: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const response = await connectorService.toggleConnector(id, connect);
        if (response.success) {
          setConnectors(prev => 
            prev.map(connector => connector.id === id ? response.data : connector)
          );
          return response.data;
        } else {
          setError(response.message || `Failed to ${connect ? 'connect' : 'disconnect'} connector`);
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    const syncConnector = async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await connectorService.syncConnector(id);
        if (response.success) {
          // Update the lastSync timestamp of the connector
          setConnectors(prev => 
            prev.map(connector => {
              if (connector.id === id) {
                return {
                  ...connector,
                  lastSync: new Date().toISOString()
                };
              }
              return connector;
            })
          );
          return response.data;
        } else {
          setError(response.message || 'Failed to sync connector');
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
      connectors,
      loading,
      error,
      fetchConnectors,
      createConnector,
      updateConnector,
      deleteConnector,
      toggleConnector,
      syncConnector
    };
};