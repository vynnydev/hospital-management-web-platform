/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useHospitalAnalytics.ts
import { useState, useCallback } from 'react';
import { HospitalAnalyticsServiceAI } from '@/services/AI/hospitalAnalyticsServiceAI';

const analyticsService = new HospitalAnalyticsServiceAI();

export function useHospitalAnalytics() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string>('');
    const [currentMetrics, setCurrentMetrics] = useState<any>(null);
    
    const analyzeMetrics = useCallback(async (metrics: any) => {
        setLoading(true);
        setError(null);
        setCurrentMetrics(metrics);
        try {
            const result = await analyticsService.analyzeMetrics(metrics);
            const analysisText = result ? result.toString() : '';
            setAnalysis(analysisText);
            return analysisText;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro na análise');
            setAnalysis('');
            return '';
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        setLoading,
        error,
        setError,
        analysis,
        analyzeMetrics
    };
}