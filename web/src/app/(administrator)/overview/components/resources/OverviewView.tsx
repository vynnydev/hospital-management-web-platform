// components/hospital/views/OverviewView.tsx
import React from 'react';
import { Building2, MapPin } from 'lucide-react';
import { IHospital } from "@/types/hospital-network-types";
import type { IResourcesData, IEmergencyData, IPredictiveData } from '@/types/hospital-advanced-data-types';

interface IOverviewViewProps {
  hospital: IHospital;
  resourcesData?: IResourcesData | null;
  predictiveData?: IPredictiveData | null;
  emergencyData?: IEmergencyData | null;
}

export const OverviewView: React.FC<IOverviewViewProps> = ({
  hospital,
  resourcesData,
  predictiveData,
  emergencyData
}) => {
  const resources = resourcesData?.resources[hospital.id];
  
  return (
    <div className="p-3 space-y-4">
      <div className="flex items-center space-x-3 mb-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Building2 className="h-5 w-5 text-blue-400" />
          </div>
        </div>
        <div>
          <h3 className="font-medium text-white">
            {hospital.name}
          </h3>
          <div className="flex items-center text-sm text-gray-300">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{hospital.unit.city}, {hospital.unit.state}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Ocupação</span>
          <span className={`text-sm font-medium ${
            hospital.metrics.overall.occupancyRate > 80 
              ? 'text-red-400' 
              : hospital.metrics.overall.occupancyRate > 60 
                ? 'text-yellow-400' 
                : 'text-green-400'
          }`}>
            {hospital.metrics.overall.occupancyRate}%
          </span>
        </div>
        
        <div className="w-full bg-gray-700/50 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full ${
              hospital.metrics.overall.occupancyRate > 80 
                ? 'bg-red-400' 
                : hospital.metrics.overall.occupancyRate > 60 
                  ? 'bg-yellow-400' 
                  : 'bg-green-400'
            }`}
            style={{ width: `${hospital.metrics.overall.occupancyRate}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Recursos</span>
          <span className="text-sm font-medium text-blue-400">
            {hospital.metrics.overall.availableBeds}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Equipe Ativa</span>
          <span className="text-sm font-medium text-purple-400">
            {hospital.networkRank?.efficiency || 0}
          </span>
        </div>
      </div>
      
      {/* Quick stats from advanced data */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {resourcesData?.resources[hospital.id] && (
          <div className="bg-blue-900/20 p-2 rounded-md">
            <p className="text-xs text-gray-300">Leitos UTI</p>
            <p className="text-lg font-medium text-blue-300">
              {resourcesData.resources[hospital.id].bedStatus.icu.available}/{resourcesData.resources[hospital.id].bedStatus.icu.total}
            </p>
          </div>
        )}
        
        {emergencyData?.alerts.some(a => a.status === 'active') && (
          <div className="bg-red-900/20 p-2 rounded-md">
            <p className="text-xs text-gray-300">Alertas</p>
            <p className="text-lg font-medium text-red-300">
              {emergencyData.alerts.filter(a => a.status === 'active').length}
            </p>
          </div>
        )}
        
        {predictiveData?.predictions[hospital.id] && (
          <div className="bg-purple-900/20 p-2 rounded-md">
            <p className="text-xs text-gray-300">Previsão 24h</p>
            <p className="text-lg font-medium text-purple-300">
              {predictiveData.predictions[hospital.id].expectedPatientInflow.next24h}
            </p>
          </div>
        )}
        
        {resources?.transferRequests && (
          <div className="bg-green-900/20 p-2 rounded-md">
            <p className="text-xs text-gray-300">Transferências</p>
            <p className="text-lg font-medium text-green-300">
              {resources.transferRequests.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};