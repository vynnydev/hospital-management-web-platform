/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Badge } from '@/components/ui/organisms/badge';
import { 
  BarChart3,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Calendar,
  CreditCard,
  ShoppingBag,
  CheckCircle,
  Clock,
  AlertTriangle,
  X
} from 'lucide-react';
import { 
  ITransaction, 
  TransactionStatus, 
  PaymentMethod,
  ExpenseCategory
} from '@/types/payment-types';

interface TransactionStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}

interface CategoryStat {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface StatusStat {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

interface TransactionStatsProps {
  transactions: ITransaction[];
  dateRange: { from?: Date; to?: Date };
}

export const TransactionStats: React.FC<TransactionStatsProps> = ({ 
  transactions,
  dateRange
}) => {
  // Cálculo do valor total
  const totalAmount = transactions?.reduce((total, transaction) => total + transaction.amount, 0);
  
  // Cálculo da média de transação
  const averageAmount = transactions?.length 
    ? totalAmount / transactions.length 
    : 0;
  
  // Estatísticas por categoria
  const getCategoryStats = (): CategoryStat[] => {
    const categories: Record<string, number> = {};
    
    transactions?.forEach(transaction => {
      const category = transaction.category;
      categories[category] = (categories[category] || 0) + transaction.amount;
    });
    
    const stats = Object.entries(categories)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalAmount) * 100,
        color: getCategoryColor(category as ExpenseCategory)
      }))
      .sort((a, b) => b.amount - a.amount);
    
    return stats;
  };
  
  // Estatísticas por status
  const getStatusStats = (): StatusStat[] => {
    const statuses: Record<string, number> = {};
    
    transactions?.forEach(transaction => {
      const status = transaction.status;
      statuses[status] = (statuses[status] || 0) + 1;
    });
    
    const stats = Object.entries(statuses)
      .map(([status, count]) => ({
        status,
        count,
        percentage: (count / transactions?.length) * 100,
        color: getStatusColor(status as TransactionStatus)
      }))
      .sort((a, b) => b.count - a.count);
    
    return stats;
  };
  
  // Estatísticas de métodos de pagamento
  const getPaymentMethodStats = () => {
    const methods: Record<string, number> = {};
    
    transactions?.forEach(transaction => {
      const method = transaction.paymentMethod;
      methods[method] = (methods[method] || 0) + 1;
    });
    
    return Object.entries(methods)
      .map(([method, count]) => ({
        method,
        count,
        percentage: (count / transactions?.length) * 100
      }))
      .sort((a, b) => b.count - a.count);
  };
  
  // Função para obter cor por categoria
  const getCategoryColor = (category: ExpenseCategory): string => {
    switch (category) {
      case 'medical_supplies': return '#4C51BF'; // Indigo
      case 'pharmaceuticals': return '#2B6CB0'; // Blue
      case 'equipment': return '#2C7A7B'; // Teal
      case 'office_supplies': return '#38A169'; // Green
      case 'utilities': return '#DD6B20'; // Orange
      case 'travel': return '#D69E2E'; // Yellow
      case 'meals': return '#E53E3E'; // Red
      case 'consulting': return '#805AD5'; // Purple
      case 'software': return '#3182CE'; // Blue
      case 'training': return '#ED8936'; // Orange
      case 'other': return '#718096'; // Gray
      default: return '#A0AEC0'; // Light Gray
    }
  };
  
  // Função para obter cor por status
  const getStatusColor = (status: TransactionStatus): string => {
    switch (status) {
      case 'completed': return '#38A169'; // Green
      case 'pending': return '#3182CE'; // Blue
      case 'declined': return '#E53E3E'; // Red
      case 'refunded': return '#D69E2E'; // Yellow
      case 'under_review': return '#805AD5'; // Purple
      case 'requires_approval': return '#DD6B20'; // Orange
      case 'disputed': return '#E53E3E'; // Red
      case 'canceled': return '#718096'; // Gray
      default: return '#A0AEC0'; // Light Gray
    }
  };
  
  // Função para formatar valor monetário
  const formatCurrency = (amount: number): string => {
    return amount?.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  // Função para formatar categoria
  const formatCategory = (category: ExpenseCategory | string): string => {
    switch (category) {
      case 'medical_supplies': return 'Materiais Médicos';
      case 'pharmaceuticals': return 'Medicamentos';
      case 'equipment': return 'Equipamentos';
      case 'office_supplies': return 'Material de Escritório';
      case 'utilities': return 'Serviços Públicos';
      case 'travel': return 'Viagens';
      case 'meals': return 'Refeições';
      case 'consulting': return 'Consultoria';
      case 'software': return 'Software';
      case 'training': return 'Treinamento';
      case 'other': return 'Outros';
      default: return category;
    }
  };
  
  // Função para formatar status
  const formatStatus = (status: TransactionStatus | string): string => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'pending': return 'Pendente';
      case 'declined': return 'Recusada';
      case 'refunded': return 'Reembolsada';
      case 'under_review': return 'Em Análise';
      case 'requires_approval': return 'Aguardando Aprovação';
      case 'disputed': return 'Contestada';
      case 'canceled': return 'Cancelada';
      default: return status;
    }
  };
  
  // Função para formatar método de pagamento
  const formatPaymentMethod = (method: PaymentMethod | string): string => {
    switch (method) {
      case 'card_present': return 'Cartão Presencial';
      case 'card_not_present': return 'Cartão Não Presencial';
      case 'online': return 'Online';
      case 'mobile': return 'Mobile';
      case 'contactless': return 'Sem Contato';
      case 'recurring': return 'Recorrente';
      default: return method;
    }
  };
  
  // Obter estatísticas
  const categoryStats = getCategoryStats();
  const statusStats = getStatusStats();
  const paymentMethodStats = getPaymentMethodStats();
  
  // Principais métricas
  const keyStats: TransactionStat[] = [
    {
      label: 'Volume Total',
      value: formatCurrency(totalAmount),
      icon: <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      description: 'Valor total das transações'
    },
    {
      label: 'Média por Transação',
      value: formatCurrency(averageAmount),
      icon: <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />,
      description: 'Valor médio por transação'
    },
    {
      label: 'Total de Transações',
      value: transactions?.length,
      icon: <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      description: 'Número total de transações'
    }
  ];
  
  // Período do relatório
  const dateRangeText = () => {
    if (dateRange.from && dateRange.to) {
      return `${dateRange.from.toLocaleDateString('pt-BR')} até ${dateRange.to.toLocaleDateString('pt-BR')}`;
    } else if (dateRange.from) {
      return `A partir de ${dateRange.from.toLocaleDateString('pt-BR')}`;
    } else if (dateRange.to) {
      return `Até ${dateRange.to.toLocaleDateString('pt-BR')}`;
    } else {
      return 'Todos os períodos';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Estatísticas de Transações
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {dateRangeText()}
          </p>
        </div>
      </div>
      
      {/* Principais métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {keyStats.map((stat, index) => (
          <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-gray-200">{stat.value}</p>
                  {stat.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
                  )}
                </div>
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estatísticas por categoria */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-gray-800 dark:text-gray-200">
              <ShoppingBag className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Gastos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.slice(0, 5).map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="h-3 w-3 rounded-full mr-2"
                        style={{ backgroundColor: stat.color }}
                      ></div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {formatCategory(stat.category)}
                      </span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">{formatCurrency(stat.amount)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${stat.percentage}%`,
                        backgroundColor: stat.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
              
              {categoryStats.length > 5 && (
                <div className="text-center mt-2">
                  <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    +{categoryStats.length - 5} categorias adicionais
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Estatísticas por status */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-gray-800 dark:text-gray-200">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
              Transações por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {statusStats.map((stat, index) => (
                <div 
                  key={index} 
                  className="flex items-start p-3 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <div 
                    className="h-10 w-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    {stat.status === 'completed' && <CheckCircle className="h-5 w-5" style={{ color: stat.color }} />}
                    {stat.status === 'pending' && <Clock className="h-5 w-5" style={{ color: stat.color }} />}
                    {stat.status === 'declined' && <X className="h-5 w-5" style={{ color: stat.color }} />}
                    {stat.status === 'disputed' && <AlertTriangle className="h-5 w-5" style={{ color: stat.color }} />}
                    {!(stat.status === 'completed' || stat.status === 'pending' || stat.status === 'declined' || stat.status === 'disputed') && 
                      <CreditCard className="h-5 w-5" style={{ color: stat.color }} />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{formatStatus(stat.status)}</p>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-xl font-bold" style={{ color: stat.color }}>{stat.count}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({stat.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Métodos de pagamento */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-gray-800 dark:text-gray-200">
            <CreditCard className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Métodos de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paymentMethodStats.map((stat, index) => (
              <Card key={index} className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {formatPaymentMethod(stat.method)}
                  </p>
                  <p className="text-xl font-bold mt-1 text-gray-800 dark:text-gray-200">
                    {stat.count}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.percentage.toFixed(1)}% das transações
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};