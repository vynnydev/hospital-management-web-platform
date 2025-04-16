import { useEffect, useState } from "react";
import { IResourcesData } from "@/types/resources-types";
import { AxiosError } from "axios";
import api from "@/services/api";

export const useResourcesData = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [resourcesData, setResourcesData] = useState<IResourcesData | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          const response = await api.get('/resources');
          console.log('API Response:', response.data);
          
          // Verificar se os dados têm a estrutura esperada
          if (response.data && typeof response.data === 'object') {
            setResourcesData({
              resources: response.data
            });
          } else {
            throw new Error('Formato de dados inválido');
          }
          
          setError(null);
        } catch (err) {
          console.error('Error fetching resources:', err);
          
          if (err instanceof AxiosError) {
            setError(
              err.response?.data?.message || 
              'Falha na comunicação com o servidor'
            );
          } else {
            setError('Erro ao carregar dados de recursos');
          }
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }, []);

    // Debug hook state
    useEffect(() => {
      console.log('ResourcesData State:', resourcesData);
    }, [resourcesData]);

    return {
      resourcesData,
      loading,
      error,
      getHospitalResources: (hospitalId: string) => 
        resourcesData?.resources?.[hospitalId] || null
    };
};