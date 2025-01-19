import React from 'react';
import { NetworkListHospital } from './NetworkListHospital';
import { MapboxHospital } from './map/MapboxHospital';
import { Hospital } from "@/types/hospital-network-types";
import { AppUser } from "@/types/auth-types";

interface HospitalsLocationsProps {
  hospitals: Hospital[];
  currentUser: AppUser | null;
  selectedHospital: string | null;
  setSelectedHospital: React.Dispatch<React.SetStateAction<string | null>>
}

export const HospitalsLocations: React.FC<HospitalsLocationsProps> = ({
  hospitals,
  currentUser,
  selectedHospital,
  setSelectedHospital
}) => {
  // Filtrar hospitais baseado nas permissões do usuário
  const filteredHospitals = currentUser?.permissions.includes('VIEW_ALL_HOSPITALS')
    ? hospitals
    : hospitals.filter(hospital => hospital.id === currentUser?.hospitalId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lista de Hospitais */}
      <div className="lg:col-span-1">
        <NetworkListHospital
          filteredHospitals={filteredHospitals}
          setSelectedHospital={setSelectedHospital}
          currentUser={currentUser}
        />
      </div>

      {/* Mapa */}
      <div className="lg:col-span-2">
        <MapboxHospital
          hospitals={filteredHospitals}
          selectedHospital={selectedHospital}
          setSelectedHospital={setSelectedHospital}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};