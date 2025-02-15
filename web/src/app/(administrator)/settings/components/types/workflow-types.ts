import { Node, Edge, NodeProps } from '@xyflow/react';

// Interface para os dados do node
export interface IDepartmentNodeData extends Record<string, unknown> {
  id: string;
  position: {
    x: number;
    y: number;
  };
  label: string;
  subtitle?: string;
  Icon: React.ElementType;
  type: string;
  data: {
    label: string;
    subtitle?: string;
    Icon: React.ElementType;
    type: string;
  };
}

// Tipo para o node completo
export interface IDepartmentNode extends Node {
  data: IDepartmentNodeData;
}

export type IDepartmentEdge = Edge;

// Props do componente node
export interface IDepartmentNodeProps extends NodeProps<IDepartmentNodeData> {
  data: IDepartmentNodeData;
}