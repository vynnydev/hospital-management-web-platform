import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/organisms/button";
import { ScrollArea } from "@/components/ui/organisms/scroll-area";
import { AIMetricCard } from './AIMetricCard';
import { Badge } from "@/components/ui/organisms/badge";
import { IMetricSuggestion } from '@/types/ai-metric';

interface ApprovedMetricsListProps {
  metrics: IMetricSuggestion[];
  onImplement: (id: string) => void;
}

export const ApprovedMetricsList: React.FC<ApprovedMetricsListProps> = ({
  metrics,
  onImplement
}) => {
  // Filtrar apenas métricas aprovadas ou implementadas
  const approvedMetrics = metrics.filter(m => m.status === 'approved' || m.status === 'implemented');
  const pendingMetrics = metrics.filter(m => m.status === 'approved');
  const implementedMetrics = metrics.filter(m => m.status === 'implemented');

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho fixo */}
      <div className="p-4 border-b border-indigo-900/30 bg-[#252A3D] flex items-center justify-between">
        <h3 className="text-lg font-medium text-white flex items-center space-x-2">
          <span>Métricas Aprovadas</span>
          {pendingMetrics.length > 0 && (
            <Badge className="ml-2 bg-green-600 text-white">
              {pendingMetrics.length} pendente{pendingMetrics.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </h3>
        
        <div className="flex items-center text-sm text-indigo-200">
          <span className="mr-2">{implementedMetrics.length} implementada{implementedMetrics.length !== 1 ? 's' : ''}</span>
          <Badge variant="outline" className="border-indigo-800/30 bg-indigo-900/20">
            Total: {approvedMetrics.length}
          </Badge>
        </div>
      </div>
      
      {/* Conteúdo com rolagem */}
      <ScrollArea className="flex-1 p-4" type="always">
        {approvedMetrics.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-8">
            <Check className="h-16 w-16 text-green-700/30 mb-4" />
            <h3 className="text-xl font-semibold text-green-300 mb-2">Nenhuma métrica aprovada</h3>
            <p className="text-green-200/70 mb-6 max-w-md">
              Aprove sugestões de métricas para vê-las nesta lista
            </p>
            <Button 
              variant="outline"
              className="text-indigo-300 border-indigo-800/30 hover:bg-indigo-800/50 hover:text-white"
            >
              <ChevronRight className="h-4 w-4 mr-1" />
              Ver Sugestões
            </Button>
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            {/* Métricas pendentes de implementação */}
            {pendingMetrics.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <div className="h-1 w-1 rounded-full bg-amber-500 mr-2"></div>
                  <h4 className="text-base font-medium text-amber-300">Pendentes de Implementação</h4>
                </div>
                
                <div className="space-y-4 mb-8">
                  {pendingMetrics.map((metric) => (
                    <div key={metric.id} className="transform transition-all duration-200 hover:scale-[1.01]">
                      <AIMetricCard 
                        metric={metric}
                        onImplement={onImplement}
                        showActions={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Métricas já implementadas */}
            {implementedMetrics.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <div className="h-1 w-1 rounded-full bg-green-500 mr-2"></div>
                  <h4 className="text-base font-medium text-green-300">Implementadas</h4>
                </div>
                
                <div className="space-y-4">
                  {implementedMetrics.map((metric) => (
                    <div key={metric.id} className="transform transition-all duration-200 hover:scale-[1.01] opacity-80 hover:opacity-100">
                      <AIMetricCard 
                        metric={metric}
                        showActions={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};