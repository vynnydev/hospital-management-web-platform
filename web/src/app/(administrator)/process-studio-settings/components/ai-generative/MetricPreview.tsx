import React from 'react';

interface MetricPreviewProps {
  value: string;
  trend?: number;
  title?: string;
  subtitle?: string;
}

export const MetricPreview: React.FC<MetricPreviewProps> = ({ 
  value, 
  trend,
  title = "Taxa de Ocupação",
  subtitle = "Ocupação atual dos leitos"
}) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="border rounded-lg p-3 bg-white dark:bg-gray-800">
      <h4 className="text-sm font-medium">{title}</h4>
      <div className="text-2xl font-bold mt-2">{value}</div>
      <div className="h-2 bg-gray-200 rounded-full mt-2">
        <div 
          className="h-2 bg-amber-500 rounded-full" 
          style={{width: `${typeof value === 'string' && value.includes('%') 
            ? parseFloat(value) 
            : 80}%`}}
        ></div>
      </div>
    </div>
    
    <div className="border rounded-lg p-3 bg-white dark:bg-gray-800">
      <h4 className="text-sm font-medium">{subtitle}</h4>
      <div className="text-2xl font-bold mt-2">4.2 dias</div>
      {trend !== undefined && (
        <div className="text-xs text-gray-500 mt-1">
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)} vs semana anterior
        </div>
      )}
    </div>
  </div>
);