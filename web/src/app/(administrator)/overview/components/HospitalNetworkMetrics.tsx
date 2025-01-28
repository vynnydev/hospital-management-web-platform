/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Card } from "@/components/ui/organisms/card";
import { 
  Building2, 
  Bed,
  Users,
  Activity,
  Clock,
  TrendingUp,
  RotateCcw,
  Info,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/organisms/tooltip";
import { INetworkData } from '@/types/hospital-network-types';

interface IMetricsProps {
  networkData: INetworkData;
  currentMetrics: {
    totalBeds: number;
    totalPatients: number;
    averageOccupancy: number;
  };
}

const MetricTooltip = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
  <TooltipProvider>
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <div className="cursor-help">{children}</div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs p-4 bg-gray-900 text-white rounded-lg shadow-lg">
        <h4 className="font-bold mb-1">{title}</h4>
        <p className="text-sm text-gray-200">{description}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const HospitalNetworkMetrics = ({ networkData, currentMetrics }: IMetricsProps) => {
  const efficiency = networkData?.networkInfo?.networkMetrics?.networkEfficiency;
  const periodComparison = networkData?.hospitals[0]?.metrics?.overall?.periodComparison;
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 [&>*]:h-full">
      {/* Ocupação Card */}
      <MetricTooltip 
        title="Ocupação Média"
        description="Taxa de ocupação dos leitos hospitalares. Indica a eficiência na utilização dos recursos disponíveis e a demanda atual do hospital."
      >
        <Card className="p-4 bg-blue-950 border-none">
            <div className="space-y-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-900 rounded-lg">
                            <Activity size={24} className="text-blue-300" />
                        </div>
                        <div>
                        <p className="text-sm text-gray-400">Ocupação Média</p>
                            <div className="flex items-center space-x-2">
                                <h3 className="text-2xl font-bold text-white">
                                    {currentMetrics.averageOccupancy}%
                                </h3>
                                <span className="text-green-400 flex items-center text-sm">
                                    <ArrowUp size={16} />
                                    2.3%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-2 pt-4 pb-4">
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-yellow-500"
                            style={{ width: `${currentMetrics.averageOccupancy}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>0%</span>
                        <span>Meta: 85%</span>
                        <span>100%</span>
                    </div>
                </div>

                <div className="bg-blue-900/50 rounded-lg p-3 space-y-3">
                    <div className="flex items-start space-x-2">
                        <Info size={16} className="text-blue-300 mt-0.5" />
                    <div>
                        <p className="text-xs text-white font-medium">Análise comparativa</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Taxa de ocupação dentro dos parâmetros esperados. 
                            Margem segura para gestão de leitos mantida.
                        </p>
                    </div>
                </div>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <p className="text-gray-400 text-xs">Total de Leitos</p>
                        <p className="text-white">{currentMetrics.totalBeds}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs">Pacientes</p>
                        <p className="text-white">{currentMetrics.totalPatients}</p>
                    </div>
                </div>
            </div>
        </div>
        </Card>
      </MetricTooltip>

      {/* Tempo Médio Card */}
      <MetricTooltip 
        title="Tempo Médio de Permanência"
        description="Duração média da internação dos pacientes. Um indicador crucial para avaliar a eficiência dos processos hospitalares e a qualidade do atendimento."
      >
        <Card className="p-4 bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Clock size={24} className="text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tempo Médio</p>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {efficiency?.avgWaitTime.toFixed(1) || 0} dias
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    (efficiency?.avgWaitTime || 0) <= 4.5 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(((efficiency?.avgWaitTime || 0) / 10) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pb-4">
                <span>0</span>
                <div className="flex items-center">
                  <span>Meta: 4.5 dias</span>
                  <span className={`ml-2 flex items-center ${
                    (efficiency?.avgWaitTime || 0) <= 4.5 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    <TrendingUp size={12} className="mr-1" />
                    {((efficiency?.avgWaitTime || 0) - 4.5).toFixed(1)} dias
                  </span>
                </div>
                <span>10 dias</span>
              </div>

              <div className="bg-purple-50/80 dark:bg-purple-900/20 rounded-lg p-3 flex items-start space-x-2">
                <Info size={16} className="text-purple-500 dark:text-purple-400 mt-0.5" />
                <div>
                  <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">Análise comparativa</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    Tempo médio 6% menor que a média da rede. UTI requer atenção com média acima do esperado.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">UTI</p>
                  <p className="font-medium text-gray-900 dark:text-white">5.2 dias</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Enfermaria</p>
                  <p className="font-medium text-gray-900 dark:text-white">3.8 dias</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </MetricTooltip>

      {/* Taxa de Giro Card */}
      <MetricTooltip 
        title="Taxa de Giro"
        description="Número de pacientes que ocupam o mesmo leito em um período. Indica a eficiência na rotatividade dos leitos e capacidade de atendimento."
      >
        <Card className="p-4 bg-green-50/50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <RotateCcw size={24} className="text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Taxa de Giro</p>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {efficiency?.bedTurnover.toFixed(1) || 0}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{ width: `${(efficiency?.bedTurnover || 0) * 10}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pb-4">
                <span>0</span>
                <span>Meta: 8.0</span>
                <span>10</span>
              </div>

              <div className="bg-green-50/80 dark:bg-green-900/20 rounded-lg p-3 flex items-start space-x-2">
                <Info size={16} className="text-green-500 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="text-xs text-green-700 dark:text-green-300 font-medium">Taxa de rotatividade</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    Alta eficiência na gestão de leitos. Média de 42 altas/dia indica ótimo fluxo de pacientes.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Altas/dia</p>
                  <p className="font-medium text-gray-900 dark:text-white">42</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Internações/dia</p>
                  <p className="font-medium text-gray-900 dark:text-white">38</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </MetricTooltip>

      {/* Eficiência Card */}
      <MetricTooltip 
        title="Eficiência Geral"
        description="Índice que combina diversos fatores como ocupação, tempo médio de permanência e taxa de giro para avaliar a eficiência global do hospital."
      >
        <Card className="p-4 bg-orange-50/50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <TrendingUp size={24} className="text-orange-600 dark:text-orange-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Eficiência</p>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {(efficiency?.resourceUtilization * 100).toFixed(0)}%
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    efficiency?.resourceUtilization >= 0.9 ? 'bg-green-500' :
                    efficiency?.resourceUtilization >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(efficiency?.resourceUtilization * 100) || 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pb-4">
                <span>0%</span>
                <span>Meta: 90%</span>
                <span>100%</span>
              </div>

              <div className="bg-orange-50/80 dark:bg-orange-900/20 rounded-lg p-3 flex items-start space-x-2">
                <Info size={16} className="text-orange-500 dark:text-orange-400 mt-0.5" />
                <div>
                  <p className="text-xs text-orange-700 dark:text-orange-300 font-medium">Performance geral</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    2º lugar na rede com 95% de eficiência. Melhor resultado dos últimos 6 meses.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Rank Rede</p>
                  <p className="font-medium text-gray-900 dark:text-white">#2</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Melhor Meta</p>
                  <p className="font-medium text-gray-900 dark:text-white">95%</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </MetricTooltip>
    </div>
  );
};