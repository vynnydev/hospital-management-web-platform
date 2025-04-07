/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Checkbox } from '@/components/ui/organisms/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/organisms/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/organisms/table';
import { useToast } from '@/components/ui/hooks/use-toast';
import { Badge } from '@/components/ui/organisms/badge';
import { IRBAPolicy, TPermissionAction, TPermissionScope } from '@/types/security-compliance-types';
import { Users, PlusCircle, Edit, Trash2, ShieldCheck, Info } from 'lucide-react';

interface RBAConfigPanelProps {
  policies: IRBAPolicy[];
  roles: { id: string; name: string }[];
  resources: { id: string; name: string; scope: TPermissionScope }[];
  updateRBAPolicy: (policy: IRBAPolicy) => Promise<any>;
  createRBAPolicy: (policy: Omit<IRBAPolicy, 'id' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  deleteRBAPolicy: (id: string) => Promise<any>;
  loading: boolean;
}

export const RBAConfigPanel: React.FC<RBAConfigPanelProps> = ({
  policies,
  roles,
  resources,
  updateRBAPolicy,
  createRBAPolicy,
  deleteRBAPolicy,
  loading
}) => {
  const [editingPolicy, setEditingPolicy] = useState<IRBAPolicy | null>(null);
  const [isCreatingPolicy, setIsCreatingPolicy] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const allPermissionActions: TPermissionAction[] = ['view', 'create', 'edit', 'delete', 'approve', 'export'];

  const getPermissionScopeLabel = (scope: TPermissionScope): string => {
    const labels: Record<TPermissionScope, string> = {
      'hospital': 'Hospital',
      'department': 'Departamento',
      'staff': 'Equipe',
      'patient': 'Paciente',
      'system': 'Sistema'
    };
    return labels[scope] || scope;
  };

  const getActionLabel = (action: TPermissionAction): string => {
    const labels: Record<TPermissionAction, string> = {
      'view': 'Visualizar',
      'create': 'Criar',
      'edit': 'Editar',
      'delete': 'Excluir',
      'approve': 'Aprovar',
      'export': 'Exportar'
    };
    return labels[action] || action;
  };

  const handleCreatePolicy = () => {
    const newPolicy: Omit<IRBAPolicy, 'id' | 'createdAt' | 'updatedAt'> = {
      name: 'Nova Política',
      description: 'Descrição da nova política',
      roleId: roles[0]?.id || '',
      permissions: [],
      createdBy: 'ADMIN'
    };
    
    setEditingPolicy(newPolicy as IRBAPolicy);
    setIsCreatingPolicy(true);
  };

  const handleEditPolicy = (policy: IRBAPolicy) => {
    setEditingPolicy({ ...policy });
    setIsCreatingPolicy(false);
  };

  const handleSavePolicy = async () => {
    if (!editingPolicy) return;
    
    try {
      setIsSaving(true);
      
      if (isCreatingPolicy) {
        const { id, createdAt, updatedAt, ...newPolicy } = editingPolicy;
        await createRBAPolicy(newPolicy);
        toast({
          title: "Política criada",
          description: "Nova política de acesso criada com sucesso.",
          variant: "default",
        });
      } else {
        await updateRBAPolicy(editingPolicy);
        toast({
          title: "Política atualizada",
          description: "Política de acesso atualizada com sucesso.",
          variant: "default",
        });
      }
      
      setEditingPolicy(null);
      setIsCreatingPolicy(false);
    } catch (error) {
      console.error('Error saving policy:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a política de acesso.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePolicy = async () => {
    if (!policyToDelete) return;
    
    try {
      await deleteRBAPolicy(policyToDelete);
      setPolicyToDelete(null);
      setShowDeleteDialog(false);
      
      toast({
        title: "Política excluída",
        description: "Política de acesso excluída com sucesso.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting policy:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a política de acesso.",
        variant: "destructive",
      });
    }
  };

  const handleAddPermission = () => {
    if (!editingPolicy) return;
    
    const newPermission = {
      resource: resources[0]?.id || '',
      scope: resources[0]?.scope || 'system',
      actions: ['view'] as TPermissionAction[]
    };
    
    setEditingPolicy({
      ...editingPolicy,
      permissions: [...editingPolicy.permissions, newPermission]
    });
  };

  const handleRemovePermission = (index: number) => {
    if (!editingPolicy) return;
    
    const updatedPermissions = [...editingPolicy.permissions];
    updatedPermissions.splice(index, 1);
    
    setEditingPolicy({
      ...editingPolicy,
      permissions: updatedPermissions
    });
  };

  const handleUpdatePermission = (index: number, field: string, value: any) => {
    if (!editingPolicy) return;
    
    const updatedPermissions = [...editingPolicy.permissions];
    updatedPermissions[index] = {
      ...updatedPermissions[index],
      [field]: value
    };
    
    setEditingPolicy({
      ...editingPolicy,
      permissions: updatedPermissions
    });
  };

  const handleToggleAction = (permissionIndex: number, action: TPermissionAction, checked: boolean) => {
    if (!editingPolicy) return;
    
    const updatedPermissions = [...editingPolicy.permissions];
    const currentActions = updatedPermissions[permissionIndex].actions;
    
    if (checked) {
      // Add action if not present
      if (!currentActions.includes(action)) {
        updatedPermissions[permissionIndex].actions = [...currentActions, action];
      }
    } else {
      // Remove action if present
      updatedPermissions[permissionIndex].actions = currentActions.filter(a => a !== action);
    }
    
    setEditingPolicy({
      ...editingPolicy,
      permissions: updatedPermissions
    });
  };

  return (
    <Card className="mb-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <ShieldCheck className="h-5 w-5 text-primary dark:text-primary-400" />
              Configuração de Acesso Baseado em Função (RBAC)
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Defina permissões específicas para diferentes funções e recursos do sistema
            </CardDescription>
          </div>
          <Button 
            onClick={handleCreatePolicy} 
            disabled={loading}
            size="sm"
            className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Nova Política</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!policies || policies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhuma política RBAC configurada</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-2 mb-4">
              Políticas de acesso baseado em função ajudam a controlar quem pode acessar quais recursos do sistema.
            </p>
            <Button 
              onClick={handleCreatePolicy}
              className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
            >
              Criar Primeira Política
            </Button>
          </div>
        ) : (
          <div className="rounded-md border border-gray-200 dark:border-gray-700">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-700 dark:text-gray-300">Nome</TableHead>
                  <TableHead className="hidden md:table-cell text-gray-700 dark:text-gray-300">Função</TableHead>
                  <TableHead className="hidden md:table-cell text-gray-700 dark:text-gray-300">Permissões</TableHead>
                  <TableHead className="text-right text-gray-700 dark:text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="text-gray-900 dark:text-white">
                      <div className="font-medium">{policy.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 md:hidden">
                        Função: {roles.find(r => r.id === policy.roleId)?.name || policy.roleId}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-700 dark:text-gray-300">
                      {roles.find(r => r.id === policy.roleId)?.name || policy.roleId}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {policy.permissions.slice(0, 3).map((perm, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                            {resources.find(r => r.id === perm.resource)?.name || perm.resource}: {perm.actions.length}
                          </Badge>
                        ))}
                        {policy.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                            +{policy.permissions.length - 3} mais
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditPolicy(policy)}
                          title="Editar"
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setPolicyToDelete(policy.id);
                            setShowDeleteDialog(true);
                          }}
                          title="Excluir"
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                          <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Policy Edit Dialog */}
        {editingPolicy && (
          <Dialog open={!!editingPolicy} onOpenChange={(open) => !open && setEditingPolicy(null)}>
<DialogContent className="max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">{isCreatingPolicy ? 'Nova Política de Acesso' : 'Editar Política de Acesso'}</DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400">
                  Configure permissões de acesso para funções específicas do sistema.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policy-name" className="text-gray-700 dark:text-gray-300">Nome da Política</Label>
                    <Input 
                      id="policy-name"
                      value={editingPolicy.name}
                      onChange={(e) => setEditingPolicy({
                        ...editingPolicy,
                        name: e.target.value
                      })}
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="policy-role" className="text-gray-700 dark:text-gray-300">Função</Label>
                    <Select 
                      value={editingPolicy.roleId}
                      onValueChange={(value) => setEditingPolicy({
                        ...editingPolicy,
                        roleId: value
                      })}
                    >
                      <SelectTrigger id="policy-role" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                        <SelectValue placeholder="Selecione uma função" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id} className="text-gray-900 dark:text-white">{role.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="policy-description" className="text-gray-700 dark:text-gray-300">Descrição</Label>
                  <Input 
                    id="policy-description"
                    value={editingPolicy.description}
                    onChange={(e) => setEditingPolicy({
                      ...editingPolicy,
                      description: e.target.value
                    })}
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-base text-gray-800 dark:text-gray-200">Permissões</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleAddPermission}
                      className="flex items-center gap-1 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Adicionar</span>
                    </Button>
                  </div>
                  
                  {editingPolicy.permissions.length === 0 ? (
                    <div className="text-center py-6 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma permissão configurada</p>
                      <Button 
                        variant="link" 
                        onClick={handleAddPermission}
                        className="mt-1 text-primary dark:text-primary-400"
                      >
                        Adicionar nova permissão
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editingPolicy.permissions.map((permission, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-md p-3 space-y-3 bg-white dark:bg-gray-900">
                          <div className="flex justify-between items-center">
                            <div className="font-medium text-gray-900 dark:text-white">Permissão {index + 1}</div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemovePermission(index)}
                              title="Remover"
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                              <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor={`resource-${index}`} className="text-gray-700 dark:text-gray-300">Recurso</Label>
                              <Select 
                                value={permission.resource}
                                onValueChange={(value) => handleUpdatePermission(index, 'resource', value)}
                              >
                                <SelectTrigger id={`resource-${index}`} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                                  <SelectValue placeholder="Selecione o recurso" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                  {resources.map((resource) => (
                                    <SelectItem key={resource.id} value={resource.id} className="text-gray-900 dark:text-white">{resource.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`scope-${index}`} className="text-gray-700 dark:text-gray-300">Escopo</Label>
                              <Select 
                                value={permission.scope}
                                onValueChange={(value) => handleUpdatePermission(index, 'scope', value as TPermissionScope)}
                              >
                                <SelectTrigger id={`scope-${index}`} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                                  <SelectValue placeholder="Selecione o escopo" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                  {(['hospital', 'department', 'staff', 'patient', 'system'] as TPermissionScope[]).map((scope) => (
                                    <SelectItem key={scope} value={scope} className="text-gray-900 dark:text-white">{getPermissionScopeLabel(scope)}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">Ações permitidas</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                              {allPermissionActions.map((action) => (
                                <div key={action} className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                                  <Checkbox
                                    id={`action-${index}-${action}`}
                                    checked={permission.actions.includes(action)}
                                    onCheckedChange={(checked) => 
                                      handleToggleAction(index, action, checked as boolean)
                                    }
                                    className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                                  />
                                  <Label htmlFor={`action-${index}-${action}`} className="text-gray-700 dark:text-gray-300">{getActionLabel(action)}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setEditingPolicy(null)}
                  className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSavePolicy}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
                >
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">Confirmar exclusão</DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400">
                Tem certeza que deseja excluir esta política de acesso? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="ghost" 
                onClick={() => setShowDeleteDialog(false)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeletePolicy}
                className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700"
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Info className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400" />
          <span>Total: {policies?.length} políticas</span>
        </div>
      </CardFooter>
    </Card>
  );
};