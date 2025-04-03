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
    <Card className="bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="flex items-center text-gray-800 dark:text-gray-100">
          <Wallet className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Configurações de Moeda
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Configure as opções de moeda e formatação de valores para relatórios e faturamento.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="currencyCode" className="text-gray-700 dark:text-gray-300">Moeda</Label>
            <Select 
              value={settings.code} 
              onValueChange={(value) => onSettingChange('currency.code', value)}
            >
              <SelectTrigger id="currencyCode" className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Selecionar moeda" className="text-gray-800 dark:text-gray-200" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectItem value="BRL" className="text-gray-800 dark:text-gray-200">Real Brasileiro (R$)</SelectItem>
                <SelectItem value="USD" className="text-gray-800 dark:text-gray-200">Dólar Americano ($)</SelectItem>
                <SelectItem value="EUR" className="text-gray-800 dark:text-gray-200">Euro (€)</SelectItem>
                <SelectItem value="GBP" className="text-gray-800 dark:text-gray-200">Libra Esterlina (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currencySymbol" className="text-gray-700 dark:text-gray-300">Símbolo</Label>
            <Input 
              id="currencySymbol" 
              value={settings.symbol}
              onChange={(e) => onSettingChange('currency.symbol', e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="decimalSeparator" className="text-gray-700 dark:text-gray-300">Separador decimal</Label>
            <Select 
              value={settings.decimalSeparator} 
              onValueChange={(value) => onSettingChange('currency.decimalSeparator', value)}
            >
              <SelectTrigger id="decimalSeparator" className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Selecionar separador" className="text-gray-800 dark:text-gray-200" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectItem value="," className="text-gray-800 dark:text-gray-200">Vírgula (,)</SelectItem>
                <SelectItem value="." className="text-gray-800 dark:text-gray-200">Ponto (.)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="thousandsSeparator" className="text-gray-700 dark:text-gray-300">Separador de milhares</Label>
            <Select 
              value={settings.thousandsSeparator} 
              onValueChange={(value) => onSettingChange('currency.thousandsSeparator', value)}
            >
              <SelectTrigger id="thousandsSeparator" className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Selecionar separador" className="text-gray-800 dark:text-gray-200" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectItem value="." className="text-gray-800 dark:text-gray-200">Ponto (.)</SelectItem>
                <SelectItem value="," className="text-gray-800 dark:text-gray-200">Vírgula (,)</SelectItem>
                <SelectItem value=" " className="text-gray-800 dark:text-gray-200">Espaço ( )</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="decimalPlaces" className="text-gray-700 dark:text-gray-300">Casas decimais</Label>
            <Select 
              value={String(settings.decimalPlaces)} 
              onValueChange={(value) => onSettingChange('currency.decimalPlaces', parseInt(value))}
            >
              <SelectTrigger id="decimalPlaces" className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Selecionar casas decimais" className="text-gray-800 dark:text-gray-200" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectItem value="0" className="text-gray-800 dark:text-gray-200">0 casas</SelectItem>
                <SelectItem value="1" className="text-gray-800 dark:text-gray-200">1 casa</SelectItem>
                <SelectItem value="2" className="text-gray-800 dark:text-gray-200">2 casas</SelectItem>
                <SelectItem value="3" className="text-gray-800 dark:text-gray-200">3 casas</SelectItem>
                <SelectItem value="4" className="text-gray-800 dark:text-gray-200">4 casas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="symbolPosition" className="text-gray-700 dark:text-gray-300">Posição do símbolo</Label>
            <Select 
              value={settings.symbolPosition} 
              onValueChange={(value) => onSettingChange('currency.symbolPosition', value as 'before' | 'after')}
            >
              <SelectTrigger id="symbolPosition" className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Selecionar posição" className="text-gray-800 dark:text-gray-200" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectItem value="before" className="text-gray-800 dark:text-gray-200">Antes do valor (ex: R$ 100,00)</SelectItem>
                <SelectItem value="after" className="text-gray-800 dark:text-gray-200">Depois do valor (ex: 100,00 R$)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md mt-6">
          <h4 className="font-medium flex items-center text-blue-800 dark:text-blue-300 mb-2">
            <InfoIcon className="h-4 w-4 mr-2" />
            Pré-visualização
          </h4>
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm border border-gray-100 dark:border-gray-600">
              <span className="text-sm text-gray-500 dark:text-gray-400">Número simples:</span>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                {settings.symbolPosition === 'before' ? settings.symbol : ''}
                1000
                {settings.decimalSeparator}
                {'0'.repeat(settings.decimalPlaces)}
                {settings.symbolPosition === 'after' ? ` ${settings.symbol}` : ''}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm border border-gray-100 dark:border-gray-600">
              <span className="text-sm text-gray-500 dark:text-gray-400">Número grande:</span>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
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