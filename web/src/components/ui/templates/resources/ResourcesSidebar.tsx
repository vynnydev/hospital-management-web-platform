// Modificação em components/resources/ResourcesSidebar.tsx
import React from 'react';
import { IHospital } from '@/types/hospital-network-types';
import { IStaffData } from '@/types/staff-types';
import { 
  IResourcesData, 
  TResourceCategory, 
  TDepartment 
} from '@/types/resources-types';
import { HospitalResourcesCard } from './HospitalResourcesCard';
import { HospitalResourceDetails } from '../../../../app/(administrator)/inventory-resources/components/resources/HospitalResourceDetails';
import { IResourceRouteAnalysis } from '@/types/resource-route-analysis-types';

interface IResourcesSidebarProps {
  hospitals: IHospital[];
  staffData: IStaffData;
  resourcesData: IResourcesData | null;
  loading: boolean;
  error: string | null;
  selectedHospital: string | null;
  selectedCategory: TResourceCategory;
  selectedDepartment: TDepartment;
  resourceRouteAnalysis: IResourceRouteAnalysis;  // Adicionado
  onHospitalSelect: (id: string) => void;
  onTransferResourceClick: (resourceType: string, category: 'equipment' | 'supplies', hospitalId: string) => void;
}

export const ResourcesSidebar: React.FC<IResourcesSidebarProps> = ({
  hospitals,
  staffData,
  resourcesData,
  loading,
  error,
  selectedHospital,
  selectedCategory,
  selectedDepartment,
  onHospitalSelect,
  onTransferResourceClick
}) => {
  return (
    <div className="absolute left-2 top-16 bottom-2 w-72 bg-gray-800/90 backdrop-blur-sm z-20 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Recursos</h2>
      </div>
      
      <div className="flex flex-col h-[calc(100%-4rem)]">
        {/* Lista de Hospitais - Primeira área com scroll */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded smooth-scroll">
          <div className="p-4 space-y-3">
            {hospitals.map(hospital => (
              <HospitalResourcesCard
                key={hospital.id}
                hospital={hospital}
                staffData={staffData?.staffMetrics?.[hospital.id]}
                resources={resourcesData?.resources[hospital.id]}
                category={selectedCategory}
                isSelected={selectedHospital === hospital.id}
                onSelect={onHospitalSelect}
              />
            ))}
          </div>
        </div>

        {/* Detalhes do Hospital Selecionado - Segunda área com scroll */}
        {selectedHospital && (
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded smooth-scroll">
            <HospitalResourceDetails 
              hospital={hospitals.find(h => h.id === selectedHospital)!}
              resources={resourcesData?.resources[selectedHospital] || null}
              loading={loading}
              error={error}
              selectedDepartment={selectedDepartment}
              onTransferClick={(resourceType, category) => 
                onTransferResourceClick(resourceType, category, selectedHospital)
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};