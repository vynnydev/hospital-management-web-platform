import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/organisms/card';
  import { Separator } from '@/components/ui/organisms/Separator';
  import { ScrollArea } from '@/components/ui/organisms/scroll-area';
  import { Button } from '@/components/ui/organisms/button';
  import { Badge } from '@/components/ui/organisms/badge';
  import { Label } from '@/components/ui/organisms/label';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/organisms/select';
import { Link } from 'lucide-react';
import { IInsuranceRules } from '@/types/finance-types';

interface InsuranceSettingsProps {
  settings: IInsuranceRules;
  onSettingChange: (path: string, value: any) => void;
}

export const InsuranceSettings: React.FC<InsuranceSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  // Função para remover um convênio
  const handleRemoveProvider = (index: number) => {
    const providers = [...settings.providers];
    providers.splice(index, 1);
    onSettingChange('insurance.providers', providers);
  };

  // Função para adicionar um novo convênio
  const handleAddProvider = () => {
    const providers = [...settings.providers];
    providers.push({
      id: `provider-${Date.now()}`,
      name: "Novo Convênio",
      contractCode: "CNV-" + Math.floor(Math.random() * 10000),
      billingCode: "BCN-" + Math.floor(Math.random() * 10000),
      contactInfo: {
        email: "contato@convenio.com",
        phone: "(00) 0000-0000"
      },
      servicesMap: [],
      submissionMethod: "electronic",
      paymentTerms: 30
    });
    onSettingChange('insurance.providers', providers);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Link className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Integração com Convênios Médicos
        </CardTitle>
        <CardDescription>
          Configure a integração com operadoras de planos de saúde e convênios médicos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="defaultProvider">Convênio Padrão</Label>
            <Select 
              value={settings.defaultProvider} 
              onValueChange={(value) => onSettingChange('insurance.defaultProvider', value)}
            >
              <SelectTrigger id="defaultProvider">
                <SelectValue placeholder="Selecionar convênio padrão" />
              </SelectTrigger>
              <SelectContent>
                {settings.providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>{provider.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Separator />
        
        <h4 className="font-medium mb-4">Convênios Cadastrados</h4>
        
        <ScrollArea className="h-[300px] rounded-md border">
          <div className="p-4 space-y-4">
            {settings.providers.map((provider, index) => (
              <div key={provider.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="font-medium">{provider.name}</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Código do Contrato: {provider.contractCode}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Implementar lógica de edição mais detalhada em um diálogo
                        // Por enquanto, apenas um placeholder
                      }}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/20"
                      onClick={() => handleRemoveProvider(index)}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Contato:</span> {provider.contactInfo.email}
                  </div>
                  <div>
                    <span className="font-medium">Telefone:</span> {provider.contactInfo.phone}
                  </div>
                  <div>
                    <span className="font-medium">Método de Envio:</span> {provider.submissionMethod === 'electronic' ? 'Eletrônico' : 'Manual'}
                  </div>
                  <div>
                    <span className="font-medium">Prazo de Pagamento:</span> {provider.paymentTerms} dias
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h6 className="text-sm font-medium mb-2">Cobertura de Serviços</h6>
                  <div className="space-y-2">
                    {provider.servicesMap.slice(0, 3).map((service) => (
                      <div key={service.serviceCode} className="flex justify-between text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <span className="font-medium">{service.serviceCode}</span>
                          {service.requiresPreAuthorization && (
                            <Badge variant="outline" className="ml-2 text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
                              Pré-autorização
                            </Badge>
                          )}
                        </div>
                        <div>
                          <span>Cobertura: {service.coveragePercentage}%</span>
                          <span className="ml-2">Máx: {service.maxAllowedAmount.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}</span>
                        </div>
                      </div>
                    ))}
                    
                    {provider.servicesMap.length > 3 && (
                      <Button variant="link" size="sm" className="text-xs mt-1">
                        Ver todos os {provider.servicesMap.length} serviços...
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Button 
          className="mt-4 w-full"
          onClick={handleAddProvider}
        >
          Adicionar Novo Convênio
        </Button>
      </CardContent>
    </Card>
  );
};