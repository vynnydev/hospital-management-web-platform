/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { DepartmentAreaCardsWithDifferentUI } from './DepartmentAreaCardsWithDifferentUI';
import type { 
  INetworkInfo, 
  IHospital,
  IBed,
  IDepartmentalCapacity,
} from '@/types/hospital-network-types';
import type { IAppUser } from '@/types/auth-types';
import { HospitalNetworkListSlider } from '@/components/ui/templates/HospitalNetworkListSlider';
import { calculateDepartmentCapacity, calculateDepartmentOccupancy, countDepartmentPatients } from '@/utils/calculateDepartment';

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

interface HospitalNetworkComponentWithDifferenteUIProps {
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

export const HospitalNetworkComponentWithDifferenteUI: React.FC<HospitalNetworkComponentWithDifferenteUIProps> = ({ 
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
          capacity: calculateDepartmentCapacity(dept),
          occupancy: calculateDepartmentOccupancy(dept)
        }));
        setDepartments(deptMetrics);
      }
    }
  }, [selectedHospital, hospitals, countDepartmentPatients, calculateDepartmentOccupancy]);

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

  console.log("Departamentos:", departments)
  return (
    <div className="w-full space-y-6">
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
        <HospitalNetworkListSlider 
          hospitals={authorizedHospitals}
          selectedHospital={selectedHospital}
          onHospitalSelect={(hospitalId) => {
            onHospitalSelect(hospitalId);
          }}
        />
      </div>
    </div>
  );
};
