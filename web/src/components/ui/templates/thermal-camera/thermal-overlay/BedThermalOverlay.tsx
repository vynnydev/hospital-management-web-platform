/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Thermometer } from 'lucide-react';
import { IBed } from '@/types/hospital-network-types';
import { useThermalCameraData } from '@/hooks/thermal-cameras/useThermalCameraData';

interface BedThermalOverlayProps {
  bed: IBed;
  isVisible: boolean;
  colorMode: 'rainbow' | 'heat' | 'cool';
  opacity: number;
}

export const BedThermalOverlay: React.FC<BedThermalOverlayProps> = ({
  bed,
  isVisible,
  colorMode,
  opacity
}) => {
  const { getCameraForBed, getLatestReading } = useThermalCameraData();
  
  if (!isVisible) return null;
  
  const camera = getCameraForBed(bed.id);
  if (!camera) return null;
  
  const latestReading = getLatestReading(camera.id);
  if (!latestReading) return null;
  
  // Determinar cor baseada na temperatura
  const getTemperatureColor = () => {
    const temp = latestReading.thermalData.averageTemperature;
    
    switch(colorMode) {
      case 'rainbow':
        if (temp >= 38.0) return 'from-red-600 to-red-400';
        if (temp >= 37.5) return 'from-orange-600 to-orange-400';
        if (temp >= 37.0) return 'from-yellow-600 to-yellow-400';
        if (temp >= 36.5) return 'from-green-600 to-green-400';
        if (temp >= 36.0) return 'from-cyan-600 to-cyan-400';
        return 'from-blue-600 to-blue-400';
        
      case 'heat':
        if (temp >= 38.0) return 'from-red-600 to-red-400';
        if (temp >= 37.5) return 'from-red-500 to-orange-400';
        if (temp >= 37.0) return 'from-orange-500 to-yellow-400';
        if (temp >= 36.5) return 'from-yellow-500 to-yellow-300';
        if (temp >= 36.0) return 'from-yellow-400 to-yellow-200';
        return 'from-yellow-300 to-green-200';
        
      case 'cool':
        if (temp >= 38.0) return 'from-purple-600 to-purple-400';
        if (temp >= 37.5) return 'from-indigo-600 to-indigo-400';
        if (temp >= 37.0) return 'from-blue-600 to-blue-400';
        if (temp >= 36.5) return 'from-cyan-600 to-cyan-400';
        if (temp >= 36.0) return 'from-teal-600 to-teal-400';
        return 'from-green-600 to-green-400';
        
      default:
        return 'from-blue-600 to-blue-400';
    }
  };
  
  // Função para calcular a intensidade da sobreposição
  const getOverlayIntensity = () => {
    // Ajusta a opacidade com base na movimentação detectada
    const baseOpacity = opacity / 100;
    const movementFactor = latestReading.occupancyData.movementDetected ? 1.2 : 0.8;
    return Math.min(baseOpacity * movementFactor, 0.9);
  };
  
  // Função para gerar uma matriz visual do calor (simplificada)
  const generateHeatMatrix = () => {
    // Em uma implementação real, isso usaria os dados reais da matriz de temperatura
    // da câmera térmica (temperatureMatrix). Aqui estamos simplificando.
    
    const averageTemp = latestReading.thermalData.averageTemperature;
    const maxTemp = latestReading.thermalData.maxTemperature;
    
    // Determinar classe de cor baseada na temperatura média
    const colorClass = getTemperatureColor();
    const intensity = getOverlayIntensity();
    
    return (
      <div 
        className={`absolute inset-0 rounded-lg bg-gradient-to-br ${colorClass}`}
        style={{ opacity: intensity }}
      >
        {/* Pontos mais quentes (hotspots) */}
        {latestReading.thermalData.temperatureMatrix.map((row, y) =>
          row.map((temp, x) => {
            // Consider a point as a hotspot if it's significantly above average
            const isHotspot = temp > latestReading.thermalData.averageTemperature + 1.5;
            return isHotspot ? (
              <div
                key={`${x}-${y}`}
                className="absolute w-6 h-6 rounded-full bg-white/30 animate-pulse"
                style={{
                  left: `${(x / 32) * 100}%`,
                  top: `${(y / 24) * 100}%`
                }}
              />
            ) : null;
          })
        )}
        
        {/* Badge de temperatura */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center">
          <Thermometer className="h-3 w-3 mr-1 text-red-400" />
          {averageTemp.toFixed(1)}°C
        </div>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {generateHeatMatrix()}
    </div>
  );
};