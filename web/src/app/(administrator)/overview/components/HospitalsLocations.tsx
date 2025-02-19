import React, { useEffect } from 'react';
import { MapboxHospital } from '../../../../components/ui/templates/map/MapboxHospital';
import { IHospital } from "@/types/hospital-network-types";
import { IAppUser } from "@/types/auth-types";
import { Building2, MapPin } from "lucide-react";

interface IHospitalsLocationsProps {
  hospitals: IHospital[];
  currentUser: IAppUser | null;
  selectedHospital: string | null;
  setSelectedHospital: React.Dispatch<React.SetStateAction<string | null>>
}

// Componente de progresso personalizado
const ProgressIndicator = ({ value }: { value: number }) => {
  const segments = 25;
  const filledSegments = Math.floor((value / 100) * segments);

  return (
    <div className="flex space-x-0.5">
      {[...Array(segments)].map((_, idx) => (
        <div
          key={idx}
          className={`h-2 w-2 rounded-sm transition-all duration-200 
            ${idx < filledSegments 
              ? 'bg-gradient-to-r from-blue-500 to-teal-400' 
              : 'bg-gray-200 dark:bg-gray-600'}`}
        />
      ))}
    </div>
  );
};

// Componente da lista de hospitais otimizado para o layout sobreposto
const HospitalsList = ({ 
  hospitals, 
  selectedHospital, 
  setSelectedHospital 
}: { 
  hospitals: IHospital[],
  selectedHospital: string | null,
  setSelectedHospital: React.Dispatch<React.SetStateAction<string | null>>
}) => {
  return (
    <div className="space-y-3 pb-4 px-3">
      {hospitals.map(hospital => (
        <div
          key={hospital.id}
          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
            selectedHospital === hospital.id
              ? 'bg-blue-500/20 border border-blue-500/50'
              : 'bg-gray-800/50 hover:bg-gray-700/70'
          }`}
          onClick={() => setSelectedHospital(hospital.id)}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="font-medium text-white">
                Hospital {hospital.name}
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
            
            <div className="w-full">
              <ProgressIndicator value={hospital.metrics.overall.occupancyRate} />
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
                {hospital.networkRank?.occupancy || 0}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

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

  // Selecionar o primeiro hospital por padrão
  useEffect(() => {
    if (filteredHospitals.length > 0 && !selectedHospital) {
      setSelectedHospital(filteredHospitals[0].id);
    }
  }, [filteredHospitals, selectedHospital, setSelectedHospital]);

  return (
    <div className="relative w-full h-[calc(100vh-9rem)] bg-gray-900 dark:bg-gray-900 rounded-xl overflow-hidden">
      {/* Lista de Hospitais - Sobreposta ao mapa */}
      <div className="absolute left-4 top-4 bottom-4 w-80 bg-gray-800/80 backdrop-blur-sm z-20 rounded-lg overflow-hidden">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Hospitais da Rede</h2>
        </div>
        <div className="max-h-[calc(100%-5rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
          <HospitalsList 
            hospitals={filteredHospitals}
            selectedHospital={selectedHospital}
            setSelectedHospital={setSelectedHospital}
          />
        </div>
      </div>

      {/* Mapa - Ocupa todo o espaço */}
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