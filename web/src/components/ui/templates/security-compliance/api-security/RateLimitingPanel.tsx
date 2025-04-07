/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Switch } from '@/components/ui/organisms/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/organisms/table';
import { Badge } from '@/components/ui/organisms/badge';
import { Timer, AlertCircle, Users, BarChart2, Clock, Zap, Lock, User, Gauge, Settings2 } from 'lucide-react';
import { IAPISecurityConfig } from '@/types/security-compliance-types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';

interface RateLimitingPanelProps {
  config: IAPISecurityConfig;
  onSave: (config: IAPISecurityConfig) => Promise<boolean>;
  loading: boolean;
}

interface IPRule {
  id: string;
  ipAddress: string;
  type: 'individual' | 'range';
  limit: number;
  period: string;
  status: 'active' | 'paused';
  lastUpdated: string;
}

interface EndpointRule {
  id: string;
  path: string;
  method: string;
  limit: number;
  period: string;
  description: string;
}

export const RateLimitingPanel: React.FC<RateLimitingPanelProps> = ({
  config,
  onSave,
  loading
}) => {
  const [currentConfig, setCurrentConfig] = useState({
    ...config,
    rateLimiting: {
      ...config.rateLimiting,
      enabled: config.rateLimiting?.enabled ?? true,
      requestsPerMinute: config.rateLimiting?.requestsPerMinute ?? 100,
      burstLimit: config.rateLimiting?.burstLimit ?? 250
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState('general');
  
  // Mock data for IP rules
  const ipRules: IPRule[] = [
    { 
      id: 'rule-1',
      ipAddress: '192.168.1.0/24', 
      type: 'range',
      limit: 500, 
      period: 'minute',
      status: 'active',
      lastUpdated: '2025-01-15'
    },
    { 
      id: 'rule-2',
      ipAddress: '10.0.0.5', 
      type: 'individual',
      limit: 1000, 
      period: 'minute',
      status: 'active',
      lastUpdated: '2025-02-20'
    },
    { 
      id: 'rule-3',
      ipAddress: '203.0.113.5', 
      type: 'individual',
      limit: 50, 
      period: 'minute',
      status: 'paused',
      lastUpdated: '2025-03-10'
    }
  ];
  
  // Mock data for endpoint rules
  const endpointRules: EndpointRule[] = [
    {
      id: 'endpoint-1',
      path: '/api/patients/*',
      method: 'GET',
      limit: 200,
      period: 'minute',
      description: 'Leitura de dados de pacientes'
    },
    {
      id: 'endpoint-2',
      path: '/api/appointments',
      method: 'POST',
      limit: 60,
      period: 'minute',
      description: 'Criação de novos agendamentos'
    },
    {
      id: 'endpoint-3',
      path: '/api/reports/*',
      method: 'GET',
      limit: 30,
      period: 'minute',
      description: 'Geração de relatórios'
    },
    {
      id: 'endpoint-4',
      path: '/api/auth/token',
      method: 'POST',
      limit: 10,
      period: 'minute',
      description: 'Renovação de tokens'
    }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    const success = await onSave(currentConfig);
    setIsSaving(false);
    return success;
  };
  
  const toggleRateLimiting = (enabled: boolean) => {
    setCurrentConfig({
      ...currentConfig,
      rateLimiting: {
        ...currentConfig.rateLimiting,
        enabled
      }
    });
  };

  const handleRateLimitChange = (key: string, value: number) => {
    setCurrentConfig({
      ...currentConfig,
      rateLimiting: {
        ...currentConfig.rateLimiting,
        [key]: value
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Ativo</Badge>;
      case 'paused':
        return <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Pausado</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">{status}</Badge>;
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'GET':
        return <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">GET</Badge>;
      case 'POST':
        return <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">POST</Badge>;
      case 'PUT':
        return <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">PUT</Badge>;
      case 'DELETE':
        return <Badge variant="outline" className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800">DELETE</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">{method}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <TabsTrigger 
            value="general" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
          >
            <Settings2 className="h-4 w-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger 
            value="ip-rules" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
          >
            <Lock className="h-4 w-4 mr-2" />
            Regras de IP
          </TabsTrigger>
          <TabsTrigger 
            value="endpoint-rules" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
          >
            <Zap className="h-4 w-4 mr-2" />
            Regras de Endpoint
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base text-gray-900 dark:text-white">Configurações de Rate Limiting</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Configure limites de requisições para proteger a API contra sobrecarga
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentConfig.rateLimiting.enabled ? 'Ativado' : 'Desativado'}
                  </span>
                  <Switch
                    checked={currentConfig.rateLimiting.enabled}
                    onCheckedChange={toggleRateLimiting}
                    className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!currentConfig.rateLimiting.enabled && (
                <Alert variant="warning" className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                  <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                  <AlertTitle className="text-amber-800 dark:text-amber-300">Rate Limiting desativado</AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-400">
                    Desativar o rate limiting pode expor sua API a ataques de DoS e uso excessivo. 
                    Recomendamos manter esta proteção ativada.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className={!currentConfig.rateLimiting.enabled ? 'opacity-50 pointer-events-none' : ''}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="requests-per-minute" className="text-gray-700 dark:text-gray-300">Requisições por minuto (global)</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="requests-per-minute" 
                        type="number"
                        min={1}
                        max={10000}
                        value={currentConfig.rateLimiting.requestsPerMinute} 
                        onChange={(e) => handleRateLimitChange('requestsPerMinute', parseInt(e.target.value))}
                        required
                        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                      />
                      <div className="text-sm text-gray-500 dark:text-gray-400">req/min</div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Número máximo de requisições permitidas por minuto para cada cliente
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="burst-limit" className="text-gray-700 dark:text-gray-300">Limite de pico</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="burst-limit" 
                        type="number"
                        min={1}
                        max={10000}
                        value={currentConfig.rateLimiting.burstLimit} 
                        onChange={(e) => handleRateLimitChange('burstLimit', parseInt(e.target.value))}
                        required
                        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                      />
                      <div className="text-sm text-gray-500 dark:text-gray-400">requisições</div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Número máximo de requisições permitidas em um curto período (picos de tráfego)
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Label htmlFor="limiting-strategy" className="text-gray-700 dark:text-gray-300">Estratégia de limitação</Label>
                  <Select defaultValue="token">
                    <SelectTrigger id="limiting-strategy" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Selecione uma estratégia" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectItem value="token" className="text-gray-900 dark:text-white">Token Bucket</SelectItem>
                      <SelectItem value="leaky" className="text-gray-900 dark:text-white">Leaky Bucket</SelectItem>
                      <SelectItem value="fixed" className="text-gray-900 dark:text-white">Janela Fixa</SelectItem>
                      <SelectItem value="sliding" className="text-gray-900 dark:text-white">Janela Deslizante</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Algoritmo usado para controlar a taxa de requisições e gerenciar picos de tráfego
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Opções avançadas</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <div>
                      <Label htmlFor="user-based" className="font-medium text-gray-900 dark:text-white">Limite por usuário</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Aplicar limites individualmente para cada usuário autenticado
                      </p>
                    </div>
                    <Switch id="user-based" defaultChecked className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <div>
                      <Label htmlFor="client-based" className="font-medium text-gray-900 dark:text-white">Limite por cliente</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Aplicar limites individualmente para cada aplicação cliente
                      </p>
                    </div>
                    <Switch id="client-based" defaultChecked className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <div>
                      <Label htmlFor="headers" className="font-medium text-gray-900 dark:text-white">Headers de Rate Limit</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Incluir headers com informações de rate limiting nas respostas HTTP
                      </p>
                    </div>
                    <Switch id="headers" defaultChecked className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <div>
                      <Label htmlFor="retry-after" className="font-medium text-gray-900 dark:text-white">Header Retry-After</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Indicar ao cliente quando ele pode tentar novamente após exceder o limite
                      </p>
                    </div>
                    <Switch id="retry-after" defaultChecked className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSave} 
                disabled={loading || isSaving}
                className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
              >
                Salvar Configurações
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-base text-gray-900 dark:text-white">Estatísticas de Rate Limiting</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Visão geral das tentativas de exceder os limites de requisições
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Requisições limitadas (24h)</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">1,247</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">1.5% do total de requisições</div>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Clientes limitados</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">32</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">7.8% do total de clientes</div>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Endpoints mais limitados</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">/api/reports</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">56% das limitações</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ip-rules" className="mt-4">
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <CardTitle className="text-base text-gray-900 dark:text-white">Regras por IP</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Configure limites de requisição específicos por IP ou faixa de IPs
                  </CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white">
                  Adicionar Regra de IP
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                    <TableRow className="border-gray-200 dark:border-gray-700">
                      <TableHead className="text-gray-700 dark:text-gray-300">IP/Faixa</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Tipo</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Limite</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                      <TableHead className="text-right text-gray-700 dark:text-gray-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ipRules.map((rule) => (
                      <TableRow key={rule.id} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium text-gray-900 dark:text-white">
                          {rule.ipAddress}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">
                          {rule.type === 'range' ? 'Faixa de IPs' : 'IP Individual'}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">
                          {rule.limit} req/{rule.period}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(rule.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                              Editar
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-600">
                              Remover
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoint-rules" className="mt-4">
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <CardTitle className="text-base text-gray-900 dark:text-white">Regras por Endpoint</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Configure limites de requisição específicos por endpoint da API
                  </CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white">
                  Adicionar Regra de Endpoint
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                    <TableRow className="border-gray-200 dark:border-gray-700">
                      <TableHead className="text-gray-700 dark:text-gray-300">Endpoint</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Método</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Limite</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Descrição</TableHead>
                      <TableHead className="text-right text-gray-700 dark:text-gray-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {endpointRules.map((rule) => (
                      <TableRow key={rule.id} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-mono text-xs text-gray-900 dark:text-white">
                          {rule.path}
                        </TableCell>
                        <TableCell>
                          {getMethodBadge(rule.method)}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">
                          {rule.limit} req/{rule.period}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                          {rule.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                              Editar
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-600">
                              Remover
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};