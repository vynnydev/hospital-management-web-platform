/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/organisms/button';
import { Card } from '@/components/ui/organisms/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { 
  Clock, 
  Download, 
  Filter, 
  Search, 
  BarChart3, 
  FileDown, 
  FileText,
  RefreshCw,
  AlertTriangle 
} from 'lucide-react';
import { useTransactionHistory } from '@/services/hooks/payment/transaction/useTransactionHistory';
import { useToast } from '@/components/ui/hooks/use-toast';
import { 
  ITransaction, 
  ITransactionFilters, 
  IPaymentCard, 
  IPaymentAccess, 
  TransactionStatus,
  PaymentPermission
} from '@/types/payment-types';

// Componentes auxiliares
import { TransactionFilters } from './transaction/TransactionFilters';
import { TransactionTable } from './transaction/TransactionTable';
import { TransactionDetails } from './transaction/TransactionDetails';
import { TransactionCharts } from './transaction/TransactionCharts';
import { TransactionSummary } from './transaction/TransactionSummary';

interface PaymentHistoryProps {
  transactions?: ITransaction[];
  onFilter: (filters: ITransactionFilters) => void;
  cards: IPaymentCard[];
  filters: ITransactionFilters;
  userAccess: IPaymentAccess | null;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  transactions: initialTransactions,
  onFilter,
  cards,
  filters: initialFilters,
  userAccess
}) => {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [disputeTransaction, setDisputeTransaction] = useState<ITransaction | null>(null);
  
  const { toast } = useToast();
  
  // Usar o hook de histórico de transações
  const {
    transactions,
    loading,
    error,
    filters,
    totalTransactions,
    currentPage,
    totalPages,
    itemsPerPage,
    loadTransactions,
    applyFilters,
    clearFilters,
    changePage,
    changeItemsPerPage,
    getTransactionDetails,
    getTransactionReceipt,
    exportTransactions,
    getTransactionsByCategoryChart,
    getTransactionsByMonthChart,
    disputeTransaction: disputeTransactionApi
  } = useTransactionHistory({
    userId: userAccess?.userId || '',
    initialFilters: initialFilters
  });
  
  // Calcular totais
  const transactionSummary = useMemo(() => {
    if (!transactions) return null;
    
    // Total por status
    const byStatus = transactions.reduce((acc, trans) => {
      acc[trans.status] = (acc[trans.status] || 0) + 1;
      return acc;
    }, {} as Record<TransactionStatus, number>);
    
    // Total por valor
    const totalAmount = transactions.reduce((sum, trans) => sum + trans.amount, 0);
    const averageAmount = transactions.length ? totalAmount / transactions.length : 0;
    
    // Transação de maior valor
    const highestTransaction = [...transactions].sort((a, b) => b.amount - a.amount)[0];
    
    return {
      total: transactions.length,
      totalAmount,
      averageAmount,
      byStatus,
      highestTransaction
    };
  }, [transactions]);
  
  // Efetuar a filtragem
  const handleFilterChange = (newFilters: ITransactionFilters) => {
    applyFilters(newFilters);
    onFilter(newFilters);
  };
  
  // Exportar transações
  const handleExport = async () => {
    const exportUrl = await exportTransactions(exportFormat);
    
    if (exportUrl) {
      // Abrir o arquivo em uma nova janela
      window.open(exportUrl, '_blank');
    }
  };
  
  // Ver detalhes de uma transação
  const handleViewDetails = async (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    setActiveTab('details');
  };
  
  // Registrar uma contestação
  const handleDisputeSubmit = async (reason: string, details: string) => {
    if (!disputeTransaction) return;
    
    const success = await disputeTransactionApi(disputeTransaction.id, reason, details);
    
    if (success) {
      setDisputeTransaction(null);
      // Recarregar as transações para refletir a mudança
      loadTransactions();
    }
  };
  
  // Obter um recibo
  const handleGetReceipt = async (transactionId: string) => {
    const receiptUrl = await getTransactionReceipt(transactionId);
    
    if (receiptUrl) {
      window.open(receiptUrl, '_blank');
    } else {
      toast({
        title: "Recibo indisponível",
        description: "Não foi possível obter o recibo desta transação.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
            <Clock className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Histórico de Transações
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Visualize e gerencie o histórico de transações financeiras
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filtros
          </Button>
          
          <Button
            variant="outline"
            onClick={() => loadTransactions(currentPage, itemsPerPage)}
            className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Atualizar
          </Button>
          
          {userAccess?.permissions.includes('export_data' as PaymentPermission) && (
            <div className="flex gap-1">
              <Button
                variant="outline"
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                onClick={() => {
                  setExportFormat('pdf');
                  handleExport();
                }}
              >
                <FileText className="h-4 w-4 text-red-500 dark:text-red-400" />
              </Button>
              <Button
                variant="outline"
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                onClick={() => {
                  setExportFormat('excel');
                  handleExport();
                }}
              >
                <FileDown className="h-4 w-4 text-green-500 dark:text-green-400" />
              </Button>
              <Button
                variant="outline"
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                onClick={() => {
                  setExportFormat('csv');
                  handleExport();
                }}
              >
                <Download className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Painel de filtros */}
      {showFilterPanel && (
        <Card className="p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <TransactionFilters
            currentFilters={filters}
            onApplyFilters={handleFilterChange}
            onClearFilters={clearFilters}
            cards={[cards[0]]}
          />
        </Card>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium">Erro ao carregar transações</h3>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Resumo rápido */}
      {transactionSummary && (
        <TransactionSummary summary={transactionSummary} />
      )}
      
      {/* Abas principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
          <TabsTrigger 
            value="list" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-blue-400"
          >
            <Clock className="h-4 w-4 mr-1" />
            Lista
          </TabsTrigger>
          
          {selectedTransactionId && (
            <TabsTrigger 
              value="details"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-blue-400"
            >
              <Search className="h-4 w-4 mr-1" />
              Detalhes
            </TabsTrigger>
          )}
          
          <TabsTrigger 
            value="charts"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-blue-400"
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Gráficos
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
          <TabsContent value="list" className="m-0">
            <TransactionTable 
              transactions={transactions || []}
              loading={loading}
              onViewDetails={handleViewDetails}
              onGetReceipt={handleGetReceipt}
              onDisputeTransaction={(transaction) => setDisputeTransaction(transaction)}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={changePage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={changeItemsPerPage}
              userAccess={userAccess}
            />
          </TabsContent>
          
          <TabsContent value="details" className="m-0">
            {selectedTransactionId && (
              <TransactionDetails 
                transaction={transactions?.find((t) => t.id === selectedTransactionId) || null}
                onBack={() => setActiveTab('list')}
                onGetReceipt={handleGetReceipt}
                onDisputeTransaction={(initialTransactions: ITransaction) => setDisputeTransaction(initialTransactions)}
                getTransactionDetails={getTransactionDetails}
                userAccess={userAccess}
                cards={cards}
              />
            )}
          </TabsContent>
          
          <TabsContent value="charts" className="m-0">
            <TransactionCharts 
              getTransactionsByCategoryChart={getTransactionsByCategoryChart}
              getTransactionsByMonthChart={getTransactionsByMonthChart}
              cards={cards}
            />
          </TabsContent>
        </div>
      </Tabs>
      
      {/* Dialog para contestação */}
      {disputeTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Contestar Transação
            </h3>
            
            <div className="space-y-4">
              {/* Formulário de contestação aqui */}
              {/* ... */}
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setDisputeTransaction(null)}
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={() => handleDisputeSubmit('fraud', 'Transação não reconhecida')}
                  className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600"
                >
                  Confirmar Contestação
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};