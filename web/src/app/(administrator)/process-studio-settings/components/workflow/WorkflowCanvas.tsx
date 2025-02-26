import React, { useCallback, useEffect, useRef } from 'react';
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
  // Referência para evitar renderizações desnecessárias
  const workflowRef = useRef(workflow);
  
  // Atualiza a referência quando o workflow muda, evitando loop infinito
  useEffect(() => {
    workflowRef.current = workflow;
  }, [workflow]);

  // Renderiza as conexões usando a referência para evitar renderizações em cascata
  const renderConnections = useCallback(() => {
    const currentWorkflow = workflowRef.current;
    
    if (!currentWorkflow || currentWorkflow.length <= 1) {
      return null;
    }

    // Log para depuração
    const nodesWithParents = currentWorkflow.filter(node => node.parentId);
    
    return (
      <svg 
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ 
          overflow: 'visible',
          zIndex: 1 
        }}
      >
        {/* Linhas diagonais diretas entre os nós */}
        {nodesWithParents.map(childNode => {
          const parentNode = currentWorkflow.find(node => node.id === childNode.parentId);
          if (!parentNode) return null;

          // Calcula pontos de conexão
          const startX = parentNode.x + 180; // Largura do card
          const startY = parentNode.y + 40;  // Metade da altura aproximada
          const endX = childNode.x;
          const endY = childNode.y + 40;
          
          // Calcular ângulo para a seta
          const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
          
          // ID único para a conexão
          const connectionId = `connection-${parentNode.id}-${childNode.id}`;
          
          return (
            <g key={connectionId} className="workflow-connection">
              {/* Linha diagonal direta com tracejado */}
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="connection-line"
              />
              
              {/* Círculo no ponto de início */}
              <circle
                cx={startX}
                cy={startY}
                r="4"
                fill="#3b82f6"
                className="connection-start-point"
              />
              
              {/* Seta no ponto final */}
              <g transform={`translate(${endX}, ${endY}) rotate(${angle})`}>
                <polygon
                  points="-10,-6 0,0 -10,6"
                  fill="#3b82f6"
                  className="connection-arrow"
                />
              </g>
            </g>
          );
        })}
      </svg>
    );
  }, []);

  // Função para determinar qual ícone usar - memoizada para evitar recriação em cada render
  const getIconComponent = useCallback((node: IWorkflowNode) => {
    // Se o node.icon for uma função válida, usá-la diretamente
    if (typeof node.icon === 'function') {
      return node.icon;
    }
    
    // Se tivermos um nome de ícone como string, tentar encontrar no mapa
    if (typeof node.icon === 'string' && iconMap[node.icon]) {
      return iconMap[node.icon];
    }

    // Caso não consiga determinar, usar um ícone padrão
    return Clipboard;
  }, []);

  // Handlers seguros que verificam se a função existe antes de chamar
  // Usando useCallback para evitar recriações desnecessárias
  const handleNodeDrag = useCallback((e: React.MouseEvent<HTMLDivElement>, node: IWorkflowNode) => {
    if (onNodeDrag) {
      onNodeDrag(e, node);
    }
  }, [onNodeDrag]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (onMouseMove) {
      onMouseMove(e);
    }
  }, [onMouseMove]);

  const handleMouseUp = useCallback(() => {
    if (onMouseUp) {
      onMouseUp();
    }
  }, [onMouseUp]);

  const handleMouseLeave = useCallback(() => {
    if (onMouseLeave) {
      onMouseLeave();
    }
  }, [onMouseLeave]);

  const handleNodeEdit = useCallback((node: IWorkflowNode) => {
    if (onNodeEdit) {
      onNodeEdit(node);
    }
  }, [onNodeEdit]);

  const handleNodeDelete = useCallback((node: IWorkflowNode) => {
    if (onNodeDelete) {
      onNodeDelete(node);
    }
  }, [onNodeDelete]);

  const handleAddSubNode = useCallback((node: IWorkflowNode) => {
    if (onAddSubNode) {
      onAddSubNode(node);
    }
  }, [onAddSubNode]);

  const handleNodeConfig = useCallback((node: IWorkflowNode) => {
    if (onNodeConfig) {
      onNodeConfig(node);
    }
  }, [onNodeConfig]);

  // Calcular a área mínima necessária para o canvas baseado nos nós
  // Usando useCallback para evitar renderizações desnecessárias
  const calculateMinimumArea = useCallback(() => {
    if (!workflow || workflow.length === 0) return { minWidth: '100%', minHeight: '800px' };
    
    const maxX = Math.max(...workflow.map(node => node.x + 300)); // 300px para o card + espaço
    const maxY = Math.max(...workflow.map(node => node.y + 200)); // 200px para o card + espaço
    
    return {
      minWidth: `${Math.max(maxX, 1000)}px`, // No mínimo 1000px de largura
      minHeight: `${Math.max(maxY, 800)}px`  // No mínimo 800px de altura
    };
  }, [workflow]);

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
        
        {workflow && workflow.map((node) => {
          // Determina o componente de ícone correto para este nó
          const IconComponent = getIconComponent(node);
          
          return (
            <div 
              key={node.id}
              className="absolute cursor-move group z-10" // z-index mais alto que as conexões
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
                              flex items-center justify-center z-20 hover:bg-blue-600"
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
                                  flex items-center justify-center z-20 hover:bg-red-600"
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