/* eslint-disable @typescript-eslint/no-unused-vars */
import { NodeProps, Handle, Position } from "@xyflow/react";
import { memo } from "react";
import { Card } from "@/components/ui/organisms/card";
import { Badge } from "@/components/ui/organisms/badge";
import { 
  Building2, 
  BedDouble, 
  Users, 
  Brain, 
  Stethoscope,
  Clock,
  Activity,
  HeartPulse,
  AlertTriangle
} from "lucide-react";
import { AppNodeData } from "@/types/workflow/appNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";

// Componente base para todos os nós
const BaseNodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const CardComponent = getCardComponent(nodeData.type);
  
  return (
    <div className={`relative ${props.selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white dark:border-gray-800"
      />
      
      <CardComponent data={nodeData} />

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white dark:border-gray-800"
      />
    </div>
  );
});

// Card da Rede de Hospitais
const NetworkNode = ({ data }: { data: AppNodeData }) => (
  <Card className="min-w-[320px] bg-blue-900/90 shadow-lg text-white">
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-6 w-6" />
        <h3 className="font-bold text-lg">{data.label}</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <BedDouble className="h-5 w-5" />
          <div>
            <div className="text-sm opacity-80">Total Leitos</div>
            <div className="font-semibold">{data.metrics?.beds || 1200}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <div>
            <div className="text-sm opacity-80">Pacientes</div>
            <div className="font-semibold">{data.metrics?.patients || 850}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm border-t border-white/20 pt-3">
        <Brain className="h-4 w-4" />
        <span>Previsão de Ocupação: {data.aiMetrics?.prediction || "84.5"}%</span>
      </div>
    </div>
  </Card>
);

// Card do Hospital
const HospitalNode = ({ data }: { data: AppNodeData }) => (
  <Card className="min-w-[280px] bg-gray-900/90 shadow-lg text-white">
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-blue-400" />
          <h4 className="font-semibold">{data.label}</h4>
        </div>
        <Badge className="bg-blue-500/20 text-white">
          {data.metrics?.occupancy || "85.5"}% Ocupação
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <BedDouble className="h-4 w-4 text-gray-400" />
          <div>
            <div className="text-xs text-gray-400">Leitos</div>
            <div className="font-medium">{data.metrics?.beds || 400}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <div>
            <div className="text-xs text-gray-400">Pacientes</div>
            <div className="font-medium">{data.metrics?.patients || 324}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <div>
            <div className="text-xs text-gray-400">Média Permanência</div>
            <div className="font-medium">{data.metrics?.avgStay || "5.2"}d</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-gray-400" />
          <div>
            <div className="text-xs text-gray-400">Taxa Rotatividade</div>
            <div className="font-medium">{data.metrics?.turnover || "12.3"}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm border-t border-gray-700 pt-3">
        <Brain className="h-4 w-4 text-blue-400" />
        <span className="text-gray-300">Probabilidade de saturação em 48h: {data.aiMetrics?.saturation || "15"}%</span>
      </div>
    </div>
  </Card>
);

// Card do Departamento
const DepartmentNode = ({ data }: { data: AppNodeData }) => (
  <Card className="min-w-[220px] bg-gray-900/80 shadow-lg text-white">
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-blue-400" />
          <h5 className="font-medium">{data.label}</h5>
        </div>
        <Badge variant="outline" className="border-gray-700 bg-gray-800">
          {data.metrics?.occupancy || "95"}%
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <BedDouble className="h-3 w-3 text-gray-400" />
          <span className="text-gray-300">{data.metrics?.beds || "50"} Leitos</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3 text-gray-400" />
          <span className="text-gray-300">{data.metrics?.staff || "6"} Equipe</span>
        </div>
      </div>
      {(data.alert || data.metrics?.highDemand) && (
        <div className="mt-2 flex items-center gap-1 text-xs text-yellow-500">
          <AlertTriangle className="h-3 w-3" />
          <span>Alta demanda prevista</span>
        </div>
      )}
    </div>
  </Card>
);

// Função para selecionar o componente correto baseado no tipo
const getCardComponent = (type: string) => {
  switch (type) {
    case 'network':
      return NetworkNode;
    case 'hospital':
      return HospitalNode;
    case 'department':
      return DepartmentNode;
    default:
      return NetworkNode;
  }
};

BaseNodeComponent.displayName = "NodeComponent";

// Exportar os tipos de nós para uso no React Flow
export const nodeTypes = {
  network: BaseNodeComponent,
  hospital: BaseNodeComponent,
  department: BaseNodeComponent
};

export default BaseNodeComponent;