'use client'

import { useState } from 'react'
import { AlertCircle, Check, Tag, ArrowRight } from 'lucide-react'

// Importando componentes do shadcn/ui
import { Button } from '@/components/ui/organisms/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/organisms/radio-group'
import { Label } from '@/components/ui/organisms/label'

import { useSubscription } from '@/services/hooks/subscription/useSubscription'
import { TBillingCycle } from '@/types/subscription-types'

interface NoActivePlanViewProps {
  hospitalId?: string;
  onPlanSelected?: () => void;
}

export const NoActivePlanView = ({ hospitalId, onPlanSelected }: NoActivePlanViewProps) => {
  const { availablePlans, changePlan, loading } = useSubscription(hospitalId);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<TBillingCycle>('monthly');
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);
  
  // Ciclos de pagamento disponíveis
  const billingCycles = [
    { value: 'monthly', label: 'Mensal' },
    { value: 'quarterly', label: 'Trimestral' },
    { value: 'yearly', label: 'Anual', discount: true }
  ];
  
  // Ordenar planos por preço
  const sortedPlans = [...availablePlans].sort((a, b) => {
    return a.price[selectedCycle] - b.price[selectedCycle];
  });
  
  // Função para formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };
  
  // Função para ativar o plano selecionado
  const handleActivatePlan = async () => {
    if (!selectedPlanId) return;
    
    setIsActivating(true);
    setActivationError(null);
    
    try {
      const success = await changePlan(selectedPlanId, selectedCycle);
      
      if (success) {
        if (onPlanSelected) {
          onPlanSelected();
        }
      } else {
        setActivationError('Não foi possível ativar o plano. Tente novamente.');
      }
    } catch (error) {
      setActivationError('Erro ao processar a solicitação.');
      console.error(error);
    } finally {
      setIsActivating(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Alerta de plano não ativo */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-8 flex items-start">
        <AlertCircle className="text-yellow-500 dark:text-yellow-400 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-yellow-700 dark:text-yellow-400">
            Sem plano ativo
          </h3>
          <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
            Nenhum plano encontrado para esta unidade. Selecione um plano para ativar os recursos da plataforma.
          </p>
        </div>
      </div>
      
      {/* Mensagem de erro */}
      {activationError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{activationError}</span>
        </div>
      )}
      
      {/* Seletor de ciclo de cobrança usando shadcn/ui RadioGroup */}
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
              ${selectedPlanId === plan.id 
                ? 'border-indigo-500 dark:border-indigo-600 shadow-md' 
                : 'border-gray-200 dark:border-gray-700'}
              ${plan.isPopular 
                ? 'ring-2 ring-indigo-500 dark:ring-indigo-600' 
                : ''}
            `}
            onClick={() => setSelectedPlanId(plan.id)}
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
            <div className="p-6 bg-white dark:bg-gray-800 cursor-pointer">
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
                variant={selectedPlanId === plan.id ? "default" : "outline"}
                size="sm"
                className={`mt-4 w-full ${
                  selectedPlanId === plan.id 
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                    : "border-indigo-500 text-indigo-600 dark:border-indigo-600 dark:text-indigo-400"
                }`}
                onClick={() => setSelectedPlanId(plan.id)}
                disabled={loading}
              >
                {selectedPlanId === plan.id ? "Selecionado" : "Selecionar"}
              </Button>
            </div>
            
            {/* Lista de recursos */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-200 dark:border-gray-700 cursor-pointer">
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
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      {/* Botão de ativação */}
      <div className="flex justify-end">
        <Button
          onClick={handleActivatePlan}
          disabled={!selectedPlanId || isActivating}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isActivating ? (
            <>
              <div className="w-5 h-5 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              Ativando...
            </>
          ) : (
            <>
              Ativar Plano
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};