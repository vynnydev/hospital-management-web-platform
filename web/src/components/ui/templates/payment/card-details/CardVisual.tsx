import React from 'react';
import { Badge } from '@/components/ui/organisms/badge';
import { 
  Building, 
  CheckCircle2, 
  EyeOff, 
  AlertTriangle, 
  Clock, 
  Power 
} from 'lucide-react';
import { 
  IPaymentCard, 
  CardStatus, 
  CardBrand 
} from '@/types/payment-types';

interface CardVisualProps {
  card: IPaymentCard;
}

export const CardVisual: React.FC<CardVisualProps> = ({ card }) => {
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
  const formatCardType = (type: string) => {
    switch (type) {
      case 'credit': return 'Crédito';
      case 'debit': return 'Débito';
      case 'corporate': return 'Corporativo';
      case 'virtual': return 'Virtual';
      case 'prepaid': return 'Pré-pago';
      default: return type;
    }
  };
  
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
      {/* Cabeçalho do cartão com estilo gradiente baseado no colorScheme */}
      <div 
        className={`relative p-6 ${
          card.colorScheme === 'gradient-blue'
            ? 'bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800'
            : card.colorScheme === 'gradient-green'
            ? 'bg-gradient-to-r from-green-500 to-green-700 dark:from-green-600 dark:to-green-800'
            : card.colorScheme === 'gradient-purple'
            ? 'bg-gradient-to-r from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800'
            : 'bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-600 dark:to-gray-800'
        }`}
      >
        {/* Status badge no canto superior direito */}
        <div className="absolute top-4 right-4">
          <Badge className={`${getStatusBadgeClass(card.status)} flex items-center`}>
            {getStatusIcon(card.status)}
            <span className="ml-1">{getStatusLabel(card.status)}</span>
          </Badge>
        </div>
        
        {/* Logo da bandeira no canto superior esquerdo */}
        <div className="flex justify-between items-start">
          <div className="mb-8">
            {formatCardBrand(card.cardBrand)}
          </div>
          
          {/* Chip do cartão */}
          <div className="w-12 h-10 rounded-md bg-yellow-400 dark:bg-yellow-500 mb-6 flex items-center justify-center opacity-80">
            <div className="w-10 h-8 rounded-md border-2 border-yellow-500 dark:border-yellow-600 grid grid-cols-3 grid-rows-3 gap-0.5 p-1">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="bg-yellow-600 dark:bg-yellow-700 rounded-sm"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Número do cartão */}
        <div className="mt-2 text-white text-2xl tracking-widest font-mono mb-8">
          {card.cardNumber}
        </div>
        
        {/* Informações do titular e validade */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-white/60 text-xs mb-1">Titular</p>
            <p className="text-white text-lg font-medium">{card.cardHolderName}</p>
          </div>
          
          <div>
            <p className="text-white/60 text-xs mb-1">Validade</p>
            <p className="text-white text-lg font-medium">{card.expiryDate}</p>
          </div>
          
          {card.departmentName && (
            <div>
              <p className="text-white/60 text-xs mb-1">Departamento</p>
              <div className="flex items-center text-white">
                <Building className="h-4 w-4 mr-1" />
                <span>{card.departmentName}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Rodapé do cartão com informações adicionais */}
      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tipo</p>
            <p className="text-gray-800 dark:text-gray-200 font-medium">
              {formatCardType(card.cardType)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Emitido em</p>
            <p className="text-gray-800 dark:text-gray-200 font-medium">
              {new Date(card.issuedAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">ID do Cartão</p>
            <p className="text-gray-800 dark:text-gray-200 font-medium">
              {card.id}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Saldo Disponível</p>
            <p className="text-gray-800 dark:text-gray-200 font-medium">
              R$ {card.availableBalance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};