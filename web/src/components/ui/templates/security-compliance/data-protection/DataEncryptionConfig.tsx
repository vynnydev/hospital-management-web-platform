/* eslint-disable @typescript-eslint/no-unused-vars */
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
      return { status: 'Completa', color: 'bg-green-500', textColor: 'text-green-700', message: 'Dados protegidos em repouso e em trânsito' };
    } else if (atRestEncryption || transitEncryption) {
      return { status: 'Parcial', color: 'bg-yellow-500', textColor: 'text-yellow-700', message: 'Apenas dados em ' + (atRestEncryption ? 'repouso' : 'trânsito') + ' estão protegidos' };
    } else {
      return { status: 'Nenhuma', color: 'bg-red-500', textColor: 'text-red-700', message: 'Dados não estão criptografados' };
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
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Criptografia
              </CardTitle>
              <CardDescription>
                Configure a criptografia de dados sensíveis em repouso e em trânsito
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${encryptionStatus.textColor} ${encryptionStatus.color.replace('bg', 'bg-opacity-10')} ${encryptionStatus.color.replace('bg', 'border')}`}>
                {encryptionStatus.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
              <div>
                <div className="font-medium flex items-center">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Criptografia em Repouso (Data-at-Rest)
                </div>
                <div className="text-sm text-gray-500">
                  Criptografa dados armazenados em banco de dados, arquivos e backups
                </div>
              </div>
              <Switch
                checked={atRestEncryption}
                onCheckedChange={setAtRestEncryption}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
              <div>
                <div className="font-medium flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  Criptografia em Trânsito (Data-in-Transit)
                </div>
                <div className="text-sm text-gray-500">
                  Criptografa dados durante transmissão na rede (TLS/SSL)
                </div>
              </div>
              <Switch
                checked={transitEncryption}
                onCheckedChange={setTransitEncryption}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="algorithm">Algoritmo de Criptografia</Label>
              <Select
                value={encryptionAlgorithm}
                onValueChange={setEncryptionAlgorithm}
              >
                <SelectTrigger id="algorithm">
                  <SelectValue placeholder="Selecione um algoritmo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AES-256">AES-256</SelectItem>
                  <SelectItem value="AES-128">AES-128</SelectItem>
                  <SelectItem value="ChaCha20-Poly1305">ChaCha20-Poly1305</SelectItem>
                  <SelectItem value="RSA-2048">RSA-2048</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Algoritmo utilizado para criptografar dados sensíveis
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="key-management">Gerenciamento de Chaves</Label>
              <Select
                value={keyManagement}
                onValueChange={setKeyManagement}
              >
                <SelectTrigger id="key-management">
                  <SelectValue placeholder="Selecione um método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="managed">Gerenciado (KMS)</SelectItem>
                  <SelectItem value="hsm">HSM (Hardware Security Module)</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Método utilizado para gerenciar chaves criptográficas
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="key-rotation">Rotação Automática de Chaves</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="key-rotation" 
                type="number"
                min={0}
                max={365}
                value={keyRotation} 
                onChange={(e) => setKeyRotation(parseInt(e.target.value))}
              />
              <span className="text-sm">dias</span>
            </div>
            <p className="text-xs text-gray-500">
              Intervalo para rotação automática de chaves (0 = desativado)
            </p>
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
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
                className="flex items-center gap-2 text-red-500 hover:text-red-700"
                onClick={() => setShowDeleteKeysDialog(true)}
              >
                <FileX className="h-4 w-4" />
                Redefinir Chaves
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Status de Criptografia por Tipo de Dado</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {dataTypesEncrypted.map((dataType, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                  <span className="text-sm">{dataType.name}</span>
                  {dataType.status === 'encrypted' ? (
                    <Badge className="bg-green-100 text-green-800">Criptografado</Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-500">Não criptografado</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <Alert variant={atRestEncryption && transitEncryption ? "default" : "warning"}>
            {atRestEncryption && transitEncryption ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertTitle>
              {atRestEncryption && transitEncryption 
                ? "Proteção completa ativada" 
                : "Proteção parcial ativada"
              }
            </AlertTitle>
            <AlertDescription>
              {encryptionStatus.message}. 
              {!atRestEncryption && "LGPD e HIPAA recomendam a criptografia de dados em repouso. "}
              {!transitEncryption && "A criptografia em trânsito é essencial para proteção contra interceptação."}
            </AlertDescription>
          </Alert>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center">
          <div className="text-xs text-gray-500 flex items-center">
            <Key className="h-3 w-3 mr-1" />
            <span>
              Última rotação: {new Date().toLocaleDateString()}
            </span>
          </div>
          <Button onClick={handleSaveConfig}>
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estatísticas de Criptografia</CardTitle>
          <CardDescription>
            Visão geral dos dados protegidos e status das chaves
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Volume de dados criptografados:</span>
              <span className="font-medium">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Bases de Dados</div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-xs text-gray-500">12 tabelas</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Backups</div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-xs text-gray-500">30 arquivos</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Arquivos</div>
              <div className="text-2xl font-bold">72%</div>
              <div className="text-xs text-gray-500">1,452 arquivos</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Conexões</div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-xs text-gray-500">TLS 1.3</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Ver Relatório Detalhado
          </Button>
        </CardFooter>
      </Card>
      
      {/* Dialog para confirmar redefinição de chaves */}
      <Dialog open={showDeleteKeysDialog} onOpenChange={setShowDeleteKeysDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redefinir Chaves de Criptografia</DialogTitle>
            <DialogDescription>
              Esta ação irá redefinir todas as chaves de criptografia. Os dados precisarão ser recriptografados.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Atenção! Ação irreversível</AlertTitle>
              <AlertDescription>
                A redefinição de chaves é uma operação potencialmente destrutiva. Dados não recriptografados 
                podem ficar inacessíveis. Tenha certeza de que possui backups adequados.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-reset">Digite &quot;REDEFINIR CHAVES&quot; para confirmar:</Label>
              <Input id="confirm-reset" placeholder="REDEFINIR CHAVES" />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setShowDeleteKeysDialog(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive">
              Redefinir Chaves
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
