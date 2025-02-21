import React from 'react';
import { AlertCircle, TrendingUp, Truck, Clock } from 'lucide-react';
import { 
  ICriticalShortage,
  IResourceRouteRecommendation, 
  ISupplierRecommendation, 
  TEquipmentType 
} from '@/types/resource-route-analysis-types';
import { IHospital } from '@/types/hospital-network-types';

interface IResourceRoutesRecommendationsProps {
  hospitalId: string;
  hospitals: IHospital[]; // Adicionada esta prop
  recommendations: {
    transferRecommendations: IResourceRouteRecommendation[];
    supplierRecommendations: ISupplierRecommendation[];
    criticalShortages: ICriticalShortage[];
  };
  onTransferSelect: (sourceId: string, targetId: string) => void;
}

const getResourceRoutesName = (resourceType: TEquipmentType): string => {
  const resourceNames: Record<TEquipmentType, string> = {
    respirators: 'Respiradores',
    monitors: 'Monitores',
    defibrillators: 'Desfibriladores',
    imagingDevices: 'Equipamentos de Imagem'
  };

  return resourceNames[resourceType];
};

export const ResourceRoutesRecommendations: React.FC<IResourceRoutesRecommendationsProps> = ({
  hospitalId,
  hospitals,
  recommendations,
  onTransferSelect
}) => {
  const hospitalShortages = recommendations.criticalShortages
    .filter(shortage => shortage.hospitalId === hospitalId);
  
  const hospitalTransfers = recommendations.transferRecommendations
    .filter(rec => rec.sourceHospitalId === hospitalId || rec.targetHospitalId === hospitalId);

  // Função para buscar nome do hospital
  const getHospitalName = (id: string) => {
    const hospital = hospitals.find(h => h.id === id);
    return hospital?.name || id;
  };

  return (
    <div className="bg-gray-800/90 rounded-lg p-4 space-y-4">
      {/* Alertas de Escassez */}
      {hospitalShortages.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-white font-medium flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            Recursos Críticos em {getHospitalName(hospitalId)}
          </h3>
          <div className="space-y-2">
            {hospitalShortages.map((shortage, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg ${
                  shortage.severity === 'critical' 
                    ? 'bg-red-900/20 border border-red-900/50' 
                    : 'bg-yellow-900/20 border border-yellow-900/50'
                }`}
              >
                <p className={`text-sm ${
                  shortage.severity === 'critical' ? 'text-red-300' : 'text-yellow-300'
                }`}>
                  {getResourceRoutesName(shortage.resourceRouteType)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendações de Transferência */}
      {hospitalTransfers.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-white font-medium flex items-center">
            <Truck className="h-5 w-5 text-blue-400 mr-2" />
            Transferências Recomendadas
          </h3>
          <div className="space-y-2">
            {hospitalTransfers.map((transfer, idx) => (
              <div 
                key={idx}
                className="bg-blue-900/20 border border-blue-900/50 p-3 rounded-lg cursor-pointer hover:bg-blue-900/30"
                onClick={() => onTransferSelect(transfer.sourceHospitalId, transfer.targetHospitalId)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">
                      {getResourceRoutesName(transfer.resourceRouteType as TEquipmentType)}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {transfer.quantity} unidades
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-gray-400">
                      {Math.round(transfer.distance)} km
                    </p>
                    <p className="text-gray-400 mt-1">
                      ~{transfer.estimatedTime} min
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center mt-2 pt-2 border-t border-blue-900/30">
                  <div className="flex items-center text-xs text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    Prioridade: 
                    <span className={`ml-1 ${
                      transfer.priority === 'high' ? 'text-red-400' :
                      transfer.priority === 'medium' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {transfer.priority === 'high' ? 'Alta' :
                       transfer.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Normal */}
      {hospitalShortages.length === 0 && hospitalTransfers.length === 0 && (
        <div className="text-center py-4">
          <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-green-400">Níveis de recursos adequados</p>
          <p className="text-gray-400 text-sm mt-1">
            Nenhuma ação necessária no momento
          </p>
        </div>
      )}
    </div>
  );
};