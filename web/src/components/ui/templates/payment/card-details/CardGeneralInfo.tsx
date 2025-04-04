import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/organisms/card';
import { 
  User, 
  Building, 
  Info,
  Clock,
  CreditCard,
  MapPin
} from 'lucide-react';
import { IPaymentCard } from '@/types/payment-types';

interface CardGeneralInfoProps {
  card: IPaymentCard;
}

export const CardGeneralInfo: React.FC<CardGeneralInfoProps> = ({ card }) => {
  // Formatar datas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Formatar o tipo de cartão
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
  
  // Formatar a bandeira do cartão
  const formatCardBrand = (brand: string) => {
    switch (brand) {
      case 'visa': return 'Visa';
      case 'mastercard': return 'Mastercard';
      case 'amex': return 'American Express';
      case 'discover': return 'Discover';
      case 'elo': return 'Elo';
      case 'hipercard': return 'Hipercard';
      default: return brand;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
              <User className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              Informações do Titular
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {card.cardHolderName}
              </p>
            </div>
            
            {card.departmentName && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Departamento</p>
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    {card.departmentName}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
              <CreditCard className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              Informações do Cartão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tipo</p>
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  {formatCardType(card.cardType)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bandeira</p>
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  {formatCardBrand(card.cardBrand)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Validade</p>
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  {card.expiryDate}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Últimos 4 dígitos</p>
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  **** {card.lastFourDigits}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
            <Clock className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
            Datas Importantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Data de Emissão</p>
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {formatDate(card.issuedAt)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Última Atualização</p>
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {formatDate(card.updatedAt)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Expiração</p>
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {card.expiryDate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {card.billingAddress && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
              <MapPin className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              Endereço de Cobrança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800 dark:text-gray-200">
              {card.billingAddress.street}, {card.billingAddress.number}
              {card.billingAddress.complement && `, ${card.billingAddress.complement}`}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              {card.billingAddress.neighborhood} - {card.billingAddress.city}/{card.billingAddress.state}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              CEP: {card.billingAddress.zipCode} - {card.billingAddress.country}
            </p>
          </CardContent>
        </Card>
      )}
      
      <div className="flex items-center space-x-2">
        <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ID do Cartão: {card.id}
        </p>
      </div>
    </div>
  );
};