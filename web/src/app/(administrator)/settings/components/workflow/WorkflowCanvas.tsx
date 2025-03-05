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
    return workflow
      .filter(node => node.parentId)
      .map(childNode => {
        const parentNode = workflow.find(node => node.id === childNode.parentId);
        if (!parentNode) return null;

        return (
          <svg 
            key={childNode.id} 
            className="absolute pointer-events-none"
            style={{ 
              left: 0, 
              top: 0, 
              width: '100%', 
              height: '100%' 
            }}
          >
            <line
              x1={parentNode.x + 90}
              y1={parentNode.y + 50}
              x2={childNode.x + 90}
              y2={childNode.y + 50}
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
        );
      });
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
                    e.stopPropagation();
                    onNodeConfig(node);
                  }}
                  className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full w-6 h-6 
                           flex items-center justify-center z-10 hover:bg-blue-600"
                >
                  <Settings size={14} />
                </button>

                {/* Botão de exclusão */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNodeEdit(node);
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