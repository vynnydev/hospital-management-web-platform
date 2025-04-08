'use client'

import { useState } from 'react'
import { 
  Download, 
  Eye, 
  Calendar, 
  Check, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  CreditCard,
  FileText,
  Filter,
  ChevronDown
} from 'lucide-react'
import { useSubscription } from '@/services/hooks/subscription/useSubscription'
import { Button } from '@/components/ui/organisms/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/organisms/dropdown-menu'
import { IPayment } from '@/types/subscription-types'

interface PaymentHistoryTabProps {
  hospitalId?: string
}

export const PaymentHistoryTab = ({ hospitalId }: PaymentHistoryTabProps) => {
  const { 
    currentSubscription, 
    currentPlan, 
    loading,
    refreshData
  } = useSubscription(hospitalId)
  
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  // Lista de pagamentos
  const payments = currentSubscription?.paymentHistory || []
  
  // Filtrar pagamentos
  const filteredPayments = filterStatus 
    ? payments.filter(payment => payment.status === filterStatus)
    : payments
  
  // Ordenar pagamentos
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else { // amount
      return sortDirection === 'asc' 
        ? a.amount - b.amount 
        : b.amount - a.amount;
    }
  });
  
  // Alterar ordenação
  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  // Função para atualizar os dados
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };
  
  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Função para formatar valor
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };
  
  // Função para obter ícone do status de pagamento
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed':
        return <Check className="h-4 w-4 text-green-500 dark:text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />;
      case 'refunded':
        return <RefreshCw className="h-4 w-4 text-blue-500 dark:text-blue-400" />;
      default:
        return null;
    }
  };
  
  // Função para obter label do status de pagamento
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processed':
        return 'Processado';
      case 'pending':
        return 'Pendente';
      case 'failed':
        return 'Falhou';
      case 'refunded':
        return 'Reembolsado';
      default:
        return 'Desconhecido';
    }
  };
  
  // Função para obter classe de cor do status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'refunded':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
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
      {/* Cabeçalho com filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            Histórico de Pagamentos
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Visualize todos os pagamentos realizados da sua assinatura
          </p>
        </div>
        
        <div className="flex gap-2">
          {/* Filtro por status usando DropdownMenu do shadcn/ui */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
              >
                <Filter className="h-4 w-4" />
                {filterStatus ? getStatusLabel(filterStatus) : 'Todos os status'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                Todos os status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('processed')}>
                <Check className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                Processado
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('pending')}>
                <Clock className="h-4 w-4 mr-2 text-yellow-500 dark:text-yellow-400" />
                Pendente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('failed')}>
                <AlertTriangle className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
                Falhou
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('refunded')}>
                <RefreshCw className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                Reembolsado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Botão de atualizar */}
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-700"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>
      
      {/* Tabela de pagamentos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Data
                    {sortBy === 'date' && (
                      <ChevronDown className={`h-4 w-4 ml-1 transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Método
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('amount')}
                >
                  <div className="flex items-center">
                    Valor
                    {sortBy === 'amount' && (
                      <ChevronDown className={`h-4 w-4 ml-1 transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedPayments.length > 0 ? (
                sortedPayments.map((payment: IPayment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {payment.paymentMethod === 'credit_card' ? (
                        <span className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-1" />
                          Cartão de Crédito
                        </span>
                      ) : (
                        payment.paymentMethod
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {formatAmount(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">{getStatusLabel(payment.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        {payment.invoiceUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                            onClick={() => window.open(payment.invoiceUrl, '_blank')}
                          >
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">Ver Fatura</span>
                          </Button>
                        )}
                        
                        {payment.receiptUrl && payment.status === 'processed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                            onClick={() => window.open(payment.receiptUrl, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Baixar Recibo</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Nenhum pagamento encontrado
                    {filterStatus && (
                      <span> com o status selecionado</span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Próximo pagamento */}
      {currentSubscription && currentSubscription.status === 'active' && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
          <h4 className="font-medium text-indigo-700 dark:text-indigo-400 mb-2">
            Próximo Pagamento
          </h4>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Valor: <span className="font-medium text-gray-900 dark:text-white">
                  {formatAmount(currentPlan?.price[currentSubscription.currentCycle] || 0)}
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Data: <span className="font-medium text-gray-900 dark:text-white">
                  {formatDate(currentSubscription.endDate)}
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Método: <span className="font-medium text-gray-900 dark:text-white">
                  {currentSubscription.paymentMethod === 'credit_card' ? 'Cartão de Crédito' : currentSubscription.paymentMethod}
                </span>
              </p>
            </div>
            
            <div className="flex items-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mr-2">
                Renovação Automática:
              </p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                currentSubscription.autoRenew 
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {currentSubscription.autoRenew ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Ativada
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Desativada
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};