import React from 'react';
import { NetworkListHospital } from './NetworkListHospital';
import { MapboxHospital } from '../../../../components/ui/templates/map/MapboxHospital';
import { IHospital } from "@/types/hospital-network-types";
import { IAppUser } from "@/types/auth-types";

interface IHospitalsLocationsProps {
  hospitals: IHospital[];
  currentUser: IAppUser | null;
  selectedHospital: string | null;
  setSelectedHospital: React.Dispatch<React.SetStateAction<string | null>>
}

export const HospitalsLocations: React.FC<IHospitalsLocationsProps> = ({
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