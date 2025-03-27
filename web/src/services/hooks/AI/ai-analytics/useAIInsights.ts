import { useState, useEffect, useCallback } from 'react';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import api from '@/services/api';

/**
 * Tipos para insights da IA
 */
export type TInsightSeverity = 'low' | 'medium' | 'high';
export type TInsightCategory = 
  'occupancy' | 
  'staff' | 
  'equipment' | 
  'clinical' | 
  'operational' | 
  'ambulance' | 
  'financial' | 
  'supply';

export interface IInsight {
  id: string;
  title: string;
  description: string;
  severity: TInsightSeverity;
  category: TInsightCategory;
  metrics: string[];
  timestamp: string;
  confidence: number;
  suggestedActions: string[];
}

export interface ISystemInsight extends IInsight {
  affectedHospitals: string[];
}

export interface IHospitalInsight extends IInsight {
  affectedDepartments: string[];
}

export interface IPredictiveInsight extends ISystemInsight {
  timeframe: string;
}

export interface IInsightMetadata {
  lastUpdated: string;
  insightEngine: string;
  dataSourcesAnalyzed: string[];
  insightCount: {
    total: number;
    byHospital: {
      [hospitalId: string]: number;
    };
    byCategory: {
      [category in TInsightCategory]?: number;
    };
    bySeverity: {
      [severity in TInsightSeverity]?: number;
    };
  };
}

export interface IAIInsightsResponse {
  aiInsights: {
    systemWide: ISystemInsight[];
    hospital: {
      [hospitalId: string]: IHospitalInsight[];
    };
    predictive: IPredictiveInsight[];
    meta: IInsightMetadata;
  };
}

/**
 * Hook personalizado para buscar e filtrar insights da IA
 */
export const useAIInsights = (
  selectedHospitalId?: string,
  selectedCategory?: TInsightCategory,
  selectedSeverity?: TInsightSeverity 
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<{
    systemWide: ISystemInsight[];
    hospitalSpecific: IHospitalInsight[];
    predictive: IPredictiveInsight[];
    allInsights: (ISystemInsight | IHospitalInsight | IPredictiveInsight)[];
  }>({
    systemWide: [],
    hospitalSpecific: [],
    predictive: [],
    allInsights: []
  });
  const [metadata, setMetadata] = useState<IInsightMetadata | null>(null);
  
  const { currentUser } = useNetworkData();
  
  // Determinar o ID do hospital a ser usado
  const effectiveHospitalId = selectedHospitalId || currentUser?.hospitalId || null;
  
  /**
   * Função para buscar insights da API
   */
  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      
      // Endpoint da API
      const response = await api.get<IAIInsightsResponse>('/aiInsights');
      const data = response.data;
      
      if (!data || !data.aiInsights) {
        throw new Error('Formato de resposta inválido');
      }
      
      // Armazenar metadados
      setMetadata(data.aiInsights.meta);
      
      // Insights em todo o sistema
      let systemInsights = [...data.aiInsights.systemWide];
      
      // Insights específicos do hospital
      let hospitalInsights: IHospitalInsight[] = [];
      if (effectiveHospitalId && data.aiInsights.hospital[effectiveHospitalId]) {
        hospitalInsights = data.aiInsights.hospital[effectiveHospitalId];
      } else if (!effectiveHospitalId) {
        // Se não houver hospital selecionado, pegar todos os insights de hospitais
        Object.values(data.aiInsights.hospital).forEach(hospitalArray => {
          hospitalInsights = [...hospitalInsights, ...hospitalArray];
        });
      }
      
      // Insights preditivos
      let predictiveInsights = [...data.aiInsights.predictive];
      
      // Filtrar insights do sistema e preditivos por hospital
      if (effectiveHospitalId) {
        systemInsights = systemInsights.filter(insight => 
          insight.affectedHospitals.includes(effectiveHospitalId)
        );
        
        predictiveInsights = predictiveInsights.filter(insight => 
          insight.affectedHospitals.includes(effectiveHospitalId)
        );
      }
      
      // Aplicar filtro de categoria se especificado
      if (selectedCategory) {
        systemInsights = systemInsights.filter(insight => 
          insight.category === selectedCategory
        );
        hospitalInsights = hospitalInsights.filter(insight => 
          insight.category === selectedCategory
        );
        predictiveInsights = predictiveInsights.filter(insight => 
          insight.category === selectedCategory
        );
      }
      
      // Aplicar filtro de severidade se especificado
      if (selectedSeverity) {
        systemInsights = systemInsights.filter(insight => 
          insight.severity === selectedSeverity
        );
        hospitalInsights = hospitalInsights.filter(insight => 
          insight.severity === selectedSeverity
        );
        predictiveInsights = predictiveInsights.filter(insight => 
          insight.severity === selectedSeverity
        );
      }
      
      // Combinar todos os insights filtrados
      const allInsights = [...systemInsights, ...hospitalInsights, ...predictiveInsights];
      
      // Ordenar insights por severidade (high -> medium -> low) e timestamp (mais recente primeiro)
      const sortedInsights = allInsights.sort((a, b) => {
        // Prioridade por severidade
        const severityOrder = { high: 0, medium: 1, low: 2 };
        const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
        
        if (severityDiff !== 0) {
          return severityDiff;
        }
        
        // Se mesma severidade, ordenar por timestamp (mais recente primeiro)
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      
      setInsights({
        systemWide: systemInsights,
        hospitalSpecific: hospitalInsights,
        predictive: predictiveInsights,
        allInsights: sortedInsights
      });
      
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar insights da IA:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar insights da IA');
    } finally {
      setLoading(false);
    }
  }, [effectiveHospitalId, selectedCategory, selectedSeverity]);
  
  // Buscar insights quando os filtros mudarem
  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);
  
  /**
   * Função para buscar insights por ID
   */
  const getInsightById = useCallback((insightId: string) => {
    return insights.allInsights.find(insight => insight.id === insightId) || null;
  }, [insights.allInsights]);
  
  /**
   * Função para buscar insights críticos (high severity)
   */
  const getCriticalInsights = useCallback(() => {
    return insights.allInsights.filter(insight => insight.severity === 'high');
  }, [insights.allInsights]);
  
  /**
   * Função para buscar insights por categoria
   */
  const getInsightsByCategory = useCallback((category: TInsightCategory) => {
    return insights.allInsights.filter(insight => insight.category === category);
  }, [insights.allInsights]);
  
  /**
   * Função para buscar insights relacionados a uma métrica específica
   */
  const getInsightsByMetric = useCallback((metricName: string) => {
    return insights.allInsights.filter(insight => 
      insight.metrics.some(metric => 
        metric.toLowerCase().includes(metricName.toLowerCase())
      )
    );
  }, [insights.allInsights]);
  
  /**
   * Função para obter contagem de insights por severidade
   */
  const getInsightCountBySeverity = useCallback(() => {
    const result = {
      high: 0,
      medium: 0,
      low: 0,
      total: insights.allInsights.length
    };
    
    insights.allInsights.forEach(insight => {
      result[insight.severity]++;
    });
    
    return result;
  }, [insights.allInsights]);
  
  /**
   * Função para forçar uma atualização dos insights
   */
  const refreshInsights = useCallback(() => {
    fetchInsights();
  }, [fetchInsights]);
  
  return {
    // Dados
    insights,
    metadata,
    loading,
    error,
    
    // Funções utilitárias
    getInsightById,
    getCriticalInsights,
    getInsightsByCategory,
    getInsightsByMetric,
    getInsightCountBySeverity,
    refreshInsights
  };
};