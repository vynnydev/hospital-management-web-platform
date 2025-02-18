import { INetworkData } from '@/types/hospital-network-types';
import { Edge, Connection, NodeChange, EdgeChange } from '@xyflow/react';

// Tipo para o tipo de nó
export type TNodeType = "network" | "hospital" | "department";

// Se precisar incluir edges na validação:
export type TIsValidConnectionFuncWithEdges = (params: Connection, edges: Edge[]) => boolean;

// Tipos básicos do sistema hospitalar
export interface IDepartmentalMetrics {
  maxOccupancy: number;
  maxBeds: number;
  currentPatients?: number;
}

// ou ainda mais específico:
export type TIsValidConnectionFunc = (params: {
  source: string | null;
  target: string | null;
  sourceHandle: string | null;
  targetHandle: string | null;
}) => boolean;

export interface IOverallMetrics {
  totalBeds: number;
  totalPatients: number;
  occupancyRate: number;
  avgStayDuration: number;
  turnoverRate: number;
}

export interface IHospitalCapacity {
  departmental: {
    [key: string]: IDepartmentalMetrics;
  };
}

export interface IHospital {
  id: string;
  name: string;
  metrics: IAIMetrics;
}

export interface INetworkInfo {
  name: string;
  networkMetrics: {
    totalBeds: number;
    totalPatients: number;
  };
}

// Tipos para os nós do React Flow
export interface INodeMetrics {
  beds?: number;
  patients?: number;
  occupancy?: number;
  avgStay?: number;
  turnover?: number;
  staff?: number;
  maxOccupancy?: number;
  maxBeds?: number;
}

export interface IAIMetrics {
  prediction?: number;
  saturation?: number;
}

export interface IAppNodeData {
    type: 'network' | 'hospital' | 'department';
    label: string;
    metrics?: INodeMetrics;
    aiMetrics?: IAIMetrics;
    alert?: string;
    statusColor?: string;
    // Adiciona um index signature para permitir propriedades string adicionais
    [key: string]: unknown;
}

export interface IAppNode {
  id: string;
  type: TNodeType;
  position: { x: number; y: number };
  data: IAppNodeData;
  draggable: boolean;
  selectable: boolean;
}

export type TAppEdge = Edge;

// Props e State interfaces
export interface IFlowEditorProps {
  networkData: INetworkData;
}

export interface IWorkflowDepartment {
    id: string;
    label: string;
    icon: (props: { className?: string }) => React.ReactElement;
    subtitle?: string;
}

export interface IWorkflowNode extends IWorkflowDepartment {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: IAppNodeData;
  parentId?: string;
}

export interface IFlowEditorState {
  nodes: IAppNode[];
  edges: TAppEdge[];
}

// Tipos para as funções de callback
export type TOnConnect = (connection: Connection) => void;
export type TOnNodesChange = (changes: NodeChange[]) => void;
export type TOnEdgesChange = (changes: EdgeChange[]) => void;
export type TIsValidConnection = (connection: Connection) => boolean;

// Tipo para evento de arrastar
export interface IDragEvent extends React.DragEvent<HTMLDivElement> {
  dataTransfer: DataTransfer;
}