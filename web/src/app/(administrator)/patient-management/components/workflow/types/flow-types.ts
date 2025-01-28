// types/flow-types.ts
import { TCareEventType } from '@/types/hospital-network-types';
import { Node, Edge } from '@xyflow/react';


// Tipos de nós disponíveis no diagrama do paciente
export type TPatientFlowNodeType = TCareEventType;

// Dados específicos do nó do paciente
export interface IPatientFlowNodeData {
  type: TPatientFlowNodeType;
  label: string;
  timestamp: string;
  details: Record<string, string>;
  iconColor: string;
  [key: string]: unknown;
}

// Nó completo do paciente
export interface IPatientFlowNode extends Node<IPatientFlowNodeData> {
  id: string;
  type: TPatientFlowNodeType;
  position: { x: number; y: number };
  draggable?: boolean;
  selectable?: boolean;
}

// Edge do fluxo do paciente
export interface IPatientFlowEdge extends Edge {
  animated?: boolean;
  style?: {
    stroke: string;
    strokeWidth: number;
  };
}

// Registro de tipos de nós
export type PatientFlowNodeTypes = {
  [K in TPatientFlowNodeType]: React.ComponentType<IPatientFlowNodeData>;
};