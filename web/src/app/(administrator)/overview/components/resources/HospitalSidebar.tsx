// components/hospital/HospitalSidebar.tsx
import React from 'react';
import { IHospital } from "@/types/hospital-network-types";
import { TViewMode } from '../HospitalsLocations';
import { HospitalDetails } from './HospitalDetails';
import { useHospitalAdvancedData } from '@/services/hooks/network-hospital/useHospitalAdvancedData';
import { HospitalListItem } from './HospitalListItem';

interface IHospitalSidebarProps {
  hospitals: IHospital[];
  selectedHospital: string | null;
  setSelectedHospital: React.Dispatch<React.SetStateAction<string | null>>;
  viewMode: TViewMode;
  advancedData: ReturnType<typeof useHospitalAdvancedData>;
}

export const HospitalSidebar: React.FC<IHospitalSidebarProps> = ({
  hospitals,
  selectedHospital,
  setSelectedHospital,
  viewMode,
  advancedData
}) => {
  return (
    <div className="absolute left-4 top-4 bottom-4 w-80 bg-gray-800/80 backdrop-blur-sm z-20 rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-700/50">
        <h2 className="text-lg font-semibold text-white">Hospitais da Rede</h2>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
        <div className="space-y-0.5">
          {hospitals.map(hospital => (
            <div
              key={hospital.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedHospital === hospital.id
                  ? 'bg-gray-700/90'
                  : 'bg-gray-800/70 hover:bg-gray-700/50'
              }`}
              onClick={() => setSelectedHospital(hospital.id)}
            >
              {selectedHospital === hospital.id ? (
                <HospitalDetails 
                  hospital={hospital}
                  viewMode={viewMode}
                  advancedData={advancedData}
                />
              ) : (
                <HospitalListItem hospital={hospital} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};