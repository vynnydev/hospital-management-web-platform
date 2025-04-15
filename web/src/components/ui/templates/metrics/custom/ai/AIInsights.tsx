import React from 'react';
import { Card } from '@/components/ui/organisms/card';
import { X, Lightbulb, AlertTriangle, Activity, ChevronRight, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Spinner } from '@/components/ui/organisms/spinner';
import { IHospitalInsight, IPredictiveInsight, ISystemInsight } from '@/hooks/AI/ai-analytics/useAIInsights';

interface AIInsightsProps {
  insights: (ISystemInsight | IHospitalInsight | IPredictiveInsight)[];
  loading?: boolean;
  onClose: () => void;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ insights, loading = false, onClose }) => {
  // Função para obter cor baseada na severidade
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-900/20',
          border: 'border-red-800',
          text: 'text-red-400',
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />
        };
      case 'medium':
        return {
          bg: 'bg-amber-900/20',
          border: 'border-amber-800',
          text: 'text-amber-400',
          icon: <Activity className="h-5 w-5 text-amber-500" />
        };
      default:
        return {
          bg: 'bg-blue-900/20',
          border: 'border-blue-800',
          text: 'text-blue-400',
          icon: <Lightbulb className="h-5 w-5 text-blue-500" />
        };
    }
  };
  
  // Função para obter ícone baseado na categoria
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'occupancy':
        return <Activity className="h-4 w-4 text-blue-400" />;
      case 'staff':
        return <Zap className="h-4 w-4 text-amber-400" />;
      case 'clinical':
        return <Lightbulb className="h-4 w-4 text-green-400" />;
      case 'supply':
        return <Clock className="h-4 w-4 text-purple-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };
  
  // Renderizar conteúdo com base no estado de carregamento
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner size="lg" className="text-purple-500 mb-4" />
          <p className="text-gray-400">Analisando dados do hospital...</p>
        </div>
      );
    }
    
    if (insights.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-gray-800 mb-4">
            <Lightbulb className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhum insight disponível</h3>
          <p className="text-sm text-gray-500 max-w-md">
            Não foram encontrados padrões ou tendências significativas nos dados atuais.
            Tente novamente mais tarde ou ajuste os parâmetros de análise.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        {insights.map(insight => {
          const colors = getSeverityColor(insight.severity);
          const categoryIcon = getCategoryIcon(insight.category);
          
          return (
            <div 
              key={insight.id}
              className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {colors.icon}
                </div>
                <div>
                  <div className="flex items-center">
                    <h4 className={`font-medium ${colors.text}`}>{insight.title}</h4>
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 flex items-center gap-1">
                      {categoryIcon}
                      {insight.category}
                    </span>
                    {'timeframe' in insight && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-900/30 border border-purple-800 text-purple-300 flex items-center gap-1">
                        <Clock className="h-3 w-3 mr-0.5" />
                        {insight.timeframe}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{insight.description}</p>
                  
                  {insight.suggestedActions && insight.suggestedActions.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1">Ações sugeridas:</p>
                      <ul className="space-y-1">
                        {insight.suggestedActions.map((action, index) => (
                          <li key={index} className="text-xs text-gray-300 flex items-start">
                            <ChevronRight className="h-3 w-3 mt-0.5 mr-1 text-gray-500" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {insight.metrics && insight.metrics.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1">Métricas relacionadas:</p>
                      <div className="flex flex-wrap gap-1">
                        {insight.metrics.map((metric, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center text-xs bg-gray-800/70 text-gray-300 rounded-full px-2 py-1 border border-gray-700"
                          >
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <Card className="bg-gradient-to-r from-gray-900 to-blue-900/30 border-blue-800/50 p-4 relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-full bg-blue-900/50 border border-blue-700">
          <Lightbulb className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">Insights da IA</h3>
          <p className="text-sm text-gray-400">Análise automática baseada em dados recentes do hospital</p>
        </div>
      </div>
      
      {renderContent()}
    </Card>
  );
};