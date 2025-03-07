import api from "@/services/api";
import { ICreateMetricPayload, TMetric } from "@/types/hospital-metrics";

// Serviços relacionados a métricas
export const metricService = {
    // Buscar todas as métricas
    getAll: async (): Promise<TMetric[]> => {
      const response = await api.get('/metrics');
      return response.data;
    },
  
    // Buscar uma métrica pelo ID
    getById: async (id: string): Promise<TMetric> => {
      const response = await api.get(`/metrics/${id}`);
      return response.data;
    },
  
    // Criar uma nova métrica
    create: async (metric: ICreateMetricPayload): Promise<TMetric> => {
      const payload = {
        ...metric,
        id: `metric-${Date.now()}`,
        createdAt: new Date().toISOString(),
        isCustom: true,
      };
      
      const response = await api.post('/metrics', payload);
      return response.data;
    },
  
    // Atualizar uma métrica existente
    update: async (id: string, metric: Partial<TMetric>): Promise<TMetric> => {
      const response = await api.put(`/metrics/${id}`, metric);
      return response.data;
    },
  
    // Excluir uma métrica
    delete: async (id: string): Promise<void> => {
      await api.delete(`/metrics/${id}`);
    },
  };