import React from 'react';
import { MapPin } from 'lucide-react';
import { Hospital } from '@/types/hospital-network-types';

interface HospitalListProps {
    hospitals: Hospital[];
}

export const HospitalNetworkMap: React.FC<HospitalListProps> = ({ hospitals }) => {
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 shadow-lg p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Rede Hospitalar</h2>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full text-sm">
          {hospitals.length} unidades
        </span>
      </div>
      
      <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
        {/* Placeholder para o mapa - Em produção, usar biblioteca de mapas */}
        <div className="absolute inset-0">
          {hospitals.map((hospital, index) => (
            <div
              key={hospital.id}
              className="absolute cursor-pointer group"
              style={{ left: `${20 + index * 15}%`, top: '40%' }}
            >
              <MapPin
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="currentColor"
              />
              <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-white dark:bg-gray-800 rounded shadow-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{hospital.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{hospital.metrics.occupancyRate.total}% ocupação</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};