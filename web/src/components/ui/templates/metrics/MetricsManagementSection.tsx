/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { TMetric } from '@/types/hospital-metrics';
import { MetricManager } from '@/components/ui/templates/hospital-metrics/MetricManager';

interface MetricsManagementSectionProps {
  metrics: TMetric[];
  onAddMetricToPanel: (metric: TMetric) => Promise<boolean>;
  onOpenMetricForm: () => void;
}

/**
 * Componente para gerenciar métricas manualmente
 * Permite criar, editar e adicionar métricas ao painel
 */
export const MetricsManagementSection: React.FC<MetricsManagementSectionProps> = ({
  metrics,
  onAddMetricToPanel,
  onOpenMetricForm
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Métricas Personalizadas</h3>
        <Button 
          onClick={onOpenMetricForm}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Criar Nova Métrica
        </Button>
      </div>
      
      <MetricManager onAddToPanel={onAddMetricToPanel} />
    </div>
  );
};