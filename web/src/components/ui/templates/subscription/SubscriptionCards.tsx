'use client'

import { User, Users, HardDrive, Cpu, BarChart2, Hospital } from 'lucide-react';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Calendar,
  CreditCard
} from 'lucide-react'
import { useSubscription } from '@/services/hooks/subscription/useSubscription'

interface SubscriptionCardsProps {
  hospitalId?: string;
}

export const SubscriptionCards = ({ hospitalId }: SubscriptionCardsProps) => {
  const { 
    currentPlan, 
    currentSubscription,
    loading
  } = useSubscription(hospitalId);

  // Formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Formatar preço
  const formatPrice = (price?: number) => {
    if (!price && price !== 0) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Determinar status da assinatura com ícone
  const getSubscriptionStatusInfo = () => {
    if (!currentSubscription) {
      return {
        label: 'Sem assinatura',
        color: 'text-gray-500 dark:text-gray-400',
        bgColor: 'bg-gray-100 dark:bg-gray-700',
        icon: AlertCircle
      };
    }
    
    switch (currentSubscription.status) {
      case 'active':
        return {
          label: 'Ativa',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          icon: CheckCircle
        };
      case 'trial':
        return {
          label: 'Período de teste',
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          icon: Clock
        };
      case 'pending':
        return {
          label: 'Pendente',
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          icon: Clock
        };
      case 'expired':
        return {
          label: 'Expirando',
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          icon: AlertCircle
        };
      case 'canceled':
        return {
          label: 'Cancelada',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          icon: AlertCircle
        };
      default:
        return {
          label: 'Indefinido',
          color: 'text-gray-500 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-700',
          icon: AlertCircle
        };
    }
  };

  // Determinar ciclo de cobrança
  const getBillingCycleLabel = () => {
    if (!currentSubscription) return 'N/A';
    
    switch (currentSubscription.currentCycle) {
      case 'monthly': return 'Mensal';
      case 'quarterly': return 'Trimestral';
      case 'yearly': return 'Anual';
      default: return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentPlan || !currentSubscription) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-8">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-yellow-500 dark:text-yellow-400 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-700 dark:text-yellow-400">
              Sem plano ativo
            </h3>
            <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
              Nenhum plano encontrado para esta unidade. Selecione um plano para ativar os recursos da plataforma.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getSubscriptionStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8">
      {/* Card do Plano Atual */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Plano Atual
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Detalhes do seu plano contratado
          </p>
        </div>
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center mb-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              currentPlan.isPopular 
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' 
                : currentPlan.isEnterprise
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              {currentPlan.name}
            </div>
            
            <div className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusInfo.label}
            </div>
          </div>
          
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Valor do Plano
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                <span className="font-medium">
                  {formatPrice(currentPlan.price[currentSubscription.currentCycle])}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  /{currentSubscription.currentCycle === 'monthly' 
                      ? 'mês' 
                      : currentSubscription.currentCycle === 'quarterly' 
                        ? 'trimestre' 
                        : 'ano'}
                </span>
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Ciclo de Cobrança
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                {getBillingCycleLabel()}
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Data de Início
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatDate(currentSubscription.startDate)}
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Data de Renovação
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatDate(currentSubscription.endDate)}
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Forma de Pagamento
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                <CreditCard className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                {currentSubscription.paymentMethod === 'credit_card' 
                  ? 'Cartão de Crédito' 
                  : currentSubscription.paymentMethod === 'bank_transfer'
                    ? 'Transferência Bancária'
                    : currentSubscription.paymentMethod}
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Renovação Automática
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentSubscription.autoRenew 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {currentSubscription.autoRenew ? 'Ativada' : 'Desativada'}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Card de Limites e Uso */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Limites e Recursos
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Visão geral dos limites do seu plano
          </p>
        </div>
        <div className="px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <User className="h-4 w-4 mr-1" />
                Usuários
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {currentPlan.limits.users === 0 
                  ? 'Ilimitado' 
                  : `${currentPlan.limits.users} usuários`}
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Pacientes
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {currentPlan.limits.patients === 0 
                  ? 'Ilimitado' 
                  : `${currentPlan.limits.patients} pacientes`}
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <HardDrive className="h-4 w-4 mr-1" />
                Armazenamento
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {currentPlan.limits.storage === 0 
                  ? 'Ilimitado' 
                  : `${currentPlan.limits.storage} GB`}
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Cpu className="h-4 w-4 mr-1" />
                Consultas IA
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {currentPlan.limits.aiAssistantQueries === 0 
                  ? 'Ilimitado' 
                  : currentPlan.limits.aiAssistantQueries > 0
                    ? `${currentPlan.limits.aiAssistantQueries} consultas/mês`
                    : 'Não disponível'}
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <BarChart2 className="h-4 w-4 mr-1" />
                Relatórios Personalizados
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {currentPlan.limits.customReports === 0 
                  ? 'Ilimitado' 
                  : currentPlan.limits.customReports > 0
                    ? `${currentPlan.limits.customReports} relatórios`
                    : 'Não disponível'}
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Hospital className="h-4 w-4 mr-1" />
                Leitos
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {currentPlan.limits.beds === 0 
                  ? 'Ilimitado' 
                  : currentPlan.limits.beds > 0
                    ? `${currentPlan.limits.beds} leitos`
                    : 'Não disponível'}
              </dd>
            </div>
          </dl>
          
          {/* Módulos ativos */}
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-5">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Módulos Inclusos: <span className="text-gray-900 dark:text-white font-bold">
                {currentPlan.modules.filter(m => m.enabled).length}
              </span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentPlan.modules
                .filter(m => m.enabled)
                .slice(0, 8)
                .map(module => (
                  <span key={module.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {module.name}
                  </span>
                ))}
              {currentPlan.modules.filter(m => m.enabled).length > 8 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                  +{currentPlan.modules.filter(m => m.enabled).length - 8} módulos
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};