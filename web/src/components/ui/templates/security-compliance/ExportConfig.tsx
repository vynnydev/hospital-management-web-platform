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
            <Label htmlFor="email">Endereço de Email</Label>
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
              />
              <Label htmlFor="compress">Comprimir arquivo</Label>
            </div>
          </div>
        );
      
      case 'sftp':
        return (
          <div className="space-y-2">
            <Label htmlFor="host">Servidor SFTP</Label>
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
            />
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="port">Porta</Label>
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
                />
              </div>
              <div>
                <Label htmlFor="path">Caminho</Label>
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
                />
              </div>
            </div>
            
            <Label htmlFor="username">Usuário</Label>
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
            />
            
            <div className="flex justify-between items-center pt-1">
              <Label htmlFor="auth_type">Tipo de Autenticação</Label>
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
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="password">Senha</SelectItem>
                  <SelectItem value="key">Chave SSH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 's3':
        return (
          <div className="space-y-2">
            <Label htmlFor="bucket">Bucket S3</Label>
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
            />
            
            <Label htmlFor="prefix">Prefixo</Label>
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
            />
            
            <Label htmlFor="region">Região</Label>
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
            />
          </div>
        );
      
      case 'api':
        return (
          <div className="space-y-2">
            <Label htmlFor="url">URL da API</Label>
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
            />
            
            <Label htmlFor="auth_type">Tipo de Autenticação</Label>
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
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                <SelectItem value="bearer">Bearer Token</SelectItem>
                <SelectItem value="basic">Basic Auth</SelectItem>
                <SelectItem value="apikey">API Key</SelectItem>
              </SelectContent>
            </Select>
            
            {config.destinationConfig.auth_type === 'bearer' && (
              <div className="pt-2">
                <Label htmlFor="token">Bearer Token</Label>
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileDown className="h-5 w-5" />
              Exportação de Logs
            </CardTitle>
            <CardDescription>
              Configure como os logs de auditoria são exportados
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {config.enabled ? 'Ativado' : 'Desativado'}
            </span>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig({
                ...config,
                enabled: checked
              })}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={!config.enabled ? 'opacity-50 pointer-events-none' : ''}>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="format">Formato</Label>
                <Select
                  value={config.format}
                  onValueChange={(value: 'json' | 'csv' | 'syslog') => setConfig({
                    ...config,
                    format: value
                  })}
                  disabled={!config.enabled}
                >
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Selecione um formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="syslog">Syslog</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequência</Label>
                <Select
                  value={config.frequency}
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'realtime') => setConfig({
                    ...config,
                    frequency: value
                  })}
                  disabled={!config.enabled}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Selecione uma frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Tempo Real</SelectItem>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">Destino</Label>
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
                <SelectTrigger id="destination">
                  <SelectValue placeholder="Selecione um destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sftp">SFTP</SelectItem>
                  <SelectItem value="s3">Amazon S3</SelectItem>
                  <SelectItem value="api">API Externa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {renderDestinationConfig()}
            
            <div className="space-y-2 pt-2">
              <Label>Categorias a Incluir</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'authentication', label: 'Autenticação' },
                  { id: 'data_access', label: 'Acesso a Dados' },
                  { id: 'system_config', label: 'Configuração do Sistema' },
                  { id: 'patient_data', label: 'Dados de Pacientes' },
                  { id: 'admin_action', label: 'Ações Administrativas' },
                  { id: 'security', label: 'Segurança' }
                ].map((category) => (
                  <div key={category.id} className="flex items-center space-x-2 p-2 border rounded-md">
                    <Checkbox
                      id={`export-category-${category.id}`}
                      checked={config.includeCategories.includes(category.id as TLogCategory)}
                      onCheckedChange={(checked) => 
                        handleCategoryToggle(category.id as TLogCategory, checked as boolean)
                      }
                      disabled={!config.enabled}
                    />
                    <Label htmlFor={`export-category-${category.id}`}>{category.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {config.enabled && config.destination === 'email' && config.frequency === 'realtime' && (
          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 flex items-start">
            <RefreshCw className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-700">Cuidado: Alta frequência de emails</p>
              <p className="text-xs text-yellow-600">
                Configurar exportações por email em tempo real pode gerar um grande volume de emails.
                Considere uma frequência menor ou um destino mais apropriado para exportação em tempo real.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
        <div className="text-xs text-gray-500 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            Última atualização: {new Date(config.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={loading || isSaving || !config.enabled}
        >
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </CardFooter>
    </Card>
  );
};