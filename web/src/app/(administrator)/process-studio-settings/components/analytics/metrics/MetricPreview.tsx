import React from 'react';
import { 
  Activity, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import { Card } from '@/components/ui/organisms/card';
import { MetricFormState } from './MetricEditor';

// Componente para renderizar um gráfico de gauge
const GaugeChart = ({ value, min, max, target, warning, critical, unit, invertedScale = false }: {
  value: number;
  min: number;
  max: number;
  target: number;
  warning: number;
  critical: number;
  unit: string;
  invertedScale?: boolean;
}) => {
  // Calcular o percentual para o ponteiro do gauge
  const valuePercent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
  // Determinar a cor com base nos limiares
  const getColor = (value: number) => {
    if (invertedScale) {
      if (value <= target) return '#22c55e'; // green
      if (value <= warning) return '#eab308'; // yellow
      return '#ef4444'; // red
    } else {
      if (value >= critical) return '#ef4444'; // red
      if (value >= warning) return '#eab308'; // yellow
      return '#22c55e'; // green
    }
  };
  
  const color = getColor(value);

  // Calcular posições dos marcadores de limiar no arco
  const targetPercent = ((target - min) / (max - min)) * 100;
  const warningPercent = ((warning - min) / (max - min)) * 100;
  const criticalPercent = ((critical - min) / (max - min)) * 100;
  
  // Converter percentual para ângulo (180 graus é o arco completo)
  const valueAngle = (valuePercent / 100) * 180;
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-48 h-24 flex justify-center">
        {/* Fundo do gauge */}
        <div className="absolute w-full h-full rounded-t-full overflow-hidden border-t-2 border-l-2 border-r-2 border-gray-600">
          <div className="absolute w-full h-full bg-gray-700"></div>
        </div>
        
        {/* Arco colorido */}
        <svg className="absolute w-full h-full">
          <path 
            d={`M 0,24 A 24,24 0 0,1 48,24`} 
            fill="none" 
            stroke={color} 
            strokeWidth="4"
            style={{ 
              transform: 'scale(2)', 
              transformOrigin: 'center bottom', 
              strokeDasharray: '75.4', 
              strokeDashoffset: `${75.4 - (75.4 * valuePercent / 100)}` 
            }}
          />
        </svg>
        
        {/* Indicadores de limiar */}
        <div 
          className="absolute h-1.5 w-1.5 bg-green-500 rounded-full z-10"
          style={{ 
            transform: `rotate(${targetPercent * 1.8}deg) translateY(-47px)`,
            transformOrigin: 'center bottom'
          }}
        />
        <div 
          className="absolute h-1.5 w-1.5 bg-yellow-500 rounded-full z-10"
          style={{ 
            transform: `rotate(${warningPercent * 1.8}deg) translateY(-47px)`,
            transformOrigin: 'center bottom'
          }}
        />
        <div 
          className="absolute h-1.5 w-1.5 bg-red-500 rounded-full z-10"
          style={{ 
            transform: `rotate(${criticalPercent * 1.8}deg) translateY(-47px)`,
            transformOrigin: 'center bottom'
          }}
        />
        
        {/* Ponteiro */}
        <div 
          className="absolute bottom-0 w-0.5 h-24 bg-white z-20 origin-bottom transform"
          style={{ transform: `rotate(${valueAngle}deg)` }}
        >
          <div className="w-2 h-2 rounded-full bg-white absolute -left-0.75 top-0"></div>
        </div>
        
        {/* Centro do gauge */}
        <div className="absolute bottom-0 w-4 h-4 rounded-full bg-gray-800 border-2 border-gray-600 z-10"></div>
      </div>
      
      {/* Valor e rótulos */}
      <div className="text-2xl font-bold text-white mt-4 flex items-center gap-2">
        {value}
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
      
      <div className="flex justify-between w-full text-xs text-gray-400 mt-2">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

// Componente para renderizar um cartão com valor
const ValueCard = ({ value, title, icon, color, unit, trend }: {
  value: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  unit: string;
  trend?: 'up' | 'down' | null;
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded ${color} bg-opacity-20`}>
          {icon}
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend === 'up' 
              ? <TrendingUp className="h-3.5 w-3.5" /> 
              : <TrendingDown className="h-3.5 w-3.5" />
            }
            <span>10%</span>
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <h3 className="text-sm text-gray-400">{title}</h3>
        <div className="text-2xl font-bold text-white flex items-baseline gap-1">
          {value}
          <span className="text-sm text-gray-400">{unit}</span>
        </div>
      </div>
    </div>
  );
};

// Componente gráfico de linha básico
const SimpleLineChart = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm text-gray-400">Últimos 7 dias</h3>
      </div>
      
      <div className="flex-1 flex items-end">
        <div className="h-full w-full flex items-end space-x-2">
          {[65, 73, 68, 74, 85, 78, 81].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-600 rounded-t-sm"
                style={{ height: `${value}%` }}
              ></div>
              <div className="text-xs text-gray-500 mt-1">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente gráfico de barras básico
const SimpleBarChart = () => {
  const data = [
    { label: 'UTI', value: 92 },
    { label: 'Enfer.', value: 78 },
    { label: 'Cirurg.', value: 65 },
    { label: 'Pedia.', value: 43 }
  ];
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-end space-x-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-green-600 rounded-t-sm"
              style={{ height: `${item.value}%` }}
            ></div>
            <div className="text-xs text-gray-500 mt-1 truncate w-full text-center">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente gráfico de pizza simples
const SimplePieChart = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <svg width="150" height="150" viewBox="0 0 20 20">
        <circle r="10" cx="10" cy="10" fill="#3b82f6" />
        <circle r="5" cx="10" cy="10" fill="#6366f1" />
        <path
          d="M10,0 A10,10 0 0,1 20,10 L10,10 Z"
          fill="#22c55e"
        />
        <path
          d="M10,0 A10,10 0 0,0 0,10 L10,10 Z"
          fill="#f97316"
        />
      </svg>
    </div>
  );
};

// Props para o componente MetricPreview
interface MetricPreviewProps {
  formState: MetricFormState;
}

export const MetricPreview: React.FC<MetricPreviewProps> = ({ formState }) => {
  // Dados mockados para a prévia
  const mockValue = formState.unit === '%' ? 78 : 254;
  
  // Obter o ícone correto
  const getIconComponent = () => {
    const color = formState.iconColor || 'text-blue-500';
    
    // Mapear o ícone com base na categoria
    const icons = {
      'operational': <Activity className={`h-5 w-5 ${color}`} />,
      'financial': <CreditCard className={`h-5 w-5 ${color}`} />,
      'clinical': <AlertCircle className={`h-5 w-5 ${color}`} />,
      'satisfaction': <AlertTriangle className={`h-5 w-5 ${color}`} />,
      'hr': <Activity className={`h-5 w-5 ${color}`} />
    };
    
    return icons[formState.category as keyof typeof icons] || <Activity className={`h-5 w-5 ${color}`} />;
  };
  
  // Renderizar o tipo de gráfico apropriado
  const renderChartType = () => {
    switch (formState.chartType) {
      case 'gauge':
        return (
          <GaugeChart 
            value={mockValue}
            min={0}
            max={formState.unit === '%' ? 100 : 500}
            target={formState.thresholds.target}
            warning={formState.thresholds.warning}
            critical={formState.thresholds.critical}
            unit={formState.unit}
          />
        );
      case 'line':
        return <SimpleLineChart />;
      case 'bar':
        return <SimpleBarChart />;
      case 'pie':
        return <SimplePieChart />;
      case 'card':
        return (
          <ValueCard 
            value={mockValue}
            title={formState.name}
            icon={getIconComponent()}
            color={formState.iconColor.replace('text-', 'bg-')}
            unit={formState.unit}
            trend="up"
          />
        );
      default:
        return <div className="text-gray-400">Tipo de visualização não suportado</div>;
    }
  };
  
  return (
    <Card className="border border-gray-700 bg-gray-900 p-4 h-80">
      <div className="h-full">
        {renderChartType()}
      </div>
    </Card>
  );
};