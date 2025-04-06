/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Badge } from '@/components/ui/organisms/badge';
import { Checkbox } from '@/components/ui/organisms/checkbox';
import { Separator } from '@/components/ui/organisms/Separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/organisms/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/organisms/popover';
import { Calendar } from '@/components/ui/organisms/calendar';
import { 
  ChevronDown, 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  X, 
  CreditCard, 
  Tag,
  Building
} from 'lucide-react';
import { 
  ITransactionFilters, 
  TransactionStatus, 
  ExpenseCategory, 
  IPaymentCard 
} from '@/types/payment-types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TransactionFiltersProps {
  currentFilters: ITransactionFilters;
  onApplyFilters: (filters: ITransactionFilters) => void;
  onClearFilters: () => void;
  cards: IPaymentCard[];
  isOpen: boolean; // Added the missing isOpen property
  onClose: () => void;
  filters: ITransactionFilters;
  onChange: React.Dispatch<React.SetStateAction<ITransactionFilters>>;
  onApply: () => void;
  onClear: () => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  onDateRangeChange: React.Dispatch<React.SetStateAction<{ from: Date | undefined; to: Date | undefined }>>;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  currentFilters,
  onApplyFilters,
  onClearFilters,
  cards
}) => {
  const [filters, setFilters] = useState<ITransactionFilters>(currentFilters);
  const [dateType, setDateType] = useState<'range' | 'month' | 'custom'>('range');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Atualizar filtros locais quando os filtros externos mudarem
  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);
  
  // Função para atualizar um filtro
  const updateFilter = <K extends keyof ITransactionFilters>(
    key: K, 
    value: ITransactionFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Função para adicionar/remover um status do filtro
  const toggleStatusFilter = (status: TransactionStatus) => {
    setFilters(prev => {
      const currentStatuses = prev.status || [];
      const newStatuses = currentStatuses.includes(status)
        ? currentStatuses.filter(s => s !== status)
        : [...currentStatuses, status];
      
      return { ...prev, status: newStatuses };
    });
  };
  
  // Função para adicionar/remover uma categoria do filtro
  const toggleCategoryFilter = (category: ExpenseCategory) => {
    setFilters(prev => {
      const currentCategories = prev.categories || [];
      const newCategories = currentCategories.includes(category)
        ? currentCategories.filter(c => c !== category)
        : [...currentCategories, category];
      
      return { ...prev, categories: newCategories };
    });
  };
  
  // Função para adicionar/remover um cartão do filtro
  const toggleCardFilter = (cardId: string) => {
    setFilters(prev => {
      const currentCardIds = prev.cardIds || [];
      const newCardIds = currentCardIds.includes(cardId)
        ? currentCardIds.filter(id => id !== cardId)
        : [...currentCardIds, cardId];
      
      return { ...prev, cardIds: newCardIds };
    });
  };
  
  // Aplicar filtros
  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };
  
  // Limpar filtros
  const handleClearFilters = () => {
    setFilters({});
    onClearFilters();
  };
  
  // Função para aplicar presets de data
  const applyDatePreset = (preset: string) => {
    const now = new Date();
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    
    switch (preset) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date();
        break;
      case 'yesterday':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'thisWeek':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date();
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        break;
      case 'last3Months':
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 3);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date();
        break;
      default:
        startDate = undefined;
        endDate = undefined;
    }
    
    if (startDate && endDate) {
      setFilters(prev => ({
        ...prev,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      }));
      setDateType('range');
    }
  };
  
  // Função para formatar uma data para exibição
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };
  
  // Função para formatar o nome da categoria
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
  
  // Função para formatar o nome do status
  const formatStatus = (status: TransactionStatus) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'completed': return 'Concluída';
      case 'declined': return 'Recusada';
      case 'refunded': return 'Reembolsada';
      case 'under_review': return 'Em Análise';
      case 'requires_approval': return 'Aguardando Aprovação';
      case 'disputed': return 'Contestada';
      case 'canceled': return 'Cancelada';
      default: return status;
    }
  };
  
  // Função para obter a cor do badge de status
  const getStatusBadgeClass = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'declined':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'under_review':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'requires_approval':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'disputed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'canceled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  // Obter a lista de departamentos únicos dos cartões
  const departments = Array.from(new Set(
    cards
      .filter(card => card.departmentId && card.departmentName)
      .map(card => ({ id: card.departmentId, name: card.departmentName }))
  ));
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Filtros de Transação
          </h3>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="flex items-center bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
          >
            {showAdvancedFilters ? 'Ocultar Avançados' : 'Filtros Avançados'}
            <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${showAdvancedFilters ? 'transform rotate-180' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtro por Período */}
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">Período</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="col-span-2">
              <Select
                value={dateType}
                onValueChange={(value) => setDateType(value as 'range' | 'month' | 'custom')}
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Tipo de data" className="text-gray-800 dark:text-gray-200" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectItem value="range" className="text-gray-800 dark:text-gray-200">Período</SelectItem>
                  <SelectItem value="month" className="text-gray-800 dark:text-gray-200">Mês Específico</SelectItem>
                  <SelectItem value="custom" className="text-gray-800 dark:text-gray-200">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2">
              <Select 
                onValueChange={applyDatePreset}
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Presets" className="text-gray-800 dark:text-gray-200" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectItem value="today" className="text-gray-800 dark:text-gray-200">Hoje</SelectItem>
                  <SelectItem value="yesterday" className="text-gray-800 dark:text-gray-200">Ontem</SelectItem>
                  <SelectItem value="thisWeek" className="text-gray-800 dark:text-gray-200">Esta Semana</SelectItem>
                  <SelectItem value="thisMonth" className="text-gray-800 dark:text-gray-200">Este Mês</SelectItem>
                  <SelectItem value="lastMonth" className="text-gray-800 dark:text-gray-200">Mês Passado</SelectItem>
                  <SelectItem value="last3Months" className="text-gray-800 dark:text-gray-200">Últimos 3 Meses</SelectItem>
                  <SelectItem value="thisYear" className="text-gray-800 dark:text-gray-200">Este Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {filters.startDate 
                      ? formatDate(filters.startDate)
                      : "Data inicial"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <Calendar
                    mode="single"
                    selected={filters.startDate ? new Date(filters.startDate) : undefined}
                    onSelect={(date) => updateFilter('startDate', date?.toISOString())}
                    initialFocus
                    className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {filters.endDate 
                      ? formatDate(filters.endDate)
                      : "Data final"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <Calendar
                    mode="single"
                    selected={filters.endDate ? new Date(filters.endDate) : undefined}
                    onSelect={(date) => updateFilter('endDate', date?.toISOString())}
                    initialFocus
                    className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        {/* Filtro por Valor */}
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">Valor</Label>
          
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Valor mínimo"
                value={filters.minAmount ?? ''}
                onChange={(e) => updateFilter('minAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
              />
            </div>
            
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Valor máximo"
                value={filters.maxAmount ?? ''}
                onChange={(e) => updateFilter('maxAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
        </div>
        
        {/* Filtro por Status */}
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">Status</Label>
          
          <div className="flex flex-wrap gap-2">
            {(['completed', 'pending', 'declined', 'refunded', 'under_review', 'requires_approval', 'disputed', 'canceled'] as TransactionStatus[]).map((status) => (
              <Badge
                key={status}
                className={`cursor-pointer ${
                  filters.status?.includes(status)
                    ? getStatusBadgeClass(status)
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}
                onClick={() => toggleStatusFilter(status)}
              >
                {formatStatus(status)}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Filtros Avançados */}
      {showAdvancedFilters && (
        <>
          <Separator className="my-4 bg-gray-200 dark:bg-gray-600" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Texto */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Busca por Texto</Label>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Buscar por descrição ou referência"
                  value={filters.merchantSearch ?? ''}
                  onChange={(e) => updateFilter('merchantSearch', e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
            
            {/* Filtro por Cartão */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Cartões</Label>
              
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-2">
                {cards.map((card) => (
                  <div key={card.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`card-${card.id}`} 
                      checked={filters.cardIds?.includes(card.id)}
                      onCheckedChange={() => toggleCardFilter(card.id)}
                      className="border-gray-300 dark:border-gray-500"
                    />
                    <Label 
                      htmlFor={`card-${card.id}`}
                      className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      {card.cardHolderName} ({card.lastFourDigits})
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Filtro por Categoria */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Categorias</Label>
              
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-2">
                {(['medical_supplies', 'pharmaceuticals', 'equipment', 'office_supplies', 'utilities', 'travel', 'meals', 'consulting', 'software', 'training', 'other'] as ExpenseCategory[]).map((category) => (
                  <Badge
                    key={category}
                    className={`cursor-pointer ${
                      filters.categories?.includes(category)
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                    onClick={() => toggleCategoryFilter(category)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {formatCategory(category)}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Filtro por Departamento */}
            {departments.length > 0 && (
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Departamentos</Label>
                
                <Select
                  value={filters.departmentIds?.[0] || ''}
                  onValueChange={(value) => updateFilter('departmentIds', value ? [value] : undefined)}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <SelectValue placeholder="Selecionar departamento" className="text-gray-800 dark:text-gray-200" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <SelectItem value="" className="text-gray-800 dark:text-gray-200">Todos os departamentos</SelectItem>
                    {departments.map((dept: any) => (
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
              </div>
            )}
          </div>
        </>
      )}
      
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleApplyFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};