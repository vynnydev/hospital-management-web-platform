import { IChartDataPoint } from '@/types/custom-metrics';
import React from 'react';

interface MetricBarChartProps {
  data: IChartDataPoint[];
  color?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  horizontal?: boolean;
}

export const MetricBarChart: React.FC<MetricBarChartProps> = ({
  data,
  color = 'blue',
  showGrid = true,
  showLabels = true,
  horizontal = true
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Sem dados disponíveis
      </div>
    );
  }

  // Colormap para converter string de cor em classe Tailwind
  const colorMap: Record<string, string> = {
    'blue': 'bg-blue-500',
    'green': 'bg-green-500',
    'red': 'bg-red-500',
    'yellow': 'bg-yellow-500',
    'purple': 'bg-purple-500',
    'indigo': 'bg-indigo-500',
    'pink': 'bg-pink-500',
    'orange': 'bg-orange-500',
    'teal': 'bg-teal-500',
    'cyan': 'bg-cyan-500'
  };
  
  const barColor = colorMap[color] || colorMap.blue;
  
  // Encontrar valor máximo
  const maxValue = Math.max(...data.map(d => d.value));
  
  if (horizontal) {
    return (
      <div className="h-full flex flex-col justify-center space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-16 text-xs text-gray-400 truncate">
              {item.label}
            </div>
            <div className="flex-1 h-5 bg-gray-800 rounded-sm overflow-hidden relative">
              <div 
                className={`h-full ${barColor} transition-all duration-500`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
              {showGrid && (
                <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-full border-l border-gray-700 first:border-l-0"></div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-10 text-xs text-right text-gray-400">
              {item.value}%
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-end gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="relative w-full">
                <div 
                  className={`w-full ${barColor} rounded-t-sm transition-all duration-500`}
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                ></div>
                {showGrid && (
                  <div className="absolute inset-x-0 bottom-0 top-0 grid grid-rows-4 pointer-events-none">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-full border-t border-gray-700 first:border-t-0"></div>
                    ))}
                  </div>
                )}
              </div>
              {showLabels && (
                <div className="text-xs text-gray-400 mt-2 truncate w-full text-center">
                  {item.label}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
};