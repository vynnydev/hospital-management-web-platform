import React, { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { LucideIcon } from 'lucide-react';

interface IMetricWorkflowProcessCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  gradient: {
    from: string;
    to: string;
  };
  borderColor: string;
  isLoading?: boolean;
  children: ReactNode;
}

/**
 * Componente base para cards de métricas
 * 
 * Fornece a estrutura básica para os cards de métricas, incluindo
 * cabeçalho, ícone e estado de carregamento
 */
export const MetricWorkflowProcessCard: React.FC<IMetricWorkflowProcessCardProps> = ({
  title,
  icon: Icon,
  iconColor,
  gradient,
  borderColor,
  isLoading = false,
  children
}) => {
  return (
    <Card 
      className={`bg-gradient-to-br ${gradient.from} ${gradient.to} ${borderColor} shadow-lg shadow-${gradient.from}/10`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-gray-100 flex items-center text-base font-medium space-x-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-16 flex items-center justify-center">
            <div className={`animate-pulse h-8 w-24 bg-${gradient.from.split('-')[0]}-800/50 rounded-md`}></div>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};