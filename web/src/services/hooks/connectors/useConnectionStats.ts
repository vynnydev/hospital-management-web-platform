/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import api from "@/services/api";
import { IApiResponse, IConnectionStats } from "@/types/connectors-types";

export const useConnectionStats = () => {
  const [stats, setStats] = useState<IConnectionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Iniciando busca de estatísticas de conexão");
      
      // Tente diferentes endpoints, já que o problema pode estar na URL
      let response;
      
      try {
        // Primeira tentativa com o endpoint original
        console.log("Tentando buscar de connectors/stats");
        response = await api.get<IApiResponse<IConnectionStats>>('connectors/stats');
      } catch (firstError) {
        console.warn("Primeira tentativa falhou, tentando endpoint alternativo");
        
        // Segunda tentativa com endpoint alternativo
        console.log("Tentando buscar de connectors-stats");
        response = await api.get<IApiResponse<IConnectionStats>>('connectors-stats');
      }
      
      console.log("Resposta de estatísticas:", response);
      
      // Verificar se a resposta é válida
      if (response && response.data) {
        // Formato com wrapper de API
        if (response.data.success !== undefined && response.data.data) {
            console.log("Estatísticas recebidas (formato API):", response.data.data);
            setStats(response.data.data);
        } 
        // Formato de objeto direto
        else if (typeof response.data === 'object' && 
            response.data !== null &&
            'activeConnections' in response.data) {  // Usando 'in' em vez de acessar diretamente
            console.log("Estatísticas recebidas (objeto direto):", response.data);
            setStats(response.data as unknown as IConnectionStats);  // Casting explícito para IConnectionStats
        }
        else {
          console.warn("Formato de resposta inesperado:", response.data);
          setError("Formato de resposta inesperado");
          setStats(null);
        }
      } else {
        console.error("Resposta inválida da API");
        setError('Resposta inválida da API');
        setStats(null);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      setError(error instanceof Error ? error.message : 'Erro ao buscar estatísticas');
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("Executando fetchStats no useEffect");
    fetchStats();
  }, [fetchStats]);

  // Log quando as estatísticas são atualizadas
  useEffect(() => {
    console.log("Estado de stats atualizado:", stats);
  }, [stats]);

  return {
    stats,
    loading,
    error,
    fetchStats
  };
};