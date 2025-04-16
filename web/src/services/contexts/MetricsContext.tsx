import { ICreateMetricPayload, TMetric } from '@/types/hospital-metrics';
import React, { createContext, useContext, ReactNode } from 'react';
import { useMetrics } from '@/hooks/hospital-metrics/useMetrics';
import { useMetricsBridge } from '../general/hospital-metrics/metricsBridge';

interface MetricsContextType {
  // Estado
  allMetrics: TMetric[];
  panelMetrics: TMetric[];
  isLoading: boolean;
  error: string | null;
  
  // Métodos para gerenciar métricas
  addMetric: (metricData: ICreateMetricPayload) => Promise<TMetric | null>;
  updateMetric: (id: string, metricData: Partial<TMetric>) => Promise<TMetric | null>;
  removeMetric: (id: string) => Promise<boolean>;
  
  // Métodos para gerenciar o painel
  addToPanel: (metric: TMetric) => Promise<boolean>;
  removeFromPanel: (metricId: string) => Promise<boolean>;
  isInPanel: (metricId: string) => Promise<boolean>;
  
  // Filtros
  filterMainMetrics: () => TMetric[];
  filterAdditionalMetrics: () => TMetric[];
  filterCustomMetrics: () => TMetric[];
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export const MetricsProvider: React.FC<{ children: ReactNode, panelId?: string }> = ({ 
  children,
  panelId = 'default'
}) => {
  // Usar o hook de métricas para acessar todas as métricas
  const {
    metrics: allMetrics,
    isLoading: isLoadingMetrics,
    error,
    addMetric,
    updateMetric,
    removeMetric
  } = useMetrics();
  
  // Usar o hook da ponte de métricas para acessar métricas do painel
  const {
    panelMetrics,
    isLoading: isLoadingPanel,
    addToPanel,
    removeFromPanel,
    isInPanel
  } = useMetricsBridge(panelId);
  
  // Estado combinado de carregamento
  const isLoading = isLoadingMetrics || isLoadingPanel;
  
  // Funções de filtro
  const filterMainMetrics = () => allMetrics.filter(metric => metric.type === 'main');
  const filterAdditionalMetrics = () => allMetrics.filter(metric => metric.type === 'additional');
  const filterCustomMetrics = () => allMetrics.filter(metric => metric.isCustom);
  
  // Valor do contexto
  const contextValue: MetricsContextType = {
    allMetrics,
    panelMetrics,
    isLoading,
    error,
    addMetric,
    updateMetric,
    removeMetric,
    addToPanel,
    removeFromPanel,
    isInPanel,
    filterMainMetrics,
    filterAdditionalMetrics,
    filterCustomMetrics
  };
  
  return (
    <MetricsContext.Provider value={contextValue}>
      {children}
    </MetricsContext.Provider>
  );
};

// Hook para usar o contexto de métricas
export const useMetricsContext = () => {
  const context = useContext(MetricsContext);
  if (context === undefined) {
    throw new Error('useMetricsContext must be used within a MetricsProvider');
  }
  return context;
};

// Hook para métricas do painel (para uso em componentes que só precisam das métricas do painel)
export const usePanelMetrics = () => {
  const { panelMetrics, isLoading, addToPanel, removeFromPanel, isInPanel } = useMetricsContext();
  return { panelMetrics, isLoading, addToPanel, removeFromPanel, isInPanel };
};