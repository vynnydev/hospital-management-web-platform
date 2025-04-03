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
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key size={18} /> 
                Autenticação Multi-Fator
              </CardTitle>
              <CardDescription>
                Configure a autenticação de múltiplos fatores para aumentar a segurança
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {config.enabled ? 'Ativado' : 'Desativado'}
              </span>
              <Switch
                checked={config.enabled}
                onCheckedChange={handleToggleMFA}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!config.enabled && (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>MFA desativado</AlertTitle>
              <AlertDescription>
                A autenticação multi-fator adiciona uma camada extra de segurança. Recomendamos ativar para todos os usuários com acesso a dados sensíveis.
              </AlertDescription>
            </Alert>
          )}
          
          <div className={!config.enabled ? 'opacity-50 pointer-events-none' : ''}>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Aplicar MFA para</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {['Administrador', 'Médico', 'Enfermeiro', 'Atendente', 'Técnico'].map((role) => (
                    <div key={role} className="flex items-center space-x-2 p-2 border rounded-md">
                      <Checkbox
                        id={`role-${role}`}
                        checked={config.requiredForRoles?.includes(role)}
                        onCheckedChange={(checked) => 
                          handleToggleMFAForRole(role, checked as boolean)
                        }
                      />
                      <Label htmlFor={`role-${role}`}>{role}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Métodos permitidos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 p-2 border rounded-md">
                    <Checkbox
                      id="method-app"
                      checked={config.allowedMethods?.includes('app')}
                      onCheckedChange={(checked) => 
                        handleToggleMFAMethod('app', checked as boolean)
                      }
                    />
                    <Label htmlFor="method-app">Aplicativo Autenticador</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 border rounded-md">
                    <Checkbox
                      id="method-sms"
                      checked={config.allowedMethods?.includes('sms')}
                      onCheckedChange={(checked) => 
                        handleToggleMFAMethod('sms', checked as boolean)
                      }
                    />
                    <Label htmlFor="method-sms">SMS</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 border rounded-md">
                    <Checkbox
                      id="method-email"
                      checked={config.allowedMethods?.includes('email')}
                      onCheckedChange={(checked) => 
                        handleToggleMFAMethod('email', checked as boolean)
                      }
                    />
                    <Label htmlFor="method-email">E-mail</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 border rounded-md">
                    <Checkbox
                      id="method-hardware"
                      checked={config.allowedMethods?.includes('hardware')}
                      onCheckedChange={(checked) => 
                        handleToggleMFAMethod('hardware', checked as boolean)
                      }
                    />
                    <Label htmlFor="method-hardware">Chave de Segurança (FIDO2)</Label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="graceLogins">Logins de cortesia</Label>
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
                    />
                    <div className="text-sm text-gray-500">logins</div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Número de logins permitidos sem MFA após a configuração inicial
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rememberDeviceDays">Lembrar dispositivos por</Label>
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
                    />
                    <div className="text-sm text-gray-500">dias</div>
                  </div>
                  <p className="text-xs text-gray-500">
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
    <Card>
      <CardHeader>
        <CardTitle>Relatório de Adoção MFA</CardTitle>
        <CardDescription>
          Estatísticas de uso da autenticação multi-fator
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Taxa de adoção geral:</span>
            <div className="py-1 px-2 bg-blue-100 text-blue-800 rounded text-sm font-medium">76%</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium mb-1">Por tipo de usuário:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-sm">Administradores:</span>
                <div className="py-1 px-2 bg-green-100 text-green-800 rounded text-sm">100%</div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Médicos:</span>
                <div className="py-1 px-2 bg-green-100 text-green-800 rounded text-sm">92%</div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Enfermeiros:</span>
                <div className="py-1 px-2 bg-yellow-100 text-yellow-800 rounded text-sm">68%</div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Atendentes:</span>
                <div className="py-1 px-2 bg-red-100 text-red-800 rounded text-sm">45%</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium mb-1">Por método:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-sm">Aplicativo Autenticador:</span>
                <div className="py-1 px-2 bg-gray-100 text-gray-800 rounded text-sm">63%</div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">SMS:</span>
                <div className="py-1 px-2 bg-gray-100 text-gray-800 rounded text-sm">27%</div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">E-mail:</span>
                <div className="py-1 px-2 bg-gray-100 text-gray-800 rounded text-sm">8%</div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Chave de Segurança:</span>
                <div className="py-1 px-2 bg-gray-100 text-gray-800 rounded text-sm">2%</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Exportar Relatório Detalhado
        </Button>
      </CardFooter>
    </Card>
  );
};