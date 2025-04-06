/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/organisms/tabs';
import { Card, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { Badge } from '@/components/ui/organisms/badge';
import { Separator } from '@/components/ui/organisms/Separator';
import {
  CreditCard,
  PlusCircle,
  Clock,
  AlertTriangle,
  FileText,
  BarChart3,
  Shield,
  LogOut,
  RefreshCw,
  Settings,
  Search
} from 'lucide-react';

import { useToast } from '@/components/ui/hooks/use-toast';
import { usePaymentData } from '@/services/hooks/payment/usePaymentData';

import { SecurityLayer } from './payment/SecurityLayer';
import { CardsList } from './payment/CardsList';
import { CardDetails } from './payment/CardDetails';
import { PaymentHistory } from './payment/PaymentHistory';
import { TransactionApproval } from './payment/TransactionApproval';
import { AddEditCard } from './payment/AddEditCard';
import { IPaymentCard, ITransaction, ITransactionFilters, PaymentPermission } from '@/types/payment-types';
import { MainHeader } from './payment/MainHeader';
import { PendingApprovalsAlert } from './payment/PendingApprovalsAlert';
import { LoadingIndicator } from './payment/LoadingIndicator';
import { ErrorMessage } from './payment/ErrorMessage';
import { authService } from '@/services/auth/AuthService';

interface PaymentManagerProps {
  userId: string;
}

export const PaymentManager: React.FC<PaymentManagerProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('cards');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [transactionFilters, setTransactionFilters] = useState<ITransactionFilters>({});
  
  const { toast } = useToast();
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();
  
  const {
    cards,
    selectedCard,
    transactions,
    pendingApprovals,
    loading,
    error,
    userAccess,
    paymentStats,
    getCardDetails,
    addCard,
    updateCard,
    updateCardStatus,
    loadTransactions,
    loadPendingApprovals,
    approveTransaction,
    rejectTransaction,
  } = usePaymentData(userId);

  // Efeito para carregar detalhes do cartão quando selecionado
  useEffect(() => {
    if (selectedCardId && isAuthenticated) {
      getCardDetails(selectedCardId);
    }
  }, [selectedCardId, isAuthenticated, getCardDetails]);
  
  // Efeito para recarregar aprovações pendentes a cada minuto
  useEffect(() => {
    if (!isAuthenticated || !userAccess?.permissions.includes('approve_transactions' as PaymentPermission)) return;
    
    loadPendingApprovals();
    
    const intervalId = setInterval(() => {
      loadPendingApprovals();
    }, 60000); // 1 minuto
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated, userAccess, loadPendingApprovals]);
  
  // Handler para selecionar um cartão
  const handleSelectCard = (cardId: string) => {
    setSelectedCardId(cardId);
    setActiveTab('card-details');
  };
  
  // Handler para adicionar um novo cartão
  const handleAddCard = async (cardData: Partial<IPaymentCard>) => {
    const result = await addCard(cardData);
    
    if (result) {
      setIsAddingCard(false);
      toast({
        title: "Cartão adicionado",
        description: "O novo cartão foi adicionado com sucesso.",
        variant: "default",
      });
    }
  };
  
  // Handler para editar um cartão
  const handleEditCard = async (cardId: string, cardData: Partial<IPaymentCard>) => {
    const result = await updateCard(cardId, cardData);
    
    if (result) {
      setIsEditingCard(false);
      toast({
        title: "Cartão atualizado",
        description: "As informações do cartão foram atualizadas com sucesso.",
        variant: "default",
      });
    }
  };
  
  // Handler para filtrar transações
  const handleFilterTransactions = (filters: ITransactionFilters) => {
    setTransactionFilters(filters);
    loadTransactions(filters);
  };
  
  // Handler para sair do sistema de pagamentos
  const handleLogout = async () => {
    await authService.logout();
    
    toast({
      title: "Sessão encerrada",
      description: "Você saiu do sistema de gerenciamento de pagamentos.",
      variant: "default",
    });
  };
  
  // Renderizar o componente de adição de cartão
  const renderAddCardForm = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Adicionar Novo Cartão</h2>
        <Button 
          variant="outline" 
          onClick={() => setIsAddingCard(false)}
          className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Cancelar
        </Button>
      </div>
      <Separator className="my-4 bg-gray-200 dark:bg-gray-600" />
      <AddEditCard onSubmit={handleAddCard} />
    </div>
  );
  
  // Renderizar o componente de edição de cartão
  const renderEditCardForm = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Editar Cartão</h2>
        <Button 
          variant="outline" 
          onClick={() => setIsEditingCard(false)}
          className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Cancelar
        </Button>
      </div>
      <Separator className="my-4 bg-gray-200 dark:bg-gray-600" />
      {selectedCard && <AddEditCard cardData={selectedCard} onSubmit={(data) => handleEditCard(selectedCard.id, data)} />}
    </div>
  );
  
  // Renderizar a interface principal com abas
  const renderMainInterface = () => (
    <div className="space-y-6">
      <MainHeader 
        onAddCard={() => setIsAddingCard(true)}
        onLogout={handleLogout}
        canManageCards={userAccess?.permissions.includes('manage_cards' as PaymentPermission) || false}
      />
      
      {pendingApprovals?.length > 0 && userAccess?.permissions.includes('approve_transactions' as PaymentPermission) && (
        <PendingApprovalsAlert 
          pendingCount={pendingApprovals.length} 
          onViewApprovals={() => setActiveTab('approvals')}
        />
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsNavigation 
            activeTab={activeTab}
            selectedCard={selectedCard !== null}
            pendingApprovals={pendingApprovals}
            userAccess={userAccess}
          />
          
          <div className="p-6">
            <TabsContent value="cards" className="mt-0">
              <CardsList 
                cards={cards} 
                onSelectCard={handleSelectCard} 
                onUpdateStatus={updateCardStatus}
                userAccess={userAccess}
              />
            </TabsContent>
            
            <TabsContent value="card-details" className="mt-0">
              {selectedCard ? (
                <CardDetails 
                  card={selectedCard} 
                  onEdit={() => setIsEditingCard(true)}
                  onUpdateStatus={updateCardStatus}
                  userAccess={userAccess}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">Selecione um cartão para ver os detalhes</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="transactions" className="mt-0">
              <PaymentHistory 
                transactions={transactions}
                onFilter={handleFilterTransactions}
                cards={cards}
                filters={transactionFilters}
                userAccess={userAccess}
              />
            </TabsContent>
            
            <TabsContent value="approvals" className="mt-0">
              <TransactionApproval 
                approvals={pendingApprovals}
                onApprove={approveTransaction}
                onReject={rejectTransaction}
                userAccess={userAccess}
              />
            </TabsContent>
            
            <TabsContent value="reports" className="mt-0">
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Relatórios em desenvolvimento</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
  
  // Conteúdo principal do gerenciador de pagamentos
  const PaymentManagerContent = () => {
    // if (loading) {
    //   return <LoadingIndicator />;
    // }
    
    if (error) {
      return <ErrorMessage error={error} />;
    }
    
    if (isAddingCard) {
      return renderAddCardForm();
    }
    
    if (isEditingCard && selectedCard) {
      return renderEditCardForm();
    }
    
    return renderMainInterface();
  };
  
  // Renderização final com camada de segurança
  return (
    <div className="container py-6">
      <PaymentManagerContent />
    </div>
  );
};

// Componente para a navegação por abas
interface TabsNavigationProps {
  activeTab: string;
  selectedCard: boolean;
  pendingApprovals: any[] | null;
  userAccess: any | null;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ 
  activeTab, 
  selectedCard, 
  pendingApprovals, 
  userAccess 
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
      <TabsList className="p-0 bg-transparent h-auto">
        <TabsTrigger 
          value="cards" 
          className={`py-4 px-6 rounded-none border-b-2 ${
            activeTab === 'cards' 
              ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Cartões
        </TabsTrigger>
        
        {selectedCard && (
          <TabsTrigger 
            value="card-details" 
            className={`py-4 px-6 rounded-none border-b-2 ${
              activeTab === 'card-details' 
                ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Detalhes do Cartão
          </TabsTrigger>
        )}
        
        <TabsTrigger 
          value="transactions" 
          className={`py-4 px-6 rounded-none border-b-2 ${
            activeTab === 'transactions' 
              ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <Clock className="h-4 w-4 mr-2" />
          Histórico
        </TabsTrigger>
        
        {userAccess?.permissions.includes('approve_transactions' as PaymentPermission) && (
          <TabsTrigger 
            value="approvals" 
            className={`py-4 px-6 rounded-none border-b-2 ${
              activeTab === 'approvals' 
                ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Shield className="h-4 w-4 mr-2" />
            Aprovações
            {(pendingApprovals?.length ?? 0) > 0 && (
              <Badge className="ml-2 bg-red-600 text-white dark:bg-red-500">
                {pendingApprovals?.length ?? 0}
              </Badge>
            )}
          </TabsTrigger>
        )}
        
        {userAccess?.permissions.includes('view_reports' as PaymentPermission) && (
          <TabsTrigger 
            value="reports" 
            className={`py-4 px-6 rounded-none border-b-2 ${
              activeTab === 'reports' 
                ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Relatórios
          </TabsTrigger>
        )}
      </TabsList>
    </div>
  );
};