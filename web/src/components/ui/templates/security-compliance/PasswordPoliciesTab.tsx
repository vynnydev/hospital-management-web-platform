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
import { useSecurityCompliance } from '@/hooks/security-compliance/useSecurityCompliance';
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
    if (score >= 9) return { label: 'Excelente', color: 'text-green-500 dark:text-green-400' };
    if (score >= 7) return { label: 'Boa', color: 'text-blue-500 dark:text-blue-400' };
    if (score >= 5) return { label: 'Moderada', color: 'text-yellow-500 dark:text-yellow-400' };
    if (score >= 3) return { label: 'Fraca', color: 'text-orange-500 dark:text-orange-400' };
    return { label: 'Muito fraca', color: 'text-red-500 dark:text-red-400' };
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
        <Label htmlFor="policyName" className="text-gray-700 dark:text-gray-300">Nome da Política</Label>
        <Input 
          id="policyName" 
          value={editingPolicy?.name || ''} 
          onChange={(e) => handleUpdatePolicyField('name', e.target.value)}
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minLength" className="text-gray-700 dark:text-gray-300">Comprimento mínimo</Label>
          <div className="flex items-center space-x-2">
            <Input 
              id="minLength" 
              type="number"
              min={6}
              max={30}
              value={editingPolicy?.minLength || 8} 
              onChange={(e) => handleUpdatePolicyField('minLength', parseInt(e.target.value))}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              required
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">caracteres</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="passwordExpiration" className="text-gray-700 dark:text-gray-300">Expiração da senha</Label>
          <div className="flex items-center space-x-2">
            <Input 
              id="passwordExpiration" 
              type="number"
              min={0}
              max={365}
              value={editingPolicy?.passwordExpiration || 0} 
              onChange={(e) => handleUpdatePolicyField('passwordExpiration', parseInt(e.target.value))}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              required
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">dias (0 = sem expiração)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="historyCount" className="text-gray-700 dark:text-gray-300">Histórico de senhas proibidas</Label>
          <div className="flex items-center space-x-2">
            <Input 
              id="historyCount" 
              type="number"
              min={0}
              max={24}
              value={editingPolicy?.historyCount || 0} 
              onChange={(e) => handleUpdatePolicyField('historyCount', parseInt(e.target.value))}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              required
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">senhas anteriores</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maxLoginAttempts" className="text-gray-700 dark:text-gray-300">Tentativas máximas de login</Label>
          <div className="flex items-center space-x-2">
            <Input 
              id="maxLoginAttempts" 
              type="number"
              min={1}
              max={10}
              value={editingPolicy?.maxLoginAttempts || 5} 
              onChange={(e) => handleUpdatePolicyField('maxLoginAttempts', parseInt(e.target.value))}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              required
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">tentativas</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lockoutDuration" className="text-gray-700 dark:text-gray-300">Tempo de bloqueio após tentativas</Label>
        <div className="flex items-center space-x-2">
          <Input 
            id="lockoutDuration" 
            type="number"
            min={1}
            max={1440}
            value={editingPolicy?.lockoutDuration || 15} 
            onChange={(e) => handleUpdatePolicyField('lockoutDuration', parseInt(e.target.value))}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            required
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">minutos</span>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-gray-700 dark:text-gray-300">Requisitos de caracteres</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center justify-between space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
            <Label htmlFor="requireUppercase" className="text-gray-700 dark:text-gray-300">Letras maiúsculas (A-Z)</Label>
            <Switch 
              id="requireUppercase" 
              checked={editingPolicy?.requireUppercase || false}
              onCheckedChange={(checked) => handleUpdatePolicyField('requireUppercase', checked)}
              className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
            <Label htmlFor="requireLowercase" className="text-gray-700 dark:text-gray-300">Letras minúsculas (a-z)</Label>
            <Switch 
              id="requireLowercase" 
              checked={editingPolicy?.requireLowercase || false}
              onCheckedChange={(checked) => handleUpdatePolicyField('requireLowercase', checked)}
              className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
            <Label htmlFor="requireNumbers" className="text-gray-700 dark:text-gray-300">Números (0-9)</Label>
            <Switch 
              id="requireNumbers" 
              checked={editingPolicy?.requireNumbers || false}
              onCheckedChange={(checked) => handleUpdatePolicyField('requireNumbers', checked)}
              className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
            <Label htmlFor="requireSpecialChars" className="text-gray-700 dark:text-gray-300">Caracteres especiais (!@#$...)</Label>
            <Switch 
              id="requireSpecialChars" 
              checked={editingPolicy?.requireSpecialChars || false}
              onCheckedChange={(checked) => handleUpdatePolicyField('requireSpecialChars', checked)}
              className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-gray-700 dark:text-gray-300">Restrições adicionais</Label>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
            <div>
              <Label htmlFor="prohibitCommonWords" className="text-gray-700 dark:text-gray-300">Proibir senhas comuns</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Previne uso de senhas como &quot;123456&quot;, &quot;password&quot;, etc.</p>
            </div>
            <Switch 
              id="prohibitCommonWords" 
              checked={editingPolicy?.prohibitCommonWords || false}
              onCheckedChange={(checked) => handleUpdatePolicyField('prohibitCommonWords', checked)}
              className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
            <div>
              <Label htmlFor="prohibitSequential" className="text-gray-700 dark:text-gray-300">Proibir caracteres sequenciais</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Previne sequências como &quot;123&quot;, &quot;abc&quot;, etc.</p>
            </div>
            <Switch 
              id="prohibitSequential" 
              checked={editingPolicy?.prohibitSequential || false}
              onCheckedChange={(checked) => handleUpdatePolicyField('prohibitSequential', checked)}
              className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
            <div>
              <Label htmlFor="prohibitContextual" className="text-gray-700 dark:text-gray-300">Proibir informações contextuais</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Previne uso de nome de usuário, hospital ou outros dados conhecidos</p>
            </div>
            <Switch 
              id="prohibitContextual" 
              checked={editingPolicy?.prohibitContextual || false}
              onCheckedChange={(checked) => handleUpdatePolicyField('prohibitContextual', checked)}
              className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300">Força da política</Label>
        <div className="space-y-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                passwordScore >= 8 ? 'bg-green-500 dark:bg-green-400' : 
                passwordScore >= 6 ? 'bg-blue-500 dark:bg-blue-400' : 
                passwordScore >= 4 ? 'bg-yellow-500 dark:bg-yellow-400' : 
                'bg-red-500 dark:bg-red-400'
              }`}
              style={{ width: `${passwordScore * 10}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Fraca</span>
            <span className={`text-sm font-medium ${getPolicyStrengthLabel(passwordScore).color}`}>
              {getPolicyStrengthLabel(passwordScore).label}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Forte</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="roleApplicability" className="text-gray-700 dark:text-gray-300">Aplicar a</Label>
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
          <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
            <SelectValue placeholder="Selecione a aplicabilidade" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectItem value="all" className="text-gray-900 dark:text-white">Todos os usuários (padrão)</SelectItem>
            <SelectItem value="custom" className="text-gray-900 dark:text-white">Papéis específicos</SelectItem>
          </SelectContent>
        </Select>
        
        {!editingPolicy?.isDefault && (
          <div className="pt-2">
            <Label className="text-gray-700 dark:text-gray-300">Papéis aplicáveis</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Administrador', 'Médico', 'Enfermeiro', 'Atendente', 'Paciente'].map((role) => (
                <div key={role} className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
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
                    className="mr-2 accent-primary dark:accent-primary-400"
                  />
                  <Label htmlFor={`role-${role}`} className="text-gray-700 dark:text-gray-300">{role}</Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => setEditingPolicy(null)}
          className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
        >
          {isCreatingPolicy ? 'Criar Política' : 'Salvar Alterações'}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Políticas de Senha</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure as regras de segurança para senhas de usuários</p>
        </div>
        <Button 
          onClick={handleCreateNewPolicy} 
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
        >
          <PlusCircle size={16} />
          Nova Política
        </Button>
      </div>

      {securityData?.passwordPolicies?.length === 0 ? (
        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-3 mb-4">
              <Lock className="h-6 w-6 text-primary dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhuma política configurada</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 mb-4">
              Configure políticas de senha para aumentar a segurança do sistema.
            </p>
            <Button 
              onClick={handleCreateNewPolicy}
              className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
            >
              Criar Primeira Política
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {securityData?.passwordPolicies?.map((policy) => {
            const strengthScore = calculatePolicyStrength(policy);
            const { label, color } = getPolicyStrengthLabel(strengthScore);
            
            return (
              <Card key={policy.id} className="overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                        {policy.name}
                        {policy.isDefault && <Badge variant="outline" className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">Padrão</Badge>}
                      </CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400">
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
                          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle className="text-gray-900 dark:text-white">Editar Política de Senha</DialogTitle>
                          <DialogDescription className="text-gray-500 dark:text-gray-400">
                            Ajuste os requisitos e configurações para esta política de senha.
                          </DialogDescription>
                        </DialogHeader>
                        <div className='mt-20'>
                          <DialogForm />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">Força da política:</span>
                      <span className={color}>{label} ({strengthScore}/10)</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          strengthScore >= 8 ? 'bg-green-500 dark:bg-green-400' : 
                          strengthScore >= 6 ? 'bg-blue-500 dark:bg-blue-400' : 
                          strengthScore >= 4 ? 'bg-yellow-500 dark:bg-yellow-400' : 
                          'bg-red-500 dark:bg-red-400'
                        }`}
                        style={{ width: `${strengthScore * 10}%` }}
                      ></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500 dark:text-gray-400">Mín. caracteres:</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{policy.minLength}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500 dark:text-gray-400">Expiração:</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{policy.passwordExpiration > 0 ? `${policy.passwordExpiration} dias` : 'Não expira'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500 dark:text-gray-400">Histórico:</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{policy.historyCount > 0 ? `${policy.historyCount} senhas` : 'Desativado'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500 dark:text-gray-400">Bloqueio:</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Após {policy.maxLoginAttempts} tentativas</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {policy.requireUppercase && (
                        <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Maiúsculas</Badge>
                      )}
                      {policy.requireLowercase && (
                        <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Minúsculas</Badge>
                      )}
                      {policy.requireNumbers && (
                        <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Números</Badge>
                      )}
                      {policy.requireSpecialChars && (
                        <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Caracteres especiais</Badge>
                      )}
                      {policy.prohibitCommonWords && (
                        <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Anti-senhas comuns</Badge>
                      )}
                      {policy.prohibitSequential && (
                        <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Anti-sequências</Badge>
                      )}
                      {policy.prohibitContextual && (
                        <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Anti-contexto</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-gray-500 dark:text-gray-400 flex justify-between pt-2">
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
            className={`${securityData?.passwordPolicies?.length === 0 ? 'hidden' : ''} border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Política
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Nova Política de Senha</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Configure os requisitos e regras para esta política de senha.
            </DialogDescription>
          </DialogHeader>
          <DialogForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};