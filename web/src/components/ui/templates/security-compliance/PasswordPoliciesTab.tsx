/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Badge } from '@/components/ui/organisms/badge';
import { Switch } from '@/components/ui/organisms/switch';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/organisms/dialog';
import { AlertTriangle, CheckCircle, Edit2, Lock, PlusCircle, Trash2, Users } from 'lucide-react';
import { useSecurityCompliance } from '@/services/hooks/security-compliance/useSecurityCompliance';
import { IPasswordPolicy } from '@/types/security-compliance-types';
import { useToast } from '@/components/ui/hooks/use-toast';

export const PasswordPoliciesTab = () => {
  const { securityData, updatePasswordPolicy, createPasswordPolicy, loading } = useSecurityCompliance();
  const [editingPolicy, setEditingPolicy] = useState<IPasswordPolicy | null>(null);
  const [isCreatingPolicy, setIsCreatingPolicy] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const { toast } = useToast();

  const calculatePolicyStrength = (policy: IPasswordPolicy): number => {
    let score = 0;
    // Base score from length
    score += Math.min(5, policy.minLength / 4);
    
    // Character complexity
    if (policy.requireUppercase) score += 1;
    if (policy.requireLowercase) score += 1;
    if (policy.requireNumbers) score += 1;
    if (policy.requireSpecialChars) score += 2;
    
    // Word restrictions
    if (policy.prohibitCommonWords) score += 2;
    if (policy.prohibitSequential) score += 1;
    if (policy.prohibitContextual) score += 1;
    
    // History
    score += Math.min(2, policy.historyCount / 6);
    
    // Expiration
    if (policy.passwordExpiration > 0) {
      // More points for reasonable expiration (30-90 days)
      score += policy.passwordExpiration <= 90 ? 2 : 1;
    }
    
    // Normalize to 0-10 scale
    return Math.min(10, score);
  };

  const getPolicyStrengthLabel = (score: number): { label: string; color: string } => {
    if (score >= 9) return { label: 'Excelente', color: 'text-green-500' };
    if (score >= 7) return { label: 'Boa', color: 'text-blue-500' };
    if (score >= 5) return { label: 'Moderada', color: 'text-yellow-500' };
    if (score >= 3) return { label: 'Fraca', color: 'text-orange-500' };
    return { label: 'Muito fraca', color: 'text-red-500' };
  };

  const handleSubmitPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isCreatingPolicy && editingPolicy) {
        // Remove id for creation
        const { id, createdAt, updatedAt, ...newPolicy } = editingPolicy;
        await createPasswordPolicy(newPolicy);
        toast({
          title: "Política criada com sucesso",
          description: "A nova política de senha foi adicionada ao sistema.",
          variant: "default",
        });
      } else if (editingPolicy) {
        await updatePasswordPolicy(editingPolicy);
        toast({
          title: "Política atualizada",
          description: "As alterações foram salvas com sucesso.",
          variant: "default",
        });
      }
      
      setEditingPolicy(null);
      setIsCreatingPolicy(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a política de senha.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePolicyField = (field: keyof IPasswordPolicy, value: any) => {
    if (!editingPolicy) return;
    
    const updatedPolicy = { ...editingPolicy, [field]: value };
    setEditingPolicy(updatedPolicy);
    
    // Recalculate score for visual feedback
    if (field !== 'name' && field !== 'id' && field !== 'isDefault') {
      setPasswordScore(calculatePolicyStrength(updatedPolicy));
    }
  };

  const handleCreateNewPolicy = () => {
    // Create a template for a new policy
    const defaultPolicy: IPasswordPolicy = {
      id: 'new',
      name: 'Nova Política',
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      prohibitCommonWords: true,
      prohibitSequential: false,
      prohibitContextual: false,
      passwordExpiration: 90,
      historyCount: 3,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      roleApplicability: [],
    };
    
    setEditingPolicy(defaultPolicy);
    setPasswordScore(calculatePolicyStrength(defaultPolicy));
    setIsCreatingPolicy(true);
  };

  const handleEditPolicy = (policy: IPasswordPolicy) => {
    setEditingPolicy({ ...policy });
    setPasswordScore(calculatePolicyStrength(policy));
    setIsCreatingPolicy(false);
  };

  const DialogForm = () => (
    <form onSubmit={handleSubmitPolicy} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="policyName">Nome da Política</Label>
        <Input 
          id="policyName" 
          value={editingPolicy?.name || ''} 
          onChange={(e) => handleUpdatePolicyField('name', e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minLength">Comprimento mínimo</Label>
          <div className="flex items-center space-x-2">
            <Input 
              id="minLength" 
              type="number"
              min={6}
              max={30}
              value={editingPolicy?.minLength || 8} 
              onChange={(e) => handleUpdatePolicyField('minLength', parseInt(e.target.value))}
              required
            />
            <span className="text-sm text-gray-500">caracteres</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="passwordExpiration">Expiração da senha</Label>
          <div className="flex items-center space-x-2">
            <Input 
              id="passwordExpiration" 
              type="number"
              min={0}
              max={365}
              value={editingPolicy?.passwordExpiration || 0} 
              onChange={(e) => handleUpdatePolicyField('passwordExpiration', parseInt(e.target.value))}
              required
            />
            <span className="text-sm text-gray-500">dias (0 = sem expiração)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="historyCount">Histórico de senhas proibidas</Label>
          <div className="flex items-center space-x-2">
            <Input 
              id="historyCount" 
              type="number"
              min={0}
              max={24}
              value={editingPolicy?.historyCount || 0} 
              onChange={(e) => handleUpdatePolicyField('historyCount', parseInt(e.target.value))}
              required
            />
            <span className="text-sm text-gray-500">senhas anteriores</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maxLoginAttempts">Tentativas máximas de login</Label>
          <div className="flex items-center space-x-2">
            <Input 
              id="maxLoginAttempts" 
              type="number"
              min={1}
              max={10}
              value={editingPolicy?.maxLoginAttempts || 5} 
              onChange={(e) => handleUpdatePolicyField('maxLoginAttempts', parseInt(e.target.value))}
              required
            />
            <span className="text-sm text-gray-500">tentativas</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lockoutDuration">Tempo de bloqueio após tentativas</Label>
        <div className="flex items-center space-x-2">
          <Input 
            id="lockoutDuration" 
            type="number"
            min={1}
            max={1440}
            value={editingPolicy?.lockoutDuration || 15} 
            onChange={(e) => handleUpdatePolicyField('lockoutDuration', parseInt(e.target.value))}
            required
          />
          <span className="text-sm text-gray-500">minutos</span>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Requisitos de caracteres</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
            <Label htmlFor="requireUppercase">Letras maiúsculas (A-Z)</Label>
            <Switch 
              id="requireUppercase" 
              checked={editingPolicy?.requireUppercase || false}
              onCheckedChange={(checked) => handleUpdatePolicyField('requireUppercase', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
            <Label htmlFor="requireLowercase">Letras minúsculas (a-z)</Label>
            <Switch 
              id="requireLowercase" 
              checked={editingPolicy?.requireLowercase || false}
              onCheckedChange={(checked) => handleUpdatePolicyField('requireLowercase', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
            <Label htmlFor="requireNumbers">Números (0-9)</Label>
            <Switch 
              id="requireNumbers" 
              checked={editingPolicy?.requireNumbers || false}
              onCheckedChange={(checked) => handleUpdatePolicyField('requireNumbers', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
            <Label htmlFor="requireSpecialChars">Caracteres especiais (!@#$...)</Label>
            <Switch 
              id="requireSpecialChars" 
              checked={editingPolicy?.requireSpecialChars || false}
              onCheckedChange={(checked) => handleUpdatePolicyField('requireSpecialChars', checked)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Restrições adicionais</Label>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
            <div>
              <Label htmlFor="prohibitCommonWords">Proibir senhas comuns</Label>
              <p className="text-xs text-gray-500">Previne uso de senhas como &quot;123456&quot;, &quot;password&quot;, etc.</p>
            </div>
            <Switch 
              id="prohibitCommonWords" 
              checked={editingPolicy?.prohibitCommonWords || false}
              onCheckedChange={(checked) => handleUpdatePolicyField('prohibitCommonWords', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
            <div>
              <Label htmlFor="prohibitSequential">Proibir caracteres sequenciais</Label>
              <p className="text-xs text-gray-500">Previne sequências como &quot;123&quot;, &quot;abc&quot;, etc.</p>
            </div>
            <Switch 
              id="prohibitSequential" 
              checked={editingPolicy?.prohibitSequential || false}
              onCheckedChange={(checked) => handleUpdatePolicyField('prohibitSequential', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
            <div>
              <Label htmlFor="prohibitContextual">Proibir informações contextuais</Label>
              <p className="text-xs text-gray-500">Previne uso de nome de usuário, hospital ou outros dados conhecidos</p>
            </div>
            <Switch 
              id="prohibitContextual" 
              checked={editingPolicy?.prohibitContextual || false}
              onCheckedChange={(checked) => handleUpdatePolicyField('prohibitContextual', checked)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Força da política</Label>
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                passwordScore >= 8 ? 'bg-green-500' : 
                passwordScore >= 6 ? 'bg-blue-500' : 
                passwordScore >= 4 ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}
              style={{ width: `${passwordScore * 10}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Fraca</span>
            <span className={`text-sm font-medium ${getPolicyStrengthLabel(passwordScore).color}`}>
              {getPolicyStrengthLabel(passwordScore).label}
            </span>
            <span className="text-xs text-gray-500">Forte</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="roleApplicability">Aplicar a</Label>
        <Select 
          value={editingPolicy?.isDefault ? 'all' : 'custom'} 
          onValueChange={(value) => {
            if (value === 'all') {
              handleUpdatePolicyField('isDefault', true);
              handleUpdatePolicyField('roleApplicability', []);
            } else {
              handleUpdatePolicyField('isDefault', false);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a aplicabilidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os usuários (padrão)</SelectItem>
            <SelectItem value="custom">Papéis específicos</SelectItem>
          </SelectContent>
        </Select>
        
        {!editingPolicy?.isDefault && (
          <div className="pt-2">
            <Label>Papéis aplicáveis</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Administrador', 'Médico', 'Enfermeiro', 'Atendente', 'Paciente'].map((role) => (
                <div key={role} className="flex items-center space-x-2 p-2 border rounded-md">
                  <input
                    type="checkbox"
                    id={`role-${role}`}
                    checked={editingPolicy?.roleApplicability.includes(role)}
                    onChange={(e) => {
                      const currentRoles = [...(editingPolicy?.roleApplicability || [])];
                      if (e.target.checked) {
                        if (!currentRoles.includes(role)) {
                          handleUpdatePolicyField('roleApplicability', [...currentRoles, role]);
                        }
                      } else {
                        handleUpdatePolicyField('roleApplicability', 
                          currentRoles.filter(r => r !== role)
                        );
                      }
                    }}
                    className="mr-2"
                  />
                  <Label htmlFor={`role-${role}`}>{role}</Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" type="button" onClick={() => setEditingPolicy(null)}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {isCreatingPolicy ? 'Criar Política' : 'Salvar Alterações'}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Políticas de Senha</h3>
          <p className="text-sm text-gray-500">Configure as regras de segurança para senhas de usuários</p>
        </div>
        <Button onClick={handleCreateNewPolicy} className="flex items-center gap-2">
          <PlusCircle size={16} />
          Nova Política
        </Button>
      </div>

      {securityData?.passwordPolicies?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Nenhuma política configurada</h3>
            <p className="text-sm text-gray-500 text-center mt-2 mb-4">
              Configure políticas de senha para aumentar a segurança do sistema.
            </p>
            <Button onClick={handleCreateNewPolicy}>Criar Primeira Política</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {securityData?.passwordPolicies?.map((policy) => {
            const strengthScore = calculatePolicyStrength(policy);
            const { label, color } = getPolicyStrengthLabel(strengthScore);
            
            return (
              <Card key={policy.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {policy.name}
                        {policy.isDefault && <Badge variant="outline">Padrão</Badge>}
                      </CardTitle>
                      <CardDescription>
                        {policy.roleApplicability.length > 0 
                          ? `Aplicada a ${policy.roleApplicability.join(', ')}`
                          : 'Aplicada a todos os usuários'}
                      </CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditPolicy(policy)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Editar Política de Senha</DialogTitle>
                          <DialogDescription>
                            Ajuste os requisitos e configurações para esta política de senha.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogForm />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Força da política:</span>
                      <span className={color}>{label} ({strengthScore}/10)</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          strengthScore >= 8 ? 'bg-green-500' : 
                          strengthScore >= 6 ? 'bg-blue-500' : 
                          strengthScore >= 4 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${strengthScore * 10}%` }}
                      ></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Mín. caracteres:</span>
                        <span className="font-medium">{policy.minLength}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Expiração:</span>
                        <span className="font-medium">{policy.passwordExpiration > 0 ? `${policy.passwordExpiration} dias` : 'Não expira'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Histórico:</span>
                        <span className="font-medium">{policy.historyCount > 0 ? `${policy.historyCount} senhas` : 'Desativado'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Bloqueio:</span>
                        <span className="font-medium">Após {policy.maxLoginAttempts} tentativas</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {policy.requireUppercase && (
                        <Badge variant="secondary">Maiúsculas</Badge>
                      )}
                      {policy.requireLowercase && (
                        <Badge variant="secondary">Minúsculas</Badge>
                      )}
                      {policy.requireNumbers && (
                        <Badge variant="secondary">Números</Badge>
                      )}
                      {policy.requireSpecialChars && (
                        <Badge variant="secondary">Caracteres especiais</Badge>
                      )}
                      {policy.prohibitCommonWords && (
                        <Badge variant="secondary">Anti-senhas comuns</Badge>
                      )}
                      {policy.prohibitSequential && (
                        <Badge variant="secondary">Anti-sequências</Badge>
                      )}
                      {policy.prohibitContextual && (
                        <Badge variant="secondary">Anti-contexto</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-gray-500 flex justify-between pt-2">
                  <span>
                    Criada: {new Date(policy.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    Atualizada: {new Date(policy.updatedAt).toLocaleDateString()}
                  </span>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            onClick={handleCreateNewPolicy}
            className={securityData?.passwordPolicies?.length === 0 ? 'hidden' : ''}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Política
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nova Política de Senha</DialogTitle>
            <DialogDescription>
              Configure os requisitos e regras para esta política de senha.
            </DialogDescription>
          </DialogHeader>
          <DialogForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};
