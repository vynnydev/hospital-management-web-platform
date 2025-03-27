import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface MetricPreviewProps {
  value: string;
  trend?: number;
  title?: string;
  subtitle?: string;
}

export const MetricPreview: React.FC<MetricPreviewProps> = ({ 
  value, 
  trend = -0.3,
  title = "Taxa de Ocupação",
  subtitle = "Ocupação atual dos leitos"
}) => {
  const secondValue = "4.2 dias";
  const secondSubtitle = "Tempo médio de permanência";
  
  // Função para determinar as cores com base no valor
  const getColorsByValue = (val: string) => {
    let percentage = 0;
    
    if (typeof val === 'string' && val.includes('%')) {
      percentage = parseFloat(val);
    } else if (typeof val === 'string' && !isNaN(parseFloat(val))) {
      percentage = parseFloat(val);
    }
    
    if (percentage > 85) {
      return {
        barColor: 'bg-red-500',
        textColor: 'text-red-400'
      };
    } else if (percentage > 70) {
      return {
        barColor: 'bg-amber-500',
        textColor: 'text-amber-400'
      };
    } else {
      return {
        barColor: 'bg-green-500',
        textColor: 'text-green-400'
      };
    }
  };
  
  const colors = getColorsByValue(value);
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border rounded-lg p-3 bg-gray-800 border-gray-700">
        <h4 className="text-sm font-medium text-gray-300">{title}</h4>
        <div className="text-2xl font-bold mt-2 text-white flex items-center gap-2">
          {value}
          {trend !== 0 && (
            <span className={`text-sm ${trend > 0 ? 'text-red-400' : 'text-green-400'} flex items-center`}>
              {trend > 0 ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              {Math.abs(trend).toFixed(1)}%
            </span>
          )}
        </div>
        <div className="h-2 bg-gray-700 rounded-full mt-2">
          <div 
            className={`h-2 ${colors.barColor} rounded-full`}
            style={{
              width: `${typeof value === 'string' && value.includes('%') 
                ? parseFloat(value) 
                : typeof value === 'number' ? value : 80}%`
            }}
          ></div>
        </div>
        <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
      </div>
      
      <div className="border rounded-lg p-3 bg-gray-800 border-gray-700">
        <h4 className="text-sm font-medium text-gray-300">{secondSubtitle}</h4>
        <div className="text-2xl font-bold mt-2 text-white">{secondValue}</div>
        <div className="text-xs flex items-center mt-3">
          <div className="flex space-x-1">
            <div className="w-2 h-8 bg-gray-700 rounded-sm relative">
              <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-sm" style={{height: '60%'}}></div>
            </div>
            <div className="w-2 h-8 bg-gray-700 rounded-sm relative">
              <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-sm" style={{height: '40%'}}></div>
            </div>
            <div className="w-2 h-8 bg-gray-700 rounded-sm relative">
              <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-sm" style={{height: '80%'}}></div>
            </div>
            <div className="w-2 h-8 bg-gray-700 rounded-sm relative">
              <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-sm" style={{height: '50%'}}></div>
            </div>
            <div className="w-2 h-8 bg-gray-700 rounded-sm relative">
              <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-sm" style={{height: '70%'}}></div>
            </div>
          </div>
          <div className="flex-1 ml-2">
            <div className="text-xs text-gray-400">Tendência semanal</div>
          </div>
        </div>
      </div>
    </div>
  );
};