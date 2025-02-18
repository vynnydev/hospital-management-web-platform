import React, { useEffect, useState } from 'react';

// Tipos
import { Calendar, Building2, Package2, Users, ChevronDown } from 'lucide-react';
import type { 
  INetworkData, 
  IHospital, 
} from '@/types/hospital-network-types';
import type {
  IStaffData,
  IStaffTeam,
  IDepartmentalStaffMetrics,
  IHospitalStaffMetrics
} from '@/types/staff-types';
import { MapboxHospital } from '@/components/ui/templates/map/MapboxHospital';
import { useNetworkData } from '@/services/hooks/useNetworkData';

// Tipagem para as categorias de recursos
interface IResourceCategory {
  id: 'all' | 'equipment' | 'supplies' | 'staff';
  name: string;
}

// Tipagem para os departamentos
interface IDepartment {
  id: 'all' | 'uti' | 'enfermaria' | 'centro_cirurgico';
  name: string;
}

type TResourceCategory = 'all' | 'equipment' | 'supplies' | 'staff';
type TDepartment = 'all' | 'uti' | 'enfermaria' | 'centro_cirurgico';

// Props do componente principal
interface IResourceManagementMapProps {
  networkData: INetworkData;
  staffData: IStaffData;
}

interface IHospitalMetrics {
    overall: {
      occupancyRate: number;
      availableBeds: number;
    };
}

interface IDepartmentalMetrics {
    onDuty: number;
}

// Interface para métricas do staff
interface IStaffMetricsData {
    departmental: Record<string, IDepartmentalMetrics>;
}
  
// Props do componente  
interface IHospitalStatisticsProps {
    hospital: IHospital; // Usando a interface IHospital existente
    staffMetrics?: IStaffMetricsData;
    onSelect: (id: string) => void;
    isSelected: boolean;
}

// Componente de estatísticas do hospital
const HospitalStatistics: React.FC<IHospitalStatisticsProps> = ({
    hospital,
    staffMetrics,
    onSelect,
    isSelected
  }) => (
    <div 
      className={`mb-4 p-3 bg-white dark:bg-gray-600 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500 ${
        isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
      }`}
      onClick={() => onSelect(hospital.id)}
    >
      <h4 className="font-medium text-gray-800 dark:text-gray-200">{hospital.name}</h4>
      <div className="mt-2 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Ocupação</span>
          <span className="text-blue-600 dark:text-blue-300">{hospital.metrics.overall.occupancyRate}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Recursos</span>
          <span className="text-green-600 dark:text-green-300">{hospital.metrics.overall.availableBeds}</span>
        </div>
        {staffMetrics && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Equipe Ativa</span>
            <span className="text-purple-600 dark:text-purple-300">
              {Object.values(staffMetrics.departmental).reduce((acc, dept) => {
                return acc + (dept?.onDuty || 0);
              }, 0)}
            </span>
          </div>
        )}
      </div>
    </div>
);

// Componente principal
export const ResourceManagementMap: React.FC<IResourceManagementMapProps> = ({ 
  networkData, 
  staffData 
}) => {
    const { currentUser } = useNetworkData()
    
    const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<TResourceCategory>('all');
    const [selectedYear, setSelectedYear] = useState('2024');
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    const handleHospitalSelect = (id: string) => {
        setSelectedHospital(id);
    };

    const categories: IResourceCategory[] = [
        { id: 'all', name: 'Todos Recursos' },
        { id: 'equipment', name: 'Equipamentos' },
        { id: 'supplies', name: 'Suprimentos' },
        { id: 'staff', name: 'Equipes' }
    ];

    const departments: IDepartment[] = [
        { id: 'all', name: 'Todos Departamentos' },
        { id: 'uti', name: 'UTI' },
        { id: 'enfermaria', name: 'Enfermaria' },
        { id: 'centro_cirurgico', name: 'Centro Cirúrgico' }
    ];

    const years: string[] = ['2024', '2023', '2022'];

    useEffect(() => {
        if (networkData?.hospitals?.length && !selectedHospital) {
          setSelectedHospital(networkData.hospitals[0].id);
        }
    }, [networkData?.hospitals, selectedHospital]);

    return (
        <div className="relative w-full h-screen bg-gray-900 dark:bg-gray-950 rounded-xl overflow-hidden">
          {/* Filters Bar - Moved closer to top */}
          <div className="absolute top-2 left-2 right-2 z-20 flex space-x-2">
            {/* Hospital Selector */}
            <div className="flex-1">
              <div className="flex items-center bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-700/90">
                <Building2 className="h-5 w-5 text-blue-400 mr-2" />
                <select 
                  className="w-full bg-transparent text-white appearance-none focus:outline-none cursor-pointer"
                  value={selectedHospital ?? ''}
                  onChange={(e) => setSelectedHospital(e.target.value || null)}
                >
                  {networkData?.hospitals?.map(hospital => (
                    <option key={hospital.id} value={hospital.id} className="text-gray-900">
                      {hospital.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
    
            {/* Resource Type Selector */}
            <div className="flex-1">
              <div className="flex items-center bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-700/90">
                <Package2 className="h-5 w-5 text-green-400 mr-2" />
                <select 
                  className="w-full bg-transparent text-white appearance-none focus:outline-none cursor-pointer"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as TResourceCategory)}
                >
                  <option value="all" className="text-gray-900">Todos Recursos</option>
                  <option value="equipment" className="text-gray-900">Equipamentos</option>
                  <option value="supplies" className="text-gray-900">Suprimentos</option>
                  <option value="staff" className="text-gray-900">Equipes</option>
                </select>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
    
            {/* Department Selector */}
            <div className="flex-1">
              <div className="flex items-center bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-700/90">
                <Users className="h-5 w-5 text-purple-400 mr-2" />
                <select 
                  className="w-full bg-transparent text-white appearance-none focus:outline-none cursor-pointer"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="all" className="text-gray-900">Todos Departamentos</option>
                  <option value="uti" className="text-gray-900">UTI</option>
                  <option value="enfermaria" className="text-gray-900">Enfermaria</option>
                  <option value="centro_cirurgico" className="text-gray-900">Centro Cirúrgico</option>
                </select>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
    
            {/* Year Selector */}
            <div className="flex-1">
              <div className="flex items-center bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-700/90">
                <Calendar className="h-5 w-5 text-orange-400 mr-2" />
                <select 
                  className="w-full bg-transparent text-white appearance-none focus:outline-none cursor-pointer"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="2024" className="text-gray-900">2024</option>
                  <option value="2023" className="text-gray-900">2023</option>
                  <option value="2022" className="text-gray-900">2022</option>
                </select>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

        {/* Left Sidebar - Statistics */}
        <div className="absolute left-2 top-16 bottom-2 w-72 bg-gray-800/90 backdrop-blur-sm z-20 rounded-lg overflow-hidden">
            <div className="p-4">
                <h2 className="text-lg font-semibold text-white mb-4">Estatísticas</h2>
            </div>
            <div className="px-4 pb-4 space-y-2 max-h-[calc(100%-5rem)] overflow-y-auto">
                {networkData?.hospitals?.map(hospital => (
                <HospitalStatistics
                    key={hospital.id}
                    hospital={hospital}
                    staffMetrics={staffData?.staffMetrics?.[hospital.id]}
                    onSelect={handleHospitalSelect}
                    isSelected={selectedHospital === hospital.id}
                />
                ))}
            </div>
        </div>
    
          {/* Main Map Area */}
          <div className="absolute inset-0 z-10">
            <MapboxHospital 
                hospitals={networkData?.hospitals || []}
                selectedHospital={selectedHospital}
                setSelectedHospital={setSelectedHospital}
                currentUser={currentUser}
            />
        </div>
     </div>
    );
};