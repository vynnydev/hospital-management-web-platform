/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Button } from '@/components/ui/organisms/button';
import { Badge } from '@/components/ui/organisms/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/organisms/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/organisms/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/organisms/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/organisms/select';
import { 
  Eye, 
  Download, 
  MoreVertical, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  RefreshCw,
  FileText,
  ShieldAlert
} from 'lucide-react';
import { 
  ITransaction, 
  TransactionStatus, 
  ExpenseCategory,
  IPaymentAccess,
  PaymentPermission
} from '@/types/payment-types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TransactionTableProps {
  transactions: ITransaction[];
  loading: boolean;
  onViewDetails: (transactionId: string) => void;
  onGetReceipt: (transactionId: string) => void;
  onDisputeTransaction: (transaction: ITransaction) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  userAccess: IPaymentAccess | null;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  loading,
  onViewDetails,
  onGetReceipt,
  onDisputeTransaction,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  userAccess
}) => {
  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };
  
  // Função para formatar a categoria
  const formatCategory = (category: ExpenseCategory) => {
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
  
  // Função para obter a cor do badge de status
  const getStatusBadgeClass = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'declined':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'under_review':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'requires_approval':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'disputed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'canceled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  // Função para obter o ícone do status
  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'declined':
        return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'refunded':
        return <RefreshCw className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case 'under_review':
        return <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case 'requires_approval':
        return <ShieldAlert className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
      case 'disputed':
        return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'canceled':
        return <AlertTriangle className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };
  
  // Função para formatar o nome do status
  const formatStatus = (status: TransactionStatus) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'completed': return 'Concluída';
      case 'declined': return 'Recusada';
      case 'refunded': return 'Reembolsada';
      case 'under_review': return 'Em Análise';
      case 'requires_approval': return 'Aguardando Aprovação';
      case 'disputed': return 'Contestada';
      case 'canceled': return 'Cancelada';
      default: return status;
    }
  };
  
  // Verificar se o usuário pode disputar transações
  const canDisputeTransactions = userAccess?.permissions.includes('view_transactions' as PaymentPermission) || false;
  
  // Páginas a serem mostradas na paginação
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Mostrar todas as páginas se forem menos que o máximo visível
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas ao redor da página atual
      const leftBound = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const rightBound = Math.min(totalPages, leftBound + maxVisiblePages - 1);
      
      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }
      
      // Adicionar indicadores de "mais páginas" se necessário
      if (leftBound > 1) {
        pages.unshift(-1); // -1 indica "..."
        pages.unshift(1);
      }
      
      if (rightBound < totalPages) {
        pages.push(-2); // -2 indica "..."
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800/80">
              <TableRow className="border-gray-200 dark:border-gray-700">
                <TableHead className="text-gray-700 dark:text-gray-300">ID</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Data</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Valor</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Estabelecimento</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Categoria</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <RefreshCw className="h-6 w-6 mx-auto mb-2 animate-spin" />
                    <p>Carregando transações...</p>
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="h-6 w-6 mx-auto mb-2" />
                    <p>Nenhuma transação encontrada</p>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow 
                    key={transaction.id} 
                    className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <TableCell className="text-gray-800 dark:text-gray-200 font-mono">
                      {transaction.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200">
                      {formatDate(transaction.timestamp)}
                    </TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200 font-medium">
                      R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200">
                      {transaction.merchant}
                    </TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200">
                      {formatCategory(transaction.category)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`flex items-center ${getStatusBadgeClass(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1">{formatStatus(transaction.status)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewDetails(transaction.id)}
                          className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {transaction.receiptUrl && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onGetReceipt(transaction.id)}
                            className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                            <DropdownMenuLabel className="text-gray-800 dark:text-gray-200">
                              Ações
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
                            <DropdownMenuItem
                              onClick={() => onViewDetails(transaction.id)}
                              className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            
                            {transaction.receiptUrl && (
                              <DropdownMenuItem
                                onClick={() => onGetReceipt(transaction.id)}
                                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Baixar Recibo
                              </DropdownMenuItem>
                            )}
                            
                            {canDisputeTransactions && transaction.status === 'completed' && (
                              <DropdownMenuItem
                                onClick={() => onDisputeTransaction(transaction)}
                                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Contestar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Itens por página:
          </p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
          >
            <SelectTrigger className="h-8 w-20 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <SelectValue className="text-gray-800 dark:text-gray-200" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <SelectItem value="5" className="text-gray-800 dark:text-gray-200">5</SelectItem>
              <SelectItem value="10" className="text-gray-800 dark:text-gray-200">10</SelectItem>
              <SelectItem value="20" className="text-gray-800 dark:text-gray-200">20</SelectItem>
              <SelectItem value="50" className="text-gray-800 dark:text-gray-200">50</SelectItem>
              <SelectItem value="100" className="text-gray-800 dark:text-gray-200">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''} bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200`}
              />
            </PaginationItem>
            
            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === -1 || page === -2 ? (
                  <span className="h-10 w-10 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    ...
                  </span>
                ) : (
                  <Button
                    onClick={() => onPageChange(page)}
                    className={`h-10 w-10 p-0 ${
                      page === currentPage
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {page}
                  </Button>
                )}
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};