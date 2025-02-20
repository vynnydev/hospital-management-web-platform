import React, { useState, useEffect } from 'react';
import { IHospital } from "@/types/hospital-network-types";
import { IAppUser } from "@/types/auth-types";
import { MapboxHospital } from '@/components/ui/templates/map/MapboxHospital';
import { useHospitalAdvancedData } from '@/services/hooks/useHospitalAdvancedData';
import { HospitalSidebar } from './locations-resources-map/HospitalSidebar';
import { ViewModeSelector } from './locations-resources-map/ViewModeSelector';


export type TViewMode = 'overview' | 'resources' | 'transfers' | 'emergency' | 'predictions' | 'staffing';

interface IHospitalsLocationsProps {
  hospitals: IHospital[];
  currentUser: IAppUser | null;
  selectedHospital: string | null;
  setSelectedHospital: React.Dispatch<React.SetStateAction<string | null>>;
}

export const HospitalsLocations: React.FC<IHospitalsLocationsProps> = ({
  hospitals,
  currentUser,
  selectedHospital,
  setSelectedHospital
}) => {
  // Estado para controlar o modo de visualização
  const [viewMode, setViewMode] = useState<TViewMode>('overview');
  
  // Carregar dados avançados
  const advancedData = useHospitalAdvancedData();

  // Filtrar hospitais baseado nas permissões do usuário
  const filteredHospitals = currentUser?.permissions.includes('VIEW_ALL_HOSPITALS')
    ? hospitals
    : hospitals.filter(hospital => hospital.id === currentUser?.hospitalId);

  // Selecionar o primeiro hospital por padrão
  useEffect(() => {
    if (filteredHospitals.length > 0 && !selectedHospital) {
      setSelectedHospital(filteredHospitals[0].id);
    }
  }, [filteredHospitals, selectedHospital, setSelectedHospital]);

  return (
    <div className="relative w-full h-[calc(100vh-9rem)] bg-gray-900 dark:bg-gray-900 rounded-xl overflow-hidden">
      {/* Lista de Hospitais */}
      <HospitalSidebar 
        hospitals={filteredHospitals}
        selectedHospital={selectedHospital}
        setSelectedHospital={setSelectedHospital}
        viewMode={viewMode}
        advancedData={advancedData}
      />

      {/* Seletor de Modo de Visualização */}
      <ViewModeSelector viewMode={viewMode} setViewMode={setViewMode} />

      {/* Mapa */}
      <div className="absolute inset-0 w-full h-full z-10">
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