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
        return <Badge variant="success" className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'paused':
        return <Badge variant="secondary">Pausado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'GET':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">GET</Badge>;
      case 'POST':
        return <Badge variant="outline" className="bg-green-100 text-green-800">POST</Badge>;
      case 'PUT':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">PUT</Badge>;
      case 'DELETE':
        return <Badge variant="outline" className="bg-red-100 text-red-800">DELETE</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="general">
            <Settings2 className="h-4 w-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="ip-rules">
            <Lock className="h-4 w-4 mr-2" />
            Regras de IP
          </TabsTrigger>
          <TabsTrigger value="endpoint-rules">
            <Zap className="h-4 w-4 mr-2" />
            Regras de Endpoint
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base">Configurações de Rate Limiting</CardTitle>
                  <CardDescription>
                    Configure limites de requisições para proteger a API contra sobrecarga
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {currentConfig.rateLimiting.enabled ? 'Ativado' : 'Desativado'}
                  </span>
                  <Switch
                    checked={currentConfig.rateLimiting.enabled}
                    onCheckedChange={toggleRateLimiting}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!currentConfig.rateLimiting.enabled && (
                <Alert variant="warning">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Rate Limiting desativado</AlertTitle>
                  <AlertDescription>
                    Desativar o rate limiting pode expor sua API a ataques de DoS e uso excessivo. 
                    Recomendamos manter esta proteção ativada.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className={!currentConfig.rateLimiting.enabled ? 'opacity-50 pointer-events-none' : ''}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="requests-per-minute">Requisições por minuto (global)</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="requests-per-minute" 
                        type="number"
                        min={1}
                        max={10000}
                        value={currentConfig.rateLimiting.requestsPerMinute} 
                        onChange={(e) => handleRateLimitChange('requestsPerMinute', parseInt(e.target.value))}
                        required
                      />
                      <div className="text-sm text-gray-500">req/min</div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Número máximo de requisições permitidas por minuto para cada cliente
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="burst-limit">Limite de pico</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="burst-limit" 
                        type="number"
                        min={1}
                        max={10000}
                        value={currentConfig.rateLimiting.burstLimit} 
                        onChange={(e) => handleRateLimitChange('burstLimit', parseInt(e.target.value))}
                        required
                      />
                      <div className="text-sm text-gray-500">requisições</div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Número máximo de requisições permitidas em um curto período (picos de tráfego)
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Label htmlFor="limiting-strategy">Estratégia de limitação</Label>
                  <Select defaultValue="token">
                    <SelectTrigger id="limiting-strategy">
                      <SelectValue placeholder="Selecione uma estratégia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="token">Token Bucket</SelectItem>
                      <SelectItem value="leaky">Leaky Bucket</SelectItem>
                      <SelectItem value="fixed">Janela Fixa</SelectItem>
                      <SelectItem value="sliding">Janela Deslizante</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Algoritmo usado para controlar a taxa de requisições e gerenciar picos de tráfego
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <h4 className="text-sm font-semibold">Opções avançadas</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <Label htmlFor="user-based" className="font-medium">Limite por usuário</Label>
                      <p className="text-xs text-gray-500">
                        Aplicar limites individualmente para cada usuário autenticado
                      </p>
                    </div>
                    <Switch id="user-based" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <Label htmlFor="client-based" className="font-medium">Limite por cliente</Label>
                      <p className="text-xs text-gray-500">
                        Aplicar limites individualmente para cada aplicação cliente
                      </p>
                    </div>
                    <Switch id="client-based" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <Label htmlFor="headers" className="font-medium">Headers de Rate Limit</Label>
                      <p className="text-xs text-gray-500">
                        Incluir headers com informações de rate limiting nas respostas HTTP
                      </p>
                    </div>
                    <Switch id="headers" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <Label htmlFor="retry-after" className="font-medium">Header Retry-After</Label>
                      <p className="text-xs text-gray-500">
                        Indicar ao cliente quando ele pode tentar novamente após exceder o limite
                      </p>
                    </div>
                    <Switch id="retry-after" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSave} 
                disabled={loading || isSaving}
              >
                Salvar Configurações
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estatísticas de Rate Limiting</CardTitle>
              <CardDescription>
                Visão geral das tentativas de exceder os limites de requisições
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Requisições limitadas (24h)</div>
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="text-xs text-gray-400 mt-1">1.5% do total de requisições</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Clientes limitados</div>
                  <div className="text-2xl font-bold">32</div>
                  <div className="text-xs text-gray-400 mt-1">7.8% do total de clientes</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Endpoints mais limitados</div>
                  <div className="text-2xl font-bold">/api/reports</div>
                  <div className="text-xs text-gray-400 mt-1">56% das limitações</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ip-rules" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <CardTitle className="text-base">Regras por IP</CardTitle>
                  <CardDescription>
                    Configure limites de requisição específicos por IP ou faixa de IPs
                  </CardDescription>
                </div>
                <Button>
                  Adicionar Regra de IP
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IP/Faixa</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Limite</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ipRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">
                          {rule.ipAddress}
                        </TableCell>
                        <TableCell>
                          {rule.type === 'range' ? 'Faixa de IPs' : 'IP Individual'}
                        </TableCell>
                        <TableCell>
                          {rule.limit} req/{rule.period}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(rule.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm">
                              Editar
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500">
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
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <CardTitle className="text-base">Regras por Endpoint</CardTitle>
                  <CardDescription>
                    Configure limites de requisição específicos por endpoint da API
                  </CardDescription>
                </div>
                <Button>
                  Adicionar Regra de Endpoint
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Limite</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {endpointRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-mono text-xs">
                          {rule.path}
                        </TableCell>
                        <TableCell>
                          {getMethodBadge(rule.method)}
                        </TableCell>
                        <TableCell>
                          {rule.limit} req/{rule.period}
                        </TableCell>
                        <TableCell className="text-sm">
                          {rule.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm">
                              Editar
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500">
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