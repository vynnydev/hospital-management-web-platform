import React, { useState } from 'react';
import { Card } from '@/components/ui/organisms/card';
import { 
  BarChart3, 
  Move, 
  Trash2, 
  Activity, 
  Edit, 
  MoreVertical, 
  Check, 
  X,
  AlertCircle,
  ExternalLink,
  Download,
  Copy,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/organisms/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/organisms/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/organisms/dialog';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Badge } from '@/components/ui/organisms/badge';
import { Label } from '@/components/ui/organisms/label';
import { IMetric } from '@/types/custom-metrics';
import { MetricGaugeChart } from '@/components/ui/templates/charts/MetricGaugeChart';
import { MetricLineChart } from '@/components/ui/templates/charts/MetricLineChart';
import { MetricBarChart } from '@/components/ui/templates/charts/MetricBarChart';
import { MetricPieChart } from '@/components/ui/templates/charts/MetricPieChart';

interface MetricsDashboardProps {
    metrics: IMetric[];
    isEditing: boolean;
    onEditMetric: (metricId: string) => void;
    onRemoveMetric: (metricId: string) => void;
    onUpdateLayout: (layout: any[]) => void;
  }
  
  export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
    metrics,
    isEditing,
    onEditMetric,
    onRemoveMetric,
    onUpdateLayout
  }) => {
    // Gerar layout para o grid
    const layout = metrics.map(metric => ({
      i: metric.id,
      x: metric.position.x,
      y: metric.position.y,
      w: metric.position.w,
      h: metric.position.h,
      minW: 3,
      minH: 2,
      maxH: 8
    }));
  
    // Função para renderizar o tipo de chart apropriado
    const renderChart = (metric: IMetric) => {
      switch (metric.chartType) {
        case 'gauge':
          return <MetricGaugeChart 
            value={parseFloat(metric.value.toString())} 
            config={metric.config} 
          />;
        case 'line':
          return <MetricLineChart 
            data={metric.chartData || []} 
            color={metric.color} 
          />;
        case 'bar':
          return <MetricBarChart 
            data={[
              { label: 'UTI', value: 92 },
              { label: 'Enfermaria', value: 78 },
              { label: 'Cirurgia', value: 65 }
            ]} 
            color={metric.color} 
          />;
        case 'pie':
          return <MetricPieChart 
            data={[
              { label: 'UTI', value: 40 },
              { label: 'Enfermaria', value: 30 },
              { label: 'Cirurgia', value: 20 },
              { label: 'Outros', value: 10 }
            ]} 
          />;
        default:
          return (
            <div className="h-full flex flex-col justify-center items-center">
              <div className="text-3xl font-bold text-white">
                {metric.value}
                <span className="text-lg ml-1 text-gray-400">
                  {metric.config?.target ? '%' : ''}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {metric.subtitle}
              </div>
            </div>
          );
      }
    };
  
    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Dashboard de Métricas
          </h2>
          
          {isEditing && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-gray-800 border-gray-700 text-gray-300 hover:text-white"
                  >
                    <Move className="h-4 w-4 mr-2" />
                    Arraste para reorganizar
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-900 border-gray-700 text-white">
                  Arraste as métricas para reorganizar o dashboard
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {metrics.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">Nenhuma métrica adicionada</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Adicione métricas ao seu dashboard para visualizar indicadores importantes.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Adicionar Métricas
            </Button>
          </div>
        ) : (
          <div className="relative">
            {isEditing && (
              <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500/30 rounded-lg pointer-events-none z-10 flex items-center justify-center">
                <div className="bg-blue-900/80 text-white px-3 py-1.5 rounded-full flex items-center">
                  <Move className="h-4 w-4 mr-1.5" />
                  <span className="text-sm font-medium">Modo de Edição Ativo</span>
                </div>
              </div>
            )}
            
            <GridLayout
              className="layout"
              layout={layout}
              cols={12}
              rowHeight={100}
              width={1200}
              isDraggable={isEditing}
              isResizable={isEditing}
              onLayoutChange={onUpdateLayout}
              margin={[8, 8]}
              containerPadding={[0, 0]}
              compactType="vertical"
            >
              {metrics.map(metric => {
                const IconComponent = metric.icon || Activity;
                
                return (
                  <div key={metric.id} className="overflow-hidden">
                    <Card className="h-full bg-gray-900 border-gray-700 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                      {/* Header da métrica */}
                      <div className="flex items-center justify-between p-3 border-b border-gray-800">
                        <div className="flex items-center">
                          <div className={`rounded-full p-1.5 mr-2 bg-${metric.color}-500/20`}>
                            <IconComponent className={`h-4 w-4 text-${metric.color}-500`} />
                          </div>
                          <h3 className="font-medium text-white text-sm truncate">
                            {metric.title}
                          </h3>
                        </div>
                        
                        <div className="flex items-center">
                          {metric.trend !== undefined && (
                            <div className={`flex items-center mr-2 text-xs ${
                              metric.trend > 0 ? 'text-green-500' : metric.trend < 0 ? 'text-red-500' : 'text-gray-400'
                            }`}>
                              {metric.trend > 0 ? '↑' : metric.trend < 0 ? '↓' : ''}
                              {Math.abs(metric.trend).toFixed(1)}%
                            </div>
                          )}
                          
                          {isEditing ? (
                            <div className="flex">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                                onClick={() => onEditMetric(metric.id)}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-gray-800"
                                onClick={() => onRemoveMetric(metric.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                                >
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                                <DropdownMenuItem 
                                  onClick={() => onEditMetric(metric.id)}
                                  className="text-sm hover:bg-gray-700"
                                >
                                  <Edit className="h-3.5 w-3.5 mr-2" />
                                  Editar Métrica
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-sm hover:bg-gray-700">
                                  Ver Detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-sm hover:bg-gray-700">
                                  Exportar Dados
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-sm hover:bg-gray-700">
                                  Configurar Alertas
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                      
                      {/* Conteúdo da métrica */}
                      <div className="p-3 h-[calc(100%-40px)]">
                        {renderChart(metric)}
                      </div>
                    </Card>
                  </div>
                );
              })}
            </GridLayout>
          </div>
        )}
      </div>
    );
};