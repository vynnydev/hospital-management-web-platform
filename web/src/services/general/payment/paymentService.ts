import api from '@/services/api';
import { 
  IPaymentCard, 
  CardStatus, 
  ITransaction, 
  ITransactionFilters, 
  IApprovalRequest,
  IPaymentStats,
  IPaymentAccess,
  IPaginatedResponse,
  IAuditLog,
  IGeographicRestriction,
  ICardSecuritySettings
} from '@/types/payment-types';
import { ISecurityAlert } from '@/types/security-compliance-types';

// Função para gerar querystring a partir de filtros
const buildQueryFromFilters = (filters?: ITransactionFilters): string => {
  if (!filters) return '';
  
  const params = new URLSearchParams();
  
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.minAmount) params.append('minAmount', filters.minAmount.toString());
  if (filters.maxAmount) params.append('maxAmount', filters.maxAmount.toString());
  if (filters.status && filters.status.length) {
    filters.status.forEach(status => params.append('status', status));
  }
  if (filters.cardIds && filters.cardIds.length) {
    filters.cardIds.forEach(cardId => params.append('cardId', cardId));
  }
  if (filters.categories && filters.categories.length) {
    filters.categories.forEach(category => params.append('category', category));
  }
  if (filters.merchantSearch) params.append('merchantSearch', filters.merchantSearch);
  if (filters.departmentIds && filters.departmentIds.length) {
    filters.departmentIds.forEach(deptId => params.append('departmentId', deptId));
  }
  
  return params.toString();
};

// Serviços de pagamento
export const paymentService = {
  // Acesso de usuário
  getUserAccess: async (userId: string): Promise<IPaymentAccess> => {
    try {
      const response = await api.get(`/payment-access/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user access:', error);
      throw new Error('Não foi possível obter as permissões de acesso do usuário');
    }
  },
  
  // Cartões
  getAllCards: async (): Promise<IPaymentCard[]> => {
    try {
      const response = await api.get('/payment-cards');
      return response.data;
    } catch (error) {
      console.error('Error fetching all cards:', error);
      throw new Error('Não foi possível obter a lista de cartões');
    }
  },
  
  getCardsByDepartments: async (departmentIds: string[]): Promise<IPaymentCard[]> => {
    try {
      const deptQuery = departmentIds.map(id => `departmentId=${id}`).join('&');
      const response = await api.get(`/payment-cards?${deptQuery}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cards by departments:', error);
      throw new Error('Não foi possível obter os cartões dos departamentos');
    }
  },
  
  getCardsByIds: async (cardIds: string[]): Promise<IPaymentCard[]> => {
    try {
      const idsQuery = cardIds.map(id => `id=${id}`).join('&');
      const response = await api.get(`/payment-cards?${idsQuery}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cards by IDs:', error);
      throw new Error('Não foi possível obter os cartões especificados');
    }
  },
  
  getCardById: async (cardId: string): Promise<IPaymentCard> => {
    try {
      const response = await api.get(`/payment-cards/${cardId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching card ${cardId}:`, error);
      throw new Error('Não foi possível obter os detalhes do cartão');
    }
  },
  
  createCard: async (cardData: Partial<IPaymentCard>): Promise<IPaymentCard> => {
    try {
      const response = await api.post('/payment-cards', cardData);
      return response.data;
    } catch (error) {
      console.error('Error creating card:', error);
      throw new Error('Não foi possível criar o novo cartão');
    }
  },
  
  updateCard: async (cardId: string, cardData: Partial<IPaymentCard>): Promise<IPaymentCard> => {
    try {
      const response = await api.patch(`/payment-cards/${cardId}`, cardData);
      return response.data;
    } catch (error) {
      console.error(`Error updating card ${cardId}:`, error);
      throw new Error('Não foi possível atualizar o cartão');
    }
  },
  
  updateCardStatus: async (cardId: string, status: CardStatus): Promise<IPaymentCard> => {
    try {
      const response = await api.patch(`/payment-cards/${cardId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating card ${cardId} status:`, error);
      throw new Error('Não foi possível atualizar o status do cartão');
    }
  },
  
  // Transações
  getAllTransactions: async (filters?: ITransactionFilters): Promise<ITransaction[]> => {
    try {
      const queryString = buildQueryFromFilters(filters);
      const response = await api.get(`/transactions${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all transactions:', error);
      throw new Error('Não foi possível obter as transações');
    }
  },
  
  getTransactionsByDepartments: async (departmentIds: string[], filters?: ITransactionFilters): Promise<ITransaction[]> => {
    try {
      let queryString = departmentIds.map(id => `departmentId=${id}`).join('&');
      const filterQuery = buildQueryFromFilters(filters);
      if (filterQuery) {
        queryString = queryString ? `${queryString}&${filterQuery}` : filterQuery;
      }
      
      const response = await api.get(`/transactions?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions by departments:', error);
      throw new Error('Não foi possível obter as transações dos departamentos');
    }
  },
  
  getTransactionsByCards: async (cardIds: string[], filters?: ITransactionFilters): Promise<ITransaction[]> => {
    try {
      let queryString = cardIds.map(id => `cardId=${id}`).join('&');
      const filterQuery = buildQueryFromFilters(filters);
      if (filterQuery) {
        queryString = queryString ? `${queryString}&${filterQuery}` : filterQuery;
      }
      
      const response = await api.get(`/transactions?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions by cards:', error);
      throw new Error('Não foi possível obter as transações dos cartões');
    }
  },
  
  getTransactionById: async (transactionId: string): Promise<ITransaction> => {
    try {
      const response = await api.get(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction ${transactionId}:`, error);
      throw new Error('Não foi possível obter os detalhes da transação');
    }
  },
  
  // Aprovações
  getPendingApprovals: async (userId: string): Promise<IApprovalRequest[]> => {
    try {
      const response = await api.get(`/approval-requests?status=pending&approverId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      throw new Error('Não foi possível obter as aprovações pendentes');
    }
  },
  
  getApprovalById: async (approvalId: string): Promise<{
    id: string;
    transactionId: string;
    transaction: ITransaction;
    requestedAt: string;
    requestedBy: string;
    status: string;
    urgency: string;
    expiresAt: string;
  }> => {
    try {
      const response = await api.get(`/approval-requests/${approvalId}`);
      // Buscar detalhes da transação associada
      const transactionResponse = await api.get(`/transactions/${response.data.transactionId}`);
      
      return {
        ...response.data,
        transaction: transactionResponse.data
      };
    } catch (error) {
      console.error(`Error fetching approval ${approvalId}:`, error);
      throw new Error('Não foi possível obter os detalhes da solicitação de aprovação');
    }
  },
  
  approveTransaction: async (approvalId: string, approverId: string, notes?: string): Promise<boolean> => {
    try {
      await api.post(`/approval-requests/${approvalId}/approve`, {
        approverId,
        notes
      });
      return true;
    } catch (error) {
      console.error(`Error approving transaction ${approvalId}:`, error);
      throw new Error('Não foi possível aprovar a transação');
    }
  },
  
  rejectTransaction: async (approvalId: string, rejectedBy: string, reason: string): Promise<boolean> => {
    try {
      await api.post(`/approval-requests/${approvalId}/reject`, {
        rejectedBy,
        reason
      });
      return true;
    } catch (error) {
      console.error(`Error rejecting transaction ${approvalId}:`, error);
      throw new Error('Não foi possível rejeitar a transação');
    }
  },
  
  // Estatísticas
  getPaymentStats: async (): Promise<IPaymentStats> => {
    try {
      const response = await api.get('/payment-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw new Error('Não foi possível obter as estatísticas de pagamento');
    }
  },
  
  // Logs de auditoria
  getAuditLogs: async (page = 1, perPage = 20): Promise<IPaginatedResponse<IAuditLog>> => {
    try {
      const response = await api.get(`/audit-logs?page=${page}&perPage=${perPage}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw new Error('Não foi possível obter os logs de auditoria');
    }
  },
  
  // Exportação
  exportTransactions: async (format: 'csv' | 'excel' | 'pdf', filters?: ITransactionFilters): Promise<string> => {
    try {
      const queryString = buildQueryFromFilters(filters);
      const response = await api.get(`/transactions/export/${format}${queryString ? `?${queryString}` : ''}`);
      return response.data.downloadUrl;
    } catch (error) {
      console.error(`Error exporting transactions to ${format}:`, error);
      throw new Error(`Não foi possível exportar as transações para ${format.toUpperCase()}`);
    }
  },

    // Buscar transações com paginação e filtros
    getTransactions: async (
        page = 1, 
        perPage = 20, 
        filters?: ITransactionFilters
      ): Promise<{
        transactions: ITransaction[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
      }> => {
        try {
          // Construir query string com filtros
          const queryParams = new URLSearchParams();
          queryParams.append('page', page.toString());
          queryParams.append('perPage', perPage.toString());
    
          // Adicionar filtros se existirem
          if (filters) {
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);
            if (filters.minAmount) queryParams.append('minAmount', filters.minAmount.toString());
            if (filters.maxAmount) queryParams.append('maxAmount', filters.maxAmount.toString());
            if (filters.status) filters.status.forEach(status => queryParams.append('status', status));
            if (filters.cardIds) filters.cardIds.forEach(cardId => queryParams.append('cardId', cardId));
            if (filters.merchantSearch) queryParams.append('merchantSearch', filters.merchantSearch);
          }
    
          const response = await api.get(`/transactions?${queryParams.toString()}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching transactions:', error);
          throw new Error('Não foi possível obter as transações');
        }
      },
    
      // Obter recibo de uma transação específica
      getTransactionReceipt: async (transactionId: string): Promise<string> => {
        try {
          const response = await api.get(`/transactions/${transactionId}/receipt`);
          return response.data.receiptUrl;
        } catch (error) {
          console.error(`Error fetching receipt for transaction ${transactionId}:`, error);
          throw new Error('Não foi possível obter o recibo da transação');
        }
      },
    
      // Obter transações agrupadas por categoria
      getTransactionsByCategory: async (filters?: ITransactionFilters): Promise<{
        category: string;
        total: number;
        amount: number;
      }[]> => {
        try {
          const queryParams = new URLSearchParams();
          
          // Adicionar filtros se existirem
          if (filters) {
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);
            if (filters.cardIds) filters.cardIds.forEach(cardId => queryParams.append('cardId', cardId));
          }
    
          const response = await api.get(`/transactions/by-category?${queryParams.toString()}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching transactions by category:', error);
          throw new Error('Não foi possível obter as transações por categoria');
        }
      },
    
      // Obter transações agrupadas por mês
      getTransactionsByMonth: async (year: number, p0: string[] | undefined, filters?: ITransactionFilters): Promise<{
        month: string;
        total: number;
        amount: number;
      }[]> => {
        try {
          const queryParams = new URLSearchParams();
          
          // Adicionar filtros se existirem
          if (filters) {
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);
            if (filters.cardIds) filters.cardIds.forEach(cardId => queryParams.append('cardId', cardId));
          }
    
          const response = await api.get(`/transactions/by-month?${queryParams.toString()}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching transactions by month:', error);
          throw new Error('Não foi possível obter as transações por mês');
        }
      },
    
      // Contestar uma transação
      disputeTransaction: async (
transactionId: string, reason: string, details: string ): Promise<boolean> => {
        try {
          await api.post(`/transactions/${transactionId}/dispute`, {
            reason,
            details
          });
          return true;
        } catch (error) {
          console.error(`Error disputing transaction ${transactionId}:`, error);
          throw new Error('Não foi possível contestar a transação');
        }
      },
    
      // Adicionar restrição geográfica a um cartão
      addCardGeographicRestriction: async (
        cardId: string, 
        restriction: IGeographicRestriction
      ): Promise<ICardSecuritySettings> => {
        try {
          const response = await api.post(`/payment-cards/${cardId}/geographic-restrictions`, restriction);
          return response.data;
        } catch (error) {
          console.error(`Error adding geographic restriction to card ${cardId}:`, error);
          throw new Error('Não foi possível adicionar a restrição geográfica');
        }
      },
    
      // Obter configurações de segurança de um cartão
      getCardSecuritySettings: async (cardId: string): Promise<ICardSecuritySettings> => {
        try {
          const response = await api.get(`/payment-cards/${cardId}/security-settings`);
          return response.data;
        } catch (error) {
          console.error(`Error fetching security settings for card ${cardId}:`, error);
          throw new Error('Não foi possível obter as configurações de segurança do cartão');
        }
      },
    
      // Atualizar configurações de segurança de um cartão
      updateCardSecuritySettings: async (
        cardId: string, 
        settings: Partial<ICardSecuritySettings>
      ): Promise<ICardSecuritySettings> => {
        try {
          const response = await api.patch(`/payment-cards/${cardId}/security-settings`, settings);
          return response.data;
        } catch (error) {
          console.error(`Error updating security settings for card ${cardId}:`, error);
          throw new Error('Não foi possível atualizar as configurações de segurança do cartão');
        }
      },
    
      // Remover restrição geográfica de um cartão
      removeCardGeographicRestriction: async (
        cardId: string, 
        index: number
      ): Promise<ICardSecuritySettings> => {
        try {
          const response = await api.delete(`/payment-cards/${cardId}/geographic-restrictions/${index}`);
          return response.data;
        } catch (error) {
          console.error(`Error removing geographic restriction from card ${cardId}:`, error);
          throw new Error('Não foi possível remover a restrição geográfica');
        }
      },
    
      // Obter alertas de segurança de um cartão
      getCardSecurityAlerts: async (cardId: string): Promise<ISecurityAlert[]> => {
        try {
          const response = await api.get(`/payment-cards/${cardId}/security-alerts`);
          return response.data;
        } catch (error) {
          console.error(`Error fetching security alerts for card ${cardId}:`, error);
          throw new Error('Não foi possível obter os alertas de segurança do cartão');
        }
      },
    
      // Regenerar PIN de um cartão
      regenerateCardPin: async (cardId: string): Promise<void> => {
        try {
          await api.post(`/payment-cards/${cardId}/regenerate-pin`);
        } catch (error) {
          console.error(`Error regenerating PIN for card ${cardId}:`, error);
          throw new Error('Não foi possível regenerar o PIN do cartão');
        }
      }
};