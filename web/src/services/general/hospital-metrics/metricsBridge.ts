/**
 * Interface para o serviço de ponte de métricas
 * 
 * Este serviço conecta as métricas criadas (seja manualmente ou via IA)
 * com o painel de métricas principal do sistema
 */
export interface IMetricsBridge {
  // Adicionar uma métrica ao painel principal
  addMetricToPanel: (metric: TMetric, panelId?: string) => Promise<boolean>;
  
  // Remover uma métrica do painel principal
  removeMetricFromPanel: (metricId: string, panelId?: string) => Promise<boolean>;
  
  // Obter métricas atuais no painel
  getActivePanelMetrics: (panelId?: string) => Promise<TMetric[]>;
  
  // Sincronizar todas as métricas entre painel e BD
  syncPanelWithDatabase: (panelId?: string) => Promise<boolean>;
  
  // Verificar se uma métrica está no painel
  isMetricInPanel: (metricId: string, panelId?: string) => Promise<boolean>;
}

/**
 * Implementação do serviço de ponte de métricas
 * 
 * Na implementação real, você faria chamadas para API
 * Por enquanto, vamos simular com armazenamento local
 */
class MetricsBridgeService implements IMetricsBridge {
  // Simular armazenamento de métricas no painel
  private panelMetrics: Record<string, TMetric[]> = {
    'default': []
  };
  
  // Evento emitido quando as métricas do painel mudam
  private changeListeners: ((panelId: string, metrics: TMetric[]) => void)[] = [];
  
  constructor() {
    // No ambiente real, carregar métricas iniciais do backend
    this.loadInitialMetrics();
  }
  
  private loadInitialMetrics() {
    // Em um ambiente real, você carregaria do localStorage ou API
    // Para demonstração, vamos simular com métricas vazias
    this.panelMetrics = {
      'default': []
    };
  }
  
  // Adicionar ouvinte para mudanças no painel
  public addChangeListener(callback: (panelId: string, metrics: TMetric[]) => void) {
    this.changeListeners.push(callback);
    return () => {
      this.changeListeners = this.changeListeners.filter(cb => cb !== callback);
    };
  }
  
  // Notificar ouvintes de mudanças
  private notifyChange(panelId: string, metrics: TMetric[]) {
    this.changeListeners.forEach(callback => callback(panelId, metrics));
  }
  
  // Adicionar uma métrica ao painel
  public async addMetricToPanel(metric: TMetric, panelId: string = 'default'): Promise<boolean> {
    // Verificar se o painel existe
    if (!this.panelMetrics[panelId]) {
      this.panelMetrics[panelId] = [];
    }
    
    // Verificar se a métrica já está no painel
    const isAlreadyInPanel = await this.isMetricInPanel(metric.id, panelId);
    if (isAlreadyInPanel) {
      return false;
    }
    
    // Adicionar métrica ao painel
    this.panelMetrics[panelId].push(metric);
    
    // Salvar no localStorage (simulação)
    localStorage.setItem(`panelMetrics_${panelId}`, JSON.stringify(this.panelMetrics[panelId]));
    
    // Notificar mudança
    this.notifyChange(panelId, this.panelMetrics[panelId]);
    
    return true;
  }
  
  // Remover uma métrica do painel
  public async removeMetricFromPanel(metricId: string, panelId: string = 'default'): Promise<boolean> {
    // Verificar se o painel existe
    if (!this.panelMetrics[panelId]) {
      return false;
    }
    
    // Verificar se a métrica está no painel
    const isInPanel = await this.isMetricInPanel(metricId, panelId);
    if (!isInPanel) {
      return false;
    }
    
    // Remover métrica do painel
    this.panelMetrics[panelId] = this.panelMetrics[panelId].filter(m => m.id !== metricId);
    
    // Salvar no localStorage (simulação)
    localStorage.setItem(`panelMetrics_${panelId}`, JSON.stringify(this.panelMetrics[panelId]));
    
    // Notificar mudança
    this.notifyChange(panelId, this.panelMetrics[panelId]);
    
    return true;
  }
  
  // Obter métricas atuais no painel
  public async getActivePanelMetrics(panelId: string = 'default'): Promise<TMetric[]> {
    // Verificar se o painel existe
    if (!this.panelMetrics[panelId]) {
      return [];
    }
    
    // Tentar carregar do localStorage (em um ambiente real)
    try {
      const savedMetrics = localStorage.getItem(`panelMetrics_${panelId}`);
      if (savedMetrics) {
        this.panelMetrics[panelId] = JSON.parse(savedMetrics);
      }
    } catch (error) {
      console.error("Erro ao carregar métricas do painel do localStorage:", error);
    }
    
    return this.panelMetrics[panelId];
  }
  
  // Sincronizar todas as métricas entre painel e BD
  public async syncPanelWithDatabase(panelId: string = 'default'): Promise<boolean> {
    // Em um ambiente real, você sincronizaria com o backend
    // Para demonstração, vamos simular como bem-sucedido
    
    // Notificar mudança (mesmo sem mudanças)
    this.notifyChange(panelId, this.panelMetrics[panelId] || []);
    
    return true;
  }
  
  // Verificar se uma métrica está no painel
  public async isMetricInPanel(metricId: string, panelId: string = 'default'): Promise<boolean> {
    // Verificar se o painel existe
    if (!this.panelMetrics[panelId]) {
      return false;
    }
    
    return this.panelMetrics[panelId].some(metric => metric.id === metricId);
  }
}

// Exportar instância singleton
export const metricsBridge = new MetricsBridgeService();

import { TMetric } from '@/types/hospital-metrics';
// Hook para uso do serviço de ponte de métricas
import { useState, useEffect, useCallback } from 'react';

export const useMetricsBridge = (panelId: string = 'default') => {
  const [panelMetrics, setPanelMetrics] = useState<TMetric[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Carregar métricas iniciais
  useEffect(() => {
    const loadMetrics = async () => {
      setIsLoading(true);
      const metrics = await metricsBridge.getActivePanelMetrics(panelId);
      setPanelMetrics(metrics);
      setIsLoading(false);
    };
    
    loadMetrics();
    
    // Adicionar listener para mudanças
    const unsubscribe = metricsBridge.addChangeListener((id, metrics) => {
      if (id === panelId) {
        setPanelMetrics(metrics);
      }
    });
    
    return unsubscribe;
  }, [panelId]);
  
  // Adicionar métrica ao painel
  const addToPanelHandler = useCallback(async (metric: TMetric) => {
    return await metricsBridge.addMetricToPanel(metric, panelId);
  }, [panelId]);
  
  // Remover métrica do painel
  const removeFromPanelHandler = useCallback(async (metricId: string) => {
    return await metricsBridge.removeMetricFromPanel(metricId, panelId);
  }, [panelId]);
  
  // Verificar se métrica está no painel
  const isInPanelHandler = useCallback(async (metricId: string) => {
    return await metricsBridge.isMetricInPanel(metricId, panelId);
  }, [panelId]);
  
  return {
    panelMetrics,
    isLoading,
    addToPanel: addToPanelHandler,
    removeFromPanel: removeFromPanelHandler,
    isInPanel: isInPanelHandler,
    syncPanel: () => metricsBridge.syncPanelWithDatabase(panelId)
  };
};