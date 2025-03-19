/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { SplitSquareVertical, FileText, Tag, Check } from 'lucide-react';
import { Input } from '@/components/ui/organisms/input';
import { Textarea } from '@/components/ui/organisms/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { MetricFormState } from './MetricEditor';
import { Label } from '@/components/ui/organisms/label';
import { defaultMetricCategories } from '@/utils/metricTemplates';

interface MetricGeneralSettingsProps {
  formState: MetricFormState;
  updateFormState: (field: string, value: any) => void;
}

export const MetricGeneralSettings: React.FC<MetricGeneralSettingsProps> = ({
  formState,
  updateFormState
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-1 text-gray-300">
            <SplitSquareVertical className="h-4 w-4 text-blue-500" />
            <span>Nome da Métrica</span>
          </Label>
          <Input 
            value={formState.name} 
            onChange={(e) => updateFormState('name', e.target.value)}
            placeholder="Ex: Taxa de Ocupação de Leitos UTI"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-1 text-gray-300">
            <Tag className="h-4 w-4 text-blue-500" />
            <span>Categoria</span>
          </Label>
          <Select 
            value={formState.category}
            onValueChange={(value) => updateFormState('category', value)}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {defaultMetricCategories.map(cat => (
                <SelectItem 
                  key={cat.id} 
                  value={cat.id}
                  className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white"
                >
                  <div className="flex items-center gap-2">
                    <cat.icon className={`h-4 w-4 ${cat.color}`} />
                    <span>{cat.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="flex items-center gap-1 text-gray-300">
          <FileText className="h-4 w-4 text-blue-500" />
          <span>Descrição</span>
        </Label>
        <Textarea 
          value={formState.description}
          onChange={(e) => updateFormState('description', e.target.value)}
          placeholder="Descreva a finalidade e o significado desta métrica"
          rows={3}
          className="bg-gray-800 border-gray-700 text-white resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <Label className="flex items-center gap-1 text-gray-300">
          <Check className="h-4 w-4 text-blue-500" />
          <span>ID da Métrica</span>
        </Label>
        <div className="relative">
          <Input 
            value={formState.id}
            readOnly
            className="bg-gray-800 border-gray-700 text-gray-400 pr-12"
          />
          <div className="absolute right-2 top-2 text-xs text-gray-500">
            Somente leitura
          </div>
        </div>
        <p className="text-xs text-gray-500">
          O ID é gerado automaticamente e utilizado internamente pelo sistema.
        </p>
      </div>
      
      <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800/30 rounded-md">
        <h4 className="text-blue-300 flex items-center gap-1 text-sm font-medium mb-2">
          <SplitSquareVertical className="h-4 w-4" />
          Dicas para Nomeação de Métricas
        </h4>
        <ul className="text-xs space-y-1 text-blue-200">
          <li>• Use nomes concisos e descritivos que indiquem claramente o que está sendo medido</li>
          <li>• Inclua a unidade de medida quando relevante (ex: &quot;Tempo Médio de Espera em Minutos&quot;)</li>
          <li>• Considere adicionar o departamento ou área específica quando aplicável</li>
          <li>• Evite abreviações que possam não ser compreendidas por todos os usuários</li>
        </ul>
      </div>
    </div>
  );
};