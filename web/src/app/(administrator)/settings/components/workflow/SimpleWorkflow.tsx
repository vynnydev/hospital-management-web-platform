/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Card } from '@/components/ui/organisms/card';
import { IWorkflowDepartment, IWorkflowNode } from '../types/workflow-types';

export const SimpleWorkflow: React.FC = () => {
  const [nodes, setNodes] = useState<IWorkflowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<IWorkflowNode | null>(null);

  const handleAddNode = (dept: IWorkflowDepartment) => {
    const newNode: IWorkflowNode = {
      ...dept,
      x: Math.random() * 600, // Posicionamento aleatório
      y: Math.random() * 400
    };

    setNodes(prevNodes => [...prevNodes, newNode]);
  };

  const handleNodeMove = (nodeId: string, event: React.MouseEvent) => {
    // Lógica de mover nó
  };

  const handleNodeDelete = (nodeId: string) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
  };

  return (
    <div 
      className="relative w-full h-[500px] bg-gray-950 border border-gray-800 rounded-lg overflow-hidden"
      onClick={() => setSelectedNode(null)}
    >
      {nodes.map((node) => {
        const Icon = node.icon;
        return (
          <div 
            key={node.id}
            className={`absolute cursor-move rounded-lg shadow-lg 
              ${selectedNode?.id === node.id ? 'border-2 border-blue-500' : ''}`}
            style={{ 
              left: `${node.x}px`, 
              top: `${node.y}px` 
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNode(node);
            }}
          >
            <Card className="min-w-[180px] bg-gray-900 border-gray-700">
              <div className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{node.label}</h4>
                  {node.subtitle && (
                    <p className="text-sm text-gray-400">{node.subtitle}</p>
                  )}
                </div>
              </div>
            </Card>
            {selectedNode?.id === node.id && (
              <button 
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                onClick={() => handleNodeDelete(node.id)}
              >
                X
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Componente para selecionar departamentos
export const DepartmentSelector: React.FC<{ 
  departmentTypes: IWorkflowDepartment[];
  onAddNode: (dept: IWorkflowDepartment) => void;
}> = ({ departmentTypes, onAddNode }) => {
  return (
    <div className="space-y-2">
      {departmentTypes.map((dept) => {
        const Icon = dept.icon;
        return (
          <div
            key={dept.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
            onClick={() => onAddNode(dept)}
          >
            <div className="p-2 rounded-md bg-blue-500/10">
              <Icon className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">{dept.label}</h4>
              <p className="text-xs text-gray-400">Clique para adicionar</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};