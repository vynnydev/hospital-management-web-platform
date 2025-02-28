/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useMemo } from 'react';
import { 
  Building2, Users, AlertCircle, BedDouble, 
  MapPin, Loader2, ChevronsUpDown, Stethoscope, Search, 
  Grid
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { CorridorView } from './beds-management-map/CorridorView';
import type { 
  IUseNetworkDataReturn,
  IHospital,
  IBed,
  IDepartment,
  INetworkData
} from '@/types/hospital-network-types';
import { IntegrationsPreviewPressable } from '@/components/ui/organisms/IntegrationsPreviewPressable';
import { ConfigurationAndUserModalMenus } from '@/components/ui/templates/modals/ConfigurationAndUserModalMenus';
import { BedPatientInfoCard } from './BedPatientInfoCard';
import { MaintenanceStatusCards } from './MaintenanceStatusCards';

interface IBedsManagementProps {
  className?: string;
}

export const BedsManagement: React.FC<IBedsManagementProps> = ({ className }) => {
  const { networkData, floors, beds, loading, error, getBedsForFloor } = useNetworkData();
  const [selectedHospital, setSelectedHospital] = useState<IHospital | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedBed, setSelectedBed] = useState<IBed | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string>('1');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultSection, setDefaultSection] = useState<string>('integrations');
  const [isBedsOverviewActive, setIsBedsOverviewActive] = useState<boolean>(false);

  const [selectedRoom, setSelectedRoom] = useState<string>('');

  // Reset selections when hospital changes
  useEffect(() => {
    if (selectedHospital) {
      setSelectedDepartment('');
      setSelectedSpecialty('');
      setSelectedBed(null);
      setIsBedsOverviewActive(false);
    }
  }, [selectedHospital]);

  // Filter hospitals based on search term
  const filteredHospitals = useMemo(() => {
    if (!networkData?.hospitals) return [];
    if (!searchTerm) return networkData.hospitals;

    return networkData.hospitals.filter(hospital  => 
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [networkData?.hospitals, searchTerm]);

  const getBedsForDepartment = (department: string): IBed[] => {
    if (!selectedHospital) return [];
    
    // Filter existing beds
    const existingBeds = beds.filter(bed => 
      bed.hospital === selectedHospital.name &&
      bed.department === department &&
      bed.floor === selectedFloor &&
      (!selectedSpecialty || bed.specialty === selectedSpecialty)
    );

    // Generate array of 12 positions with existing or empty beds
    const allBeds = Array(12).fill(null).map((_, index) => {
      const row = Math.floor(index / 6);
      const position = (index % 6) + 1;
      const bedNumber = `${row + 1}${position.toString().padStart(2, '0')}`;
      
      return existingBeds.find(bed => bed.number === bedNumber) || {
        id: `empty-${department}-${bedNumber}`,
        number: bedNumber,
        department: department,
        floor: selectedFloor,
        specialty: selectedSpecialty || '',
        hospital: selectedHospital.name,
        status: 'available' as const
      };
    });

    return allBeds;
  };

  // Reset do selectedRoom quando mudar departamento ou andar
  useEffect(() => {
    setSelectedRoom('');
  }, [selectedDepartment, selectedFloor]);

  // Loading and error states
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );
  
  if (error) return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="text-red-500 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        {error}
      </div>
    </div>
  );
  
  if (!networkData) return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="text-gray-300 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        No data available
      </div>
    </div>
  );

  const floorOptions = floors.map(f => ({
    label: `${f}º Andar`,
    value: f
  }));

  return (
    <div className={`pt-2 pb-2 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-md shadow-md ${className}`}>
      <div className="flex h-screen bg-gray-900">
        {/* Left Sidebar - Hospital Selection */}
        <div className="w-72 bg-gray-800/50 p-6 rounded-r-3xl shadow-lg backdrop-blur-sm">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-6 w-6 text-blue-500" />
              <h1 className="text-xl font-bold text-gray-100">
                {networkData?.networkInfo?.name}
              </h1>
            </div>
            <div className="text-sm text-gray-400">
              Hospitais
            </div>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar hospital..."
              className="w-full bg-gray-900/50 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-2 border border-gray-700/50"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>

          <div className="space-y-3 pt-2">
            {/* Beds Overview Button */}
            <button
              onClick={() => {
                setSelectedHospital(null);
                setIsBedsOverviewActive(true);
              }}
              className={`w-full p-4 text-left rounded-2xl flex items-center gap-3 transition-all 
                bg-gradient-to-r from-blue-700/90 to-cyan-700/90 
                text-white hover:opacity-90 
                ${isBedsOverviewActive 
                  ? 'shadow-lg border border-blue-500/20' 
                  : ''
                }`}
            >
              <BedDouble className="h-5 w-5" />
              <span className="font-medium">Visão Geral dos Leitos</span>
            </button>

            {filteredHospitals.map((hospital) => (
              <button
                key={hospital.id}
                onClick={() => {
                  setSelectedHospital(hospital);
                  setIsBedsOverviewActive(false);
                }}
                className={`w-full p-4 text-left rounded-2xl flex items-center gap-3 transition-all
                  ${selectedHospital?.id === hospital.id 
                    ? 'bg-blue-600/20 text-blue-100 shadow-lg border border-blue-500/20'
                    : 'text-gray-100 hover:bg-gray-700/50'
                  }`}
              >
                <MapPin className={`h-5 w-5 ${selectedHospital?.id === hospital.id ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className="font-medium">{hospital.name}</span>
              </button>
            ))}
            {filteredHospitals.length === 0 && searchTerm && (
              <div className="text-center py-4 text-gray-500">
                Nenhum hospital encontrado
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {selectedHospital ? (
            <>
              {/* Controls Header */}
              <div className="mb-8 space-y-6">
                {/* Hospital Info */}
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-100">
                    {selectedHospital.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 flex items-center gap-2">
                      <BedDouble className="h-5 w-5" />
                      {selectedHospital.metrics.overall.totalBeds} leitos
                    </span>
                    <span className="text-gray-400 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {selectedHospital.metrics.overall.totalPatients} pacientes
                    </span>
                  </div>
                </div>

                {/* Departments and Floor Selection */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex gap-3">
                    {selectedHospital.departments.map((dept) => (
                      <div key={dept.name} className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDepartment(dept.name)}
                          className={`px-6 py-3 rounded-l-xl transition-all flex items-center gap-2
                            ${selectedDepartment === dept.name
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-gray-800/50 text-gray-100 hover:bg-gray-700'
                            }`}
                        >
                          <Users className="h-4 w-4" />
                          {dept.name}
                        </button>

                        {selectedDepartment === dept.name && (
                          <Select 
                            value={selectedRoom} 
                            onValueChange={setSelectedRoom}
                          >
                            <SelectTrigger 
                              className="w-40 bg-blue-600 text-white border-0 rounded-r-xl h-[46px]"
                            >
                              <div className="flex items-center gap-2">
                                <SelectValue placeholder="Selecionar..." />
                                {selectedRoom && (
                                  <span className="text-xs bg-blue-500/30 px-2 py-1 rounded">
                                    {dept.rooms.find(r => r.roomNumber === selectedRoom)?.type === 'single' ? 'Único' : 
                                    dept.rooms.find(r => r.roomNumber === selectedRoom)?.type === 'double' ? 'Duplo' : 'Enfermaria'}
                                  </span>
                                )}
                              </div>
                              <ChevronsUpDown className="h-4 w-4" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 divide-y divide-gray-700">
                              {dept.rooms
                                .filter(room => room.floor === selectedFloor)
                                .map((room) => (
                                  <SelectItem 
                                    key={room.roomNumber} 
                                    value={room.roomNumber}
                                    className="hover:bg-gray-700"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span className="font-medium">{room.roomNumber}</span>
                                      <span className="text-xs text-gray-400 ml-2">
                                        {room.type === 'single' ? 'Único' : 
                                        room.type === 'double' ? 'Duplo' : 'Enfermaria'}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialties */}
                <div className='flex flex-row space-x-60'>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.specialties.map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => setSelectedSpecialty(specialty)}
                        className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2
                          ${selectedSpecialty === specialty
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-800/50 text-gray-100 hover:bg-gray-700'
                          }`}
                      >
                        <Stethoscope className="h-4 w-4" />
                        {specialty}
                      </button>
                    ))}
                  </div>

                  <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                    <SelectTrigger className="w-40 bg-gray-100 dark:bg-gray-800/50 text-white border-0 rounded-xl">
                      <ChevronsUpDown className="h-4 w-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Select floor" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-100 dark:bg-gray-800 divide-y divide-gray-200">
                      {floorOptions.map((floor) => (
                        <SelectItem 
                          key={floor.value} 
                          value={floor.value}
                          className="hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          {floor.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Beds Grid by Department */}
              <div className="space-y-8 overflow-auto max-h-[calc(100vh-16rem)]">
                {selectedHospital.departments
                  .filter(dept => selectedDepartment === dept.name)
                  .map((dept) => (
                    <div key={dept.name} 
                      className="bg-gray-800/50 p-4 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-200 flex items-center gap-2">
                          <Grid className="h-5 w-5 text-blue-400" />
                          {dept.name}
                        </h3>
                        
                        {selectedRoom && (
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-sm font-medium">
                              Quarto {selectedRoom}
                            </span>
                          </div>
                        )}
                      </div>

                      <CorridorView
                        beds={getBedsForDepartment(dept.name)}
                        onBedSelect={setSelectedBed}
                        selectedBed={selectedBed}
                        departmentName={dept.name}
                      />
                    </div>
                  ))}
              </div>
            </>
          ) : isBedsOverviewActive ? (
            <div className="h-full flex flex-col items-center justify-start text-gray-400 space-y-16 pt-8">
              <MaintenanceStatusCards className="w-full max-w-3xl" />
              
              <div className="text-center">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <p className="text-lg">Selecione um hospital para visualizar os leitos</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-start text-gray-400 space-y-16 pt-8">
              <MaintenanceStatusCards className="w-full max-w-3xl" />
              
              <div className="text-center">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <p className="text-lg">Selecione um hospital para visualizar os leitos</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Patient Information */}
        <div className="w-96 bg-gray-800/50 p-6 rounded-l-3xl shadow-lg backdrop-blur-sm">
          {selectedBed?.patient ? (
            <BedPatientInfoCard selectedBed={selectedBed} />
          ) : (
            <div className="h-full flex items-center justify-center text-center text-gray-400">
              <div>
                <BedDouble className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <p className="text-lg">Selecione uma cama com um paciente para visualizar as informações</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};