/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Link, Download, Upload, Code } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';

interface IConnectionFormProps {
  onConnect?: (connectionData: any) => void;
  onExport?: (format: string) => void;
  onImport?: (file: File) => void;
  onViewDocs?: () => void;
}

export const ConnectionForm: React.FC<IConnectionFormProps> = ({
  onConnect,
  onExport,
  onImport,
  onViewDocs
}) => {
  return (
    <div className="lg:col-span-1 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5 text-blue-500" />
            Nova Conexão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL de Conexão
            </label>
            <Input placeholder="https://api.sistema.com/v1" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Método de Autenticação
            </label>
            <Select defaultValue="oauth">
              <SelectTrigger>
                <SelectValue placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                <SelectItem value="basic">Basic Auth</SelectItem>
                <SelectItem value="apikey">API Key</SelectItem>
                <SelectItem value="oauth">OAuth 2.0</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Credenciais
            </label>
            <div className="space-y-2">
              <Input placeholder="Client ID" />
              <Input type="password" placeholder="Client Secret" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Intervalo de Sincronização
            </label>
            <Select defaultValue="hour">
              <SelectTrigger>
                <SelectValue placeholder="Selecione o intervalo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Tempo real</SelectItem>
                <SelectItem value="minute">A cada 15 minutos</SelectItem>
                <SelectItem value="hour">A cada hora</SelectItem>
                <SelectItem value="day">Uma vez ao dia</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-2"
            onClick={() => onConnect && onConnect({})}
          >
            <Link className="h-4 w-4 mr-2" />
            Adicionar Conexão
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Opções Avançadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Exportar Dados
            </label>
            <Select defaultValue="json">
              <SelectTrigger>
                <SelectValue placeholder="Formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="fhir">FHIR</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              className="mt-2 w-full"
              onClick={() => onExport && onExport('json')}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Importar Configurações
            </label>
            <div className="flex mt-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  // Simulação de clique no input de arquivo
                  const fileInput = document.createElement('input');
                  fileInput.type = 'file';
                  fileInput.addEventListener('change', (e) => {
                    const target = e.target as HTMLInputElement;
                    const file = target.files?.[0];
                    if (file && onImport) {
                      onImport(file);
                    }
                  });
                  fileInput.click();
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Selecionar Arquivo
              </Button>
            </div>
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
  );
};