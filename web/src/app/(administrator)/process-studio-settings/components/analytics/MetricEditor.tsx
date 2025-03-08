/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Activity, LineChart, BarChart, PieChart, Gauge } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Textarea } from '@/components/ui/organisms/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { defaultMetricCategories } from './MetricCategoriesSidebar';
import { CustomizableMetrics } from '../CustomizableMetrics';
import { INetworkData } from '@/types/hospital-network-types';

// Tipos de visualização de métricas
const chartTypes = [
  { id: 'line', name: 'Linha', icon: LineChart },
  { id: 'bar', name: 'Barras', icon: BarChart },
  { id: 'pie', name: 'Pizza', icon: PieChart },
  { id: 'gauge', name: 'Medidor', icon: Gauge }
];

interface MetricEditorProps {
  networkData: INetworkData | null;
  onSave?: (metricData: any) => void;
  onCancel?: () => void;
}

export const MetricEditor: React.FC<MetricEditorProps> = ({ 
  networkData, 
  onSave, 
  onCancel 
}) => {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          Editor de Métricas
        </CardTitle>
        <CardDescription>
          Personalize visualizações e defina metas
        </CardDescription>
      </CardHeader>
      <CardContent className=" space-y-4">
        <CustomizableMetrics 
          networkData={networkData}
        />
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
          <h3 className="text-lg font-medium mb-4">Configuração da Métrica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Título da Métrica
              </label>
              <Input defaultValue="Taxa de Ocupação de Leitos" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria
              </label>
              <Select defaultValue="operational">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {defaultMetricCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Visualização
              </label>
              <div className="flex space-x-2">
                {chartTypes.map(type => (
                  <Button 
                    key={type.id}
                    variant="outline"
                    className="flex-1"
                    title={type.name}
                  >
                    <type.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Período de Atualização
              </label>
              <Select defaultValue="hourly">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Em tempo real</SelectItem>
                  <SelectItem value="hourly">A cada hora</SelectItem>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fonte de Dados
            </label>
            <Select defaultValue="admissions">
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admissions">Admissões</SelectItem>
                <SelectItem value="beds">Leitos</SelectItem>
                <SelectItem value="patients">Pacientes</SelectItem>
                <SelectItem value="staff">Equipe</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fórmula de Cálculo
            </label>
            <Textarea 
              rows={2}
              defaultValue="(leitos_ocupados / total_leitos) * 100"
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use variáveis disponíveis ou crie fórmulas personalizadas
            </p>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Metas e Limiares
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Meta Ideal
                </label>
                <div className="flex items-center">
                  <Input 
                    type="number" 
                    defaultValue="85" 
                    className="flex-1" 
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Alerta Amarelo
                </label>
                <div className="flex items-center">
                  <Input 
                    type="number" 
                    defaultValue="90" 
                    className="flex-1" 
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Alerta Vermelho
                </label>
                <div className="flex items-center">
                  <Input 
                    type="number" 
                    defaultValue="95" 
                    className="flex-1" 
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onSave && onSave({})}>Salvar Métrica</Button>
      </CardFooter>
    </Card>
  );
};