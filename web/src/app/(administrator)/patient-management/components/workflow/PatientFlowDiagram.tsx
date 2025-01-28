/* eslint-disable @typescript-eslint/no-unused-vars */
// components/PatientFlowDiagram.tsx
import React, { useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Activity } from 'lucide-react';
import { useNetworkData } from '@/services/hooks/useNetworkData';
import { nodeTypes, getEventColor } from './nodes/CustomNode';
import type { 
  IPatientFlowNode, 
  IPatientFlowEdge,
  IPatientFlowNodeData 
} from './types/flow-types';

interface IPatientFlowDiagramProps {
  patientId: string;
}

export const PatientFlowDiagram: React.FC<IPatientFlowDiagramProps> = ({ patientId }) => {
  const { getPatientCareHistory } = useNetworkData();
  const [nodes, setNodes] = useNodesState<IPatientFlowNode>([]);
  const [edges, setEdges] = useEdgesState<IPatientFlowEdge>([]);

  useEffect(() => {
    const careHistory = getPatientCareHistory(patientId);
    if (!careHistory) return;

    const createNodesAndEdges = () => {
      const newNodes: IPatientFlowNode[] = [];
      const newEdges: IPatientFlowEdge[] = [];

      // Criar nó inicial de admissão
      const admissionNode: IPatientFlowNode = {
        id: 'admission',
        type: 'admission',
        position: { x: 250, y: 0 },
        data: {
          type: 'admission',
          label: 'Admissão do Paciente',
          timestamp: careHistory.startDate,
          details: {
            diagnóstico: careHistory.primaryDiagnosis
          },
          iconColor: getEventColor('admission')
        }
      };
      newNodes.push(admissionNode);

      // Criar nós para cada evento do histórico
      careHistory.events.forEach((event, index) => {
        const nodeId = `event-${index}`;
        const yPos = 150 + (index * 150);

        // Criar nó do evento
        const eventNode: IPatientFlowNode = {
          id: nodeId,
          type: event.type,
          position: { x: 250, y: yPos },
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
        };
        newNodes.push(eventNode);

        // Criar edge conectando ao nó anterior
        const sourceId = index === 0 ? 'admission' : `event-${index - 1}`;
        const edge: IPatientFlowEdge = {
          id: `edge-${sourceId}-${nodeId}`,
          source: sourceId,
          target: nodeId,
          animated: true,
          style: {
            stroke: '#3b82f6',
            strokeWidth: 2
          }
        };
        newEdges.push(edge);
      });

      return { nodes: newNodes, edges: newEdges };
    };

    const { nodes: newNodes, edges: newEdges } = createNodesAndEdges();
    setNodes(newNodes);
    setEdges(newEdges);
  }, [patientId, getPatientCareHistory, setNodes, setEdges]);

  return (
    <div className="h-[600px] w-full bg-gray-900 rounded-xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
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
          className="bg-gray-800 border border-gray-700 shadow-lg"
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