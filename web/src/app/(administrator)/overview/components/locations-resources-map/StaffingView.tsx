// components/hospital/views/StaffingView.tsx
import React from 'react';
import { IHospital } from "@/types/hospital-network-types";
import { IPredictiveData, IResourcesData } from '@/types/hospital-advanced-data-types';

interface IStaffingViewProps {
  hospital: IHospital;
  predictiveData?: IPredictiveData | null;
  resourcesData?: IResourcesData | null;
}

export const StaffingView: React.FC<IStaffingViewProps> = ({
  hospital,
  predictiveData,
  resourcesData
}) => {
  const bottlenecks = predictiveData?.networkAnalysis.bottlenecks.filter(
    b => b.hospital === hospital.id
  );
  
  const staffReallocations = predictiveData?.networkAnalysis.optimalResourceDistribution.staffReallocation.filter(
    r => r.from === hospital.id || r.to === hospital.id
  );
  
  return (
    <div className="p-3 space-y-4">
      <div>
        <h4 className="text-purple-300 text-sm font-medium mb-2">Alocação de Pessoal</h4>
        {staffReallocations && staffReallocations.length > 0 ? (
          <div className="space-y-2">
            {staffReallocations.map((reallocation, index) => (
              <div key={index} className="bg-gray-700/50 p-2 rounded-md">
                <div className="flex items-center">
                  <div className={`flex-1 text-sm ${reallocation.from === hospital.id ? 'text-red-300' : 'text-green-300'}`}>
                    {reallocation.from === hospital.id ? 'Saída' : 'Entrada'}
                  </div>
                  <div className="flex-1 text-right text-white font-medium">
                    {reallocation.count} profissionais
                  </div>
                </div>
                <p className="text-xs text-gray-300 mt-1 capitalize">
                  Especialidade: {reallocation.specialty?.replace('_', ' ')}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {reallocation.from === hospital.id 
                    ? `Para: Hospital ${reallocation.to.slice(reallocation.to.lastIndexOf('-') + 1)}`
                    : `De: Hospital ${reallocation.from.slice(reallocation.from.lastIndexOf('-') + 1)}`
                  }
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Nenhuma realocação necessária</p>
        )}
      </div>
      
      {bottlenecks && bottlenecks.length > 0 && (
        <div>
          <h4 className="text-red-300 text-sm font-medium mb-2">Gargalos Identificados</h4>
          <div className="space-y-2">
            {bottlenecks.map((bottleneck, index) => (
              <div key={index} className="bg-gray-700/50 p-2 rounded-md">
                <div className="flex justify-between">
                  <span className="text-white capitalize">{bottleneck.department.replace('_', ' ')}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    bottleneck.severity === 'high' ? 'bg-red-500/30 text-red-200' :
                    bottleneck.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-200' :
                    'bg-green-500/30 text-green-200'
                  }`}>
                    {bottleneck.severity}
                  </span>
                </div>
                <p className="text-sm text-red-300 mt-1 capitalize">
                  {bottleneck.issue.replace('_', ' ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {hospital.id in (resourcesData?.resources || {}) && (
        <div>
          <h4 className="text-blue-300 text-sm font-medium mb-2">Status da Equipe</h4>
          <button className="w-full mt-2 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-md text-sm flex items-center justify-center">
            <span>Ver Escala Completa</span>
          </button>
        </div>
      )}
    </div>
  );
};