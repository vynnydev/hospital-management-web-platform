import { useState, useCallback, useRef } from 'react';
import { IHospital } from '@/types/hospital-network-types';

export const useAnalytics = (analyzeMetrics: any) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());
  const [updateCount, setUpdateCount] = useState(0);

  const shouldUpdate = useCallback(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;
    return timeSinceLastUpdate >= 5000;
  }, []);

  const fetchAnalysis = useCallback(async (force: boolean = false, filteredHospitals?: IHospital[]) => {
    if (!force && !shouldUpdate()) {
      console.log('Atualização ignorada - muito próxima da última');
      return;
    }

    try {
      setLoading(true);
      
      if (!filteredHospitals?.length) {
        throw new Error('Nenhum hospital disponível para análise');
      }

      // ... resto da lógica de análise ...

      lastUpdateRef.current = Date.now();
      setUpdateCount(count => count + 1);

    } catch (error) {
      console.error('Erro ao buscar análise:', error);
      setError(error instanceof Error ? error.message : 'Erro ao processar dados');
    } finally {
      setLoading(false);
    }
  }, [shouldUpdate, analyzeMetrics]);

  return {
    loading,
    error,
    analysis,
    fetchAnalysis,
    setLoading,
    setError,
    updateTimeoutRef,
    updateCount
  };
};