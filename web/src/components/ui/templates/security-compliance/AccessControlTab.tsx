import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Switch } from '@/components/ui/organisms/switch';
import { Label } from '@/components/ui/organisms/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { useToast } from '@/components/ui/hooks/use-toast';
import { useSecurityCompliance } from '@/services/hooks/security-compliance/useSecurityCompliance';
import { IAccessControlConfig } from '@/types/security-compliance-types';
import { 
  Shield, 
  Clock, 
  MapPin, 
  Laptop, 
  AlertTriangle
} from 'lucide-react';

// Dividindo em componentes menores para melhor organização
import { RBAConfigPanel } from './access-control/RBAConfigPanel';
import { IPRestrictionPanel } from './access-control/IPRestrictionPanel';
import { TimeWindowsPanel } from './access-control/TimeWindowsPanel';
import { GeofencingPanel } from './access-control/GeofencingPanel';

export const AccessControlTab = () => {
  const { securityData, updateAccessControlConfig, updateRBAPolicy, loading } = useSecurityCompliance();
  const [activeTab, setActiveTab] = useState("rbac");
  const { toast } = useToast();
  
  const defaultAccessConfig: IAccessControlConfig = {
    id: 'access-control-config',
    enforceIPRestriction: false,
    allowedIPs: [],
    allowedTimeWindows: [],
    enforceDeviceRestriction: false,
    trustedDevices: true,
    maxDevicesPerUser: 3,
    geofencing: false,
    allowedLocations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const [config, setConfig] = useState<IAccessControlConfig>(
    securityData?.accessControlConfig || defaultAccessConfig
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateAccessControlConfig(config);
      
      toast({
        title: "Configurações salvas",
        description: "As configurações de controle de acesso foram salvas com sucesso.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Função para atualizar configurações de dispositivos confiáveis
  const handleDeviceConfigChange = (field: keyof Pick<IAccessControlConfig, 'enforceDeviceRestriction' | 'trustedDevices'>, value: boolean) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  const handleMaxDevicesChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1) {
      setConfig({
        ...config,
        maxDevicesPerUser: numValue
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Controle de Acesso</h3>
        <p className="text-sm text-gray-500">
          Configure as políticas de acesso baseadas em papéis e restrições adicionais
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="rbac" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Papéis e Permissões</span>
          </TabsTrigger>
          <TabsTrigger value="ip-time" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>IP e Horário</span>
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Laptop className="h-4 w-4" />
            <span>Dispositivos</span>
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Localização</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rbac" className="space-y-4 mt-4">
          <RBAConfigPanel 
            rbaPolicies={securityData?.rbaPolicy || []}
            updateRBAPolicy={updateRBAPolicy}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="ip-time" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <IPRestrictionPanel 
              ipRestriction={config.enforceIPRestriction}
              allowedIPs={config.allowedIPs}
              onChange={(enforceIPRestriction, allowedIPs) => {
                setConfig({
                  ...config,
                  enforceIPRestriction,
                  allowedIPs
                });
              }}
            />
            
            <TimeWindowsPanel 
              timeWindows={config.allowedTimeWindows}
              onChange={(allowedTimeWindows) => {
                setConfig({
                  ...config,
                  allowedTimeWindows
                });
              }}
            />
          </div>
          
          <div className="flex justify-end mt-4">
            <Button onClick={handleSave} disabled={isSaving || loading}>
              {isSaving ? 'Salvando...' : 'Salvar Restrições de IP e Horário'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Laptop className="h-5 w-5" />
                Restrições de Dispositivos
              </CardTitle>
              <CardDescription>
                Configure limitações para dispositivos que podem acessar o sistema
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Restringir Dispositivos</Label>
                  <p className="text-xs text-gray-500">
                    Limita o número de dispositivos que um usuário pode utilizar para acesso
                  </p>
                </div>
                <Switch
                  checked={config.enforceDeviceRestriction}
                  onCheckedChange={(checked) => handleDeviceConfigChange('enforceDeviceRestriction', checked)}
                />
              </div>

              {config.enforceDeviceRestriction && (
                <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <Label className="text-sm font-medium">Dispositivos confiáveis</Label>
                      <p className="text-xs text-gray-500">
                        Permite que usuários marquem dispositivos como confiáveis para agilizar o login
                      </p>
                    </div>
                    <Switch
                      checked={config.trustedDevices}
                      onCheckedChange={(checked) => handleDeviceConfigChange('trustedDevices', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-devices">Número máximo de dispositivos por usuário</Label>
                    <Select 
                      value={config.maxDevicesPerUser.toString()} 
                      onValueChange={handleMaxDevicesChange}
                    >
                      <SelectTrigger id="max-devices" className="w-full">
                        <SelectValue placeholder="Selecione o limite" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 dispositivo</SelectItem>
                        <SelectItem value="2">2 dispositivos</SelectItem>
                        <SelectItem value="3">3 dispositivos</SelectItem>
                        <SelectItem value="5">5 dispositivos</SelectItem>
                        <SelectItem value="10">10 dispositivos</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      Número máximo de dispositivos diferentes que um usuário pode utilizar para acessar o sistema
                    </p>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Balanceamento de segurança e usabilidade</AlertTitle>
                    <AlertDescription>
                      Limitar dispositivos aumenta a segurança, mas pode impactar a produtividade.
                      Considere as necessidades de mobilidade dos profissionais de saúde ao definir esses limites.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving || loading}>
                {isSaving ? 'Salvando...' : 'Salvar Configurações de Dispositivos'}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dispositivos Registrados</CardTitle>
              <CardDescription>
                Dispositivos atualmente registrados por usuários
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Filtrar por usuário:</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Todos os usuários" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os usuários</SelectItem>
                      <SelectItem value="admin">Administradores</SelectItem>
                      <SelectItem value="doctor">Médicos</SelectItem>
                      <SelectItem value="nurse">Enfermeiros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <div className="text-sm font-medium">Carlos Silva (Administrador)</div>
                        <div className="text-xs text-gray-500">3 dispositivos registrados</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver detalhes
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <div className="text-sm font-medium">Maria Andrade (Médico)</div>
                        <div className="text-xs text-gray-500">2 dispositivos registrados</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver detalhes
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <div className="text-sm font-medium">João Santos (Médico)</div>
                        <div className="text-xs text-gray-500">3 dispositivos registrados</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button variant="outline" className="w-full">
                Relatório Completo de Dispositivos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4 mt-4">
          <GeofencingPanel 
            geofencing={config.geofencing}
            allowedLocations={config.allowedLocations}
            onChange={(geofencing, allowedLocations) => {
              setConfig({
                ...config,
                geofencing,
                allowedLocations
              });
            }}
            onSave={handleSave}
            loading={loading || isSaving}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};