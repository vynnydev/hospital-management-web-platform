/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useContext, useState } from "react";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  Node,
  Edge,
  IsValidConnection
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Brain } from "lucide-react";
import { Badge } from "@/components/ui/organisms/badge";
import { FlowValidationContext, FlowValidationContextProvider } from "@/components/ui/context/FlowValidationContext";
import DeletableEdge from "./edges/DeletableEdge";
import BaseNodeComponent from "./nodes/NodeComponent";
import {
  AppNode,
  AppEdge,
  FlowEditorProps,
  DragEvent,
  OnConnect,
  NodeType
} from "./types";
import { IntegrationsPreviewPressable } from "@/components/ui/organisms/IntegrationsPreviewPressable";
import { ConfigurationAndUserModalMenus } from "@/components/ui/templates/ConfigurationAndUserModalMenus";

export const nodeTypes = {
  network: BaseNodeComponent,
  hospital: BaseNodeComponent,
  department: BaseNodeComponent,
};

const edgeTypes = {
  default: DeletableEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 0.4, minZoom: 0.5, maxZoom: 1.0 };

export const FlowEditor = ({ networkData }: FlowEditorProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);
  const flowValidation = useContext(FlowValidationContext);

  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultSection, setDefaultSection] = useState<string>('integrations');

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setDefaultSection('integrations');
  };

  useEffect(() => {
    console.log('networkData recebido:', networkData);
  
    if (!networkData) {
      console.warn('networkData está vazio ou undefined');
      return;
    }

    // 1. Criar nó da rede
    const networkNode: AppNode = {
      id: 'network-hospital',
      type: 'network',
      position: { x: 750, y: 100 },
      data: {
        type: 'network',
        label: networkData.networkInfo.name,
        metrics: {
          beds: networkData.networkInfo.networkMetrics.totalBeds,
          patients: networkData.networkInfo.networkMetrics.totalPatients
        },
        aiMetrics: {
          prediction: 84.5
        }
      },
      draggable: true,
      selectable: true,
    };

    // 2. Criar nós dos hospitais
    const hospitalNodes: AppNode[] = networkData.hospitals.map((hospital, index) => ({
      id: hospital.id,
      type: 'hospital',
      position: { 
        x: 200 + index * 500, 
        y: 350
      },
      data: {
        type: 'hospital',
        label: hospital.name,
        metrics: {
          beds: hospital.metrics.overall.totalBeds,
          patients: hospital.metrics.overall.totalPatients,
          occupancy: hospital.metrics.overall.occupancyRate,
          avgStay: hospital.metrics.overall.avgStayDuration,
          turnover: hospital.metrics.overall.turnoverRate
        },
        aiMetrics: {
          saturation: 15
        }
      },
      draggable: true,
      selectable: true,
    }));

    // 3. Criar nós dos departamentos (código que você já tem)
    const departmentNodes: AppNode[] = networkData.hospitals.flatMap((hospital, hospitalIndex) =>
      Object.entries(hospital.metrics.capacity.departmental).map(([deptName, dept]): AppNode => ({
        id: `${hospital.id}-${deptName}`,
        type: 'department',
        position: { 
          x: 200 + hospitalIndex * 500 + (Object.keys(hospital.metrics.capacity.departmental).indexOf(deptName) * 250), 
          y: 650
        },
        data: {
          type: 'department',
          label: deptName.toUpperCase(),
          metrics: {
            occupancy: dept.maxOccupancy,
            beds: dept.maxBeds,
            staff: Math.floor(Math.random() * 10) + 5
          },
          alert: dept.maxOccupancy > 90 ? 'Alta demanda prevista' : undefined
        },
        draggable: true,
        selectable: true,
      }))
    );

    // Criar arestas
    const networkEdges: AppEdge[] = networkData.hospitals.map(hospital => ({
      id: `network-hospital-${hospital.id}`,
      source: 'network-hospital',
      target: hospital.id,
      type: 'default',
      animated: true,
      style: {
        stroke: '#3b82f6',
        strokeWidth: 2
      }
    }));

    // Criar arestas dos departamentos
    const departmentEdges: AppEdge[] = networkData.hospitals.flatMap(hospital =>
      Object.keys(hospital.metrics.capacity.departmental).map(deptName => ({
        id: `${hospital.id}-${deptName}-edge`,
        source: hospital.id,
        target: `${hospital.id}-${deptName}`,
        type: 'default',
        animated: true,
        style: {
          stroke: '#3b82f6',
          strokeWidth: 1.5
        }
      }))
    );

    setNodes([networkNode, ...hospitalNodes, ...departmentNodes]);
    setEdges([...networkEdges, ...departmentEdges]);

    if (flowValidation) {
      flowValidation.clearErrors();
    }
  }, [networkData, setNodes, setEdges, flowValidation]);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const typeData = event.dataTransfer.getData("application/reactflow");
    const type = typeData as NodeType;
    if (!type) return;

    const position = {
      x: event.clientX,
      y: event.clientY,
    };

    const newNode: AppNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: {
        type,
        label: `New ${type}`,
      },
      draggable: true,
      selectable: true,
    };

    setNodes(nds => nds.concat(newNode));
  }, [setNodes]);

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, animated: true }, eds));
      if (flowValidation) {
        flowValidation.clearErrors();
      }
    },
    [setEdges, flowValidation]
  );

  const isValidConnection: IsValidConnection = useCallback((params) => {
    const source = nodes.find((node) => node.id === params.source);
    const target = nodes.find((node) => node.id === params.target);
    
    if (!source || !target || source.id === target.id) {
      return false;
    }

    // Validações específicas para os tipos de nós
    if (source.data.type === 'network' && target.data.type === 'hospital') {
      return true;
    }
    if (source.data.type === 'hospital' && target.data.type === 'department') {
      return true;
    }

    return false;
  }, [nodes]);

  return (
    <FlowValidationContextProvider>
      <div className="pt-2 pb-2 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-md shadow-md">
        <div className="p-4 w-full space-y-4 bg-gray-800 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold dark:text-white">
                Gerenciamento de Leitos
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Visualização em tempo real da ocupação e métricas da rede hospitalar
              </p>
            </div>

            {/* Deixar mostrando no maximo 5 com o plus */}
            <div className='ml-[600px] py-2'>
                <IntegrationsPreviewPressable onSelectIntegration={handleOpenModal} />

                <ConfigurationAndUserModalMenus 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    defaultSection={defaultSection}
                    user={null}
                />
            </div>

            <Badge variant="outline" className="dark:border-blue-500 dark:text-blue-400">
              Dashboard em Tempo Real
            </Badge>
          </div>

          <div style={{ width: '100%', height: '700px' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onEdgesChange={onEdgesChange}
              onNodesChange={onNodesChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              snapToGrid
              snapGrid={snapGrid}
              fitViewOptions={fitViewOptions}
              fitView
              onDragOver={onDragOver}
              onDrop={onDrop}
              onConnect={onConnect}
              isValidConnection={isValidConnection}
              defaultViewport={{ x: 0, y: 0, zoom: 0.65 }}
            >
              <Background 
                variant={BackgroundVariant.Dots}
                color="#94a3b8" 
                gap={16} 
                size={2}
                className="dark:opacity-30"
              />
              <Controls 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
                fitViewOptions={fitViewOptions}
                showInteractive={false}
              />
              <Panel 
                position="top-right" 
                className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Brain className="h-4 w-4 text-blue-500" />
                  <span>IA Ativa: Monitorando em tempo real</span>
                </div>
              </Panel>
            </ReactFlow>
          </div>
        </div>
      </div>
    </FlowValidationContextProvider>
  );
};