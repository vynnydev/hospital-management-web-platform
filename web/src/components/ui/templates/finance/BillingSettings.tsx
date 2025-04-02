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
import { Checkbox } from '@/components/ui/organisms/checkbox';
import { Switch } from '@/components/ui/organisms/switch';
import { Separator } from '@/components/ui/organisms/Separator';
import { Slider } from '@/components/ui/organisms/slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/organisms/select';
import { AlertTriangle, CreditCard, FileText, InfoIcon } from 'lucide-react';
import { IPatientBillingSettings, IServiceCostSettings, TBillingCycle, TPaymentMethod } from '@/types/finance-types';

interface BillingSettingsProps {
  billingSettings: IPatientBillingSettings;
  costSettings: IServiceCostSettings;
  onSettingChange: (path: string, value: any) => void;
}

export const BillingSettings: React.FC<BillingSettingsProps> = ({
  billingSettings,
  costSettings,
  onSettingChange,
}) => {
  // Função para atualizar métodos de pagamento
  const handlePaymentMethodChange = (method: TPaymentMethod, checked: boolean) => {
    if (checked) {
      onSettingChange('patientBilling.acceptedPaymentMethods', [...billingSettings.acceptedPaymentMethods, method]);
    } else {
      onSettingChange(
        'patientBilling.acceptedPaymentMethods', 
        billingSettings.acceptedPaymentMethods.filter(m => m !== method)
      );
    }
  };

  // Função para adicionar novo nível de desconto por volume
  const handleAddVolumeDiscountThreshold = () => {
    const thresholds = [...billingSettings.discountSettings.volumeDiscountThresholds];
    thresholds.push({ amount: 0, discountRate: 0 });
    onSettingChange('patientBilling.discountSettings.volumeDiscountThresholds', thresholds);
  };

  // Função para remover nível de desconto por volume
  const handleRemoveVolumeDiscountThreshold = (index: number) => {
    const thresholds = [...billingSettings.discountSettings.volumeDiscountThresholds];
    thresholds.splice(index, 1);
    onSettingChange('patientBilling.discountSettings.volumeDiscountThresholds', thresholds);
  };

  // Função para atualizar um threshold específico de desconto por volume
  const handleUpdateVolumeDiscountThreshold = (index: number, field: 'amount' | 'discountRate', value: number) => {
    const thresholds = [...billingSettings.discountSettings.volumeDiscountThresholds];
    thresholds[index] = {
      ...thresholds[index],
      [field]: value
    };
    onSettingChange('patientBilling.discountSettings.volumeDiscountThresholds', thresholds);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Configurações de Faturamento
        </CardTitle>
        <CardDescription>
          Configure as opções de faturamento para pacientes e serviços.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="defaultBillingCycle">Ciclo de Faturamento Padrão</Label>
            <Select 
              value={billingSettings.defaultBillingCycle} 
              onValueChange={(value) => onSettingChange('patientBilling.defaultBillingCycle', value as TBillingCycle)}
            >
              <SelectTrigger id="defaultBillingCycle">
                <SelectValue placeholder="Selecionar ciclo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="procedure">Por Procedimento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaultPaymentTerms">Prazo de Pagamento Padrão (dias)</Label>
            <Input 
              id="defaultPaymentTerms" 
              type="number"
              min={0}
              max={120}
              value={billingSettings.defaultPaymentTerms}
              onChange={(e) => onSettingChange('patientBilling.defaultPaymentTerms', parseInt(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="automaticBillingEnabled">Faturamento Automático</Label>
              <Switch 
                id="automaticBillingEnabled" 
                checked={billingSettings.automaticBillingEnabled}
                onCheckedChange={(checked) => onSettingChange('patientBilling.automaticBillingEnabled', checked)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Gera faturas automaticamente de acordo com o ciclo definido.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sendPaymentReminders">Enviar Lembretes de Pagamento</Label>
              <Switch 
                id="sendPaymentReminders" 
                checked={billingSettings.sendPaymentReminders}
                onCheckedChange={(checked) => onSettingChange('patientBilling.sendPaymentReminders', checked)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Envia lembretes automáticos para faturas próximas do vencimento.
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-medium mb-4">Métodos de Pagamento Aceitos</h4>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'cash', label: 'Dinheiro' },
              { id: 'credit_card', label: 'Cartão de Crédito' },
              { id: 'debit_card', label: 'Cartão de Débito' },
              { id: 'insurance', label: 'Seguradoras' },
              { id: 'bank_transfer', label: 'Transferência Bancária' },
              { id: 'pix', label: 'PIX' }
            ].map((method) => (
              <div key={method.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`method-${method.id}`} 
                  checked={billingSettings.acceptedPaymentMethods.includes(method.id as TPaymentMethod)}
                  onCheckedChange={(checked) => handlePaymentMethodChange(method.id as TPaymentMethod, checked as boolean)}
                />
                <Label htmlFor={`method-${method.id}`}>{method.label}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-medium mb-4">Configurações de Desconto</h4>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="earlyPaymentDiscountEnabled">Desconto para Pagamento Antecipado</Label>
                <Switch 
                  id="earlyPaymentDiscountEnabled" 
                  checked={billingSettings.discountSettings.earlyPaymentDiscountEnabled}
                  onCheckedChange={(checked) => onSettingChange('patientBilling.discountSettings.earlyPaymentDiscountEnabled', checked)}
                />
              </div>
              
              {billingSettings.discountSettings.earlyPaymentDiscountEnabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="earlyPaymentDiscountRate">Taxa de Desconto (%)</Label>
                    <div className="flex items-center space-x-4">
                      <Slider 
                        id="earlyPaymentDiscountRate"
                        min={0}
                        max={50}
                        step={0.5}
                        value={[billingSettings.discountSettings.earlyPaymentDiscountRate]}
                        onValueChange={(value) => onSettingChange('patientBilling.discountSettings.earlyPaymentDiscountRate', value[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-center">
                        {billingSettings.discountSettings.earlyPaymentDiscountRate}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="earlyPaymentDaysThreshold">Dias antes do vencimento</Label>
                    <Input 
                      id="earlyPaymentDaysThreshold" 
                      type="number"
                      min={1}
                      max={30}
                      value={billingSettings.discountSettings.earlyPaymentDaysThreshold}
                      onChange={(e) => onSettingChange('patientBilling.discountSettings.earlyPaymentDaysThreshold', parseInt(e.target.value))}
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="volumeDiscountEnabled">Desconto por Volume</Label>
                <Switch 
                  id="volumeDiscountEnabled" 
                  checked={billingSettings.discountSettings.volumeDiscountEnabled}
                  onCheckedChange={(checked) => onSettingChange('patientBilling.discountSettings.volumeDiscountEnabled', checked)}
                />
              </div>
              
              {billingSettings.discountSettings.volumeDiscountEnabled && (
                <div className="space-y-2 border border-gray-200 dark:border-gray-700 rounded-md p-4 mt-2">
                  <Label>Níveis de Desconto por Volume</Label>
                  
                  {billingSettings.discountSettings.volumeDiscountThresholds.map((threshold, index) => (
                    <div key={index} className="flex items-center space-x-2 mt-2">
                      <div className="flex-1">
                        <Input 
                          type="number"
                          placeholder="Valor mínimo"
                          value={threshold.amount}
                          onChange={(e) => handleUpdateVolumeDiscountThreshold(index, 'amount', parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="flex items-center">
                        <Input 
                          type="number"
                          className="w-20"
                          placeholder="Desconto %"
                          value={threshold.discountRate}
                          onChange={(e) => handleUpdateVolumeDiscountThreshold(index, 'discountRate', parseFloat(e.target.value))}
                        />
                        <span className="ml-1">%</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleRemoveVolumeDiscountThreshold(index)}
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                    onClick={handleAddVolumeDiscountThreshold}
                  >
                    Adicionar Nível
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-medium mb-4 flex items-center">
            <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
            Modelos de Faturamento
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="defaultInsuranceBillingEnabled">Faturamento Padrão por Convênio</Label>
              <Switch 
                id="defaultInsuranceBillingEnabled" 
                checked={billingSettings.defaultInsuranceBillingEnabled}
                onCheckedChange={(checked) => onSettingChange('patientBilling.defaultInsuranceBillingEnabled', checked)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="billingModelType">Modelo de Faturamento Principal</Label>
                <Select 
                  value={costSettings.costUpdateFrequency} 
                  onValueChange={(value) => onSettingChange('serviceCost.costUpdateFrequency', value as 'daily' | 'weekly' | 'monthly' | 'quarterly')}
                >
                  <SelectTrigger id="billingModelType">
                    <SelectValue placeholder="Selecionar modelo de faturamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diária Hospitalar</SelectItem>
                    <SelectItem value="weekly">Pacote de Serviços</SelectItem>
                    <SelectItem value="monthly">Taxa de Utilização</SelectItem>
                    <SelectItem value="quarterly">Baseado em Procedimentos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="customPricingEnabled">Preços Personalizados por Convênio</Label>
                  <Switch 
                    id="customPricingEnabled" 
                    checked={costSettings.customPricingEnabled}
                    onCheckedChange={(checked) => onSettingChange('serviceCost.customPricingEnabled', checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Permite definir tabelas de preços específicas para cada convênio médico.
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md mt-4">
              <h4 className="font-medium flex items-center text-blue-800 dark:text-blue-300 mb-2">
                <InfoIcon className="h-4 w-4 mr-2" />
                Tabelas de Preços
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Configure como os preços são calculados e atualizados no sistema.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="calculateAutomatically">Cálculo Automático de Preços</Label>
                    <Switch 
                      id="calculateAutomatically" 
                      checked={costSettings.calculateAutomatically}
                      onCheckedChange={(checked) => onSettingChange('serviceCost.calculateAutomatically', checked)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Calcula preços automaticamente com base nos custos e markup definido.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultMarkupPercentage">Markup Padrão (%)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider 
                      id="defaultMarkupPercentage"
                      min={0}
                      max={200}
                      step={5}
                      value={[costSettings.defaultMarkupPercentage]}
                      onValueChange={(value) => onSettingChange('serviceCost.defaultMarkupPercentage', value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">
                      {costSettings.defaultMarkupPercentage}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="includedOverheadPercentage">Taxa de Overhead (%)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider 
                      id="includedOverheadPercentage"
                      min={0}
                      max={100}
                      step={1}
                      value={[costSettings.includedOverheadPercentage]}
                      onValueChange={(value) => onSettingChange('serviceCost.includedOverheadPercentage', value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">
                      {costSettings.includedOverheadPercentage}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Porcentagem adicional para cobrir custos operacionais indiretos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};