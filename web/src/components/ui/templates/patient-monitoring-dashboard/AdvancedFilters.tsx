/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/organisms/popover';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/organisms/select';

interface AdvancedFiltersProps {
  onFilterChange: (filters: Record<string, any>) => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    departments: [] as string[],
    status: [] as string[],
    dateRange: 'all',
    riskLevel: 'all'
  });

  const departments = ['UTI', 'Enfermaria', 'Centro Cirúrgico', 'Emergência'];
  const statuses = ['Aguardando Atendimento', 'Em Atendimento', 'Em Procedimento', 'Em Recuperação', 'Alta Pendente'];
  const riskLevels = ['Baixo', 'Moderado', 'Alto', 'Crítico'];

  const handleChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCheckboxChange = (key: string, value: string, checked: boolean) => {
    const newValues = checked
      ? [...filters[key as keyof typeof filters] as string[], value]
      : (filters[key as keyof typeof filters] as string[]).filter(v => v !== value);
    
    handleChange(key, newValues);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        >
          <Filter className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
          Filtros Avançados
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Filtros Avançados</h4>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Departamentos
            </label>
            <div className="grid grid-cols-2 gap-2">
              {departments.map(dept => (
                <div key={dept} className="flex items-center">
                  <input 
                    type="checkbox" 
                    id={`dept-${dept}`} 
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500" 
                    onChange={(e) => handleCheckboxChange('departments', dept, e.target.checked)}
                    checked={(filters.departments as string[]).includes(dept)}
                  />
                  <label htmlFor={`dept-${dept}`} className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {dept}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Status do Paciente
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statuses.map(status => (
                <div key={status} className="flex items-center">
                  <input 
                    type="checkbox" 
                    id={`status-${status}`} 
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500" 
                    onChange={(e) => handleCheckboxChange('status', status, e.target.checked)}
                    checked={(filters.status as string[]).includes(status)}
                  />
                  <label htmlFor={`status-${status}`} className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Período de Internação
            </label>
            <Select 
              value={filters.dateRange} 
              onValueChange={(value) => handleChange('dateRange', value)}
            >
              <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="yesterday">Ontem</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Nível de Risco
            </label>
            <Select 
              value={filters.riskLevel} 
              onValueChange={(value) => handleChange('riskLevel', value)}
            >
              <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Selecione o nível de risco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {riskLevels.map(level => (
                  <SelectItem key={level} value={level.toLowerCase()}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              const resetFilters = {
                departments: [],
                status: [],
                dateRange: 'all',
                riskLevel: 'all'
              };
              setFilters(resetFilters);
              onFilterChange(resetFilters);
            }}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
            Limpar
          </Button>
          <Button 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Aplicar Filtros
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};