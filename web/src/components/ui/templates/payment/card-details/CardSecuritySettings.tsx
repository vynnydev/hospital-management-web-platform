import React from 'react';
import { Separator } from '@/components/ui/organisms/Separator';
import { Switch } from '@/components/ui/organisms/switch';
import { Button } from '@/components/ui/organisms/button';
import { Badge } from '@/components/ui/organisms/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/organisms/card';
import { 
  Shield, 
  AlertTriangle, 
  Globe, 
  UserCircle, 
  Key,
  Lock,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { IPaymentCard } from '@/types/payment-types';

interface CardSecuritySettingsProps {
  card: IPaymentCard;
  canManage: boolean;
}

export const CardSecuritySettings: React.FC<CardSecuritySettingsProps> = ({ 
  card,
  canManage
}) => {
  const securitySettings = card.securitySettings;
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Configurações de Segurança
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
                <Lock className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                Autenticação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Exige PIN</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Requer PIN para transações presenciais
                  </p>
                </div>
                <Switch 
                  checked={securitySettings.requiresPin}
                  disabled={!canManage}
                  aria-readonly={!canManage}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Autenticação de Dois Fatores (2FA)
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Exige verificação adicional para transações
                  </p>
                </div>
                <Switch 
                  checked={securitySettings.requires2FA}
                  disabled={!canManage}
                  aria-readonly={!canManage}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
                <Globe className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                Uso Internacional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Permite Transações Online
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Habilita compras pela internet
                  </p>
                </div>
                <Switch 
                  checked={securitySettings.allowOnlineTransactions}
                  disabled={!canManage}
                  aria-readonly={!canManage}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Permite Transações Internacionais
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Habilita uso em outros países
                  </p>
                </div>
                <Switch 
                  checked={securitySettings.allowInternationalTransactions}
                  disabled={!canManage}
                  aria-readonly={!canManage}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
      
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Alertas e Notificações
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
                <Smartphone className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                Notificações em Tempo Real
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Alerta de Transações
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Notifica sobre transações realizadas
                  </p>
                </div>
                <Switch 
                  checked={true}
                  disabled={!canManage}
                  aria-readonly={!canManage}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Alerta de Transações Suspeitas
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Notifica sobre atividades incomuns
                  </p>
                </div>
                <Switch 
                  checked={true}
                  disabled={!canManage}
                  aria-readonly={!canManage}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            {!canManage && (
              <div className="absolute inset-0 bg-gray-100/80 dark:bg-gray-900/80 flex items-center justify-center z-10">
                <Badge className="bg-blue-600 text-white dark:bg-blue-500">
                  Acesso administrativo necessário
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
                <CreditCard className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                Bloqueio Automático
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Bloqueio por Localização
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Bloqueia transações fora das áreas permitidas
                  </p>
                </div>
                <Switch 
                  checked={false}
                  disabled={true}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Bloqueio por Valor
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Bloqueia transações acima do limite
                  </p>
                </div>
                <Switch 
                  checked={true}
                  disabled={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
      
      <div>
        <div className="flex items-center gap-2 mb-4">
          <UserCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Aprovação de Transações
          </h3>
        </div>
        
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
              <Key className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              Configurações de Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Limiar de Aprovação Automática
                </p>
                <div className="flex items-center mt-1">
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    R$ {securitySettings.transactionApprovalThreshold.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    Transações acima deste valor requerem aprovação
                  </span>
                </div>
              </div>
              
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Aprovadores Autorizados ({securitySettings.allowedApprovers.length})
                </p>
                
                <div className="max-h-32 overflow-y-auto pr-2 space-y-2">
                  {securitySettings.allowedApprovers.map((approver, index) => (
                    <div 
                      key={index}
                      className="flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-md"
                    >
                      <UserCircle className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-800 dark:text-gray-200">{approver}</span>
                    </div>
                  ))}
                  
                  {securitySettings.allowedApprovers.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      Nenhum aprovador específico configurado
                    </p>
                  )}
                </div>
              </div>
              
              {canManage && (
                <Button
                  variant="outline"
                  className="mt-2 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Configurar Aprovadores
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {canManage && (
        <div className="flex justify-end">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Shield className="h-4 w-4 mr-2" />
            Salvar Configurações de Segurança
          </Button>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-md text-blue-800 dark:text-blue-200">
        <div className="flex">
          <Shield className="h-5 w-5 mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="font-medium">Dica de Segurança</p>
            <p className="mt-1 text-sm">
              Para maior segurança, recomendamos habilitar a autenticação de dois fatores (2FA) e 
              configurar limites de transação adequados às necessidades operacionais do departamento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};