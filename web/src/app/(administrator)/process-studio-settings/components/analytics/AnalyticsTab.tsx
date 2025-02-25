/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/organisms/tabs';
import { MetricCategoriesSidebar, defaultMetricCategories } from './MetricCategoriesSidebar';
import { MetricEditor } from './MetricEditor';
import { MetricsLibrary } from './MetricsLibrary';
import { INetworkData } from '@/types/hospital-network-types';

interface AnalyticsTabProps {
  networkData: INetworkData | null;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ networkData }) => {
  const [activeCategory, setActiveCategory] = useState<string>('operational');
  
  // Função para lidar com a seleção de categoria
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
  };
  
  // Função para adicionar uma métrica da biblioteca
  const handleAddMetric = (metricId: string) => {
    console.log(`Métrica adicionada: ${metricId}`);
    // Lógica para adicionar a métrica selecionada
  };
  
  // Funções para lidar com o salvamento/cancelamento da edição
  const handleSaveMetric = (metricData: any) => {
    console.log('Métrica salva:', metricData);
    // Implementar lógica para salvar a métrica
  };
  
  const handleCancel = () => {
    console.log('Edição cancelada');
    // Implementar lógica de cancelamento
  };

  return (
    <TabsContent value="analytics" className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Painel de Categorias */}
        <MetricCategoriesSidebar 
          categories={defaultMetricCategories}
          activeCategory={activeCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Editor de Métricas Principal */}
        <MetricEditor 
          networkData={networkData}
          onSave={handleSaveMetric}
          onCancel={handleCancel}
        />
      </div>

      {/* Biblioteca de Métricas Pré-configuradas */}
      <MetricsLibrary onAddMetric={handleAddMetric} />
    </TabsContent>
  );
};