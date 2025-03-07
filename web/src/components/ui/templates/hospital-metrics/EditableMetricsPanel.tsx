/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  ChevronUp, 
  ChevronDown,
  AlertTriangle,
  Users,
  Settings,
  Clock,
  Activity,
  TrendingUp,
  RotateCcw,
  GraduationCap,
  Users2
} from 'lucide-react';
import { Button } from "@/components/ui/organisms/button";
import { INetworkData } from '@/types/hospital-network-types';
import { TMetric } from '@/types/hospital-metrics';
import { MainHospitalAlertMetrics } from '@/app/(administrator)/overview/components/MainHospitalAlertMetrics';
import { AdditionalHospitalMetrics } from '@/app/(administrator)/overview/components/AdditionalHospitalMetrics';

// Mapeamento de ícones para diferentes tipos de métricas
const metricIcons: Record<string, React.ElementType> = {
  'critical-hospital': AlertTriangle,
  'staff': Users,
  'maintenance': Settings,
  'waiting': Clock,
  'hospital-critico': AlertTriangle,
  'burnout': Users,
  'manutencao': Settings,
  'taxa-giro': RotateCcw,
  'eficiencia': TrendingUp,
  'ocupacao': Activity,
  'variacao': Users2,
  'treinamento': GraduationCap
};

interface EditableMetricsPanelProps {
  networkData: INetworkData;
  currentMetrics: {
    totalBeds: number;
    totalPatients: number;
    averageOccupancy: number;
  };
  selectedRegion: string;
  selectedHospital: string | null;
  isEditMode: boolean;
  onExitEditMode: () => void;
  
  // Propriedades específicas para integração com métricas
  visibleMainMetrics: string[];
  visibleAdditionalMetrics: string[];
  removeMainMetric: (metricId: string) => Promise<void>;
  removeAdditionalMetric: (metricId: string) => Promise<void>;
  addMetricById: (metricId: string, type: 'main' | 'additional') => Promise<void>;
  allMetrics?: TMetric[];
  onAddMetricClick: () => void;
}

export const EditableMetricsPanel: React.FC<EditableMetricsPanelProps> = ({
  networkData,
  currentMetrics,
  selectedRegion,
  selectedHospital,
  isEditMode,
  onExitEditMode,
  visibleMainMetrics,
  visibleAdditionalMetrics,
  removeMainMetric,
  removeAdditionalMetric,
  addMetricById,
  allMetrics = [],
  onAddMetricClick
}) => {
  const [expandedAdditionalMetrics, setExpandedAdditionalMetrics] = useState(true);
  
  // Obter todas as métricas principais e adicionais filtradas pelas IDs visíveis
  const mainMetrics = allMetrics.filter(metric => 
    metric.type === 'main' && visibleMainMetrics.includes(metric.id)
  );
  
  const additionalMetrics = allMetrics.filter(metric => 
    metric.type === 'additional' && visibleAdditionalMetrics.includes(metric.id)
  );

  return (
    <div className={`
      relative transition-all duration-500 ease-in-out
      ${isEditMode ? 'z-50 scale-105 transform translate-y-3 shadow-2xl' : 'z-10'}
    `}>
      {/* Barra superior em modo de edição */}
      {isEditMode && (
        <div className="absolute -top-16 left-0 right-0 bg-blue-600 dark:bg-blue-800 rounded-t-xl p-4 flex flex-col md:flex-row justify-between items-center shadow-lg z-20">
          <div className="flex items-center space-x-2 mb-3 md:mb-0">
            <span className="text-white font-semibold">Modo de Edição de Métricas</span>
            <div className="px-2 py-1 bg-blue-700 dark:bg-blue-900 rounded-md">
              <span className="text-xs text-blue-100">
                {visibleMainMetrics.length + visibleAdditionalMetrics.length} métricas visíveis
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              className="bg-blue-700 hover:bg-blue-800 text-white border-blue-500"
              onClick={onAddMetricClick}
            >
              <Plus size={16} className="mr-1" /> Adicionar Métrica
            </Button>
            <Button 
              variant="outline" 
              className="bg-blue-700 hover:bg-blue-800 text-white border-blue-500"
              onClick={onExitEditMode}
            >
              Concluir
            </Button>
          </div>
        </div>
      )}

      {/* Componente de Métricas Principais com botões de remover */}
      <div className={`
        relative rounded-3xl overflow-hidden transition-all duration-500
        ${isEditMode ? 'shadow-2xl ring-4 ring-blue-400 dark:ring-blue-600' : ''}
      `}>
        <div className="relative z-10">
          <MainHospitalAlertMetrics 
            networkData={networkData}
            currentMetrics={currentMetrics}
            selectedRegion={selectedRegion}
            selectedHospital={selectedHospital}
            visibleMetrics={visibleMainMetrics}
          />
          
          {/* Sobreposição com botões de remover em modo de edição */}
          {isEditMode && (
            <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pointer-events-none">
              {mainMetrics.map((metric) => (
                <div key={metric.id} className="relative h-full">
                  <button 
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-50 pointer-events-auto"
                    onClick={() => removeMainMetric(metric.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Componente de Métricas Adicionais com botões de remover */}
      <div className={`
        relative mt-8 transition-all duration-500
        ${isEditMode ? 'shadow-2xl ring-4 ring-blue-400 dark:ring-blue-600 rounded-3xl overflow-hidden' : ''}
      `}>
        <div className="relative z-10">
          <div className="flex justify-between items-center mt-8 mb-8 bg-gray-900/40 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30 hover:bg-gray-800/40 transition-all duration-200">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-100 dark:to-blue-200 bg-clip-text text-transparent">
                Métricas do Hospital
              </h2>
              <p className="text-base text-gray-400">
                Clique para {expandedAdditionalMetrics ? 'ocultar' : 'visualizar'} todas as métricas
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className={`
                w-2 h-2 rounded-full
                ${expandedAdditionalMetrics ? 'bg-green-500' : 'bg-blue-500'}
                animate-pulse
              `} />
              
              <button 
                onClick={() => setExpandedAdditionalMetrics(!expandedAdditionalMetrics)}
                className="
                  flex items-center gap-2 px-4 py-2
                  bg-gray-800/40 hover:bg-gray-700/40
                  dark:bg-gray-800/40 dark:hover:bg-gray-700/40
                  rounded-xl transition-all duration-200
                  border border-gray-700/30
                "
              >
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                  {expandedAdditionalMetrics ? 'Ocultar' : 'Mostrar'} Métricas
                </span>
                <div className="w-5 h-5 rounded-full bg-gray-700/50 flex items-center justify-center">
                  {expandedAdditionalMetrics ? (
                    <ChevronUp className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {expandedAdditionalMetrics && (
            <div className="relative">
              <AdditionalHospitalMetrics 
                networkData={networkData}
                currentMetrics={currentMetrics}
                selectedHospital={selectedHospital}
                visibleMetrics={visibleAdditionalMetrics}
              />
              
              {/* Sobreposição com botões de remover em modo de edição */}
              {isEditMode && (
                <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pointer-events-none">
                  {additionalMetrics.map((metric) => (
                    <div key={metric.id} className="relative h-full">
                      <button 
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-50 pointer-events-auto"
                        onClick={() => removeAdditionalMetric(metric.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Botão flutuante para sair do modo de edição */}
      {isEditMode && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce">
          <Button
            onClick={onExitEditMode}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 shadow-lg flex items-center justify-center"
          >
            <X size={24} />
          </Button>
        </div>
      )}
    </div>
  );
};