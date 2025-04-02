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
  import { ScrollArea } from '@/components/ui/organisms/scroll-area';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/organisms/select';
import { AlertTriangle, Clock, Database, EditIcon, ExternalLink, InfoIcon, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { IFinancialIntegrationSettings } from '@/types/finance-types';

interface IntegrationSettingsProps {
  settings: IFinancialIntegrationSettings;
  onSettingChange: (path: string, value: any) => void;
}

export const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  // Função para atualizar o status de habilitado
  const handleEnabledChange = (enabled: boolean) => {
    onSettingChange('integrations.enabled', enabled);
  };

  // Função para adicionar um novo sistema
  const handleAddSystem = () => {
    const systems = [...settings.systems];
    systems.push({
      id: `sys-${Date.now()}`,
      name: "Novo Sistema",
      type: "accounting",
      apiEndpoint: "https://api.sistema.com/v1",
      apiKey: "api_key_" + Math.random().toString(36).substring(2, 10),
      refreshToken: "refresh_" + Math.random().toString(36).substring(2, 10),
      syncFrequency: "daily",
      lastSync: new Date().toISOString(),
      mappedFields: {}
    });
    onSettingChange('integrations.systems', systems);
  };

  // Função para remover um sistema
  const handleRemoveSystem = (index: number) => {
    const systems = [...settings.systems];
    systems.splice(index, 1);
    onSettingChange('integrations.systems', systems);
  };

  // Função para atualizar um sistema
  const handleUpdateSystem = (index: number, field: string, value: any) => {
    const systems = [...settings.systems];
    systems[index] = {
      ...systems[index],
      [field]: value
    };
    onSettingChange('integrations.systems', systems);
  };

  // Formatar data da última sincronização
  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Converter tipo de sistema para texto legível
  const getSystemTypeText = (type: string) => {
    switch (type) {
      case 'erp': return 'ERP';
      case 'accounting': return 'Sistema Contábil';
      case 'payment_processor': return 'Processador de Pagamentos';
      case 'tax_system': return 'Sistema Fiscal';
      case 'banking': return 'Sistema Bancário';
      default: return type;
    }
  };

  // Obter cor do badge baseado no tipo de sistema
  const getSystemTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'erp':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'accounting':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'payment_processor':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'tax_system':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'banking':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  // Obter cor do badge baseado na frequência de sincronização
  const getSyncFrequencyBadgeColor = (frequency: string) => {
    switch (frequency) {
      case 'realtime':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'hourly':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'daily':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'weekly':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Integrações com Sistemas Externos
        </CardTitle>
        <CardDescription>
          Configure integrações com sistemas financeiros externos como ERPs, sistemas contábeis e bancários.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="integrationsEnabled" 
              checked={settings.enabled}
              onCheckedChange={handleEnabledChange}
            />
            <Label htmlFor="integrationsEnabled" className="font-medium">
              Habilitar Integrações
            </Label>
          </div>
          
          <Button 
            variant="outline"
            size="sm"
            disabled={!settings.enabled}
            onClick={handleAddSystem}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Sistema
          </Button>
        </div>
        
        {settings.enabled ? (
          <>
            {settings.systems.length === 0 ? (
              <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-md p-8 text-center">
                <Database className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                <h3 className="text-lg font-medium mb-2">Nenhuma integração configurada</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
                  Adicione sistemas externos para sincronizar dados financeiros automaticamente.
                </p>
                <Button onClick={handleAddSystem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Sistema
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[400px] rounded-md border">
                <div className="p-4 space-y-6">
                  {settings.systems.map((system, index) => (
                    <div key={system.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium mr-2">{system.name}</h3>
                            <Badge className={getSystemTypeBadgeColor(system.type)}>
                              {getSystemTypeText(system.type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center">
                            <ExternalLink className="h-3.5 w-3.5 mr-1 opacity-70" />
                            {system.apiEndpoint}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center"
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1" />
                            Sincronizar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center"
                            onClick={() => handleRemoveSystem(index)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1 text-red-500" />
                            Remover
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label htmlFor={`system-name-${index}`} className="text-xs">Nome</Label>
                          <Input 
                            id={`system-name-${index}`}
                            value={system.name}
                            onChange={(e) => handleUpdateSystem(index, 'name', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`system-type-${index}`} className="text-xs">Tipo</Label>
                          <Select 
                            value={system.type} 
                            onValueChange={(value) => handleUpdateSystem(index, 'type', value)}
                          >
                            <SelectTrigger id={`system-type-${index}`}>
                              <SelectValue placeholder="Selecionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="erp">ERP</SelectItem>
                              <SelectItem value="accounting">Sistema Contábil</SelectItem>
                              <SelectItem value="payment_processor">Processador de Pagamentos</SelectItem>
                              <SelectItem value="tax_system">Sistema Fiscal</SelectItem>
                              <SelectItem value="banking">Sistema Bancário</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`system-api-endpoint-${index}`} className="text-xs">URL da API</Label>
                          <Input 
                            id={`system-api-endpoint-${index}`}
                            value={system.apiEndpoint}
                            onChange={(e) => handleUpdateSystem(index, 'apiEndpoint', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`system-sync-frequency-${index}`} className="text-xs">Frequência de Sincronização</Label>
                          <Select 
                            value={system.syncFrequency} 
                            onValueChange={(value) => handleUpdateSystem(index, 'syncFrequency', value)}
                          >
                            <SelectTrigger id={`system-sync-frequency-${index}`}>
                              <SelectValue placeholder="Selecionar frequência" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="realtime">Tempo Real</SelectItem>
                              <SelectItem value="hourly">A cada hora</SelectItem>
                              <SelectItem value="daily">Diariamente</SelectItem>
                              <SelectItem value="weekly">Semanalmente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`system-api-key-${index}`} className="text-xs">Chave da API</Label>
                            <div className="relative">
                              <Input 
                                id={`system-api-key-${index}`}
                                type="password"
                                value={system.apiKey}
                                onChange={(e) => handleUpdateSystem(index, 'apiKey', e.target.value)}
                              />
                              <Button variant="ghost" size="sm" className="absolute right-0 top-0 h-full">
                                <EditIcon className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`system-refresh-token-${index}`} className="text-xs">Token de Atualização</Label>
                            <div className="relative">
                              <Input 
                                id={`system-refresh-token-${index}`}
                                type="password"
                                value={system.refreshToken}
                                onChange={(e) => handleUpdateSystem(index, 'refreshToken', e.target.value)}
                              />
                              <Button variant="ghost" size="sm" className="absolute right-0 top-0 h-full">
                                <EditIcon className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">Última sincronização:</span>
                            <span className="ml-1 font-medium">{formatLastSync(system.lastSync)}</span>
                          </div>
                          
                          <Badge className={getSyncFrequencyBadgeColor(system.syncFrequency)}>
                            {system.syncFrequency === 'realtime' ? 'Tempo Real' :
                             system.syncFrequency === 'hourly' ? 'A cada hora' :
                             system.syncFrequency === 'daily' ? 'Diariamente' : 'Semanalmente'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md mt-6">
              <h4 className="font-medium flex items-center text-blue-800 dark:text-blue-300 mb-2">
                <InfoIcon className="h-4 w-4 mr-2" />
                Benefícios da Integração Automática
              </h4>
              <ul className="list-disc ml-5 text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>Sincronização automática de transações financeiras</li>
                <li>Eliminação de entrada manual de dados e redução de erros</li>
                <li>Relatórios financeiros em tempo real</li>
                <li>Reconciliação bancária automática</li>
                <li>Gestão integrada de contas a pagar e receber</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-md p-8 text-center">
            <AlertTriangle className="h-10 w-10 mx-auto text-amber-500 mb-3" />
            <h3 className="text-lg font-medium mb-2">Integrações Desabilitadas</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
              As integrações com sistemas externos estão atualmente desabilitadas. Habilite-as para sincronizar dados financeiros automaticamente.
            </p>
            <Button onClick={() => handleEnabledChange(true)}>
              Habilitar Integrações
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};