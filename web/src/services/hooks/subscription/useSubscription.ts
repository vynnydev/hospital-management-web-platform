import { useState, useEffect, useCallback } from 'react';
import { 
  ISubscriptionPlan, 
  ISubscription, 
  IPlatformModule, 
  TModuleName,
  TBillingCycle,
  IUpdatePlanRequest
} from '@/types/subscription-types';
import { subscriptionService } from '@/services/general/subscription/SubscriptionService';
import { useAuth } from '@/services/hooks/auth/useAuth';

interface IUseSubscriptionReturn {
  // Dados
  currentPlan: ISubscriptionPlan | null;
  currentSubscription: ISubscription | null;
  availablePlans: ISubscriptionPlan[];
  availableModules: IPlatformModule[];
  recommendedPlans: ISubscriptionPlan[];
  activeModules: string[];
  moduleOrder: string[];
  
  // Estado
  loading: boolean;
  error: string | null;
  
  // Funções
  changePlan: (planId: string, cycle?: TBillingCycle) => Promise<boolean>;
  toggleModule: (moduleId: TModuleName, enabled: boolean) => Promise<boolean>;
  reorderModules: (moduleIds: TModuleName[]) => Promise<boolean>;
  cancelSubscription: (immediate?: boolean) => Promise<boolean>;
  isModuleAvailable: (moduleId: TModuleName) => boolean;
  refreshData: () => Promise<void>;
}

export function useSubscription(hospitalId?: string): IUseSubscriptionReturn {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPlan, setCurrentPlan] = useState<ISubscriptionPlan | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<ISubscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<ISubscriptionPlan[]>([]);
  const [availableModules, setAvailableModules] = useState<IPlatformModule[]>([]);
  const [recommendedPlans, setRecommendedPlans] = useState<ISubscriptionPlan[]>([]);
  const [activeModules, setActiveModules] = useState<string[]>([]);
  const [moduleOrder, setModuleOrder] = useState<string[]>([]);
  
  // Determinar o ID do hospital atual
  const currentHospitalId = hospitalId || user?.hospitalId || '';
  
  // Função para carregar os dados
  const loadData = useCallback(async () => {
    if (!currentHospitalId) {
      setLoading(false);
      // Limpar os dados ao não ter hospital selecionado
      setCurrentPlan(null);
      setCurrentSubscription(null);
      setAvailableModules([]);
      setRecommendedPlans([]);
      setActiveModules([]);
      setModuleOrder([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Carregar planos disponíveis primeiro, pois são necessários em qualquer cenário
      const plans = await subscriptionService.getAvailablePlans();
      setAvailablePlans(plans);
      
      // Carregar assinatura atual
      const subscription = await subscriptionService.getHospitalSubscription(currentHospitalId);
      setCurrentSubscription(subscription);
      
      // Carregar plano da assinatura
      if (subscription) {
        const plan = await subscriptionService.getPlanById(subscription.planId);
        setCurrentPlan(plan);
        
        // Carregar módulos disponíveis
        const modules = await subscriptionService.getAvailableModules(currentHospitalId);
        setAvailableModules(modules);
        
        // Carregar planos recomendados
        const recommended = await subscriptionService.getRecommendedPlans(currentHospitalId);
        setRecommendedPlans(recommended);
      } else {
        // Se não tiver assinatura, limpar dados relacionados
        setCurrentPlan(null);
        setAvailableModules([]);
        setRecommendedPlans([]);
      }
      
      // Carregar configurações de módulos
      try {
        const response = await fetch(`http://localhost:3001/plan_settings/hospitals?id=${currentHospitalId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setActiveModules(data[0].activeModules || []);
            setModuleOrder(data[0].moduleOrder || []);
          } else {
            // Nenhuma configuração encontrada para este hospital
            setActiveModules([]);
            setModuleOrder([]);
          }
        }
      } catch (e) {
        console.error('Erro ao carregar configurações de módulos:', e);
        // Em caso de erro, definir arrays vazios
        setActiveModules([]);
        setModuleOrder([]);
      }
      
    } catch (e) {
      setError('Erro ao carregar dados de assinatura');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [currentHospitalId]);
  
  // Carregar dados ao inicializar e quando mudar o hospitalId
  useEffect(() => {
    if (currentHospitalId) {
      loadData();
    }
    // Importante: NÃO incluir refreshData na lista de dependências!
  }, [currentHospitalId]);
  
  // Funções de gerenciamento
  
  // Mudar plano
  const changePlan = async (planId: string, cycle?: TBillingCycle): Promise<boolean> => {
    if (!currentHospitalId) return false;
    
    try {
      setLoading(true);
      
      let success: boolean;
      
      if (currentSubscription) {
        // Atualizar plano existente
        const updateData: IUpdatePlanRequest = { planId };
        if (cycle) updateData.cycle = cycle;
        
        const updated = await subscriptionService.updateSubscription(
          currentSubscription.id, 
          updateData
        );
        
        success = !!updated;
      } else {
        // Criar nova assinatura
        const newSubscription = await subscriptionService.createSubscription(
          planId,
          currentHospitalId,
          cycle || 'monthly'
        );
        
        success = !!newSubscription;
      }
      
      if (success) {
        await loadData(); // Recarregar todos os dados
        return true;
      }
      return false;
    } catch (e) {
      setError('Erro ao alterar plano');
      console.error(e);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Ativar/desativar módulo
  const toggleModule = async (moduleId: TModuleName, enabled: boolean): Promise<boolean> => {
    if (!currentHospitalId) return false;
    
    try {
      setLoading(true);
      
      // Atualizar na API
      const response = await fetch(`http://localhost:3001/plan_settings/hospitals?id=${currentHospitalId}`);
      if (!response.ok) throw new Error('Erro ao obter configurações');
      
      const settings = await response.json();
      let currentSetting;
      
      if (settings.length === 0) {
        // Criar configuração se não existir
        currentSetting = {
          hospitalId: currentHospitalId,
          name: "Configurações de Módulos",
          activeModules: [],
          moduleOrder: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Inserir nova configuração
        const createResponse = await fetch(`http://localhost:3001/plan_settings/hospitals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentSetting),
        });
        
        if (!createResponse.ok) throw new Error('Erro ao criar configurações');
        currentSetting = await createResponse.json();
      } else {
        currentSetting = settings[0];
      }
      
      // Atualizar módulos ativos
      let newActiveModules = [...(currentSetting.activeModules || [])];
      if (enabled && !newActiveModules.includes(moduleId)) {
        newActiveModules.push(moduleId);
      } else if (!enabled && newActiveModules.includes(moduleId)) {
        newActiveModules = newActiveModules.filter(id => id !== moduleId);
      }
      
      // Salvar alterações
      const updateResponse = await fetch(`http://localhost:3001/plan_settings/hospitals/${currentSetting.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activeModules: newActiveModules,
          updatedAt: new Date().toISOString()
        }),
      });
      
      if (!updateResponse.ok) throw new Error('Erro ao atualizar configurações');
      
      // Atualizar estado local
      setActiveModules(newActiveModules);
      return true;
    } catch (e) {
      setError('Erro ao ativar/desativar módulo');
      console.error(e);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Reordenar módulos
  const reorderModules = async (moduleIds: TModuleName[]): Promise<boolean> => {
    if (!currentHospitalId) return false;
    
    try {
      setLoading(true);
      
      // Atualizar na API
      const response = await fetch(`http://localhost:3001/plan_settings/hospitals?id=${currentHospitalId}`);
      if (!response.ok) throw new Error('Erro ao obter configurações');
      
      const settings = await response.json();
      let currentSetting;
      
      if (settings.length === 0) {
        // Criar configuração se não existir
        currentSetting = {
          hospitalId: currentHospitalId,
          name: "Configurações de Módulos",
          activeModules: [],
          moduleOrder: moduleIds,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Inserir nova configuração
        const createResponse = await fetch(`http://localhost:3001/plan_settings/hospitals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentSetting),
        });
        
        if (!createResponse.ok) throw new Error('Erro ao criar configurações');
        
        // Atualizar estado local
        setModuleOrder(moduleIds);
        return true;
      }
      
      currentSetting = settings[0];
      
      // Salvar alterações
      const updateResponse = await fetch(`http://localhost:3001/plan_settings/hospitals/${currentSetting.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleOrder: moduleIds,
          updatedAt: new Date().toISOString()
        }),
      });
      
      if (!updateResponse.ok) throw new Error('Erro ao atualizar configurações');
      
      // Atualizar estado local
      setModuleOrder(moduleIds);
      return true;
    } catch (e) {
      setError('Erro ao reordenar módulos');
      console.error(e);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Cancelar assinatura
  const cancelSubscription = async (immediate: boolean = false): Promise<boolean> => {
    if (!currentSubscription) return false;
    
    try {
      setLoading(true);
      const success = await subscriptionService.cancelSubscription(
        currentSubscription.id, 
        immediate
      );
      
      if (success) {
        await loadData(); // Recarregar todos os dados
        return true;
      }
      return false;
    } catch (e) {
      setError('Erro ao cancelar assinatura');
      console.error(e);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Verificar se um módulo está disponível
  const isModuleAvailable = (moduleId: TModuleName): boolean => {
    // Verificar se o módulo está ativo nas configurações
    if (!activeModules.includes(moduleId)) return false;
    
    // Verificar se o módulo está disponível no plano atual
    if (availableModules.find(m => m.id === moduleId)) return true;
    
    return false;
  };
  
  // Função para recarregar os dados
  const refreshData = async (): Promise<void> => {
    await loadData();
  };
  
  return {
    // Dados
    currentPlan,
    currentSubscription,
    availablePlans,
    availableModules,
    recommendedPlans,
    activeModules,
    moduleOrder,
    
    // Estado
    loading,
    error,
    
    // Funções
    changePlan,
    toggleModule,
    reorderModules,
    cancelSubscription,
    isModuleAvailable,
    refreshData
  };
}