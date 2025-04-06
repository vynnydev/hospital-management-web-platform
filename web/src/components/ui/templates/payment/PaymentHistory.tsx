/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  ITransaction, 
  ITransactionFilters, 
  IPaymentCard,
  IPaymentAccess,
  CardStatus,
  PaymentPermission
} from '@/types/payment-types';
import { 
  BarChart2, 
  List, 
  Wallet, 
  Filter,
  Shield,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { useTransactionHistory } from '@/services/hooks/payment/transaction/useTransactionHistory';
import { useCardSecurity } from '@/services/hooks/payment/security/useCardSecurity';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';

// Subcomponentes
import { TransactionSearchBar } from './transaction/TransactionSearchBar';
import { TransactionFilters } from './transaction/TransactionFilters';
import { TransactionTable } from './transaction/TransactionTable';
import { TransactionStats } from './transaction/TransactionStats';
import { TransactionDetails } from './transaction/TransactionDetails';
import { TransactionExportMenu } from './transaction/TransactionExportMenu';
import { TransactionActionDialog } from './transaction/TransactionActionDialog';
import { TransactionPagination } from './transaction/TransactionPagination';
import { Button } from '@/components/ui/organisms/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/organisms/dialog';

interface PaymentHistoryProps {
  transactions: ITransaction[];
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
  // Estados para gerenciar as abas e visualizações
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('list');
  
  // Estados para filtros e pesquisa
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<ITransactionFilters>(initialFilters);
  
  // Estados para diálogos e detalhes de transação
  const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [isSecurityAlertOpen, setIsSecurityAlertOpen] = useState(false);
  const [isBlockCardOpen, setIsBlockCardOpen] = useState(false);
  
  // Estados para formulários
  const [disputeReason, setDisputeReason] = useState('');
  const [transactionNote, setTransactionNote] = useState('');
  const [transactionTag, setTransactionTag] = useState('');
  const [blockReason, setBlockReason] = useState('');
  
  // Estados para datas
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });

  // Instanciação do hook personalizado para gerenciar transações
  const transactionHistory = useTransactionHistory({
    userId: userAccess?.userId || '',
    initialFilters,
    pageSize: 10,
  });

  // Instanciação do hook personalizado para gerenciar segurança do cartão
  // Utilizamos uma string vazia como ID padrão, que será atualizada quando uma transação for selecionada
  const cardSecurity = useCardSecurity(selectedCardId || '', {
    userId: userAccess?.userId || '',
    canManage: userAccess?.permissions.includes('manage_cards' as PaymentPermission) || false
  });

  const {
    transactions,
    loading,
    error,
    currentPage,
    totalPages,
    loadNextPage,
    loadPreviousPage,
    applyFilters,
    clearFilters,
    downloadReceipt,
    exportTransactions,
    addTransactionNote,
    addTransactionTag,
    disputeTransaction,
    getTransactionDetails,
    flagSuspiciousTransaction
  } = transactionHistory;

  const {
    securitySettings,
    checkSecurityAlerts,
    blockCard,
    loadSecuritySettings
  } = cardSecurity;

  // Carregar alertas de segurança quando uma transação é selecionada
  useEffect(() => {
    if (selectedCardId) {
      loadSecuritySettings();
    }
  }, [selectedCardId, loadSecuritySettings]);

  // Atualizar filtros quando os props mudarem
  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  // Função para aplicar filtros
  const handleApplyFilters = () => {
    // Converter as datas para o formato ISO
    const updatedFilters = { ...localFilters };
    
    if (dateRange.from) {
      updatedFilters.startDate = dateRange.from.toISOString();
    }
    
    if (dateRange.to) {
      updatedFilters.endDate = dateRange.to.toISOString();
    }
    
    onFilter(updatedFilters);
    applyFilters(updatedFilters);
    setIsFilterOpen(false);
  };
  
  // Função para limpar filtros
  const handleClearFilters = () => {
    setLocalFilters({});
    setDateRange({ from: undefined, to: undefined });
    clearFilters();
    onFilter({});
    setIsFilterOpen(false);
  };
  
  // Função para ver detalhes de uma transação
  const handleViewDetails = async (transactionId: string) => {
      const details = await getTransactionDetails(transactionId);
      
      if (details) {
        setSelectedTransaction(details);
        setSelectedCardId(details.cardId);
        setIsDetailsOpen(true);
      }
    };
  
  // Função para baixar o recibo de uma transação
  const handleDownloadReceipt = async (transactionId: string) => {
    await downloadReceipt(transactionId);
  };
  
  // Função para adicionar uma nota à transação
  const handleAddNote = async () => {
    if (selectedTransaction && transactionNote.trim() !== '') {
      const success = await addTransactionNote(selectedTransaction.id, transactionNote);
      
      if (success) {
        setTransactionNote('');
        setIsNoteOpen(false);
      }
    }
  };
  
  // Função para adicionar uma tag à transação
  const handleAddTag = async () => {
    if (selectedTransaction && transactionTag.trim() !== '') {
      const success = await addTransactionTag(selectedTransaction.id, transactionTag);
      
      if (success) {
        setTransactionTag('');
        setIsTagOpen(false);
      }
    }
  };
  
  // Função para contestar uma transação
  const handleDisputeTransaction = async () => {
    if (selectedTransaction && disputeReason.trim() !== '') {
      const success = await disputeTransaction(selectedTransaction.id, disputeReason, 'Additional details about the dispute');
      
      if (success) {
        setDisputeReason('');
        setIsDisputeOpen(false);
      }
    }
  };
  
  // Função para exportar transações
  const handleExportTransactions = async (format: 'csv' | 'excel' | 'pdf') => {
    await exportTransactions(format);
  };

  // Função para verificar alertas de segurança
  const handleCheckSecurityAlerts = async () => {
    if (selectedCardId) {
      const alerts = await checkSecurityAlerts();
      // Exibir alertas se houver
      if (alerts && alerts.length > 0) {
        setIsSecurityAlertOpen(true);
      }
    }
  };

  // Função para bloquear um cartão
  const handleBlockCard = async () => {
    if (selectedCardId && blockReason.trim() !== '') {
      const success = await blockCard(blockReason);
      
      if (success) {
        setBlockReason('');
        setIsBlockCardOpen(false);
        // Atualize o status do cartão na interface
        const updatedCards = cards.map(card => 
          card.id === selectedCardId ? { ...card, status: 'blocked' as CardStatus } : card
        );
        // Aqui você precisaria atualizar os cards no estado principal
      }
    }
  };
  
  // Função para marcar uma transação como suspeita
  const handleFlagTransaction = async () => {
    if (selectedTransaction) {
      await flagSuspiciousTransaction(selectedTransaction.id, 'Suspicious activity detected');
      setIsDetailsOpen(false);
    }
  };

  // Verificar se o botão de exportação está disponível
  const canExport = userAccess?.permissions.includes('export_data' as PaymentPermission) || false;
  
  // Verificar se o usuário pode fazer ações de segurança
  const canManageSecurity = userAccess?.permissions.includes('manage_cards' as PaymentPermission) || false;

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Função para formatar hora
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Cabeçalho com título e controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
            <Wallet className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Histórico de Transações
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Visualize e gerencie o histórico de transações financeiras
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Barra de pesquisa */}
          <TransactionSearchBar 
            onSearch={(term) => {
              setLocalFilters({...localFilters, merchantSearch: term});
              if (term) handleApplyFilters();
            }}
          />
          
          {/* Botão de filtros */}
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filtros
          </Button>
          
          {/* Menu de exportação */}
          {canExport && (
            <TransactionExportMenu onExport={handleExportTransactions} />
          )}
        </div>
      </div>

      {/* Alerta de segurança, se houver cartões bloqueados */}
      {cards.some(card => card.status === 'blocked') && (
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-4">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-300">Cartões Bloqueados</AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-400">
            Existem cartões bloqueados por motivos de segurança. Verifique a lista de cartões para mais detalhes.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Abas entre lista e estatísticas */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'stats')} className="w-full">
        <TabsList className="grid grid-cols-2 max-w-xs mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <TabsTrigger 
            value="list" 
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === 'list' 
                ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <List className="h-4 w-4 mr-2" />
            Lista
          </TabsTrigger>
          <TabsTrigger 
            value="stats" 
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === 'stats' 
                ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Estatísticas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-0">
          {/* Tabela de transações */}
          <TransactionTable 
            transactions={transactions}
            loading={loading}
            onViewDetails={handleViewDetails}
            onDownloadReceipt={handleDownloadReceipt}
            onGetReceipt={getTransactionDetails}
            onDisputeTransaction={(transaction) => {
              if (transaction.id && disputeReason.trim()) {
                disputeTransaction(transaction.id, disputeReason, 'Additional details about the dispute');
              }
            }}
            totalPages={totalPages}
            onNextPage={async () => { await loadNextPage(); }}
            currentPage={currentPage}
            onPageChange={(page) => {
              if (page > currentPage) {
                loadNextPage();
              } else if (page < currentPage) {
                loadPreviousPage();
              }
            }}
            itemsPerPage={10} // Adjust this value as needed
            onItemsPerPageChange={(items) => {
              // Handle items per page change logic here
            }}
            userAccess={userAccess}
          />
          
          {/* Paginação */}
          <TransactionPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={transactions?.length} // Assuming transactions.length represents the total items
            onPageChange={(page) => {
              if (page > currentPage) {
                loadNextPage();
              } else if (page < currentPage) {
                loadPreviousPage();
              }
            }}
            onNextPage={loadNextPage}
            onPreviousPage={loadPreviousPage}
          />
        </TabsContent>
        
        <TabsContent value="stats" className="mt-0">
          {/* Estatísticas de transações */}
          <TransactionStats 
            transactions={transactions}
            dateRange={dateRange}
          />
        </TabsContent>
      </Tabs>
      
      {/* Diálogo de filtros */}
      <TransactionFilters 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={localFilters}
        onChange={setLocalFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        cards={cards}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        currentFilters={localFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
      
      {/* Diálogo de detalhes da transação */}
      {selectedTransaction && (
        <TransactionDetails 
          transaction={selectedTransaction}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onDownloadReceipt={() => handleDownloadReceipt(selectedTransaction.id)}
          onAddNote={() => setIsNoteOpen(true)}
          onAddTag={() => setIsTagOpen(true)}
          onDispute={() => setIsDisputeOpen(true)}
          cards={cards}
          onBack={() => setIsDetailsOpen(false)}
          onGetReceipt={async (transactionId: string) => {
            await getTransactionDetails(transactionId);
          }}
          onDisputeTransaction={() => {
            if (selectedTransaction) {
              disputeTransaction(selectedTransaction.id, disputeReason, 'Additional details about the dispute');
            }
          }}
          getTransactionDetails={getTransactionDetails}
          userAccess={userAccess}
          // Adicionando novas props relacionadas à segurança
          onFlagAsSuspicious={handleFlagTransaction}
          onCheckSecurityAlerts={handleCheckSecurityAlerts}
          onBlockCard={() => setIsBlockCardOpen(true)}
          canManageSecurity={canManageSecurity}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      )}
      
      {/* Diálogos de ações */}
      <TransactionActionDialog 
        type="note"
        open={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        onConfirm={handleAddNote}
        title="Adicionar Nota"
        transaction={selectedTransaction}
        inputValue={transactionNote}
        onInputChange={setTransactionNote}
        formatDateTime={(date) => new Date(date).toLocaleString('pt-BR')}
        placeholder="Digite uma nota para esta transação..."
        formatAmount={(amount) => `R$ ${amount.toFixed(2)}`}
        getCardHolderName={(cardId) => cards.find(card => card.id === cardId)?.cardHolderName || 'N/A'}
        getDepartmentName={(departmentId) => cards.find(card => card.departmentId === departmentId)?.departmentName || 'N/A'}
        formatPaymentMethod={(method) => method.toUpperCase()}
        formatCategory={(category) => category.toUpperCase()}
        value={transactionNote}
        onChange={(value) => setTransactionNote(value)}
      />
      
      <TransactionActionDialog 
        type="tag"
        open={isTagOpen}
        onClose={() => setIsTagOpen(false)}
        onConfirm={handleAddTag}
        title="Adicionar Tag"
        transaction={selectedTransaction}
        inputValue={transactionTag}
        onInputChange={setTransactionTag}
        value={transactionTag}
        onChange={(value) => setTransactionTag(value)}
        formatDateTime={(date) => new Date(date).toLocaleString('pt-BR')}
        placeholder="Digite uma tag para esta transação..."
        formatAmount={(amount) => `R$ ${amount.toFixed(2)}`}
        getCardHolderName={(cardId) => cards.find(card => card.id === cardId)?.cardHolderName || 'N/A'}
        getDepartmentName={(departmentId) => cards.find(card => card.departmentId === departmentId)?.departmentName || 'N/A'}
        formatPaymentMethod={(method) => method.toUpperCase()}
        formatCategory={(category) => category.toUpperCase()}
      />
      
      <TransactionActionDialog 
        type="dispute"
        open={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
        onConfirm={handleDisputeTransaction}
        title="Contestar Transação"
        value={disputeReason}
        onChange={setDisputeReason}
        inputValue={disputeReason}
        onInputChange={(value) => setDisputeReason(value)}
        placeholder="Descreva o motivo da contestação..."
        transaction={selectedTransaction}
        formatDateTime={(date) => new Date(date).toLocaleString('pt-BR')}
        formatAmount={(amount) => `R$ ${amount.toFixed(2)}`}
        getCardHolderName={(cardId) => cards.find(card => card.id === cardId)?.cardHolderName || 'N/A'}
        getDepartmentName={(departmentId) => cards.find(card => card.departmentId === departmentId)?.departmentName || 'N/A'}
        formatPaymentMethod={(method) => method.toUpperCase()}
        formatCategory={(category) => category.toUpperCase()}
      />

      {/* Diálogo para bloquear cartão */}
      <Dialog open={isBlockCardOpen} onOpenChange={setIsBlockCardOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-gray-100">
              Bloquear Cartão
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Esta ação bloqueará o cartão associado a esta transação. Forneça o motivo para o bloqueio.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="py-4">
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Transação em {formatDate(selectedTransaction.timestamp)} às {formatTime(selectedTransaction.timestamp)}
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {selectedTransaction.merchant}
                </p>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  R$ {selectedTransaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              
              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-700 dark:text-gray-300">Motivo do bloqueio</span>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    rows={3}
                    placeholder="Descreva o motivo do bloqueio deste cartão..."
                  />
                </label>
                
                <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertTitle className="text-red-800 dark:text-red-300">Atenção</AlertTitle>
                  <AlertDescription className="text-red-700 dark:text-red-400">
                    O bloqueio do cartão impedirá todas as transações até que seja desbloqueado.
                    Esta ação deve ser utilizada em casos de suspeita de fraude, perda do cartão ou
                    necessidade urgente de suspender operações.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBlockCardOpen(false)}
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleBlockCard}
              disabled={!blockReason.trim()}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600"
            >
              <Shield className="h-4 w-4 mr-2" />
              Bloquear Cartão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para alertas de segurança */}
      <Dialog open={isSecurityAlertOpen} onOpenChange={setIsSecurityAlertOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-gray-100 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500 dark:text-amber-400" />
              Alertas de Segurança
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Foram detectados alertas de segurança para este cartão.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 max-h-[400px] overflow-y-auto">
            <div className="space-y-4">
              {/* Exemplo de alerta de segurança - Você deve substituir isto pelos alertas reais */}
              <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-3 text-amber-500 dark:text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-300">Padrão de gastos incomum</h4>
                    <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                      Detectamos um padrão de gastos incomum para este cartão em comparação com o histórico
                      de transações. Múltiplas compras em locais diferentes em um curto período de tempo.
                    </p>
                    <div className="mt-3 flex">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2 bg-white dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300"
                      >
                        Ignorar Alerta
                      </Button>
                      <Button
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-800"
                        onClick={() => {
                          setIsSecurityAlertOpen(false);
                          setIsBlockCardOpen(true);
                        }}
                      >
                        Bloquear Cartão
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              onClick={() => setIsSecurityAlertOpen(false)}
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};