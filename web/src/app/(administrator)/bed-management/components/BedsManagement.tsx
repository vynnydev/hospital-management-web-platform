import React, { useEffect, useState, useMemo } from 'react';
import { 
  Building2, Users, AlertCircle, BedDouble, 
  MapPin, Loader2, ChevronsUpDown, Stethoscope, Search, 
  Grid, Ambulance, Brain, Layout, DoorOpen, Filter,
  LayoutGrid, List, X, Droplets, Trash
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
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
import { HygienizationStatusCards } from './HygienizationStatusCards';
import { Input } from '@/components/ui/organisms/input';
import { Badge } from '@/components/ui/organisms/badge';
import { Button } from '@/components/ui/organisms/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/organisms/dropdown-menu';
import { CorridorView } from './beds-management-map/CorridorView';
import { RoomManagement } from '@/components/ui/templates/RoomManagement';
import { AmbulanceIntegration } from '@/components/ui/templates/AmbulanceIntegration';
import { AIBedAnalysis } from '@/components/ui/templates/ai/beds-management/AIBedAnalysis';

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
  const [activeView, setActiveView] = useState<'corridor' | 'rooms' | 'ambulance' | 'ai'>('corridor');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'occupied' | 'available' | 'hygienization'>('all');

  // Reset selections when hospital changes
  useEffect(() => {
    if (selectedHospital) {
      setSelectedDepartment('');
      setSelectedSpecialty('');
      setSelectedBed(null);
      setIsBedsOverviewActive(false);
      setActiveView('corridor');
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

  // Filter beds by department, floor, specialty, and status
  const filteredBeds = useMemo(() => {
    if (!selectedHospital) return [];
    
    let filtered = beds.filter(bed => 
      bed.hospital === selectedHospital.name &&
      (selectedDepartment ? bed.department === selectedDepartment : true) &&
      (selectedFloor ? bed.floor === selectedFloor : true) &&
      (selectedSpecialty ? bed.specialty === selectedSpecialty : true) &&
      (selectedRoom ? (bed.number.startsWith(selectedRoom) || bed.number.includes(selectedRoom)) : true)
    );
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(bed => bed.status === filterStatus);
    }
    
    return filtered;
  }, [
    beds, 
    selectedHospital, 
    selectedDepartment, 
    selectedFloor, 
    selectedSpecialty, 
    selectedRoom,
    filterStatus
  ]);

  const getBedsForDepartment = (department: string): IBed[] => {
    if (!selectedHospital) return [];
    
    // Filter existing beds
    const existingBeds = filteredBeds.filter(bed => 
      bed.department === department &&
      bed.floor === selectedFloor
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

  // Reset selected room when changing department or floor
  useEffect(() => {
    setSelectedRoom('');
  }, [selectedDepartment, selectedFloor]);
  
  // Calculate occupancy metrics for selected department
  const getDepartmentMetrics = () => {
    if (!selectedHospital || !selectedDepartment) return null;
    
    const departmentBeds = beds.filter(bed => 
      bed.hospital === selectedHospital.name && 
      bed.department === selectedDepartment
    );
    
    const totalBeds = departmentBeds.length;
    const occupiedBeds = departmentBeds.filter(bed => bed.status === 'occupied').length;
    const maintenanceBeds = departmentBeds.filter(bed => bed.status === 'hygienization').length;
    const availableBeds = totalBeds - occupiedBeds - maintenanceBeds;
    
    return {
      totalBeds,
      occupiedBeds,
      maintenanceBeds,
      availableBeds,
      occupancyRate: totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0
    };
  };
  
  // Get metric color based on value
  const getMetricColor = (value: number, type: 'occupancy' | 'available') => {
    if (type === 'occupancy') {
      if (value > 90) return 'text-red-500';
      if (value > 75) return 'text-amber-500';
      return 'text-green-500';
    } else {
      if (value < 5) return 'text-red-500';
      if (value < 10) return 'text-amber-500';
      return 'text-green-500';
    }
  };

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
  
  const departmentMetrics = getDepartmentMetrics();

  return (
    <div className={`pt-2 pb-2 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-md shadow-md ${className}`}>
      <div className="flex h-screen bg-gray-900 overflow-hidden">
        {/* Left Sidebar - Hospital Selection */}
        <div className="w-64 min-w-64 bg-gray-800/50 p-4 rounded-r-3xl shadow-lg backdrop-blur-sm overflow-y-auto">
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
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          {selectedHospital ? (
            <>
              {/* Controls Header */}
              <div className="mb-4 space-y-3 flex-shrink-0">
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
                          onClick={() => {
                            setSelectedDepartment(dept.name);
                            setActiveView('corridor'); // Reset to corridor view when changing department
                          }}
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
                              <SelectItem value="all">Todos os quartos</SelectItem>
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

                {/* Department metrics and specialty filters */}
                <div className='flex flex-row justify-between'>
                  {departmentMetrics && selectedDepartment && (
                    <div className="flex gap-4">
                      <div className="bg-gray-800/50 px-4 py-2 rounded-xl">
                        <div className="text-xs text-gray-400">Ocupação</div>
                        <div className={`text-lg font-semibold ${getMetricColor(departmentMetrics.occupancyRate, 'occupancy')}`}>
                          {departmentMetrics.occupancyRate.toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/50 px-4 py-2 rounded-xl">
                        <div className="text-xs text-gray-400">Leitos Ocupados</div>
                        <div className="text-lg font-semibold text-blue-400">
                          {departmentMetrics.occupiedBeds}/{departmentMetrics.totalBeds}
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/50 px-4 py-2 rounded-xl">
                        <div className="text-xs text-gray-400">Disponíveis</div>
                        <div className={`text-lg font-semibold ${getMetricColor(departmentMetrics.availableBeds, 'available')}`}>
                          {departmentMetrics.availableBeds}
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/50 px-4 py-2 rounded-xl">
                        <div className="text-xs text-gray-400">Em Manutenção</div>
                        <div className="text-lg font-semibold text-amber-400">
                          {departmentMetrics.maintenanceBeds}
                        </div>
                      </div>
                    </div>
                  )}
                
                  <div className="flex items-center gap-2">
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
                
                {/* Specialties and View Controls */}
                <div className="flex flex-col justify-between items-center space-y-4 pt-4">
                  <div className="flex w-8/12 gap-2 space-y-4">
                    <Select 
                      value={filterStatus} 
                      onValueChange={(value) => setFilterStatus(value as 'all' | 'occupied' | 'available' | 'hygienization')}
                    >
                      <SelectTrigger className="bg-gray-800/50 text-gray-100 border-gray-700 rounded-xl">
                        <Filter className="h-4 w-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Filtrar por status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="occupied">Ocupados</SelectItem>
                        <SelectItem value="available">Disponíveis</SelectItem>
                        <SelectItem value="hygienization">Em manutenção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className='flex flex-row space-x-4'>
                    {selectedHospital.specialties.map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => setSelectedSpecialty(specialty === selectedSpecialty ? '' : specialty)}
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

                  {selectedDepartment && (
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-800/30 p-1 rounded-lg flex">
                        <button
                          onClick={() => setActiveView('corridor')}
                          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors
                            ${activeView === 'corridor' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-100'}
                          `}
                        >
                          <LayoutGrid className="h-4 w-4" />
                          Corredor
                        </button>
                        <button
                          onClick={() => setActiveView('rooms')}
                          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors
                            ${activeView === 'rooms' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-100'}
                          `}
                        >
                          <DoorOpen className="h-4 w-4" />
                          Quartos
                        </button>
                        <button
                          onClick={() => setActiveView('ambulance')}
                          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors
                            ${activeView === 'ambulance' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-100'}
                          `}
                        >
                          <Ambulance className="h-4 w-4" />
                          Ambulâncias
                        </button>
                        <button
                          onClick={() => setActiveView('ai')}
                          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors
                            ${activeView === 'ai' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-100'}
                          `}
                        >
                          <Brain className="h-4 w-4" />
                          IA
                        </button>
                      </div>
                      
                      {activeView === 'corridor' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 bg-gray-800/30 text-gray-400 hover:text-gray-100">
                              {viewMode === 'grid' ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border-gray-700">
                            <DropdownMenuItem 
                              onClick={() => setViewMode('grid')} 
                              className={`${viewMode === 'grid' ? 'bg-blue-600/20 text-blue-400' : ''}`}
                            >
                              <LayoutGrid className="h-4 w-4 mr-2" />
                              Visualização em Grade
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setViewMode('list')} 
                              className={`${viewMode === 'list' ? 'bg-blue-600/20 text-blue-400' : ''}`}
                            >
                              <List className="h-4 w-4 mr-2" />
                              Visualização em Lista
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-auto pb-4 pr-1">
                {selectedDepartment ? (
                  <>
                    {/* Componentes de visualização com altura limitada */}
                    <div className="max-h-full overflow-auto">
                      {activeView === 'corridor' && (
                        <div className="bg-gray-800/50 p-3 rounded-2xl shadow-lg border border-gray-700">
                          <CorridorView
                            beds={getBedsForDepartment(selectedDepartment)}
                            onBedSelect={setSelectedBed}
                            selectedBed={selectedBed}
                            departmentName={selectedDepartment}
                            hospitalId={selectedHospital.id}
                            rooms={selectedHospital.departments.find(d => d.name === selectedDepartment)?.rooms || []}
                            selectedRoom={selectedRoom}
                            selectedFloor={selectedFloor}
                          />
                        </div>
                      )}
                      
                      {activeView === 'rooms' && (
                        <div className="bg-gray-800/50 p-3 rounded-2xl shadow-lg border border-gray-700">
                          <RoomManagement
                            hospitalId={selectedHospital.id}
                            selectedDepartment={selectedDepartment}
                            selectedFloor={selectedFloor}
                            selectedRoom={selectedRoom}
                            onRoomSelect={setSelectedRoom}
                          />
                        </div>
                      )}
                      
                      {activeView === 'ambulance' && (
                        <div className="bg-gray-800/50 p-3 rounded-2xl shadow-lg border border-gray-700 overflow-auto max-h-[calc(100vh-200px)]">
                          <AmbulanceIntegration
                            hospitalId={selectedHospital.id}
                            selectedDepartment={selectedDepartment}
                            onBedSelect={setSelectedBed}
                          />
                        </div>
                      )}
                      
                      {activeView === 'ai' && selectedBed && selectedBed.patient ? (
                        <div className="bg-gray-800/50 p-3 rounded-2xl shadow-lg border border-gray-700 overflow-auto max-h-[calc(100vh-200px)]">
                          <AIBedAnalysis 
                            selectedBed={selectedBed}
                            hospitalId={selectedHospital.id}
                          />
                        </div>
                      ) : activeView === 'ai' && (
                        <div className="bg-gray-800/30 rounded-xl p-8 text-center">
                          <Brain className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                          <h3 className="text-xl font-medium text-gray-300 mb-2">
                            Análise Inteligente
                          </h3>
                          <p className="text-gray-500 max-w-md mx-auto mb-6">
                            Selecione um leito com paciente para visualizar a análise de inteligência artificial.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-start text-gray-400 space-y-8 pt-8">
                    <div className="text-center">
                      <Users className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                      <p className="text-lg">Selecione um departamento para visualizar os leitos</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : isBedsOverviewActive ? (
            <div className="h-full flex flex-col items-center justify-start text-gray-400 space-y-8 pt-8 overflow-auto">
              <HygienizationStatusCards className="w-full max-w-3xl" />
              
              <div className="text-center mb-8">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <p className="text-lg">Selecione um hospital para visualizar os leitos</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-start text-gray-400 space-y-8 pt-8 overflow-auto">
              <HygienizationStatusCards className="w-full max-w-3xl" />
              
              <div className="text-center mb-8">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <p className="text-lg">Selecione um hospital para visualizar os leitos</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (com largura fixa e overflow controlado) */}
        <div className="w-80 min-w-80 bg-gray-800/50 p-4 rounded-l-3xl shadow-lg backdrop-blur-sm overflow-y-auto">
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