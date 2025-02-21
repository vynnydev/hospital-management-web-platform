// components/resources/items/ResourceItem.tsx
import React from 'react';
import { AlertCircle, ArrowDownRight, ArrowUpRight, ChevronRight } from 'lucide-react';

interface ResourceItemProps {
  key: string;
  name: string;
  available: number;
  total: number;
  criticality: 'critical' | 'warning' | 'normal';
  trend: 'up' | 'down' | 'stable';
  onClick: () => void;
}

export const ResourceItem: React.FC<ResourceItemProps> = ({
  name,
  available,
  total,
  criticality,
  trend,
  onClick
}) => {
  return (
    <div 
      className="flex items-center justify-between p-2 bg-gray-700/50 rounded-md hover:bg-gray-700 cursor-pointer"
      onClick={onClick}
    >
      <div>
        <p className="text-white text-sm">{name}</p>
        <div className="flex items-center mt-1">
          <span className={`text-xs ${
            criticality === 'critical' ? 'text-red-400' :
            criticality === 'warning' ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            {available}/{total}
          </span>
          
          {trend === 'up' && <ArrowUpRight className="h-3 w-3 text-green-400 ml-1" />}
          {trend === 'down' && <ArrowDownRight className="h-3 w-3 text-red-400 ml-1" />}
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