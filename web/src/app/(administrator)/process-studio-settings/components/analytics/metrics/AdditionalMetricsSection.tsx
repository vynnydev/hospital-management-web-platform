/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Users, 
  Settings, 
  Activity, 
  TrendingUp, 
  RotateCcw,
  Pencil,
  GraduationCap,
  BarChart3,
  Users2,
  Save,
  X,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { Card } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/organisms/tooltip';
import { IAdditionalMetrics, IMetricCard } from '@/types/custom-metrics';

interface AdditionalMetricsSectionProps {
  metrics: IMetricCard[];
  isEditing: boolean;
  onEditMetric?: (metricId: string) => void;
  onRemoveMetric?: (metricId: string) => void;
  currentMetrics?: {
    totalPatients: number;
    totalBeds: number;
  };
}

export const AdditionalMetricsSection: React.FC<AdditionalMetricsSectionProps> = ({
  metrics,
  isEditing,
  onEditMetric,
  onRemoveMetric,
  currentMetrics = { totalPatients: 0, totalBeds: 0 }
}) => {
  // Estado para métricas editáveis
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editedSubtitle, setEditedSubtitle] = useState<string>('');
  
  // Estado para armazenar os títulos e subtítulos personalizados
  const [customTitles, setCustomTitles] = useState<Record<string, { title: string; subtitle: string }>>({});
  
  // Função para obter a classe de cor para o ícone da tendência
  const getTrendColorClass = (trend?: number) => {
    if (!trend) return 'text-gray-400';
    return trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-400';
  };
  
  // Função para obter o gradiente de cor do card
  const getGradient = (color: string) => {
    const colorMap: Record<string, string> = {
      'red': 'from-red-400/20 to-rose-500/20',
      'orange': 'from-amber-400/20 to-yellow-500/20',
      'blue': 'from-blue-400/20 to-indigo-500/20',
      'cyan': 'from-cyan-400/20 to-blue-500/20',
      'emerald': 'from-emerald-400/20 to-green-500/20',
      'violet': 'from-violet-400/20 to-purple-500/20',
      'fuchsia': 'from-fuchsia-400/20 to-pink-500/20',
      'teal': 'from-teal-400/20 to-cyan-500/20',
      'green': 'from-green-400/20 to-emerald-500/20',
      'purple': 'from-purple-400/20 to-indigo-500/20'
    };
    
    return colorMap[color] || 'from-gray-400/20 to-gray-500/20';
  };
  
  // Função para obter a classe de cor do ícone
  const getIconColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      'red': 'text-red-500',
      'orange': 'text-amber-500',
      'blue': 'text-blue-500',
      'cyan': 'text-cyan-500',
      'emerald': 'text-emerald-500',
      'violet': 'text-violet-500',
      'fuchsia': 'text-fuchsia-500',
      'teal': 'text-teal-500',
      'green': 'text-green-500',
      'purple': 'text-purple-500'
    };
    
    return colorMap[color] || 'text-gray-500';
  };
  
  // Função para iniciar a edição de uma métrica
  const handleStartEditing = (metricId: string, title: string, subtitle: string) => {
    setEditingMetricId(metricId);
    setEditedTitle(title);
    setEditedSubtitle(subtitle);
  };
  
  // Função para salvar a edição de uma métrica
  const handleSaveEditing = () => {
    if (editingMetricId !== null) {
      setCustomTitles(prev => ({
        ...prev,
        [editingMetricId]: {
          title: editedTitle,
          subtitle: editedSubtitle
        }
      }));
      setEditingMetricId(null);
      
      // Se houver um callback de edição externo, chame-o também
      if (onEditMetric) {
        onEditMetric(editingMetricId);
      }
    }
  };
  
  // Função para cancelar a edição
  const handleCancelEditing = () => {
    setEditingMetricId(null);
  };
  
  // Função para obter o título e subtítulo de um card (personalizado ou padrão)
  const getCardTitleAndSubtitle = (metricId: string, defaultTitle: string, defaultSubtitle: string) => {
    if (customTitles[metricId]) {
      return {
        title: customTitles[metricId].title,
        subtitle: customTitles[metricId].subtitle
      };
    }
    return {
      title: defaultTitle,
      subtitle: defaultSubtitle
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const IconComponent = metric.icon;
        const { title, subtitle } = getCardTitleAndSubtitle(metric.id, metric.title, metric.subtitle);
        const isEditing_card = editingMetricId === metric.id;
        
        return (
          <Card 
            key={metric.id} 
            className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${getGradient(metric.color)}`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${getIconColorClass(metric.color)} bg-opacity-20`}>
                    <IconComponent className={`h-5 w-5 ${getIconColorClass(metric.color)}`} />
                  </div>
                  {isEditing_card ? (
                    <Input 
                      className="ml-2 bg-gray-900/50 border-gray-700 text-white h-8"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                  ) : (
                    <h3 className="ml-2 font-medium text-gray-200">{title}</h3>
                  )}
                </div>
                
                {isEditing && editingMetricId === null && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-800/30"
                            onClick={() => handleStartEditing(metric.id, title, subtitle)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-gray-900 border-gray-700 text-white">
                          Editar métrica
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    {onRemoveMetric && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 hover:bg-gray-800/30"
                              onClick={() => onRemoveMetric(metric.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-gray-900 border-gray-700 text-white">
                            Remover métrica
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                {isEditing_card ? (
                  <Input 
                    className="bg-gray-900/50 border-gray-700 text-gray-300 h-7 text-sm mb-2"
                    value={editedSubtitle}
                    onChange={(e) => setEditedSubtitle(e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-gray-400">{subtitle}</p>
                )}
                <div className="flex items-center mt-1">
                  <div className={`text-2xl font-bold text-white ${metric.valueSize === 'small' ? 'text-lg' : ''}`}>
                    {metric.value}
                  </div>
                  {metric.trend !== undefined && (
                    <div className={`ml-2 text-sm flex items-center ${getTrendColorClass(metric.trend)}`}>
                      {metric.trend > 0 ? '↑' : metric.trend < 0 ? '↓' : ''}
                      {Math.abs(metric.trend).toFixed(1)}%
                    </div>
                  )}
                </div>
                {metric.additionalInfo && (
                  <p className="text-sm text-gray-300 mt-1">
                    {metric.additionalInfo.label}: {metric.additionalInfo.value}
                  </p>
                )}
              </div>
              
              <div className="mt-4">
                <div className="flex">
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Análise comparativa</div>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                      {metric.trend && metric.trend > 2 
                        ? "Acima da média esperada. Bom desempenho." 
                        : metric.trend && metric.trend < 0
                          ? "Abaixo da meta estabelecida. Verificar fatores." 
                          : "Dentro dos parâmetros normais de operação."}
                    </p>
                  </div>
                </div>
              </div>
              
              {isEditing_card && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white h-7 px-2.5"
                    onClick={handleSaveEditing}
                  >
                    <Save className="h-3.5 w-3.5 mr-1" /> Salvar
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-gray-900/30 border-gray-700 text-gray-300 hover:bg-gray-900/50 h-7 px-2.5"
                    onClick={handleCancelEditing}
                  >
                    <X className="h-3.5 w-3.5 mr-1" /> Cancelar
                  </Button>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};