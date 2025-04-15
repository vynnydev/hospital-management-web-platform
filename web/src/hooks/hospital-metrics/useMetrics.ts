import { useState, useEffect, useCallback } from 'react';
import { 
  TMetric, 
  ICreateMetricPayload, 
  IUpdateMetricPayload,
  IMetricsResponse,
  IMetricTypeDefinition
} from '@/types/hospital-metrics';
import api from '@/services/api';

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<TMetric[]>([]);
  const [panelMetrics, setPanelMetrics] = useState<Record<string, string[]>>({});
  const [metricTypes, setMetricTypes] = useState<{
    main: IMetricTypeDefinition[];
    additional: IMetricTypeDefinition[];
  }>({ 
    main: [], 
    additional: [] 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar todas as métricas
  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get<IMetricsResponse>('/metrics');
      setMetrics(response.data.metrics || []);
      setPanelMetrics(response.data.panelMetrics || {});
      setMetricTypes(response.data.metricTypes || { main: [], additional: [] });
    } catch (err) {
      console.error('Erro ao buscar métricas:', err);
      setError('Não foi possível carregar as métricas. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar métricas ao montar o componente
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Adicionar uma nova métrica
  const addMetric = useCallback(async (metricData: ICreateMetricPayload): Promise<TMetric | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Gerar ID para nova métrica
      const newMetricId = `custom-metric-${Date.now()}`;
      
      // Criar objeto de métrica completo
      const newMetric = {
        id: newMetricId,
        ...metricData,
        createdAt: new Date().toISOString(),
        createdBy: metricData.createdBy || 'current-user',
        isCustom: true
      } as TMetric; // Casting necessário devido às interfaces específicas
      
      // Enviar para a API
      const response = await api.post<TMetric>(`/metrics`, newMetric);
      
      // Atualizar estado local
      setMetrics(prevMetrics => [...prevMetrics, response.data]);
      
      return response.data;
    } catch (err) {
      console.error('Erro ao adicionar métrica:', err);
      setError('Não foi possível adicionar a métrica. Tente novamente mais tarde.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Atualizar uma métrica existente
  const updateMetric = useCallback(async (id: string, metricData: IUpdateMetricPayload): Promise<TMetric | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.put<TMetric>(`/metrics/${id}`, metricData);
      
      // Atualizar estado local
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => metric.id === id ? response.data : metric)
      );
      
      return response.data;
    } catch (err) {
      console.error('Erro ao atualizar métrica:', err);
      setError('Não foi possível atualizar a métrica. Tente novamente mais tarde.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Remover uma métrica
  const removeMetric = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.delete(`/metrics/${id}`);
      
      // Atualizar estado local
      setMetrics(prevMetrics => prevMetrics.filter(metric => metric.id !== id));
      
      // Remover a métrica de todos os painéis
      setPanelMetrics(prevPanels => {
        const updatedPanels: Record<string, string[]> = {};
        Object.keys(prevPanels).forEach(key => {
          updatedPanels[key] = prevPanels[key].filter(metricId => metricId !== id);
        });
        return updatedPanels;
      });
      
      return true;
    } catch (err) {
      console.error('Erro ao remover métrica:', err);
      setError('Não foi possível remover a métrica. Tente novamente mais tarde.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Adicionar métrica a um painel
  const addToPanel = useCallback(async (metric: TMetric, panelId: string = 'default'): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar se o painel existe
      if (!panelMetrics[panelId]) {
        setPanelMetrics(prev => ({ ...prev, [panelId]: [] }));
      }
      
      // Verificar se a métrica já está no painel
      if (panelMetrics[panelId]?.includes(metric.id)) {
        return false;
      }
      
      await api.post(`/panels/${panelId}/metrics`, { id: metric.id });
      
      // Atualizar estado local
      setPanelMetrics(prevPanels => ({
        ...prevPanels,
        [panelId]: [...(prevPanels[panelId] || []), metric.id]
      }));
      
      return true;
    } catch (err) {
      console.error('Erro ao adicionar métrica ao painel:', err);
      setError('Não foi possível adicionar a métrica ao painel. Tente novamente mais tarde.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [panelMetrics]);

  // Remover métrica de um painel
  const removeFromPanel = useCallback(async (metricId: string, panelId: string = 'default'): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar se o painel existe
      if (!panelMetrics[panelId]) {
        return false;
      }
      
      await api.delete(`/panels/${panelId}/metrics/${metricId}`);
      
      // Atualizar estado local
      setPanelMetrics(prevPanels => ({
        ...prevPanels,
        [panelId]: prevPanels[panelId].filter(id => id !== metricId)
      }));
      
      return true;
    } catch (err) {
      console.error('Erro ao remover métrica do painel:', err);
      setError('Não foi possível remover a métrica do painel. Tente novamente mais tarde.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [panelMetrics]);

  // Verificar se uma métrica está em um painel
  const isInPanel = useCallback((metricId: string, panelId: string = 'default'): boolean => {
    return Boolean(panelMetrics[panelId]?.includes(metricId));
  }, [panelMetrics]);

  // Obter métricas específicas de um painel
  const getPanelMetrics = useCallback((panelId: string = 'default'): TMetric[] => {
    const panelMetricIds = panelMetrics[panelId] || [];
    return metrics.filter(metric => panelMetricIds.includes(metric.id));
  }, [metrics, panelMetrics]);

  // Filtrar métricas por tipo
  const filterByType = useCallback((type: 'main' | 'additional'): TMetric[] => {
    return metrics.filter(metric => metric.type === type);
  }, [metrics]);

  // Filtrar métricas personalizadas
  const getCustomMetrics = useCallback((): TMetric[] => {
    return metrics.filter(metric => metric.isCustom);
  }, [metrics]);

  // Filtrar métricas padrão (não personalizadas)
  const getStandardMetrics = useCallback((): TMetric[] => {
    return metrics.filter(metric => !metric.isCustom);
  }, [metrics]);

  return {
    // Dados
    metrics,
    panelMetrics: getPanelMetrics(),
    metricTypes,
    isLoading,
    error,
    
    // Operações CRUD
    fetchMetrics,
    addMetric,
    updateMetric,
    removeMetric,
    
    // Operações de painel
    addToPanel,
    removeFromPanel,
    isInPanel,
    getPanelMetrics,
    
    // Filtragem
    filterByType,
    getCustomMetrics,
    getStandardMetrics
  };
};