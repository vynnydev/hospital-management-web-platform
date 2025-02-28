import React from 'react';
import { IHospital } from '@/types/hospital-network-types';
import { IAmbulanceData } from '@/types/ambulance-types';
import { Building2, MapPin, AlertCircle, Phone } from 'lucide-react';

interface IAmbulanceSidebarProps {
  hospitals: IHospital[];
  selectedHospital: string | null;
  ambulanceData: IAmbulanceData | null;
  onHospitalSelect: (id: string) => void;
  onCreateRequest: () => void;
}

export const AmbulanceSidebar: React.FC<IAmbulanceSidebarProps> = ({
  hospitals,
  selectedHospital,
  ambulanceData,
  onHospitalSelect,
  onCreateRequest
}) => {
  // Função para obter estatísticas das ambulâncias de um hospital
  const getHospitalStats = (hospitalId: string) => {
    if (!ambulanceData) {
      return {
        total: 0,
        available: 0,
        activeRoutes: 0,
        pendingRequests: 0
      };
    }

    const hospitalAmbulances = ambulanceData.ambulances[hospitalId] || [];
    const hospitalRoutes = ambulanceData.routes[hospitalId] || [];
    const hospitalRequests = ambulanceData.requests[hospitalId] || [];
    
    return {
      total: hospitalAmbulances.length,
      available: hospitalAmbulances.filter(a => a.status === 'available').length,
      activeRoutes: hospitalRoutes.filter(r => r.status === 'in_progress' || r.status === 'planned').length,
      pendingRequests: hospitalRequests.filter(r => r.status === 'pending').length
    };
  };

  return (
    <div className="absolute left-2 top-4 bottom-4 w-72 bg-gray-800/90 backdrop-blur-sm z-20 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Ambulâncias</h2>
      </div>
      
      <div className="flex flex-col h-[calc(100%-4rem)]">
        {/* Lista de Hospitais */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded">
          <div className="p-4 space-y-3">
            {hospitals.map(hospital => {
              const stats = getHospitalStats(hospital.id);
              
              return (
                <div 
                  key={hospital.id}
                  className={`p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    selectedHospital === hospital.id 
                      ? 'bg-blue-500/20 border border-blue-500/50'
                      : 'bg-gray-700/50 hover:bg-gray-700'
                  }`}
                  onClick={() => onHospitalSelect(hospital.id)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="h-10 w-10 bg-gray-600/50 rounded-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{hospital.name}</h3>
                      <div className="flex items-center text-xs text-gray-400">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{hospital.unit.city}, {hospital.unit.state}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Ambulâncias:</span>
                      <span className="text-sm text-blue-400">
                        {stats.available}/{stats.total}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Rotas ativas:</span>
                      <span className="text-sm text-amber-400">{stats.activeRoutes}</span>
                    </div>
                    {stats.pendingRequests > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Solicitações:</span>
                        <div className="flex items-center">
                          <span className="text-sm text-red-400">{stats.pendingRequests}</span>
                          <AlertCircle className="h-4 w-4 text-red-400 ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Botão para nova solicitação */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onCreateRequest}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center"
          >
            <Phone className="h-5 w-5 mr-2" />
            Nova Solicitação
          </button>
        </div>
      </div>
    </div>
  );
};