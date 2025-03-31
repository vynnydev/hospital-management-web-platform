import api from "@/services/api";
import connectorService from "@/services/general/connectors/ConnectorService";
import { IApiResponse, ISyncHistoryItem } from "@/types/connectors-types";
import { useCallback, useEffect, useState } from "react";

export const useSyncHistory = (connectorId?: string) => {
  const [syncHistory, setSyncHistory] = useState<ISyncHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalItems: 0
  });

  const fetchSyncHistory = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Iniciando busca de histórico de sincronização");
      
      // Tente diferentes endpoints, já que o problema pode estar na URL
      let url = connectorId 
        ? `connectors/${connectorId}/history?limit=${limit}&page=${page}`
        : `sync-history?limit=${limit}&page=${page}`;
      
      let response;
      
      try {
        console.log("Tentando URL:", url);
        response = await api.get<IApiResponse<ISyncHistoryItem[]>>(url);
      } catch (urlError) {
        console.warn("Falha no primeiro endpoint, tentando alternativa");
        // Tente outra URL alternativa se a primeira falhar
        url = 'syncHistory'; // ou qualquer outro endpoint possível
        response = await api.get<IApiResponse<ISyncHistoryItem[]>>(url);
      }
      
      console.log("Resposta recebida:", response);
      
      // Verificar se temos uma resposta válida
      if (response && response.data) {
        // Verificar se os dados estão no formato esperado (com propriedade success)
        if (response.data.success !== undefined) {
          console.log("Dados de histórico recebidos (formato API):", response.data.data);
          const historyData = Array.isArray(response.data.data) ? response.data.data : [];
          setSyncHistory(historyData);
          
          setPagination({
            limit,
            page,
            totalPages: Math.ceil(historyData.length / limit),
            totalItems: historyData.length
          });
        } 
        // Se for um array direto
        else if (Array.isArray(response.data)) {
          console.log("Dados de histórico recebidos (array direto):", response.data);
          setSyncHistory(response.data);
          
          setPagination({
            limit,
            page,
            totalPages: Math.ceil(response.data.length / limit),
            totalItems: response.data.length
          });
        }
        else {
          console.warn("Formato de resposta inesperado:", response.data);
          setSyncHistory([]);
          setError('Formato de resposta inesperado');
        }
      } else {
        console.error("Resposta inválida da API");
        setSyncHistory([]);
        setError('Resposta inválida da API');
      }
      
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      setError(error instanceof Error ? error.message : 'Erro ao buscar histórico');
      setSyncHistory([]);
    } finally {
      setLoading(false);
    }
  }, [connectorId]);

  useEffect(() => {
    console.log("Executando fetchSyncHistory no useEffect");
    fetchSyncHistory();
  }, [fetchSyncHistory]);

  // Log quando o histórico muda
  useEffect(() => {
    console.log("Estado de syncHistory atualizado:", syncHistory);
  }, [syncHistory]);

  const getSyncDetails = async (syncId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await connectorService.getSyncDetails(syncId);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch sync details');
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
    syncHistory,
    loading,
    error,
    pagination,
    fetchSyncHistory,
    getSyncDetails
  };
};