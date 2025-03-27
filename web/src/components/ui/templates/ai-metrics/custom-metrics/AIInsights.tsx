import React from 'react';
import { Card } from '@/components/ui/organisms/card';
import { X, Lightbulb, AlertTriangle, Activity, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';

interface Insight {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  metrics: string[];
}

interface AIInsightsProps {
  insights: Insight[];
  onClose: () => void;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ insights, onClose }) => {
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
      
      <div className="space-y-3">
        {insights.map(insight => {
          const colors = getSeverityColor(insight.severity);
          
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
                  <h4 className={`font-medium ${colors.text}`}>{insight.title}</h4>
                  <p className="text-sm text-gray-300 mt-1">{insight.description}</p>
                  
                  {insight.metrics.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1">Métricas relacionadas:</p>
                      <div className="flex flex-wrap gap-1">
                        {insight.metrics.map((metric, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center text-xs bg-gray-800/70 text-gray-300 rounded-full px-2 py-1 border border-gray-700"
                          >
                            {metric}
                            <ChevronRight className="h-3 w-3 ml-1" />
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
    </Card>
  );
};