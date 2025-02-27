import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/organisms/dialog';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Switch } from '@/components/ui/organisms/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { FileSignature, Key, Settings, Users, Shield, FileText } from 'lucide-react';

interface DocSignConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocSignConfigurationDialog: React.FC<DocSignConfigurationDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [apiKey, setApiKey] = useState('d45fg7h8j9k0**********************');
  const [settings, setSettings] = useState({
    autoSign: true,
    requireAuthentication: true,
    storeDocuments: true,
    notifyOnSign: true,
    allowBulkSign: false,
    useElectronicSignature: true,
    allowAnnotations: true,
    enforceSequentialSigning: false,
  });

  const handleToggleSetting = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-50 dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileSignature className="h-6 w-6 text-teal-600" />
            Configuração do DocSign
          </DialogTitle>
          <DialogDescription>
            Configure os parâmetros da integração DocSign para assinatura de documentos médicos.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Geral</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-1">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Permissões</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">Assinatura Automática</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Finaliza assinaturas automaticamente em documentos padrão
                  </p>
                </div>
                <Switch
                  checked={settings.autoSign}
                  onCheckedChange={() => handleToggleSetting('autoSign')}
                />
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">Autenticação de Dois Fatores</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Requer autenticação dupla para assinaturas
                  </p>
                </div>
                <Switch
                  checked={settings.requireAuthentication}
                  onCheckedChange={() => handleToggleSetting('requireAuthentication')}
                />
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">Armazenamento de Documentos</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Armazena cópias assinadas dos documentos
                  </p>
                </div>
                <Switch
                  checked={settings.storeDocuments}
                  onCheckedChange={() => handleToggleSetting('storeDocuments')}
                />
              </div>

              <div className="flex items-center justify-between pb-2">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">Notificações</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Notifica todas as partes quando um documento é assinado
                  </p>
                </div>
                <Switch
                  checked={settings.notifyOnSign}
                  onCheckedChange={() => handleToggleSetting('notifyOnSign')}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="api" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Chave API</Label>
                <div className="flex">
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" className="ml-2">
                    Regenerar
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Mantenha essa chave segura. Ela garante acesso aos serviços DocSign.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL de Webhook</Label>
                <Input
                  id="webhook-url"
                  defaultValue="https://seu-hospital.com/api/docSign/webhook"
                  readOnly
                />
                <p className="text-xs text-gray-500">
                  Endpoint para receber notificações de eventos do DocSign.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Serviços Habilitados</h4>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="e-sign" className="h-4 w-4" defaultChecked />
                    <label htmlFor="e-sign" className="text-sm text-gray-700 dark:text-gray-300">
                      Assinatura Eletrônica
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="template-api" className="h-4 w-4" defaultChecked />
                    <label htmlFor="template-api" className="text-sm text-gray-700 dark:text-gray-300">
                      API de Templates
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="bulk-send" className="h-4 w-4" />
                    <label htmlFor="bulk-send" className="text-sm text-gray-700 dark:text-gray-300">
                      Envio em Massa
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="mt-4 space-y-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Tipos de Documentos Permitidos</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="protocols" className="h-4 w-4" defaultChecked />
                  <label htmlFor="protocols" className="text-sm">Protocolos Clínicos</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="reports" className="h-4 w-4" defaultChecked />
                  <label htmlFor="reports" className="text-sm">Relatórios Médicos</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="consent" className="h-4 w-4" defaultChecked />
                  <label htmlFor="consent" className="text-sm">Termos de Consentimento</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="prescriptions" className="h-4 w-4" defaultChecked />
                  <label htmlFor="prescriptions" className="text-sm">Prescrições</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="discharge" className="h-4 w-4" defaultChecked />
                  <label htmlFor="discharge" className="text-sm">Documentos de Alta</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="admin" className="h-4 w-4" />
                  <label htmlFor="admin" className="text-sm">Documentos Administrativos</label>
                </div>
              </div>

              <h4 className="text-sm font-medium mt-4">Funções com Permissão</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Médicos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Assinar, Visualizar, Enviar</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      Editar
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Enfermeiros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Visualizar, Enviar</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      Editar
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Administradores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Assinar, Visualizar, Enviar, Gerenciar</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Templates Disponíveis</h4>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Adicionar Template
                </Button>
              </div>
              
              <div className="border rounded-md">
                <div className="grid grid-cols-[1fr,auto] border-b py-2 px-3">
                  <div>
                    <h5 className="text-sm font-medium">Termo de Consentimento Cirúrgico</h5>
                    <p className="text-xs text-gray-500">Para procedimentos cirúrgicos</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">Editar</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">Ver</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-[1fr,auto] border-b py-2 px-3">
                  <div>
                    <h5 className="text-sm font-medium">Prescrição de Medicamentos</h5>
                    <p className="text-xs text-gray-500">Template de prescrição padrão</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">Editar</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">Ver</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-[1fr,auto] py-2 px-3">
                  <div>
                    <h5 className="text-sm font-medium">Protocolo de Alta Hospitalar</h5>
                    <p className="text-xs text-gray-500">Documentação de alta padrão</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">Editar</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">Ver</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => onOpenChange(false)}
          >
            Salvar Configurações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};