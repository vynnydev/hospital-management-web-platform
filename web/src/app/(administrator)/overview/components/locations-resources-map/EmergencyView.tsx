// components/hospital/views/EmergencyView.tsx
import React from 'react';
import { MapPin } from 'lucide-react';
import { IHospital } from "@/types/hospital-network-types";
import { IEmergencyData } from '@/types/hospital-advanced-data-types';

interface IEmergencyViewProps {
  hospital: IHospital;
  emergencyData?: IEmergencyData | null;
}

export const EmergencyView: React.FC<IEmergencyViewProps> = ({ hospital, emergencyData }) => {
  if (!emergencyData) {
    return (
      <div className="p-3">
        <p className="text-gray-400">Dados de emergência não disponíveis</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-red-300 text-sm font-medium">Alertas Ativos</h4>
          <span className="bg-red-500/30 text-red-200 text-xs px-2 py-0.5 rounded-full">
            {emergencyData.alerts.filter(a => a.status === 'active').length}
          </span>
        </div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {emergencyData.alerts.map(alert => (
            <div key={alert.id} className={`p-2 rounded-md ${
              alert.status === 'active' ? 'bg-red-900/30 border border-red-500/30' : 'bg-gray-700/50'
            }`}>
              <div className="flex justify-between mb-1">
                <span className="text-white text-sm capitalize">{alert.type.replace('_', ' ')}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  alert.severity === 'high' ? 'bg-red-500/30 text-red-200' :
                  alert.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-200' :
                  'bg-green-500/30 text-green-200'
                }`}>
                  {alert.severity}
                </span>
              </div>
              <p className="text-xs text-gray-300 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {alert.location.address}
              </p>
              <div className="flex justify-between mt-1 text-xs">
                <span className="text-gray-400">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                <span className="text-orange-300">{alert.estimatedVictims} vítimas est.</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-blue-300 text-sm font-medium mb-2">Recursos de Emergência</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-700/50 p-2 rounded-md text-center">
            <p className="text-xs text-gray-300">Ambulâncias</p>
            <p className="text-white font-medium">{emergencyData.resourceDeployment.availableAmbulances}</p>
          </div>
          <div className="bg-gray-700/50 p-2 rounded-md text-center">
            <p className="text-xs text-gray-300">Helicópteros</p>
            <p className="text-white font-medium">{emergencyData.resourceDeployment.availableHelicopters}</p>
          </div>
          <div className="bg-gray-700/50 p-2 rounded-md text-center">
            <p className="text-xs text-gray-300">Equipes</p>
            <p className="text-white font-medium">{emergencyData.resourceDeployment.responderTeams}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-green-300 text-sm font-medium mb-2">Tempo Estimado de Resposta</h4>
        {hospital.id in emergencyData.resourceDeployment.estimatedResponseTimes ? (
          <div className="bg-gray-700/50 p-3 rounded-md flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {emergencyData.resourceDeployment.estimatedResponseTimes[hospital.id]}
            </span>
            <span className="text-sm text-gray-300 ml-2">minutos</span>
          </div>
        ) : (
          <p className="text-gray-400 text-center">Não disponível</p>
        )}
      </div>
    </div>
  );
};