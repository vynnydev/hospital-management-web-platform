import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Checkbox } from '@/components/ui/organisms/checkbox';
import { useToast } from '@/components/ui/hooks/use-toast';
import { Info, Database, Archive, AlertTriangle } from 'lucide-react';
import { TLogCategory } from '@/types/security-compliance-types';

interface RetentionPolicyConfigProps {
  retentionPolicy: {
    id: string;
    retentionPeriod: number;
    archiveAfter: number;
    logCategories: TLogCategory[];
    createdAt: string;
    updatedAt: string;
  };
  updateRetentionPolicy: (policy: any) => Promise<any>;
  loading: boolean;
}

export const RetentionPolicyConfig: React.FC<RetentionPolicyConfigProps> = ({
  retentionPolicy,
  updateRetentionPolicy,
  loading
}) => {
  const [policy, setPolicy] = useState(retentionPolicy);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateRetentionPolicy(policy);
      
      toast({
        title: "Política de retenção atualizada",
        description: "As configurações de retenção de logs foram salvas com sucesso.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações de retenção.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCategoryToggle = (category: TLogCategory, checked: boolean) => {
    if (checked) {
      setPolicy({
        ...policy,
        logCategories: [...policy.logCategories, category]
      });
    } else {
      setPolicy({
        ...policy,
        logCategories: policy.logCategories.filter(c => c !== category)
      });
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          <Database className="h-5 w-5 text-primary dark:text-primary-400" />
          Política de Retenção
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Configure por quanto tempo os logs de auditoria são retidos no sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="retentionPeriod" className="text-gray-700 dark:text-gray-300">Período de Retenção (dias)</Label>
          <div className="flex items-center space-x-2">
            <Input 
              id="retentionPeriod" 
              type="number"
              min={30}
              max={3650}
              value={policy.retentionPeriod}
              onChange={(e) => setPolicy({
                ...policy,
                retentionPeriod: parseInt(e.target.value)
              })}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
            <div className="text-sm text-gray-500 dark:text-gray-400">dias</div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Logs mais antigos que este período serão automaticamente excluídos ou arquivados
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="archiveAfter" className="text-gray-700 dark:text-gray-300">Arquivar Após (dias)</Label>
          <div className="flex items-center space-x-2">
            <Input 
              id="archiveAfter" 
              type="number"
              min={0}
              max={policy.retentionPeriod}
              value={policy.archiveAfter}
              onChange={(e) => setPolicy({
                ...policy,
                archiveAfter: parseInt(e.target.value)
              })}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
            <div className="text-sm text-gray-500 dark:text-gray-400">dias</div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Logs mais antigos que este período, mas mais recentes que o período de retenção, serão arquivados
            (0 = não arquivar, excluir diretamente após período de retenção)
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">Categorias de Logs</Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'authentication', label: 'Autenticação' },
              { id: 'data_access', label: 'Acesso a Dados' },
              { id: 'system_config', label: 'Configuração do Sistema' },
              { id: 'patient_data', label: 'Dados de Pacientes' },
              { id: 'admin_action', label: 'Ações Administrativas' },
              { id: 'security', label: 'Segurança' }
            ].map((category) => (
              <div key={category.id} className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={policy.logCategories.includes(category.id as TLogCategory)}
                  onCheckedChange={(checked) => 
                    handleCategoryToggle(category.id as TLogCategory, checked as boolean)
                  }
                  className="text-primary dark:text-primary-400 border-gray-300 dark:border-gray-600"
                />
                <Label htmlFor={`category-${category.id}`} className="text-gray-700 dark:text-gray-300">{category.label}</Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <Info className="h-3 w-3 mr-1 text-blue-500 dark:text-blue-400" />
            Selecione as categorias de logs às quais esta política de retenção se aplica
          </p>
        </div>

        {policy.retentionPeriod < 180 && policy.logCategories.includes('patient_data') && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800 flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Atenção: Política possivelmente não compliance</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Logs relacionados a dados de pacientes geralmente precisam ser retidos por pelo menos 
                6 meses para conformidade com LGPD/HIPAA. Considere aumentar o período.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <Archive className="h-3 w-3 mr-1" />
          <span>
            Última atualização: {new Date(policy.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={loading || isSaving}
          className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
        >
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </CardFooter>
    </Card>
  );
};