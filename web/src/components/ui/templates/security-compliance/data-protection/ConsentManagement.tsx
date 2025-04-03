/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Switch } from '@/components/ui/organisms/switch';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Badge } from '@/components/ui/organisms/badge';
import { Textarea } from '@/components/ui/organisms/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/organisms/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/organisms/dialog';
import { Separator } from '@/components/ui/organisms/Separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { useToast } from '@/components/ui/hooks/use-toast';
import { UserCheck, Plus, Trash2, Edit, Info, Calendar, AlertTriangle, ClipboardCheck, FileText } from 'lucide-react';
import { IConsentConfig } from '@/types/security-compliance-types';

interface ConsentManagementProps {
  consentConfig: IConsentConfig | undefined;
  updateConsentConfig: (config: any) => Promise<any>;
  loading: boolean;
}

export const ConsentManagement: React.FC<ConsentManagementProps> = ({
  consentConfig,
  updateConsentConfig,
  loading
}) => {
  const defaultConsentConfig: IConsentConfig = {
    id: 'consent-config',
    consentCategories: [
      {
        id: 'basic-care',
        name: 'Dados para Assistência Médica',
        description: 'Uso de dados pessoais e médicos para fins de atendimento médico direto.',
        required: true,
        defaultState: true,
        appliesTo: ['patient']
      },
      {
        id: 'academic-research',
        name: 'Pesquisa Acadêmica',
        description: 'Uso de dados anonimizados para pesquisa médica e científica.',
        required: false,
        defaultState: true,
        appliesTo: ['patient']
      },
      {
        id: 'marketing',
        name: 'Marketing e Comunicações',
        description: 'Envio de comunicações sobre novos serviços, eventos e informações do hospital.',
        required: false,
        defaultState: false,
        appliesTo: ['patient', 'staff']
      },
      {
        id: 'third-party',
        name: 'Compartilhamento com Terceiros',
        description: 'Compartilhamento de dados com parceiros confiáveis, como laboratórios e outros hospitais.',
        required: false,
        defaultState: false,
        appliesTo: ['patient']
      }
    ],
    consentFormVersion: '1.2',
    lastUpdated: new Date().toISOString(),
    requireRenewalAfter: 365,
    notifyBeforeExpiration: 30,
    trackingMethod: 'digital_signature',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const [config, setConfig] = useState<IConsentConfig>(consentConfig || defaultConsentConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateConsentConfig(config);
      
      toast({
        title: "Configurações de consentimento atualizadas",
        description: "As configurações de consentimento foram salvas com sucesso.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações de consentimento.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addNewCategory = () => {
    const newCategory = {
      id: '',
      name: '',
      description: '',
      required: false,
      defaultState: false,
      appliesTo: ['patient']
    };
    setEditingCategory(newCategory);
    setIsNewCategory(true);
  };

  const editCategory = (category: any) => {
    setEditingCategory({ ...category });
    setIsNewCategory(false);
  };

  const saveCategory = () => {
    if (!editingCategory.id || !editingCategory.name) {
      toast({
        title: "Campos obrigatórios",
        description: "ID e Nome são campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (isNewCategory) {
      // Gerar ID único se estiver em branco
      const categoryId = editingCategory.id || `consent-${Date.now()}`;
      const newCategories = [...config.consentCategories, { ...editingCategory, id: categoryId }];
      setConfig({ ...config, consentCategories: newCategories });
    } else {
      const updatedCategories = config.consentCategories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      );
      setConfig({ ...config, consentCategories: updatedCategories });
    }

    setEditingCategory(null);
  };

  const deleteCategory = (categoryId: string) => {
    const updatedCategories = config.consentCategories.filter(cat => cat.id !== categoryId);
    setConfig({ ...config, consentCategories: updatedCategories });
    
    toast({
      title: "Categoria removida",
      description: "A categoria de consentimento foi removida com sucesso.",
      variant: "default",
    });
  };

  const handleCategoryAppliesToChange = (target: 'patient' | 'staff' | 'all', checked: boolean) => {
    if (!editingCategory) return;
    
    let newAppliesTo = [...editingCategory.appliesTo];
    
    if (target === 'all') {
      newAppliesTo = checked ? ['patient', 'staff'] : [];
    } else {
      if (checked && !newAppliesTo.includes(target)) {
        newAppliesTo.push(target);
      } else {
        newAppliesTo = newAppliesTo.filter(item => item !== target);
      }
    }
    
    setEditingCategory({ ...editingCategory, appliesTo: newAppliesTo });
  };

  const getApplicableToLabels = (appliesTo: string[]) => {
    const labels: string[] = [];
    if (appliesTo.includes('patient')) labels.push('Pacientes');
    if (appliesTo.includes('staff')) labels.push('Funcionários');
    
    return labels.join(', ');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Gestão de Consentimento
          </CardTitle>
          <CardDescription>
            Configure as categorias e políticas de consentimento para uso de dados
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold">Categorias de Consentimento</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2" 
                onClick={addNewCategory}
              >
                <Plus className="h-4 w-4" />
                Nova Categoria
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Obrigatório</TableHead>
                  <TableHead>Estado Padrão</TableHead>
                  <TableHead>Aplica-se a</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {config.consentCategories.map(category => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500">{category.description}</div>
                    </TableCell>
                    <TableCell>
                      {category.required ? (
                        <Badge className="bg-green-100 text-green-800">Obrigatório</Badge>
                      ) : (
                        <Badge variant="outline">Opcional</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {category.defaultState ? (
                        <Badge className="bg-blue-100 text-blue-800">Habilitado</Badge>
                      ) : (
                        <Badge variant="outline">Desabilitado</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {getApplicableToLabels(category.appliesTo)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => editCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!category.required && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="consentFormVersion">Versão do Formulário de Consentimento</Label>
              <div className="flex gap-2">
                <Input 
                  id="consentFormVersion" 
                  value={config.consentFormVersion} 
                  onChange={(e) => setConfig({
                    ...config,
                    consentFormVersion: e.target.value
                  })}
                />
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Visualizar
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastUpdated">Última Atualização</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="lastUpdated" 
                  value={new Date(config.lastUpdated).toLocaleDateString()}
                  readOnly
                  disabled
                />
                <Button
                  variant="outline"
                  onClick={() => setConfig({
                    ...config,
                    lastUpdated: new Date().toISOString(),
                    consentFormVersion: parseFloat(config.consentFormVersion) + 0.1 + ''
                  })}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requireRenewalAfter">Renovação Obrigatória após</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="requireRenewalAfter" 
                  type="number"
                  min={0}
                  max={3650}
                  value={config.requireRenewalAfter} 
                  onChange={(e) => setConfig({
                    ...config,
                    requireRenewalAfter: parseInt(e.target.value)
                  })}
                />
                <span className="text-sm">dias</span>
              </div>
              <p className="text-xs text-gray-500">
                Número de dias após os quais o consentimento deve ser renovado (0 = sem renovação)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notifyBeforeExpiration">Notificar antes da expiração</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="notifyBeforeExpiration" 
                  type="number"
                  min={0}
                  max={90}
                  value={config.notifyBeforeExpiration} 
                  onChange={(e) => setConfig({
                    ...config,
                    notifyBeforeExpiration: parseInt(e.target.value)
                  })}
                />
                <span className="text-sm">dias</span>
              </div>
              <p className="text-xs text-gray-500">
                Número de dias antes da expiração para enviar notificações (0 = sem notificação)
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trackingMethod">Método de Registro</Label>
            <Select
              value={config.trackingMethod}
              onValueChange={(value: 'digital_signature' | 'checkbox' | 'biometric') => 
                setConfig({
                  ...config,
                  trackingMethod: value
                })
              }
            >
              <SelectTrigger id="trackingMethod">
                <SelectValue placeholder="Selecione um método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="digital_signature">Assinatura Digital</SelectItem>
                <SelectItem value="checkbox">Checkbox + Timestamp</SelectItem>
                <SelectItem value="biometric">Biométrico</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Método utilizado para registrar o consentimento do usuário
            </p>
          </div>
          
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>Requisitos regulatórios</AlertTitle>
            <AlertDescription>
              Conforme a LGPD, o consentimento deve ser livre, informado e inequívoco. 
              Mantenha registros detalhados de quando e como o consentimento foi obtido.
            </AlertDescription>
          </Alert>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="text-xs text-gray-500 flex items-center">
            <ClipboardCheck className="h-3 w-3 mr-1" />
            <span>
              Última atualização: {new Date(config.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={loading || isSaving}
          >
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estatísticas de Consentimento</CardTitle>
          <CardDescription>
            Visão geral do status de consentimento dos usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Taxa de Consentimento</div>
              <div className="text-2xl font-bold">98.2%</div>
              <div className="text-xs text-gray-500">Assistência Médica</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Taxa de Consentimento</div>
              <div className="text-2xl font-bold">82.5%</div>
              <div className="text-xs text-gray-500">Pesquisa Acadêmica</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Taxa de Consentimento</div>
              <div className="text-2xl font-bold">46.3%</div>
              <div className="text-xs text-gray-500">Marketing</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Taxa de Consentimento</div>
              <div className="text-2xl font-bold">38.9%</div>
              <div className="text-xs text-gray-500">Compartilhamento</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Ver Relatório Detalhado
          </Button>
        </CardFooter>
      </Card>
      
      {/* Dialog para edição de categoria */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isNewCategory ? 'Nova Categoria de Consentimento' : 'Editar Categoria de Consentimento'}
            </DialogTitle>
            <DialogDescription>
              Configure os detalhes desta categoria de consentimento
            </DialogDescription>
          </DialogHeader>
          
          {editingCategory && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category-id">ID da Categoria</Label>
                  <Input 
                    id="category-id" 
                    value={editingCategory.id} 
                    onChange={(e) => setEditingCategory({
                      ...editingCategory,
                      id: e.target.value
                    })}
                    placeholder="ex: marketing-consent"
                    disabled={!isNewCategory}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category-name">Nome da Categoria</Label>
                  <Input 
                    id="category-name" 
                    value={editingCategory.name} 
                    onChange={(e) => setEditingCategory({
                      ...editingCategory,
                      name: e.target.value
                    })}
                    placeholder="ex: Marketing e Comunicações"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category-description">Descrição</Label>
                <Textarea 
                  id="category-description" 
                  value={editingCategory.description} 
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    description: e.target.value
                  })}
                  placeholder="Descreva detalhadamente o propósito desta categoria de consentimento"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <Label htmlFor="category-required" className="font-medium">
                    Consentimento Obrigatório
                  </Label>
                  <p className="text-xs text-gray-500">
                    Se ativado, o usuário não poderá recusar este consentimento
                  </p>
                </div>
                <Switch
                  id="category-required"
                  checked={editingCategory.required}
                  onCheckedChange={(checked) => setEditingCategory({
                    ...editingCategory,
                    required: checked,
                    // Se obrigatório, o estado padrão deve ser true
                    defaultState: checked ? true : editingCategory.defaultState
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <Label htmlFor="category-default" className="font-medium">
                    Estado Padrão
                  </Label>
                  <p className="text-xs text-gray-500">
                    Se ativado, o consentimento estará pré-selecionado
                  </p>
                </div>
                <Switch
                  id="category-default"
                  checked={editingCategory.defaultState}
                  disabled={editingCategory.required}
                  onCheckedChange={(checked) => setEditingCategory({
                    ...editingCategory,
                    defaultState: checked
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="font-medium">Aplica-se a</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 p-2 border rounded-md">
                    <Switch
                      id="applies-to-patient"
                      checked={editingCategory.appliesTo.includes('patient')}
                      onCheckedChange={(checked) => 
                        handleCategoryAppliesToChange('patient', checked)
                      }
                    />
                    <Label htmlFor="applies-to-patient">Pacientes</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 border rounded-md">
                    <Switch
                      id="applies-to-staff"
                      checked={editingCategory.appliesTo.includes('staff')}
                      onCheckedChange={(checked) => 
                        handleCategoryAppliesToChange('staff', checked)
                      }
                    />
                    <Label htmlFor="applies-to-staff">Funcionários</Label>
                  </div>
                </div>
              </div>
              
              {editingCategory.required && (
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Categoria obrigatória</AlertTitle>
                  <AlertDescription>
                    Categorias obrigatórias devem ser justificadas e documentadas, 
                    conforme a LGPD só devem ser usadas quando estritamente necessário 
                    para prestação do serviço.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setEditingCategory(null)}
            >
              Cancelar
            </Button>
            <Button onClick={saveCategory}>
              {isNewCategory ? 'Criar Categoria' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};