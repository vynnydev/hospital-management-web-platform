import React from 'react';
import { 
  Clock, 
  MapPin, 
  Navigation, 
  User, 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Ambulance 
} from 'lucide-react';
import { IAmbulanceRoute, IAmbulance, TRouteStatus, TEmergengyLevel } from '@/types/ambulance-types';

interface IAmbulanceRouteDetailsProps {
  route: IAmbulanceRoute;
  onClose: () => void;
  onUpdateStatus: (routeId: string, status: TRouteStatus) => Promise<void>;
  ambulances: IAmbulance[];
}

// Cores para diferentes níveis de emergência
const emergencyColors: Record<TEmergengyLevel, string> = {
  low: '#60A5FA', // blue-400
  medium: '#FBBF24', // amber-400
  high: '#F59E0B', // amber-500
  critical: '#EF4444' // red-500
};

export const AmbulanceRouteDetails: React.FC<IAmbulanceRouteDetailsProps> = ({
  route,
  onClose,
  onUpdateStatus,
  ambulances
}) => {
  const ambulance = ambulances.find(a => a.id === route.ambulanceId);
  
  // Formatar tempo relativo
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMin = Math.round(diffMs / 60000);
    
    if (diffMin < 0) {
      return `Em ${Math.abs(diffMin)} min`;
    } else if (diffMin === 0) {
      return 'Agora';
    } else if (diffMin < 60) {
      return `Há ${diffMin} min`;
    } else if (diffMin < 1440) {
      const hours = Math.floor(diffMin / 60);
      return `Há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      const days = Math.floor(diffMin / 1440);
      return `Há ${days} ${days === 1 ? 'dia' : 'dias'}`;
    }
  };
  
  // Calcular tempo estimado restante
  const getRemainingTime = () => {
    const now = new Date();
    const arrival = new Date(route.estimatedArrivalTime);
    
    if (now > arrival) {
      return 'Chegada prevista atingida';
    }
    
    const diffMs = arrival.getTime() - now.getTime();
    const diffMin = Math.round(diffMs / 60000);
    
    if (diffMin < 1) {
      return 'Chegada iminente';
    } else if (diffMin === 1) {
      return '1 minuto restante';
    } else {
      return `${diffMin} minutos restantes`;
    }
  };
  
  // Obter nome da emergência baseado no nível
  const getEmergencyLabel = (level: TEmergengyLevel) => {
    switch (level) {
      case 'low': return 'Baixa Urgência';
      case 'medium': return 'Média Urgência';
      case 'high': return 'Alta Urgência';
      case 'critical': return 'Emergência Crítica';
    }
  };
  
  // Obter cor baseada no nível de emergência
  const getEmergencyColor = (level: TEmergengyLevel) => {
    return emergencyColors[level];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Cabeçalho */}
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-between items-center">
        <h3 className="font-semibold flex items-center">
          <Ambulance size={18} className="mr-2" />
          Detalhes da Rota
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Conteúdo */}
      <div className="p-4">
        {/* Informações da ambulância */}
        {ambulance && (
          <div className="flex items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <Ambulance size={18} />
            </div>
            <div className="ml-3">
              <h4 className="font-medium">Ambulância {ambulance.vehicleId}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {ambulance.type.toUpperCase()} - {ambulance.plateNumber}
              </p>
            </div>
          </div>
        )}
        
        {/* Status da rota */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Clock size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Despachada {getRelativeTime(route.dispatchTime)}
              </span>
            </div>
            <div className="text-sm">
              {route.status === 'planned' && (
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Planejada
                </span>
              )}
              {route.status === 'in_progress' && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  Em Progresso
                </span>
              )}
              {route.status === 'completed' && (
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Concluída
                </span>
              )}
              {route.status === 'cancelled' && (
                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                  Cancelada
                </span>
              )}
            </div>
          </div>
          
          {route.status === 'in_progress' && (
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 flex items-center">
              <AlertCircle size={16} className="text-blue-500 mr-2" />
              {getRemainingTime()}
            </div>
          )}
        </div>
        
        {/* Origem e destino */}
        <div className="mb-4">
          <div className="flex items-start mb-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <MapPin size={16} />
              </div>
            </div>
            <div className="ml-3">
              <h5 className="text-sm font-medium">Origem</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">{route.origin.name}</p>
            </div>
          </div>
          
          <div className="w-0.5 bg-gray-200 dark:bg-gray-600 h-6 ml-4"></div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <MapPin size={16} />
              </div>
            </div>
            <div className="ml-3">
              <h5 className="text-sm font-medium">Destino</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">{route.destination.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{route.destination.address}</p>
            </div>
          </div>
        </div>
        
        {/* Informações da rota */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-2">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Navigation size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium">{route.distance.toFixed(1)} km</span>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-2">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Clock size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium">{route.duration} min</span>
            </div>
          </div>
        </div>
        
        {/* Informações do paciente */}
        {route.patient && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <User size={16} className="mr-2" />
              Paciente
            </h4>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">{route.patient.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {route.patient.age} anos
                  </p>
                </div>
                
                <div 
                  className="px-2 py-1 rounded-full text-xs font-medium" 
                  style={{ 
                    backgroundColor: `${getEmergencyColor(route.patient.emergencyLevel)}20`,
                    color: getEmergencyColor(route.patient.emergencyLevel)
                  }}
                >
                  {getEmergencyLabel(route.patient.emergencyLevel)}
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {route.patient.condition}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Notas/observações */}
        {route.notes && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <AlertTriangle size={16} className="mr-2" />
              Observações
            </h4>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {route.notes}
              </p>
            </div>
          </div>
        )}
        
        {/* Ações */}
        {(route.status === 'planned' || route.status === 'in_progress') && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex space-x-2">
            <button
              onClick={() => onUpdateStatus(route.id, 'completed')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm flex items-center justify-center"
            >
              <CheckCircle2 size={16} className="mr-1" />
              Completar
            </button>
            
            <button
              onClick={() => onUpdateStatus(route.id, 'cancelled')}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm flex items-center justify-center"
            >
              <XCircle size={16} className="mr-1" />
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};