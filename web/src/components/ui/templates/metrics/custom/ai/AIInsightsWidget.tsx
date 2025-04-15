/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { 
  Lightbulb, 
  AlertTriangle, 
  Activity, 
  ChevronRight,
  Zap,
  Clock,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Badge } from '@/components/ui/organisms/badge';
import { Spinner } from '@/components/ui/organisms/spinner';
import { AIInsightsDisplay } from './AIInsightsDisplay';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/organisms/dialog';
import { IInsight, useAIInsights } from '@/hooks/AI/ai-analytics/useAIInsights';

interface AIInsightsWidgetProps {
  hospitalId?: string;
  limit?: number;
  title?: string;
  showExpandButton?: boolean;
}

/**
 * Componente widget compacto para exibir insights críticos da IA
 * Ideal para ser usado em dashboards ou sidebars
 */
export const AIInsightsWidget: React.FC<AIInsightsWidgetProps> = ({
  hospitalId,
  limit = 3,
  title = "Insights da IA",
  showExpandButton = true
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Usar o hook para buscar insights críticos (alta severidade)
  const { 
    insights, 
    loading, 
    error, 
    getCriticalInsights,
    getInsightCountBySeverity,
    refreshInsights
  } = useAIInsights(hospitalId, undefined, 'high');
  
  // Obter insights críticos limitados
  const criticalInsights = getCriticalInsights().slice(0, limit);
  const insightCounts = getInsightCountBySeverity();
  
  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };
  
  // Função para obter cor baseada na severidade
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-900/20',
          border: 'border-red-800',
          text: 'text-red-400',
          icon: <AlertTriangle className="h-4 w-4 text-red-500" />
        };
      case 'medium':
        return {
          bg: 'bg-amber-900/20',
          border: 'border-amber-800',
          text: 'text-amber-400',
          icon: <Activity className="h-4 w-4 text-amber-500" />
        };
      default:
        return {
          bg: 'bg-blue-900/20',
          border: 'border-blue-800',
          text: 'text-blue-400',
          icon: <Lightbulb className="h-4 w-4 text-blue-500" />
        };
    }
  };
  
  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-gray-900 to-blue-900/30 border-blue-800/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Spinner className="text-blue-500" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="bg-gradient-to-r from-gray-900 to-red-900/30 border-red-800/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Erro ao carregar insights
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <p className="text-sm text-gray-400">{error}</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshInsights}
            className="mt-3 bg-gray-800 border-gray-700 text-gray-300"
          >
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const renderInsightItem = (insight: IInsight) => {
    const colors = getSeverityColor(insight.severity);
    
    return (
      <div 
        key={insight.id}
        className={`p-3 rounded-lg ${colors.bg} border ${colors.border} mb-2 last:mb-0`}
      >
        <div className="flex items-start gap-2">
          <div className="mt-0.5 flex-shrink-0">
            {colors.icon}
          </div>
          <div>
            <h4 className={`text-sm font-medium ${colors.text}`}>{insight.title}</h4>
            <p className="text-xs text-gray-300 mt-0.5 line-clamp-2">{insight.description}</p>
            <div className="flex justify-between items-center mt-1.5 text-xs text-gray-400">
              <Badge 
                variant="outline" 
                className="px-1.5 py-0 text-xs bg-gray-800/50 border-gray-700"
              >
                {insight.category}
              </Badge>
              
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(insight.timestamp)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card className="bg-gradient-to-r from-gray-900 to-blue-900/30 border-blue-800/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              {title}
            </div>
            
            {showExpandButton && (
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="py-2">
          {criticalInsights.length > 0 ? (
            <>
              {criticalInsights.map(renderInsightItem)}
              
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <div>
                  <span className="text-red-400">{insightCounts.high}</span> de alta prioridade
                </div>
                
                {showExpandButton && (
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs h-7 text-blue-400 hover:text-blue-300"
                    >
                      Ver todos
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </DialogTrigger>
                )}
              </div>
            </>
          ) : (
            <div className="py-4 text-center">
              <p className="text-sm text-gray-400">Nenhum insight crítico encontrado</p>
              <p className="text-xs text-gray-500 mt-1">Todos os sistemas estão operando normalmente</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <DialogContent className="sm:max-w-[900px] bg-gray-900 border-gray-700">
        <AIInsightsDisplay hospitalId={hospitalId} onClose={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};