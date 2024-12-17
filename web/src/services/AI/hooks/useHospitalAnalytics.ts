/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useHospitalAnalytics.ts
import { useState, useCallback } from 'react';
import { HospitalAnalyticsService } from '@/services/AI/hospitalAnalytics';

const analyticsService = new HospitalAnalyticsService();

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

    console.log({
        loading,
        error,
        analysis,
        analyzeMetrics
    })

    return {
        loading,
        error,
        analysis,
        analyzeMetrics
    };
}