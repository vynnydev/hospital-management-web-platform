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
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader>
        <DialogTitle>Filtrar Logs de Auditoria</DialogTitle>
        <DialogDescription>
          Configure os filtros para refinar sua busca de logs.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label>Período</Label>
          <div className="flex flex-col sm:flex-row items-start gap-2">
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal w-full sm:w-[220px]"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
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
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDateRange({ from: undefined, to: undefined })}
            >
              Limpar
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filterSeverity">Severidade</Label>
            <Select
              value={logsFilter.severity}
              onValueChange={(value) => setLogsFilter({...logsFilter, severity: value})}
            >
              <SelectTrigger id="filterSeverity">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="info">Informação</SelectItem>
                <SelectItem value="warning">Aviso</SelectItem>
                <SelectItem value="error">Erro</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="filterCategory">Categoria</Label>
            <Select
              value={logsFilter.category}
              onValueChange={(value) => setLogsFilter({...logsFilter, category: value})}
            >
              <SelectTrigger id="filterCategory">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="authentication">Autenticação</SelectItem>
                <SelectItem value="data_access">Acesso a Dados</SelectItem>
                <SelectItem value="system_config">Config. do Sistema</SelectItem>
                <SelectItem value="patient_data">Dados de Pacientes</SelectItem>
                <SelectItem value="admin_action">Ações Administrativas</SelectItem>
                <SelectItem value="security">Segurança</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filterUser">Usuário</Label>
            <Input
              id="filterUser"
              placeholder="Nome ou ID do usuário"
              value={logsFilter.userId}
              onChange={(e) => setLogsFilter({...logsFilter, userId: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="filterAction">Ação</Label>
            <Input
              id="filterAction"
              placeholder="Tipo de ação"
              value={logsFilter.action}
              onChange={(e) => setLogsFilter({...logsFilter, action: e.target.value})}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="filterResult">Resultado</Label>
          <Select
            value={logsFilter.result}
            onValueChange={(value) => setLogsFilter({...logsFilter, result: value})}
          >
            <SelectTrigger id="filterResult">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="success">Sucesso</SelectItem>
              <SelectItem value="failure">Falha</SelectItem>
              <SelectItem value="denied">Negado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <DialogFooter>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 w-full sm:w-auto">
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="secondary" onClick={onClearFilters}>
            Limpar Filtros
          </Button>
          <Button onClick={onApplyFilters}>
            Aplicar Filtros
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};