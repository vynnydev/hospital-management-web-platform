/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Switch } from '@/components/ui/organisms/switch';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/organisms/accordion';
import { Checkbox } from '@/components/ui/organisms/checkbox';
import { Avatar } from '@/components/ui/organisms/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/organisms/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Badge } from '@/components/ui/organisms/badge';
import { Info, Timer, LogIn, LogOut, Lock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/hooks/use-toast';
import { ISessionConfig } from '@/types/security-compliance-types';

interface SessionManagementTabProps {
  sessionConfig: ISessionConfig | undefined;
  updateSessionConfig: (config: any) => Promise<any>;
  loading: boolean;
}

export const SessionManagementTab: React.FC<SessionManagementTabProps> = ({
  sessionConfig,
  updateSessionConfig,
  loading
}) => {
  const defaultSessionConfig: ISessionConfig = {
    id: 'session-config',
    sessionTimeout: 30,
    extendOnActivity: true,
    singleSession: false,
    enforceSingleDevice: false,
    forceReauthForSensitive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const [config, setConfig] = useState<ISessionConfig>(sessionConfig || defaultSessionConfig);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateSessionConfig(config);
      
      toast({
        title: "Configurações de sessão atualizadas",
        description: "Configurações de sessão salvas com sucesso.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações de sessão.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer size={18} />
            Gerenciamento de Sessão
          </CardTitle>
          <CardDescription>
            Configure como as sessões de usuário são gerenciadas
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Timeout de sessão</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="sessionTimeout" 
                  type="number"
                  min={0}
                  max={1440}
                  value={config.sessionTimeout} 
                  onChange={(e) => setConfig({
                    ...config,
                    sessionTimeout: parseInt(e.target.value)
                  })}
                  required
                />
                <div className="text-sm text-gray-500">minutos</div>
              </div>
              <p className="text-xs text-gray-500">
                Tempo de inatividade até encerramento automático da sessão (0 = sem timeout)
              </p>
            </div>
            
            <div className="space-y-2 flex items-center justify-between p-2 border rounded-md">
              <div>
                <Label htmlFor="extendOnActivity" className="font-medium">Estender sessão em atividade</Label>
                <p className="text-xs text-gray-500">
                  Reinicia o timer de timeout quando o usuário interage com o sistema
                </p>
              </div>
              <Switch
                id="extendOnActivity"
                checked={config.extendOnActivity}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  extendOnActivity: checked
                })}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Restrições de sessão</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <Label htmlFor="singleSession" className="font-medium">Sessão única por usuário</Label>
                  <p className="text-xs text-gray-500">
                    Permitir apenas uma sessão ativa por usuário (fazer logout de outros logins)
                  </p>
                </div>
                <Switch
                  id="singleSession"
                  checked={config.singleSession}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    singleSession: checked,
                    // Se ativar sessão única, desativar forçar único dispositivo (está implícito)
                    enforceSingleDevice: checked ? false : config.enforceSingleDevice
                  })}
                />
              </div>
              
              <div className={`flex items-center justify-between p-2 border rounded-md ${
                config.singleSession ? 'opacity-50 pointer-events-none' : ''
              }`}>
                <div>
                  <Label htmlFor="enforceSingleDevice" className="font-medium">Forçar logout em outros dispositivos</Label>
                  <p className="text-xs text-gray-500">
                    Fazer logout automático em outros dispositivos quando o usuário faz login
                  </p>
                </div>
                <Switch
                  id="enforceSingleDevice"
                  checked={config.enforceSingleDevice}
                  disabled={config.singleSession}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    enforceSingleDevice: checked
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <Label htmlFor="forceReauthForSensitive" className="font-medium">Reautenticação para ações sensíveis</Label>
                  <p className="text-xs text-gray-500">
                    Solicitar senha novamente para realizar ações críticas
                  </p>
                </div>
                <Switch
                  id="forceReauthForSensitive"
                  checked={config.forceReauthForSensitive}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    forceReauthForSensitive: checked
                  })}
                />
              </div>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="sensitive-actions">
              <AccordionTrigger>Ações sensíveis que exigem reautenticação</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="action-personal-data" defaultChecked />
                    <Label htmlFor="action-personal-data">Alteração de dados pessoais</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="action-security" defaultChecked />
                    <Label htmlFor="action-security">Configurações de segurança</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="action-roles" defaultChecked />
                    <Label htmlFor="action-roles">Alteração de papéis/permissões</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="action-bulk-data" defaultChecked />
                    <Label htmlFor="action-bulk-data">Exportação de dados em massa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="action-delete" defaultChecked />
                    <Label htmlFor="action-delete">Operações de exclusão</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="action-financial" defaultChecked />
                    <Label htmlFor="action-financial">Transações financeiras</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="action-hipaa" defaultChecked />
                    <Label htmlFor="action-hipaa">Acesso a dados sensíveis (LGPD)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="action-medical" defaultChecked />
                    <Label htmlFor="action-medical">Prescrições médicas</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Info size={16} className="mr-1" />
            <span>A sessão atual será mantida após salvar as alterações</span>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={loading || isSaving}
          >
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActiveSessionsCard />
        <EmergencyActionsCard />
      </div>
    </div>
  );
};

// Componente para o card de sessões ativas
const ActiveSessionsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <LogIn size={18} />
          Sessões Ativas
        </CardTitle>
        <CardDescription>
          Visualize e gerencie as sessões de usuário ativas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span>Sessões ativas no momento:</span>
            <Badge>134</Badge>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium">Top 5 usuários por sessões:</div>
            
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center">
                      MA
                    </div>
                  </Avatar>
                  <div>Maria Almeida (Médico)</div>
                </div>
                <Badge variant="outline">3 sessões</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center">
                      CS
                    </div>
                  </Avatar>
                  <div>Carlos Silva (Administrador)</div>
                </div>
                <Badge variant="outline">2 sessões</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center">
                      JP
                    </div>
                  </Avatar>
                  <div>Julia Pereira (Enfermeiro)</div>
                </div>
                <Badge variant="outline">2 sessões</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Ver Todas as Sessões
        </Button>
      </CardFooter>
    </Card>
  );
};

// Componente para o card de ações de emergência
const EmergencyActionsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <LogOut size={18} />
          Ações de Emergência
        </CardTitle>
        <CardDescription>
          Ações de segurança para situações críticas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-700">Atenção!</p>
            <p className="text-xs text-yellow-600">
              Estas ações afetam todos os usuários e devem ser usadas apenas em situações de segurança críticas.
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-between">
                <span>Encerrar todas as sessões</span>
                <LogOut size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Encerrar todas as sessões</DialogTitle>
                <DialogDescription>
                  Esta ação desconectará todos os usuários do sistema. Todos precisarão fazer login novamente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-red-50 p-3 rounded-md border border-red-200 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700">Atenção!</p>
                    <p className="text-xs text-red-600">
                      Esta é uma ação disruptiva. Use apenas em caso de suspeita de comprometimento do sistema.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmation-logout">Digite &quot;CONFIRMAR&quot; para prosseguir:</Label>
                  <Input id="confirmation-logout" placeholder="CONFIRMAR" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost">Cancelar</Button>
                <Button variant="destructive">Encerrar Todas as Sessões</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-between">
                <span>Bloquear novos logins</span>
                <Lock size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bloquear novos logins</DialogTitle>
                <DialogDescription>
                  Esta ação impedirá qualquer novo login no sistema, mantendo apenas as sessões existentes.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-red-50 p-3 rounded-md border border-red-200 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700">Atenção!</p>
                    <p className="text-xs text-red-600">
                      Isto pode impedir acesso legítimo ao sistema. Use com cautela.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockout-duration">Duração do bloqueio:</Label>
                  <Select defaultValue="60">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a duração" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="240">4 horas</SelectItem>
                      <SelectItem value="720">12 horas</SelectItem>
                      <SelectItem value="1440">24 horas</SelectItem>
                      <SelectItem value="0">Indefinido (até desbloquear manualmente)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exception-role">Exceção para papel:</Label>
                  <Select defaultValue="admin">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o papel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administradores</SelectItem>
                      <SelectItem value="none">Nenhum (bloquear todos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmation-block">Digite &quot;CONFIRMAR&quot; para prosseguir:</Label>
                  <Input id="confirmation-block" placeholder="CONFIRMAR" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost">Cancelar</Button>
                <Button variant="destructive">Bloquear Novos Logins</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};