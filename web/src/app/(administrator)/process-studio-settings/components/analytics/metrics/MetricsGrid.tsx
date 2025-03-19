import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Users, 
  Settings, 
  RotateCcw, 
  TrendingUp, 
  Activity, 
  Users2, 
  GraduationCap,
  Search,
  Plus,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { IMetric } from '@/types/custom-metrics';

interface MetricsGridProps {
  additionalMetrics: IMetric[];
  selectedCategory: string;
  onAddMetric: (metric: IMetric) => void;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  additionalMetrics,
  selectedCategory,
  onAddMetric
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Definir métricas adicionais do sistema
  const systemMetrics: IMetric[] = [
    {
      id: 'hospital-critico',
      title: "Hospital Crítico",
      value: "Hospital 4Health - Itaim",
      subtitle: "Maior Ocupação",
      trend: 2.5,
      color: "red",
      cardType: "hospital-critico",
      icon: AlertTriangle,
      valueSize: 'small',
      additionalInfo: {
        label: "Taxa de Ocupação",
        value: "85.5%"
      },
      position: { x: 0, y: 0, w: 3, h: 4 },
      chartType: 'card'
    },
    {
      id: 'burnout',
      title: "Risco de Burnout",
      value: 6.7,
      subtitle: "Nível de Estresse",
      trend: 1.8,
      target: 5.0,
      color: "orange",
      cardType: "burnout",
      icon: Users,
      additionalInfo: {
        label: "Equipes em Alerta",
        value: "3 de 8 equipes"
      },
      position: { x: 3, y: 0, w: 3, h: 4 },
      chartType: 'gauge',
      config: {
        target: 5.0,
        warning: 7.0,
        critical: 8.5
      }
    },
    {
      id: 'manutencao',
      title: "Manutenção",
      value: 12,
      subtitle: "Leitos em Manutenção",
      trend: -0.5,
      color: "blue",
      cardType: "manutencao",
      icon: Settings,
      additionalInfo: {
        label: "Previsão de Conclusão",
        value: "7 dias"
      },
      position: { x: 6, y: 0, w: 3, h: 4 },
      chartType: 'card'
    },
    {
      id: 'taxa-giro',
      title: "Taxa de Giro",
      value: 4.2,
      subtitle: "Rotatividade de Leitos",
      trend: 1.2,
      target: 8.0,
      color: "cyan",
      cardType: "taxa-giro",
      icon: RotateCcw,
      additionalInfo: {
        label: "Média do Setor",
        value: "4.8 pacientes/leito"
      },
      position: { x: 9, y: 0, w: 3, h: 4 },
      chartType: 'line',
      chartData: [
        { date: '2025-03-12', value: 3.8 },
        { date: '2025-03-13', value: 4.0 },
        { date: '2025-03-14', value: 3.7 },
        { date: '2025-03-15', value: 4.1 },
        { date: '2025-03-16', value: 4.3 },
        { date: '2025-03-17', value: 4.0 },
        { date: '2025-03-18', value: 4.2 }
      ]
    },
    {
      id: 'eficiencia',
      title: "Eficiência Operacional",
      value: 87,
      subtitle: "Performance Geral",
      trend: 3.2,
      target: 90,
      color: "emerald",
      cardType: "eficiencia",
      icon: TrendingUp,
      additionalInfo: {
        label: "Ranking na Rede",
        value: "#2 de 3 hospitais"
      },
      position: { x: 0, y: 4, w: 3, h: 4 },
      chartType: 'gauge',
      config: {
        target: 90,
        warning: 75,
        critical: 60
      }
    },
    {
      id: 'ocupacao',
      title: "Ocupação Média",
      value: 78.4,
      subtitle: "Taxa de Ocupação",
      trend: 2.3,
      target: 85,
      color: "violet",
      cardType: "ocupacao",
      icon: Activity,
      additionalInfo: {
        label: "Leitos Ocupados",
        value: "251/320"
      },
      position: { x: 3, y: 4, w: 3, h: 4 },
      chartType: 'gauge',
      config: {
        target: 85,
        warning: 90,
        critical: 95
      }
    },
    {
      id: 'variacao',
      title: "Variação de Pacientes",
      value: 18.5,
      subtitle: "Entre Departamentos",
      trend: -1.5,
      target: 15,
      color: "fuchsia",
      cardType: "variacao",
      icon: Users2,
      additionalInfo: {
        label: "Maior Diferença",
        value: "UTI vs. Enfermaria"
      },
      position: { x: 6, y: 4, w: 3, h: 4 },
      chartType: 'bar',
      chartData: [
        { label: 'UTI', value: 92 },
        { label: 'Enfermaria', value: 78 },
        { label: 'Cirurgia', value: 65 }
      ]
    },
    {
      id: 'treinamento',
      title: "Treinamento Profissional",
      value: 84,
      subtitle: "Capacitação da Equipe",
      trend: 4.2,
      target: 95,
      color: "teal",
      cardType: "treinamento",
      icon: GraduationCap,
      additionalInfo: {
        label: "Profissionais Treinados",
        value: "42 este mês"
      },
      position: { x: 9, y: 4, w: 3, h: 4 },
      chartType: 'gauge',
      config: {
        target: 95,
        warning: 80,
        critical: 70
      }
    }
  ];
  
  // Combinar métricas adicionais com métricas do sistema
  const allMetrics = [...additionalMetrics, ...systemMetrics];
  
  // Filtrar métricas com base na categoria e pesquisa
  const filteredMetrics = allMetrics.filter(metric => {
    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      // Mapear categoria para tipos de métrica correspondentes
      const categoryMap: Record<string, string[]> = {
        'operational': ['ocupacao', 'taxa-giro', 'eficiencia', 'gauge', 'line'],
        'financial': ['financial', 'burnout', 'eficiencia'],
        'clinical': ['clinical', 'hospital-critico', 'manutencao'],
        'satisfaction': ['satisfaction', 'treinamento'],
        'hr': ['hr', 'variacao', 'burnout', 'treinamento']
      };
      
      const validTypes = categoryMap[selectedCategory] || [];
      if (!validTypes.some(type => 
        metric.cardType.includes(type) || 
        metric.chartType?.includes(type) || 
        (metric.color === selectedCategory)
      )) {
        return false;
      }
    }
    
    // Filtrar por texto de pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        metric.title.toLowerCase().includes(query) ||
        metric.subtitle.toLowerCase().includes(query) ||
        (metric.additionalInfo?.label.toLowerCase().includes(query)) ||
        (metric.additionalInfo?.value.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  return (
    <Card className="bg-gray-900 border-gray-700 shadow-lg">
      <CardHeader className="border-b border-gray-700 px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
          <CardTitle className="text-white">
            Métricas Disponíveis
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Buscar métricas..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 w-[150px] md:w-auto"
              />
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-800 border-gray-700 text-gray-300 hover:text-white"
            >
              <Filter className="h-4 w-4 mr-1.5" />
              Filtros
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-800 border-gray-700 text-gray-300 hover:text-white"
            >
              <ArrowUpDown className="h-4 w-4 mr-1.5" />
              Ordenar
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {filteredMetrics.length === 0 ? (
          <div className="text-center py-8">
            <Search className="h-10 w-10 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400 mb-2">
              Nenhuma métrica encontrada com os filtros selecionados.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="mt-2 bg-gray-800 border-gray-700 text-gray-300 hover:text-white"
              onClick={() => setSearchQuery('')}
            >
              Limpar Filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMetrics.map(metric => {
              const IconComponent = metric.icon;
              const colorClass = `text-${metric.color}-500`;
              
              return (
                <Card 
                  key={metric.id}
                  className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-200 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-full bg-${metric.color}-500/20`}>
                        <IconComponent className={`h-4 w-4 ${colorClass}`} />
                      </div>
                      <h3 className="font-medium text-white text-sm truncate">
                        {metric.title}
                      </h3>
                      
                      {metric.trend !== undefined && (
                        <div className={`ml-auto flex items-center gap-1 text-xs ${
                          metric.trend > 0 ? 'text-green-500' : metric.trend < 0 ? 'text-red-500' : 'text-gray-400'
                        }`}>
                          {metric.trend > 0 ? '↑' : metric.trend < 0 ? '↓' : ''}
                          {Math.abs(metric.trend).toFixed(1)}%
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <div className="text-sm text-gray-400">
                        {metric.subtitle}
                      </div>
                      <div className="text-lg font-semibold text-white mt-1 flex items-baseline gap-1">
                        {metric.value}
                        {metric.config?.target && <span className="text-xs text-gray-400">%</span>}
                      </div>
                    </div>
                    
                    {metric.additionalInfo && (
                      <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between text-xs">
                        <span className="text-gray-400">{metric.additionalInfo.label}</span>
                        <span className="text-gray-300 font-medium">{metric.additionalInfo.value}</span>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-white"
                      size="sm"
                      onClick={() => onAddMetric(metric)}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Adicionar ao Dashboard
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};