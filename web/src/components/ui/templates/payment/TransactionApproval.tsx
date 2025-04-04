/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Badge } from '@/components/ui/organisms/badge';
import { Textarea } from '@/components/ui/organisms/textarea';
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
  CardFooter,
} from '@/components/ui/organisms/card';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  CreditCard, 
  Store, 
  ShoppingBag,
  Building,
  FileText,
  User,
  Calendar,
  Timer,
  ThumbsUp,
  ThumbsDown,
  Eye,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  MapPin
} from 'lucide-react';
import { 
  IApprovalRequest, 
  ITransaction,
  TransactionStatus,
  IPaymentAccess,
  ApprovalStatus,
  ExpenseCategory,
  ApprovalUrgency,
  PaymentPermission
} from '@/types/payment-types';

interface TransactionApprovalProps {
  approvals: IApprovalRequest[];
  onApprove: (approvalId: string, notes?: string) => Promise<boolean>;
  onReject: (approvalId: string, reason: string) => Promise<boolean>;
  userAccess: IPaymentAccess | null;
}

export const TransactionApproval: React.FC<TransactionApprovalProps> = ({ 
  approvals, 
  onApprove, 
  onReject,
  userAccess
}) => {
  const [selectedApproval, setSelectedApproval] = useState<IApprovalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedApprovalId, setExpandedApprovalId] = useState<string | null>(null);
  const [filterUrgency, setFilterUrgency] = useState<ApprovalUrgency | 'all'>('all');
  
  // Filtrar aprovações
  const filteredApprovals = approvals.filter(approval => {
    const searchMatch = 
      searchTerm === '' || 
      approval.transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const urgencyMatch = filterUrgency === 'all' || approval.urgency === filterUrgency;
    
    return searchMatch && urgencyMatch;
  });
  
  // Ordenar por urgência e data
  const sortedApprovals = [...filteredApprovals].sort((a, b) => {
    // Primeiro por urgência
    const urgencyOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
    const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;
    
    // Depois por data (mais antigo primeiro)
    return new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime();
  });
  
  // Verificar se o usuário pode aprovar transações
  const canApprove = userAccess?.permissions.includes('approve_transactions' as PaymentPermission);
  
  // Função para aprovar uma transação
  const handleApprove = async () => {
    if (!selectedApproval) return;
    
    setLoading(true);
    try {
      const success = await onApprove(selectedApproval.id, approvalNotes);
      if (success) {
        setShowApproveDialog(false);
        setSelectedApproval(null);
        setApprovalNotes('');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Função para rejeitar uma transação
  const handleReject = async () => {
    if (!selectedApproval || !rejectionReason.trim()) return;
    
    setLoading(true);
    try {
      const success = await onReject(selectedApproval.id, rejectionReason);
      if (success) {
        setShowRejectDialog(false);
        setSelectedApproval(null);
        setRejectionReason('');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Funções para formatar dados
  const formatUrgency = (urgency: ApprovalUrgency) => {
    switch (urgency) {
      case 'critical': return { 
        label: 'Crítica', 
        class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mr-1" />
      };
      case 'high': return { 
        label: 'Alta', 
        class: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
        icon: <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mr-1" />
      };
      case 'medium': return { 
        label: 'Média', 
        class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
        icon: <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-1" />
      };
      case 'low': return { 
        label: 'Baixa', 
        class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        icon: <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />
      };
      default: return { 
        label: urgency, 
        class: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        icon: <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-1" />
      };
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
  
  // Função para calcular o tempo restante até a expiração
  const getRemainingTime = (expiresAt: string) => {
    const now = new Date();
    const expiration = new Date(expiresAt);
    const diffMs = expiration.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expirado';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const days = Math.floor(diffHours / 24);
      return `${days} dia${days > 1 ? 's' : ''} restante${days > 1 ? 's' : ''}`;
    }
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}min restantes`;
    }
    
    return `${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''} restante${diffMinutes > 1 ? 's' : ''}`;
  };
  
  // Função para obter a classe de urgência com base no tempo restante
  const getExpirationClass = (expiresAt: string) => {
    const now = new Date();
    const expiration = new Date(expiresAt);
    const diffMs = expiration.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours <= 0) return 'text-red-600 dark:text-red-400';
    if (diffHours <= 2) return 'text-red-600 dark:text-red-400';
    if (diffHours <= 6) return 'text-orange-600 dark:text-orange-400';
    if (diffHours <= 24) return 'text-amber-600 dark:text-amber-400';
    return 'text-green-600 dark:text-green-400';
  };
  
  // Verificar se há transações para aprovar
  if (sortedApprovals.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 dark:text-green-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Nenhuma aprovação pendente</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Não há transações aguardando sua aprovação no momento.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Buscar por estabelecimento, descrição ou solicitante"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
          />
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto">
          <div className="w-full md:w-auto">
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value as ApprovalUrgency | 'all')}
              className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as urgências</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {sortedApprovals.map((approval) => {
          const transaction = approval.transaction;
          const urgency = formatUrgency(approval.urgency);
          const isExpanded = expandedApprovalId === approval.id;
          
          return (
            <Card 
              key={approval.id} 
              className={`bg-white dark:bg-gray-800 border-l-4 ${
                approval.urgency === 'critical' ? 'border-l-red-600 dark:border-l-red-500' :
                approval.urgency === 'high' ? 'border-l-orange-600 dark:border-l-orange-500' :
                approval.urgency === 'medium' ? 'border-l-amber-600 dark:border-l-amber-500' :
                'border-l-blue-600 dark:border-l-blue-500'
              } border-t-gray-200 border-r-gray-200 border-b-gray-200 dark:border-t-gray-700 dark:border-r-gray-700 dark:border-b-gray-700`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center text-gray-800 dark:text-gray-100">
                      <Store className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                      {transaction.merchant}
                      <Badge className={`ml-3 ${urgency.class} flex items-center`}>
                        {urgency.icon}
                        {urgency.label}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400 mt-1">
                      {transaction.description || "Sem descrição fornecida"}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-sm ${getExpirationClass(approval.expiresAt)}`}>
                      {getRemainingTime(approval.expiresAt)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-wrap gap-4 justify-between text-sm">
                  <div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <CreditCard className="h-4 w-4 mr-1" />
                      Cartão: <span className="font-medium text-gray-800 dark:text-gray-200 ml-1">**** {transaction.cardId.substr(-4)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      Categoria: <span className="font-medium text-gray-800 dark:text-gray-200 ml-1">{formatCategory(transaction.category)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <User className="h-4 w-4 mr-1" />
                      Solicitado por: <span className="font-medium text-gray-800 dark:text-gray-200 ml-1">{approval.requestedBy}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      Data: <span className="font-medium text-gray-800 dark:text-gray-200 ml-1">
                        {new Date(transaction.timestamp).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detalhes adicionais</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Building className="h-4 w-4 mr-1" />
                          Departamento: <span className="font-medium text-gray-800 dark:text-gray-200 ml-1">
                            {transaction.departmentId || "Não especificado"}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <FileText className="h-4 w-4 mr-1" />
                          Referência: <span className="font-medium text-gray-800 dark:text-gray-200 ml-1">
                            {transaction.referenceNumber}
                          </span>
                        </div>
                      </div>
                      
                      {transaction.location && (
                        <div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-1" />
                            Localização: <span className="font-medium text-gray-800 dark:text-gray-200 ml-1">
                              {transaction.location}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Timer className="h-4 w-4 mr-1" />
                          Solicitado em: <span className="font-medium text-gray-800 dark:text-gray-200 ml-1">
                            {new Date(approval.requestedAt).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {transaction.notes && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        <div className="flex items-start">
                          <MessageSquare className="h-4 w-4 mt-0.5 text-gray-500 dark:text-gray-400 mr-2" />
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            <div className="font-medium mb-1">Observações:</div>
                            <p>{transaction.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between items-center pt-0">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setExpandedApprovalId(isExpanded ? null : approval.id)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Menos detalhes
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Mais detalhes
                    </>
                  )}
                </Button>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedApproval(approval);
                      setShowRejectDialog(true);
                    }}
                    className="bg-white dark:bg-gray-700 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    disabled={!canApprove}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Rejeitar
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={() => {
                      setSelectedApproval(approval);
                      setShowApproveDialog(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
                    disabled={!canApprove}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {/* Dialog de Rejeição */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-gray-100">
              Rejeitar Transação
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Informe o motivo da rejeição desta transação.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {selectedApproval?.transaction.merchant}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedApproval?.transaction.description}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                R$ {selectedApproval?.transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Motivo da Rejeição <span className="text-red-500">*</span>
              </label>
              <Textarea 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explique o motivo da rejeição desta transação..."
                className="min-h-[100px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Esta informação será enviada ao solicitante.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600"
              disabled={loading || !rejectionReason.trim()}
            >
              {loading ? 'Rejeitando...' : 'Confirmar Rejeição'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de Aprovação */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-gray-100">
              Aprovar Transação
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Você está prestes a aprovar esta transação.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {selectedApproval?.transaction.merchant}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedApproval?.transaction.description}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                R$ {selectedApproval?.transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Observações (opcional)
              </label>
              <Textarea 
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Adicione observações sobre esta aprovação (opcional)"
                className="min-h-[100px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
              disabled={loading}
            >
              {loading ? 'Aprovando...' : 'Confirmar Aprovação'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};