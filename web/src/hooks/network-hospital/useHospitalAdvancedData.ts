import { useState, useEffect } from 'react';
import { IResourcesData, IEmergencyData, IPredictiveData } from '@/types/hospital-advanced-data-types';

export const useHospitalAdvancedData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resourcesData, setResourcesData] = useState<IResourcesData | null>(null);
  const [emergencyData, setEmergencyData] = useState<IEmergencyData | null>(null);
  const [predictiveData, setPredictiveData] = useState<IPredictiveData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulando chamadas de API
        const resourcesResponse = await fetch('/api/hospital-resources');
        const emergencyResponse = await fetch('/api/emergency-alerts');
        const predictiveResponse = await fetch('/api/predictive-analytics');
        
        if (!resourcesResponse.ok || !emergencyResponse.ok || !predictiveResponse.ok) {
          throw new Error('Falha ao buscar dados avançados');
        }
        
        const resourcesData = await resourcesResponse.json();
        const emergencyData = await emergencyResponse.json();
        const predictiveData = await predictiveResponse.json();
        
        setResourcesData(resourcesData);
        setEmergencyData(emergencyData);
        setPredictiveData(predictiveData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados avançados');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Helpers para facilitar o acesso aos dados
  const getHospitalResources = (hospitalId: string) => {
    return resourcesData?.resources[hospitalId] || null;
  };

  const getHospitalPredictions = (hospitalId: string) => {
    return predictiveData?.predictions[hospitalId] || null;
  };

  const getEmergencyResponseTime = (hospitalId: string) => {
    return emergencyData?.resourceDeployment.estimatedResponseTimes[hospitalId] || null;
  };

  return {
    resourcesData,
    emergencyData,
    predictiveData,
    loading,
    error,
    getHospitalResources,
    getHospitalPredictions,
    getEmergencyResponseTime
  };
};