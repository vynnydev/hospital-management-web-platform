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
    <Card className="bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="flex items-center text-gray-800 dark:text-gray-100">
          <PieChart className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Configurações de Orçamento
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Configure as regras de orçamento e alocação de recursos financeiros.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fiscalYearStartMonth" className="text-gray-700 dark:text-gray-300">Início do Ano Fiscal</Label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Select 
                  value={String(settings.fiscalYearStart.month)} 
                  onValueChange={(value) => onSettingChange('budget.fiscalYearStart.month', parseInt(value))}
                >
                  <SelectTrigger id="fiscalYearStartMonth" className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <SelectValue placeholder="Selecionar mês" className="text-gray-800 dark:text-gray-200" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <SelectItem value="1" className="text-gray-800 dark:text-gray-200">Janeiro</SelectItem>
                    <SelectItem value="2" className="text-gray-800 dark:text-gray-200">Fevereiro</SelectItem>
                    <SelectItem value="3" className="text-gray-800 dark:text-gray-200">Março</SelectItem>
                    <SelectItem value="4" className="text-gray-800 dark:text-gray-200">Abril</SelectItem>
                    <SelectItem value="5" className="text-gray-800 dark:text-gray-200">Maio</SelectItem>
                    <SelectItem value="6" className="text-gray-800 dark:text-gray-200">Junho</SelectItem>
                    <SelectItem value="7" className="text-gray-800 dark:text-gray-200">Julho</SelectItem>
                    <SelectItem value="8" className="text-gray-800 dark:text-gray-200">Agosto</SelectItem>
                    <SelectItem value="9" className="text-gray-800 dark:text-gray-200">Setembro</SelectItem>
                    <SelectItem value="10" className="text-gray-800 dark:text-gray-200">Outubro</SelectItem>
                    <SelectItem value="11" className="text-gray-800 dark:text-gray-200">Novembro</SelectItem>
                    <SelectItem value="12" className="text-gray-800 dark:text-gray-200">Dezembro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-24">
                <Select 
                  value={String(settings.fiscalYearStart.day)} 
                  onValueChange={(value) => onSettingChange('budget.fiscalYearStart.day', parseInt(value))}
                >
                  <SelectTrigger id="fiscalYearStartDay" className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <SelectValue placeholder="Dia" className="text-gray-800 dark:text-gray-200" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <SelectItem key={day} value={String(day)} className="text-gray-800 dark:text-gray-200">{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budgetReviewFrequency" className="text-gray-700 dark:text-gray-300">Frequência de Revisão do Orçamento</Label>
            <Select 
              value={settings.budgetReviewFrequency} 
              onValueChange={(value) => onSettingChange('budget.budgetReviewFrequency', value as 'monthly' | 'quarterly' | 'biannual')}
            >
              <SelectTrigger id="budgetReviewFrequency" className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Selecionar frequência" className="text-gray-800 dark:text-gray-200" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectItem value="monthly" className="text-gray-800 dark:text-gray-200">Mensal</SelectItem>
                <SelectItem value="quarterly" className="text-gray-800 dark:text-gray-200">Trimestral</SelectItem>
                <SelectItem value="biannual" className="text-gray-800 dark:text-gray-200">Semestral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Separator className="bg-gray-200 dark:bg-gray-600" />
        
        <h4 className="font-medium mb-4 text-gray-800 dark:text-gray-200">Alocação de Orçamento Departamental</h4>
        <ScrollArea className="h-[200px] rounded-md border border-gray-200 dark:border-gray-700">
          <div className="p-4 space-y-4">
            {settings.defaultDepartmentalAllocations.map((allocation, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                <div className="flex-1">
                  <Select 
                    value={allocation.departmentId} 
                    onValueChange={(value) => handleUpdateDepartment(index, 'departmentId', value)}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Selecionar departamento" className="text-gray-800 dark:text-gray-200" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                      <SelectItem value="UTI" className="text-gray-800 dark:text-gray-200">UTI</SelectItem>
                      <SelectItem value="Enfermaria" className="text-gray-800 dark:text-gray-200">Enfermaria</SelectItem>
                      <SelectItem value="Centro Cirúrgico" className="text-gray-800 dark:text-gray-200">Centro Cirúrgico</SelectItem>
                      <SelectItem value="Emergência" className="text-gray-800 dark:text-gray-200">Emergência</SelectItem>
                      <SelectItem value="Ambulatório" className="text-gray-800 dark:text-gray-200">Ambulatório</SelectItem>
                      <SelectItem value="Laboratório" className="text-gray-800 dark:text-gray-200">Laboratório</SelectItem>
                      <SelectItem value="Radiologia" className="text-gray-800 dark:text-gray-200">Radiologia</SelectItem>
                      <SelectItem value="Farmácia" className="text-gray-800 dark:text-gray-200">Farmácia</SelectItem>
                      <SelectItem value="Administrativo" className="text-gray-800 dark:text-gray-200">Administrativo</SelectItem>
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
                      className="text-right bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                    />
                    <span className="ml-1 text-gray-800 dark:text-gray-200">%</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
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
            className="mt-2 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            onClick={handleAddDepartment}
          >
            Adicionar Departamento
          </Button>
          
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Total alocado:</span>{" "}
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
        
        <Separator className="bg-gray-200 dark:bg-gray-600" />
        
        <h4 className="font-medium mb-4 text-gray-800 dark:text-gray-200">Limites para Alertas Orçamentários</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="underBudgetThreshold" className="text-gray-700 dark:text-gray-300">Alerta de Subutilização (%)</Label>
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
              <span className="w-12 text-center text-gray-800 dark:text-gray-200">
                {settings.thresholdForAlerts.underBudget}%
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Alerta quando o orçamento estiver abaixo desta porcentagem do planejado.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="overBudgetThreshold" className="text-gray-700 dark:text-gray-300">Alerta de Excesso (%)</Label>
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
              <span className="w-12 text-center text-gray-800 dark:text-gray-200">
                {settings.thresholdForAlerts.overBudget}%
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Alerta quando o orçamento exceder esta porcentagem do planejado.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};