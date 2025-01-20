/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  ConnectionMode,
  Panel,
  Position,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from '@/components/ui/organisms/card';
import { Badge } from '@/components/ui/organisms/badge';
import { NetworkData } from '@/types/hospital-network-types';
import {
  Building2,
  Users,
  Activity,
  BedDouble,
  Brain,
  AlertTriangle,
  Clock,
  HeartPulse,
  Stethoscope
} from 'lucide-react';

interface HospitalFlowProps {
  networkData: NetworkData;
}

const NetworkNode = ({ data }: { data: any }) => (
  <Card className="min-w-[320px] bg-gradient-to-r from-blue-700 to-cyan-700 dark:from-blue-900 dark:to-cyan-900 shadow-lg">
    <div className="p-4 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="h-6 w-6" />
        <h3 className="font-bold text-lg">{data.label}</h3>
      </div>
      {data.metrics && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <BedDouble className="h-5 w-5" />
            <div>
              <div className="text-sm opacity-80">Total Leitos</div>
              <div className="font-semibold">{data.metrics.beds}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <div>
              <div className="text-sm opacity-80">Pacientes</div>
              <div className="font-semibold">{data.metrics.patients}</div>
            </div>
          </div>
        </div>
      )}
      {data.aiMetrics && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="text-sm">Previsão de Ocupação: {data.aiMetrics.prediction}%</span>
          </div>
        </div>
      )}
    </div>
  </Card>
);

const HospitalNode = ({ data }: { data: any }) => (
  <Card className="min-w-[280px] bg-white dark:bg-gray-800 shadow-lg border-2 border-blue-500/20">
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h4 className="font-semibold text-gray-800 dark:text-white">{data.label}</h4>
        </div>
        <Badge className={`${data.statusColor} dark:bg-opacity-20`}>
          {data.occupancy}% Ocupação
        </Badge>
      </div>
      {data.metrics && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Leitos</div>
              <div className="font-medium dark:text-white">{data.metrics.beds}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Pacientes</div>
              <div className="font-medium dark:text-white">{data.metrics.patients}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Média Permanência</div>
              <div className="font-medium dark:text-white">{data.metrics.avgStay}d</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Taxa Rotatividade</div>
              <div className="font-medium dark:text-white">{data.metrics.turnover}</div>
            </div>
          </div>
        </div>
      )}
      {data.aiInsights && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Brain className="h-4 w-4 text-blue-500" />
            <span>{data.aiInsights}</span>
          </div>
        </div>
      )}
    </div>
  </Card>
);

const DepartmentNode = ({ data }: { data: any }) => (
  <Card className="min-w-[220px] bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700">
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h5 className="font-medium text-sm dark:text-white">{data.label}</h5>
        </div>
        <Badge variant="outline" className="dark:border-gray-600">
          {data.occupancy}%
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1">
          <BedDouble className="h-3 w-3 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-600 dark:text-gray-300">{data.beds} Leitos</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-600 dark:text-gray-300">{data.staff} Equipe</span>
        </div>
      </div>
      {data.alert && (
        <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
          <AlertTriangle className="h-3 w-3" />
          <span>{data.alert}</span>
        </div>
      )}
    </div>
  </Card>
);

export const HospitalFlowDiagram: React.FC<HospitalFlowProps> = ({ networkData }) => {
  const getStatusColor = (rate: number) => {
    if (rate >= 90) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (rate >= 75) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  };

  // Criar nós iniciais com dados extras
  const initialNodes = [
    {
      id: 'network-hospital',
      type: 'network',
      position: { x: 750, y: 50 },
      data: {
        label: networkData.networkInfo.name,
        metrics: {
          beds: networkData.networkInfo.networkMetrics.totalBeds,
          patients: networkData.networkInfo.networkMetrics.totalPatients
        },
        aiMetrics: {
          prediction: 84.5
        }
      },
      targetPosition: Position.Bottom,
      sourcePosition: Position.Bottom
    },
    ...networkData.hospitals.map((hospital, index) => ({
      id: hospital.id,
      type: 'hospital',
      position: { x: 200 + index * 500, y: 250 },
      data: {
        label: hospital.name,
        occupancy: hospital.metrics.overall.occupancyRate,
        statusColor: getStatusColor(hospital.metrics.overall.occupancyRate),
        metrics: {
          beds: hospital.metrics.overall.totalBeds,
          patients: hospital.metrics.overall.totalPatients,
          avgStay: hospital.metrics.overall.avgStayDuration,
          turnover: hospital.metrics.overall.turnoverRate
        },
        aiInsights: 'Probabilidade de saturação em 48h: 15%'
      },
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom
    })),
    ...networkData.hospitals.flatMap((hospital, hospitalIndex) => 
      Object.entries(hospital.metrics.capacity.departmental).map(([deptName, dept], deptIndex) => ({
        id: `${hospital.id}-${deptName}`,
        type: 'department',
        position: { x: 200 + hospitalIndex * 500 + deptIndex * 250, y: 450 }, // Aumentado o espaçamento entre departamentos
        data: {
          label: deptName.toUpperCase(),
          occupancy: dept.maxOccupancy,
          beds: dept.maxBeds,
          staff: Math.floor(Math.random() * 10) + 5, // Exemplo
          alert: dept.maxOccupancy > 90 ? 'Alta demanda prevista' : undefined
        }
      }))
    )
  ];

  // Arestas com conexões entre todos os níveis
  const initialEdges: Edge[] = [
    // 1. Conexões da rede (pai) para todos os hospitais
    ...networkData.hospitals.map(hospital => ({
      id: `network-hospital-${hospital.id}`,  // ID simplificado
      source: 'network-hospital',         // sempre o ID da rede
      target: hospital.id,       // ID do hospital
      type: 'step',
      animated: true,
      style: {
        stroke: '#3b82f6',
        strokeWidth: 2
      }
    })),
  
    // 3. Conexões de cada hospital para seus departamentos
    ...networkData.hospitals.flatMap(hospital => {
      const depts = Object.keys(hospital.metrics.capacity.departmental);
      return depts.map(deptName => ({
        id: `${hospital.id}-${deptName}`,
        source: hospital.id,
        target: deptName,
        type: 'step',
        animated: true,
        style: {
          stroke: '#3b82f6',
          strokeWidth: 1.5
        }
      }));
    })
  ];

  console.log(initialEdges)

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onConnect = useCallback(
    (params: any) => {
      const newEdge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        style: { 
          stroke: 'url(#edge-gradient)',
          strokeWidth: 2,
          opacity: 0.8
        }
      };
      setEdges((eds) => [...eds, newEdge]);
    },
    []
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const nodeTypes = {
    network: NetworkNode,
    hospital: HospitalNode,
    department: DepartmentNode
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gerenciamento de Leitos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Visualização em tempo real da ocupação e métricas da rede hospitalar
          </p>
        </div>
        <Badge variant="outline" className="dark:border-blue-500 dark:text-blue-400">
          Dashboard em Tempo Real
        </Badge>
      </div>
      
      <div className="w-full h-[700px] bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner border border-gray-200 dark:border-gray-800">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          defaultViewport={{ 
            x: 0,
            y: 0,
            zoom: 0.65 
          }}
          fitViewOptions={{
            padding: 0.4,
            minZoom: 0.5,
            maxZoom: 1.0
          }}
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
          
          {/* Gradiente para as conexões */}
          {/* <defs>
            <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.5" />
            </linearGradient>
          </defs> */}
        </ReactFlow>
      </div>
    </div>
  );
};