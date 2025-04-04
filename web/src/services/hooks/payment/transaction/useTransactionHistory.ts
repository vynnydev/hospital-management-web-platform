/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect } from 'react';
import {
  ITransaction,
  ITransactionFilters,
  TransactionStatus,
  ExpenseCategory,
  IPaginatedResponse
} from '@/types/payment-types';
import { paymentService } from '@/services/general/payment/paymentService';
import { useToast } from '@/components/ui/hooks/use-toast';

interface UseTransactionHistoryProps {
  userId: string;
  cardId?: string; // opcional, para filtrar por cartão específico
  departmentId?: string; // opcional, para filtrar por departamento específico
  initialFilters?: ITransactionFilters;
}

export const useTransactionHistory = ({
  userId,
  cardId,
  departmentId,
  initialFilters = {}
}: UseTransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ITransactionFilters>(initialFilters);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const { toast } = useToast();

  // Função para carregar transações
  const loadTransactions = useCallback(async (
    page = currentPage,
    perPage = itemsPerPage,
    newFilters?: ITransactionFilters
  ) => {
    try {
      setLoading(true);
      
      // Mesclar filtros atuais com novos filtros se fornecidos
      const currentFilters = newFilters ? { ...filters, ...newFilters } : filters;
      
      // Adicionar filtro de cartão ou departamento se especificado
      if (cardId) {
        currentFilters.cardIds = [cardId];
      }
      
      if (departmentId) {
        currentFilters.departmentIds = [departmentId];
      }
      
      // Carregar transações da API
      const response: IPaginatedResponse<ITransaction> = await paymentService.getTransactions(
        page,
        perPage,
        currentFilters
      );
      
      setTransactions(response.data);
      setTotalTransactions(response.totalItems);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
      setItemsPerPage(response.perPage);
      
      // Atualizar filtros ativos
      if (newFilters) {
        setFilters(currentFilters);
      }
      
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar transações:', err);
      setError('Não foi possível carregar o histórico de transações');
      toast({
        title: "Erro",
        description: "Falha ao carregar histórico de transações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [cardId, departmentId, filters, currentPage, itemsPerPage, toast]);

  // Função para aplicar filtros
  const applyFilters = useCallback((newFilters: ITransactionFilters) => {
    // Resetar para a primeira página ao aplicar novos filtros
    loadTransactions(1, itemsPerPage, newFilters);
  }, [loadTransactions, itemsPerPage]);

  // Função para limpar filtros
  const clearFilters = useCallback(() => {
    const baseFilters: ITransactionFilters = {};
    
    // Manter filtros de cartão e departamento se necessário
    if (cardId) {
      baseFilters.cardIds = [cardId];
    }
    
    if (departmentId) {
      baseFilters.departmentIds = [departmentId];
    }
    
    setFilters(baseFilters);
    loadTransactions(1, itemsPerPage, baseFilters);
  }, [cardId, departmentId, loadTransactions, itemsPerPage]);

  // Mudar página
  const changePage = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return;
    loadTransactions(page, itemsPerPage);
  }, [loadTransactions, totalPages, itemsPerPage]);

  // Mudar itens por página
  const changeItemsPerPage = useCallback((perPage: number) => {
    loadTransactions(1, perPage); // Volta para a primeira página ao mudar itens por página
  }, [loadTransactions]);

  // Obter detalhes de uma transação específica
  const getTransactionDetails = useCallback(async (transactionId: string) => {
    try {
      setLoading(true);
      const transaction = await paymentService.getTransactionById(transactionId);
      return transaction;
    } catch (err) {
      console.error('Erro ao carregar detalhes da transação:', err);
      toast({
        title: "Erro",
        description: "Falha ao carregar detalhes da transação.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Obter recibo de uma transação
  const getTransactionReceipt = useCallback(async (transactionId: string) => {
    try {
      const receiptUrl = await paymentService.getTransactionReceipt(transactionId);
      return receiptUrl;
    } catch (err) {
      console.error('Erro ao carregar recibo da transação:', err);
      toast({
        title: "Erro",
        description: "Falha ao carregar recibo da transação.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Exportar transações
  const exportTransactions = useCallback(async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      setLoading(true);
      const exportUrl = await paymentService.exportTransactions(format, filters);
      
      toast({
        title: "Exportação concluída",
        description: `Os dados foram exportados com sucesso no formato ${format.toUpperCase()}.`,
        variant: "default",
      });
      
      return exportUrl;
    } catch (err) {
      console.error('Erro ao exportar transações:', err);
      toast({
        title: "Erro",
        description: "Falha ao exportar os dados das transações.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  // Obter resumo de transações por categoria
  const getTransactionsByCategoryChart = useCallback(async (
    startDate?: Date,
    endDate?: Date,
    specificCardIds?: string[]
  ) => {
    try {
      // Criar filtros específicos para o gráfico
      const chartFilters: ITransactionFilters = {
        ...filters,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        cardIds: specificCardIds || filters.cardIds
      };
      
      const chartData = await paymentService.getTransactionsByCategory(chartFilters);
      return chartData;
    } catch (err) {
      console.error('Erro ao obter dados do gráfico por categoria:', err);
      return null;
    }
  }, [filters]);

  // Obter resumo de transações por mês
  const getTransactionsByMonthChart = useCallback(async (
    year: number,
    specificCardIds?: string[]
  ) => {
    try {
      const chartData = await paymentService.getTransactionsByMonth(
        year,
        specificCardIds || filters.cardIds
      );
      return chartData;
    } catch (err) {
      console.error('Erro ao obter dados do gráfico por mês:', err);
      return null;
    }
  }, [filters]);

  // Contestar uma transação
  const disputeTransaction = useCallback(async (
    transactionId: string,
    reason: string,
    details: string
  ) => {
    try {
      setLoading(true);
      
      const success = await paymentService.disputeTransaction(
        transactionId,
        userId,
        reason,
        details
      );
      
      if (success) {
        // Atualizar a lista de transações
        await loadTransactions();
        
        toast({
          title: "Transação contestada",
          description: "Sua contestação foi registrada e será analisada pela equipe financeira.",
          variant: "default",
        });
        
        return true;
      } else {
        throw new Error('Falha ao contestar transação');
      }
    } catch (err) {
      console.error('Erro ao contestar transação:', err);
      toast({
        title: "Erro",
        description: "Não foi possível registrar a contestação. Tente novamente mais tarde.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, loadTransactions, toast]);

  // Efeito para carregar transações na montagem do componente ou quando as dependências mudarem
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
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
    disputeTransaction
  };
};