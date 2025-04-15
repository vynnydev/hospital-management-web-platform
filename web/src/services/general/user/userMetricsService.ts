/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { authService } from '@/services/general/auth/AuthService';
import { ICreateMetricPayload, TMetric } from '@/types/hospital-metrics';

class UserMetricsService {
  private baseUrl = 'http://localhost:3001';

  // Obter cabeçalhos com autenticação
  private getHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // Obter ID do usuário atual
  private getCurrentUserId(): string | null {
    const user = authService.getCurrentUser();
    return user ? user.id : null;
  }

  // Obter todas as métricas disponíveis
  async getAllMetrics(): Promise<TMetric[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/metrics`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      return [];
    }
  }

  async addMetricsToUserPanel(metricIds: string[], panelType: string = 'default'): Promise<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return false;
    }
  
    try {
      // Buscar configuração atual
      let userMetricsConfig;
      
      try {
        const response = await axios.get(`${this.baseUrl}/userMetrics/${userId}`, {
          headers: this.getHeaders()
        });
        userMetricsConfig = response.data;
      } catch (error) {
        // Se não existir, criar configuração
        await this.createUserMetricsConfig();
        userMetricsConfig = {
          userId,
          panelMetrics: {
            default: [],
            custom: []
          },
          favorites: []
        };
      }
  
      // Verificar se a configuração tem a estrutura esperada
      if (!userMetricsConfig.panelMetrics) {
        userMetricsConfig.panelMetrics = { default: [], custom: [] };
      }
      
      if (!userMetricsConfig.panelMetrics[panelType]) {
        userMetricsConfig.panelMetrics[panelType] = [];
      }
  
      // Adicionar apenas as métricas que ainda não estão no painel
      const currentMetricIds = userMetricsConfig.panelMetrics[panelType];
      const newMetricIds = metricIds.filter(id => !currentMetricIds.includes(id));
      
      if (newMetricIds.length > 0) {
        userMetricsConfig.panelMetrics[panelType] = [...currentMetricIds, ...newMetricIds];
        
        // Atualizar a configuração
        // await axios.put(`${this.baseUrl}/userMetrics/${userId}`, userMetricsConfig, {
        //   headers: this.getHeaders()
        // });
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao adicionar métricas ao painel do usuário:', error);
      return false;
    }
  }

  // Função para adicionar métricas padrão ao painel do usuário
  async addDefaultMetricsToUserPanel(): Promise<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return false;
    }
  
    try {
      // Lista de IDs de métricas padrão
      const defaultMainMetrics = [
        'main-critical-hospital', 
        'main-staff', 
        'main-maintenance', 
        'main-waiting'
      ];
      
      const defaultAdditionalMetrics = [
        'additional-hospital-critico',
        'additional-burnout',
        'additional-manutencao',
        'additional-taxa-giro'
      ];
  
      // Verificar se o usuário já tem configuração
      let userConfig;
      try {
        const response = await axios.get(`${this.baseUrl}/userMetrics/${userId}`, {
          headers: this.getHeaders()
        });
        userConfig = response.data;
      } catch (error) {
        // Se o usuário não tiver configuração, criar uma nova
        await this.createUserMetricsConfig();
        userConfig = {
          userId,
          panelMetrics: {
            default: [],
            custom: []
          },
          favorites: []
        };
      }
  
      // Se o painel default não existir, crie-o
      if (!userConfig.panelMetrics) {
        userConfig.panelMetrics = { default: [], custom: [] };
      }
  
      if (!userConfig.panelMetrics.default) {
        userConfig.panelMetrics.default = [];
      }
  
      // Adicionar métricas padrão que ainda não estão no painel
      const updatedMainMetrics = [...userConfig.panelMetrics.default];
      
      // Adicionar métricas principais padrão
      for (const metricId of defaultMainMetrics) {
        if (!updatedMainMetrics.includes(metricId)) {
          updatedMainMetrics.push(metricId);
        }
      }
      
      // Adicionar métricas adicionais padrão
      for (const metricId of defaultAdditionalMetrics) {
        if (!updatedMainMetrics.includes(metricId)) {
          updatedMainMetrics.push(metricId);
        }
      }
  
      // Atualizar a configuração do usuário
      userConfig.panelMetrics.default = updatedMainMetrics;
      
      // await axios.put(`${this.baseUrl}/userMetrics/${userId}`, userConfig, {
      //   headers: this.getHeaders()
      // });
      
      return true;
    } catch (error) {
      console.error('Erro ao adicionar métricas padrão ao painel:', error);
      return false;
    }
  }

  // Método auxiliar para obter métricas padrão
  async getDefaultMetrics(): Promise<TMetric[]> {
    const defaultIds = ['main-critical-hospital', 'main-staff', 'main-maintenance', 'main-waiting'];
    const allMetrics = await this.getAllMetrics();
    return allMetrics.filter(metric => defaultIds.includes(metric.id));
  }

  // Obter métricas do painel do usuário
  async getUserPanelMetrics(): Promise<TMetric[]> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) return [];
        
      try {
        const response = await axios.get(`${this.baseUrl}/userMetrics/${userId}`);
        return response.data?.panelMetrics?.default || [];
      } catch (error) {
        // Se o endpoint não existir (404), criar estrutura no usuário
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          await this.createUserMetricsConfig();
          return this.getDefaultMetrics(); // Carregar métricas padrão
        }
        throw error;
      }
    } catch (error) {
      console.error('Erro ao buscar métricas do painel:', error);
      return [];
    }
  }

  // Criar configuração inicial de métricas para um usuário
  async createUserMetricsConfig(): Promise<void> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    // try {
    //   await axios.post(`${this.baseUrl}/userMetrics`, {
    //     userId,
    //     panelMetrics: {
    //       default: [],
    //       custom: []
    //     },
    //     favorites: []
    //   }, {
    //     headers: this.getHeaders()
    //   });
    // } catch (error) {
    //   console.error('Erro ao criar configuração de métricas do usuário:', error);
    //   throw error;
    // }
  }

  // Adicionar métrica ao painel do usuário
  async addMetricToUserPanel(metricId: string, panelType: string = 'default'): Promise<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return false;
    }

    try {
      // Buscar configuração atual
      const response = await axios.get(`${this.baseUrl}/userMetrics/${userId}`, {
        headers: this.getHeaders()
      });

      let userMetricsConfig = response.data;
      
      // Se não existir, criar configuração
      if (!userMetricsConfig) {
        await this.createUserMetricsConfig();
        userMetricsConfig = {
          userId,
          panelMetrics: {
            default: [],
            custom: []
          },
          favorites: []
        };
      }

      // Verificar se a configuração tem a estrutura esperada
      if (!userMetricsConfig.panelMetrics) {
        userMetricsConfig.panelMetrics = { default: [], custom: [] };
      }
      
      if (!userMetricsConfig.panelMetrics[panelType]) {
        userMetricsConfig.panelMetrics[panelType] = [];
      }

      // Adicionar a métrica se ela ainda não estiver no painel
      if (!userMetricsConfig.panelMetrics[panelType].includes(metricId)) {
        userMetricsConfig.panelMetrics[panelType].push(metricId);
        
        // Atualizar a configuração
        // await axios.put(`${this.baseUrl}/userMetrics/${userId}`, userMetricsConfig, {
        //   headers: this.getHeaders()
        // });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao adicionar métrica ao painel do usuário:', error);
      return false;
    }
  }

  // Remover métrica do painel do usuário
  async removeMetricFromUserPanel(metricId: string, panelType: string = 'default'): Promise<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return false;
    }

    try {
      // Buscar configuração atual
      const response = await axios.get(`${this.baseUrl}/userMetrics/${userId}`, {
        headers: this.getHeaders()
      });

      const userMetricsConfig = response.data;
      
      // Se não existir configuração ou painel, retornar falso
      if (!userMetricsConfig || 
          !userMetricsConfig.panelMetrics || 
          !userMetricsConfig.panelMetrics[panelType]) {
        return false;
      }

      // Remover a métrica do painel
      const index = userMetricsConfig.panelMetrics[panelType].indexOf(metricId);
      if (index !== -1) {
        userMetricsConfig.panelMetrics[panelType].splice(index, 1);
        
        // Atualizar a configuração
        // await axios.put(`${this.baseUrl}/userMetrics/${userId}`, userMetricsConfig, {
        //   headers: this.getHeaders()
        // });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao remover métrica do painel do usuário:', error);
      return false;
    }
  }

  // Verificar se uma métrica está no painel do usuário
  async isMetricInUserPanel(metricId: string, panelType: string = 'default'): Promise<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return false;
    }

    try {
      // Buscar configuração atual
      const response = await axios.get(`${this.baseUrl}/userMetrics/${userId}`, {
        headers: this.getHeaders()
      });

      const userMetricsConfig = response.data;
      
      // Se não existir configuração ou painel, retornar falso
      if (!userMetricsConfig || 
          !userMetricsConfig.panelMetrics || 
          !userMetricsConfig.panelMetrics[panelType]) {
        return false;
      }

      // Verificar se a métrica está no painel
      return userMetricsConfig.panelMetrics[panelType].includes(metricId);
    } catch (error) {
      console.error('Erro ao verificar se métrica está no painel do usuário:', error);
      return false;
    }
  }

  // Adicionar métrica personalizada criada pelo usuário
  async addCustomMetric(metricData: ICreateMetricPayload): Promise<TMetric | null> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return null;
    }

    try {
      // Adicionar informações do usuário à métrica
      const completeMetricData = {
        ...metricData,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        isCustom: true,
        id: `custom-${Date.now()}`
      };

      // Criar a métrica
      const response = await axios.post(`${this.baseUrl}/metrics`, completeMetricData, {
        headers: this.getHeaders()
      });

      const newMetric = response.data;

      // Adicionar automaticamente a métrica ao painel do usuário
      await this.addMetricToUserPanel(newMetric.id);

      return newMetric;
    } catch (error) {
      console.error('Erro ao adicionar métrica personalizada:', error);
      return null;
    }
  }

  // Obter métricas personalizadas do usuário
  async getUserCustomMetrics(): Promise<TMetric[]> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return [];
    }

    try {
      // Buscar todas as métricas
      const allMetrics = await this.getAllMetrics();
      
      // Filtrar apenas as métricas criadas pelo usuário
      return allMetrics.filter(metric => 
        metric.isCustom && metric.createdBy === userId
      );
    } catch (error) {
      console.error('Erro ao buscar métricas personalizadas do usuário:', error);
      return [];
    }
  }

  // Apagar uma métrica personalizada
  async deleteCustomMetric(metricId: string): Promise<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return false;
    }

    try {
      // Buscar a métrica para verificar se é do usuário
      const response = await axios.get(`${this.baseUrl}/metrics/${metricId}`, {
        headers: this.getHeaders()
      });

      const metric = response.data;
      
      // Verificar se a métrica é personalizada e pertence ao usuário
      if (!metric.isCustom || metric.createdBy !== userId) {
        console.error('Usuário não tem permissão para excluir esta métrica');
        return false;
      }

      // Remover a métrica de todos os painéis do usuário
      const userConfig = await axios.get(`${this.baseUrl}/userMetrics/${userId}`, {
        headers: this.getHeaders()
      });

      if (userConfig.data && userConfig.data.panelMetrics) {
        const panelTypes = Object.keys(userConfig.data.panelMetrics);
        for (const panelType of panelTypes) {
          await this.removeMetricFromUserPanel(metricId, panelType);
        }
      }

      // Excluir a métrica
      await axios.delete(`${this.baseUrl}/metrics/${metricId}`, {
        headers: this.getHeaders()
      });

      return true;
    } catch (error) {
      console.error('Erro ao excluir métrica personalizada:', error);
      return false;
    }
  }
}

export const userMetricsService = new UserMetricsService();