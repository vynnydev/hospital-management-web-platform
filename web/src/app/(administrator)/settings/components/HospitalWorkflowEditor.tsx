/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, MouseEvent } from 'react';
import { Card } from '@/components/ui/organisms/card';
import {
  Plus,
  Workflow,
  Bed,
  Stethoscope,
  ClipboardList,
  Users,
  Brain
} from 'lucide-react';

// Tipos de departamentos
interface Department {
  id: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactElement;
  subtitle?: string;
}

// Interface para nó no workflow
interface WorkflowNode extends Department {
  x: number;
  y: number;
  parentId?: string;
}

const departmentTypes: Department[] = [
  { 
    id: 'reception', 
    label: 'Recepção', 
    icon: (props: { className?: string }) => <ClipboardList {...props} />,
    subtitle: 'Entrada do paciente'
  },
  { 
    id: 'triage', 
    label: 'Triagem', 
    icon: (props: { className?: string }) => <Stethoscope {...props} />,
    subtitle: 'Avaliação inicial'
  },
  { 
    id: 'emergency', 
    label: 'Emergência', 
    icon: (props: { className?: string }) => <Bed {...props} />,
    subtitle: 'Atendimento urgente'
  },
  { 
    id: 'ward', 
    label: 'Enfermaria', 
    icon: (props: { className?: string }) => <Users {...props} />,
    subtitle: 'Acompanhamento'
  },
  { 
    id: 'icu', 
    label: 'UTI', 
    icon: (props: { className?: string }) => <Brain {...props} />,
    subtitle: 'Cuidados intensivos'
  },
];

export const HospitalWorkflowEditor = () => {
  const [workflow, setWorkflow] = useState<WorkflowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);
  const [newNode, setNewNode] = useState({ title: '', subtitle: '' });

  const handleAddNode = (dept: Department) => {
    const newNode: WorkflowNode = {
      ...dept,
      x: Math.random() * 600,
      y: Math.random() * 400
    };

    setWorkflow(prevWorkflow => [...prevWorkflow, newNode]);
  };

  const handleAddChildNode = () => {
    if (selectedNode) {
      const childNode: WorkflowNode = {
        id: `child-${Math.random().toString(36).substr(2, 9)}`,
        label: newNode.title || 'Novo Nó',
        subtitle: newNode.subtitle,
        icon: (props: { className?: string }) => <div {...props}>+</div>,
        x: selectedNode.x + 200,
        y: selectedNode.y + 100,
        parentId: selectedNode.id
      };

      setWorkflow(prevWorkflow => [...prevWorkflow, childNode]);
      setIsAddNodeModalOpen(false);
      setNewNode({ title: '', subtitle: '' });
    }
  };

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
    <div className="h-full flex flex-col">
      <div className="flex-1 flex">
        <div className="w-64 border-r border-gray-800 bg-gray-900/80 p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-4">
            Departamentos Disponíveis
          </h3>
          <div className="space-y-2">
            {departmentTypes.map((dept) => {
              const Icon = dept.icon;
              return (
                <div
                  key={dept.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => handleAddNode(dept)}
                >
                  <div className="p-2 rounded-md bg-blue-500/10">
                    <Icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">{dept.label}</h4>
                    <p className="text-xs text-gray-400">{dept.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div 
          className="flex-1 bg-gray-950 relative"
          onClick={() => setSelectedNode(null)}
        >
          <div 
            className="absolute inset-0 overflow-hidden"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                    setIsAddNodeModalOpen(true);
                  }}
                >
                  <Card className="min-w-[180px] bg-gray-900 border-gray-700 shadow-lg relative">
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
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isAddNodeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">
              Adicionar Nó filho de {selectedNode?.label}
            </h2>
            <div className="space-y-4">
              <input 
                type="text"
                placeholder="Título"
                className="w-full p-2 bg-gray-700 rounded"
                value={newNode.title}
                onChange={(e) => setNewNode(prev => ({
                  ...prev, 
                  title: e.target.value
                }))}
              />
              <input 
                type="text"
                placeholder="Subtítulo"
                className="w-full p-2 bg-gray-700 rounded"
                value={newNode.subtitle}
                onChange={(e) => setNewNode(prev => ({
                  ...prev, 
                  subtitle: e.target.value
                }))}
              />
              <div className="flex justify-end space-x-2">
                <button 
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={() => setIsAddNodeModalOpen(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={handleAddChildNode}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};