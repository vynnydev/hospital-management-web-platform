/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/organisms/dialog';
import { Calendar } from '@/components/ui/organisms/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/organisms/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLogsFilterDialogProps {
  logsFilter: {
    startDate: string;
    endDate: string;
    userId: string;
    action: string;
    severity: string;
    category: string;
    result: string;
    search: string;
  };
  setLogsFilter: React.Dispatch<React.SetStateAction<any>>;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange: React.Dispatch<React.SetStateAction<{
    from: Date | undefined;
    to: Date | undefined;
  }>>;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onCancel: () => void;
}

export const AuditLogsFilterDialog: React.FC<AuditLogsFilterDialogProps> = ({
  logsFilter,
  setLogsFilter,
  dateRange,
  setDateRange,
  onApplyFilters,
  onClearFilters,
  onCancel
}) => {
  return (
    <DialogContent className="sm:max-w-[550px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-gray-900 dark:text-white">Filtrar Logs de Auditoria</DialogTitle>
        <DialogDescription className="text-gray-500 dark:text-gray-400">
          Configure os filtros para refinar sua busca de logs.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">Período</Label>
          <div className="flex flex-col sm:flex-row items-start gap-2">
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal w-full sm:w-[220px] border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'dd/MM/yyyy')} -{' '}
                          {format(dateRange.to, 'dd/MM/yyyy')}
                        </>
                      ) : (
                        format(dateRange.from, 'dd/MM/yyyy')
                      )
                    ) : (
                      <span>Selecione um período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                    numberOfMonths={2}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDateRange({ from: undefined, to: undefined })}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Limpar
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filterSeverity" className="text-gray-700 dark:text-gray-300">Severidade</Label>
            <Select
              value={logsFilter.severity}
              onValueChange={(value) => setLogsFilter({...logsFilter, severity: value})}
            >
              <SelectTrigger id="filterSeverity" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectItem value="" className="text-gray-900 dark:text-white">Todas</SelectItem>
                <SelectItem value="info" className="text-gray-900 dark:text-white">Informação</SelectItem>
                <SelectItem value="warning" className="text-gray-900 dark:text-white">Aviso</SelectItem>
                <SelectItem value="error" className="text-gray-900 dark:text-white">Erro</SelectItem>
                <SelectItem value="critical" className="text-gray-900 dark:text-white">Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="filterCategory" className="text-gray-700 dark:text-gray-300">Categoria</Label>
            <Select
              value={logsFilter.category}
              onValueChange={(value) => setLogsFilter({...logsFilter, category: value})}
            >
              <SelectTrigger id="filterCategory" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectItem value="" className="text-gray-900 dark:text-white">Todas</SelectItem>
                <SelectItem value="authentication" className="text-gray-900 dark:text-white">Autenticação</SelectItem>
                <SelectItem value="data_access" className="text-gray-900 dark:text-white">Acesso a Dados</SelectItem>
                <SelectItem value="system_config" className="text-gray-900 dark:text-white">Config. do Sistema</SelectItem>
                <SelectItem value="patient_data" className="text-gray-900 dark:text-white">Dados de Pacientes</SelectItem>
                <SelectItem value="admin_action" className="text-gray-900 dark:text-white">Ações Administrativas</SelectItem>
                <SelectItem value="security" className="text-gray-900 dark:text-white">Segurança</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filterUser" className="text-gray-700 dark:text-gray-300">Usuário</Label>
            <Input
              id="filterUser"
              placeholder="Nome ou ID do usuário"
              value={logsFilter.userId}
              onChange={(e) => setLogsFilter({...logsFilter, userId: e.target.value})}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="filterAction" className="text-gray-700 dark:text-gray-300">Ação</Label>
            <Input
              id="filterAction"
              placeholder="Tipo de ação"
              value={logsFilter.action}
              onChange={(e) => setLogsFilter({...logsFilter, action: e.target.value})}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="filterResult" className="text-gray-700 dark:text-gray-300">Resultado</Label>
          <Select
            value={logsFilter.result}
            onValueChange={(value) => setLogsFilter({...logsFilter, result: value})}
          >
            <SelectTrigger id="filterResult" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectItem value="" className="text-gray-900 dark:text-white">Todos</SelectItem>
              <SelectItem value="success" className="text-gray-900 dark:text-white">Sucesso</SelectItem>
              <SelectItem value="failure" className="text-gray-900 dark:text-white">Falha</SelectItem>
              <SelectItem value="denied" className="text-gray-900 dark:text-white">Negado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <DialogFooter>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 w-full sm:w-auto">
          <Button 
            variant="ghost" 
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Cancelar
          </Button>
          <Button 
            variant="secondary"
            onClick={onClearFilters}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            Limpar Filtros
          </Button>
          <Button 
            onClick={onApplyFilters}
            className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
          >
            Aplicar Filtros
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};