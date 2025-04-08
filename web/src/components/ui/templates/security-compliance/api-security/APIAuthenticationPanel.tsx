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
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <TabsTrigger 
            value="settings" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
          >
            Configurações
          </TabsTrigger>
          <TabsTrigger 
            value="tokens" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
          >
            Tokens Ativos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-base text-gray-900 dark:text-white">Método de Autenticação</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Configure como as aplicações externas se autenticam com a API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auth-method" className="text-gray-700 dark:text-gray-300">Método Primário</Label>
                <Select 
                  value={currentConfig.authMethod} 
                  onValueChange={(value: 'jwt' | 'oauth' | 'api_key') => handleAuthMethodChange(value)}
                >
                  <SelectTrigger id="auth-method" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Selecione um método" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem value="jwt" className="text-gray-900 dark:text-white">JWT (JSON Web Tokens)</SelectItem>
                    <SelectItem value="oauth" className="text-gray-900 dark:text-white">OAuth 2.0</SelectItem>
                    <SelectItem value="api_key" className="text-gray-900 dark:text-white">API Key</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentConfig.authMethod === 'jwt' ? 
                    'JWT é um padrão aberto (RFC 7519) para transmitir de forma segura informações entre partes.' :
                  currentConfig.authMethod === 'oauth' ? 
                    'OAuth 2.0 é um protocolo de autorização que permite acesso seguro a dados do usuário.' :
                    'API Key é um método simples de autenticação usando chaves estáticas.'}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="token-expiration" className="text-gray-700 dark:text-gray-300">Expiração do Token</Label>
                <Select 
                  value={currentConfig.tokenExpiration.toString()} 
                  onValueChange={handleTokenExpirationChange}
                >
                  <SelectTrigger id="token-expiration" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Selecione um período" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem value="15" className="text-gray-900 dark:text-white">15 minutos</SelectItem>
                    <SelectItem value="30" className="text-gray-900 dark:text-white">30 minutos</SelectItem>
                    <SelectItem value="60" className="text-gray-900 dark:text-white">1 hora</SelectItem>
                    <SelectItem value="360" className="text-gray-900 dark:text-white">6 horas</SelectItem>
                    <SelectItem value="720" className="text-gray-900 dark:text-white">12 horas</SelectItem>
                    <SelectItem value="1440" className="text-gray-900 dark:text-white">24 horas</SelectItem>
                    <SelectItem value="10080" className="text-gray-900 dark:text-white">7 dias</SelectItem>
                    <SelectItem value="43200" className="text-gray-900 dark:text-white">30 dias</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Período de validade dos tokens após a emissão. Tokens de longa duração representam riscos de segurança.
                </p>
              </div>
              
              {currentConfig.authMethod === 'jwt' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="jwt-refresh" className="text-gray-700 dark:text-gray-300">Permitir Token de Refresh</Label>
                    <Switch id="jwt-refresh" defaultChecked className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Habilita o uso de refresh tokens para renovar tokens expirados sem exigir reautenticação.
                  </p>
                </div>
              )}
              
              {currentConfig.authMethod === 'oauth' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="redirect-uri" className="text-gray-700 dark:text-gray-300">URIs de Redirecionamento Permitidas</Label>
                    <Input 
                      id="redirect-uri"
                      placeholder="https://exemplo.com/callback"
                      defaultValue="https://app.exemplo.com/callback,https://dev.exemplo.com/callback"
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      URIs para onde o usuário pode ser redirecionado após autenticação (separadas por vírgula).
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Escopos Disponíveis</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">read:patients</Badge>
                      <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">write:patients</Badge>
                      <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">read:appointments</Badge>
                      <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">write:appointments</Badge>
                      <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">read:staff</Badge>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-6 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
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
                className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
              >
                Salvar Configurações
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-base text-gray-900 dark:text-white">Segurança Adicional</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Configurações adicionais de segurança para autenticação da API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Rotação Automática de Segredos</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Rotacionar automaticamente segredos e chaves a cada 90 dias
                  </p>
                </div>
                <Switch defaultChecked className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400" />
              </div>
              
              <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Limite de Tentativas</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Bloquear IPs após 10 tentativas falhas de autenticação
                  </p>
                </div>
                <Switch defaultChecked className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400" />
              </div>
              
              <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">CORS Restrito</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Permitir apenas domínios específicos para fazer requisições cross-origin
                  </p>
                </div>
                <Switch defaultChecked className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400" />
              </div>
              
              <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Logs Detalhados</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Registrar todas as requisições de autenticação para auditoria
                  </p>
                </div>
                <Switch defaultChecked className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="mt-4">
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <CardTitle className="text-base text-gray-900 dark:text-white">Tokens Ativos</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Gerencie tokens de API ativos e suas permissões
                  </CardDescription>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white">
                      <KeyIcon className="h-4 w-4 mr-2" />
                      Gerar Novo Token
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    {!showNewToken ? (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-gray-900 dark:text-white">Criar Novo Token de API</DialogTitle>
                          <DialogDescription className="text-gray-500 dark:text-gray-400">
                            Forneça um nome descritivo e selecione o período de validade.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="token-name" className="text-gray-700 dark:text-gray-300">Nome do Token</Label>
                            <Input
                              id="token-name"
                              placeholder="Ex: Integração MobileApp"
                              value={newTokenName}
                              onChange={(e) => setNewTokenName(e.target.value)}
                              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="token-expiry" className="text-gray-700 dark:text-gray-300">Validade</Label>
                            <Select
                              value={newTokenExpiry}
                              onValueChange={setNewTokenExpiry}
                            >
                              <SelectTrigger id="token-expiry" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                                <SelectValue placeholder="Selecione o período" />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectItem value="30" className="text-gray-900 dark:text-white">30 dias</SelectItem>
                                <SelectItem value="90" className="text-gray-900 dark:text-white">90 dias</SelectItem>
                                <SelectItem value="180" className="text-gray-900 dark:text-white">180 dias</SelectItem>
                                <SelectItem value="365" className="text-gray-900 dark:text-white">1 ano</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">Permissões</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center space-x-2">
                                <Switch id="perm-read" defaultChecked className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400" />
                                <Label htmlFor="perm-read" className="text-gray-700 dark:text-gray-300">Leitura</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="perm-write" className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400" />
                                <Label htmlFor="perm-write" className="text-gray-700 dark:text-gray-300">Escrita</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="perm-admin" className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400" />
                                <Label htmlFor="perm-admin" className="text-gray-700 dark:text-gray-300">Admin</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="perm-billing" className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400" />
                                <Label htmlFor="perm-billing" className="text-gray-700 dark:text-gray-300">Faturamento</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={closeTokenDialog}
                            className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            Cancelar
                          </Button>
                          <Button 
                            onClick={mockCreateToken} 
                            disabled={!newTokenName || isSaving}
                            className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
                          >
                            {isSaving ? 'Gerando...' : 'Gerar Token'}
                          </Button>
                        </DialogFooter>
                      </>
                    ) : (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-gray-900 dark:text-white">Token Gerado com Sucesso</DialogTitle>
                          <DialogDescription className="text-gray-500 dark:text-gray-400">
                            Copie este token agora. Por segurança, ele não será exibido novamente.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md font-mono text-sm break-all border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                            {newToken}
                          </div>
                          <div className="flex justify-center mt-4">
                            <Button 
                              variant="outline" 
                              className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                              onClick={copyTokenToClipboard}
                            >
                              {copySuccess ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
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
                          <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                            <Info className="h-4 w-4 mr-1" />
                            <span>Este token não será exibido novamente</span>
                          </div>
                          <Button 
                            onClick={closeTokenDialog}
                            className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
                          >
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
              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                    <TableRow className="border-gray-200 dark:border-gray-700">
                      <TableHead className="text-gray-700 dark:text-gray-300">Nome</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Criado</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Expira</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Último Uso</TableHead>
                      <TableHead className="text-right text-gray-700 dark:text-gray-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTokens.map((token) => (
                      <TableRow key={token.id} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium text-gray-900 dark:text-white">
                          {token.name}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {token.scopes.map(scope => (
                              <Badge key={scope} variant="outline" className="text-xs border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                                {scope}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">{new Date(token.created).toLocaleDateString()}</TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">{new Date(token.expires).toLocaleDateString()}</TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">{new Date(token.lastUsed).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
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