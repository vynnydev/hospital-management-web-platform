'use client'

import { useState, useEffect } from 'react'
import { 
  Check, 
  AlertCircle, 
  CreditCard, 
  Calendar, 
  Shield, 
  Zap, 
  Tag, 
  Clock
} from 'lucide-react'

// Importando componentes do shadcn/ui
import { Button } from '@/components/ui/organisms/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/organisms/radio-group'
import { Label } from '@/components/ui/organisms/label'

import { useSubscription } from '@/hooks/subscription/useSubscription'
import { ISubscriptionPlan, TBillingCycle } from '@/types/subscription-types'
import { SubscriptionCards } from '../SubscriptionCards'
import { NoActivePlanView } from '../no-plan/NoActivePlanView'

interface PlanSelectionTabProps {
  hospitalId?: string
}

export const PlanSelectionTab = ({ hospitalId }: PlanSelectionTabProps) => {
  const { 
    currentPlan, 
    currentSubscription,
    availablePlans, 
    recommendedPlans,
    changePlan,
    loading,
    refreshData
  } = useSubscription(hospitalId)
  
  const [selectedPlan, setSelectedPlan] = useState<ISubscriptionPlan | null>(currentPlan)
  const [selectedCycle, setSelectedCycle] = useState<TBillingCycle>(
    currentSubscription?.currentCycle || 'monthly'
  )
  const [isChangingPlan, setIsChangingPlan] = useState(false)
  const [changeSuccess, setChangeSuccess] = useState(false)
  const [changeError, setChangeError] = useState<string | null>(null)
  
  // Atualizar o plano selecionado quando o plano atual mudar
  useEffect(() => {
    setSelectedPlan(currentPlan);
  }, [currentPlan]);
  
  console.log('Planos disponíveis:', availablePlans);

  // Atualizar o ciclo selecionado quando a assinatura atual mudar
  useEffect(() => {
    if (currentSubscription) {
      setSelectedCycle(currentSubscription.currentCycle);
    }
  }, [currentSubscription]);
  
  // Ciclos de pagamento disponíveis
  const billingCycles = [
    { value: 'monthly', label: 'Mensal' },
    { value: 'quarterly', label: 'Trimestral' },
    { value: 'yearly', label: 'Anual', discount: true }
  ]
  
  // Ordenar planos por preço
  const sortedPlans = [...availablePlans].sort((a, b) => {
    return a.price[selectedCycle] - b.price[selectedCycle];
  });
  
  // Função para lidar com a mudança de plano
  const handleChangePlan = async () => {
    if (!selectedPlan) return;
    
    setIsChangingPlan(true);
    setChangeSuccess(false);
    setChangeError(null);
    
    try {
      const success = await changePlan(selectedPlan.id, selectedCycle);
      
      if (success) {
        setChangeSuccess(true);
        // Redefinir após 3 segundos
        setTimeout(() => {
          setChangeSuccess(false);
        }, 3000);
      } else {
        setChangeError('Não foi possível alterar o plano. Tente novamente.');
      }
    } catch (error) {
      setChangeError('Erro ao processar a solicitação.');
      console.error(error);
    } finally {
      setIsChangingPlan(false);
    }
  };
  
  // Função para formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };
  
  // Verificar se há upgrade ou downgrade
  const isPlanUpgrade = () => {
    if (!currentPlan || !selectedPlan) return false;
    return selectedPlan.price[selectedCycle] > currentPlan.price[selectedCycle];
  };
  
  const isPlanDowngrade = () => {
    if (!currentPlan || !selectedPlan) return false;
    return selectedPlan.price[selectedCycle] < currentPlan.price[selectedCycle];
  };
  
  // Handler para quando um plano é ativado a partir da view de "nenhum plano"
  const handlePlanActivated = async () => {
    await refreshData();
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Se não houver plano atual, mostrar a view de seleção de plano inicial
  if (!currentPlan || !currentSubscription) {
    return (
      <NoActivePlanView hospitalId={hospitalId} onPlanSelected={handlePlanActivated} />
    );
  }
  
  return (
    <div>
      {/* Mostrar os cards de assinatura */}
      <SubscriptionCards hospitalId={hospitalId} />
      
      {/* Mensagem de sucesso */}
      {changeSuccess && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center">
          <Check className="h-5 w-5 mr-2" />
          <span>Seu plano foi alterado com sucesso!</span>
        </div>
      )}
      
      {/* Mensagem de erro */}
      {changeError && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{changeError}</span>
        </div>
      )}
      
      {/* Seletor de ciclo de cobrança - usando shadcn RadioGroup */}
      <div className="mb-6">
        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ciclo de Cobrança
        </Label>
        
        <RadioGroup 
          value={selectedCycle} 
          onValueChange={(value) => setSelectedCycle(value as TBillingCycle)}
          className="flex space-x-4"
        >
          {billingCycles.map((cycle) => (
            <div key={cycle.value} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={cycle.value} 
                id={`cycle-${cycle.value}`}
                className={selectedCycle === cycle.value ? "border-indigo-500 text-indigo-600" : ""}
              />
              <Label 
                htmlFor={`cycle-${cycle.value}`}
                className={`
                  font-medium cursor-pointer
                  ${selectedCycle === cycle.value 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                {cycle.label}
                {cycle.discount && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400">
                    <Tag className="w-3 h-3 mr-1" />
                    10% OFF
                  </span>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* Lista de planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sortedPlans.map((plan) => (
          <div
            key={plan.id}
            className={`
              relative rounded-xl overflow-hidden border-2 transition-all duration-200
              ${selectedPlan?.id === plan.id 
                ? 'border-indigo-500 dark:border-indigo-600 shadow-md' 
                : 'border-gray-200 dark:border-gray-700'}
              ${plan.isPopular 
                ? 'ring-2 ring-indigo-500 dark:ring-indigo-600' 
                : ''}
            `}
          >
            {/* Etiqueta "Popular" ou "Enterprise" */}
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
            )}
            {plan.isEnterprise && (
              <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                ENTERPRISE
              </div>
            )}
            
            {/* Cabeçalho do plano */}
            <div className="p-6 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 h-10">{plan.description}</p>
              
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(plan.price[selectedCycle])}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                  /{selectedCycle === 'monthly' ? 'mês' : selectedCycle === 'quarterly' ? 'trimestre' : 'ano'}
                </span>
              </div>
              
              {plan.price.setup !== undefined && plan.price.setup > 0 && (
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  + Taxa de setup: {formatPrice(plan.price.setup)}
                </div>
              )}
              
              <Button
                variant={selectedPlan?.id === plan.id ? "default" : "outline"}
                size="sm"
                className={`mt-4 w-full ${
                  selectedPlan?.id === plan.id 
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                    : "border-indigo-500 text-indigo-600 dark:border-indigo-600 dark:text-indigo-400"
                }`}
                onClick={() => setSelectedPlan(plan)}
                disabled={loading}
              >
                {selectedPlan?.id === plan.id ? "Selecionado" : "Selecionar"}
              </Button>
            </div>
            
            {/* Lista de recursos */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3">Recursos incluídos:</h4>
              <ul className="space-y-2">
                {/* Mostrar quantidade de módulos */}
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-2 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.modules.filter(m => m.enabled).length} módulos ativos
                  </span>
                </li>
                
                {/* Mostrar limites principais */}
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-2 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.limits.users === 0 ? 'Usuários ilimitados' : `Até ${plan.limits.users} usuários`}
                  </span>
                </li>
                
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-2 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.limits.patients === 0 ? 'Pacientes ilimitados' : `Até ${plan.limits.patients} pacientes`}
                  </span>
                </li>
                
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-2 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.type === 'custom' ? 'Suporte 24/7 dedicado' : plan.type === 'enterprise' ? 'Suporte 24/7' : 'Suporte em horário comercial'}
                  </span>
                </li>
                
                {/* Mostrar IA assistente se disponível */}
                {plan.modules.find(m => m.id === 'ai-assistant')?.enabled && (
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-2 mt-0.5">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Assistente IA Avançado
                    </span>
                  </li>
                )}
              </ul>
              
              {plan.type === 'custom' && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Plano personalizado com recursos e limites definidos especificamente para sua instituição.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Resumo da alteração */}
      {selectedPlan && currentPlan && selectedPlan.id !== currentPlan.id && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">
            Resumo da alteração
          </h4>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">De:</span> {currentPlan.name} ({formatPrice(currentPlan.price[selectedCycle])}/{selectedCycle === 'monthly' ? 'mês' : selectedCycle === 'quarterly' ? 'trimestre' : 'ano'})
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Para:</span> {selectedPlan.name} ({formatPrice(selectedPlan.price[selectedCycle])}/{selectedCycle === 'monthly' ? 'mês' : selectedCycle === 'quarterly' ? 'trimestre' : 'ano'})
              </p>
              
              {isPlanUpgrade() && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                  <Check className="inline-block h-4 w-4 mr-1" />
                  Você está fazendo um upgrade. Acesso imediato aos novos recursos.
                </p>
              )}
              
              {isPlanDowngrade() && (
                <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">
                  <AlertCircle className="inline-block h-4 w-4 mr-1" />
                  Você está fazendo um downgrade. Algumas funcionalidades serão limitadas.
                </p>
              )}
            </div>
            
            <Button
              onClick={handleChangePlan}
              disabled={isChangingPlan || loading}
              className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isChangingPlan ? (
                <>
                  <div className="w-5 h-5 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  Processando...
                </>
              ) : (
                'Confirmar Mudança'
              )}
            </Button>
          </div>
        </div>
      )}
      
      {/* Planos recomendados */}
      {recommendedPlans.length > 0 && currentPlan && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            Planos Recomendados para Você
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedPlans.map((plan) => (
              <div 
                key={plan.id}
                className="p-4 border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-indigo-700 dark:text-indigo-400">{plan.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{plan.description}</p>
                  </div>
                  <div className="bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded text-xs font-medium">
                    Recomendado
                  </div>
                </div>
                
                <div className="mt-3">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatPrice(plan.price[selectedCycle])}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                    /{selectedCycle === 'monthly' ? 'mês' : selectedCycle === 'quarterly' ? 'trimestre' : 'ano'}
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full border-indigo-500 text-indigo-600 dark:border-indigo-600 dark:text-indigo-400"
                  onClick={() => {
                    setSelectedPlan(plan);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Ver Detalhes
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};