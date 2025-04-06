/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Button } from '@/components/ui/organisms/button';
import { Badge } from '@/components/ui/organisms/badge';
import { Separator } from '@/components/ui/organisms/Separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/organisms/card';
import { 
  CreditCard, 
  Clock, 
  Store, 
  Receipt, 
  CreditCard as CreditCardIcon, 
  Building,
  Tag,
  MapPin,
  User,
  ShoppingBag,
  Download,
  FileText,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowDown
} from 'lucide-react';
import { 
  ITransaction, 
  TransactionStatus, 
  IPaymentCard,
  ExpenseCategory,
  PaymentMethod,
  IPaymentAccess
} from '@/types/payment-types';

export interface TransactionDetailProps {
  transaction: ITransaction | null;
  onBack: () => void;
  onGetReceipt: (transactionId: string) => Promise<void>;
  onDisputeTransaction: (initialTransactions: ITransaction) => void;
  getTransactionDetails: (transactionId: string) => Promise<ITransaction | null>;
  userAccess: IPaymentAccess | null;
  cards: IPaymentCard[];
  isOpen: boolean;
  onClose: () => void;
  onDownloadReceipt: () => Promise<void>;
  onAddNote: () => void;
  onAddTag: () => void;
  onDispute: () => void;
  onFlagAsSuspicious: () => void;
  onCheckSecurityAlerts: () => Promise<void>;
  onBlockCard?: () => void;
  canManageSecurity: boolean;
  formatDate: (dateString: string) => string;
  formatTime?: (dateString: string) => string;
}

export const TransactionDetails: React.FC<TransactionDetailProps> = ({ 
  transaction, 
  cards
}) => {
  // Função para obter a classe de cor do badge de status
  const getStatusBadgeClass = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'declined':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'refunded':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'under_review':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'requires_approval':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'disputed':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'canceled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  // Função para obter o ícone de status
  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'refunded':
        return <ArrowDown className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case 'under_review':
        return <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case 'requires_approval':
        return <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
      case 'disputed':
        return <AlertTriangle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
      case 'canceled':
        return <XCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };
  
  // Função para obter o nome legível do status
  const getStatusLabel = (status: TransactionStatus) => {
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
  
  // Função para formatar o método de pagamento
  const formatPaymentMethod = (method: PaymentMethod) => {
    switch (method) {
      case 'card_present': return 'Cartão Presente';
      case 'card_not_present': return 'Cartão Não Presente';
      case 'online': return 'Online';
      case 'mobile': return 'Mobile';
      case 'contactless': return 'Sem Contato';
      case 'recurring': return 'Recorrente';
      default: return method;
    }
  };
  
  // Função para formatar a categoria de despesa
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
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center text-gray-800 dark:text-gray-200">
                  <Store className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  {transaction ? transaction.merchant : ''} 
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  {transaction ? transaction.merchantCategory  : ''}
                </CardDescription>
              </div>
              {transaction && (
                <Badge className={`inline-flex items-center ${getStatusBadgeClass(transaction.status)}`}>
                  <Badge className={`inline-flex items-center ${getStatusBadgeClass(transaction.status)}`}>
                    {getStatusIcon(transaction.status)}
                    <span className="ml-1">{getStatusLabel(transaction.status)}</span>
                  </Badge>
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Detalhes da Transação</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Descrição</p>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {transaction && transaction.description || 'Sem descrição'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Número de Referência</p>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {transaction && transaction.referenceNumber}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data e Hora</p>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {transaction?.timestamp ? new Date(transaction.timestamp).toLocaleString('pt-BR') : 'Data não disponível'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Método de Pagamento</p>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {transaction ? formatPaymentMethod(transaction.paymentMethod) : 'Método de pagamento não disponível'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Categoria</p>
                  <Badge variant="outline" className="mt-1 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                    <ShoppingBag className="h-3.5 w-3.5 mr-1 text-blue-600 dark:text-blue-400" />
                    {transaction ? formatCategory(transaction.category) : 'Categoria não disponível'}
                  </Badge>
                </div>
                
                {transaction && transaction.location && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Local</p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      {transaction.location}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />
            
            {transaction && transaction.notes && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Notas</h4>
                <p className="text-gray-800 dark:text-gray-200 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                  {transaction.notes}
                </p>
              </div>
            )}
            
            {transaction && transaction.tags && transaction.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {transaction.tags.map((tag, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                    >
                      <Tag className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {transaction && transaction.authorizedBy && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Autorizado por</h4>
                <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-800 dark:text-gray-200">
                    {transaction.authorizedBy}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
              <CreditCardIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Informações de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Valor</h4>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                R$ {transaction && transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  {transaction && transaction.currency}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Cartão Utilizado</h4>
              {cards && cards.length > 0 ? (
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md space-y-2">
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {cards[0].cardHolderName}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    **** **** **** {cards[0].lastFourDigits}
                  </p>
                  {cards[0].departmentName && (
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Building className="h-3.5 w-3.5 mr-1" />
                      <span>{cards[0].departmentName}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  Informações do cartão não disponíveis
                </p>
              )}
            </div>
            
            {transaction && transaction.departmentId && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Departamento</h4>
                <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                  <Building className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-800 dark:text-gray-200">
                    {transaction.departmentId}
                  </span>
                </div>
              </div>
            )}
            
            {transaction && transaction.receiptUrl && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Comprovante</h4>
                <Button
                  variant="outline"
                  className="w-full bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Comprovante
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Mostrar caixa de alerta contextual com base no status */}
      {transaction && transaction.status === 'requires_approval' && (
        <div className="p-4 border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 rounded-md">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
            <div>
              <h4 className="font-medium text-orange-800 dark:text-orange-300">Aprovação Pendente</h4>
              <p className="mt-1 text-sm text-orange-700 dark:text-orange-400">
                Esta transação ultrapassa o limite de aprovação automática e aguarda aprovação manual.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {transaction && transaction.status === 'disputed' && (
        <div className="p-4 border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h4 className="font-medium text-indigo-800 dark:text-indigo-300">Transação Contestada</h4>
              <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-400">
                Esta transação foi contestada e está sob investigação.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {transaction && transaction.status === 'declined' && (
        <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-md">
          <div className="flex">
            <XCircle className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-300">Transação Recusada</h4>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                Esta transação foi recusada pela operadora do cartão ou pelo sistema de aprovação interno.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {transaction && transaction.status === 'refunded' && (
        <div className="p-4 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 rounded-md">
          <div className="flex">
            <ArrowDown className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-300">Transação Reembolsada</h4>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                Esta transação foi reembolsada. O valor foi estornado para o cartão original.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between">
        {transaction && transaction.receiptUrl && (
          <Button
            variant="outline"
            className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar Comprovante
          </Button>
        )}
        
        <Button
          variant="outline"
          className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <FileText className="h-4 w-4 mr-2" />
          Gerar Relatório
        </Button>
      </div>
    </div>
  );
};