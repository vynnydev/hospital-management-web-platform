import api from "@/services/api";
import { IApiResponse, IConnectionStats, IImportValidationResult, ISyncHistoryItem, ISystemConnector } from "@/types/connectors-types";
import { AxiosError } from "axios";

// Classe principal do serviço de conexões
class ConnectorService {
    private baseUrl: string;
    
    constructor(baseUrl = '') {
      this.baseUrl = baseUrl;
    }
  
    // Obtém todas as conexões de sistemas  
    async getConnectors(): Promise<IApiResponse<ISystemConnector[]>> {
        try {
            console.log("Chamando API de conectores");
            const response = await api.get('connectors');
            console.log("Resposta bruta da API:", response);
            
            // Verificar estrutura da resposta
            if (response && response.data) {
                // Se a resposta já está no formato esperado
                if (response.data.success !== undefined) {
                    console.log("CONECTORES (formato API):", response.data);
                    return response.data;
                } 
                // Se a resposta é apenas o array de dados sem o wrapper
                else if (Array.isArray(response.data)) {
                    console.log("CONECTORES (array direto):", response.data);
                    return {
                        success: true,
                        data: response.data,
                        message: "Dados carregados com sucesso"
                    };
                }
            }
            
            // Fallback para resposta vazia
            console.warn("Formato de resposta inesperado:", response);
            return {
                success: false,
                data: [],
                message: "Formato de resposta inesperado"
            };
        } catch (error) {
            console.error("Erro na API:", error);
            const axiosError = error as AxiosError;
            throw new Error(`Failed to fetch connectors: ${axiosError.message}`);
        }
    }
  
    // Cria uma nova conexão
    async createConnector(connector: Omit<ISystemConnector, 'id'>): Promise<IApiResponse<ISystemConnector>> {
      try {
        const response = await api.post<IApiResponse<ISystemConnector>>(`connectors`, connector);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to create connector: ${axiosError.message}`);
      }
    }
  
    // Atualiza uma conexão existente
    async updateConnector(id: string, connector: Partial<ISystemConnector>): Promise<IApiResponse<ISystemConnector>> {
      try {
        const response = await api.put<IApiResponse<ISystemConnector>>(`connectors/${id}`, connector);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to update connector: ${axiosError.message}`);
      }
    }
  
    // Ativa/desativa uma conexão
    async toggleConnector(id: string, connect: boolean): Promise<IApiResponse<ISystemConnector>> {
      try {
        const response = await api.post<IApiResponse<ISystemConnector>>(
          `connectors/${id}/${connect ? 'connect' : 'disconnect'}`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to toggle connector: ${axiosError.message}`);
      }
    }
  
    // Deleta uma conexão
    async deleteConnector(id: string): Promise<IApiResponse<null>> {
      try {
        const response = await api.delete<IApiResponse<null>>(`connectors/${id}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to delete connector: ${axiosError.message}`);
      }
    }
  
    // Inicia sincronização manual
    async syncConnector(id: string): Promise<IApiResponse<ISyncHistoryItem>> {
      try {
        const response = await api.post<IApiResponse<ISyncHistoryItem>>(`connectors/${id}/sync`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to sync connector: ${axiosError.message}`);
      }
    }
  
    // Obtém histórico de sincronizações
    async getSyncHistory(connectorId?: string, limit = 10, page = 1): Promise<IApiResponse<ISyncHistoryItem[]>> {
      try {
        const url = connectorId 
          ? `connectors/${connectorId}/history?limit=${limit}&page=${page}`
          : `sync-history?limit=${limit}&page=${page}`;
        
        const response = await api.get<IApiResponse<ISyncHistoryItem[]>>(url);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to fetch sync history: ${axiosError.message}`);
      }
    }
  
    // Obtém detalhes de uma sincronização específica
    async getSyncDetails(syncId: string): Promise<IApiResponse<ISyncHistoryItem>> {
      try {
        const response = await api.get<IApiResponse<ISyncHistoryItem>>(`sync-history/${syncId}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to fetch sync details: ${axiosError.message}`);
      }
    }
  
    // Obtém estatísticas de conexão
    async getConnectionStats(): Promise<IApiResponse<IConnectionStats>> {
      try {
        const response = await api.get<IApiResponse<IConnectionStats>>('connectors-stats');
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to fetch connection stats: ${axiosError.message}`);
      }
    }
  
    // Exporta dados de conexões para um formato específico
    async exportData(format: 'json' | 'xml' | 'csv' | 'fhir', connectorIds?: string[]): Promise<Blob> {
      try {
        const response = await api.post(
          `connectors/export`, 
          { format, connectorIds },
          { responseType: 'blob' }
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to export data: ${axiosError.message}`);
      }
    }
  
    // Valida arquivo importado para verificar compatibilidade
    async validateImport(file: File): Promise<IApiResponse<IImportValidationResult>> {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post<IApiResponse<IImportValidationResult>>(
          `connectors/validate-import`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to validate import: ${axiosError.message}`);
      }
    }
  
    // Importa configurações ou dados de conexão
    async importConfig(file: File, mappings?: Array<{ source: string; target: string }>): Promise<IApiResponse<ISystemConnector>> {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        if (mappings) {
          formData.append('mappings', JSON.stringify(mappings));
        }
        
        const response = await api.post<IApiResponse<ISystemConnector>>(
          `connectors/import`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to import config: ${axiosError.message}`);
      }
    }
  
    // Obtém tipos de conectores disponíveis (para o menu de criação de novas conexões)
    async getConnectorTypes(): Promise<IApiResponse<Array<{ id: string; name: string; description: string; icon: string }>>> {
      try {
        const response = await api.get<IApiResponse<Array<{ id: string; name: string; description: string; icon: string }>>>(
          `connector-types`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to fetch connector types: ${axiosError.message}`);
      }
    }
  }
  
  export const connectorService = new ConnectorService();
  export default connectorService;