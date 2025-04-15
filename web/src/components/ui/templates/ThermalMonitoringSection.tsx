/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/ui/organisms/beds-management/ThermalMonitoringSection.tsx
import React from 'react';
import { 
  Thermometer, 
  Activity, 
  AlertTriangle,
  Clock,
  Droplets,
  BarChart3,
  Heart
} from 'lucide-react';
import { Badge } from '@/components/ui/organisms/badge';
import { Button } from '@/components/ui/organisms/button';
import { useThermalCameraData } from '@/hooks/thermal-cameras/useThermalCameraData';
import type { IBed } from '@/types/hospital-network-types';

interface ThermalMonitoringSectionProps {
  selectedBed: IBed | null;
}

export const ThermalMonitoringSection: React.FC<ThermalMonitoringSectionProps> = ({ 
  selectedBed
}) => {
  const { 
    getCameraForBed, 
    fetchCameraReadings, 
    getLatestReading, 
    cameraReadings 
  } = useThermalCameraData();
  
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const bedCamera = selectedBed ? getCameraForBed(selectedBed.id) : null;
  const cameraId = bedCamera?.id;
  const latestReading = cameraId ? getLatestReading(cameraId) : null;
  
  // Carregar leituras recentes quando expandir o painel
  React.useEffect(() => {
    if (isExpanded && cameraId && !cameraReadings[cameraId]) {
      setIsLoading(true);
      fetchCameraReadings(cameraId, 5)
        .finally(() => setIsLoading(false));
    }
  }, [isExpanded, cameraId, cameraReadings, fetchCameraReadings]);
  
  if (!selectedBed || !bedCamera) return null;
  
  // Determinar cor da temperatura
  const getTempColor = (temp: number) => {
    if (temp >= 38.0) return 'text-red-500';
    if (temp >= 37.5) return 'text-amber-500';
    if (temp >= 36.0) return 'text-green-500';
    return 'text-blue-500';
  };
  
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-xl" />
      <div className="bg-gray-800/90 border-0 relative p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-blue-400" />
            <span className="text-lg font-semibold text-white">Monitoramento Térmico</span>
          </div>
          {bedCamera.status === 'active' ? (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Câmera Ativa
            </Badge>
          ) : (
            <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
              Câmera {bedCamera.status === 'maintenance' ? 'Em Manutenção' : 'Inativa'}
            </Badge>
          )}
        </div>
        
        {bedCamera.status === 'active' ? (
          <>
            {latestReading ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-700/30 p-3 rounded-lg">
                    <div className="flex items-center text-xs text-gray-400 mb-1">
                      <Thermometer className="h-3 w-3 mr-1 text-red-400" />
                      Temperatura
                    </div>
                    <div className={`font-semibold text-xl ${getTempColor(latestReading.thermalData.averageTemperature)}`}>
                      {latestReading.thermalData.averageTemperature.toFixed(1)} °C
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Atualizado {new Date(latestReading.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/30 p-3 rounded-lg">
                    <div className="flex items-center text-xs text-gray-400 mb-1">
                      <Activity className="h-3 w-3 mr-1 text-blue-400" />
                      Status de Ocupação
                    </div>
                    <div className="font-medium text-white">
                      {latestReading.occupancyData.occupied ? (
                        <span className="text-green-400 flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-400 mr-1"></span>
                          Ocupado
                        </span>
                      ) : (
                        <span className="text-gray-400 flex items-center">
                          <span className="h-2 w-2 rounded-full bg-gray-400 mr-1"></span>
                          Não detectado
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {latestReading.occupancyData.movementDetected ? 'Movimento detectado' : 'Sem movimento'}
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="space-y-3 mt-2">
                    {latestReading.occupancyData.estimatedHeartRate && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-700/30 p-3 rounded-lg">
                          <div className="flex items-center text-xs text-gray-400 mb-1">
                            <Heart className="h-3 w-3 mr-1 text-red-400" />
                            Batimentos Est.
                          </div>
                          <div className="font-medium text-white">
                            {latestReading.occupancyData.estimatedHeartRate} bpm
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Detectado por movimento térmico</div>
                        </div>
                        
                        <div className="bg-gray-700/30 p-3 rounded-lg">
                          <div className="flex items-center text-xs text-gray-400 mb-1">
                            <Droplets className="h-3 w-3 mr-1 text-blue-400" />
                            Respiração Est.
                          </div>
                          <div className="font-medium text-white">
                            {latestReading.occupancyData.estimatedRespirationRate} resp/min
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Precisão estimada: 85%</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Alertas */}
                    {(latestReading.alerts.highTemperature || 
                      latestReading.alerts.lowTemperature || 
                      latestReading.alerts.noMovement || 
                      latestReading.alerts.abnormalVitalSigns) && (
                      <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30">
                        <div className="flex items-center text-xs text-red-400 mb-2">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Alertas Detectados:
                        </div>
                        <div className="space-y-1 text-sm">
                          {latestReading.alerts.highTemperature && (
                            <div className="text-red-300">• Temperatura elevada detectada</div>
                          )}
                          {latestReading.alerts.lowTemperature && (
                            <div className="text-blue-300">• Temperatura abaixo do normal</div>
                          )}
                          {latestReading.alerts.noMovement && (
                            <div className="text-amber-300">• Sem movimento por período prolongado</div>
                          )}
                          {latestReading.alerts.abnormalVitalSigns && (
                            <div className="text-purple-300">• Sinais vitais anormais</div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                      <div className="flex items-center text-xs text-gray-400 mb-2">
                        <BarChart3 className="h-3 w-3 mr-1 text-blue-400" />
                        Histórico de Temperatura (últimas 24h)
                      </div>
                      <div className="h-24 flex items-end gap-1">
                        {/* Simulação de gráfico de barras */}
                        {Array.from({ length: 12 }).map((_, i) => {
                          const height = 40 + Math.random() * 60;
                          const isHighlighted = i === 9 || i === 10;
                          return (
                            <div 
                              key={i} 
                              className={`w-full ${isHighlighted ? 'bg-red-500' : 'bg-blue-500'}`}
                              style={{ height: `${height}%` }}
                            ></div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>-24h</span>
                        <span>-12h</span>
                        <span>Agora</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-700/50"
                >
                  {isExpanded ? 'Menos detalhes' : 'Mais detalhes'}
                </Button>
              </div>
            ) : (
              <div className="bg-gray-700/30 p-4 rounded-lg text-center">
                <Thermometer className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-300">Nenhuma leitura disponível</p>
                <p className="text-xs text-gray-500 mt-1">
                  A câmera está configurada, mas ainda não enviou dados.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-700/30 p-4 rounded-lg text-center">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-gray-300">Câmera {bedCamera.status === 'maintenance' ? 'em manutenção' : 'inativa'}</p>
            <p className="text-xs text-gray-500 mt-1">
              O monitoramento em tempo real não está disponível no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};