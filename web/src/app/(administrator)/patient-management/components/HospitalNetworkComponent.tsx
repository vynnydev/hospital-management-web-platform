// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from 'react';
import { Building2, Hospital } from 'lucide-react';
import { DepartmentAreaCards } from './DepartmentAreaCards';
import type { 
  INetworkInfo, 
  IHospital,
  IBed,
  IDepartmentalCapacity,
} from '@/types/hospital-network-types';
import type { IAppUser } from '@/types/auth-types';

interface IDepartment {
  name: string;
  beds: IBed[];
  capacity: IDepartmentalCapacity;
}

interface IDepartmentMetric {
  area: string;
  count: number;
  capacity: number;
  occupancy: number;
}

interface HospitalNetworkComponentProps {
  networkInfo: INetworkInfo | undefined;
  hospitals: IHospital[] | undefined;
  currentUser: IAppUser | null;
  onHospitalSelect: (hospitalId: string) => void;
  onDepartmentSelect: (department: string) => void;
  selectedHospital: string | null;
  selectedDepartment: string | null;
  loading: boolean;
  error: string | null;
}

export const HospitalNetworkComponent: React.FC<HospitalNetworkComponentProps> = ({ 
  networkInfo,
  hospitals,
  currentUser,
  onHospitalSelect,
  onDepartmentSelect,
  selectedHospital,
  selectedDepartment,
  loading,
  error
}) => {
  const [authorizedHospitals, setAuthorizedHospitals] = useState<IHospital[]>([]);
  const [departments, setDepartments] = useState<IDepartmentMetric[]>([]);

  // Função para calcular a ocupação do departamento
  const calculateDepartmentOccupancy = (department: IDepartment): number => {
    const occupiedBeds = department.beds.filter(bed => bed.status === 'occupied').length;
    const totalBeds = department.beds.length;
    return totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
  };

  // Função para contar pacientes no departamento
  const countDepartmentPatients = (department: IDepartment): number => {
    return department.beds.filter(bed => bed.status === 'occupied' && bed.patient).length;
  };

  // Efeito para filtrar hospitais baseado nas permissões do usuário
  useEffect(() => {
    if (!hospitals || !currentUser) return;
    
    const filteredHospitals = currentUser.permissions.includes('VIEW_ALL_HOSPITALS')
      ? hospitals
      : hospitals.filter(hospital => hospital.id === currentUser.hospitalId);
    
    setAuthorizedHospitals(filteredHospitals);
  }, [hospitals, currentUser]);

  // Efeito para atualizar departamentos quando um hospital é selecionado
  useEffect(() => {
    if (selectedHospital && hospitals) {
      const hospital = hospitals.find(h => h.id === selectedHospital);
      if (hospital?.departments) {
        const deptMetrics: IDepartmentMetric[] = hospital.departments.map(dept => ({
          area: dept.name,
          count: countDepartmentPatients(dept),
          capacity: dept.beds.length,
          occupancy: calculateDepartmentOccupancy(dept)
        }));
        setDepartments(deptMetrics);
      }
    }
  }, [selectedHospital, hospitals]);

  if (loading) {
    return (
      <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Função para renderizar os cards de departamento
  const renderDepartmentCards = () => {
    return (
      <div className="w-full bg-gray-50/50 dark:bg-gray-900/50 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <DepartmentAreaCards
            departments={departments}
            onClick={onDepartmentSelect}
            selectedArea={selectedDepartment || ''}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    );
  };

  console.log("Departamentos:", departments)
  return (
    <div className="w-full space-y-6">
      {/* Área dos Departamentos */}
      <div className="w-full bg-gray-50/50 dark:bg-gray-900/50 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          {renderDepartmentCards()}
        </div>
      </div>

      {/* Card Unificado de Hospitais */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header do Card */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {networkInfo?.name || 'Rede Hospitalar'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {authorizedHospitals.length} hospitais
              </p>
            </div>
          </div>
          
          {currentUser?.permissions.includes('VIEW_ALL_HOSPITALS') && (
            <select
              value={selectedHospital || ''}
              onChange={(e) => onHospitalSelect(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 
                       dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 
                       focus:ring-primary focus:border-transparent"
            >
              <option value="">Selecione um hospital</option>
              {authorizedHospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Lista de Hospitais */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {authorizedHospitals.map((hospital) => {
              const isSelected = hospital.id === selectedHospital;
              
              return (
                <button
                  key={hospital.id}
                  onClick={() => onHospitalSelect(hospital.id)}
                  className={`p-4 rounded-xl transition-all duration-300 
                           ${isSelected 
                             ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/50' 
                             : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <div className="flex flex-col items-start space-y-6 p-4">
                    <div className='flex flex-row space-x-4'>
                        <div className={`p-2 rounded-lg ${isSelected 
                            ? 'bg-blue-100 dark:bg-blue-800/50' 
                            : 'bg-gray-200 dark:bg-gray-600/50'}`}
                        >
                            <Hospital className={`h-5 w-5 ${isSelected 
                                ? 'text-blue-500 dark:text-blue-400' 
                                : 'text-gray-500 dark:text-gray-400'}`} />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className={`font-semibold ${isSelected
                                ? 'text-blue-700 dark:text-blue-300'
                                : 'text-gray-700 dark:text-gray-300'}`}>
                                {hospital.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {hospital.unit.city}, {hospital.unit.state}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2 w-full">
                      <div className={`p-2 rounded-lg ${isSelected
                        ? 'bg-blue-100/50 dark:bg-blue-900/30'
                        : 'bg-gray-100 dark:bg-gray-600/30'}`}>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Leitos</p>
                        <p className={`text-sm font-semibold ${isSelected
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300'}`}>
                          {hospital.metrics?.overall?.totalBeds || 0}
                        </p>
                      </div>
                      <div className={`p-2 rounded-lg ${isSelected
                        ? 'bg-blue-100/50 dark:bg-blue-900/30'
                        : 'bg-gray-100 dark:bg-gray-600/30'}`}>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Ocupação</p>
                        <p className={`text-sm font-semibold ${isSelected
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300'}`}>
                          {hospital.metrics?.overall?.occupancyRate?.toFixed(1) || 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
