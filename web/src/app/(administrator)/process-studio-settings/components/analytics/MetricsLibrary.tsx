import React from 'react';
import { Hospital, Activity, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';

interface MetricTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
}

interface MetricsLibraryProps {
  onAddMetric?: (metricTemplate: string) => void;
}

export const MetricsLibrary: React.FC<MetricsLibraryProps> = ({ onAddMetric }) => {
  // Métricas pré-configuradas
  const metricTemplates: MetricTemplate[] = [
    { 
      id: 'occupancy-rate', 
      name: 'Taxa de Ocupação', 
      description: 'Percentual de leitos ocupados em relação ao total',
      icon: Activity,
      iconColor: 'text-blue-500'
    },
    { 
      id: 'average-ticket', 
      name: 'Ticket Médio', 
      description: 'Valor médio de faturamento por paciente',
      icon: CreditCard,
      iconColor: 'text-green-500'
    },
    { 
      id: 'infection-rate', 
      name: 'Taxa de Infecção', 
      description: 'Porcentagem de pacientes com infecções hospitalares',
      icon: Hospital,
      iconColor: 'text-red-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hospital className="h-5 w-5 text-green-500" />
          Biblioteca de Métricas
        </CardTitle>
        <CardDescription>
          Conjunto de métricas padronizadas para gestão hospitalar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metricTemplates.map(metric => (
            <div 
              key={metric.id}
              className="p-4 border rounded-lg border-gray-200 dark:border-gray-700 hover:border-green-500 cursor-pointer"
            >
              <div className="flex items-center">
                <metric.icon className={`h-4 w-4 ${metric.iconColor} mr-2`} />
                <h3 className="font-medium">{metric.name}</h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {metric.description}
              </p>
              <div className="flex justify-end mt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs"
                  onClick={() => onAddMetric && onAddMetric(metric.id)}
                >
                  Adicionar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};