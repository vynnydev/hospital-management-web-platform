// components/hospital/views/TransfersView.tsx
import React from 'react';
import { IHospital } from "@/types/hospital-network-types";
import { IHospitalResources } from '@/types/hospital-advanced-data-types';

interface ITransfersViewProps {
  hospital: IHospital;
  resources?: IHospitalResources;
}

export const TransfersView: React.FC<ITransfersViewProps> = ({ hospital, resources }) => {
  if (!resources?.transferRequests) {
    return (
      <div className="p-3">
        <p className="text-gray-400">Dados de transferência não disponíveis</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <h4 className="text-blue-300 text-sm font-medium">Requisições de Transferência</h4>
      {resources.transferRequests.length > 0 ? (
        resources.transferRequests.map(req => (
          <div key={req.patientId} className="bg-gray-700/50 p-2 rounded-md">
            <div className="flex justify-between mb-1">
              <span className="text-white text-sm">{req.patientId}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                req.severity === 'high' ? 'bg-red-500/30 text-red-200' :
                req.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-200' :
                'bg-green-500/30 text-green-200'
              }`}>
                {req.severity}
              </span>
            </div>
            <p className="text-xs text-gray-300">Especialidade: {req.requiredSpecialty}</p>
            <p className="text-xs text-gray-400">{new Date(req.requestTime).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm">Nenhuma requisição pendente</p>
      )}
      
      <button className="w-full mt-2 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-md text-sm flex items-center justify-center">
        <span>Nova Transferência</span>
      </button>
    </div>
  );
};