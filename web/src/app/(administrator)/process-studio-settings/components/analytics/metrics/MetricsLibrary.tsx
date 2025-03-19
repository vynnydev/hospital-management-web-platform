import React, { useState } from 'react';
import { 
  Hospital, 
  Activity,  
  Filter, 
  Search, 
  Plus, 
  AlertCircle, 
  LineChart, 
  BarChart, 
  PieChart, 
  Gauge 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Badge } from '@/components/ui/organisms/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/organisms/tooltip';
import { IMetricTemplate } from '@/types/custom-metrics';
import { metricTemplates } from '@/utils/metricTemplates';

interface IMetricsLibraryProps {
  activeCategory: string;
  onAddMetric: (metric: IMetricTemplate) => void;
}

export const MetricsLibrary: React.FC<IMetricsLibraryProps> = ({
  activeCategory,
  onAddMetric
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChartType, setFilterChartType] = useState<string | null>(null);
  
  // Filtrar templates com base na pesquisa e filtros
  const filteredTemplates = metricTemplates.filter(template => {
    // Filtrar por categoria
    if (activeCategory !== 'all' && template.category !== activeCategory) {
      return false;
    }
    
    // Filtrar por tipo de gráfico
    if (filterChartType && template.chartType !== filterChartType) {
      return false;
    }
    
    // Filtrar por texto de pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Ícone para o tipo de gráfico
  const getChartTypeIcon = (chartType: string) => {
    switch (chartType) {
      case 'line':
        return <LineChart className="h-4 w-4" />;
      case 'bar':
        return <BarChart className="h-4 w-4" />;
      case 'pie':
        return <PieChart className="h-4 w-4" />;
      case 'gauge':
        return <Gauge className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };
  
  return (
    <Card className="bg-gray-900 border-gray-700 shadow-lg">
      <CardHeader className="border-b border-gray-700 px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
          <CardTitle className="flex items-center gap-2 text-white">
            <Hospital className="h-5 w-5 text-green-500" />
            Biblioteca de Métricas
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {/* Filtro por tipo de gráfico */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={filterChartType === 'line' ? 'default' : 'outline'} 
                    size="sm"
                    className={filterChartType === 'line' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 hover:border-gray-600'}
                    onClick={() => setFilterChartType(filterChartType === 'line' ? null : 'line')}
                  >
                    <LineChart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-900 border-gray-700 text-white">
                  Gráficos de Linha
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={filterChartType === 'bar' ? 'default' : 'outline'} 
                    size="sm"
                    className={filterChartType === 'bar' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 hover:border-gray-600'}
                    onClick={() => setFilterChartType(filterChartType === 'bar' ? null : 'bar')}
                  >
                    <BarChart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-900 border-gray-700 text-white">
                  Gráficos de Barras
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={filterChartType === 'gauge' ? 'default' : 'outline'} 
                    size="sm"
                    className={filterChartType === 'gauge' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 hover:border-gray-600'}
                    onClick={() => setFilterChartType(filterChartType === 'gauge' ? null : 'gauge')}
                  >
                    <Gauge className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-900 border-gray-700 text-white">
                  Medidores
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={filterChartType === 'pie' ? 'default' : 'outline'} 
                    size="sm"
                    className={filterChartType === 'pie' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 hover:border-gray-600'}
                    onClick={() => setFilterChartType(filterChartType === 'pie' ? null : 'pie')}
                  >
                    <PieChart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-900 border-gray-700 text-white">
                  Gráficos de Pizza
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Buscar métricas..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 w-[150px] md:w-auto"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 py-4">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-10 w-10 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">
              Nenhuma métrica encontrada com os filtros selecionados.
            </p>
            <Button 
              variant="outline" 
              className="mt-4 bg-gray-800 border-gray-700 text-gray-300 hover:text-white"
              onClick={() => {
                setSearchQuery('');
                setFilterChartType(null);
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => {
              const IconComponent = template.icon;
              
              return (
                <div 
                  key={template.id}
                  className="relative group"
                >
                  <Card className="p-4 border border-gray-700 bg-gray-800 hover:bg-gray-750 transition-all duration-200 hover:border-gray-600 group-hover:shadow-md">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-md ${template.iconColor.replace('text-', 'bg-')}/20 flex-shrink-0`}>
                        <IconComponent className={`h-5 w-5 ${template.iconColor}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white">{template.name}</h3>
                          <Badge 
                            variant="outline"
                            className="bg-gray-700/50 border-gray-600 text-gray-300 text-xs px-1 py-0 h-5"
                          >
                            {template.category}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {template.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            {getChartTypeIcon(template.chartType)}
                            <span className="text-xs text-gray-400 capitalize">
                              {template.chartType}
                            </span>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs bg-gray-900/50 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-gray-300 hover:text-white"
                            onClick={() => onAddMetric(template)}
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Tooltip de prévia ao passar o mouse */}
                  <div className="absolute opacity-0 group-hover:opacity-100 -top-24 left-1/2 transform -translate-x-1/2 transition-opacity duration-200 invisible group-hover:visible z-50 w-64 pointer-events-none">
                    <div className="bg-gray-900 rounded-md border border-gray-700 shadow-xl p-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`h-2 w-2 rounded-full ${template.iconColor.replace('text-', 'bg-')}`}></div>
                        <span className="text-xs text-white font-medium">{template.name}</span>
                      </div>
                      
                      <div className="text-xs text-gray-400 mb-1.5">
                        Exemplo de visualização
                      </div>
                      
                      <div className="h-12 flex items-center justify-center">
                        {template.chartType === 'gauge' ? (
                          <div className="w-20 h-10 bg-gray-800 rounded-t-full relative overflow-hidden border border-gray-700">
                            <div 
                              className={`absolute bottom-0 h-full w-full rounded-t-full ${template.iconColor.replace('text-', 'bg-')}/30`}
                              style={{ clipPath: 'polygon(0 100%, 50% 20%, 100% 100%)' }}
                            ></div>
                          </div>
                        ) : template.chartType === 'line' ? (
                          <svg width="80" height="40" viewBox="0 0 80 40" className="text-gray-700">
                            <polyline
                              points="0,30 10,25 20,28 30,20 40,15 50,18 60,10 70,5 80,8"
                              fill="none"
                              stroke={template.iconColor.replace('text-', '#').replace('-500', '')}
                              strokeWidth="2"
                            />
                          </svg>
                        ) : template.chartType === 'bar' ? (
                          <svg width="80" height="40" viewBox="0 0 80 40" className="text-gray-700">
                            <rect x="5" y="30" width="10" height="10" className={template.iconColor.replace('text-', 'fill-')} />
                            <rect x="20" y="15" width="10" height="25" className={template.iconColor.replace('text-', 'fill-')} />
                            <rect x="35" y="20" width="10" height="20" className={template.iconColor.replace('text-', 'fill-')} />
                            <rect x="50" y="25" width="10" height="15" className={template.iconColor.replace('text-', 'fill-')} />
                            <rect x="65" y="10" width="10" height="30" className={template.iconColor.replace('text-', 'fill-')} />
                          </svg>
                        ) : template.chartType === 'pie' ? (
                          <svg width="40" height="40" viewBox="0 0 20 20">
                            <circle r="10" cx="10" cy="10" fill="#3b82f6" />
                            <path
                              d="M10,0 A10,10 0 0,1 20,10 L10,10 Z"
                              fill={template.iconColor.replace('text-', '#').replace('-500', '')}
                            />
                            <path
                              d="M10,0 A10,10 0 0,0 0,10 L10,10 Z"
                              fill="#22c55e"
                            />
                          </svg>
                        ) : (
                          <div className="text-center text-gray-500 text-xs">
                            Prévia não disponível
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-gray-900 border-gray-700 transform rotate-45 absolute -bottom-2 left-1/2 -translate-x-1/2 border-b border-r"></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Rodapé do card */}
        <div className="mt-6 pt-4 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-xs text-gray-400">
            Mostrando {filteredTemplates.length} de {metricTemplates.length} métricas disponíveis
          </div>
          
          <Button 
            variant="default" 
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white border-none w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Criar Métrica Personalizada
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};