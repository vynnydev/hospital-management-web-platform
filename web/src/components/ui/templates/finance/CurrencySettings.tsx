import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/organisms/card';
  import { Label } from '@/components/ui/organisms/label';
  import { Input } from '@/components/ui/organisms/input';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/organisms/select';
import { InfoIcon, Wallet } from 'lucide-react';
import { ICurrencySettings } from '@/types/finance-types';

interface CurrencySettingsProps {
  settings: ICurrencySettings;
  onSettingChange: (path: string, value: any) => void;
}

export const CurrencySettings: React.FC<CurrencySettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Configurações de Moeda
        </CardTitle>
        <CardDescription>
          Configure as opções de moeda e formatação de valores para relatórios e faturamento.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="currencyCode">Moeda</Label>
            <Select 
              value={settings.code} 
              onValueChange={(value) => onSettingChange('currency.code', value)}
            >
              <SelectTrigger id="currencyCode">
                <SelectValue placeholder="Selecionar moeda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
                <SelectItem value="GBP">Libra Esterlina (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currencySymbol">Símbolo</Label>
            <Input 
              id="currencySymbol" 
              value={settings.symbol}
              onChange={(e) => onSettingChange('currency.symbol', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="decimalSeparator">Separador decimal</Label>
            <Select 
              value={settings.decimalSeparator} 
              onValueChange={(value) => onSettingChange('currency.decimalSeparator', value)}
            >
              <SelectTrigger id="decimalSeparator">
                <SelectValue placeholder="Selecionar separador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=",">Vírgula (,)</SelectItem>
                <SelectItem value=".">Ponto (.)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="thousandsSeparator">Separador de milhares</Label>
            <Select 
              value={settings.thousandsSeparator} 
              onValueChange={(value) => onSettingChange('currency.thousandsSeparator', value)}
            >
              <SelectTrigger id="thousandsSeparator">
                <SelectValue placeholder="Selecionar separador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=".">Ponto (.)</SelectItem>
                <SelectItem value=",">Vírgula (,)</SelectItem>
                <SelectItem value=" ">Espaço ( )</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="decimalPlaces">Casas decimais</Label>
            <Select 
              value={String(settings.decimalPlaces)} 
              onValueChange={(value) => onSettingChange('currency.decimalPlaces', parseInt(value))}
            >
              <SelectTrigger id="decimalPlaces">
                <SelectValue placeholder="Selecionar casas decimais" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 casas</SelectItem>
                <SelectItem value="1">1 casa</SelectItem>
                <SelectItem value="2">2 casas</SelectItem>
                <SelectItem value="3">3 casas</SelectItem>
                <SelectItem value="4">4 casas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="symbolPosition">Posição do símbolo</Label>
            <Select 
              value={settings.symbolPosition} 
              onValueChange={(value) => onSettingChange('currency.symbolPosition', value as 'before' | 'after')}
            >
              <SelectTrigger id="symbolPosition">
                <SelectValue placeholder="Selecionar posição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="before">Antes do valor (ex: R$ 100,00)</SelectItem>
                <SelectItem value="after">Depois do valor (ex: 100,00 R$)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md mt-6">
          <h4 className="font-medium flex items-center text-blue-800 dark:text-blue-300 mb-2">
            <InfoIcon className="h-4 w-4 mr-2" />
            Pré-visualização
          </h4>
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Número simples:</span>
              <p className="text-lg font-medium">
                {settings.symbolPosition === 'before' ? settings.symbol : ''}
                1000
                {settings.decimalSeparator}
                {'0'.repeat(settings.decimalPlaces)}
                {settings.symbolPosition === 'after' ? ` ${settings.symbol}` : ''}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Número grande:</span>
              <p className="text-lg font-medium">
                {settings.symbolPosition === 'before' ? settings.symbol : ''}
                1000{settings.thousandsSeparator}000
                {settings.decimalSeparator}
                {'0'.repeat(settings.decimalPlaces)}
                {settings.symbolPosition === 'after' ? ` ${settings.symbol}` : ''}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};