import { useEffect, useState } from "react";
import { IResourcesData } from "@/types/resources-types";

export const useResourcesData = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [resourcesData, setResourcesData] = useState<IResourcesData | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          const response = await fetch('/api/hospital-resources');
          
          if (!response.ok) {
            throw new Error('Falha ao buscar dados de recursos');
          }
          
          const data = await response.json();
          setResourcesData(data);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar dados de recursos');
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }, []);
  
    return {
      resourcesData,
      loading,
      error,
      getHospitalResources: (hospitalId: string) => resourcesData?.resources[hospitalId] || null
    };
};