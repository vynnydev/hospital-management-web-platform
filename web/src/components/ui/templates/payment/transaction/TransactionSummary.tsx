import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/organisms/card';
import { Badge } from '@/components/ui/organisms/badge';
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  BarChart3,
  Stethoscope,
  CreditCard,
  Activity,
  Coins
} from 'lucide-react';
import { TransactionStatus } from '@/types/payment-types';

interface TransactionSummaryProps {
  summary: {
    total: number;
    totalAmount: number;
    averageAmount: number;
    byStatus: Record<TransactionStatus, number>;
    highestTransaction?: {
      id: string;
      amount: number;
      merchant: string;
      department?: string;
    };
    financialHealthIndicators?: {
      outstandingBills: number;
      pendingInsuranceClaims: number;
      potentialWriteOffs: number;
    };
  };
}

export const TransactionSummary: React.FC<TransactionSummaryProps> = ({ summary }) => {
  // Currency formatting for Brazilian Real
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  // Status badge and icon mapping with healthcare-specific translations
  const getStatusDetails = (status: TransactionStatus) => {
    const statusMap = {
      'pending': { 
        label: 'Pendente', 
        badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        icon: <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      },
      'completed': { 
        label: 'Processado', 
        badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      },
      'under_review': { 
        label: 'Em Análise', 
        badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
        icon: <Stethoscope className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      },
      'requires_approval': { 
        label: 'Aguardando Aprovação', 
        badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
        icon: <AlertCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
      },
      'declined': { 
        label: 'Recusado', 
        badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      },
      'disputed': { 
        label: 'Contestado', 
        badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        icon: <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      },
      'refunded': { 
        label: 'Reembolsado', 
        badgeClass: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
        icon: <Coins className="h-4 w-4 text-teal-600 dark:text-teal-400" />
      },
      'canceled': { 
        label: 'Cancelado', 
        badgeClass: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        icon: <AlertCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      }
    };
    
    return statusMap[status] || { 
      label: status, 
      badgeClass: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      icon: <AlertCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    };
  };
  
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800 dark:text-gray-200">
          <BarChart3 className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Resumo Financeiro Hospitalar
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid md:grid-cols-3 gap-6">
        {/* Financial Overview */}
        <div className="space-y-4">
          <div className="flex items-center text-lg font-semibold text-gray-700 dark:text-gray-300">
            <DollarSign className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Visão Financeira
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Total de Transações</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{summary.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Valor Total</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {formatCurrency(summary.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Valor Médio</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(summary.averageAmount)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Transaction Status Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center text-lg font-semibold text-gray-700 dark:text-gray-300">
            <CreditCard className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Status das Transações
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(summary.byStatus).map(([status, count]) => {
              const { label, badgeClass, icon } = getStatusDetails(status as TransactionStatus);
              return (
                <Badge key={status} className={badgeClass}>
                  <div className="flex items-center">
                    {icon}
                    <span className="ml-1">{label}</span>
                    <span className="ml-1 bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 py-0.5 px-1.5 rounded-full text-xs">
                      {count}
                    </span>
                  </div>
                </Badge>
              );
            })}
          </div>
        </div>
        
        {/* Financial Health Indicators */}
        <div className="space-y-4">
          <div className="flex items-center text-lg font-semibold text-gray-700 dark:text-gray-300">
            <Activity className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Indicadores Financeiros
          </div>
          {summary.financialHealthIndicators && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Faturas Pendentes</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {formatCurrency(summary.financialHealthIndicators.outstandingBills)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Seguros Pendentes</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(summary.financialHealthIndicators.pendingInsuranceClaims)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Potencial Baixa</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(summary.financialHealthIndicators.potentialWriteOffs)}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Highest Transaction Highlight */}
        {summary.highestTransaction && (
          <div className="col-span-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Transação de Maior Valor
                </h4>
                <p className="text-blue-700 dark:text-blue-200">
                  {summary.highestTransaction.merchant} 
                  {summary.highestTransaction.department && ` - ${summary.highestTransaction.department}`}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                  {formatCurrency(summary.highestTransaction.amount)}
                </span>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  ID: {summary.highestTransaction.id}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};