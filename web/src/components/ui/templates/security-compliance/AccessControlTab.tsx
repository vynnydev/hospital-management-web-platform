import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Switch } from '@/components/ui/organisms/switch';
import { Label } from '@/components/ui/organisms/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { useToast } from '@/components/ui/hooks/use-toast';
import { useSecurityCompliance } from '@/hooks/security-compliance/useSecurityCompliance';
import { IAccessControlConfig, IRBAPolicy } from '@/types/security-compliance-types';
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Controle de Acesso</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Configure as políticas de acesso baseadas em papéis e restrições adicionais
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <TabsTrigger 
            value="rbac" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
          >
            <Shield className="h-4 w-4" />
            <span>Papéis e Permissões</span>
          </TabsTrigger>
          <TabsTrigger 
            value="ip-time" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
          >
            <Clock className="h-4 w-4" />
            <span>IP e Horário</span>
          </TabsTrigger>
          <TabsTrigger 
            value="devices" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
          >
            <Laptop className="h-4 w-4" />
            <span>Dispositivos</span>
          </TabsTrigger>
          <TabsTrigger 
            value="location" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
          >
            <MapPin className="h-4 w-4" />
            <span>Localização</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rbac" className="space-y-4 mt-4">
          <RBAConfigPanel 
            policies={securityData?.rbaPolicy || []}
            updateRBAPolicy={updateRBAPolicy}
            createRBAPolicy={(policy) => Promise.resolve()} // Replace with actual implementation
            deleteRBAPolicy={(policyId) => Promise.resolve()} // Replace with actual implementation
            loading={loading} 
            roles={[]} 
            resources={[]}         
          />
        </TabsContent>

        <TabsContent value="ip-time" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <IPRestrictionPanel 
              ipRestriction={config.enforceIPRestriction}
              allowedIPs={config.allowedIPs}
              onChange={(enforceIPRestriction: boolean, allowedIPs: string[]) => {
                setConfig({
                  ...config,
                  enforceIPRestriction,
                  allowedIPs
                });
              }}
              accessControlConfig={config}
              updateAccessControlConfig={updateAccessControlConfig}
              loading={loading}
            />
            
            <TimeWindowsPanel 
              timeWindows={(config.allowedTimeWindows || []).map((window, index) => ({
                id: `time-window-${index}`,
                ...window,
              }))}
              enabled={true} // or set based on your logic
              onToggleEnabled={(enabled) => {
                setConfig({
                  ...config,
                  // Removed invalid property 'enabled'
                });
              }}
              onUpdateTimeWindows={(updatedTimeWindows) => {
                setConfig({
                  ...config,
                  allowedTimeWindows: updatedTimeWindows,
                });
                }}
                onChange={(allowedTimeWindows: { dayOfWeek: number[]; startTime: string; endTime: string }[]) => {
                setConfig({
                  ...config,
                  allowedTimeWindows: allowedTimeWindows.map((timeWindow) => ({
                  dayOfWeek: timeWindow.dayOfWeek, // Example: Replace with actual dayOfWeek data
                  startTime: timeWindow.startTime, // Ensure timeWindow has startTime
                  endTime: timeWindow.endTime, // Ensure timeWindow has endTime
                  }))
                });
                }}
                loading={loading}
              />
              </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleSave} 
              disabled={isSaving || loading}
              className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
            >
              {isSaving ? 'Salvando...' : 'Salvar Restrições de IP e Horário'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4 mt-4">
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Laptop className="h-5 w-5 text-primary dark:text-primary-400" />
                Restrições de Dispositivos
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Configure limitações para dispositivos que podem acessar o sistema
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base text-gray-900 dark:text-white">Restringir Dispositivos</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Limita o número de dispositivos que um usuário pode utilizar para acesso
                  </p>
                </div>
                <Switch
                  checked={config.enforceDeviceRestriction}
                  onCheckedChange={(checked) => handleDeviceConfigChange('enforceDeviceRestriction', checked)}
                  className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                />
              </div>

              {config.enforceDeviceRestriction && (
                <div className="space-y-4 pl-4 border-l-2 border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <div>
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">Dispositivos confiáveis</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Permite que usuários marquem dispositivos como confiáveis para agilizar o login
                      </p>
                    </div>
                    <Switch
                      checked={config.trustedDevices}
                      onCheckedChange={(checked) => handleDeviceConfigChange('trustedDevices', checked)}
                      className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-devices" className="text-gray-700 dark:text-gray-300">Número máximo de dispositivos por usuário</Label>
                    <Select 
                      value={config.maxDevicesPerUser.toString()} 
                      onValueChange={handleMaxDevicesChange}
                    >
                      <SelectTrigger id="max-devices" className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                        <SelectValue placeholder="Selecione o limite" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <SelectItem value="1" className="text-gray-900 dark:text-white">1 dispositivo</SelectItem>
                        <SelectItem value="2" className="text-gray-900 dark:text-white">2 dispositivos</SelectItem>
                        <SelectItem value="3" className="text-gray-900 dark:text-white">3 dispositivos</SelectItem>
                        <SelectItem value="5" className="text-gray-900 dark:text-white">5 dispositivos</SelectItem>
                        <SelectItem value="10" className="text-gray-900 dark:text-white">10 dispositivos</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Número máximo de dispositivos diferentes que um usuário pode utilizar para acessar o sistema
                    </p>
                  </div>

                  <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                    <AlertTitle className="text-amber-800 dark:text-amber-300">Balanceamento de segurança e usabilidade</AlertTitle>
                    <AlertDescription className="text-amber-700 dark:text-amber-400">
                      Limitar dispositivos aumenta a segurança, mas pode impactar a produtividade.
                      Considere as necessidades de mobilidade dos profissionais de saúde ao definir esses limites.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={isSaving || loading}
                className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
              >
                {isSaving ? 'Salvando...' : 'Salvar Configurações de Dispositivos'}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-base text-gray-900 dark:text-white">Dispositivos Registrados</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Dispositivos atualmente registrados por usuários
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-700 dark:text-gray-300">Filtrar por usuário:</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[200px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Todos os usuários" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectItem value="all" className="text-gray-900 dark:text-white">Todos os usuários</SelectItem>
                      <SelectItem value="admin" className="text-gray-900 dark:text-white">Administradores</SelectItem>
                      <SelectItem value="doctor" className="text-gray-900 dark:text-white">Médicos</SelectItem>
                      <SelectItem value="nurse" className="text-gray-900 dark:text-white">Enfermeiros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Carlos Silva (Administrador)</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">3 dispositivos registrados</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Ver detalhes
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Maria Andrade (Médico)</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">2 dispositivos registrados</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Ver detalhes
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                      <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">João Santos (Médico)</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">3 dispositivos registrados</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Ver detalhes
                      </Button>
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
                Relatório Completo de Dispositivos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4 mt-4">
          <GeofencingPanel 
            geofencingEnabled={config.geofencing}
            geofencing={config.geofencing}
            allowedLocations={config.allowedLocations || []}
            locations={(config.allowedLocations || []).map(location => ({
              ...location,
              id: location.name || 'default-id',
              type: 'custom', // Use one of the allowed values: "hospital", "clinic", or "custom"
              enabled: true, // Default value since 'enabled' does not exist on the location object
              createdAt: new Date().toISOString(),
            }))}
            onChange={(updatedConfig) => {
              setConfig({
                ...config,
                ...(typeof updatedConfig === 'object' && updatedConfig !== null ? updatedConfig : {}),
              });
            }}
            onUpdateLocation={(updatedLocation) => {
              return Promise.resolve().then(() => {
                setConfig({
                  ...config,
                  allowedLocations: (config.allowedLocations || []).map((loc) =>
                    loc.name === updatedLocation.name ? updatedLocation : loc
                  ),
                });
              });
            }}
            onToggleGeofencing={(enabled) => {
              setConfig({
                ...config,
                geofencing: enabled,
              });
            }}
            onSave={(location) => {
              setConfig({
                ...config,
                allowedLocations: [...(config.allowedLocations || []), location],
              });
              return Promise.resolve();
            }}
            onSaveLocation={(location) => {
              setConfig({
                ...config,
                allowedLocations: [...(config.allowedLocations || []), location],
              });
              return Promise.resolve();
            }}
            onDeleteLocation={(locationName) => {
              return Promise.resolve().then(() => {
                setConfig({
                  ...config,
                  allowedLocations: (config.allowedLocations || []).filter(
                    (loc) => loc.name !== locationName
                  ),
                });
              });
            }}
            loading={loading || isSaving}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};