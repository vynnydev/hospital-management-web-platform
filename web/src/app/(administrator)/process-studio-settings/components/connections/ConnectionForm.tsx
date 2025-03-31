/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link, Download, Upload, Code, AlertCircle, X, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/organisms/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/organisms/accordion';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/organisms/tabs';
import { Badge } from '@/components/ui/organisms/badge';
import { Alert, AlertDescription } from '@/components/ui/organisms/alert';
import { ISystemConnector } from '@/types/connectors-types';
import { Spinner } from '@/components/ui/organisms/spinner';


// Tipos de dados que podem ser importados
const IMPORT_FORMATS = [
  { value: 'excel', label: 'Planilha Excel (.xlsx, .xls)', accept: '.xlsx,.xls' },
  { value: 'csv', label: 'CSV (.csv)', accept: '.csv' },
  { value: 'json', label: 'JSON (.json)', accept: '.json' },
  { value: 'xml', label: 'XML (.xml)', accept: '.xml' },
  { value: 'fhir', label: 'FHIR (.json)', accept: '.json' }
];

// Tipos de dados que podem ser exportados
const EXPORT_FORMATS = [
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'csv', label: 'CSV' },
  { value: 'fhir', label: 'FHIR' }
];

// Métodos de autenticação disponíveis
const AUTH_METHODS = [
  { value: 'none', label: 'Nenhum' },
  { value: 'basic', label: 'Basic Auth' },
  { value: 'apikey', label: 'API Key' },
  { value: 'oauth', label: 'OAuth 2.0' }
];

// Intervalos de sincronização disponíveis
const SYNC_INTERVALS = [
  { value: 'realtime', label: 'Tempo real' },
  { value: 'minute', label: 'A cada 15 minutos' },
  { value: 'hour', label: 'A cada hora' },
  { value: 'day', label: 'Uma vez ao dia' },
  { value: 'manual', label: 'Manual' }
];

interface ConnectionFormProps {
  onConnect?: (connectionData: Omit<ISystemConnector, 'id'>) => void;
  onExport?: (format: 'json' | 'xml' | 'csv' | 'fhir') => void;
  onImport?: (file: File) => void;
  onViewDocs?: () => void;
  isLoading?: boolean;
}

export const ConnectionForm: React.FC<ConnectionFormProps> = ({
  onConnect,
  onExport,
  onImport,
  onViewDocs,
  isLoading = false
}) => {
  // Estado para rastrear a guia ativa
  const [activeTab, setActiveTab] = useState<'api' | 'file'>('api');
  
  // Estado para o método de autenticação selecionado
  const [authMethod, setAuthMethod] = useState<'none' | 'basic' | 'apikey' | 'oauth'>('oauth');
  
  // Estado para o formato de exportação selecionado
  const [exportFormat, setExportFormat] = useState<'json' | 'xml' | 'csv' | 'fhir'>('json');
  
  // Estado para o formato de importação selecionado
  const [importFormat, setImportFormat] = useState<'excel' | 'csv' | 'json' | 'xml' | 'fhir'>('excel');
  
  // Estado para rastrear se o arquivo foi selecionado
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Estado para os campos de mapeamento personalizados
  const [customMappings, setCustomMappings] = useState<Array<{ source: string; target: string }>>([
    { source: '', target: '' }
  ]);
  
  // Estado para os campos do formulário de API
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    authMethod: 'oauth',
    clientId: '',
    clientSecret: '',
    apiKey: '',
    syncInterval: 'hour',
    description: ''
  });
  
  // Manipulador de alteração de entrada
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manipulador para adicionar um novo mapeamento de campo
  const handleAddMapping = () => {
    setCustomMappings(prev => [...prev, { source: '', target: '' }]);
  };
  
  // Manipulador para remover um mapeamento de campo
  const handleRemoveMapping = (index: number) => {
    setCustomMappings(prev => prev.filter((_, i) => i !== index));
  };
  
  // Manipulador para atualizar um mapeamento de campo
  const handleUpdateMapping = (index: number, field: 'source' | 'target', value: string) => {
    setCustomMappings(prev => prev.map((mapping, i) => {
      if (i === index) {
        return {
          ...mapping,
          [field]: value
        };
      }
      return mapping;
    }));
  };
  
  // Manipulador para seleção de arquivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Verificar se o manipulador de importação existe
      if (onImport) {
        onImport(file);
      }
    }
  };
  
  // Manipulador para envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'api' && onConnect) {
      // Transformar dados do formulário para o formato esperado pelo serviço
      const connectionData: Omit<ISystemConnector, 'id'> = {
        name: formData.name,
        type: 'api',
        iconType: 'database', // Valor padrão, poderia ser selecionável pelo usuário
        status: 'pending',
        lastSync: null,
        connectionDetails: {
          url: formData.url,
          authMethod: authMethod,
          syncInterval: formData.syncInterval as 'realtime' | 'minute' | 'hour' | 'day' | 'manual',
          credentials: {}
        },
        metadata: {
          description: formData.description
        }
      };
      
      // Adicionar credenciais com base no método de autenticação
      if (authMethod === 'basic' || authMethod === 'oauth') {
        connectionData.connectionDetails.credentials = {
          clientId: formData.clientId,
          clientSecret: formData.clientSecret
        };
      } else if (authMethod === 'apikey') {
        connectionData.connectionDetails.credentials = {
          apiKey: formData.apiKey
        };
      }
      
      onConnect(connectionData);
    }
  };
  
  // Encontrar o objeto de formato de importação selecionado
  const selectedImportFormat = IMPORT_FORMATS.find(format => format.value === importFormat);
  
  return (
    <div className="lg:col-span-1 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5 text-blue-500" />
            Nova Conexão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'api' | 'file')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="file">Arquivo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="api">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Conexão</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Sistema de Prontuário Eletrônico" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="url">URL de Conexão</Label>
                  <Input 
                    id="url" 
                    name="url" 
                    placeholder="https://api.sistema.com/v1" 
                    value={formData.url}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="authMethod">Método de Autenticação</Label>
                  <Select 
                    value={authMethod} 
                    onValueChange={(value) => setAuthMethod(value as 'none' | 'basic' | 'apikey' | 'oauth')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUTH_METHODS.map(method => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Campos de credenciais baseados no método de autenticação */}
                {authMethod === 'oauth' || authMethod === 'basic' ? (
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client ID</Label>
                    <Input 
                      id="clientId" 
                      name="clientId" 
                      placeholder="seu_client_id" 
                      value={formData.clientId}
                      onChange={handleInputChange}
                      required={authMethod === 'oauth' || authMethod === 'basic'}
                    />
                    
                    <Label htmlFor="clientSecret">Client Secret</Label>
                    <Input 
                      id="clientSecret" 
                      name="clientSecret" 
                      type="password" 
                      placeholder="••••••••" 
                      value={formData.clientSecret}
                      onChange={handleInputChange}
                      required={authMethod === 'oauth' || authMethod === 'basic'}
                    />
                  </div>
                ) : authMethod === 'apikey' ? (
                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input 
                      id="apiKey" 
                      name="apiKey" 
                      type="password" 
                      placeholder="sua_api_key" 
                      value={formData.apiKey}
                      onChange={handleInputChange}
                      required={authMethod === 'apikey'}
                    />
                  </div>
                ) : null}
                
                <div>
                  <Label htmlFor="syncInterval">Intervalo de Sincronização</Label>
                  <Select 
                    defaultValue="hour"
                    onValueChange={(value) => setFormData(prev => ({ ...prev, syncInterval: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o intervalo" />
                    </SelectTrigger>
                    <SelectContent>
                      {SYNC_INTERVALS.map(interval => (
                        <SelectItem key={interval.value} value={interval.value}>
                          {interval.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Accordion type="single" collapsible>
                  <AccordionItem value="advanced">
                    <AccordionTrigger>Opções avançadas</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div>
                          <Label htmlFor="description">Descrição</Label>
                          <Input 
                            id="description" 
                            name="description" 
                            placeholder="Descreva esta conexão..." 
                            value={formData.description}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        {/* Aqui poderiam ser adicionados outros campos avançados */}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <Link className="h-4 w-4 mr-2" />
                      Adicionar Conexão
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="file">
              <div className="space-y-4">
                <div>
                  <Label>Tipo de Arquivo</Label>
                  <Select 
                    value={importFormat} 
                    onValueChange={(value) => setImportFormat(value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o formato" />
                    </SelectTrigger>
                    <SelectContent>
                      {IMPORT_FORMATS.map(format => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                  <Input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept={selectedImportFormat?.accept || ''}
                    onChange={handleFileSelect}
                  />
                  
                  <div className="space-y-3">
                    <Upload className="h-10 w-10 mx-auto text-gray-400" />
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {selectedFile ? selectedFile.name : 'Arraste ou selecione um arquivo'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedFile 
                          ? `${(selectedFile.size / 1024).toFixed(2)} KB - ${selectedFile.type}`
                          : `Formatos aceitos: ${selectedImportFormat?.accept || '*'}`
                        }
                      </p>
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="outline"
                      className="mx-auto"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={isLoading}
                    >
                      Selecionar Arquivo
                    </Button>
                    
                    {selectedFile && (
                      <Badge variant="outline" className="gap-1 mx-auto">
                        {selectedFile.name}
                        <button 
                          type="button" 
                          className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          onClick={() => setSelectedFile(null)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Accordion type="single" collapsible>
                  <AccordionItem value="mappings">
                    <AccordionTrigger>Mapeamento de campos</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Defina como mapear campos do arquivo para campos do sistema
                        </p>
                        
                        {customMappings.map((mapping, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input
                              placeholder="Campo de origem"
                              value={mapping.source}
                              onChange={(e) => handleUpdateMapping(index, 'source', e.target.value)}
                              className="flex-1"
                            />
                            <span className="text-gray-500">→</span>
                            <Input
                              placeholder="Campo do sistema"
                              value={mapping.target}
                              onChange={(e) => handleUpdateMapping(index, 'target', e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveMapping(index)}
                              disabled={customMappings.length <= 1}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={handleAddMapping}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar mapeamento
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Alert variant="default" className="mt-4 bg-blue-50 dark:bg-blue-900/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Após a importação, nosso sistema analisará o arquivo e sugerirá mapeamentos automáticos de campos semelhantes.
                  </AlertDescription>
                </Alert>
                
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-2"
                  disabled={!selectedFile || isLoading}
                  onClick={() => selectedFile && onImport && onImport(selectedFile)}
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Arquivo
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Opções Avançadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Exportar Dados
            </Label>
            <Select 
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as 'json' | 'xml' | 'csv' | 'fhir')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Formato" />
              </SelectTrigger>
              <SelectContent>
                {EXPORT_FORMATS.map(format => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              className="mt-2 w-full"
              onClick={() => onExport && onExport(exportFormat)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </>
              )}
            </Button>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline" 
              className="w-full text-blue-600 dark:text-blue-400"
              onClick={onViewDocs}
            >
              <Code className="h-4 w-4 mr-2" />
              API Documentação
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}