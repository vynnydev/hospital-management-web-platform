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
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Timer size={18} className="text-primary dark:text-primary-400" />
            Gerenciamento de Sessão
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Configure como as sessões de usuário são gerenciadas
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout" className="text-gray-700 dark:text-gray-300">Timeout de sessão</Label>
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
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">minutos</div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tempo de inatividade até encerramento automático da sessão (0 = sem timeout)
              </p>
            </div>
            
            <div className="space-y-2 flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
              <div>
                <Label htmlFor="extendOnActivity" className="font-medium text-gray-900 dark:text-white">Estender sessão em atividade</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
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
                className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Restrições de sessão</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                <div>
                  <Label htmlFor="singleSession" className="font-medium text-gray-900 dark:text-white">Sessão única por usuário</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
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
                  className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                />
              </div>
              
              <div className={`flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 ${
                config.singleSession ? 'opacity-50 pointer-events-none' : ''
              }`}>
                <div>
                  <Label htmlFor="enforceSingleDevice" className="font-medium text-gray-900 dark:text-white">Forçar logout em outros dispositivos</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
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
                  className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                />
              </div>
              
              <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                <div>
                  <Label htmlFor="forceReauthForSensitive" className="font-medium text-gray-900 dark:text-white">Reautenticação para ações sensíveis</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
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
                  className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                />
              </div>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full border-gray-200 dark:border-gray-700">
            <AccordionItem value="sensitive-actions" className="border-gray-200 dark:border-gray-700">
              <AccordionTrigger className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300">Ações sensíveis que exigem reautenticação</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="action-personal-data" 
                      defaultChecked 
                      className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                    />
                    <Label htmlFor="action-personal-data" className="text-gray-700 dark:text-gray-300">Alteração de dados pessoais</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="action-security" 
                      defaultChecked 
                      className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                    />
                    <Label htmlFor="action-security" className="text-gray-700 dark:text-gray-300">Configurações de segurança</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="action-roles" 
                      defaultChecked 
                      className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                    />
                    <Label htmlFor="action-roles" className="text-gray-700 dark:text-gray-300">Alteração de papéis/permissões</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="action-bulk-data" 
                      defaultChecked 
                      className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                    />
                    <Label htmlFor="action-bulk-data" className="text-gray-700 dark:text-gray-300">Exportação de dados em massa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="action-delete" 
                      defaultChecked 
                      className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                    />
                    <Label htmlFor="action-delete" className="text-gray-700 dark:text-gray-300">Operações de exclusão</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="action-financial" 
                      defaultChecked 
                      className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                    />
                    <Label htmlFor="action-financial" className="text-gray-700 dark:text-gray-300">Transações financeiras</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="action-hipaa" 
                      defaultChecked 
                      className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                    />
                    <Label htmlFor="action-hipaa" className="text-gray-700 dark:text-gray-300">Acesso a dados sensíveis (LGPD)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="action-medical" 
                      defaultChecked 
                      className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                    />
                    <Label htmlFor="action-medical" className="text-gray-700 dark:text-gray-300">Prescrições médicas</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Info size={16} className="mr-1 text-blue-500 dark:text-blue-400" />
            <span>A sessão atual será mantida após salvar as alterações</span>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={loading || isSaving}
            className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
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
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-gray-900 dark:text-white">
          <LogIn size={18} className="text-primary dark:text-primary-400" />
          Sessões Ativas
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Visualize e gerencie as sessões de usuário ativas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700 dark:text-gray-300">Sessões ativas no momento:</span>
            <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">134</Badge>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Top 5 usuários por sessões:</div>
            
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <div className="bg-primary text-white dark:bg-primary dark:text-white rounded-full h-8 w-8 flex items-center justify-center">
                      MA
                    </div>
                  </Avatar>
                  <div className="text-gray-900 dark:text-white">Maria Almeida (Médico)</div>
                </div>
                <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">3 sessões</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <div className="bg-primary text-white dark:bg-primary dark:text-white rounded-full h-8 w-8 flex items-center justify-center">
                      CS
                    </div>
                  </Avatar>
                  <div className="text-gray-900 dark:text-white">Carlos Silva (Administrador)</div>
                </div>
                <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">2 sessões</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <div className="bg-primary text-white dark:bg-primary dark:text-white rounded-full h-8 w-8 flex items-center justify-center">
                      JP
                    </div>
                  </Avatar>
                  <div className="text-gray-900 dark:text-white">Julia Pereira (Enfermeiro)</div>
                </div>
                <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">2 sessões</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Ver Todas as Sessões
        </Button>
      </CardFooter>
    </Card>
  );
};

// Componente para o card de ações de emergência
const EmergencyActionsCard: React.FC = () => {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-gray-900 dark:text-white">
          <LogOut size={18} className="text-primary dark:text-primary-400" />
          Ações de Emergência
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Ações de segurança para situações críticas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800 flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Atenção!</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Estas ações afetam todos os usuários e devem ser usadas apenas em situações de segurança críticas.
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span>Encerrar todas as sessões</span>
                <LogOut size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Encerrar todas as sessões</DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400">
                  Esta ação desconectará todos os usuários do sistema. Todos precisarão fazer login novamente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">Atenção!</p>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Esta é uma ação disruptiva. Use apenas em caso de suspeita de comprometimento do sistema.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmation-logout" className="text-gray-700 dark:text-gray-300">Digite &quot;CONFIRMAR&quot; para prosseguir:</Label>
                  <Input 
                    id="confirmation-logout" 
                    placeholder="CONFIRMAR" 
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button 
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700 dark:text-white"
                >
                  Encerrar Todas as Sessões
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span>Bloquear novos logins</span>
                <Lock size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Bloquear novos logins</DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400">
                  Esta ação impedirá qualquer novo login no sistema, mantendo apenas as sessões existentes.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">Atenção!</p>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Isto pode impedir acesso legítimo ao sistema. Use com cautela.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockout-duration" className="text-gray-700 dark:text-gray-300">Duração do bloqueio:</Label>
                  <Select defaultValue="60">
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Selecione a duração" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectItem value="15" className="text-gray-900 dark:text-white">15 minutos</SelectItem>
                      <SelectItem value="30" className="text-gray-900 dark:text-white">30 minutos</SelectItem>
                      <SelectItem value="60" className="text-gray-900 dark:text-white">1 hora</SelectItem>
                      <SelectItem value="240" className="text-gray-900 dark:text-white">4 horas</SelectItem>
                      <SelectItem value="720" className="text-gray-900 dark:text-white">12 horas</SelectItem>
                      <SelectItem value="1440" className="text-gray-900 dark:text-white">24 horas</SelectItem>
                      <SelectItem value="0" className="text-gray-900 dark:text-white">Indefinido (até desbloquear manualmente)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exception-role" className="text-gray-700 dark:text-gray-300">Exceção para papel:</Label>
                  <Select defaultValue="admin">
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Selecione o papel" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectItem value="admin" className="text-gray-900 dark:text-white">Administradores</SelectItem>
                      <SelectItem value="none" className="text-gray-900 dark:text-white">Nenhum (bloquear todos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmation-block" className="text-gray-700 dark:text-gray-300">Digite &quot;CONFIRMAR&quot; para prosseguir:</Label>
                  <Input 
                    id="confirmation-block" 
                    placeholder="CONFIRMAR"
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button 
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700 dark:text-white"
                >
                  Bloquear Novos Logins
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};