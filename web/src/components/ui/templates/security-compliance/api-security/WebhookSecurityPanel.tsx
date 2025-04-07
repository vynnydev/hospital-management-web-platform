/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Switch } from '@/components/ui/organisms/switch';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Checkbox } from '@/components/ui/organisms/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { BadgeHelp, Copy, Eye, EyeOff, Info, RefreshCw, Webhook } from 'lucide-react';
import { useToast } from '@/components/ui/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/organisms/accordion';
import { Badge } from '@/components/ui/organisms/badge';
import { IAPISecurityConfig } from '@/types/security-compliance-types';

interface WebhookSecurityPanelProps {
  webhookConfig: {
    enabled: boolean;
    signingSecret: boolean;
    signingKey?: string;
    retryPolicy: boolean;
    maxRetries?: number;
    retryDelay?: number;
    allowedIps?: string[];
    ipRestriction: boolean;
    endpoints: {
      id: string;
      url: string;
      events: string[];
      active: boolean;
      createdAt: string;
    }[];
    securityLevel: 'basic' | 'standard' | 'high';
  };
  updateWebhookConfig: (config: any) => Promise<any>;
  config: IAPISecurityConfig;
  onSave: (updatedConfig: any) => Promise<boolean>;
  loading: boolean;
}

export const WebhookSecurityPanel: React.FC<WebhookSecurityPanelProps> = ({
  webhookConfig,
  updateWebhookConfig,
  loading
}) => {
  const [config, setConfig] = useState(webhookConfig);
  const [showSigningKey, setShowSigningKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateWebhookConfig(config);
      
      toast({
        title: "Configurações de webhook atualizadas",
        description: "As configurações de segurança de webhook foram salvas com sucesso.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações de webhook.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateSigningKey = () => {
    // Gerar uma nova chave de assinatura de 32 caracteres
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    setConfig({
      ...config,
      signingKey: result
    });
    
    toast({
      title: "Nova chave gerada",
      description: "Uma nova chave de assinatura foi gerada. Lembre-se de salvar as alterações.",
      variant: "default",
    });
  };

  const handleCopySigningKey = () => {
    if (config.signingKey) {
      navigator.clipboard.writeText(config.signingKey);
      toast({
        title: "Chave copiada",
        description: "A chave de assinatura foi copiada para a área de transferência.",
        variant: "default",
      });
    }
  };

  const handleAddEndpoint = () => {
    if (!endpointUrl) return;
    
    const newEndpoint = {
      id: `endpoint-${Date.now()}`,
      url: endpointUrl,
      events: selectedEvents,
      active: true,
      createdAt: new Date().toISOString()
    };
    
    setConfig({
      ...config,
      endpoints: [...config.endpoints, newEndpoint]
    });
    
    setEndpointUrl('');
    setSelectedEvents([]);
    
    toast({
      title: "Endpoint adicionado",
      description: "O novo endpoint de webhook foi adicionado com sucesso.",
      variant: "default",
    });
  };

  const handleToggleEndpoint = (id: string, active: boolean) => {
    setConfig({
      ...config,
      endpoints: config.endpoints.map(endpoint => 
        endpoint.id === id ? { ...endpoint, active } : endpoint
      )
    });
  };

  const handleDeleteEndpoint = (id: string) => {
    setConfig({
      ...config,
      endpoints: config.endpoints.filter(endpoint => endpoint.id !== id)
    });
    
    toast({
      title: "Endpoint removido",
      description: "O endpoint de webhook foi removido com sucesso.",
      variant: "default",
    });
  };

  const handleAddIp = (ip: string) => {
    if (!ip || (config.allowedIps && config.allowedIps.includes(ip))) return;
    
    setConfig({
      ...config,
      allowedIps: [...(config.allowedIps || []), ip]
    });
  };

  const handleRemoveIp = (ip: string) => {
    setConfig({
      ...config,
      allowedIps: (config.allowedIps || []).filter(i => i !== ip)
    });
  };

  const handleToggleEvent = (event: string) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter(e => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const availableEvents = [
    'user.created',
    'user.updated',
    'user.deleted',
    'patient.created',
    'patient.updated',
    'patient.discharged',
    'patient.transferred',
    'bed.status_changed',
    'appointment.created',
    'appointment.updated',
    'appointment.canceled',
    'prescription.created',
    'prescription.updated',
    'security.alert',
    'report.generated'
  ];

  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Webhook className="h-5 w-5 text-primary dark:text-primary-400" />
              Segurança de Webhooks
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Configure a segurança para webhooks e notificações externas
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {config.enabled ? 'Ativado' : 'Desativado'}
            </span>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig({
                ...config,
                enabled: checked
              })}
              className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className={!config.enabled ? 'opacity-50 pointer-events-none' : ''}>
          <div className="space-y-4">
            <Tabs defaultValue="security" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400">Segurança</TabsTrigger>
                <TabsTrigger value="endpoints" className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400">Endpoints</TabsTrigger>
              </TabsList>
              
              <TabsContent value="security" className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <div>
                      <Label htmlFor="signingSecret" className="font-medium text-gray-900 dark:text-white">Assinatura de Webhooks</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Adiciona uma camada extra de segurança com assinatura HMAC para verificar a autenticidade dos webhooks
                      </p>
                    </div>
                    <Switch
                      id="signingSecret"
                      checked={config.signingSecret}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        signingSecret: checked
                      })}
                      className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                    />
                  </div>
                  
                  {config.signingSecret && (
                    <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md space-y-3 bg-white dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signingKey" className="font-medium text-gray-900 dark:text-white">Chave de Assinatura</Label>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowSigningKey(!showSigningKey)}
                            className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {showSigningKey ? <EyeOff size={14} /> : <Eye size={14} />}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleCopySigningKey}
                            className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Copy size={14} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleGenerateSigningKey}
                            className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <RefreshCw size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <Input 
                          id="signingKey"
                          value={config.signingKey || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            signingKey: e.target.value
                          })}
                          type={showSigningKey ? "text" : "password"}
                          placeholder="Chave secreta para assinar webhooks"
                          className="pr-24 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <Info className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                        <AlertTitle className="text-blue-700 dark:text-blue-300">Como verificar assinaturas</AlertTitle>
                        <AlertDescription className="text-blue-600 dark:text-blue-400">
                          Cada webhook incluirá um cabeçalho <code className="text-xs bg-blue-100 dark:bg-blue-800 p-1 rounded text-blue-800 dark:text-blue-200">X-4Health-Signature</code> que é 
                          um HMAC SHA-256 do payload usando esta chave. Verifique este cabeçalho para autenticar os webhooks.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <div>
                      <Label htmlFor="retryPolicy" className="font-medium text-gray-900 dark:text-white">Política de Retry</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Tenta reenviar webhooks automaticamente em caso de falha
                      </p>
                    </div>
                    <Switch
                      id="retryPolicy"
                      checked={config.retryPolicy}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        retryPolicy: checked
                      })}
                      className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                    />
                  </div>
                  
                  {config.retryPolicy && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                      <div className="space-y-2">
                        <Label htmlFor="maxRetries" className="text-gray-700 dark:text-gray-300">Número máximo de tentativas</Label>
                        <Input
                          id="maxRetries"
                          type="number"
                          min={1}
                          max={10}
                          value={config.maxRetries || 3}
                          onChange={(e) => setConfig({
                            ...config,
                            maxRetries: parseInt(e.target.value)
                          })}
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="retryDelay" className="text-gray-700 dark:text-gray-300">Delay entre tentativas (segundos)</Label>
                        <Input
                          id="retryDelay"
                          type="number"
                          min={5}
                          max={300}
                          value={config.retryDelay || 60}
                          onChange={(e) => setConfig({
                            ...config,
                            retryDelay: parseInt(e.target.value)
                          })}
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <div>
                      <Label htmlFor="ipRestriction" className="font-medium text-gray-900 dark:text-white">Restrição de IP</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Limita os IPs que podem receber webhooks
                      </p>
                    </div>
                    <Switch
                      id="ipRestriction"
                      checked={config.ipRestriction}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        ipRestriction: checked
                      })}
                      className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                    />
                  </div>
                  
                  {config.ipRestriction && (
                    <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md space-y-3 bg-white dark:bg-gray-800">
                      <div className="space-y-2">
                        <Label htmlFor="allowedIp" className="text-gray-700 dark:text-gray-300">IPs permitidos</Label>
                        <div className="flex gap-2">
                          <Input
                            id="allowedIp"
                            placeholder="Digite um endereço IP"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddIp((e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                          />
                          <Button 
                            variant="outline"
                            onClick={(e) => {
                              const input = document.getElementById('allowedIp') as HTMLInputElement;
                              handleAddIp(input.value);
                              input.value = '';
                            }}
                            className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            Adicionar
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {(config.allowedIps || []).map(ip => (
                          <Badge key={ip} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                            {ip}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                              onClick={() => handleRemoveIp(ip)}
                            >
                              ×
                            </Button>
                          </Badge>
                        ))}
                        {!(config.allowedIps || []).length && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Nenhum IP adicionado. Adicione IPs para restringir o acesso.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-2 border border-gray-200 dark:border-gray-700 rounded-md space-y-2 bg-white dark:bg-gray-800">
                    <Label htmlFor="securityLevel" className="font-medium text-gray-900 dark:text-white">Nível de Segurança</Label>
                    <Select
                      value={config.securityLevel || 'standard'}
                      onValueChange={(value: 'basic' | 'standard' | 'high') => setConfig({
                        ...config,
                        securityLevel: value
                      })}
                    >
                      <SelectTrigger id="securityLevel" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                        <SelectValue placeholder="Selecione o nível de segurança" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <SelectItem value="basic" className="text-gray-900 dark:text-white">Básico</SelectItem>
                        <SelectItem value="standard" className="text-gray-900 dark:text-white">Padrão</SelectItem>
                        <SelectItem value="high" className="text-gray-900 dark:text-white">Alto</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="text-xs p-2 bg-gray-50 dark:bg-gray-800/60 rounded-md text-gray-600 dark:text-gray-400">
                      {config.securityLevel === 'basic' && (
                        <p>Envio de dados básicos, sem filtros adicionais. Recomendado apenas para ambientes de teste.</p>
                      )}
                      {config.securityLevel === 'standard' && (
                        <p>Assinatura HMAC e filtragem de dados sensíveis. Recomendado para a maioria dos casos.</p>
                      )}
                      {config.securityLevel === 'high' && (
                        <p>Assinatura HMAC, criptografia de payload, restrição de IP e filtragem avançada de dados. Recomendado para dados altamente sensíveis.</p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="endpoints" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md space-y-3 bg-white dark:bg-gray-800">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Adicionar Novo Endpoint</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endpointUrl" className="text-gray-700 dark:text-gray-300">URL do Webhook</Label>
                      <Input
                        id="endpointUrl"
                        placeholder="https://example.com/webhook"
                        value={endpointUrl}
                        onChange={(e) => setEndpointUrl(e.target.value)}
                        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Eventos</Label>
                        <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                          {selectedEvents.length} selecionados
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50">
                        {availableEvents.map(event => (
                          <div key={event} className="flex items-center space-x-2">
                            <Checkbox
                              id={`event-${event}`}
                              checked={selectedEvents.includes(event)}
                              onCheckedChange={() => handleToggleEvent(event)}
                              className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                            />
                            <Label htmlFor={`event-${event}`} className="text-xs text-gray-700 dark:text-gray-300">{event}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
                      disabled={!endpointUrl || selectedEvents.length === 0}
                      onClick={handleAddEndpoint}
                    >
                      Adicionar Endpoint
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Endpoints Configurados</h4>
                    
                    {config.endpoints.length === 0 ? (
                      <div className="text-center p-6 border border-dashed border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Nenhum endpoint configurado. Adicione um endpoint para começar a receber webhooks.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {config.endpoints.map(endpoint => (
                          <div key={endpoint.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-sm font-medium truncate text-gray-900 dark:text-white">
                                    {endpoint.url}
                                  </h5>
                                  <Badge 
                                    variant={endpoint.active ? 'default' : 'secondary'} 
                                    className={endpoint.active 
                                      ? "bg-primary dark:bg-primary-400 text-white" 
                                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    }
                                  >
                                    {endpoint.active ? 'Ativo' : 'Inativo'}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Criado em: {new Date(endpoint.createdAt).toLocaleString()}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={endpoint.active}
                                  onCheckedChange={(checked) => handleToggleEndpoint(endpoint.id, checked)}
                                  className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                                />
                                <Button 
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteEndpoint(endpoint.id)}
                                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-600"
                                >
                                  Remover
                                </Button>
                              </div>
                            </div>
                            
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="events" className="border-b border-gray-200 dark:border-gray-700">
                                <AccordionTrigger className="text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                  <span>{endpoint.events.length} eventos configurados</span>
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-700 dark:text-gray-300">
                                  <div className="flex flex-wrap gap-1 p-2">
                                    {endpoint.events.map(event => (
                                      <Badge key={event} variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                                        {event}
                                      </Badge>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={loading || isSaving || !config.enabled}
          className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
        >
          Salvar Configurações
        </Button>
      </CardFooter>
    </Card>
  );
};