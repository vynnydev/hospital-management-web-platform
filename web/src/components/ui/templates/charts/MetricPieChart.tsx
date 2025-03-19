import React from 'react';

interface PieChartDataPoint {
  label: string;
  value: number;
}

interface MetricPieChartProps {
  data: PieChartDataPoint[];
  showLegend?: boolean;
  colors?: string[];
}

export const MetricPieChart: React.FC<MetricPieChartProps> = ({
  data,
  showLegend = true,
  colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f97316']
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Sem dados disponíveis
      </div>
    );
  }

  // Calcular o total para as porcentagens
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calcular os ângulos para as fatias do gráfico
  let startAngle = 0;
  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    
    const slice = {
      startAngle,
      endAngle: startAngle + angle,
      percentage,
      color: colors[index % colors.length],
      label: item.label,
      value: item.value
    };
    
    startAngle += angle;
    return slice;
  });
  
  // Função para converter ângulo em coordenadas
  const getCoordinates = (angle: number, radius: number) => {
    const radians = (angle - 90) * (Math.PI / 180);
    return {
      x: 50 + radius * Math.cos(radians),
      y: 50 + radius * Math.sin(radians)
    };
  };
  
  // Criar os caminhos SVG para cada fatia
  const createSlicePath = (slice: typeof slices[0]) => {
    const startCoord = getCoordinates(slice.startAngle, 40);
    const endCoord = getCoordinates(slice.endAngle, 40);
    
    // Determinar se o arco deve ser longo ou curto
    const largeArcFlag = slice.endAngle - slice.startAngle <= 180 ? 0 : 1;
    
    // Criar o caminho SVG
    return `M 50,50 L ${startCoord.x},${startCoord.y} A 40,40 0 ${largeArcFlag},1 ${endCoord.x},${endCoord.y} Z`;
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex justify-center items-center">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="max-h-32">
          {slices.map((slice, index) => (
            <path
              key={index}
              d={createSlicePath(slice)}
              fill={slice.color}
              stroke="#1f2937"
              strokeWidth="1"
              className="transition-all duration-300 hover:opacity-90"
            />
          ))}
          {/* Círculo central opcional para gráfico de rosca */}
          {/* <circle cx="50" cy="50" r="20" fill="#1f2937" /> */}
        </svg>
      </div>
      
      {showLegend && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center text-xs">
              <div 
                className="w-3 h-3 rounded-full mr-1 flex-shrink-0" 
                style={{ backgroundColor: slice.color }}
              ></div>
              <div className="truncate text-gray-300">{slice.label}</div>
              <div className="ml-auto text-gray-400">{slice.percentage.toFixed(0)}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};