import React from 'react';
import { IWorkflowCanvasProps, IWorkflowNode } from '@/types/workflow/customize-process-by-workflow-types';
import { Card } from '@/components/ui/organisms/card';
import { Plus, Settings, X, Clipboard, FileCheck, UserCheck, BookOpen, Stethoscope, 
  Hospital, Pill, ClipboardCheck, FileText, CalendarCheck } from 'lucide-react';

// Mapa de ícones para usar quando o ícone original não estiver disponível
const iconMap: Record<string, React.FC> = {
  'Clipboard': Clipboard,
  'FileCheck': FileCheck,
  'UserCheck': UserCheck,
  'BookOpen': BookOpen,
  'Stethoscope': Stethoscope,
  'Hospital': Hospital,
  'Pill': Pill,
  'ClipboardCheck': ClipboardCheck,
  'FileText': FileText,
  'CalendarCheck': CalendarCheck,
  // Adicione mais ícones conforme necessário
};

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

  // Função para determinar qual ícone usar
  const getIconComponent = (node: IWorkflowNode) => {
    // Se o node.icon for uma função válida, usá-la diretamente
    if (typeof node.icon === 'function') {
      return node.icon;
    }
    
    // Se tivermos um nome de ícone como string, tentar encontrar no mapa
    if (typeof node.icon === 'string' && iconMap[node.icon]) {
      return iconMap[node.icon];
    }

    // Caso não consiga determinar, usar um ícone padrão
    console.warn(`Ícone não encontrado para o nó: ${node.label}. Usando ícone padrão.`);
    return Clipboard;
  };

  // Handlers seguros que verificam se a função existe antes de chamar
  const handleNodeDrag = (e: React.MouseEvent<HTMLDivElement>, node: IWorkflowNode) => {
    if (onNodeDrag) {
      onNodeDrag(e, node);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onMouseMove) {
      onMouseMove(e);
    }
  };

  const handleMouseUp = () => {
    if (onMouseUp) {
      onMouseUp();
    }
  };

  const handleMouseLeave = () => {
    if (onMouseLeave) {
      onMouseLeave();
    }
  };

  const handleNodeEdit = (node: IWorkflowNode) => {
    if (onNodeEdit) {
      onNodeEdit(node);
    }
  };

  const handleNodeDelete = (node: IWorkflowNode) => {
    if (onNodeDelete) {
      onNodeDelete(node);
    }
  };

  const handleAddSubNode = (node: IWorkflowNode) => {
    if (onAddSubNode) {
      onAddSubNode(node);
    }
  };

  const handleNodeConfig = (node: IWorkflowNode) => {
    if (onNodeConfig) {
      onNodeConfig(node);
    }
  };

  // Calcular a área mínima necessária para o canvas baseado nos nós
  const calculateMinimumArea = () => {
    if (workflow.length === 0) return { minWidth: '100%', minHeight: '800px' };
    
    const maxX = Math.max(...workflow.map(node => node.x + 300)); // 300px para o card + espaço
    const maxY = Math.max(...workflow.map(node => node.y + 200)); // 200px para o card + espaço
    
    return {
      minWidth: `${Math.max(maxX, 1000)}px`, // No mínimo 1000px de largura
      minHeight: `${Math.max(maxY, 800)}px`  // No mínimo 800px de altura
    };
  };

  const { minWidth, minHeight } = calculateMinimumArea();

  return (
    <div 
        className="w-full h-full relative overflow-auto"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          position: 'relative'
        }}
    >
        {/* Container interno que define a área mínima para acomodar todos os nós */}
        <div style={{ 
          minWidth, 
          minHeight,
          position: 'relative'
        }}>
          {/* Renderiza as conexões primeiro para ficarem atrás dos cards */}
          {renderConnections()}
          
          {workflow.map((node) => {
            // Determina o componente de ícone correto para este nó
            const IconComponent = getIconComponent(node);
            
            return (
              <div 
                key={node.id}
                className="absolute cursor-move group"
                style={{ 
                  left: `${node.x}px`, 
                  top: `${node.y}px` 
                }}
                onMouseDown={(e) => handleNodeDrag(e, node)}
              >
                <div className="flex items-center">
                  <Card className={`min-w-[180px] bg-gray-900 border-gray-700 shadow-lg relative
                                ${node.color ? `border-${node.color}-500` : ''}`}>
                    {/* Botão de configuração */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();  // Previne propagação
                        handleNodeConfig(node);   // Abre o modal de configuração
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
                            handleNodeDelete(node);   // Chama a função que abre o modal de delete
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
                        handleNodeEdit(node);
                      }}
                    >
                      <div className={`p-2 rounded-lg ${node.color ? `bg-${node.color}-500/10` : 'bg-blue-500/10'}`}>
                        <IconComponent className={`h-5 w-5 ${node.color ? `text-${node.color}-400` : 'text-blue-400'}`} />
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
                    onClick={() => handleAddSubNode(node)}
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
    </div>
  );
};