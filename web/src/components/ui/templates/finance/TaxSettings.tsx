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
  import { Switch } from '@/components/ui/organisms/switch';
  import { Badge } from '@/components/ui/organisms/badge';
  import { Separator } from '@/components/ui/organisms/Separator';
  import { ScrollArea } from '@/components/ui/organisms/scroll-area';
  import { Slider } from '@/components/ui/organisms/slider';
  import { AlertTriangle, Percent } from 'lucide-react';
import { ITaxSettings } from '@/types/finance-types';

interface TaxSettingsProps {
  settings: ITaxSettings;
  onSettingChange: (path: string, value: any) => void;
}

export const TaxSettings: React.FC<TaxSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  // Função para adicionar um novo imposto
  const handleAddTax = () => {
    const taxes = [...settings.additionalTaxes];
    taxes.push({
      name: "Novo Imposto",
      rate: 0,
      appliesTo: ['consultations']
    });
    onSettingChange('tax.additionalTaxes', taxes);
  };

  // Função para remover um imposto
  const handleRemoveTax = (index: number) => {
    const taxes = [...settings.additionalTaxes];
    taxes.splice(index, 1);
    onSettingChange('tax.additionalTaxes', taxes);
  };

  // Função para atualizar um imposto
  const handleUpdateTax = (index: number, field: string, value: any) => {
    const taxes = [...settings.additionalTaxes];
    taxes[index] = {
      ...taxes[index],
      [field]: value
    };
    onSettingChange('tax.additionalTaxes', taxes);
  };

  // Função para alternar um tipo de serviço em appliesTo
  const handleToggleTaxAppliesTo = (taxIndex: number, serviceType: string) => {
    const taxes = [...settings.additionalTaxes];
    const currentAppliesTo = [...taxes[taxIndex].appliesTo];
    
    if (currentAppliesTo.includes(serviceType as any)) {
      taxes[taxIndex] = {
        ...taxes[taxIndex],
        appliesTo: currentAppliesTo.filter(t => t !== serviceType)
      };
    } else {
      taxes[taxIndex] = {
        ...taxes[taxIndex],
        appliesTo: [...currentAppliesTo, serviceType as any]
      };
    }
    
    onSettingChange('tax.additionalTaxes', taxes);
  };

  // Função para adicionar uma nova isenção fiscal
  const handleAddExemption = () => {
    const exemptions = [...settings.taxExemptions];
    exemptions.push({
      name: "Nova Isenção",
      code: "EX-" + Math.floor(Math.random() * 10000),
      description: "Descrição da nova isenção fiscal"
    });
    onSettingChange('tax.taxExemptions', exemptions);
  };

  // Função para remover uma isenção fiscal
  const handleRemoveExemption = (index: number) => {
    const exemptions = [...settings.taxExemptions];
    exemptions.splice(index, 1);
    onSettingChange('tax.taxExemptions', exemptions);
  };

  // Função para atualizar uma isenção fiscal
  const handleUpdateExemption = (index: number, field: string, value: string) => {
    const exemptions = [...settings.taxExemptions];
    exemptions[index] = {
      ...exemptions[index],
      [field]: value
    };
    onSettingChange('tax.taxExemptions', exemptions);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="flex items-center text-gray-800 dark:text-gray-100">
          <Percent className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Configurações de Impostos
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Configure as regras de impostos aplicadas aos serviços e procedimentos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="vatEnabled" className="text-gray-700 dark:text-gray-300">Aplicar Imposto sobre Serviços (ISS)</Label>
              <Switch 
                id="vatEnabled" 
                checked={settings.vatEnabled}
                onCheckedChange={(checked) => onSettingChange('tax.vatEnabled', checked)}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Habilita a cobrança automática de ISS sobre serviços médicos aplicáveis.
            </p>
          </div>
          
          {settings.vatEnabled && (
            <div className="space-y-2">
              <Label htmlFor="vatRate" className="text-gray-700 dark:text-gray-300">Alíquota Padrão de ISS (%)</Label>
              <div className="flex items-center space-x-4">
                <Slider 
                  id="vatRate"
                  min={0}
                  max={25}
                  step={0.5}
                  value={[settings.vatRate]}
                  onValueChange={(value) => onSettingChange('tax.vatRate', value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center text-gray-800 dark:text-gray-200">
                  {settings.vatRate}%
                </span>
              </div>
            </div>
          )}
        </div>
        
        <Separator className="bg-gray-200 dark:bg-gray-600" />
        
        <h4 className="font-medium mb-4 text-gray-800 dark:text-gray-200">Impostos Adicionais</h4>
        <ScrollArea className="h-[200px] rounded-md border border-gray-200 dark:border-gray-700">
          <div className="p-4 space-y-4">
            {settings.additionalTaxes.map((tax, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center">
                    <Input 
                      placeholder="Nome do imposto"
                      value={tax.name}
                      onChange={(e) => handleUpdateTax(index, 'name', e.target.value)}
                      className="font-medium bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                    />
                    <div className="ml-4 w-24">
                      <div className="flex items-center">
                        <Input 
                          type="number"
                          min={0}
                          max={100}
                          value={tax.rate}
                          onChange={(e) => handleUpdateTax(index, 'rate', parseFloat(e.target.value))}
                          className="text-right bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                        />
                        <span className="ml-1 text-gray-800 dark:text-gray-200">%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs mb-1 inline-block text-gray-700 dark:text-gray-300">Aplicável a:</Label>
                    <div className="flex flex-wrap gap-2">
                      {['consultations', 'procedures', 'hospitalization', 'emergency', 'pharmacy', 'laboratory', 'imaging'].map((type) => (
                        <Badge 
                          key={type}
                          variant={tax.appliesTo.includes(type as any) ? "default" : "outline"}
                          className={tax.appliesTo.includes(type as any) 
                            ? "cursor-pointer bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700" 
                            : "cursor-pointer bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"}
                          onClick={() => handleToggleTaxAppliesTo(index, type)}
                        >
                          {type === 'consultations' ? 'Consultas' :
                           type === 'procedures' ? 'Procedimentos' :
                           type === 'hospitalization' ? 'Internação' :
                           type === 'emergency' ? 'Emergência' :
                           type === 'pharmacy' ? 'Farmácia' :
                           type === 'laboratory' ? 'Laboratório' :
                           'Imagens'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 bg-white dark:bg-gray-700"
                  onClick={() => handleRemoveTax(index)}
                >
                  <AlertTriangle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Button 
          variant="outline"
          className="mt-2 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          onClick={handleAddTax}
        >
          Adicionar Imposto
        </Button>
        
        <Separator className="bg-gray-200 dark:bg-gray-600" />
        
        <h4 className="font-medium mb-4 text-gray-800 dark:text-gray-200">Isenções Fiscais</h4>
        <ScrollArea className="h-[200px] rounded-md border border-gray-200 dark:border-gray-700">
          <div className="p-4 space-y-4">
            {settings.taxExemptions.map((exemption, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`exemption-name-${index}`} className="text-xs text-gray-500 dark:text-gray-400">Nome da Isenção</Label>
                      <Input 
                        id={`exemption-name-${index}`}
                        placeholder="Nome da isenção"
                        value={exemption.name}
                        onChange={(e) => handleUpdateExemption(index, 'name', e.target.value)}
                        className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`exemption-code-${index}`} className="text-xs text-gray-500 dark:text-gray-400">Código</Label>
                      <Input 
                        id={`exemption-code-${index}`}
                        placeholder="Código da isenção"
                        value={exemption.code}
                        onChange={(e) => handleUpdateExemption(index, 'code', e.target.value)}
                        className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`exemption-description-${index}`} className="text-xs text-gray-500 dark:text-gray-400">Descrição</Label>
                    <Input 
                      id={`exemption-description-${index}`}
                      placeholder="Descrição da isenção"
                      value={exemption.description}
                      onChange={(e) => handleUpdateExemption(index, 'description', e.target.value)}
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 bg-white dark:bg-gray-700"
                  onClick={() => handleRemoveExemption(index)}
                >
                  <AlertTriangle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Button 
          variant="outline"
          className="mt-2 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          onClick={handleAddExemption}
        >
          Adicionar Isenção
        </Button>
      </CardContent>
    </Card>
  );
};