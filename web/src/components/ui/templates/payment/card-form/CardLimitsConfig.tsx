/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Slider } from '@/components/ui/organisms/slider';
import { Switch } from '@/components/ui/organisms/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/organisms/card';
import { 
  Wallet, 
  AlertTriangle, 
  ArrowUpDown,
  TrendingUp,
  Clock,
  Calendar,
  DollarSign
} from 'lucide-react';
import { IPaymentCard } from '@/types/payment-types';

interface CardLimitsConfigProps {
  formData: Partial<IPaymentCard>;
  updateFormField: (path: string, value: any) => void;
  errors: Record<string, string>;
}

export const CardLimitsConfig: React.FC<CardLimitsConfigProps> = ({
  formData,
  updateFormField,
  errors
}) => {
  // Função para formatar valor monetário
  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined) return '';
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  // Função para converter string para valor numérico
  const parseValue = (value: string): number => {
    // Remove formatação e converte para número
    const numericValue = value.replace(/\D/g, '');
    return numericValue ? parseInt(numericValue, 10) / 100 : 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Limites de Crédito
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label 
              htmlFor="creditLimit" 
              className={`text-gray-700 dark:text-gray-300 ${errors['creditLimit'] ? 'text-red-500 dark:text-red-400' : ''}`}
            >
              Limite de Crédito Total (R$)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input
                id="creditLimit"
                value={formatCurrency(formData.creditLimit)}
                onChange={(e) => updateFormField('creditLimit', parseValue(e.target.value))}
                className={`pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 ${
                  errors['creditLimit'] ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' : ''
                }`}
                placeholder="0,00"
              />
            </div>
            {errors['creditLimit'] ? (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                {errors['creditLimit']}
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Valor máximo que pode ser gasto com este cartão.
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label 
              htmlFor="availableBalance" 
              className={`text-gray-700 dark:text-gray-300 ${errors['availableBalance'] ? 'text-red-500 dark:text-red-400' : ''}`}
            >
              Saldo Inicial Disponível (R$)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input
                id="availableBalance"
                value={formatCurrency(formData.availableBalance)}
                onChange={(e) => updateFormField('availableBalance', parseValue(e.target.value))}
                className={`pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 ${
                  errors['availableBalance'] ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' : ''
                }`}
                placeholder="0,00"
              />
            </div>
            {errors['availableBalance'] ? (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                {errors['availableBalance']}
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Valor inicial disponível para uso (geralmente igual ao limite total).
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Limites de Transação
        </h3>
        
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
              <Clock className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              Limites Temporais
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Defina os limites máximos para períodos específicos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label 
                htmlFor="maxDailyAmount" 
                className={`text-gray-700 dark:text-gray-300 ${errors['securitySettings.maxDailyTransactionAmount'] ? 'text-red-500 dark:text-red-400' : ''}`}
              >
                Limite Diário (R$): {formData.securitySettings?.maxDailyTransactionAmount?.toLocaleString('pt-BR') || '0'}
              </Label>
              <Slider
                id="maxDailyAmount"
                value={[formData.securitySettings?.maxDailyTransactionAmount || 10000]}
                min={1000}
                max={50000}
                step={1000}
                onValueChange={(value) => updateFormField('securitySettings.maxDailyTransactionAmount', value[0])}
                className={errors['securitySettings.maxDailyTransactionAmount'] ? 'border-red-500' : ''}
              />
              {errors['securitySettings.maxDailyTransactionAmount'] && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                  {errors['securitySettings.maxDailyTransactionAmount']}
                </p>
              )}
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>R$ 1.000</span>
                <span>R$ 50.000</span>
              </div>
            </div>
            
            <div>
              <Label 
                htmlFor="maxMonthlyAmount" 
                className={`text-gray-700 dark:text-gray-300 ${errors['securitySettings.maxMonthlyTransactionAmount'] ? 'text-red-500 dark:text-red-400' : ''}`}
              >
                Limite Mensal (R$): {formData.securitySettings?.maxMonthlyTransactionAmount?.toLocaleString('pt-BR') || '0'}
              </Label>
              <Slider
                id="maxMonthlyAmount"
                value={[formData.securitySettings?.maxMonthlyTransactionAmount || 50000]}
                min={5000}
                max={200000}
                step={5000}
                onValueChange={(value) => updateFormField('securitySettings.maxMonthlyTransactionAmount', value[0])}
                className={errors['securitySettings.maxMonthlyTransactionAmount'] ? 'border-red-500' : ''}
              />
              {errors['securitySettings.maxMonthlyTransactionAmount'] && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                  {errors['securitySettings.maxMonthlyTransactionAmount']}
                </p>
              )}
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>R$ 5.000</span>
                <span>R$ 200.000</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
              <ArrowUpDown className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              Limites de Aprovação
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Defina o valor acima do qual será necessária aprovação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label 
                htmlFor="transactionApprovalThreshold" 
                className={`text-gray-700 dark:text-gray-300 ${errors['securitySettings.transactionApprovalThreshold'] ? 'text-red-500 dark:text-red-400' : ''}`}
              >
                Limite para Aprovação Automática (R$)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  id="transactionApprovalThreshold"
                  value={formData.securitySettings?.transactionApprovalThreshold?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || ''}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, '');
                    const value = numericValue ? parseInt(numericValue, 10) / 100 : 0;
                    updateFormField('securitySettings.transactionApprovalThreshold', value);
                  }}
                  className={`pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 ${
                    errors['securitySettings.transactionApprovalThreshold'] ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' : ''
                  }`}
                  placeholder="0,00"
                />
              </div>
              {errors['securitySettings.transactionApprovalThreshold'] ? (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                  {errors['securitySettings.transactionApprovalThreshold']}
                </p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Transações acima deste valor exigirão aprovação manual.
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Permitir exceder limite em caso de emergência
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Permite aprovação especial para exceder o limite em situações de emergência
                </p>
              </div>
              <Switch 
                checked={formData.allowEmergencyOverride || false}
                onCheckedChange={(checked) => updateFormField('allowEmergencyOverride', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {(errors['creditLimit'] || errors['availableBalance'] || 
        errors['securitySettings.maxDailyTransactionAmount'] || 
        errors['securitySettings.maxMonthlyTransactionAmount'] ||
        errors['securitySettings.transactionApprovalThreshold']) && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-200">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-medium">Problemas com os limites</p>
              <p className="mt-1 text-sm">
                Verifique os valores de limite informados. Certifique-se de que o limite diário não seja maior que o limite mensal
                e que o saldo disponível não seja maior que o limite de crédito.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};