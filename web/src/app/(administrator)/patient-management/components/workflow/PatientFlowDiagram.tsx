/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import dagre from 'dagre';
import '@xyflow/react/dist/style.css';
import { Activity } from 'lucide-react';
import { useNetworkData } from '@/services/hooks/useNetworkData';
import { nodeTypes, getEventColor } from './nodes/CustomNode';
import type { IPatientFlowNode, IPatientFlowEdge } from './types/flow-types';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

interface IPatientFlowDiagramProps {
  patientId: string;
}

const getLayoutedElements = (nodes: IPatientFlowNode[], edges: IPatientFlowEdge[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 250, height: 120 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - 125,
          y: nodeWithPosition.y - 60
        }
      };
    }),
    edges
  };
};

export const PatientFlowDiagram: React.FC<IPatientFlowDiagramProps> = ({ patientId }) => {
  const { getPatientCareHistory } = useNetworkData();
  const [nodes, setNodes] = useNodesState<IPatientFlowNode>([]);
  const [edges, setEdges] = useEdgesState<IPatientFlowEdge>([]);

  const careHistory = useMemo(() => getPatientCareHistory(patientId), [patientId, getPatientCareHistory]);

  useEffect(() => {
    if (!careHistory) return;

    const initialNodes: IPatientFlowNode[] = [];
    const initialEdges: IPatientFlowEdge[] = [];

    // Nó de admissão
    initialNodes.push({
      id: 'admission',
      type: 'admission',
      position: { x: 0, y: 0 },
      data: {
        type: 'admission',
        label: 'Admissão do Paciente',
        timestamp: careHistory.startDate,
        details: {
          diagnóstico: careHistory.primaryDiagnosis
        },
        iconColor: getEventColor('admission')
      }
    });

    // Nós de eventos
    careHistory.events.forEach((event, index) => {
      const nodeId = `event-${index}`;
      
      initialNodes.push({
        id: nodeId,
        type: event.type,
        position: { x: 0, y: 0 },
        data: {
          type: event.type,
          label: event.description,
          timestamp: event.timestamp,
          details: {
            responsável: `${event.responsibleStaff.name} (${event.responsibleStaff.role})`,
            departamento: event.department,
            ...(event.details || {})
          },
          iconColor: getEventColor(event.type)
        }
      });

      // Edge conectando ao nó anterior
      initialEdges.push({
        id: index === 0 ? `edge-admission-${nodeId}` : `edge-${index-1}-${index}`,
        source: index === 0 ? 'admission' : `event-${index-1}`,
        target: nodeId,
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        type: 'smoothstep'
      });
    });

    // Aplicar layout
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
      'TB'
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [careHistory, setNodes, setEdges]);

  if (!careHistory) return null;

  return (
    <div className="h-[600px] w-full bg-gray-900 rounded-xl">
      <ReactFlow<IPatientFlowNode, IPatientFlowEdge>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        defaultViewport={{ x: 0, y: 0, zoom: 0.65 }}
        minZoom={0.2}
        maxZoom={1.5}
        elementsSelectable={false}
        nodesDraggable={false}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#94a3b8"
          gap={16}
          size={2}
          className="dark:opacity-30"
        />
        <Controls
          className="bg-gray-500 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg text-black"
          showInteractive={false}
        />
        <Panel
          position="top-right"
          className="bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-700"
        >
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Activity className="h-4 w-4 text-blue-500" />
            <span>Fluxo de Atendimento do Paciente</span>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};