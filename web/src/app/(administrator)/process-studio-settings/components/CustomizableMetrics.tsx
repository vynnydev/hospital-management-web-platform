/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card'; 
import { Button } from '@/components/ui/organisms/button';
import { Edit } from 'lucide-react'; 
import { INetworkData } from '@/types/hospital-network-types';

interface IMetricsProps {
  networkData: INetworkData | null;
  selectedHospital?: string;
}

interface IMetricConfig {
  id: string;
  group: string;
  title: string;
  value: number; 
  subtitle: string;
  icon: string;
  color: string;
  target?: number;
}

const defaultMetricGroups: Record<string, IMetricConfig[]> = {
  'Ocupação': [
    {
      id: 'occupancy',
      group: 'Ocupação',
      title: 'Taxa de Ocupação', 
      value: 0,
      subtitle: 'Leitos Ocupados',
      icon: 'bed',
      color: 'blue', 
      target: 85,
    },
    // Outras métricas de ocupação...
  ],

  'Eficiência': [
    {
      id: 'efficiency',
      group: 'Eficiência',
      title: 'Eficiência Operacional',
      value: 0,
      subtitle: 'Performance Geral', 
      icon: 'activity',
      color: 'green',
    },
    // Outras métricas de eficiência...
  ],

  // Outros grupos de métricas...
};

export const CustomizableMetrics: React.FC<IMetricsProps> = ({
  networkData,
}) => {
  const [metricGroups, setMetricGroups] = useState(defaultMetricGroups);

  const calculateMetricValue = (metricId: string): number => {
    // Lógica para calcular o valor de cada métrica com base nos dados
    // ...

    return 0;
  };
  
  const updateMetricValues = () => {
    const updatedGroups = { ...metricGroups };
    
    for (const group in updatedGroups) {
      updatedGroups[group] = updatedGroups[group].map(metric => ({
        ...metric,
        value: calculateMetricValue(metric.id),
      }));
    }

    setMetricGroups(updatedGroups);
  };

  useEffect(() => {
    updateMetricValues();
  }, [networkData]);

  const handleEditMetric = (metricId: string) => {
    // Abrir modal para editar configurações da métrica
    console.log(`Editando métrica ${metricId}`);
  };

  const renderMetricCard = (metric: IMetricConfig) => (
    <Card key={metric.id} className="p-4 hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <i className={`ri-${metric.icon}-fill text-${metric.color}-500 text-xl mr-2`} />
            {metric.title}
          </div>
          <Button variant="ghost" onClick={() => handleEditMetric(metric.id)}>
            <Edit className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold mb-2">{metric.value.toFixed(1)}%</p>
        <p className="text-gray-500 mb-2">{metric.subtitle}</p>
        {metric.target && (
          <p className="text-gray-400 text-sm">Meta: {metric.target}%</p>
        )}
      </CardContent>
    </Card>
  );

  const renderMetricGroup = (groupName: string, metrics: IMetricConfig[]) => (
    <div key={groupName}>
      <h4 className="text-lg font-bold mb-4">{groupName}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map(renderMetricCard)}
      </div>
    </div>
  );

  return (
    <div>
      <h3 className="text-2xl font-bold mb-8">Métricas Personalizadas</h3>
      {Object.entries(metricGroups).map(([groupName, metrics]) =>
        renderMetricGroup(groupName, metrics)
      )}
    </div>
  );
};