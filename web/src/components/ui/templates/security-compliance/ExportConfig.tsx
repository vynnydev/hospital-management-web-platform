/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Switch } from '@/components/ui/organisms/switch';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Checkbox } from '@/components/ui/organisms/checkbox';
import { useToast } from '@/components/ui/hooks/use-toast';
import { FileDown, Clock, RefreshCw } from 'lucide-react';
import { TLogCategory } from '@/types/security-compliance-types';

interface ExportConfigProps {
  exportConfig: {
    id: string;
    enabled: boolean;
    format: 'json' | 'csv' | 'syslog';
    destination: 'email' | 'sftp' | 'api' | 's3';
    destinationConfig: Record<string, any>;
    frequency: 'daily' | 'weekly' | 'monthly' | 'realtime';
    includeCategories: TLogCategory[];
    createdAt: string;
    updatedAt: string;
  };
  updateExportConfig: (config: any) => Promise<any>;
  loading: boolean;
}

export const ExportConfig: React.FC<ExportConfigProps> = ({
  exportConfig,
  updateExportConfig,
  loading
}) => {
  const [config, setConfig] = useState(exportConfig);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateExportConfig(config);
      
      toast({
        title: "Configurações de exportação atualizadas",
        description: "As configurações de exportação de logs foram salvas com sucesso.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações de exportação.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCategoryToggle = (category: TLogCategory, checked: boolean) => {
    if (checked) {
      setConfig({
        ...config,
        includeCategories: [...config.includeCategories, category]
      });
    } else {
      setConfig({
        ...config,
        includeCategories: config.includeCategories.filter(c => c !== category)
      });
    }
  };

  // Render appropriate destination config fields based on destination type
  const renderDestinationConfig = () => {
    switch (config.destination) {
      case 'email':
        return (
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Endereço de Email</Label>
            <Input 
              id="email" 
              type="email"
              value={config.destinationConfig.email || ''}
              onChange={(e) => setConfig({
                ...config,
                destinationConfig: {
                  ...config.destinationConfig,
                  email: e.target.value
                }
              })}
              placeholder="exemplo@dominio.com"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="compress"
                checked={config.destinationConfig.compress}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  destinationConfig: {
                    ...config.destinationConfig,
                    compress: checked === true
                  }
                })}
                className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
              />
              <Label htmlFor="compress" className="text-gray-700 dark:text-gray-300">Comprimir arquivo</Label>
            </div>
          </div>
        );
      
      case 'sftp':
        return (
          <div className="space-y-2">
            <Label htmlFor="host" className="text-gray-700 dark:text-gray-300">Servidor SFTP</Label>
            <Input 
              id="host" 
              value={config.destinationConfig.host || ''}
              onChange={(e) => setConfig({
                ...config,
                destinationConfig: {
                  ...config.destinationConfig,
                  host: e.target.value
                }
              })}
              placeholder="sftp.example.com"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="port" className="text-gray-700 dark:text-gray-300">Porta</Label>
                <Input 
                  id="port" 
                  value={config.destinationConfig.port || '22'}
                  onChange={(e) => setConfig({
                    ...config,
                    destinationConfig: {
                      ...config.destinationConfig,
                      port: e.target.value
                    }
                  })}
                  placeholder="22"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="path" className="text-gray-700 dark:text-gray-300">Caminho</Label>
                <Input 
                  id="path" 
                  value={config.destinationConfig.path || '/logs'}
                  onChange={(e) => setConfig({
                    ...config,
                    destinationConfig: {
                      ...config.destinationConfig,
                      path: e.target.value
                    }
                  })}
                  placeholder="/logs"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">Usuário</Label>
            <Input 
              id="username" 
              value={config.destinationConfig.username || ''}
              onChange={(e) => setConfig({
                ...config,
                destinationConfig: {
                  ...config.destinationConfig,
                  username: e.target.value
                }
              })}
              placeholder="sftp_user"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
            
            <div className="flex justify-between items-center pt-1">
              <Label htmlFor="auth_type" className="text-gray-700 dark:text-gray-300">Tipo de Autenticação</Label>
              <Select
                value={config.destinationConfig.auth_type || 'password'}
                onValueChange={(value) => setConfig({
                  ...config,
                  destinationConfig: {
                    ...config.destinationConfig,
                    auth_type: value
                  }
                })}
              >
                <SelectTrigger id="auth_type" className="w-[150px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="password" className="text-gray-900 dark:text-white">Senha</SelectItem>
                  <SelectItem value="key" className="text-gray-900 dark:text-white">Chave SSH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 's3':
        return (
          <div className="space-y-2">
            <Label htmlFor="bucket" className="text-gray-700 dark:text-gray-300">Bucket S3</Label>
            <Input 
              id="bucket" 
              value={config.destinationConfig.bucket || ''}
              onChange={(e) => setConfig({
                ...config,
                destinationConfig: {
                  ...config.destinationConfig,
                  bucket: e.target.value
                }
              })}
              placeholder="my-logs-bucket"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
            
            <Label htmlFor="prefix" className="text-gray-700 dark:text-gray-300">Prefixo</Label>
            <Input 
              id="prefix" 
              value={config.destinationConfig.prefix || 'audit-logs/'}
              onChange={(e) => setConfig({
                ...config,
                destinationConfig: {
                  ...config.destinationConfig,
                  prefix: e.target.value
                }
              })}
              placeholder="audit-logs/"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
            
            <Label htmlFor="region" className="text-gray-700 dark:text-gray-300">Região</Label>
            <Input 
              id="region" 
              value={config.destinationConfig.region || 'us-east-1'}
              onChange={(e) => setConfig({
                ...config,
                destinationConfig: {
                  ...config.destinationConfig,
                  region: e.target.value
                }
              })}
              placeholder="us-east-1"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        );
      
      case 'api':
        return (
          <div className="space-y-2">
            <Label htmlFor="url" className="text-gray-700 dark:text-gray-300">URL da API</Label>
            <Input 
              id="url" 
              value={config.destinationConfig.url || ''}
              onChange={(e) => setConfig({
                ...config,
                destinationConfig: {
                  ...config.destinationConfig,
                  url: e.target.value
                }
              })}
              placeholder="https://api.example.com/logs"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
            
            <Label htmlFor="auth_type" className="text-gray-700 dark:text-gray-300">Tipo de Autenticação</Label>
            <Select
              value={config.destinationConfig.auth_type || 'bearer'}
              onValueChange={(value) => setConfig({
                ...config,
                destinationConfig: {
                  ...config.destinationConfig,
                  auth_type: value
                }
              })}
            >
              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectItem value="none" className="text-gray-900 dark:text-white">Nenhuma</SelectItem>
                <SelectItem value="bearer" className="text-gray-900 dark:text-white">Bearer Token</SelectItem>
                <SelectItem value="basic" className="text-gray-900 dark:text-white">Basic Auth</SelectItem>
                <SelectItem value="apikey" className="text-gray-900 dark:text-white">API Key</SelectItem>
              </SelectContent>
            </Select>
            
            {config.destinationConfig.auth_type === 'bearer' && (
              <div className="pt-2">
                <Label htmlFor="token" className="text-gray-700 dark:text-gray-300">Bearer Token</Label>
                <Input
                  id="token"
                  type="password"
                  value={config.destinationConfig.token || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    destinationConfig: {
                      ...config.destinationConfig,
                      token: e.target.value
                    }
                  })}
                  placeholder="Token de autenticação"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <FileDown className="h-5 w-5 text-primary dark:text-primary-400" />
              Exportação de Logs
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Configure como os logs de auditoria são exportados
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
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="format" className="text-gray-700 dark:text-gray-300">Formato</Label>
                <Select
                  value={config.format}
                  onValueChange={(value: 'json' | 'csv' | 'syslog') => setConfig({
                    ...config,
                    format: value
                  })}
                  disabled={!config.enabled}
                >
                  <SelectTrigger id="format" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Selecione um formato" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem value="json" className="text-gray-900 dark:text-white">JSON</SelectItem>
                    <SelectItem value="csv" className="text-gray-900 dark:text-white">CSV</SelectItem>
                    <SelectItem value="syslog" className="text-gray-900 dark:text-white">Syslog</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frequency" className="text-gray-700 dark:text-gray-300">Frequência</Label>
                <Select
                  value={config.frequency}
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'realtime') => setConfig({
                    ...config,
                    frequency: value
                  })}
                  disabled={!config.enabled}
                >
                  <SelectTrigger id="frequency" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Selecione uma frequência" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem value="realtime" className="text-gray-900 dark:text-white">Tempo Real</SelectItem>
                    <SelectItem value="daily" className="text-gray-900 dark:text-white">Diário</SelectItem>
                    <SelectItem value="weekly" className="text-gray-900 dark:text-white">Semanal</SelectItem>
                    <SelectItem value="monthly" className="text-gray-900 dark:text-white">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination" className="text-gray-700 dark:text-gray-300">Destino</Label>
              <Select
                value={config.destination}
                onValueChange={(value: 'email' | 'sftp' | 'api' | 's3') => setConfig({
                  ...config,
                  destination: value,
                  // Reset destination config when destination changes
                  destinationConfig: {}
                })}
                disabled={!config.enabled}
              >
                <SelectTrigger id="destination" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Selecione um destino" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="email" className="text-gray-900 dark:text-white">Email</SelectItem>
                  <SelectItem value="sftp" className="text-gray-900 dark:text-white">SFTP</SelectItem>
                  <SelectItem value="s3" className="text-gray-900 dark:text-white">Amazon S3</SelectItem>
                  <SelectItem value="api" className="text-gray-900 dark:text-white">API Externa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {renderDestinationConfig()}
            
            <div className="space-y-2 pt-2">
              <Label className="text-gray-700 dark:text-gray-300">Categorias a Incluir</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'authentication', label: 'Autenticação' },
                  { id: 'data_access', label: 'Acesso a Dados' },
                  { id: 'system_config', label: 'Configuração do Sistema' },
                  { id: 'patient_data', label: 'Dados de Pacientes' },
                  { id: 'admin_action', label: 'Ações Administrativas' },
                  { id: 'security', label: 'Segurança' }
                ].map((category) => (
                  <div key={category.id} className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <Checkbox
                      id={`export-category-${category.id}`}
                      checked={config.includeCategories.includes(category.id as TLogCategory)}
                      onCheckedChange={(checked) => 
                        handleCategoryToggle(category.id as TLogCategory, checked as boolean)
                      }
                      disabled={!config.enabled}
                      className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                    />
                    <Label htmlFor={`export-category-${category.id}`} className="text-gray-700 dark:text-gray-300">{category.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {config.enabled && config.destination === 'email' && config.frequency === 'realtime' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800 flex items-start">
            <RefreshCw className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Cuidado: Alta frequência de emails</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Configurar exportações por email em tempo real pode gerar um grande volume de emails.
                Considere uma frequência menor ou um destino mais apropriado para exportação em tempo real.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            Última atualização: {new Date(config.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={loading || isSaving || !config.enabled}
          className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
        >
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </CardFooter>
    </Card>
  );
};