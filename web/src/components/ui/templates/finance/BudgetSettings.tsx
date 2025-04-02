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
  import { Button } from '@/components/ui/organisms/button';
  import { Separator } from '@/components/ui/organisms/Separator';
  import { ScrollArea } from '@/components/ui/organisms/scroll-area';
  import { Slider } from '@/components/ui/organisms/slider';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/organisms/select';
import { AlertTriangle, PieChart } from 'lucide-react';
import { IBudgetSettings } from '@/types/finance-types';

interface BudgetSettingsProps {
  settings: IBudgetSettings;
  onSettingChange: (path: string, value: any) => void;
}

export const BudgetSettings: React.FC<BudgetSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  // Função para adicionar uma nova alocação departamental
  const handleAddDepartment = () => {
    const allocations = [...settings.defaultDepartmentalAllocations];
    allocations.push({
      departmentId: "Novo Departamento",
      percentage: 0
    });
    onSettingChange('budget.defaultDepartmentalAllocations', allocations);
  };

  // Função para remover uma alocação departamental
  const handleRemoveDepartment = (index: number) => {
    const allocations = [...settings.defaultDepartmentalAllocations];
    allocations.splice(index, 1);
    onSettingChange('budget.defaultDepartmentalAllocations', allocations);
  };

  // Função para atualizar uma alocação departamental
  const handleUpdateDepartment = (index: number, field: string, value: any) => {
    const allocations = [...settings.defaultDepartmentalAllocations];
    allocations[index] = {
      ...allocations[index],
      [field]: value
    };
    onSettingChange('budget.defaultDepartmentalAllocations', allocations);
  };

  // Calcula o total de alocação percentual
  const totalAllocation = settings.defaultDepartmentalAllocations.reduce(
    (sum, item) => sum + item.percentage, 0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Configurações de Orçamento
        </CardTitle>
        <CardDescription>
          Configure as regras de orçamento e alocação de recursos financeiros.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fiscalYearStartMonth">Início do Ano Fiscal</Label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Select 
                  value={String(settings.fiscalYearStart.month)} 
                  onValueChange={(value) => onSettingChange('budget.fiscalYearStart.month', parseInt(value))}
                >
                  <SelectTrigger id="fiscalYearStartMonth">
                    <SelectValue placeholder="Selecionar mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Janeiro</SelectItem>
                    <SelectItem value="2">Fevereiro</SelectItem>
                    <SelectItem value="3">Março</SelectItem>
                    <SelectItem value="4">Abril</SelectItem>
                    <SelectItem value="5">Maio</SelectItem>
                    <SelectItem value="6">Junho</SelectItem>
                    <SelectItem value="7">Julho</SelectItem>
                    <SelectItem value="8">Agosto</SelectItem>
                    <SelectItem value="9">Setembro</SelectItem>
                    <SelectItem value="10">Outubro</SelectItem>
                    <SelectItem value="11">Novembro</SelectItem>
                    <SelectItem value="12">Dezembro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-24">
                <Select 
                  value={String(settings.fiscalYearStart.day)} 
                  onValueChange={(value) => onSettingChange('budget.fiscalYearStart.day', parseInt(value))}
                >
                  <SelectTrigger id="fiscalYearStartDay">
                    <SelectValue placeholder="Dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <SelectItem key={day} value={String(day)}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budgetReviewFrequency">Frequência de Revisão do Orçamento</Label>
            <Select 
              value={settings.budgetReviewFrequency} 
              onValueChange={(value) => onSettingChange('budget.budgetReviewFrequency', value as 'monthly' | 'quarterly' | 'biannual')}
            >
              <SelectTrigger id="budgetReviewFrequency">
                <SelectValue placeholder="Selecionar frequência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="quarterly">Trimestral</SelectItem>
                <SelectItem value="biannual">Semestral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Separator />
        
        <h4 className="font-medium mb-4">Alocação de Orçamento Departamental</h4>
        <ScrollArea className="h-[200px] rounded-md border">
          <div className="p-4 space-y-4">
            {settings.defaultDepartmentalAllocations.map((allocation, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <Select 
                    value={allocation.departmentId} 
                    onValueChange={(value) => handleUpdateDepartment(index, 'departmentId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTI">UTI</SelectItem>
                      <SelectItem value="Enfermaria">Enfermaria</SelectItem>
                      <SelectItem value="Centro Cirúrgico">Centro Cirúrgico</SelectItem>
                      <SelectItem value="Emergência">Emergência</SelectItem>
                      <SelectItem value="Ambulatório">Ambulatório</SelectItem>
                      <SelectItem value="Laboratório">Laboratório</SelectItem>
                      <SelectItem value="Radiologia">Radiologia</SelectItem>
                      <SelectItem value="Farmácia">Farmácia</SelectItem>
                      <SelectItem value="Administrativo">Administrativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-32">
                  <div className="flex items-center">
                    <Input 
                      type="number"
                      min={0}
                      max={100}
                      value={allocation.percentage}
                      onChange={(e) => handleUpdateDepartment(index, 'percentage', parseFloat(e.target.value))}
                      className="text-right"
                    />
                    <span className="ml-1">%</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/20"
                  onClick={() => handleRemoveDepartment(index)}
                >
                  <AlertTriangle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline"
            className="mt-2"
            onClick={handleAddDepartment}
          >
            Adicionar Departamento
          </Button>
          
          <div className="text-sm">
            <span className="font-medium">Total alocado:</span>{" "}
            <span className={
              totalAllocation === 100
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }>
              {totalAllocation}%
            </span>
            {totalAllocation !== 100 && (
              <span className="text-red-600 dark:text-red-400 ml-2">(Deve totalizar 100%)</span>
            )}
          </div>
        </div>
        
        <Separator />
        
        <h4 className="font-medium mb-4">Limites para Alertas Orçamentários</h4>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="underBudgetThreshold">Alerta de Subutilização (%)</Label>
            <div className="flex items-center space-x-4">
              <Slider 
                id="underBudgetThreshold"
                min={0}
                max={50}
                step={1}
                value={[settings.thresholdForAlerts.underBudget]}
                onValueChange={(value) => onSettingChange('budget.thresholdForAlerts.underBudget', value[0])}
                className="flex-1"
              />
              <span className="w-12 text-center">
                {settings.thresholdForAlerts.underBudget}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Alerta quando o orçamento estiver abaixo desta porcentagem do planejado.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="overBudgetThreshold">Alerta de Excesso (%)</Label>
            <div className="flex items-center space-x-4">
              <Slider 
                id="overBudgetThreshold"
                min={0}
                max={50}
                step={1}
                value={[settings.thresholdForAlerts.overBudget]}
                onValueChange={(value) => onSettingChange('budget.thresholdForAlerts.overBudget', value[0])}
                className="flex-1"
              />
              <span className="w-12 text-center">
                {settings.thresholdForAlerts.overBudget}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Alerta quando o orçamento exceder esta porcentagem do planejado.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};