import { AlertCircle, ChevronRight } from "lucide-react";

// components/resources/items/SupplyItem.tsx
interface SupplyItemProps {
  key: string;
  name: string;
  status: {
    criticalLow: number;
    lowStock: number;
    normal: number;
  };
  onClick: () => void;
}

export const SupplyItem: React.FC<SupplyItemProps> = ({
  name,
  status,
  onClick
}) => {
  const getCriticalityLevel = () => {
    if (status.criticalLow > 0) return 'critical';
    if (status.lowStock > 0) return 'warning';
    return 'normal';
  };
  
  const criticality = getCriticalityLevel();
  const total = status.criticalLow + status.lowStock + status.normal;
  
  return (
    <div 
      className="flex items-center justify-between p-2 bg-gray-700/50 rounded-md hover:bg-gray-700 cursor-pointer"
      onClick={onClick}
    >
      <div>
        <p className="text-white text-sm">{name}</p>
        <div className="flex items-center mt-1 space-x-1">
          {status.criticalLow > 0 && (
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
          )}
          {status.lowStock > 0 && (
            <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
          )}
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          
          <span className="text-xs text-gray-300 ml-1">
            {total} unidades
          </span>
        </div>
      </div>
      
      <div className="flex items-center">
        {criticality === 'critical' && (
          <AlertCircle className="h-4 w-4 text-red-400 mr-1" />
        )}
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};