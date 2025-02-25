/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { GitBranch, Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { IExceptionFlow, IWorkflowTemplate, TPriority } from '@/types/workflow/customize-process-by-workflow-types';

interface ExceptionFlowsEditorProps {
  template: IWorkflowTemplate | null;
  onUpdateExceptions?: (exceptions: IExceptionFlow[]) => void;
}

export const ExceptionFlowsEditor: React.FC<ExceptionFlowsEditorProps> = ({ 
  template, 
  onUpdateExceptions 
}) => {
  const [exceptionFlows, setExceptionFlows] = useState<IExceptionFlow[]>([]);
  
  // Departamentos de destino disponíveis (simulados)
  const targetDepartments = [
    { id: 'emergency', label: 'Emergência' },
    { id: 'uti', label: 'UTI' },
    { id: 'med_consult', label: 'Consulta Médica' },
    { id: 'special_care', label: 'Cuidados Especiais' },
    { id: 'trauma_center', label: 'Centro de Trauma' },
    { id: 'cpr', label: 'Ressuscitação' }
  ];

  // Atualiza as exceções quando o template muda
  useEffect(() => {
    if (template?.exceptionFlows) {
      setExceptionFlows(template.exceptionFlows);
    } else {
      setExceptionFlows([]);
    }
  }, [template]);
  
  // Adiciona uma nova exceção
  const addNewException = () => {
    const newException: IExceptionFlow = {
      condition: 'Nova condição',
      targetDepartment: targetDepartments[0].id,
      priority: 'high'
    };
    
    const updatedExceptions = [...exceptionFlows, newException];
    setExceptionFlows(updatedExceptions);
    if (onUpdateExceptions) onUpdateExceptions(updatedExceptions);
  };
  
  // Atualiza uma exceção existente
  const updateException = (index: number, field: keyof IExceptionFlow, value: any) => {
    const updatedExceptions = [...exceptionFlows];
    updatedExceptions[index] = { ...updatedExceptions[index], [field]: value };
    setExceptionFlows(updatedExceptions);
    if (onUpdateExceptions) onUpdateExceptions(updatedExceptions);
  };
  
  // Remove uma exceção
  const removeException = (index: number) => {
    const updatedExceptions = exceptionFlows.filter((_, i) => i !== index);
    setExceptionFlows(updatedExceptions);
    if (onUpdateExceptions) onUpdateExceptions(updatedExceptions);
  };
  
  // Encontra o rótulo do departamento a partir do ID
  const getDepartmentLabel = (departmentId: string): string => {
    const department = targetDepartments.find(d => d.id === departmentId);
    return department ? department.label : departmentId;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-green-500" />
          Fluxos de Exceção
        </CardTitle>
        <CardDescription>
          Configure caminhos alternativos para situações especiais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {exceptionFlows.length > 0 ? (
          exceptionFlows.map((exception, index) => (
            <div key={index} className="border rounded-lg p-4 border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Exceção #{index + 1}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeException(index)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 w-36">Condição:</span>
                <Input 
                  value={exception.condition} 
                  onChange={(e) => updateException(index, 'condition', e.target.value)}
                  className="flex-1" 
                />
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 w-36">Encaminhar para:</span>
                <Select 
                  value={exception.targetDepartment}
                  onValueChange={(value) => updateException(index, 'targetDepartment', value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetDepartments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 w-36">Prioridade:</span>
                <Select 
                  value={exception.priority}
                  onValueChange={(value) => updateException(index, 'priority', value as TPriority)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            {template ? 
              "Nenhuma exceção definida para este template. Adicione a primeira." : 
              "Selecione um template para configurar os fluxos de exceção."}
          </div>
        )}
        
        {template && (
          <Button className="w-full mt-2" onClick={addNewException}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Nova Exceção
          </Button>
        )}
      </CardContent>
    </Card>
  );
};