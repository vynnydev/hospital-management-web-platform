import React, { useState } from 'react';
import { 
  Activity, 
  BarChart, 
  Edit, 
  Trash2, 
  MoreVertical, 
  TrendingUp, 
  TrendingDown, 
  Move,
  GripVertical
} from 'lucide-react';
import { Card } from '@/components/ui/organisms/card';
import { IMetric } from '@/types/custom-metrics';
import { Button } from '@/components/ui/organisms/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/organisms/dropdown-menu';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface AdditionalMetricsSectionProps {
  metrics: IMetric[];
  isEditing: boolean;
  onEditMetric: (metricId: string) => void;
  onRemoveMetric: (metricId: string) => void;
}

// Tipo de item para Drag-and-Drop
interface IDragItem {
  id: string;
  index: number;
  type: string;
}

// Componente para um card de métrica
const MetricCard: React.FC<{
  metric: IMetric;
  index: number;
  isEditing: boolean;
  onEditMetric: (metricId: string) => void;
  onRemoveMetric: (metricId: string) => void;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}> = ({ metric, index, isEditing, onEditMetric, onRemoveMetric, moveCard }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const IconComponent = metric.icon || Activity;
  const trendColor = metric.trend 
    ? metric.trend > 0 
      ? 'text-green-500' 
      : 'text-red-500' 
    : 'text-gray-400';
  
  // Configuração de Drag-and-Drop
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: 'metric-card',
    item: () => ({ id: metric.id, index, type: 'metric-card' }),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => isEditing,
  });
  
  const [, drop] = useDrop({
    accept: 'metric-card',
    hover(item: IDragItem, monitor) {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Não substituir itens por eles mesmos
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Mover o card
      moveCard(dragIndex, hoverIndex);
      
      // Atualizar o índice para o próximo hover
      item.index = hoverIndex;
    },
  });
  
  // Aplicar os refs para tornar o componente arrastável
  drag(drop(ref));

  return (
    <div
      ref={dragPreview}
      className={`${isDragging ? 'opacity-30' : 'opacity-100'} transition-opacity duration-200`}
    >
      <Card className="bg-gray-900 border-gray-700 shadow-md overflow-hidden h-40">
        <div className="flex items-center justify-between p-3 border-b border-gray-800">
          <div className="flex items-center">
            <div className={`rounded-full p-1.5 mr-2 bg-${metric.color}-500/20`}>
              <IconComponent className={`h-4 w-4 text-${metric.color}-500`} />
            </div>
            <h3 className="font-medium text-white text-sm truncate">
              {metric.title}
            </h3>
          </div>
          
          <div className="flex items-center">
            {metric.trend !== undefined && (
              <div className={`flex items-center mr-2 text-xs ${trendColor}`}>
                {metric.trend > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-0.5" />
                )}
                {Math.abs(metric.trend).toFixed(1)}%
              </div>
            )}
            
            {isEditing ? (
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                  onClick={() => onEditMetric(metric.id)}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-gray-800"
                  onClick={() => onRemoveMetric(metric.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <div ref={ref} className="cursor-move">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 text-gray-400 hover:text-blue-500 hover:bg-gray-800"
                  >
                    <GripVertical className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                  <DropdownMenuItem className="text-sm hover:bg-gray-700">
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-sm hover:bg-gray-700">
                    Exportar Dados
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-sm hover:bg-gray-700">
                    Configurar Alertas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        <div className="p-4 flex flex-col justify-center h-[calc(100%-40px)]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-white">
                {metric.value}
              </div>
              <div className="text-sm text-gray-400">
                {metric.subtitle}
              </div>
            </div>
            
            {metric.additionalInfo && (
              <div className="text-right">
                <div className="text-xs text-gray-400">
                  {metric.additionalInfo.label}
                </div>
                <div className="text-sm text-gray-300 font-medium">
                  {metric.additionalInfo.value}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export const AdditionalMetricsSection: React.FC<AdditionalMetricsSectionProps> = ({
  metrics,
  isEditing,
  onEditMetric,
  onRemoveMetric
}) => {
  const [cards, setCards] = useState(metrics);
  
  // Atualizar cards quando as métricas mudarem
  React.useEffect(() => {
    setCards(metrics);
  }, [metrics]);
  
  // Função para mover cards (drag and drop)
  const moveCard = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setCards(prevCards => {
        const newCards = [...prevCards];
        // Remover o elemento arrastado
        const draggedCard = newCards[dragIndex];
        // Remover do array
        newCards.splice(dragIndex, 1);
        // Inserir na nova posição
        newCards.splice(hoverIndex, 0, draggedCard);
        return newCards;
      });
    },
    [],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((metric, index) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            index={index}
            isEditing={isEditing}
            onEditMetric={onEditMetric}
            onRemoveMetric={onRemoveMetric}
            moveCard={moveCard}
          />
        ))}
        
        {cards.length === 0 && (
          <div className="col-span-full p-8 text-center bg-gray-900 border border-gray-800 rounded-lg">
            <div className="flex flex-col items-center justify-center">
              <BarChart className="h-12 w-12 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhuma métrica adicional</h3>
              <p className="text-gray-400 max-w-md">
                Adicione métricas ao seu dashboard para visualizar dados importantes da operação hospitalar.
              </p>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};