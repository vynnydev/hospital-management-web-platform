/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { ISLASettings, IWorkflowTemplate } from '@/types/workflow/customize-process-by-workflow-types';

interface SLAEditorProps {
  template: IWorkflowTemplate | null;
  onUpdateSLA?: (slaSettings: ISLASettings[]) => void;
}

export const SLAEditor: React.FC<SLAEditorProps> = ({ template, onUpdateSLA }) => {
  const [slaSettings, setSlaSettings] = useState<ISLASettings[]>([]);
  
  // Atualiza os SLAs quando o template muda
  useEffect(() => {
    if (template?.slaSettings) {
      setSlaSettings(template.slaSettings);
    } else {
      setSlaSettings([]);
    }
  }, [template]);
  
  // Adiciona um novo SLA para um departamento específico
  const addNewSLA = () => {
    if (!template || template.baseNodes.length === 0) return;
    
    // Pega o primeiro departamento que ainda não tem SLA definido
    const departmentsWithSLA = new Set(slaSettings.map(sla => sla.departmentId));
    const availableDept = template.baseNodes.find(node => !departmentsWithSLA.has(node.id));
    
    if (availableDept) {
      const newSLA: ISLASettings = {
        departmentId: availableDept.id,
        maxTime: 30,
        timeUnit: 'minute',
        alertAt: 25
      };
      
      const updatedSettings = [...slaSettings, newSLA];
      setSlaSettings(updatedSettings);
      if (onUpdateSLA) onUpdateSLA(updatedSettings);
    }
  };
  
  // Atualiza um SLA existente
  const updateSLA = (index: number, field: keyof ISLASettings, value: any) => {
    const updatedSettings = [...slaSettings];
    updatedSettings[index] = { ...updatedSettings[index], [field]: value };
    setSlaSettings(updatedSettings);
    if (onUpdateSLA) onUpdateSLA(updatedSettings);
  };
  
  // Remove um SLA
  const removeSLA = (index: number) => {
    const updatedSettings = slaSettings.filter((_, i) => i !== index);
    setSlaSettings(updatedSettings);
    if (onUpdateSLA) onUpdateSLA(updatedSettings);
  };
  
  // Encontra o nome do departamento a partir do ID
  const getDepartmentLabel = (departmentId: string): string => {
    if (!template) return departmentId;
    const node = template.baseNodes.find(node => node.id === departmentId);
    return node ? node.label : departmentId;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Editor de SLAs
        </CardTitle>
        <CardDescription>
          Defina tempos máximos para cada etapa do processo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {slaSettings.length > 0 ? (
          slaSettings.map((sla, index) => (
            <div key={index} className="border rounded-lg p-4 border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{getDepartmentLabel(sla.departmentId)}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeSLA(index)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 w-36">Tempo máximo:</span>
                <Input 
                  type="number" 
                  className="w-20" 
                  value={sla.maxTime} 
                  onChange={(e) => updateSLA(index, 'maxTime', parseInt(e.target.value))}
                />
                <Select 
                  value={sla.timeUnit}
                  onValueChange={(value) => updateSLA(index, 'timeUnit', value as 'minute' | 'hour' | 'day')}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minute">Minutos</SelectItem>
                    <SelectItem value="hour">Horas</SelectItem>
                    <SelectItem value="day">Dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 w-36">Alerta em:</span>
                <Input 
                  type="number" 
                  className="w-20" 
                  value={sla.alertAt} 
                  onChange={(e) => updateSLA(index, 'alertAt', parseInt(e.target.value))}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {sla.timeUnit === 'minute' ? 'minutos' : 
                   sla.timeUnit === 'hour' ? 'horas' : 'dias'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            {template ? 
              "Nenhum SLA definido para este template. Adicione o primeiro." : 
              "Selecione um template para configurar os SLAs."}
          </div>
        )}
        
        {template && (
          <Button className="w-full mt-2" onClick={addNewSLA}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Novo SLA
          </Button>
        )}
      </CardContent>
    </Card>
  );
};