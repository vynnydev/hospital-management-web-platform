/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/organisms/card';
import { Input } from '@/components/ui/organisms/input';
import { Button } from '@/components/ui/organisms/button';
import { Label } from '@/components/ui/organisms/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/organisms/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/organisms/dialog';
import {
  AlertTriangle,
  KeyRound,
  LockKeyhole,
  Shield,
  ShieldAlert,
  Eye,
  EyeOff,
  Fingerprint,
  Smartphone,
  Mail
} from 'lucide-react';
import { useToast } from '@/components/ui/hooks/use-toast';
import { usePaymentData } from '@/services/hooks/payment/usePaymentData';

interface SecurityLayerProps {
  userId: string;
  children: React.ReactNode;
  allowBiometric?: boolean;
}

export const SecurityLayer: React.FC<SecurityLayerProps> = ({ 
  userId, 
  children,
  allowBiometric = true
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [is2FARequired, setIs2FARequired] = useState(false);
  const [step, setStep] = useState<'password' | 'twoFactor'>('password');
  const [selectedMethod, setSelectedMethod] = useState<'app' | 'sms' | 'email'>('app');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [processingBiometric, setProcessingBiometric] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockoutActive, setIsLockoutActive] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<Date | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  
  const { toast } = useToast();
  
  const { 
    isAuthenticated, 
    authenticate, 
    checkIfTwoFactorRequired,
    loading,
    error
  } = usePaymentData(userId);
  
  // Verificar se a autenticação biométrica está disponível
  useEffect(() => {
    const checkBiometricAvailability = async () => {
      if (allowBiometric && window.PublicKeyCredential) {
        try {
          // Verifica se a API Web Authentication está disponível
          const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricAvailable(available);
        } catch (error) {
          console.error('Erro ao verificar disponibilidade biométrica:', error);
          setBiometricAvailable(false);
        }
      } else {
        setBiometricAvailable(false);
      }
    };
    
    checkBiometricAvailability();
  }, [allowBiometric]);
  
  // Verificar se 2FA é necessário
  useEffect(() => {
    const checkTwoFactorAuth = async () => {
      const required = await checkIfTwoFactorRequired();
      setIs2FARequired(required);
    };
    
    checkTwoFactorAuth();
  }, [checkIfTwoFactorRequired]);
  
  // Atualizar contador de tempo de bloqueio
  useEffect(() => {
    if (!isLockoutActive || !lockoutEndTime) return;
    
    const intervalId = setInterval(() => {
      const now = new Date();
      const remainingMs = lockoutEndTime.getTime() - now.getTime();
      
      if (remainingMs <= 0) {
        setIsLockoutActive(false);
        setLockoutEndTime(null);
        setLockoutRemaining(0);
        clearInterval(intervalId);
      } else {
        setLockoutRemaining(Math.ceil(remainingMs / 1000));
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [isLockoutActive, lockoutEndTime]);
  
  // Função para formatar o tempo restante
  const formatRemainingTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Autenticar com senha
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLockoutActive) {
      toast({
        title: "Acesso bloqueado",
        description: `Por favor, aguarde ${formatRemainingTime(lockoutRemaining)} antes de tentar novamente.`,
        variant: "destructive",
      });
      return;
    }
    
    if (!password.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira sua senha.",
        variant: "destructive",
      });
      return;
    }
    
    if (is2FARequired) {
      // Se 2FA é necessário, vá para o próximo passo
      setStep('twoFactor');
      
      // Solicita o envio do código
      try {
        // TODO: Implementar chamada à API para enviar código 2FA
        toast({
          title: "Código enviado",
          description: `Um código de segurança foi enviado para seu ${
            selectedMethod === 'app' ? 'aplicativo autenticador' :
            selectedMethod === 'sms' ? 'telefone via SMS' : 'e-mail'
          }.`,
          variant: "default",
        });
      } catch (error) {
        console.error('Erro ao enviar código 2FA:', error);
        toast({
          title: "Erro",
          description: "Não foi possível enviar o código de segurança. Tente novamente.",
          variant: "destructive",
        });
      }
    } else {
      // Se 2FA não é necessário, tenta autenticar apenas com senha
      try {
        const success = await authenticate(password);
        
        if (!success) {
          // Incrementa contador de tentativas falhas
          const newFailedAttempts = failedAttempts + 1;
          setFailedAttempts(newFailedAttempts);
          
          // Se atingiu o limite, ativa o bloqueio
          if (newFailedAttempts >= 5) {
            const lockoutEnd = new Date();
            lockoutEnd.setMinutes(lockoutEnd.getMinutes() + 30); // 30 minutos de bloqueio
            setLockoutEndTime(lockoutEnd);
            setIsLockoutActive(true);
            setFailedAttempts(0);
            
            toast({
              title: "Acesso bloqueado",
              description: "Muitas tentativas falhas. Por favor, tente novamente em 30 minutos.",
              variant: "destructive",
            });
          }
        } else {
          // Resetar contador de tentativas em caso de sucesso
          setFailedAttempts(0);
        }
      } catch (error) {
        console.error('Erro durante a autenticação:', error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro durante a autenticação. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };
  
  // Verificar código de autenticação de dois fatores
  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!twoFactorCode.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira o código de verificação.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const success = await authenticate(password, twoFactorCode);
      
      if (!success) {
        // Incrementa contador de tentativas falhas
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        
        // Se atingiu o limite, ativa o bloqueio
        if (newFailedAttempts >= 5) {
          const lockoutEnd = new Date();
          lockoutEnd.setMinutes(lockoutEnd.getMinutes() + 30); // 30 minutos de bloqueio
          setLockoutEndTime(lockoutEnd);
          setIsLockoutActive(true);
          setFailedAttempts(0);
          setStep('password'); // Voltar para a primeira etapa
          
          toast({
            title: "Acesso bloqueado",
            description: "Muitas tentativas falhas. Por favor, tente novamente em 30 minutos.",
            variant: "destructive",
          });
        }
      } else {
        // Resetar contador de tentativas em caso de sucesso
        setFailedAttempts(0);
      }
    } catch (error) {
      console.error('Erro durante a verificação de 2FA:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro durante a verificação. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  // Autenticação biométrica
  const handleBiometricAuth = async () => {
    if (!biometricAvailable) return;
    
    setProcessingBiometric(true);
    
    try {
      // TODO: Implementar autenticação biométrica usando Web Authentication API
      
      // Simulação de autenticação biométrica
      setTimeout(async () => {
        const success = await authenticate("biometric_auth");
        
        if (success) {
          toast({
            title: "Autenticação bem-sucedida",
            description: "Autenticação biométrica realizada com sucesso.",
            variant: "default",
          });
          setFailedAttempts(0);
        } else {
          toast({
            title: "Falha na autenticação",
            description: "Não foi possível autenticar com biometria. Por favor, use senha.",
            variant: "destructive",
          });
        }
        
        setProcessingBiometric(false);
      }, 1500);
    } catch (error) {
      console.error('Erro durante autenticação biométrica:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro durante a autenticação biométrica. Por favor, use senha.",
        variant: "destructive",
      });
      setProcessingBiometric(false);
    }
  };
  
  // Voltar para etapa de senha
  const handleBackToPassword = () => {
    setStep('password');
    setTwoFactorCode('');
  };
  
  // Reenviar código 2FA
  const handleResend2FACode = async () => {
    try {
      // TODO: Implementar chamada à API para reenviar código 2FA
      toast({
        title: "Código reenviado",
        description: `Um novo código foi enviado para seu ${
          selectedMethod === 'app' ? 'aplicativo autenticador' :
          selectedMethod === 'sms' ? 'telefone via SMS' : 'e-mail'
        }.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Erro ao reenviar código 2FA:', error);
      toast({
        title: "Erro",
        description: "Não foi possível reenviar o código. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  // Renderização condicional baseada no estado de autenticação
  if (isAuthenticated) {
    return <>{children}</>;
  }
  
  // Tela de autenticação
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <Card className="w-full max-w-md shadow-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="text-center bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700 rounded-t-lg">
          <div className="flex justify-center mb-2">
            <Shield className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Autenticação de Segurança</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {step === 'password' 
              ? 'Insira sua senha para acessar o gerenciamento de pagamentos' 
              : 'Insira o código de verificação enviado'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertTitle className="text-red-800 dark:text-red-300">Erro</AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-400">{error}</AlertDescription>
            </Alert>
          )}
          
          {isLockoutActive && (
            <Alert variant="destructive" className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <LockKeyhole className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertTitle className="text-red-800 dark:text-red-300">Acesso bloqueado</AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-400">
                Muitas tentativas falhas. Tente novamente em {formatRemainingTime(lockoutRemaining)}.
              </AlertDescription>
            </Alert>
          )}
          
          {step === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLockoutActive || loading}
                    className="pr-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Insira sua senha corporativa para acessar informações financeiras
                </p>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button 
                  type="submit" 
                  disabled={isLockoutActive || loading || !password.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {loading ? 'Autenticando...' : 'Continuar'}
                </Button>
                
                {biometricAvailable && (
                  <Button
                    type="button"
                    onClick={handleBiometricAuth}
                    disabled={isLockoutActive || loading || processingBiometric}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <Fingerprint className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>
                      {processingBiometric ? 'Verificando...' : 'Usar biometria'}
                    </span>
                  </Button>
                )}
              </div>
            </form>
          ) : (
            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div className="mb-4">
                <Tabs defaultValue={selectedMethod} onValueChange={(value) => setSelectedMethod(value as any)}>
                  <TabsList className="grid grid-cols-3 mb-4 bg-gray-100 dark:bg-gray-700">
                    <TabsTrigger
                      value="app"
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                    >
                      App
                    </TabsTrigger>
                    <TabsTrigger
                      value="sms"
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                    >
                      SMS
                    </TabsTrigger>
                    <TabsTrigger
                      value="email"
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                    >
                      Email
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="app" className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Abra seu aplicativo autenticador e insira o código gerado
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="sms" className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Enviamos um código por SMS para o número *****1234
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="email" className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Enviamos um código para seu e-mail f****@hospital.com
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twoFactorCode" className="text-gray-700 dark:text-gray-300">
                  Código de Verificação
                </Label>
                <Input
                  id="twoFactorCode"
                  type="text"
                  placeholder="Digite o código"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  disabled={isLockoutActive || loading}
                  maxLength={6}
                  className="text-center text-lg tracking-widest bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button 
                  type="submit" 
                  disabled={isLockoutActive || loading || twoFactorCode.length < 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {loading ? 'Verificando...' : 'Verificar'}
                </Button>
                
                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={handleBackToPassword}
                    variant="link"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Voltar
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={handleResend2FACode}
                    variant="link"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Reenviar código
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
          <Button 
            variant="link" 
            onClick={() => setShowHelpDialog(true)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Precisa de ajuda?
          </Button>
        </CardFooter>
      </Card>
      
      {/* Dialog de ajuda */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-gray-100">Ajuda com Autenticação</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              O acesso ao sistema de pagamentos requer uma verificação adicional por motivos de segurança.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Senha</h4>
              <p>Use a mesma senha de sua conta corporativa do hospital.</p>
              
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mt-3 mb-1">Autenticação de dois fatores</h4>
              <p>
                Para maior segurança, informações financeiras requerem verificação adicional.
                Você pode receber códigos via:
              </p>
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <li>Aplicativo autenticador (Google Authenticator, Microsoft Authenticator)</li>
                <li>SMS no telefone cadastrado</li>
                <li>E-mail corporativo</li>
              </ul>
              
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mt-3 mb-1">Problemas de acesso?</h4>
              <p>
                Entre em contato com o departamento de TI pelo ramal 4500 ou
                pelo e-mail suporte@hospital.com
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowHelpDialog(false)}
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};