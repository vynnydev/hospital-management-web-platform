// src/components/workflow/WorkflowCanvas/index.tsx
import React from 'react';
import { IWorkflowCanvasProps } from '@/types/workflow/customize-process-by-workflow-types';
import { Card } from '@/components/ui/organisms/card';
import { Plus, Settings, X } from 'lucide-react';

export const WorkflowCanvas: React.FC<IWorkflowCanvasProps> = ({
  workflow,
  onNodeDrag,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onNodeEdit,
  onNodeDelete,
  onAddSubNode,
  onNodeConfig
}) => {
  const renderConnections = () => {
    return (
      <svg 
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ 
          overflow: 'visible',
          zIndex: 0  // Garante que as linhas fiquem atrás dos cards
        }}
      >
        {workflow
          .filter(node => node.parentId)
          .map(childNode => {
            const parentNode = workflow.find(node => node.id === childNode.parentId);
            if (!parentNode) return null;
  
            // Calcula o ponto de início (centro direito do card pai)
            const startX = parentNode.x + 180; // Largura do card
            const startY = parentNode.y + 40;  // Metade da altura aproximada
  
            // Calcula o ponto final (centro esquerdo do card filho)
            const endX = childNode.x;
            const endY = childNode.y + 40;
  
            return (
              <g key={`${parentNode.id}-${childNode.id}`}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </g>
            );
          })}
      </svg>
    );
  };

  return (
    <div 
        className="flex-1 relative overflow-hidden"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{
        backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
        backgroundSize: '20px 20px'
        }}
    >
        {/* Renderiza as conexões primeiro para ficarem atrás dos cards */}
        {renderConnections()}
      {workflow.map((node) => {
        const Icon = node.icon;
        return (
          <div 
            key={node.id}
            className="absolute cursor-move group"
            style={{ 
              left: `${node.x}px`, 
              top: `${node.y}px` 
            }}
            onMouseDown={(e) => onNodeDrag(e, node)}
          >
            <div className="flex items-center">
              <Card className={`min-w-[180px] bg-gray-900 border-gray-700 shadow-lg relative
                             ${node.color ? `border-${node.color}-500` : ''}`}>
                {/* Botão de configuração */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();  // Previne propagação
                    onNodeConfig(node);   // Abre o modal de configuração
                  }}
                  className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full w-6 h-6 
                            flex items-center justify-center z-10 hover:bg-blue-600"
                >
                  <Settings size={14} />
                </button>

                {/* Botão de exclusão */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();  // Previne a propagação do evento
                        onNodeDelete(node);   // Chama a função que abre o modal de delete
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 
                                flex items-center justify-center z-10 hover:bg-red-600"
                >
                  <X size={14} />
                </button>

                <div 
                  className="p-4 flex items-center gap-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNodeEdit(node);
                  }}
                >
                  <div className={`p-2 rounded-lg ${node.color ? `bg-${node.color}-500/10` : 'bg-blue-500/10'}`}>
                    <Icon className={`h-5 w-5 ${node.color ? `text-${node.color}-400` : 'text-blue-400'}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{node.label}</h4>
                    {node.subtitle && (
                      <p className="text-sm text-gray-400">{node.subtitle}</p>
                    )}
                  </div>
                </div>
              </Card>
              
              {/* Botão circular de adicionar sub-nó */}
              <button 
                onClick={() => onAddSubNode(node)}
                className="ml-2 bg-blue-500 text-white rounded-full w-8 h-8 
                         flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};