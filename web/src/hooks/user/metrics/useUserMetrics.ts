/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/general/auth/AuthService';
import { ICreateMetricPayload, TMetric } from '@/types/hospital-metrics';
import { userMetricsService } from '@/services/general/user/userMetricsService';
import axios from 'axios';

export const useUserMetrics = (panelType: string = 'default') => {
  const [allMetrics, setAllMetrics] = useState<TMetric[]>([]);
  const [panelMetrics, setPanelMetrics] = useState<TMetric[]>([]);
  const [customMetrics, setCustomMetrics] = useState<TMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticação do usuário
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      return isAuth;
    };

    checkAuth();

    // Adicionar listener para mudanças na autenticação
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'auth_user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Carregar todas as métricas
  const fetchAllMetrics = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await userMetricsService.getAllMetrics();
      setAllMetrics(data);
    } catch (err) {
      console.error('Erro ao buscar todas as métricas:', err);
      setError('Não foi possível carregar as métricas. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Carregar métricas do painel do usuário
  const fetchPanelMetrics = useCallback(async () => {
    if (!isAuthenticated) {
      setPanelMetrics([]);
      setIsLoading(false);
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      // Tentar obter as métricas do usuário
      const data = await userMetricsService.getUserPanelMetrics();
      
      // Se não houver métricas, criar configuração padrão
      if (!data || data.length === 0) {
        // Criar configuração padrão para o usuário
        await userMetricsService.createUserMetricsConfig();
        
        // Carregar métricas padrão
        const defaultMetrics = await userMetricsService.getDefaultMetrics();
        setPanelMetrics(defaultMetrics);
      } else {
        setPanelMetrics(data);
      }
    } catch (err) {
      console.error('Erro ao buscar métricas do painel:', err);
      
      // Se erro for 404 (usuário não tem métricas configuradas), criar configuração
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        try {
          await userMetricsService.createUserMetricsConfig();
          const defaultMetrics = await userMetricsService.getDefaultMetrics();
          setPanelMetrics(defaultMetrics);
          setError(null);
        } catch (createErr) {
          setError('Não foi possível criar configuração padrão de métricas.');
        }
      } else {
        setError('Não foi possível carregar as métricas do painel.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Carregar métricas personalizadas do usuário
  const fetchCustomMetrics = useCallback(async () => {
    if (!isAuthenticated) {
      setCustomMetrics([]);
      return;
    }

    try {
      const data = await userMetricsService.getUserCustomMetrics();
      setCustomMetrics(data);
    } catch (err) {
      console.error('Erro ao buscar métricas personalizadas:', err);
    }
  }, [isAuthenticated]);

  // Carregar todas as métricas quando o componente montar
  useEffect(() => {
    const loadMetrics = async () => {
      if (!isAuthenticated) return;
      await Promise.all([
        fetchAllMetrics(),
        fetchPanelMetrics(),
        fetchCustomMetrics()
      ]);
    };

    loadMetrics();
  }, [isAuthenticated, fetchAllMetrics, fetchPanelMetrics, fetchCustomMetrics]);

  // Adicionar uma métrica ao painel do usuário
  const addToPanel = useCallback(async (metricId: string) => {
    if (!isAuthenticated) return false;
    
    setIsLoading(true);
    try {
      const success = await userMetricsService.addMetricToUserPanel(metricId, panelType);
      if (success) {
        await fetchPanelMetrics();
      }
      return success;
    } catch (err) {
      console.error('Erro ao adicionar métrica ao painel:', err);
      setError('Não foi possível adicionar a métrica ao painel. Tente novamente mais tarde.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, panelType, fetchPanelMetrics]);

  // Remover uma métrica do painel do usuário
  const removeFromPanel = useCallback(async (metricId: string) => {
    if (!isAuthenticated) return false;
    
    setIsLoading(true);
    try {
      const success = await userMetricsService.removeMetricFromUserPanel(metricId, panelType);
      if (success) {
        await fetchPanelMetrics();
      }
      return success;
    } catch (err) {
      console.error('Erro ao remover métrica do painel:', err);
      setError('Não foi possível remover a métrica do painel. Tente novamente mais tarde.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, panelType, fetchPanelMetrics]);

  // Verificar se uma métrica está no painel do usuário
  const isInPanel = useCallback(async (metricId: string) => {
    if (!isAuthenticated) return false;
    
    try {
      return await userMetricsService.isMetricInUserPanel(metricId, panelType);
    } catch (err) {
      console.error('Erro ao verificar se métrica está no painel:', err);
      return false;
    }
  }, [isAuthenticated, panelType]);

  // Adicionar uma métrica personalizada
  const addCustomMetric = useCallback(async (metricData: ICreateMetricPayload) => {
    if (!isAuthenticated) return null;
    
    setIsLoading(true);
    try {
      const newMetric = await userMetricsService.addCustomMetric(metricData);
      if (newMetric) {
        await Promise.all([
          fetchAllMetrics(),
          fetchCustomMetrics(),
          fetchPanelMetrics()
        ]);
      }
      return newMetric;
    } catch (err) {
      console.error('Erro ao adicionar métrica personalizada:', err);
      setError('Não foi possível adicionar a métrica personalizada. Tente novamente mais tarde.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchAllMetrics, fetchCustomMetrics, fetchPanelMetrics]);

  // Excluir uma métrica personalizada
  const deleteCustomMetric = useCallback(async (metricId: string) => {
    if (!isAuthenticated) return false;
    
    setIsLoading(true);
    try {
      const success = await userMetricsService.deleteCustomMetric(metricId);
      if (success) {
        await Promise.all([
          fetchAllMetrics(),
          fetchCustomMetrics(),
          fetchPanelMetrics()
        ]);
      }
      return success;
    } catch (err) {
      console.error('Erro ao excluir métrica personalizada:', err);
      setError('Não foi possível excluir a métrica personalizada. Tente novamente mais tarde.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchAllMetrics, fetchCustomMetrics, fetchPanelMetrics]);

  // Funções auxiliares para filtrar métricas
  const getMainMetrics = useCallback(() => {
    return allMetrics.filter(metric => metric.type === 'main');
  }, [allMetrics]);

  const getAdditionalMetrics = useCallback(() => {
    return allMetrics.filter(metric => metric.type === 'additional');
  }, [allMetrics]);

  const refreshMetrics = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      await Promise.all([
        fetchAllMetrics(),
        fetchPanelMetrics(),
        fetchCustomMetrics()
      ]);
    } catch (err) {
      console.error('Erro ao atualizar métricas:', err);
      setError('Não foi possível atualizar as métricas. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchAllMetrics, fetchPanelMetrics, fetchCustomMetrics]);

  const initializeUserMetrics = useCallback(async () => {
    if (isAuthenticated && !isLoading && panelMetrics.length === 0) {
      // Se o usuário estiver autenticado mas não tiver métricas, adicionar padrões
      await userMetricsService.addDefaultMetricsToUserPanel();
      await refreshMetrics(); // Recarregar métricas após adicionar padrões
    }
  }, [isAuthenticated, isLoading, panelMetrics.length, refreshMetrics]);

  useEffect(() => {
    initializeUserMetrics();
  }, [initializeUserMetrics]);

  return {
    allMetrics,
    panelMetrics,
    customMetrics,
    isLoading,
    error,
    isAuthenticated,
    addToPanel,
    removeFromPanel,
    isInPanel,
    addCustomMetric,
    deleteCustomMetric,
    getMainMetrics,
    getAdditionalMetrics,
    refreshMetrics
  };
};