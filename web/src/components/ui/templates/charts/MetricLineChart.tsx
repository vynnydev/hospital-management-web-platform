/* eslint-disable @typescript-eslint/no-unused-vars */
import { IChartDataPoint } from '@/types/custom-metrics';
import React from 'react';

interface MetricLineChartProps {
  data: IChartDataPoint[];
  color?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  height?: number;
}

export const MetricLineChart: React.FC<MetricLineChartProps> = ({
  data,
  color = 'purple',
  showGrid = true,
  showLabels = true,
  height = 200
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Sem dados disponíveis
      </div>
    );
  }

  // Encontrar valores mínimo e máximo para escala
  const values = data.map(d => d.value);
  const maxValue = Math.max(...values) * 1.1; // adicionar 10% para margem
  const minValue = Math.min(...values) * 0.9; // subtrair 10% para margem
  
  // Formatar datas para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate().toString().padStart(2, '0') + '/' + (date.getMonth() + 1).toString().padStart(2, '0');
  };
  
  // Calcular pontos para o caminho SVG
  const svgWidth = 100;
  const svgHeight = 50;
  const padding = 5;
  
  const getX = (index: number) => {
    const usableWidth = svgWidth - 2 * padding;
    return padding + (index / (data.length - 1)) * usableWidth;
  };
  
  const getY = (value: number) => {
    const usableHeight = svgHeight - 2 * padding;
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    return svgHeight - padding - (normalizedValue * usableHeight);
  };
  
  // Gerar o caminho SVG
  const pathD = data.map((point, index) => {
    const x = getX(index);
    const y = getY(point.value);
    return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');
  
  // Gerar linha de grade
  const gridLines = showGrid ? 
    Array.from({ length: 5 }).map((_, i) => {
      const y = padding + i * ((svgHeight - 2 * padding) / 4);
      return <line key={i} x1={padding} y1={y} x2={svgWidth - padding} y2={y} stroke="#374151" strokeWidth="0.5" />;
    }) : [];
  
  const colorMap: Record<string, string> = {
    'blue': '#3b82f6',
    'green': '#22c55e',
    'red': '#ef4444',
    'yellow': '#eab308',
    'purple': '#8b5cf6',
    'indigo': '#6366f1',
    'pink': '#ec4899',
    'orange': '#f97316',
    'teal': '#14b8a6',
    'cyan': '#06b6d4'
  };
  
  const strokeColor = colorMap[color] || colorMap.blue;
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
          {/* Linhas de grade */}
          {gridLines}
          
          {/* Linha do gráfico */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Área sob a curva */}
          <path
            d={`${pathD} L ${getX(data.length - 1)},${svgHeight - padding} L ${padding},${svgHeight - padding} Z`}
            fill={strokeColor}
            fillOpacity="0.1"
          />
          
          {/* Pontos de dados */}
          {data.map((point, index) => (
            <circle
              key={index}
              cx={getX(index)}
              cy={getY(point.value)}
              r="1.5"
              fill={strokeColor}
            />
          ))}
        </svg>
      </div>
      
      {showLabels && (
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>7 dias atrás</span>
          <span>Hoje</span>
        </div>
      )}
    </div>
  );
};