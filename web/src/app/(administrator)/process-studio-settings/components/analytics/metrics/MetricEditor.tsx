/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Activity, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/organisms/tabs';
import { INetworkData } from '@/types/hospital-network-types';
import { v4 as uuidv4 } from 'uuid';
import { ICustomMetric, IMetricTemplate } from '@/types/custom-metrics';
import { MetricGeneralSettings } from './MetricGeneralSettings';
import { MetricDataSettings } from './MetricDataSettings';
import { MetricVisualizationSettings } from './MetricVisualizationSettings';
import { MetricThresholdSettings } from './MetricThresholdSettings';
import { MetricPreview } from './MetricPreview';

// Tipo para o estado do formulário
export interface MetricFormState {
  id: string;
  name: string;
  description: string;
  category: string;
  chartType: 'line' | 'bar' | 'pie' | 'gauge' | 'card';
  dataSource: string;
  formula: string;
  unit: string;
  refreshInterval: string;
  thresholds: {
    target: number;
    warning: number;
    critical: number;
  };
  iconColor: string;
  advanced: {
    showLegend: boolean;
    showGrid: boolean;
    enableAnimation: boolean;
    showTooltips: boolean;
    responsiveHeight: boolean;
  };
}

// Propriedades do componente
interface IMetricEditorProps {
  networkData: INetworkData | null;
  selectedMetric: IMetricTemplate | null;
  onSave?: (metricData: ICustomMetric) => void;
  onCancel?: () => void;
}

export const MetricEditor: React.FC<IMetricEditorProps> = ({ 
  networkData, 
  selectedMetric,
  onSave, 
  onCancel 
}) => {
  // Estado inicial do formulário
  const initialFormState: MetricFormState = {
    id: selectedMetric?.id || uuidv4(),
    name: selectedMetric?.name || 'Nova Métrica',
    description: selectedMetric?.description || 'Descrição da métrica personalizada',
    category: selectedMetric?.category || 'operational',
    chartType: selectedMetric?.chartType || 'gauge',
    dataSource: selectedMetric?.dataSource || 'beds',
    formula: selectedMetric?.formula || '',
    unit: selectedMetric?.unit || '%',
    refreshInterval: selectedMetric?.refreshInterval || 'hourly',
    thresholds: {
      target: selectedMetric?.thresholds?.target || 85,
      warning: selectedMetric?.thresholds?.warning || 90,
      critical: selectedMetric?.thresholds?.critical || 95
    },
    iconColor: selectedMetric?.iconColor || 'text-blue-500',
    advanced: {
      showLegend: true,
      showGrid: true,
      enableAnimation: true,
      showTooltips: true,
      responsiveHeight: true
    }
  };
  
  // Estado do formulário
  const [formState, setFormState] = useState<MetricFormState>(initialFormState);
  const [activeTab, setActiveTab] = useState('general');
  
  // Atualizar o formulário quando a métrica selecionada mudar
  useEffect(() => {
    if (selectedMetric) {
      setFormState({
        ...initialFormState,
        id: selectedMetric.id,
        name: selectedMetric.name,
        description: selectedMetric.description,
        category: selectedMetric.category,
        chartType: selectedMetric.chartType,
        dataSource: selectedMetric.dataSource,
        formula: selectedMetric.formula || '',
        unit: selectedMetric.unit || '%',
        refreshInterval: selectedMetric.refreshInterval || 'hourly',
        thresholds: {
          target: selectedMetric.thresholds?.target || 85,
          warning: selectedMetric.thresholds?.warning || 90,
          critical: selectedMetric.thresholds?.critical || 95
        },
        iconColor: selectedMetric.iconColor
      });
    } else {
      setFormState(initialFormState);
    }
  }, [selectedMetric]);
  
  // Função para atualizar o estado do formulário
  const updateFormState = (field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Função para atualizar os thresholds
  const updateThresholds = (field: string, value: number) => {
    setFormState(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [field]: value
      }
    }));
  };
  
  // Função para atualizar as configurações avançadas
  const updateAdvancedSettings = (field: string, value: boolean) => {
    setFormState(prev => ({
      ...prev,
      advanced: {
        ...prev.advanced,
        [field]: value
      }
    }));
  };
  
  // Função para salvar a métrica
  const handleSaveMetric = () => {
    if (onSave) {
      // Converter para o formato ICustomMetric
      const customMetric: ICustomMetric = {
        id: formState.id,
        name: formState.name,
        description: formState.description,
        category: formState.category,
        chartType: formState.chartType,
        dataSource: formState.dataSource,
        formula: formState.formula,
        icon: Activity, // Por padrão, usando o ícone Activity
        iconColor: formState.iconColor,
        unit: formState.unit,
        refreshInterval: formState.refreshInterval as 'realtime' | 'hourly' | 'daily' | 'weekly',
        thresholds: {
          target: formState.thresholds.target,
          warning: formState.thresholds.warning,
          critical: formState.thresholds.critical
        },
        position: { x: 0, y: 0, w: 6, h: 2 } // Posição padrão, será ajustada no dashboard
      };
      
      onSave(customMetric);
    }
  };

  return (
    <Card className="max-w-full bg-gray-900 border-gray-700 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-800 to-indigo-800 p-5 border-b border-gray-700">
        <CardTitle className="flex items-center gap-2 text-white">
          <Activity className="h-5 w-5 text-white" />
          {selectedMetric ? 'Editar Métrica' : 'Criar Nova Métrica'}
        </CardTitle>
        <CardDescription className="text-blue-200">
          {selectedMetric 
            ? `Personalizando ${selectedMetric.name}` 
            : 'Configure visualizações e defina metas para sua métrica personalizada'}
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 p-1 bg-gray-800 rounded-none border-b border-gray-700">
          <TabsTrigger value="general" className="data-[state=active]:bg-gray-700">
            Geral
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-gray-700">
            Dados
          </TabsTrigger>
          <TabsTrigger value="visualization" className="data-[state=active]:bg-gray-700">
            Visualização
          </TabsTrigger>
          <TabsTrigger value="thresholds" className="data-[state=active]:bg-gray-700">
            Limiares
          </TabsTrigger>
        </TabsList>
        
        <CardContent className="p-0">
          <TabsContent value="general" className="p-4 mt-0">
            <MetricGeneralSettings 
              formState={formState}
              updateFormState={updateFormState}
            />
          </TabsContent>
          
          <TabsContent value="data" className="p-4 mt-0">
            <MetricDataSettings 
              formState={formState}
              updateFormState={updateFormState}
              networkData={networkData}
            />
          </TabsContent>
          
          <TabsContent value="visualization" className="p-4 mt-0">
            <MetricVisualizationSettings 
              formState={formState}
              updateFormState={updateFormState}
              updateAdvancedSettings={updateAdvancedSettings}
            />
          </TabsContent>
          
          <TabsContent value="thresholds" className="p-4 mt-0">
            <MetricThresholdSettings 
              formState={formState}
              updateThresholds={updateThresholds}
            />
          </TabsContent>
        </CardContent>
        
        <div className="p-4 border-t border-gray-700 mt-4">
          <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-400" />
            Prévia da Métrica
          </h3>
          <MetricPreview formState={formState} />
        </div>
      </Tabs>
      
      <CardFooter className="flex justify-end space-x-2 p-4 bg-gray-800 border-t border-gray-700">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSaveMetric}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {selectedMetric ? 'Atualizar Métrica' : 'Criar Métrica'}
        </Button>
      </CardFooter>
    </Card>
  );
};