import { Edge, Connection, NodeChange, EdgeChange } from '@xyflow/react';

// Tipo para o tipo de nó
export type NodeType = "network" | "hospital" | "department";

// Se precisar incluir edges na validação:
export type IsValidConnectionFuncWithEdges = (params: Connection, edges: Edge[]) => boolean;

// Tipos básicos do sistema hospitalar
export interface DepartmentalMetrics {
  maxOccupancy: number;
  maxBeds: number;
  currentPatients?: number;
}

// ou ainda mais específico:
export type IsValidConnectionFunc = (params: {
  source: string | null;
  target: string | null;
  sourceHandle: string | null;
  targetHandle: string | null;
}) => boolean;

export interface OverallMetrics {
  totalBeds: number;
  totalPatients: number;
  occupancyRate: number;
  avgStayDuration: number;
  turnoverRate: number;
}

export interface HospitalCapacity {
  departmental: {
    [key: string]: DepartmentalMetrics;
  };
}

export interface HospitalMetrics {
  overall: OverallMetrics;
  capacity: HospitalCapacity;
}

export interface Hospital {
  id: string;
  name: string;
  metrics: HospitalMetrics;
}

export interface NetworkInfo {
  name: string;
  networkMetrics: {
    totalBeds: number;
    totalPatients: number;
  };
}

export interface NetworkData {
  networkInfo: NetworkInfo;
  hospitals: Hospital[];
}

// Tipos para os nós do React Flow
export interface NodeMetrics {
  beds?: number;
  patients?: number;
  occupancy?: number;
  avgStay?: number;
  turnover?: number;
  staff?: number;
  maxOccupancy?: number;
  maxBeds?: number;
}

export interface AIMetrics {
  prediction?: number;
  saturation?: number;
}

export interface AppNodeData {
    type: 'network' | 'hospital' | 'department';
    label: string;
    metrics?: NodeMetrics;
    aiMetrics?: AIMetrics;
    alert?: string;
    statusColor?: string;
    // Adiciona um index signature para permitir propriedades string adicionais
    [key: string]: unknown;
}

export interface AppNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: AppNodeData;
  draggable: boolean;
  selectable: boolean;
}

export type AppEdge = Edge;

// Props e State interfaces
export interface FlowEditorProps {
  networkData: NetworkData;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: AppNodeData;
}

export interface FlowEditorState {
  nodes: AppNode[];
  edges: AppEdge[];
}

// Tipos para as funções de callback
export type OnConnect = (connection: Connection) => void;
export type OnNodesChange = (changes: NodeChange[]) => void;
export type OnEdgesChange = (changes: EdgeChange[]) => void;
export type IsValidConnection = (connection: Connection) => boolean;

// Tipo para evento de arrastar
export interface DragEvent extends React.DragEvent<HTMLDivElement> {
  dataTransfer: DataTransfer;
}