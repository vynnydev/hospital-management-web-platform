/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Badge } from '@/components/ui/organisms/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/organisms/dialog';
import { Switch } from '@/components/ui/organisms/switch';
import { Info, Key, Clock, Plus, RotateCcw, Copy, CheckCircle, Key as KeyIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/organisms/table';
import { IAPISecurityConfig } from '@/types/security-compliance-types';

interface APIAuthenticationPanelProps {
  config: IAPISecurityConfig;
  onSave: (config: IAPISecurityConfig) => Promise<boolean>;
  loading: boolean;
}

export const APIAuthenticationPanel: React.FC<APIAuthenticationPanelProps> = ({
  config,
  onSave,
  loading
}) => {
  const [currentConfig, setCurrentConfig] = useState<IAPISecurityConfig>(config);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState('settings');
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenExpiry, setNewTokenExpiry] = useState('30');
  const [showNewToken, setShowNewToken] = useState(false);
  const [newToken, setNewToken] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Mock data for active tokens
  const mockTokens = [
    { 
      id: 'token-1', 
      name: 'Admin Dashboard', 
      created: '2025-01-15', 
      expires: '2025-04-15', 
      lastUsed: '2025-03-30', 
      scopes: ['read', 'write'] 
    },
    { 
      id: 'token-2', 
      name: 'Monitoring Service', 
      created: '2025-02-20', 
      expires: '2025-05-20', 
      lastUsed: '2025-03-30', 
      scopes: ['read'] 
    },
    { 
      id: 'token-3', 
      name: 'Reporting System', 
      created: '2025-03-10', 
      expires: '2025-06-10', 
      lastUsed: '2025-03-29', 
      scopes: ['read'] 
    },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    const success = await onSave(currentConfig);
    setIsSaving(false);
    return success;
  };
  
  const handleAuthMethodChange = (value: 'jwt' | 'oauth' | 'api_key') => {
    setCurrentConfig({
      ...currentConfig,
      authMethod: value
    });
  };
  
  const handleTokenExpirationChange = (value: string) => {
    setCurrentConfig({
      ...currentConfig,
      tokenExpiration: parseInt(value)
    });
  };
  
  const mockCreateToken = () => {
    // Simular criação de token
    setIsSaving(true);
    setTimeout(() => {
      const token = `${Math.random().toString(36).substr(2, 8)}_${Math.random().toString(36).substr(2, 8)}.${Math.random().toString(36).substr(2, 8)}_${Math.random().toString(36).substr(2, 8)}`;
      setNewToken(token);
      setShowNewToken(true);
      setIsSaving(false);
    }, 1000);
  };
  
  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(newToken);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  const closeTokenDialog = () => {
    setNewTokenName('');
    setNewTokenExpiry('30');
    setShowNewToken(false);
    setNewToken('');
    setCopySuccess(false);
  };

  return (
    <div className="space-y-4">
      <Tabs 
        value={selectedTab} 
        onValueChange={setSelectedTab} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="tokens">Tokens Ativos</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Método de Autenticação</CardTitle>
              <CardDescription>
                Configure como as aplicações externas se autenticam com a API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auth-method">Método Primário</Label>
                <Select 
                  value={currentConfig.authMethod} 
                  onValueChange={(value: 'jwt' | 'oauth' | 'api_key') => handleAuthMethodChange(value)}
                >
                  <SelectTrigger id="auth-method">
                    <SelectValue placeholder="Selecione um método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jwt">JWT (JSON Web Tokens)</SelectItem>
                    <SelectItem value="oauth">OAuth 2.0</SelectItem>
                    <SelectItem value="api_key">API Key</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {currentConfig.authMethod === 'jwt' ? 
                    'JWT é um padrão aberto (RFC 7519) para transmitir de forma segura informações entre partes.' :
                  currentConfig.authMethod === 'oauth' ? 
                    'OAuth 2.0 é um protocolo de autorização que permite acesso seguro a dados do usuário.' :
                    'API Key é um método simples de autenticação usando chaves estáticas.'}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="token-expiration">Expiração do Token</Label>
                <Select 
                  value={currentConfig.tokenExpiration.toString()} 
                  onValueChange={handleTokenExpirationChange}
                >
                  <SelectTrigger id="token-expiration">
                    <SelectValue placeholder="Selecione um período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="360">6 horas</SelectItem>
                    <SelectItem value="720">12 horas</SelectItem>
                    <SelectItem value="1440">24 horas</SelectItem>
                    <SelectItem value="10080">7 dias</SelectItem>
                    <SelectItem value="43200">30 dias</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Período de validade dos tokens após a emissão. Tokens de longa duração representam riscos de segurança.
                </p>
              </div>
              
              {currentConfig.authMethod === 'jwt' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="jwt-refresh">Permitir Token de Refresh</Label>
                    <Switch id="jwt-refresh" defaultChecked />
                  </div>
                  <p className="text-xs text-gray-500">
                    Habilita o uso de refresh tokens para renovar tokens expirados sem exigir reautenticação.
                  </p>
                </div>
              )}
              
              {currentConfig.authMethod === 'oauth' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="redirect-uri">URIs de Redirecionamento Permitidas</Label>
                    <Input 
                      id="redirect-uri"
                      placeholder="https://exemplo.com/callback"
                      defaultValue="https://app.exemplo.com/callback,https://dev.exemplo.com/callback"
                    />
                    <p className="text-xs text-gray-500">
                      URIs para onde o usuário pode ser redirecionado após autenticação (separadas por vírgula).
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Escopos Disponíveis</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">read:patients</Badge>
                      <Badge variant="secondary">write:patients</Badge>
                      <Badge variant="secondary">read:appointments</Badge>
                      <Badge variant="secondary">write:appointments</Badge>
                      <Badge variant="secondary">read:staff</Badge>
                      <Button variant="outline" size="sm" className="h-6">
                        <Plus className="h-3 w-3 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Escopos definem as permissões específicas que podem ser concedidas às aplicações.
                    </p>
                  </div>
                </div>
              )}
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
              <CardTitle className="text-base">Segurança Adicional</CardTitle>
              <CardDescription>
                Configurações adicionais de segurança para autenticação da API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <span className="text-sm font-medium">Rotação Automática de Segredos</span>
                  <p className="text-xs text-gray-500">
                    Rotacionar automaticamente segredos e chaves a cada 90 dias
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <span className="text-sm font-medium">Limite de Tentativas</span>
                  <p className="text-xs text-gray-500">
                    Bloquear IPs após 10 tentativas falhas de autenticação
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <span className="text-sm font-medium">CORS Restrito</span>
                  <p className="text-xs text-gray-500">
                    Permitir apenas domínios específicos para fazer requisições cross-origin
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <span className="text-sm font-medium">Logs Detalhados</span>
                  <p className="text-xs text-gray-500">
                    Registrar todas as requisições de autenticação para auditoria
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <CardTitle className="text-base">Tokens Ativos</CardTitle>
                  <CardDescription>
                    Gerencie tokens de API ativos e suas permissões
                  </CardDescription>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <KeyIcon className="h-4 w-4 mr-2" />
                      Gerar Novo Token
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {!showNewToken ? (
                      <>
                        <DialogHeader>
                          <DialogTitle>Criar Novo Token de API</DialogTitle>
                          <DialogDescription>
                            Forneça um nome descritivo e selecione o período de validade.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="token-name">Nome do Token</Label>
                            <Input
                              id="token-name"
                              placeholder="Ex: Integração MobileApp"
                              value={newTokenName}
                              onChange={(e) => setNewTokenName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="token-expiry">Validade</Label>
                            <Select
                              value={newTokenExpiry}
                              onValueChange={setNewTokenExpiry}
                            >
                              <SelectTrigger id="token-expiry">
                                <SelectValue placeholder="Selecione o período" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30">30 dias</SelectItem>
                                <SelectItem value="90">90 dias</SelectItem>
                                <SelectItem value="180">180 dias</SelectItem>
                                <SelectItem value="365">1 ano</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Permissões</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center space-x-2">
                                <Switch id="perm-read" defaultChecked />
                                <Label htmlFor="perm-read">Leitura</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="perm-write" />
                                <Label htmlFor="perm-write">Escrita</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="perm-admin" />
                                <Label htmlFor="perm-admin">Admin</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="perm-billing" />
                                <Label htmlFor="perm-billing">Faturamento</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={closeTokenDialog}>
                            Cancelar
                          </Button>
                          <Button 
                            onClick={mockCreateToken} 
                            disabled={!newTokenName || isSaving}
                          >
                            {isSaving ? 'Gerando...' : 'Gerar Token'}
                          </Button>
                        </DialogFooter>
                      </>
                    ) : (
                      <>
                        <DialogHeader>
                          <DialogTitle>Token Gerado com Sucesso</DialogTitle>
                          <DialogDescription>
                            Copie este token agora. Por segurança, ele não será exibido novamente.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="bg-gray-50 p-4 rounded-md font-mono text-sm break-all border-2 border-dashed border-gray-300">
                            {newToken}
                          </div>
                          <div className="flex justify-center mt-4">
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={copyTokenToClipboard}
                            >
                              {copySuccess ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                  Copiado!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copiar para Área de Transferência
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        <DialogFooter>
                          <div className="flex items-center text-sm text-gray-500 text-xs sm:text-sm">
                            <Info className="h-4 w-4 mr-1" />
                            <span>Este token não será exibido novamente</span>
                          </div>
                          <Button onClick={closeTokenDialog}>
                            Fechar
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Criado</TableHead>
                      <TableHead>Expira</TableHead>
                      <TableHead>Último Uso</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTokens.map((token) => (
                      <TableRow key={token.id}>
                        <TableCell className="font-medium">
                          {token.name}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {token.scopes.map(scope => (
                              <Badge key={scope} variant="outline" className="text-xs">
                                {scope}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(token.created).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(token.expires).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(token.lastUsed).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon">
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Key className="h-4 w-4" />
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