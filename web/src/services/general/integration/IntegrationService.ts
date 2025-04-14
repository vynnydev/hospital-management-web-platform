import axios from 'axios';
import { 
  Integration, 
  IntegrationsResponse, 
  IntegrationResponse, 
  ToggleIntegrationRequest, 
  ToggleIntegrationResponse,
  UpdateIntegrationConfigResponse
} from '@/types/integration-types';

class IntegrationService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  private axiosInstance = axios.create({
    baseURL: this.baseUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  /**
   * Obtém todas as integrações disponíveis
   */
  async getIntegrations(): Promise<Integration[]> {
    try {
      const response = await this.axiosInstance.get('/integrations');
      return response.data.integrations || [];
    } catch (error) {
      console.error('Erro ao buscar integrações:', error);
      throw error;
    }
  }
  
  /**
   * Obtém uma integração específica por ID
   */
  async getIntegration(id: string): Promise<Integration | null> {
    try {
      const response = await this.axiosInstance.get('/integrations');
      const integrations = response.data.integrations || [];
      const integration = integrations.find((item: Integration) => item.id === id);
      
      if (!integration) {
        console.warn(`Integração ${id} não encontrada`);
        return null;
      }
      
      return integration;
    } catch (error) {
      console.error(`Erro ao buscar integração ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Alterna o estado ativo/inativo de uma integração
   */
  async toggleIntegrationStatus(id: string, isActive: boolean): Promise<boolean> {
    try {
      // Primeiro busca todas as integrações
      const allIntegrations = await this.getIntegrations();
      const integrationIndex = allIntegrations.findIndex(item => item.id === id);
      
      if (integrationIndex === -1) {
        throw new Error(`Integração ${id} não encontrada`);
      }
      
      // Atualiza o estado da integração localmente
      const updatedIntegrations = [...allIntegrations];
      updatedIntegrations[integrationIndex] = {
        ...updatedIntegrations[integrationIndex],
        isActive,
        updatedAt: new Date().toISOString()
      };
      
      // Salva todas as integrações de volta para o db.json
      await this.axiosInstance.put('/integrations', { 
        integrations: updatedIntegrations 
      });
      
      return true;
    } catch (error) {
      console.error(`Erro ao alternar status da integração ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Atualiza as configurações de uma integração
   */
  async updateIntegrationConfig(id: string, config: Record<string, any>): Promise<boolean> {
    try {
      // Primeiro busca todas as integrações
      const allIntegrations = await this.getIntegrations();
      const integrationIndex = allIntegrations.findIndex(item => item.id === id);
      
      if (integrationIndex === -1) {
        throw new Error(`Integração ${id} não encontrada`);
      }
      
      // Atualiza a configuração da integração
      const updatedIntegrations = [...allIntegrations];
      updatedIntegrations[integrationIndex] = {
        ...updatedIntegrations[integrationIndex],
        config: {
          ...updatedIntegrations[integrationIndex].config,
          ...config
        },
        updatedAt: new Date().toISOString()
      };
      
      // Salva todas as integrações de volta para o db.json
      await this.axiosInstance.put('/integrations', { 
        integrations: updatedIntegrations 
      });
      
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar configuração da integração ${id}:`, error);
      throw error;
    }
  }

  /**
   * Filtra integrações disponíveis para um determinado usuário com base em função e permissões
   */
  async getIntegrationsForUser(userId: string): Promise<Integration[]> {
    try {
      // Busca o usuário
      const userResponse = await this.axiosInstance.get(`/users/${userId}`);
      const user = userResponse.data;
      
      if (!user) {
        throw new Error(`Usuário ${userId} não encontrado`);
      }
      
      // Busca todas as integrações
      const allIntegrations = await this.getIntegrations();
      
      // Filtra as integrações com base na função e permissões do usuário
      const userRole = user.role || 'paciente';
      const userPermissions = user.permissions || [];
      
      const filteredIntegrations = allIntegrations.filter(integration => {
        // Verifica se a função do usuário está nas funções permitidas
        const roleAvailable = integration.availableForRoles.includes(userRole);
        
        // Verifica se o usuário tem todas as permissões necessárias
        const hasRequiredPermissions = integration.requiredPermissions.every(
          permission => userPermissions.includes(permission)
        );
        
        return roleAvailable && hasRequiredPermissions;
      });
      
      return filteredIntegrations;
    } catch (error) {
      console.error(`Erro ao buscar integrações do usuário ${userId}:`, error);
      throw error;
    }
  }
  
  /**
   * Obtém a configuração específica de uma integração
   */
  async getIntegrationConfig(id: string): Promise<Record<string, any> | null> {
    try {
      const integration = await this.getIntegration(id);
      
      if (!integration) {
        return null;
      }
      
      return integration.config || {};
    } catch (error) {
      console.error(`Erro ao buscar configuração da integração ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Testa a conexão com uma integração
   */
  async testIntegrationConnection(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const integration = await this.getIntegration(id);
      
      if (!integration) {
        return { 
          success: false, 
          message: 'Integração não encontrada' 
        };
      }
      
      // Simulação de teste de conexão
      // Em um ambiente real, faria uma chamada para testar a conexão com o serviço
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = Math.random() > 0.2; // 80% de chance de sucesso
      
      return { 
        success, 
        message: success 
          ? 'Conexão estabelecida com sucesso' 
          : 'Falha ao estabelecer conexão. Verifique as credenciais.'
      };
    } catch (error) {
      console.error(`Erro ao testar conexão com a integração ${id}:`, error);
      return { 
        success: false, 
        message: `Erro ao testar conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }
}

// Exporta uma instância única do serviço
export const integrationService = new IntegrationService();