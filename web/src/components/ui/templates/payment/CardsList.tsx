/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Badge } from '@/components/ui/organisms/badge';
import { Separator } from '@/components/ui/organisms/Separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/organisms/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/organisms/select';
import { 
  CreditCard, 
  Search, 
  SlidersHorizontal, 
  Eye, 
  EyeOff, 
  MoreVertical, 
  Power, 
  AlertCircle, 
  CheckCircle2, 
  LockKeyhole,
  Clock,
  Building,
  User
} from 'lucide-react';
import { 
  IPaymentCard, 
  CardStatus, 
  CardType, 
  CardBrand,
  IPaymentAccess,
  PaymentPermission
} from '@/types/payment-types';

interface CardsListProps {
  cards: IPaymentCard[];
  onSelectCard: (cardId: string) => void;
  onUpdateStatus: (cardId: string, status: CardStatus) => Promise<boolean>;
  userAccess: IPaymentAccess | null;
}

export const CardsList: React.FC<CardsListProps> = ({ 
  cards, 
  onSelectCard, 
  onUpdateStatus,
  userAccess
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CardStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CardType | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  
  // Extrair departamentos únicos dos cartões
  const departments = cards.reduce((acc: { id: string; name: string }[], card) => {
    if (card.departmentId && card.departmentName) {
      const exists = acc.some(d => d.id === card.departmentId);
      if (!exists) {
        acc.push({ id: card.departmentId, name: card.departmentName });
      }
    }
    return acc;
  }, []);

  // Filtragem de cartões
  const filteredCards = cards.filter(card => {
    // Filtro de pesquisa
    const searchMatch = 
      searchTerm === '' || 
      card.cardHolderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.lastFourDigits.includes(searchTerm);
    
    // Filtro de status
    const statusMatch = statusFilter === 'all' || card.status === statusFilter;
    
    // Filtro de tipo
    const typeMatch = typeFilter === 'all' || card.cardType === typeFilter;
    
    // Filtro de departamento
    const departmentMatch = departmentFilter === 'all' || card.departmentId === departmentFilter;
    
    return searchMatch && statusMatch && typeMatch && departmentMatch;
  });

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
        return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
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
  
  // Verificar se o usuário pode gerenciar cartões
  const canManageCards = userAccess?.permissions.includes('manage_cards' as PaymentPermission) || false;
  
  // Renderização
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Buscar por titular ou últimos 4 dígitos"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
          />
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as CardStatus | 'all')}
          >
            <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <SelectItem value="all" className="text-gray-800 dark:text-gray-200">Todos os status</SelectItem>
              <SelectItem value="active" className="text-gray-800 dark:text-gray-200">Ativos</SelectItem>
              <SelectItem value="inactive" className="text-gray-800 dark:text-gray-200">Inativos</SelectItem>
              <SelectItem value="blocked" className="text-gray-800 dark:text-gray-200">Bloqueados</SelectItem>
              <SelectItem value="expired" className="text-gray-800 dark:text-gray-200">Expirados</SelectItem>
              <SelectItem value="pending_activation" className="text-gray-800 dark:text-gray-200">Pendentes</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value as CardType | 'all')}
          >
            <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <SelectItem value="all" className="text-gray-800 dark:text-gray-200">Todos os tipos</SelectItem>
              <SelectItem value="credit" className="text-gray-800 dark:text-gray-200">Crédito</SelectItem>
              <SelectItem value="debit" className="text-gray-800 dark:text-gray-200">Débito</SelectItem>
              <SelectItem value="corporate" className="text-gray-800 dark:text-gray-200">Corporativo</SelectItem>
              <SelectItem value="virtual" className="text-gray-800 dark:text-gray-200">Virtual</SelectItem>
              <SelectItem value="prepaid" className="text-gray-800 dark:text-gray-200">Pré-pago</SelectItem>
            </SelectContent>
          </Select>
          
          {departments.length > 0 && (
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectItem value="all" className="text-gray-800 dark:text-gray-200">Todos os departamentos</SelectItem>
                {departments.map((dept) => (
                  <SelectItem 
                    key={dept.id} 
                    value={dept.id}
                    className="text-gray-800 dark:text-gray-200"
                  >
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card) => (
            <div 
              key={card.id}
              className={`rounded-xl overflow-hidden shadow-sm border ${
                card.status === 'active' 
                  ? 'border-green-200 dark:border-green-800' 
                  : 'border-gray-200 dark:border-gray-700'
              } hover:shadow-md transition-shadow`}
            >
              {/* Cabeçalho do cartão com estilo gradiente baseado no colorScheme */}
              <div 
                className={`p-4 ${
                  card.colorScheme === 'gradient-blue'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800'
                    : card.colorScheme === 'gradient-green'
                    ? 'bg-gradient-to-r from-green-500 to-green-700 dark:from-green-600 dark:to-green-800'
                    : card.colorScheme === 'gradient-purple'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800'
                    : 'bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-600 dark:to-gray-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white text-lg font-semibold mb-1">
                      {card.cardHolderName}
                    </p>
                    <p className="text-white/80 text-sm">
                      {formatCardType(card.cardType)}
                    </p>
                  </div>
                  <div className="flex space-x-2 items-center">
                    {formatCardBrand(card.cardBrand)}
                    <Badge className={getStatusBadgeClass(card.status)}>
                      {getStatusIcon(card.status)}
                      <span className="ml-1">{getStatusLabel(card.status)}</span>
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 text-white text-xl tracking-wider font-mono">
                  {card.cardNumber}
                </div>
                
                <div className="mt-4 flex justify-between items-center text-white/80 text-sm">
                  <div>
                    <p>Validade</p>
                    <p className="font-semibold">{card.expiryDate}</p>
                  </div>
                  {card.departmentName && (
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>{card.departmentName}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Corpo do cartão com informações adicionais */}
              <div className="p-4 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Limite disponível</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      R$ {card.availableBalance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        / {card.creditLimit?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectCard(card.id)}
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                    
                    {canManageCards && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                          <DropdownMenuLabel className="text-gray-800 dark:text-gray-200">Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
                          
                          {card.status === 'active' && (
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(card.id, 'blocked' as CardStatus)}
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                            >
                              <LockKeyhole className="h-4 w-4 mr-2" />
                              Bloquear
                            </DropdownMenuItem>
                          )}
                          
                          {card.status === 'blocked' && (
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(card.id, 'active' as CardStatus)}
                              className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Desbloquear
                            </DropdownMenuItem>
                          )}
                          
                          {card.status !== 'inactive' && card.status !== 'expired' && (
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(card.id, 'inactive' as CardStatus)}
                              className="text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer"
                            >
                              <EyeOff className="h-4 w-4 mr-2" />
                              Desativar
                            </DropdownMenuItem>
                          )}
                          
                          {card.status === 'inactive' && (
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(card.id, 'active' as CardStatus)}
                              className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer"
                            >
                              <Power className="h-4 w-4 mr-2" />
                              Ativar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <CreditCard className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            Nenhum cartão encontrado
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {cards.length === 0
              ? "Não há cartões disponíveis no sistema. Adicione um novo cartão para começar."
              : "Nenhum cartão corresponde aos seus filtros. Tente ajustar seus critérios de pesquisa."}
          </p>
        </div>
      )}
    </div>
  );
};