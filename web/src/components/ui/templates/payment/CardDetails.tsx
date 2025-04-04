/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button } from '@/components/ui/organisms/button';
import { Badge } from '@/components/ui/organisms/badge';
import { Separator } from '@/components/ui/organisms/Separator';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/organisms/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/organisms/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/organisms/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/organisms/card';
import { Progress } from '@/components/ui/organisms/progress';
import { 
  CreditCard, 
  PencilLine, 
  Power, 
  Shield, 
  AlertTriangle, 
  CheckCircle2,
  LockKeyhole,
  Clock,
  Building,
  User,
  Copy,
  Download,
  EyeOff,
  Calendar,
  ShoppingCart,
  Info,
  MoreVertical,
  Wallet,
  Banknote
} from 'lucide-react';
import { 
  IPaymentCard, 
  CardStatus, 
  CardType, 
  CardBrand,
  IPaymentAccess,
  ExpenseCategory,
  PaymentPermission
} from '@/types/payment-types';
import { CardVisual } from './card-details/CardVisual';
import { CardGeneralInfo } from './card-details/CardGeneralInfo';
import { CardSecuritySettings } from './card-details/CardSecuritySettings';
import { CardUsageRestrictions } from './card-details/CardUsageRestrictions';

interface CardDetailsProps {
  card: IPaymentCard;
  onEdit: () => void;
  onUpdateStatus: (cardId: string, status: CardStatus) => Promise<boolean>;
  userAccess: IPaymentAccess | null;
}

export const CardDetails: React.FC<CardDetailsProps> = ({ 
  card, 
  onEdit, 
  onUpdateStatus,
  userAccess
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);
  const [newStatus, setNewStatus] = useState<CardStatus | null>(null);
  
  // Verificar se o usuário pode gerenciar cartões
  const canManageCards = userAccess?.permissions.includes('manage_cards' as PaymentPermission) || false;
  
  // Funções auxiliares para formatar status, tipos, etc.
  const { 
    getStatusBadgeClass, 
    getStatusIcon, 
    getStatusLabel,
    formatCardBrand,
    formatCardType
  } = useCardFormatters();
  
  // Função para iniciar a alteração de status
  const handleStatusChange = (status: CardStatus) => {
    setNewStatus(status);
    setShowStatusConfirmation(true);
  };
  
  // Função para confirmar a alteração de status
  const confirmStatusChange = async () => {
    if (newStatus) {
      await onUpdateStatus(card.id, newStatus);
      setShowStatusConfirmation(false);
      setNewStatus(null);
    }
  };
  
  // Função para obter a classe de cor do botão de status
  const getStatusButtonClass = (targetStatus: CardStatus) => {
    switch (targetStatus) {
      case 'active':
        return 'bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600';
      case 'inactive':
        return 'bg-gray-600 hover:bg-gray-700 text-white dark:bg-gray-500 dark:hover:bg-gray-600';
      case 'blocked':
        return 'bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600';
    }
  };
  
  // Função para obter a descrição da ação de alteração de status
  const getStatusChangeDescription = (targetStatus: CardStatus | null) => {
    if (!targetStatus) return '';
    
    switch (targetStatus) {
      case 'active':
        return 'Ao ativar este cartão, ele poderá ser utilizado para novas transações.';
      case 'inactive':
        return 'Ao desativar este cartão, ele não poderá ser utilizado para novas transações, mas poderá ser reativado posteriormente.';
      case 'blocked':
        return 'Ao bloquear este cartão, ele não poderá ser utilizado para novas transações até ser desbloqueado. Use esta opção em caso de suspeita de fraude ou perda do cartão.';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
            <CreditCard className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Detalhes do Cartão
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Informações e configurações do cartão {card.cardHolderName}
          </p>
        </div>
        
        <div className="flex space-x-2">
          {canManageCards && (
            <Button
              onClick={onEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <PencilLine className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
          
          {canManageCards && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                >
                  <MoreVertical className="h-4 w-4 mr-1" />
                  Ações
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <DropdownMenuLabel className="text-gray-800 dark:text-gray-200">
                  Gerenciar status
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
                
                {card.status !== 'active' && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange('active' as CardStatus)}
                    className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Ativar
                  </DropdownMenuItem>
                )}
                
                {card.status !== 'inactive' && card.status !== 'expired' && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange('inactive' as CardStatus)}
                    className="text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600/20 cursor-pointer"
                  >
                    <EyeOff className="h-4 w-4 mr-2" />
                    Desativar
                  </DropdownMenuItem>
                )}
                
                {card.status !== 'blocked' && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange('blocked' as CardStatus)}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                  >
                    <LockKeyhole className="h-4 w-4 mr-2" />
                    Bloquear
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {/* Representação visual do cartão */}
      <CardVisual card={card} />
      
      {/* Tabs de informações do cartão */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
            <TabsList className="p-0 bg-transparent h-auto">
              <TabsTrigger 
                value="general" 
                className={`py-3 px-4 rounded-none border-b-2 ${
                  activeTab === 'general' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Info className="h-4 w-4 mr-2" />
                Geral
              </TabsTrigger>
              
              <TabsTrigger 
                value="security" 
                className={`py-3 px-4 rounded-none border-b-2 ${
                  activeTab === 'security' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Shield className="h-4 w-4 mr-2" />
                Segurança
              </TabsTrigger>
              
              <TabsTrigger 
                value="restrictions" 
                className={`py-3 px-4 rounded-none border-b-2 ${
                  activeTab === 'restrictions' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Restrições de Uso
              </TabsTrigger>
              
              <TabsTrigger 
                value="limits" 
                className={`py-3 px-4 rounded-none border-b-2 ${
                  activeTab === 'limits' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Limites
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
            <TabsContent value="general" className="mt-0">
              <CardGeneralInfo card={card} />
            </TabsContent>
            
            <TabsContent value="security" className="mt-0">
              <CardSecuritySettings card={card} canManage={canManageCards} />
            </TabsContent>
            
            <TabsContent value="restrictions" className="mt-0">
              <CardUsageRestrictions card={card} />
            </TabsContent>
            
            <TabsContent value="limits" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Limites de Transação</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Limites de valores para transações com este cartão
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Limite de Crédito
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end space-x-2">
                          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            R$ {card.creditLimit?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Saldo Disponível
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-end space-x-2">
                            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                              R$ {card.availableBalance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          
                          <Progress 
                            value={(card.availableBalance || 0) / (card.creditLimit || 1) * 100} 
                            className="h-2 bg-gray-200 dark:bg-gray-700" 
                          />
                          
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>0%</span>
                            <span>
                              {Math.round((card.availableBalance || 0) / (card.creditLimit || 1) * 100)}%
                            </span>
                            <span>100%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Limite Diário
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end space-x-2">
                          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            R$ {card.securitySettings.maxDailyTransactionAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Limite Mensal
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end space-x-2">
                          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            R$ {card.securitySettings.maxMonthlyTransactionAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
                
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Limites de Aprovação</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Valores acima do limiar de aprovação requerem autorização adicional
                  </p>
                  
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Limiar de Aprovação Automática
                          </p>
                          <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            R$ {card.securitySettings.transactionApprovalThreshold.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Transações acima deste valor requerem aprovação manual
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Aprovadores Autorizados
                          </p>
                          <div className="space-y-1">
                            {card.securitySettings.allowedApprovers.length > 0 ? (
                              card.securitySettings.allowedApprovers.map((approverId, index) => (
                                <div 
                                  key={index} 
                                  className="flex items-center py-1 px-2 bg-gray-50 dark:bg-gray-700/50 rounded-md"
                                >
                                  <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                                  <span className="text-gray-800 dark:text-gray-200">{approverId}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 dark:text-gray-400">
                                Nenhum aprovador específico definido
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      {/* Dialog de confirmação de alteração de status */}
      <Dialog open={showStatusConfirmation} onOpenChange={setShowStatusConfirmation}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-gray-100">
              Confirmar alteração de status
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Você está prestes a alterar o status deste cartão para: 
              <Badge 
                className={`ml-2 inline-flex items-center ${getStatusBadgeClass(newStatus || 'active' as CardStatus)}`}
              >
                {getStatusIcon(newStatus || 'active' as CardStatus)}
                <span className="ml-1">{getStatusLabel(newStatus || 'active' as CardStatus)}</span>
              </Badge>
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-300">
              {getStatusChangeDescription(newStatus)}
            </p>
            
            {newStatus === 'blocked' && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500 dark:text-red-400" />
                  <div>
                    <p className="font-medium">Importante</p>
                    <p className="mt-1 text-sm">
                      O bloqueio do cartão impedirá todas as transações até que seja desbloqueado.
                      Esta ação deve ser utilizada em casos de suspeita de fraude, perda do cartão ou
                      necessidade urgente de suspender operações.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusConfirmation(false)}
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmStatusChange}
              className={getStatusButtonClass(newStatus || 'active' as CardStatus)}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Funções auxiliares para formatar status, tipos, etc.
const useCardFormatters = () => {
  // Função para obter a cor do badge de status
  const getStatusBadgeClass = (status: CardStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      case 'blocked':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'expired':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'pending_activation':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  // Função para obter o ícone de status
  const getStatusIcon = (status: CardStatus) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'inactive':
        return <EyeOff className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
      case 'blocked':
        return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case 'pending_activation':
        return <Power className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <EyeOff className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };
  
  // Função para obter o nome legível do status
  const getStatusLabel = (status: CardStatus) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'blocked': return 'Bloqueado';
      case 'expired': return 'Expirado';
      case 'pending_activation': return 'Pendente';
      default: return status;
    }
  };
  
  // Função para formatar o nome do cartão com ícone da bandeira
  const formatCardBrand = (brand: CardBrand) => {
    switch (brand) {
      case 'visa':
        return <Badge className="bg-blue-600 text-white dark:bg-blue-500">Visa</Badge>;
      case 'mastercard':
        return <Badge className="bg-orange-600 text-white dark:bg-orange-500">Mastercard</Badge>;
      case 'amex':
        return <Badge className="bg-indigo-600 text-white dark:bg-indigo-500">Amex</Badge>;
      case 'discover':
        return <Badge className="bg-purple-600 text-white dark:bg-purple-500">Discover</Badge>;
      case 'elo':
        return <Badge className="bg-green-600 text-white dark:bg-green-500">Elo</Badge>;
      case 'hipercard':
        return <Badge className="bg-red-600 text-white dark:bg-red-500">Hipercard</Badge>;
      default:
        return <Badge className="bg-gray-600 text-white dark:bg-gray-500">{brand}</Badge>;
    }
  };
  
  // Função para formatar o tipo de cartão
  const formatCardType = (type: CardType) => {
    switch (type) {
      case 'credit':
        return 'Crédito';
      case 'debit':
        return 'Débito';
      case 'corporate':
        return 'Corporativo';
      case 'virtual':
        return 'Virtual';
      case 'prepaid':
        return 'Pré-pago';
      default:
        return type;
    }
  };
  
  return {
    getStatusBadgeClass,
    getStatusIcon,
    getStatusLabel,
    formatCardBrand,
    formatCardType
  };
};