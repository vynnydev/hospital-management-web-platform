import React, { memo } from 'react';
import { Activity, Clock, Stethoscope, ArrowRight, Pill, FileText } from 'lucide-react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import type { IPatientFlowNodeData } from '../types/flow-types';

const formatKey = (key: string): string => {
  const translations: Record<string, string> = {
    'fromDepartment': 'Departamento de Origem',
    'toDepartment': 'Departamento de Destino',
    'procedureType': 'Tipo de Procedimento',
    'department': 'Departamento',
    'responsibleStaff': 'Responsável',
    'diagnosis': 'Diagnóstico',
    'medicationName': 'Medicação',
    'examType': 'Tipo de Exame',
    'result': 'Resultado'
  };

  return translations[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const CustomNode = memo((props: NodeProps) => {
  const nodeData = props.data as IPatientFlowNodeData;

  const getIcon = () => {
    switch (nodeData.type) {
      case 'admission': 
        return <Stethoscope className={`h-5 w-5 ${nodeData.iconColor}`} />;
      case 'transfer':
        return <ArrowRight className={`h-5 w-5 ${nodeData.iconColor}`} />;
      case 'procedure':
        return <Activity className={`h-5 w-5 ${nodeData.iconColor}`} />;
      case 'medication':
        return <Pill className={`h-5 w-5 ${nodeData.iconColor}`} />;
      case 'exam':
        return <FileText className={`h-5 w-5 ${nodeData.iconColor}`} />;
      default:
        return <Activity className={`h-5 w-5 ${nodeData.iconColor}`} />;
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg min-w-[280px]">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-2 mb-2">
        {getIcon()}
        <h3 className="font-medium text-gray-100">{nodeData.label}</h3>
      </div>
      {nodeData.timestamp && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="h-4 w-4" />
          <span>{formatDate(nodeData.timestamp)}</span>
        </div>
      )}
      {nodeData.details && (
        <div className="mt-2 text-sm text-gray-400 space-y-1">
          {Object.entries(nodeData.details).map(([key, value]) => (
            value && (
              <p key={key} className="flex justify-between">
                <span className="font-medium">{formatKey(key)}:</span>
                <span className="text-right">{value}</span>
              </p>
            )
          ))}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

CustomNode.displayName = "CustomNode";

export const nodeTypes = {
  admission: CustomNode,
  transfer: CustomNode,
  procedure: CustomNode,
  medication: CustomNode,
  exam: CustomNode,
  discharge: CustomNode,
} as const;

export { CustomNode };

export const getEventColor = (type: string): string => {
    switch (type) {
      case 'admission': return 'text-green-500';
      case 'transfer': return 'text-yellow-500';
      case 'procedure': return 'text-blue-500';
      case 'medication': return 'text-purple-500';
      case 'exam': return 'text-indigo-500';
      case 'discharge': return 'text-red-500';
      default: return 'text-gray-500';
    }
};