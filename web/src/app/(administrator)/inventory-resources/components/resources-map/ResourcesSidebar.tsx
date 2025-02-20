import React from 'react';
import { IHospital } from '@/types/hospital-network-types';
import { IStaffData } from '@/types/staff-types';
import { TResourceCategory, TDepartment } from '../ResourceManagementMap';
import { HospitalResourcesCard } from './HospitalResourcesCard';
import { useResourcesData } from '@/services/hooks/useResourcesData';

interface IResourcesSidebarProps {
  hospitals: IHospital[];
  staffData: IStaffData;
  resourcesData: ReturnType<typeof useResourcesData>;
  selectedHospital: string | null;
  selectedCategory: TResourceCategory;
  selectedDepartment: TDepartment;
  onHospitalSelect: (id: string) => void;
}

export const ResourcesSidebar: React.FC<IResourcesSidebarProps> = ({
  hospitals,
  staffData,
  resourcesData,
  selectedHospital,
  selectedCategory,
  selectedDepartment,
  onHospitalSelect
}) => {
  // Filtra hospitais baseado na categoria e departamento selecionados
  const filteredHospitals = hospitals.filter(hospital => {
    // Filtragem por departamento
    if (selectedDepartment !== 'all') {
      const hasDepartment = hospital.departments.some(dept => 
        dept.name.toLowerCase() === selectedDepartment.toLowerCase()
      );
      if (!hasDepartment) return false;
    }
    
    // Pode adicionar mais filtros aqui conforme necessário
    return true;
  });

  return (
    <div className="absolute left-2 top-16 bottom-2 w-72 bg-gray-800/90 backdrop-blur-sm z-20 rounded-lg overflow-hidden">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-white mb-2">Recursos</h2>
      </div>
      <div className="px-4 pb-4 space-y-3 max-h-[calc(100%-5rem)] overflow-y-auto">
        {filteredHospitals.map(hospital => (
          <HospitalResourcesCard
            key={hospital.id}
            hospital={hospital}
            staffData={staffData?.staffMetrics?.[hospital.id]}
            resources={resourcesData?.resourcesData?.resources[hospital.id]}
            category={selectedCategory}
            isSelected={selectedHospital === hospital.id}
            onSelect={onHospitalSelect}
          />
        ))}
      </div>
    </div>
  );
};