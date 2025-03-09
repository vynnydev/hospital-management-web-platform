/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { BarChart3, Gauge, Ambulance, Activity, AlertTriangle, CheckSquare, ArrowDownToLine, ArrowUpFromLine, Brain } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/organisms/dialog';
import { Button } from '@/components/ui/organisms/button';
import { Badge } from '@/components/ui/organisms/badge';

interface StatsModalProps {
  stats: {
    totalPatients: number;
    occupiedBeds: number;
    availableBeds: number;
    incomingTransfers: number;
    outgoingTransfers: number;
    criticalPatients: number;
    occupancyRate: number;
  };
  hospitalName: string;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, hospitalName }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        >
          <BarChart3 className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
          Métricas Avançadas
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100 flex items-center">
            <Gauge className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Estatísticas Detalhadas - {hospitalName}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Análise detalhada das métricas hospitalares
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Gráfico de ocupação */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Activity className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              Ocupação por Departamento
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">UTI</span>
                  <span className="text-gray-800 dark:text-gray-200">92%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-red-600 dark:bg-red-500 h-2.5 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Enfermaria</span>
                  <span className="text-gray-800 dark:text-gray-200">78%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-yellow-500 dark:bg-yellow-600 h-2.5 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Centro Cirúrgico</span>
                  <span className="text-gray-800 dark:text-gray-200">65%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-500 dark:bg-blue-600 h-2.5 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Emergência</span>
                  <span className="text-gray-800 dark:text-gray-200">45%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-green-500 dark:bg-green-600 h-2.5 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Estatísticas de transferências */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Ambulance className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              Estatísticas de Transferências
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400">Tempo médio</div>
                <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">18 min</div>
                <div className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <ArrowDownToLine className="h-3 w-3 mr-1" />
                  5% melhor que ontem
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400">Total hoje</div>
                <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">23</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <ArrowUpFromLine className="h-3 w-3 mr-1" />
                  12% mais que ontem
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400">Emergências</div>
                <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">7</div>
                <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  3 casos críticos
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400">Taxa de sucesso</div>
                <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">98.2%</div>
                <div className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <CheckSquare className="h-3 w-3 mr-1" />
                  Alta performance
                </div>
              </div>
            </div>
          </div>
          
          {/* Indicadores de Performance */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Gauge className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              Indicadores de Performance (KPIs)
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tempo médio de atendimento</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">32 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Média de permanência</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">5.2 dias</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de readmissão</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">4.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de ocupação</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">85.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Giro de leito</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">12.3/mês</span>
              </div>
            </div>
          </div>
          
          {/* Previsão de Capacidade */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Brain className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              Previsão de Capacidade (IA)
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">UTI - Próximas 24h</span>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Crítico</Badge>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Previsão de 97% de ocupação
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Recomendação: Preparar leitos adicionais
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Enfermaria - Próximas 24h</span>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Atenção</Badge>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Previsão de 85% de ocupação
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Recomendação: Monitorar admissões
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Previsão semanal</span>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Estável</Badge>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Tendência de aumento de 2-3% em 7 dias
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Gerar Relatório Completo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};