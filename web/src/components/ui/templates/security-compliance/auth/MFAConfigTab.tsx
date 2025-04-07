/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Switch } from '@/components/ui/organisms/switch';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Checkbox } from '@/components/ui/organisms/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { useToast } from '@/components/ui/hooks/use-toast';
import { AlertTriangle, Key } from 'lucide-react';
import { IMFAConfig } from '@/types/security-compliance-types';

interface MFAConfigTabProps {
  mfaConfig: IMFAConfig | undefined;
  updateMFAConfig: (config: any) => Promise<any>;
  loading: boolean;
}

export const MFAConfigTab: React.FC<MFAConfigTabProps> = ({
  mfaConfig,
  updateMFAConfig,
  loading
}) => {
  const defaultMfaConfig: IMFAConfig = {
    id: 'mfa-config',
    enabled: false,
    requiredForRoles: [],
    allowedMethods: ['app'],
    graceLogins: 1,
    rememberDeviceDays: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const [config, setConfig] = useState<IMFAConfig>(mfaConfig || defaultMfaConfig);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateMFAConfig(config);
      
      toast({
        title: "MFA atualizado",
        description: "Configurações de autenticação de múltiplos fatores salvas com sucesso.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações de MFA.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleMFA = (enabled: boolean) => {
    setConfig({
      ...config,
      enabled
    });
  };
  
  const handleToggleMFAForRole = (role: string, checked: boolean) => {
    const updatedRoles = checked
      ? [...(config.requiredForRoles || []), role]
      : (config.requiredForRoles || []).filter(r => r !== role);
    
    setConfig({
      ...config,
      requiredForRoles: updatedRoles
    });
  };
  
  const handleToggleMFAMethod = (method: 'app' | 'sms' | 'email' | 'hardware', checked: boolean) => {
    const updatedMethods = checked
      ? [...(config.allowedMethods || []), method]
      : (config.allowedMethods || []).filter(m => m !== method);
    
    setConfig({
      ...config,
      allowedMethods: updatedMethods
    });
  };

  return (
    <>
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Key size={18} className="text-primary dark:text-primary-400" /> 
                Autenticação Multi-Fator
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Configure a autenticação de múltiplos fatores para aumentar a segurança
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {config.enabled ? 'Ativado' : 'Desativado'}
              </span>
              <Switch
                checked={config.enabled}
                onCheckedChange={handleToggleMFA}
                className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!config.enabled && (
            <Alert variant="warning" className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              <AlertTitle>MFA desativado</AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                A autenticação multi-fator adiciona uma camada extra de segurança. Recomendamos ativar para todos os usuários com acesso a dados sensíveis.
              </AlertDescription>
            </Alert>
          )}
          
          <div className={!config.enabled ? 'opacity-50 pointer-events-none' : ''}>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Aplicar MFA para</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {['Administrador', 'Médico', 'Enfermeiro', 'Atendente', 'Técnico'].map((role) => (
                    <div key={role} className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                      <Checkbox
                        id={`role-${role}`}
                        checked={config.requiredForRoles?.includes(role)}
                        onCheckedChange={(checked) => 
                          handleToggleMFAForRole(role, checked as boolean)
                        }
                        className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                      />
                      <Label htmlFor={`role-${role}`} className="text-gray-700 dark:text-gray-300">{role}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Métodos permitidos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <Checkbox
                      id="method-app"
                      checked={config.allowedMethods?.includes('app')}
                      onCheckedChange={(checked) => 
                        handleToggleMFAMethod('app', checked as boolean)
                      }
                      className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                    />
                    <Label htmlFor="method-app" className="text-gray-700 dark:text-gray-300">Aplicativo Autenticador</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <Checkbox
                      id="method-sms"
                      checked={config.allowedMethods?.includes('sms')}
                      onCheckedChange={(checked) => 
                        handleToggleMFAMethod('sms', checked as boolean)
                      }
                      className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                    />
                    <Label htmlFor="method-sms" className="text-gray-700 dark:text-gray-300">SMS</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <Checkbox
                      id="method-email"
                      checked={config.allowedMethods?.includes('email')}
                      onCheckedChange={(checked) => 
                        handleToggleMFAMethod('email', checked as boolean)
                      }
                      className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                    />
                    <Label htmlFor="method-email" className="text-gray-700 dark:text-gray-300">E-mail</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <Checkbox
                      id="method-hardware"
                      checked={config.allowedMethods?.includes('hardware')}
                      onCheckedChange={(checked) => 
                        handleToggleMFAMethod('hardware', checked as boolean)
                      }
                      className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                    />
                    <Label htmlFor="method-hardware" className="text-gray-700 dark:text-gray-300">Chave de Segurança (FIDO2)</Label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="graceLogins" className="text-gray-700 dark:text-gray-300">Logins de cortesia</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="graceLogins" 
                      type="number"
                      min={0}
                      max={5}
                      value={config.graceLogins} 
                      onChange={(e) => setConfig({
                        ...config,
                        graceLogins: parseInt(e.target.value)
                      })}
                      required
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                    <div className="text-sm text-gray-500 dark:text-gray-400">logins</div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Número de logins permitidos sem MFA após a configuração inicial
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rememberDeviceDays" className="text-gray-700 dark:text-gray-300">Lembrar dispositivos por</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="rememberDeviceDays" 
                      type="number"
                      min={0}
                      max={90}
                      value={config.rememberDeviceDays} 
                      onChange={(e) => setConfig({
                        ...config,
                        rememberDeviceDays: parseInt(e.target.value)
                      })}
                      required
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                    <div className="text-sm text-gray-500 dark:text-gray-400">dias</div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tempo para lembrar dispositivos confiáveis (0 = sempre verificar)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={loading || isSaving}
            className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
          >
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>
      
      <MFAAdoptionReport />
    </>
  );
};

// Componente separado para o relatório de adoção MFA
const MFAAdoptionReport: React.FC = () => {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Relatório de Adoção MFA</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Estatísticas de uso da autenticação multi-fator
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Taxa de adoção geral:</span>
            <div className="py-1 px-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-sm font-medium">76%</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Por tipo de usuário:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Administradores:</span>
                <div className="py-1 px-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-sm">100%</div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Médicos:</span>
                <div className="py-1 px-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-sm">92%</div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Enfermeiros:</span>
                <div className="py-1 px-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded text-sm">68%</div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Atendentes:</span>
                <div className="py-1 px-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded text-sm">45%</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Por método:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Aplicativo Autenticador:</span>
                <div className="py-1 px-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded text-sm">63%</div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">SMS:</span>
                <div className="py-1 px-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded text-sm">27%</div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">E-mail:</span>
                <div className="py-1 px-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded text-sm">8%</div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Chave de Segurança:</span>
                <div className="py-1 px-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded text-sm">2%</div>
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
          Exportar Relatório Detalhado
        </Button>
      </CardFooter>
    </Card>
  );
};