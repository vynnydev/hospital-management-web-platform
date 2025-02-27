import React from 'react';
import { X, Navigation, Clock } from 'lucide-react';

interface ISupplierRouteInfoProps {
  supplierId: string;
  supplierName?: string;
  distance?: number;
  duration?: number;
  onClose: () => void;
}

export const SupplierRouteInfo: React.FC<ISupplierRouteInfoProps> = ({
  supplierId,
  supplierName = 'Fornecedor',
  distance,
  duration,
  onClose
}) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-white flex items-center">
          <Navigation className="h-4 w-4 mr-2 text-purple-500" />
          Rota para Fornecedor
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="border-t border-gray-700 pt-2">
        <div className="text-sm text-white mb-1">
          {supplierName} <span className="text-gray-400 text-xs">#{supplierId.substring(0, 6)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          {distance !== undefined && (
            <div className="flex items-center text-gray-300 text-xs">
              <Navigation className="h-3 w-3 mr-1 text-purple-400" />
              <span>{distance.toFixed(1)} km</span>
            </div>
          )}
          
          {duration !== undefined && (
            <div className="flex items-center text-gray-300 text-xs">
              <Clock className="h-3 w-3 mr-1 text-purple-400" />
              <span>{duration} min</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-400">
        Clique no marcador do fornecedor para mais opções
      </div>
    </div>
  );
};