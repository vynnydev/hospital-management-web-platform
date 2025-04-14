/**
 * API para gerenciar as integrações do sistema
 * Este serviço atua como um ponto central para interagir com a API de integrações
 */

// Interface base para todas as configurações de integração
export interface BaseIntegrationConfig {
    id: string;
    isActive: boolean;
    lastUpdated?: string;
    createdBy?: string;
  }
  
  // Endpoints simulados para dados de integração
  const API_ENDPOINTS = {
    LIST: '/api/integrations',
    DETAILS: (id: string) => `/api/integrations/${id}`,
    ACTIVATE: (id: string) => `/api/integrations/${id}/activate`,
    DEACTIVATE: (id: string) => `/api/integrations/${id}/deactivate`,
    CONFIG: (id: string) => `/api/integrations/${id}/config`,
  };
  
  // Estrutura JSON simulada para armazenamento local
  const LOCAL_STORAGE_KEY = 'hospital_integrations_config';
  
  export class IntegrationsAPI {
    /**
     * Carrega todas as integrações disponíveis
     */
    static async getIntegrations(): Promise<any[]> {
      // Em um ambiente real, isso seria uma chamada à API
      try {
        // Simula a recuperação de dados do localStorage para desenvolvimento
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
          return JSON.parse(savedData);
        }
        
        // Dados padrão caso nada seja encontrado
        return defaultIntegrations;
      } catch (error) {
        console.error('Erro ao carregar integrações:', error);
        return defaultIntegrations;
      }
    }
  
    /**
     * Obtém detalhes de uma integração específica
     */
    static async getIntegrationDetails(id: string): Promise<any> {
      try {
        const integrations = await this.getIntegrations();
        const integration = integrations.find(item => item.id === id);
        
        if (!integration) {
          throw new Error(`Integração não encontrada: ${id}`);
        }
        
        return integration;
      } catch (error) {
        console.error(`Erro ao obter detalhes da integração ${id}:`, error);
        throw error;
      }
    }
  
    /**
     * Ativa uma integração
     */
    static async activateIntegration(id: string): Promise<boolean> {
      try {
        const integrations = await this.getIntegrations();
        const updatedIntegrations = integrations.map(integration => 
          integration.id === id 
            ? { ...integration, isActive: true } 
            : integration
        );
        
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedIntegrations));
        return true;
      } catch (error) {
        console.error(`Erro ao ativar integração ${id}:`, error);
        return false;
      }
    }
  
    /**
     * Desativa uma integração
     */
    static async deactivateIntegration(id: string): Promise<boolean> {
      try {
        const integrations = await this.getIntegrations();
        const updatedIntegrations = integrations.map(integration => 
          integration.id === id 
            ? { ...integration, isActive: false } 
            : integration
        );
        
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedIntegrations));
        return true;
      } catch (error) {
        console.error(`Erro ao desativar integração ${id}:`, error);
        return false;
      }
    }
  
    /**
     * Salva configurações de uma integração
     */
    static async saveIntegrationConfig(id: string, config: any): Promise<boolean> {
      try {
        const integrations = await this.getIntegrations();
        const updatedIntegrations = integrations.map(integration => 
          integration.id === id 
            ? { 
                ...integration, 
                config: {
                  ...integration.config,
                  ...config
                },
                lastUpdated: new Date().toISOString()
              } 
            : integration
        );
        
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedIntegrations));
        return true;
      } catch (error) {
        console.error(`Erro ao salvar configurações da integração ${id}:`, error);
        return false;
      }
    }
  
    /**
     * Obtém as configurações de uma integração
     */
    static async getIntegrationConfig(id: string): Promise<any> {
      try {
        const integration = await this.getIntegrationDetails(id);
        return integration.config || {};
      } catch (error) {
        console.error(`Erro ao obter configurações da integração ${id}:`, error);
        return {};
      }
    }
  }
  
  // Dados padrão das integrações para o modo de desenvolvimento
  const defaultIntegrations = [
    {
      id: 'docsign',
      name: 'DocSign',
      isActive: true,
      category: 'export',
      config: {
        apiKey: '',
        webhookURL: '',
        environment: 'sandbox',
        autoSign: false,
        requirePatientAuth: true,
      }
    },
    {
      id: 'excel',
      name: 'Excel/Sheets',
      isActive: true,
      category: 'export',
      config: {
        exportPath: '/exports',
        defaultFormat: 'xlsx',
        autoExport: true,
        includeCharts: true,
      }
    },
    {
      id: 'slack',
      name: 'Slack',
      isActive: true,
      category: 'communication',
      config: {
        webhookUrl: '',
        defaultChannel: 'geral',
        notifyEmergencies: true,
        notifyAppointments: true,
      }
    },
    {
      id: 'email',
      name: 'Email',
      isActive: true,
      category: 'communication',
      config: {
        smtpServer: '',
        port: 587,
        encryption: 'tls',
        senderEmail: '',
        senderName: 'Hospital System',
      }
    },
    {
      id: 'pdf',
      name: 'PDF Reports',
      isActive: false,
      category: 'export',
      config: {
        outputPath: '/exports/pdf',
        defaultSize: 'a4',
        defaultOrientation: 'portrait',
      }
    },
    {
      id: 'ehr',
      name: 'EHR Connect',
      isActive: false,
      category: 'interoperability',
      config: {
        apiEndpoint: '',
        ehrSystem: 'epic',
        fhirEnabled: true,
      }
    }
  ];