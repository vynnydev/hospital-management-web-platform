import React from 'react';
import { X, Ambulance, User, Clock, Calendar, MapPin, Activity } from 'lucide-react';
import { IAmbulance, IAmbulanceRoute } from '@/types/ambulance-types';

interface IAmbulanceDetailsModalProps {
  ambulance: IAmbulance;
  activeRoute?: IAmbulanceRoute;
  onClose: () => void;
}

export const AmbulanceDetailsModal: React.FC<IAmbulanceDetailsModalProps> = ({
  ambulance,
  activeRoute,
  onClose
}) => {
  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  // Definir cor de status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-500';
      case 'dispatched': return 'bg-amber-500';
      case 'returning': return 'bg-blue-500';
      case 'maintenance': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <h2 className="text-xl font-semibold flex items-center">
            <Ambulance className="mr-2" />
            Ambulância {ambulance.vehicleId}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Coluna 1 */}
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 dark:text-white mb-3">Informações Gerais</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">ID:</span>
                    <span className="font-medium">{ambulance.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Placa:</span>
                    <span className="font-medium">{ambulance.plateNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Tipo:</span>
                    <span className="font-medium capitalize">{ambulance.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Capacidade:</span>
                    <span className="font-medium">{ambulance.capacity} paciente(s)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-white text-xs ${getStatusColor(ambulance.status)}`}>
                      {ambulance.status === 'available' ? 'Disponível' :
                       ambulance.status === 'dispatched' ? 'Em atendimento' :
                       ambulance.status === 'returning' ? 'Retornando' : 'Em manutenção'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 dark:text-white mb-3">Manutenção</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">Última manutenção:</span>
                    <span className="ml-auto font-medium">{formatDate(ambulance.lastMaintenance)}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">Próxima manutenção:</span>
                    <span className="ml-auto font-medium">{formatDate(ambulance.nextMaintenanceDue)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Coluna 2 */}
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 dark:text-white mb-3">Equipamentos</h3>
                
                <div className="flex flex-wrap gap-2">
                  {ambulance.equipment.map((item, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs capitalize"
                    >
                      {item.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              
              {ambulance.crew && (
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-3">Equipe</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-300">Motorista:</span>
                      <span className="ml-auto font-medium">ID: {ambulance.crew.driverId}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-300">Paramédico:</span>
                      <span className="ml-auto font-medium">ID: {ambulance.crew.paramedicId}</span>
                    </div>
                    {ambulance.crew.nurseId && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-300">Enfermeiro:</span>
                        <span className="ml-auto font-medium">ID: {ambulance.crew.nurseId}</span>
                      </div>
                    )}
                    {ambulance.crew.doctorId && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-300">Médico:</span>
                        <span className="ml-auto font-medium">ID: {ambulance.crew.doctorId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 dark:text-white mb-3">Localização</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">Coordenadas:</span>
                    <span className="ml-auto font-medium">
                      {ambulance.currentLocation.lat.toFixed(4)}, {ambulance.currentLocation.lng.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rota ativa */}
          {activeRoute && (
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Rota Ativa
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Origem:</span>
                    <p className="font-medium">{activeRoute.origin.name}</p>
                    <p className="text-sm text-gray-500">{activeRoute.origin.address}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Destino:</span>
                    <p className="font-medium">{activeRoute.destination.name}</p>
                    <p className="text-sm text-gray-500">{activeRoute.destination.address}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">Saída:</span>
                    <span className="ml-auto font-medium">
                      {new Date(activeRoute.dispatchTime).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">Chegada estimada:</span>
                    <span className="ml-auto font-medium">
                      {new Date(activeRoute.estimatedArrivalTime).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">Distância:</span>
                    <span className="ml-auto font-medium">{activeRoute.distance.toFixed(1)} km</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">Duração:</span>
                    <span className="ml-auto font-medium">{activeRoute.duration} min</span>
                  </div>
                </div>
              </div>
              
              {activeRoute.patient && (
                <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Paciente</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">{activeRoute.patient.name}</p>
                      <p className="text-sm text-gray-500">{activeRoute.patient.age} anos</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">{activeRoute.patient.condition}</p>
                      <div className="mt-1">
                        <span 
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            activeRoute.patient.emergencyLevel === 'low' ? 'bg-blue-100 text-blue-800' :
                            activeRoute.patient.emergencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            activeRoute.patient.emergencyLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {activeRoute.patient.emergencyLevel === 'low' ? 'Baixa Urgência' :
                           activeRoute.patient.emergencyLevel === 'medium' ? 'Média Urgência' :
                           activeRoute.patient.emergencyLevel === 'high' ? 'Alta Urgência' :
                           'Emergência Crítica'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};