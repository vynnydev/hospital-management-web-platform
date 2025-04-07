import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Switch } from '@/components/ui/organisms/switch';
import { Input } from '@/components/ui/organisms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Label } from '@/components/ui/organisms/label';
import { Badge } from '@/components/ui/organisms/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { Progress } from '@/components/ui/organisms/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/organisms/dialog';
import { Separator } from '@/components/ui/organisms/Separator';
import { useToast } from '@/components/ui/hooks/use-toast';
import { 
  Shield, 
  Lock, 
  Key, 
  RefreshCw, 
  FileCheck, 
  FileLock, 
  HardDrive, 
  Database, 
  AlertTriangle,
  Info,
  CheckCircle,
  FileX
} from 'lucide-react';

export const DataEncryptionConfig: React.FC = () => {
  const [atRestEncryption, setAtRestEncryption] = useState(true);
  const [transitEncryption, setTransitEncryption] = useState(true);
  const [keyRotation, setKeyRotation] = useState(90);
  const [encryptionAlgorithm, setEncryptionAlgorithm] = useState('AES-256');
  const [keyManagement, setKeyManagement] = useState('managed');
  const [isRotatingKeys, setIsRotatingKeys] = useState(false);
  const [showDeleteKeysDialog, setShowDeleteKeysDialog] = useState(false);
  const { toast } = useToast();

  const handleRotateKeys = () => {
    setIsRotatingKeys(true);
    
    // Simulação de rotação de chaves
    setTimeout(() => {
      setIsRotatingKeys(false);
      toast({
        title: "Chaves rotacionadas",
        description: "Todas as chaves de criptografia foram rotacionadas com sucesso.",
        variant: "default",
      });
    }, 2000);
  };

  const handleSaveConfig = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações de criptografia foram atualizadas com sucesso.",
      variant: "default",
    });
  };

  const getEncryptionStatus = () => {
    if (atRestEncryption && transitEncryption) {
      return { 
        status: 'Completa', 
        color: 'bg-green-500 dark:bg-green-500', 
        textColor: 'text-green-700 dark:text-green-400', 
        message: 'Dados protegidos em repouso e em trânsito' 
      };
    } else if (atRestEncryption || transitEncryption) {
      return { 
        status: 'Parcial', 
        color: 'bg-yellow-500 dark:bg-yellow-500', 
        textColor: 'text-yellow-700 dark:text-yellow-400', 
        message: 'Apenas dados em ' + (atRestEncryption ? 'repouso' : 'trânsito') + ' estão protegidos' 
      };
    } else {
      return { 
        status: 'Nenhuma', 
        color: 'bg-red-500 dark:bg-red-500', 
        textColor: 'text-red-700 dark:text-red-400', 
        message: 'Dados não estão criptografados' 
      };
    }
  };

  const encryptionStatus = getEncryptionStatus();

  const dataTypesEncrypted = [
    { name: 'Dados médicos', status: atRestEncryption ? 'encrypted' : 'not-encrypted' },
    { name: 'Dados pessoais', status: atRestEncryption ? 'encrypted' : 'not-encrypted' },
    { name: 'Credenciais', status: 'encrypted' },
    { name: 'Logs de auditoria', status: atRestEncryption ? 'encrypted' : 'not-encrypted' },
    { name: 'Backups', status: atRestEncryption ? 'encrypted' : 'not-encrypted' },
    { name: 'Comunicações', status: transitEncryption ? 'encrypted' : 'not-encrypted' },
  ];

  return (
    <div className="space-y-4">
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Shield className="h-5 w-5 text-primary dark:text-primary-400" />
                Configurações de Criptografia
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Configure a criptografia de dados sensíveis em repouso e em trânsito
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`${encryptionStatus.textColor} ${encryptionStatus.color.replace('bg', 'bg-opacity-10')} ${encryptionStatus.color.replace('bg', 'border')}`}
              >
                {encryptionStatus.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <div className="font-medium flex items-center text-gray-900 dark:text-white">
                  <HardDrive className="h-4 w-4 mr-2 text-primary dark:text-primary-400" />
                  Criptografia em Repouso (Data-at-Rest)
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Criptografa dados armazenados em banco de dados, arquivos e backups
                </div>
              </div>
              <Switch
                checked={atRestEncryption}
                onCheckedChange={setAtRestEncryption}
                className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <div className="font-medium flex items-center text-gray-900 dark:text-white">
                  <Database className="h-4 w-4 mr-2 text-primary dark:text-primary-400" />
                  Criptografia em Trânsito (Data-in-Transit)
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Criptografa dados durante transmissão na rede (TLS/SSL)
                </div>
              </div>
              <Switch
                checked={transitEncryption}
                onCheckedChange={setTransitEncryption}
                className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
              />
            </div>
          </div>
          
          <Separator className="bg-gray-200 dark:bg-gray-700" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="algorithm" className="text-gray-700 dark:text-gray-300">Algoritmo de Criptografia</Label>
              <Select
                value={encryptionAlgorithm}
                onValueChange={setEncryptionAlgorithm}
              >
                <SelectTrigger id="algorithm" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Selecione um algoritmo" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="AES-256" className="text-gray-900 dark:text-white">AES-256</SelectItem>
                  <SelectItem value="AES-128" className="text-gray-900 dark:text-white">AES-128</SelectItem>
                  <SelectItem value="ChaCha20-Poly1305" className="text-gray-900 dark:text-white">ChaCha20-Poly1305</SelectItem>
                  <SelectItem value="RSA-2048" className="text-gray-900 dark:text-white">RSA-2048</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Algoritmo utilizado para criptografar dados sensíveis
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="key-management" className="text-gray-700 dark:text-gray-300">Gerenciamento de Chaves</Label>
              <Select
                value={keyManagement}
                onValueChange={setKeyManagement}
              >
                <SelectTrigger id="key-management" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Selecione um método" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="managed" className="text-gray-900 dark:text-white">Gerenciado (KMS)</SelectItem>
                  <SelectItem value="hsm" className="text-gray-900 dark:text-white">HSM (Hardware Security Module)</SelectItem>
                  <SelectItem value="manual" className="text-gray-900 dark:text-white">Manual</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Método utilizado para gerenciar chaves criptográficas
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="key-rotation" className="text-gray-700 dark:text-gray-300">Rotação Automática de Chaves</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="key-rotation" 
                type="number"
                min={0}
                max={365}
                value={keyRotation} 
                onChange={(e) => setKeyRotation(parseInt(e.target.value))}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">dias</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Intervalo para rotação automática de chaves (0 = desativado)
            </p>
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={handleRotateKeys}
                disabled={isRotatingKeys}
              >
                {isRotatingKeys ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Rotacionar Chaves Agora
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setShowDeleteKeysDialog(true)}
              >
                <FileX className="h-4 w-4" />
                Redefinir Chaves
              </Button>
            </div>
          </div>
          
          <Separator className="bg-gray-200 dark:bg-gray-700" />
          
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Status de Criptografia por Tipo de Dado</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {dataTypesEncrypted.map((dataType, index) => (
                <div key={index} className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{dataType.name}</span>
                  {dataType.status === 'encrypted' ? (
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">Criptografado</Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-500 dark:text-red-400 border-red-200 dark:border-red-800">Não criptografado</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <Alert 
            variant={atRestEncryption && transitEncryption ? "default" : "warning"}
            className={atRestEncryption && transitEncryption 
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
              : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
            }
          >
            {atRestEncryption && transitEncryption ? (
              <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
            )}
            <AlertTitle className={atRestEncryption && transitEncryption 
              ? "text-green-800 dark:text-green-300" 
              : "text-yellow-800 dark:text-yellow-300"
            }>
              {atRestEncryption && transitEncryption 
                ? "Proteção completa ativada" 
                : "Proteção parcial ativada"
              }
            </AlertTitle>
            <AlertDescription className={atRestEncryption && transitEncryption 
              ? "text-green-700 dark:text-green-400" 
              : "text-yellow-700 dark:text-yellow-400"
            }>
              {encryptionStatus.message}. 
              {!atRestEncryption && "LGPD e HIPAA recomendam a criptografia de dados em repouso. "}
              {!transitEncryption && "A criptografia em trânsito é essencial para proteção contra interceptação."}
            </AlertDescription>
          </Alert>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <Key className="h-3 w-3 mr-1" />
            <span>
              Última rotação: {new Date().toLocaleDateString()}
            </span>
          </div>
          <Button 
            onClick={handleSaveConfig}
            className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
          >
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-base text-gray-900 dark:text-white">Estatísticas de Criptografia</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Visão geral dos dados protegidos e status das chaves
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 dark:text-gray-300">Volume de dados criptografados:</span>
              <span className="font-medium text-gray-900 dark:text-white">85%</span>
            </div>
            <Progress 
              value={85} 
              className="h-2 bg-gray-200 dark:bg-gray-700"
              indicatorClassName="bg-primary dark:bg-primary-400"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bases de Dados</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">12 tabelas</div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Backups</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">30 arquivos</div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Arquivos</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">72%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">1,452 arquivos</div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Conexões</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">TLS 1.3</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Ver Relatório Detalhado
          </Button>
        </CardFooter>
      </Card>
      
      {/* Dialog para confirmar redefinição de chaves */}
      <Dialog open={showDeleteKeysDialog} onOpenChange={setShowDeleteKeysDialog}>
        <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Redefinir Chaves de Criptografia</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Esta ação irá redefinir todas as chaves de criptografia. Os dados precisarão ser recriptografados.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Alert 
              variant="destructive" 
              className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            >
              <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
              <AlertTitle className="text-red-800 dark:text-red-300">Atenção! Ação irreversível</AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-400">
                A redefinição de chaves é uma operação potencialmente destrutiva. Dados não recriptografados 
                podem ficar inacessíveis. Tenha certeza de que possui backups adequados.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-reset" className="text-gray-700 dark:text-gray-300">Digite &quot;REDEFINIR CHAVES&quot; para confirmar:</Label>
              <Input 
                id="confirm-reset" 
                placeholder="REDEFINIR CHAVES" 
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setShowDeleteKeysDialog(false)}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
            >
              Redefinir Chaves
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};