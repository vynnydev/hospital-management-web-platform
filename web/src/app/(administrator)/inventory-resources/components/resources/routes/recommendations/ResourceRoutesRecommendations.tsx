import React from 'react';
import { AlertCircle, TrendingUp, Truck, Building } from 'lucide-react';
import { 
  ICriticalShortage,
  IResourceRouteRecommendation, 
  ISupplierRecommendation, 
  TEquipmentType, 
  TSupplyType
} from '@/types/resource-route-analysis-types';
import { IHospital } from '@/types/hospital-network-types';

interface IResourceRoutesRecommendationsProps {
  hospitalId: string;
  hospitals: IHospital[];
  recommendations: {
    transferRecommendations: IResourceRouteRecommendation[];
    supplierRecommendations: ISupplierRecommendation[];
    criticalShortages: ICriticalShortage[];
  };
  onTransferSelect: (sourceId: string, targetId: string) => void;
}

export const ResourceRoutesRecommendations: React.FC<IResourceRoutesRecommendationsProps> = ({
  hospitalId,
  hospitals,
  recommendations,
  onTransferSelect
}) => {
  const hospital = hospitals.find(h => h.id === hospitalId);
  if (!hospital) return null;

  const criticalShortages = recommendations.criticalShortages
    .filter(shortage => shortage.hospitalId === hospitalId);
  
  const transferRecommendations = recommendations.transferRecommendations
    .filter(rec => rec.targetHospitalId === hospitalId || rec.sourceHospitalId === hospitalId);

  const needsAttention = criticalShortages.length > 0 || transferRecommendations.length > 0;

  const getResourceName = (type: TEquipmentType | TSupplyType): string => {
    const equipmentNames: Record<TEquipmentType, string> = {
      respirators: 'Respiradores',
      monitors: 'Monitores',
      defibrillators: 'Desfibriladores',
      imagingDevices: 'Equipamentos de Imagem'
    };

    const supplyNames: Record<TSupplyType, string> = {
      medications: 'Medicamentos',
      bloodBank: 'Banco de Sangue',
      ppe: 'EPIs'
    };

    return equipmentNames[type as TEquipmentType] || supplyNames[type as TSupplyType] || type;
  };

  return (
    <div className="bg-gray-800/90 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Status de Recursos</h3>
        <div className={`h-2 w-2 rounded-full ${needsAttention ? 'bg-red-500' : 'bg-green-500'}`} />
      </div>

      {!needsAttention ? (
        <div className="text-center py-4">
          <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-green-400">Níveis de recursos adequados</p>
          <p className="text-gray-400 text-sm mt-1">
            Nenhuma ação necessária no momento
          </p>
        </div>
      ) : (
        <div className="max-h-[200px] overflow-y-auto">
          <div className="space-y-6 pr-2">
            {/* Recursos Críticos */}
            {criticalShortages.length > 0 && (
              <div>
                <h4 className="text-red-400 text-sm font-medium flex items-center mb-2">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Recursos Críticos
                </h4>
                <div className="space-y-2">
                  {criticalShortages.map((shortage, idx) => (
                    <div key={idx} className="bg-red-900/20 border border-red-900/50 p-2 rounded-lg">
                      <p className="text-red-300 text-sm">
                        {getResourceName(shortage.type)}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-red-400 text-xs">
                          {shortage.category === 'equipment' ? 'Equipamento' : 'Suprimento'}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          shortage.severity === 'critical' 
                            ? 'bg-red-500/20 text-red-300' 
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {shortage.severity === 'critical' ? 'Crítico' : 'Alerta'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transferências Recomendadas */}
            {transferRecommendations.length > 0 && (
              <div>
                <h4 className="text-blue-400 text-sm font-medium flex items-center mb-2">
                  <Truck className="h-4 w-4 mr-1" />
                  Transferências Recomendadas
                </h4>
                <div className="space-y-2">
                  {transferRecommendations.map((transfer, idx) => (
                    <button
                      key={idx}
                      onClick={() => onTransferSelect(transfer.sourceHospitalId, transfer.targetHospitalId)}
                      className="w-full bg-blue-900/20 border border-blue-900/50 p-2 rounded-lg hover:bg-blue-900/30"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-blue-300 text-sm">
                          {getResourceName(transfer.resourceType)}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {Math.round(transfer.distance)}km
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-400 text-xs">
                          {Math.round(transfer.estimatedTime)} min
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          transfer.priority === 'high' 
                            ? 'bg-red-500/20 text-red-300'
                            : transfer.priority === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {transfer.priority === 'high' ? 'Alta' : 
                           transfer.priority === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fornecedores Próximos */}
            {recommendations.supplierRecommendations.length > 0 && (
              <div>
                <h4 className="text-green-400 text-sm font-medium flex items-center mb-2">
                  <Building className="h-4 w-4 mr-1" />
                  Fornecedores Disponíveis
                </h4>
                <div className="space-y-2">
                  {recommendations.supplierRecommendations.map((supplier, idx) => (
                    <div key={idx} className="bg-green-900/20 border border-green-900/50 p-2 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-green-300 text-sm">{supplier.name}</span>
                        <span className="text-gray-400 text-xs">{supplier.availability}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-400 text-xs">
                          {getResourceName(supplier.resourceType)}
                        </span>
                        <span className="text-gray-400 text-xs">
                          R$ {supplier.estimatedPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>  
            )}
          </div>
        </div>
      )}
    </div>
  );
};