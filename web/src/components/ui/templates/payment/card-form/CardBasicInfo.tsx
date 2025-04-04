/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Switch } from '@/components/ui/organisms/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/organisms/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/organisms/select';
import { IPaymentCard, CardType, CardBrand, CardStatus } from '@/types/payment-types';

interface CardBasicInfoProps {
  formData: Partial<IPaymentCard>;
  updateFormField: (path: string, value: any) => void;
  errors: Record<string, string>;
  isEditMode: boolean;
}

export const CardBasicInfo: React.FC<CardBasicInfoProps> = ({
  formData,
  updateFormField,
  errors,
  isEditMode
}) => {
  // Gera uma expiração padrão (3 anos a partir de agora)
  const generateDefaultExpiry = (): string => {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = (now.getFullYear() + 3).toString().slice(-2);
    return `${month}/${year}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Informações Básicas do Cartão
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="cardHolderName" className={`text-gray-700 dark:text-gray-300 ${errors['cardHolderName'] ? 'text-red-500 dark:text-red-400' : ''}`}>
              Titular do Cartão
            </Label>
            <Input
              id="cardHolderName"
              value={formData.cardHolderName || ''}
              onChange={(e) => updateFormField('cardHolderName', e.target.value)}
              placeholder="Nome do departamento ou titular"
              className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 ${
                errors['cardHolderName'] ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' : ''
              }`}
            />
            {errors['cardHolderName'] && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                {errors['cardHolderName']}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expiryDate" className={`text-gray-700 dark:text-gray-300 ${errors['expiryDate'] ? 'text-red-500 dark:text-red-400' : ''}`}>
              Data de Validade
            </Label>
            <Input
              id="expiryDate"
              value={formData.expiryDate || ''}
              onChange={(e) => updateFormField('expiryDate', e.target.value)}
              placeholder="MM/AA"
              maxLength={5}
              className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 ${
                errors['expiryDate'] ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' : ''
              }`}
            />
            {errors['expiryDate'] ? (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                {errors['expiryDate']}
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Formato: MM/AA (ex: {generateDefaultExpiry()})
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Tipo de Cartão
        </h3>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <Label className={`text-gray-700 dark:text-gray-300 ${errors['cardType'] ? 'text-red-500 dark:text-red-400' : ''}`}>
              Selecione o tipo
            </Label>
            <RadioGroup
              value={formData.cardType || 'corporate'}
              onValueChange={(value) => updateFormField('cardType', value as CardType)}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="corporate"
                  id="corporate"
                  className="border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400"
                />
                <Label
                  htmlFor="corporate"
                  className="text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Corporativo
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="credit"
                  id="credit"
                  className="border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400"
                />
                <Label
                  htmlFor="credit"
                  className="text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Crédito
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="debit"
                  id="debit"
                  className="border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400"
                />
                <Label
                  htmlFor="debit"
                  className="text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Débito
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="virtual"
                  id="virtual"
                  className="border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400"
                />
                <Label
                  htmlFor="virtual"
                  className="text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Virtual
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="prepaid"
                  id="prepaid"
                  className="border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400"
                />
                <Label
                  htmlFor="prepaid"
                  className="text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Pré-pago
                </Label>
              </div>
            </RadioGroup>
            {errors['cardType'] && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                {errors['cardType']}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Bandeira
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="cardBrand" className={`text-gray-700 dark:text-gray-300 ${errors['cardBrand'] ? 'text-red-500 dark:text-red-400' : ''}`}>
              Selecione a bandeira
            </Label>
            <Select
              value={formData.cardBrand || 'mastercard'}
              onValueChange={(value) => updateFormField('cardBrand', value as CardBrand)}
            >
              <SelectTrigger
                id="cardBrand"
                className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 ${
                  errors['cardBrand'] ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' : ''
                }`}
              >
                <SelectValue placeholder="Selecione a bandeira" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectItem value="mastercard" className="text-gray-800 dark:text-gray-200">
                  Mastercard
                </SelectItem>
                <SelectItem value="visa" className="text-gray-800 dark:text-gray-200">
                  Visa
                </SelectItem>
                <SelectItem value="amex" className="text-gray-800 dark:text-gray-200">
                  American Express
                </SelectItem>
                <SelectItem value="elo" className="text-gray-800 dark:text-gray-200">
                  Elo
                </SelectItem>
                <SelectItem value="hipercard" className="text-gray-800 dark:text-gray-200">
                  Hipercard
                </SelectItem>
                <SelectItem value="other" className="text-gray-800 dark:text-gray-200">
                  Outra
                </SelectItem>
              </SelectContent>
            </Select>
            {errors['cardBrand'] && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                {errors['cardBrand']}
              </p>
            )}
          </div>
          
          {isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="cardStatus" className={`text-gray-700 dark:text-gray-300 ${errors['status'] ? 'text-red-500 dark:text-red-400' : ''}`}>
                Status do Cartão
              </Label>
              <Select
                value={formData.status || 'pending_activation'}
                onValueChange={(value) => updateFormField('status', value as CardStatus)}
              >
                <SelectTrigger
                  id="cardStatus"
                  className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 ${
                    errors['status'] ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' : ''
                  }`}
                >
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectItem value="active" className="text-gray-800 dark:text-gray-200">
                    Ativo
                  </SelectItem>
                  <SelectItem value="inactive" className="text-gray-800 dark:text-gray-200">
                    Inativo
                  </SelectItem>
                  <SelectItem value="blocked" className="text-gray-800 dark:text-gray-200">
                    Bloqueado
                  </SelectItem>
                  <SelectItem value="pending_activation" className="text-gray-800 dark:text-gray-200">
                    Pendente de Ativação
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors['status'] && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                  {errors['status']}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Personalização Visual
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="colorScheme" className="text-gray-700 dark:text-gray-300">
              Esquema de Cores
            </Label>
            <Select
              value={formData.colorScheme || 'gradient-blue'}
              onValueChange={(value) => updateFormField('colorScheme', value)}
            >
              <SelectTrigger
                id="colorScheme"
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
              >
                <SelectValue placeholder="Selecione o esquema de cores" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectItem value="gradient-blue" className="text-blue-600 dark:text-blue-400">
                  Azul (Padrão)
                </SelectItem>
                <SelectItem value="gradient-green" className="text-green-600 dark:text-green-400">
                  Verde
                </SelectItem>
                <SelectItem value="gradient-purple" className="text-purple-600 dark:text-purple-400">
                  Roxo
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="isDefault" className="text-gray-700 dark:text-gray-300">
                Definir como Cartão Padrão
              </Label>
              <Switch
                id="isDefault"
                checked={formData.isDefault || false}
                onCheckedChange={(checked) => updateFormField('isDefault', checked)}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              O cartão padrão será selecionado automaticamente para novas transações.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};