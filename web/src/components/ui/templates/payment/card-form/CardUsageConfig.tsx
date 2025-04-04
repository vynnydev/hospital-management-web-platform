/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Label } from '@/components/ui/organisms/label';
import { Input } from '@/components/ui/organisms/input';
import { Button } from '@/components/ui/organisms/button';
import { Badge } from '@/components/ui/organisms/badge';
import { Checkbox } from '@/components/ui/organisms/checkbox';
import { Separator } from '@/components/ui/organisms/Separator';
import {
  ShoppingBag,
  Clock,
  Calendar,
  Ban,
  Plus,
  X,
  MapPin,
  Store,
  Search
} from 'lucide-react';
import { IPaymentCard, ExpenseCategory } from '@/types/payment-types';

interface CardUsageConfigProps {
  formData: Partial<IPaymentCard>;
  updateFormField: (path: string, value: any) => void;
  errors: Record<string, string>;
}

export const CardUsageConfig: React.FC<CardUsageConfigProps> = ({
  formData,
  updateFormField,
  errors
}) => {
  const [newMerchant, setNewMerchant] = useState('');
  const [newGeoRestriction, setNewGeoRestriction] = useState({
    type: 'country',
    value: '',
    allowed: true
  });
  
  // Lista de categorias de despesas disponíveis
  const expenseCategories: {id: ExpenseCategory; label: string}[] = [
    { id: 'medical_supplies' as ExpenseCategory, label: 'Materiais Médicos' },
    { id: 'pharmaceuticals'  as ExpenseCategory, label: 'Medicamentos' },
    { id: 'equipment' as ExpenseCategory, label: 'Equipamentos' },
    { id: 'office_supplies' as ExpenseCategory, label: 'Material de Escritório' },
    { id: 'utilities' as ExpenseCategory, label: 'Serviços Públicos' },
    { id: 'travel' as ExpenseCategory, label: 'Viagens' },
    { id: 'meals' as ExpenseCategory, label: 'Refeições' },
    { id: 'consulting' as ExpenseCategory, label: 'Consultoria' },
    { id: 'software' as ExpenseCategory, label: 'Software' },
    { id: 'training' as ExpenseCategory, label: 'Treinamento' },
    { id: 'other' as ExpenseCategory, label: 'Outros' },
  ];
  
  // Dias da semana
  const weekDays = [
    { id: 0, name: 'Domingo', abbr: 'Dom' },
    { id: 1, name: 'Segunda-feira', abbr: 'Seg' },
    { id: 2, name: 'Terça-feira', abbr: 'Ter' },
    { id: 3, name: 'Quarta-feira', abbr: 'Qua' },
    { id: 4, name: 'Quinta-feira', abbr: 'Qui' },
    { id: 5, name: 'Sexta-feira', abbr: 'Sex' },
    { id: 6, name: 'Sábado', abbr: 'Sáb' },
  ];
  
  // Obter as restrições atuais do formulário ou valores padrão
  const usageRestrictions = formData.usageRestrictions || {
    allowedCategories: [],
    restrictedMerchants: [],
    allowedDaysOfWeek: [1, 2, 3, 4, 5],
    allowedTimeStart: undefined,
    allowedTimeEnd: undefined,
    geographicRestrictions: []
  };
  
  // Manipuladores de eventos
  const handleCategoryToggle = (category: ExpenseCategory) => {
    const currentCategories = [...(usageRestrictions.allowedCategories || [])];
    const isSelected = currentCategories.includes(category);
    
    if (isSelected) {
      const updatedCategories = currentCategories.filter(c => c !== category);
      updateFormField('usageRestrictions.allowedCategories', updatedCategories);
    } else {
      updateFormField('usageRestrictions.allowedCategories', [...currentCategories, category]);
    }
  };
  
  const handleDayToggle = (day: number) => {
    const currentDays = [...(usageRestrictions.allowedDaysOfWeek || [])];
    const isSelected = currentDays.includes(day);
    
    if (isSelected) {
      const updatedDays = currentDays.filter(d => d !== day);
      updateFormField('usageRestrictions.allowedDaysOfWeek', updatedDays);
    } else {
      updateFormField('usageRestrictions.allowedDaysOfWeek', [...currentDays, day].sort());
    }
  };
  
  const handleAddMerchant = () => {
    if (!newMerchant.trim()) return;
    
    const currentMerchants = [...(usageRestrictions.restrictedMerchants || [])];
    if (!currentMerchants.includes(newMerchant)) {
      updateFormField('usageRestrictions.restrictedMerchants', [...currentMerchants, newMerchant]);
      setNewMerchant('');
    }
  };
  
  const handleRemoveMerchant = (merchant: string) => {
    const currentMerchants = [...(usageRestrictions.restrictedMerchants || [])];
    const updatedMerchants = currentMerchants.filter(m => m !== merchant);
    updateFormField('usageRestrictions.restrictedMerchants', updatedMerchants);
  };
  
  const handleAddGeoRestriction = () => {
    if (!newGeoRestriction.value.trim()) return;
    
    const currentRestrictions = [...(usageRestrictions.geographicRestrictions || [])];
    updateFormField('usageRestrictions.geographicRestrictions', [...currentRestrictions, newGeoRestriction]);
    
    setNewGeoRestriction({
      type: 'country',
      value: '',
      allowed: true
    });
  };
  
  const handleRemoveGeoRestriction = (index: number) => {
    const currentRestrictions = [...(usageRestrictions.geographicRestrictions || [])];
    currentRestrictions.splice(index, 1);
    updateFormField('usageRestrictions.geographicRestrictions', currentRestrictions);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Categorias de Despesa Permitidas
        </h3>
        
        <div className="mb-2">
          <Label className={`text-gray-700 dark:text-gray-300 ${errors['usageRestrictions.allowedCategories'] ? 'text-red-500 dark:text-red-400' : ''}`}>
            Selecione as categorias permitidas para este cartão
          </Label>
          {errors['usageRestrictions.allowedCategories'] && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-1">
              {errors['usageRestrictions.allowedCategories']}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
          {expenseCategories.map((category) => (
            <div
              key={category.id}
              className={`flex items-center p-3 rounded-lg border ${
                usageRestrictions.allowedCategories?.includes(category.id)
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              } cursor-pointer hover:shadow-sm transition-all duration-150`}
              onClick={() => handleCategoryToggle(category.id)}
            >
              <Checkbox
                id={`category-${category.id}`}
                checked={usageRestrictions.allowedCategories?.includes(category.id) || false}
                onCheckedChange={() => handleCategoryToggle(category.id)}
                className="border-gray-300 dark:border-gray-600 mr-2"
              />
              <Label
                htmlFor={`category-${category.id}`}
                className={`cursor-pointer ${
                  usageRestrictions.allowedCategories?.includes(category.id)
                    ? 'text-blue-700 dark:text-blue-300 font-medium'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
      
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Restrições de Tempo
        </h3>
        
        <div className="space-y-6">
          <div>
            <Label className="text-gray-700 dark:text-gray-300 mb-3 block">
              Dias da Semana Permitidos
            </Label>
            
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => (
                <Badge
                  key={day.id}
                  variant="outline"
                  className={`cursor-pointer px-3 py-1 ${
                    usageRestrictions.allowedDaysOfWeek?.includes(day.id)
                      ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 hover:bg-green-200 hover:text-green-900 dark:hover:bg-green-900/50'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleDayToggle(day.id)}
                >
                  {day.name}
                </Badge>
              ))}
            </div>
            
            {errors['usageRestrictions.allowedDaysOfWeek'] && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-2">
                {errors['usageRestrictions.allowedDaysOfWeek']}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="allowedTimeStart" className="text-gray-700 dark:text-gray-300">
                Horário Inicial Permitido
              </Label>
              <Input
                id="allowedTimeStart"
                type="time"
                value={usageRestrictions.allowedTimeStart || ''}
                onChange={(e) => updateFormField('usageRestrictions.allowedTimeStart', e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Deixe em branco para permitir qualquer horário
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="allowedTimeEnd" className="text-gray-700 dark:text-gray-300">
                Horário Final Permitido
              </Label>
              <Input
                id="allowedTimeEnd"
                type="time"
                value={usageRestrictions.allowedTimeEnd || ''}
                onChange={(e) => updateFormField('usageRestrictions.allowedTimeEnd', e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Deixe em branco para permitir qualquer horário
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
      
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Estabelecimentos Restritos
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                placeholder="Nome do estabelecimento para bloquear"
                value={newMerchant}
                onChange={(e) => setNewMerchant(e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
              />
            </div>
            <Button
              type="button"
              onClick={handleAddMerchant}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
          
          <div className="mt-3">
            {usageRestrictions.restrictedMerchants?.length ? (
              <div className="flex flex-wrap gap-2">
                {usageRestrictions.restrictedMerchants.map((merchant, index) => (
                  <Badge
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 flex items-center"
                  >
                    <Store className="h-3 w-3 mr-1" />
                    {merchant}
                    <X
                      className="h-3 w-3 ml-2 cursor-pointer hover:text-red-900 dark:hover:text-red-200"
                      onClick={() => handleRemoveMerchant(merchant)}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                Nenhum estabelecimento restrito adicionado
              </p>
            )}
          </div>
        </div>
      </div>
      
      <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
      
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Restrições Geográficas
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-1">
              <Label htmlFor="geoRestrictionType" className="text-gray-700 dark:text-gray-300">
                Tipo
              </Label>
              <select
                id="geoRestrictionType"
                value={newGeoRestriction.type}
                onChange={(e) => setNewGeoRestriction({ ...newGeoRestriction, type: e.target.value as any })}
                className="w-full rounded-md px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value="country">País</option>
                <option value="region">Região</option>
                <option value="city">Cidade</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="geoRestrictionValue" className="text-gray-700 dark:text-gray-300">
                Local
              </Label>
              <Input
                id="geoRestrictionValue"
                placeholder={
                  newGeoRestriction.type === 'country' ? 'Nome do país' :
                  newGeoRestriction.type === 'region' ? 'Nome da região/estado' : 'Nome da cidade'
                }
                value={newGeoRestriction.value}
                onChange={(e) => setNewGeoRestriction({ ...newGeoRestriction, value: e.target.value })}
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
              />
            </div>
            
            <div className="md:col-span-1">
              <Label htmlFor="geoRestrictionAllowed" className="text-gray-700 dark:text-gray-300">
                Status
              </Label>
              <select
                id="geoRestrictionAllowed"
                value={newGeoRestriction.allowed ? 'allowed' : 'blocked'}
                onChange={(e) => setNewGeoRestriction({ 
                  ...newGeoRestriction, 
                  allowed: e.target.value === 'allowed' 
                })}
                className="w-full rounded-md px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value="allowed">Permitido</option>
                <option value="blocked">Bloqueado</option>
              </select>
            </div>
          </div>
          
          <Button
            type="button"
            onClick={handleAddGeoRestriction}
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Restrição
          </Button>
          
          <div className="mt-3">
            {usageRestrictions.geographicRestrictions?.length ? (
              <div className="space-y-2">
                {usageRestrictions.geographicRestrictions.map((restriction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-800 dark:text-gray-200 mr-2">
                          {restriction.value}
                        </span>
                        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {restriction.type === 'country' ? 'País' : 
                           restriction.type === 'region' ? 'Região' : 'Cidade'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Badge
                        className={restriction.allowed 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 mr-3' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 mr-3'
                        }
                      >
                        {restriction.allowed ? 'Permitido' : 'Bloqueado'}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveGeoRestriction(index)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                Nenhuma restrição geográfica adicionada
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-md text-blue-800 dark:text-blue-200">
        <div className="flex">
          <ShoppingBag className="h-5 w-5 mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="font-medium">Dica para restrições</p>
            <p className="mt-1 text-sm">
              Defina cuidadosamente as restrições de uso para garantir o controle adequado das despesas.
              Configurações muito restritivas podem impedir o uso legítimo do cartão, enquanto configurações
              muito permissivas podem não proporcionar a segurança necessária.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};