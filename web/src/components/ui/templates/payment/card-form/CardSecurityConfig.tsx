/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Switch } from '@/components/ui/organisms/switch';
import { Button } from '@/components/ui/organisms/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/organisms/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/organisms/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/organisms/dialog';
import {
  Shield,
  Lock,
  Globe,
  Smartphone,
  UserPlus,
  UserMinus,
  Search,
  User,
  AlertTriangle,
  CreditCard,
  Key,
  Check,
  X
} from 'lucide-react';
import { IPaymentCard } from '@/types/payment-types';

interface CardSecurityConfigProps {
  formData: Partial<IPaymentCard>;
  updateFormField: (path: string, value: any) => void;
  errors: Record<string, string>;
}

// Mock de usuários para seleção de aprovadores
const mockUsers = [
  { id: 'user-001', name: 'Carlos Mendes', role: 'Administrador', department: 'Administração' },
  { id: 'user-002', name: 'Ana Oliveira', role: 'Aprovador', department: 'Financeiro' },
  { id: 'user-003', name: 'Pedro Almeida', role: 'Aprovador', department: 'Farmácia' },
  { id: 'user-004', name: 'Fernanda Costa', role: 'Gerente', department: 'Administração' },
  { id: 'user-005', name: 'Maria Santos', role: 'Gerente', department: 'Suprimentos' },
  { id: 'user-006', name: 'João Silva', role: 'Supervisor', department: 'Centro Cirúrgico' },
  { id: 'user-007', name: 'Luciana Ferreira', role: 'Contador', department: 'Financeiro' },
  { id: 'user-008', name: 'Roberto Souza', role: 'Diretor', department: 'Diretoria' }
];

export const CardSecurityConfig: React.FC<CardSecurityConfigProps> = ({
  formData,
  updateFormField,
  errors
}) => {
  const [showApproversDialog, setShowApproversDialog] = useState(false);
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>(
    formData.securitySettings?.allowedApprovers || []
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar usuários para diálogo de aprovadores
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Atualizar aprovadores selecionados
  const toggleApprover = (userId: string) => {
    setSelectedApprovers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Salvar aprovadores no formulário
  const saveApprovers = () => {
    updateFormField('securitySettings.allowedApprovers', selectedApprovers);
    setShowApproversDialog(false);
  };

  // Verificar se há erros em um caminho específico
  const hasError = (path: string): boolean => {
    return Object.keys(errors).some(key => key.startsWith(path));
  };

  // Obter mensagem de erro para um caminho específico
  const getError = (path: string): string | undefined => {
    const key = Object.keys(errors).find(key => key.startsWith(path));
    return key ? errors[key] : undefined;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Configurações de Autenticação
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
                <Lock className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                Requisitos de Autenticação
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
                  checked={formData.securitySettings?.requiresPin || false}
                  onCheckedChange={(checked) => updateFormField('securitySettings.requiresPin', checked)}
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
                  checked={formData.securitySettings?.requires2FA || false}
                  onCheckedChange={(checked) => updateFormField('securitySettings.requires2FA', checked)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
                <Globe className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                Restrições de Uso
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
                  checked={formData.securitySettings?.allowOnlineTransactions || false}
                  onCheckedChange={(checked) => updateFormField('securitySettings.allowOnlineTransactions', checked)}
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
                  checked={formData.securitySettings?.allowInternationalTransactions || false}
                  onCheckedChange={(checked) => updateFormField('securitySettings.allowInternationalTransactions', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Configurações de Aprovação
        </h3>
        
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center text-gray-800 dark:text-gray-200">
                <Key className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                Limiar de Aprovação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="transactionApprovalThreshold" 
                  className={`font-medium text-gray-700 dark:text-gray-300 ${
                    hasError('securitySettings.transactionApprovalThreshold') 
                      ? 'text-red-500 dark:text-red-400' 
                      : ''
                  }`}
                >
                  Limiar para Aprovação Manual (R$)
                </Label>
                <Input
                  id="transactionApprovalThreshold"
                  type="number"
                  min={0}
                  step={100}
                  value={formData.securitySettings?.transactionApprovalThreshold || 5000}
                  onChange={(e) => updateFormField(
                    'securitySettings.transactionApprovalThreshold', 
                    parseFloat(e.target.value) || 0
                  )}
                  className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 ${
                    hasError('securitySettings.transactionApprovalThreshold') 
                      ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' 
                      : ''
                  }`}
                />
                {hasError('securitySettings.transactionApprovalThreshold') ? (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                    {getError('securitySettings.transactionApprovalThreshold')}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Transações acima deste valor necessitarão de aprovação manual.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="font-medium text-gray-700 dark:text-gray-300">
                    Aprovadores Autorizados
                  </Label>
                  <Dialog open={showApproversDialog} onOpenChange={setShowApproversDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <UserPlus className="h-3.5 w-3.5 mr-1" />
                        Gerenciar Aprovadores
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-gray-800 dark:text-gray-100">
                          Selecionar Aprovadores
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-400">
                          Escolha os usuários que poderão aprovar transações acima do limiar.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <Input
                          placeholder="Buscar por nome, cargo ou departamento"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                        />
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto space-y-2 my-4">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <div 
                              key={user.id}
                              onClick={() => toggleApprover(user.id)}
                              className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${
                                selectedApprovers.includes(user.id)
                                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              <div className="flex items-center">
                                <User className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-gray-200">
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {user.role} • {user.department}
                                  </p>
                                </div>
                              </div>
                              
                              {selectedApprovers.includes(user.id) && (
                                <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                            Nenhum usuário encontrado com os critérios de busca.
                          </div>
                        )}
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowApproversDialog(false)}
                          className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          onClick={saveApprovers}
                          className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Salvar Seleção
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  {formData.securitySettings?.allowedApprovers?.length ? (
                    <div className="max-h-36 overflow-y-auto space-y-2">
                      {formData.securitySettings.allowedApprovers.map((approverId) => {
                        const user = mockUsers.find(u => u.id === approverId);
                        return (
                          <div 
                            key={approverId}
                            className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                              <span className="text-gray-800 dark:text-gray-200">
                                {user ? user.name : approverId}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newApprovers = formData.securitySettings?.allowedApprovers?.filter(
                                  id => id !== approverId
                                ) || [];
                                updateFormField('securitySettings.allowedApprovers', newApprovers);
                                setSelectedApprovers(newApprovers);
                              }}
                              className="h-8 w-8 p-0 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-2 text-gray-500 dark:text-gray-400">
                      Nenhum aprovador selecionado. Clique em &quot;Gerenciar Aprovadores&quot; para adicionar.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-800 dark:text-blue-300">Recomendação de Segurança</AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-400">
          Para maior segurança, recomendamos habilitar a autenticação de dois fatores (2FA) e 
          configurar pelo menos dois aprovadores diferentes para transações de alto valor.
        </AlertDescription>
      </Alert>
    </div>
  );
};