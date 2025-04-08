import { 
    ISubscriptionPlan, 
    ISubscription, 
    IUpdatePlanRequest,
    TBillingCycle,
    TPlanType,
    IModuleFeature,
    IPlatformModule,
    TModuleName
} from '@/types/subscription-types';
  
class SubscriptionService {
    private baseUrl = 'http://localhost:3001';
  
    // Obtém headers para requisições
    private getHeaders(): HeadersInit {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      // Adicionar token de autenticação se disponível
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Erro ao obter token:', error);
      }
      
      return headers;
    }
  
    /**
     * Obtém todos os planos disponíveis
     */
    async getAvailablePlans(): Promise<ISubscriptionPlan[]> {
      try {
        const response = await fetch(`${this.baseUrl}/plans`);
        console.log('Response:', response);
        
        if (!response.ok) {
          throw new Error('Falha ao obter planos');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Erro ao obter planos:', error);
        return [];
      }
    }
  
    /**
     * Obtém um plano específico por ID
     */
    async getPlanById(planId: string): Promise<ISubscriptionPlan | null> {
      try {
        const response = await fetch(`${this.baseUrl}/plans/${planId}`);
        
        if (!response.ok) {
          throw new Error('Falha ao obter plano');
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Erro ao obter plano ${planId}:`, error);
        return null;
      }
    }
  
    /**
     * Obtém a assinatura atual de um hospital
     */
    async getHospitalSubscription(hospitalId: string): Promise<ISubscription | null> {
      try {
        const response = await fetch(`${this.baseUrl}/subscriptions?hospitalId=${hospitalId}`);
        
        if (!response.ok) {
          throw new Error('Falha ao obter assinatura');
        }
        
        const subscriptions = await response.json();
        return subscriptions.length > 0 ? subscriptions[0] : null;
      } catch (error) {
        console.error(`Erro ao obter assinatura para hospital ${hospitalId}:`, error);
        return null;
      }
    }
  
    /**
     * Cria uma nova assinatura para um hospital
     */
    async createSubscription(planId: string, hospitalId: string, cycle: TBillingCycle = 'monthly'): Promise<ISubscription | null> {
      try {
        // Obter informações do plano
        const plan = await this.getPlanById(planId);
        if (!plan) {
          throw new Error('Plano não encontrado');
        }
        
        // Calcular datas de início e fim
        const startDate = new Date().toISOString();
        const endDate = this.calculateEndDate(startDate, cycle);
        
        // Criar objeto de assinatura
        const newSubscription: Omit<ISubscription, 'id' | 'createdAt' | 'updatedAt'> = {
          planId,
          hospitalId,
          status: 'active',
          currentCycle: cycle,
          startDate,
          endDate,
          autoRenew: true,
          paymentMethod: 'credit_card',
          paymentHistory: []
        };
        
        // Enviar requisição para criar assinatura
        const response = await fetch(`${this.baseUrl}/subscriptions`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(newSubscription),
        });
        
        if (!response.ok) {
          throw new Error('Falha ao criar assinatura');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Erro ao criar assinatura:', error);
        return null;
      }
    }
  
    /**
     * Atualiza uma assinatura existente
     */
    async updateSubscription(subscriptionId: string, updateData: IUpdatePlanRequest): Promise<ISubscription | null> {
      try {
        // Primeiro obter a assinatura atual
        const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`);
        
        if (!response.ok) {
          throw new Error('Falha ao obter assinatura para atualização');
        }
        
        const currentSubscription = await response.json();
        
        // Se estiver mudando de plano, obter o novo plano
        let newPlan = null;
        if (updateData.planId && updateData.planId !== currentSubscription.planId) {
          newPlan = await this.getPlanById(updateData.planId);
          if (!newPlan) {
            throw new Error('Novo plano não encontrado');
          }
        }
        
        // Preparar dados para atualização
        const updatedData: Partial<ISubscription> = {
          ...currentSubscription,
          planId: updateData.planId || currentSubscription.planId,
          updatedAt: new Date().toISOString()
        };
        
        // Atualizar ciclo se fornecido
        if (updateData.cycle && updateData.cycle !== currentSubscription.currentCycle) {
          updatedData.currentCycle = updateData.cycle;
          updatedData.endDate = this.calculateEndDate(currentSubscription.startDate, updateData.cycle);
        }
        
        // Atualizar módulos personalizados se fornecidos (apenas para planos custom)
        if (updateData.modules && currentSubscription.customModules) {
          updatedData.customModules = currentSubscription.customModules.map((module: IModuleFeature): IModuleFeature => {
            const moduleId = module.id as TModuleName;
            if (updateData.modules && updateData.modules[moduleId] !== undefined) {
              return {
                ...module,
                isEnabled: updateData.modules[moduleId] // Ensure 'isEnabled' exists in IModuleFeature
              };
            }
            return module;
          });
        }
        
        // Atualizar limites personalizados se fornecidos
        if (updateData.customLimits) {
          updatedData.customLimits = {
            ...currentSubscription.customLimits,
            ...updateData.customLimits
          };
        }
        
        // Enviar requisição para atualizar assinatura
        const updateResponse = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`, {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify(updatedData),
        });
        
        if (!updateResponse.ok) {
          throw new Error('Falha ao atualizar assinatura');
        }
        
        return await updateResponse.json();
      } catch (error) {
        console.error(`Erro ao atualizar assinatura ${subscriptionId}:`, error);
        return null;
      }
    }
  
    /**
     * Cancela uma assinatura
     */
    async cancelSubscription(subscriptionId: string, immediate: boolean = false): Promise<boolean> {
      try {
        // Obter assinatura atual
        const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`);
        
        if (!response.ok) {
          throw new Error('Falha ao obter assinatura para cancelamento');
        }
        
        const subscription = await response.json();
        
        // Preparar dados para atualização
        const updateData: Partial<ISubscription> = {
          status: immediate ? 'canceled' : 'expired',
          autoRenew: false,
          updatedAt: new Date().toISOString()
        };
        
        // Se cancelamento imediato, definir endDate como agora
        if (immediate) {
          updateData.endDate = new Date().toISOString();
        }
        
        // Enviar requisição para cancelar assinatura
        const updateResponse = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`, {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify(updateData),
        });
        
        return updateResponse.ok;
      } catch (error) {
        console.error(`Erro ao cancelar assinatura ${subscriptionId}:`, error);
        return false;
      }
    }
  
    /**
     * Verifica se um módulo está disponível para um hospital
     */
    async isModuleAvailable(hospitalId: string, moduleName: TModuleName): Promise<boolean> {
      try {
        // Obter assinatura do hospital
        const subscription = await this.getHospitalSubscription(hospitalId);
        if (!subscription) {
          return false;
        }
        
        // Verificar se assinatura está ativa
        if (subscription.status !== 'active' && subscription.status !== 'trial') {
          return false;
        }
        
        // Para planos personalizados, verificar nos módulos customizados
        if (subscription.customModules) {
          const module = subscription.customModules.find(m => m.id === moduleName);
          return module ? module.enabled : false;
        }
        
        // Para planos padrão, obter plano e verificar módulos
        const plan = await this.getPlanById(subscription.planId);
        if (!plan) {
          return false;
        }
        
        const module = plan.modules.find(m => m.id === moduleName);
        return module ? module.enabled : false;
      } catch (error) {
        console.error(`Erro ao verificar disponibilidade do módulo ${moduleName}:`, error);
        return false;
      }
    }
  
    /**
     * Obtém todos os módulos disponíveis para um hospital
     */
    async getAvailableModules(hospitalId: string): Promise<IPlatformModule[]> {
      try {
        // Obter assinatura do hospital
        const subscription = await this.getHospitalSubscription(hospitalId);
        if (!subscription) {
          return [];
        }
        
        // Verificar se assinatura está ativa
        if (subscription.status !== 'active' && subscription.status !== 'trial') {
          return [];
        }
        
        // Para planos personalizados, retornar módulos customizados
        if (subscription.customModules) {
          return subscription.customModules.filter(m => m.enabled);
        }
        
        // Para planos padrão, obter plano e retornar módulos habilitados
        const plan = await this.getPlanById(subscription.planId);
        if (!plan) {
          return [];
        }
        
        return plan.modules.filter(m => m.enabled);
      } catch (error) {
        console.error(`Erro ao obter módulos disponíveis para hospital ${hospitalId}:`, error);
        return [];
      }
    }
  
    /**
     * Calcula a data de término com base na data de início e ciclo
     */
    private calculateEndDate(startDateStr: string, cycle: TBillingCycle): string {
      const startDate = new Date(startDateStr);
      const endDate = new Date(startDate);
      
      switch (cycle) {
        case 'monthly':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'quarterly':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case 'yearly':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }
      
      return endDate.toISOString();
    }
  
    /**
     * Obtém planos recomendados com base no uso atual
     */
    async getRecommendedPlans(hospitalId: string): Promise<ISubscriptionPlan[]> {
      try {
        // Implementação baseada em análise de uso
        // Esta é uma versão simplificada. Uma implementação real analisaria padrões de uso.
        
        // Obter planos disponíveis
        const allPlans = await this.getAvailablePlans();
        
        // Obter assinatura atual
        const subscription = await this.getHospitalSubscription(hospitalId);
        if (!subscription) {
          // Se não tiver assinatura, recomendar plano inicial
          return allPlans.filter(plan => plan.type === 'starter');
        }
        
        // Obter plano atual
        const currentPlan = await this.getPlanById(subscription.planId);
        if (!currentPlan) {
          return allPlans.filter(plan => plan.type === 'starter');
        }
        
        // Lógica de recomendação baseada no tipo de plano atual
        switch (currentPlan.type) {
          case 'starter':
            return allPlans.filter(plan => plan.type === 'professional');
          case 'professional':
            return allPlans.filter(plan => plan.type === 'enterprise');
          case 'enterprise':
          case 'custom':
            return []; // Já está no plano mais alto ou customizado
          default:
            return allPlans.filter(plan => plan.type === 'starter');
        }
      } catch (error) {
        console.error(`Erro ao obter planos recomendados para hospital ${hospitalId}:`, error);
        return [];
      }
    }
}
  
// Exporta uma instância única do serviço
export const subscriptionService = new SubscriptionService();