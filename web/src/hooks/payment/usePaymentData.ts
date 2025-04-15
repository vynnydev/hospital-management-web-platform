/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { 
  IPaymentCard, 
  ITransaction, 
  IApprovalRequest, 
  IAuditLog, 
  IPaymentStats,
  IPaymentAccess,
  ITransactionFilters,
  CardStatus,
  IPaginatedResponse,
  PaymentPermission
} from '@/types/payment-types';
import { paymentService } from '@/services/general/payment/paymentService';
import { securityService } from '@/services/general/payment/security/securityService';
import { useToast } from '@/components/ui/hooks/use-toast';
import { authService } from '@/services/general/auth/AuthService';

export const usePaymentData = (userId: string) => {
  const [cards, setCards] = useState<IPaymentCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<IPaymentCard | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<IApprovalRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<IAuditLog[]>([]);
  const [paymentStats, setPaymentStats] = useState<IPaymentStats | null>(null);
  const [userAccess, setUserAccess] = useState<IPaymentAccess | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  
  const { toast } = useToast();

  // Carregar acesso do usuário
  const loadUserAccess = useCallback(async () => {
    try {
      const access = await paymentService.getUserAccess(userId);
      setUserAccess(access);
      return access;
    } catch (err) {
      console.error('Erro ao carregar acesso do usuário:', err);
      setError('Não foi possível carregar as permissões de acesso');
      return null;
    }
  }, [userId]);

  // Carregar cartões
  const loadCards = useCallback(async () => {
    if (!userAccess) return;
    
    try {
      setLoading(true);
      let cards: IPaymentCard[];
      
      switch (userAccess.cardVisibility) {
        case 'all':
          cards = await paymentService.getAllCards();
          break;
        case 'department':
          if (!userAccess.allowedDepartmentIds?.length) {
            cards = [];
          } else {
            cards = await paymentService.getCardsByDepartments(userAccess.allowedDepartmentIds);
          }
          break;
        case 'assigned':
          if (!userAccess.allowedCardIds?.length) {
            cards = [];
          } else {
            cards = await paymentService.getCardsByIds(userAccess.allowedCardIds);
          }
          break;
        default:
          cards = [];
      }
      
      setCards(cards);
    } catch (err) {
      console.error('Erro ao carregar cartões:', err);
      setError('Não foi possível carregar os cartões');
      toast({
        title: "Erro",
        description: "Falha ao carregar os cartões. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [userAccess, toast]);

  // Carregar transações
  const loadTransactions = useCallback(async (filters?: ITransactionFilters) => {
    if (!userAccess) return;
    
    try {
      setLoading(true);
      let transactions: ITransaction[];
      
      switch (userAccess.transactionVisibility) {
        case 'all':
          transactions = await paymentService.getAllTransactions(filters);
          break;
        case 'department':
          if (!userAccess.allowedDepartmentIds?.length) {
            transactions = [];
          } else {
            transactions = await paymentService.getTransactionsByDepartments(
              userAccess.allowedDepartmentIds,
              filters
            );
          }
          break;
        case 'own':
          if (!userAccess.allowedCardIds?.length) {
            transactions = [];
          } else {
            transactions = await paymentService.getTransactionsByCards(
              userAccess.allowedCardIds,
              filters
            );
          }
          break;
        default:
          transactions = [];
      }
      
      setTransactions(transactions);
    } catch (err) {
      console.error('Erro ao carregar transações:', err);
      setError('Não foi possível carregar as transações');
      toast({
        title: "Erro",
        description: "Falha ao carregar as transações. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [userAccess, toast]);

  // Carregar aprovações pendentes
  const loadPendingApprovals = useCallback(async () => {
    if (!userAccess || !userAccess.permissions.includes('approve_transactions' as PaymentPermission)) return;
    
    try {
      const approvals = await paymentService.getPendingApprovals(userId);
      setPendingApprovals(approvals);
    } catch (err) {
      console.error('Erro ao carregar aprovações pendentes:', err);
      toast({
        title: "Aviso",
        description: "Não foi possível carregar as aprovações pendentes.",
        variant: "default",
      });
    }
  }, [userAccess, userId, toast]);

  // Carregar estatísticas
  const loadPaymentStats = useCallback(async () => {
    if (!userAccess || !userAccess.permissions.includes('view_reports' as PaymentPermission)) return;
    
    try {
      const stats = await paymentService.getPaymentStats();
      setPaymentStats(stats);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  }, [userAccess]);

  // Carregar logs de auditoria
  const loadAuditLogs = useCallback(async (page = 1, perPage = 20) => {
    if (!userAccess || !userAccess.permissions.includes('view_reports' as PaymentPermission)) return;
    
    try {
      const response = await paymentService.getAuditLogs(page, perPage);
      setAuditLogs(response.data);
      return response;
    } catch (err) {
      console.error('Erro ao carregar logs de auditoria:', err);
      return null;
    }
  }, [userAccess]);

  // Obter detalhes de um cartão específico
  const getCardDetails = useCallback(async (cardId: string) => {
    try {
      const card = await paymentService.getCardById(cardId);
      setSelectedCard(card);
      return card;
    } catch (err) {
      console.error('Erro ao carregar detalhes do cartão:', err);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do cartão.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Adicionar um novo cartão
  const addCard = useCallback(async (cardData: Partial<IPaymentCard>) => {
    if (!userAccess || !userAccess.permissions.includes('manage_cards' as PaymentPermission)) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para adicionar cartões.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      const newCard = await paymentService.createCard(cardData);
      setCards(prev => [...prev, newCard]);
      
      // Registra a ação para auditoria
      await securityService.logAction({
        userId,
        action: 'create',
        resource: 'Cartão de Pagamento',
        resourceId: newCard.id,
        resourceType: 'card',
        details: `Novo cartão criado: ${newCard.cardHolderName}`
      });
      
      toast({
        title: "Sucesso",
        description: "Cartão adicionado com sucesso.",
        variant: "default",
      });
      
      return newCard;
    } catch (err) {
      console.error('Erro ao adicionar cartão:', err);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o cartão.",
        variant: "destructive",
      });
      return null;
    }
  }, [userAccess, userId, toast]);

  // Atualizar um cartão existente
  const updateCard = useCallback(async (cardId: string, cardData: Partial<IPaymentCard>) => {
    if (!userAccess || !userAccess.permissions.includes('manage_cards' as PaymentPermission)) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para atualizar cartões.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      const oldCard = await paymentService.getCardById(cardId);
      const updatedCard = await paymentService.updateCard(cardId, cardData);
      
      setCards(prev => prev.map(card => 
        card.id === cardId ? updatedCard : card
      ));
      
      if (selectedCard?.id === cardId) {
        setSelectedCard(updatedCard);
      }
      
      // Registra a ação para auditoria
      await securityService.logAction({
        userId,
        action: 'update',
        resource: 'Cartão de Pagamento',
        resourceId: cardId,
        resourceType: 'card',
        details: `Cartão atualizado: ${updatedCard.cardHolderName}`,
        before: JSON.stringify(oldCard),
        after: JSON.stringify(updatedCard)
      });
      
      toast({
        title: "Sucesso",
        description: "Cartão atualizado com sucesso.",
        variant: "default",
      });
      
      return updatedCard;
    } catch (err) {
      console.error('Erro ao atualizar cartão:', err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cartão.",
        variant: "destructive",
      });
      return null;
    }
  }, [userAccess, userId, selectedCard, toast]);

  // Alterar o status de um cartão
  const updateCardStatus = useCallback(async (cardId: string, status: CardStatus) => {
    if (!userAccess || !userAccess.permissions.includes('manage_cards' as PaymentPermission)) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para alterar o status de cartões.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const oldCard = await paymentService.getCardById(cardId);
      const updatedCard = await paymentService.updateCardStatus(cardId, status);
      
      setCards(prev => prev.map(card => 
        card.id === cardId ? { ...card, status } : card
      ));
      
      if (selectedCard?.id === cardId) {
        setSelectedCard({ ...selectedCard, status });
      }
      
      // Registra a ação para auditoria
      await securityService.logAction({
        userId,
        action: 'update',
        resource: 'Status do Cartão',
        resourceId: cardId,
        resourceType: 'card',
        details: `Status do cartão alterado para: ${status}`,
        before: JSON.stringify({ status: oldCard.status }),
        after: JSON.stringify({ status })
      });
      
      toast({
        title: "Sucesso",
        description: `Status do cartão atualizado para ${status}.`,
        variant: "default",
      });
      
      return true;
    } catch (err) {
      console.error('Erro ao atualizar status do cartão:', err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do cartão.",
        variant: "destructive",
      });
      return false;
    }
  }, [userAccess, userId, selectedCard, toast]);

  // Aprovar uma transação
  const approveTransaction = useCallback(async (approvalId: string, notes?: string) => {
    if (!userAccess || !userAccess.permissions.includes('approve_transactions' as PaymentPermission)) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para aprovar transações.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const approval = await paymentService.getApprovalById(approvalId);
      
      // Verifica se o usuário pode aprovar este valor
      if (userAccess.approvalThreshold && approval.transaction.amount > userAccess.approvalThreshold) {
        toast({
          title: "Acesso negado",
          description: `Você não tem permissão para aprovar transações acima de R$ ${userAccess.approvalThreshold.toLocaleString('pt-BR')}.`,
          variant: "destructive",
        });
        return false;
      }
      
      const success = await paymentService.approveTransaction(approvalId, userId, notes);
      
      if (success) {
        // Atualiza a lista de aprovações pendentes
        setPendingApprovals(prev => prev.filter(a => a.id !== approvalId));
        
        // Atualiza a lista de transações se necessário
        loadTransactions();
        
        // Registra a ação para auditoria
        await securityService.logAction({
          userId,
          action: 'approve',
          resource: 'Transação',
          resourceId: approval.transactionId,
          resourceType: 'approval',
          details: `Transação aprovada: ${approval.transaction.description} (R$ ${approval.transaction.amount.toLocaleString('pt-BR')})`
        });
        
        toast({
          title: "Sucesso",
          description: "Transação aprovada com sucesso.",
          variant: "default",
        });
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao aprovar transação:', err);
      toast({
        title: "Erro",
        description: "Não foi possível aprovar a transação.",
        variant: "destructive",
      });
      return false;
    }
  }, [userAccess, userId, loadTransactions, toast]);

  // Rejeitar uma transação
  const rejectTransaction = useCallback(async (approvalId: string, reason: string) => {
    if (!userAccess || !userAccess.permissions.includes('approve_transactions' as PaymentPermission)) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para rejeitar transações.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const approval = await paymentService.getApprovalById(approvalId);
      const success = await paymentService.rejectTransaction(approvalId, userId, reason);
      
      if (success) {
        // Atualiza a lista de aprovações pendentes
        setPendingApprovals(prev => prev.filter(a => a.id !== approvalId));
        
        // Atualiza a lista de transações se necessário
        loadTransactions();
        
        // Registra a ação para auditoria
        await securityService.logAction({
          userId,
          action: 'reject',
          resource: 'Transação',
          resourceId: approval.transactionId,
          resourceType: 'approval',
          details: `Transação rejeitada: ${approval.transaction.description} (R$ ${approval.transaction.amount.toLocaleString('pt-BR')})`
        });
        
        toast({
          title: "Aviso",
          description: "Transação rejeitada.",
          variant: "default",
        });
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao rejeitar transação:', err);
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar a transação.",
        variant: "destructive",
      });
      return false;
    }
  }, [userAccess, userId, loadTransactions, toast]);

  // Exportar dados de transações
  const exportTransactions = useCallback(async (format: 'csv' | 'excel' | 'pdf', filters?: ITransactionFilters) => {
    if (!userAccess || !userAccess.permissions.includes('export_data' as PaymentPermission)) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para exportar dados.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      const exportUrl = await paymentService.exportTransactions(format, filters);
      
      // Registra a ação para auditoria
      await securityService.logAction({
        userId,
        action: 'export',
        resource: 'Transações',
        resourceId: 'transactions',
        resourceType: 'transaction',
        details: `Exportação de transações em formato ${format.toUpperCase()}`
      });
      
      toast({
        title: "Sucesso",
        description: `Dados exportados com sucesso em formato ${format.toUpperCase()}.`,
        variant: "default",
      });
      
      return exportUrl;
    } catch (err) {
      console.error('Erro ao exportar transações:', err);
      toast({
        title: "Erro",
        description: "Não foi possível exportar os dados.",
        variant: "destructive",
      });
      return null;
    }
  }, [userAccess, userId, toast]);

  // Efeito para verificar a sessão a cada 5 minutos
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(async () => {
      const sessionValid = await securityService.checkPaymentSession(userId);
      if (!sessionValid) {
        toast({
          title: "Sessão expirada",
          description: "Sua sessão expirou. Por favor, autentique-se novamente.",
          variant: "destructive",
        });
        setIsAuthenticated(false);
        setError('Sessão expirada');
      }
    }, 5 * 60 * 1000); // 5 minutos
    
    return () => clearInterval(interval);
  }, [isAuthenticated, userId, toast]);

  return {
    cards,
    selectedCard,
    transactions,
    pendingApprovals,
    auditLogs,
    paymentStats,
    userAccess,
    loading,
    error,
    getCardDetails,
    addCard,
    updateCard,
    updateCardStatus,
    loadTransactions,
    loadPendingApprovals,
    loadAuditLogs,
    approveTransaction,
    rejectTransaction,
    exportTransactions
  };
};