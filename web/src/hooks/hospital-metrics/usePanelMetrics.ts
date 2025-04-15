import { useState, useEffect, useCallback } from 'react';
import { useMetrics } from './useMetrics';
import { TMetric } from '@/types/hospital-metrics';
import api from '@/services/api';

/**
 * Hook para gerenciar métricas de um painel específico
 * 
 * @param panelId - Identificador do painel
 * @returns Funções e dados para interagir com métricas do painel
 */
export const usePanelMetrics = (panelId: string = 'default') => {
  const { metrics, isLoading: metricsLoading, error: metricsError } = useMetrics();
  const [panelMetrics, setPanelMetrics] = useState<TMetric[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Carregar métricas do painel
  const fetchPanelMetrics = useCallback(async () => {
    if (metricsLoading) return; // Aguardar carregamento das métricas globais
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Buscar métricas do painel da API
      const response = await api.get(`/panels/${panelId}/metrics`);
      
      if (response.data) {
        // Se a API retornar apenas IDs, precisamos mapear para as métricas completas
        if (Array.isArray(response.data) && response.data.length > 0 && typeof response.data[0] === 'string') {
          // São IDs de métricas
          const metricIds = response.data as string[];
          const panelMetricsData = metrics.filter(metric => metricIds.includes(metric.id));
          setPanelMetrics(panelMetricsData);
        } else {
          // São objetos de métricas completos
          setPanelMetrics(response.data);
        }
      } else {
        setPanelMetrics([]);
      }
    } catch (err) {
      console.error('Erro ao buscar métricas do painel:', err);
      setError('Não foi possível carregar as métricas do painel. Tente novamente mais tarde.');
      setPanelMetrics([]);
    } finally {
      setIsLoading(false);
    }
  }, [panelId, metrics, metricsLoading]);
  
  // Carregar métricas do painel quando as métricas globais estiverem disponíveis
  useEffect(() => {
    // Verifica se metrics existe antes de acessar sua propriedade length
    if (!metricsLoading && metrics && metrics.length > 0) {
      fetchPanelMetrics();
    }
  }, [fetchPanelMetrics, metrics, metricsLoading]);
  
  // Adicionar uma métrica ao painel
  const addToPanel = useCallback(async (metric: TMetric): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar se a métrica já está no painel
      if (panelMetrics.some(m => m.id === metric.id)) {
        return true; // Já está no painel
      }
      
      // Adicionar a métrica ao painel na API
      await api.post(`/panels/${panelId}/metrics`, { id: metric.id });
      
      // Atualizar o estado local
      setPanelMetrics(prev => [...prev, metric]);
      
      return true;
    } catch (err) {
      console.error('Erro ao adicionar métrica ao painel:', err);
      setError('Não foi possível adicionar a métrica ao painel. Tente novamente mais tarde.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [panelId, panelMetrics]);
  
  // Remover uma métrica do painel
  const removeFromPanel = useCallback(async (metricId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar se a métrica está no painel
      if (!panelMetrics.some(m => m.id === metricId)) {
        return false; // Não está no painel
      }
      
      // Remover a métrica do painel na API
      await api.delete(`/panels/${panelId}/metrics/${metricId}`);
      
      // Atualizar o estado local
      setPanelMetrics(prev => prev.filter(metric => metric.id !== metricId));
      
      return true;
    } catch (err) {
      console.error('Erro ao remover métrica do painel:', err);
      setError('Não foi possível remover a métrica do painel. Tente novamente mais tarde.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [panelId, panelMetrics]);
  
  // Verificar se uma métrica está no painel
  const isInPanel = useCallback((metricId: string): boolean => {
    return panelMetrics.some(metric => metric.id === metricId);
  }, [panelMetrics]);
  
  // Ordenar métricas do painel
  const reorderPanelMetrics = useCallback(async (newOrder: string[]): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Enviar nova ordem para a API
      await api.put(`/panels/${panelId}/order`, { order: newOrder });
      
      // Reordenar métricas localmente
      const orderedMetrics: TMetric[] = [];
      newOrder.forEach(id => {
        const metric = panelMetrics.find(m => m.id === id);
        if (metric) {
          orderedMetrics.push(metric);
        }
      });
      
      setPanelMetrics(orderedMetrics);
      
      return true;
    } catch (err) {
      console.error('Erro ao reordenar métricas do painel:', err);
      setError('Não foi possível reordenar as métricas. Tente novamente mais tarde.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [panelId, panelMetrics]);
  
  return {
    panelMetrics,
    isLoading: isLoading || metricsLoading,
    error: error || metricsError,
    fetchPanelMetrics,
    addToPanel,
    removeFromPanel,
    isInPanel,
    reorderPanelMetrics
  };
};