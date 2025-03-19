/* eslint-disable @typescript-eslint/no-unused-vars */
import { IThresholdConfig } from '@/types/custom-metrics';
import React from 'react';

interface MetricGaugeChartProps {
  value: number;
  config?: IThresholdConfig;
  min?: number;
  max?: number;
  unit?: string;
  invertedScale?: boolean;
}

export const MetricGaugeChart: React.FC<MetricGaugeChartProps> = ({
  value,
  config = { target: 85, warning: 90, critical: 95 },
  min = 0,
  max = 100,
  unit = '%',
  invertedScale = false
}) => {
  // Calcular o percentual para o ponteiro do gauge
  const valuePercent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
  // Determinar a cor com base nos limiares
  const getColor = (value: number) => {
    if (invertedScale) {
      if (value <= config.target) return '#22c55e'; // green
      if (value <= config.warning) return '#eab308'; // yellow
      return '#ef4444'; // red
    } else {
      if (value >= config.critical) return '#ef4444'; // red
      if (value >= config.warning) return '#eab308'; // yellow
      return '#22c55e'; // green
    }
  };
  
  const color = getColor(value);

  // Calcular posições dos marcadores de limiar no arco
  const targetPercent = ((config.target - min) / (max - min)) * 100;
  const warningPercent = ((config.warning - min) / (max - min)) * 100;
  const criticalPercent = ((config.critical - min) / (max - min)) * 100;
  
  // Converter percentual para ângulo (180 graus é o arco completo)
  const valueAngle = (valuePercent / 100) * 180;
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-48 h-24 flex justify-center">
        {/* Fundo do gauge */}
        <div className="absolute w-full h-full overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 100 50">
            <path
              d="M 10,50 A 40,40 0 0,1 90,50"
              fill="none"
              stroke="#374151"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        {/* Arco colorido */}
        <div className="absolute w-full h-full overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 100 50">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset={`${targetPercent}%`} stopColor="#22c55e" />
                <stop offset={`${warningPercent}%`} stopColor="#eab308" />
                <stop offset={`${criticalPercent}%`} stopColor="#ef4444" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <path
              d="M 10,50 A 40,40 0 0,1 90,50"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="125.6"
              strokeDashoffset={125.6 - (valuePercent * 125.6 / 100)}
            />
          </svg>
        </div>
        
        {/* Ponteiro */}
        <div
          className="absolute bottom-0 left-1/2 w-1 h-20 bg-white origin-bottom -translate-x-1/2"
          style={{ transform: `translateX(-50%) rotate(${valueAngle - 90}deg)` }}
        >
          <div className="w-3 h-3 rounded-full bg-white absolute -left-1 top-0"></div>
        </div>
        
        {/* Centro do gauge */}
        <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-gray-800 border-2 border-gray-600 rounded-full -translate-x-1/2"></div>
        
        {/* Marcador target */}
        <div
          className="absolute h-2 w-1 bg-green-500 z-10"
          style={{ 
            left: '50%',
            bottom: '0px',
            transform: `translateX(-50%) rotate(${targetPercent * 1.8 - 90}deg)`,
            transformOrigin: 'bottom center'
          }}
        />
        
        {/* Marcador warning */}
        <div
          className="absolute h-2 w-1 bg-yellow-500 z-10"
          style={{ 
            left: '50%',
            bottom: '0px',
            transform: `translateX(-50%) rotate(${warningPercent * 1.8 - 90}deg)`,
            transformOrigin: 'bottom center'
          }}
        />
        
        {/* Marcador crítico */}
        <div
          className="absolute h-2 w-1 bg-red-500 z-10"
          style={{ 
            left: '50%',
            bottom: '0px',
            transform: `translateX(-50%) rotate(${criticalPercent * 1.8 - 90}deg)`,
            transformOrigin: 'bottom center'
          }}
        />
      </div>
      
      {/* Valor e rótulos */}
      <div className="text-2xl font-bold text-white mt-4 flex items-center gap-2">
        {value.toFixed(1)}
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
      
      <div className="flex justify-between w-full text-xs text-gray-400 mt-2">
        <span>{min}{unit}</span>
        <span>Meta: {config.target}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};